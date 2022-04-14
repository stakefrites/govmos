import { createStore } from "vuex";
import Network from "../utils/Network";
import CosmosDirectory from "../utils/CosmosDirectory";
import { MsgVote } from "cosmjs-types/cosmos/gov/v1beta1/tx";

import _ from "lodash";

const mapAsync = (array, fn) => {
  return Promise.all(array.map(fn));
};

const changePreferredChains = async ({ commit, state }, preferences) => {
  localStorage.setItem("preferredChains", JSON.stringify(preferences));
  commit("setPreferredChains", preferences);
};

const loadPreferredChains = async ({ commit, state }) => {
  const preferredChains = localStorage.getItem("preferredChains");
};

const fetchNetworks = async ({ commit, state }) => {
  const directory = CosmosDirectory();
  let chains = await directory.getChains();
  const networks = state.networks
    .filter((el) => el.enabled !== false)
    .map((data) => {
      const registryData = chains[data.name] || {};
      return { ...registryData, ...data };
    });
  /*   const fullNetworks = await Promise.all(
    networks.map(async (network) => {
      return await Network(network);
    })
  ); */
  const fullNetworks = await mapAsync(networks, async (network) => {
    return await Network(network);
  });
  commit("setNetworks", fullNetworks);
  console.log(fullNetworks);
  commit("setIsNetworksLoaded", true);
  const proposals = await mapAsync(fullNetworks, async (network) => {
    const props = await network.queryClient.tmClient.gov.proposals(0, "", "");
    return { name: network.name, proposals: props.proposals };
  });
  console.log(proposals);
  commit("setProposals", proposals);
  commit("setIsProposalsLoaded", true);
};

export default createStore({
  state: {
    networks: [
      { name: "akash" },
      { name: "chihuahua" },
      { name: "cerberus" },
      //{ name: "osmosis" },
      //{ name: "cosmoshub" },
      //{ name: "lumnetwork" },
      { name: "juno" },
    ],
    proposals: {},
    isNetworksLoaded: false,
    wallet: {
      chainId: "",
      address: false,
      keplr: false,
      signingClient: false,
    },
  },
  getters: {
    getNetworks(state) {
      return state.networks;
    },
    getAddress(state) {
      return state.wallet.address;
    },
    getKeplr(state) {
      return state.wallet.keplr;
    },
    getProposalsByName: (state) => (name) => {
      if (state.proposals[name]) {
        return state.proposals[name].proposals;
      }
    },
    getChainIdByName: (state) => (name) => {
      const network = _.keyBy(state.networks, "name");
      if (network[name].chainId) {
        return network[name].chainId;
      }
    },
    getIsNetworksLoaded(state) {
      return state.isNetworksLoaded;
    },
    getIsProposalsLoaded(state) {
      return state.isProposalsLoaded;
    },
  },
  mutations: {
    setNetworks(state, networks) {
      state.networks = networks;
    },
    setAddress(state, address) {
      state.wallet.address = address;
    },
    setKeplr(state, keplr) {
      state.wallet.keplr = keplr;
    },
    setProposals(state, proposals) {
      state.proposals = _.keyBy(proposals, "name");
    },
    setIsProposalsLoaded(state, isLoaded) {
      state.isProposalsLoaded = isLoaded;
    },
    setIsNetworksLoaded(state, isLoaded) {
      state.isNetworksLoaded = isLoaded;
    },
    setChainId(state, chainId) {
      state.wallet.chainId = chainId;
    },
    setSigningClient(state, signingClient) {
      state.wallet.signingClient = signingClient;
    },
  },
  actions: {
    fetchNetworks,
    async connectKeplr({ commit, state }) {
      await window.keplr.enable(state.wallet.chainId || "cosmoshub-4");
      commit("setKeplr", true);
    },
    async fetchAddress({ commit, state }) {
      const key = await window.keplr.getKey(
        state.wallet.chainId || "cosmoshub-4"
      );

      const { bech32Address } = key;
      if (bech32Address) {
        commit("setAddress", bech32Address);
        commit("setKeplr", true);
      }
    },
    async disconnectKeplr({ commit }) {
      commit("setKeplr", false);
    },
    async changeChainId({ commit, state }, chainId) {
      const networks = _.keyBy(state.networks, "chainId");
      console.log("networks", networks, state.networks);
      if (chainId) {
        commit("setChainId", chainId);
        await window.keplr.enable(chainId);
        commit("setKeplr", true);
        const key = await window.keplr.getKey(chainId);
        const { bech32Address } = key;
        commit("setAddress", bech32Address);
        const offlineSigner = await window.keplr.getOfflineSignerAuto(chainId);
        const signingClient = await networks[chainId].signingClient(
          key,
          offlineSigner
        );
        console.log("signingClient", signingClient);
        commit("setSigningClient", signingClient);
      }
    },
    async castVote({ commit, state }, vote) {
      const msg = MsgVote.fromPartial({
        proposalId: vote.id,
        voter: state.wallet.wallet,
        option: vote.option,
      });
      let gas;
      try {
        gas = await state.wallet.signingClient.simulate(
          state.wallet.address,
          msg
        );
      } catch (error) {
        console.log(error);
        return;
      }
      console.log(gas);
    },
  },
  modules: {},
});

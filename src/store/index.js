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
  commit("setIsNetworksLoaded", true);
  const proposals = await mapAsync(fullNetworks, async (network) => {
    const props = await network.queryClient.tmClient.gov.proposals(0, "", "");
    return { name: network.name, proposals: props.proposals };
  });
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
      { name: "cosmoshub" },
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
      vote: {
        proposalId: "",
        option: 0,
      },
    },
  },
  getters: {
    getNetworks(state) {
      return state.networks;
    },
    getNetworkByName: (state) => (name) => {
      const networks = _.keyBy(state.networks, "name");
      if (networks[name]) {
        return networks[name];
      }
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

      if (chainId) {
        commit("setChainId", chainId);
        await window.keplr.enable(chainId);
        commit("setKeplr", true);
        const key = await window.keplr.getKey(chainId);
        const { bech32Address } = key;
        commit("setAddress", bech32Address);
        const offlineSigner = await window.keplr.getOfflineSignerAuto(chainId);
        const stargateClient = await networks[chainId].signingClient(
          offlineSigner,
          key
        );
        commit("setSigningClient", stargateClient);
      }
    },
    async castVote({ commit, state }, vote) {
      console.log("vote param", vote);
      //const vote = state.wallet.vote;
      const msg = {
        typeUrl: "/cosmos.gov.v1beta1.MsgVote",
        value: {
          proposalId: vote.proposalId.toNumber(),
          voter: state.wallet.address,
          option: vote.option,
        },
      };

      let gas;
      console.log("MSG", msg);
      const client = state.wallet.signingClient;
      const address = state.wallet.address;
      try {
        gas = await client.simulate(address, [msg]);
      } catch (error) {
        console.log(error);
        return;
      }
      client.signAndBroadcast(address, [msg], gas).then(
        (result) => {
          console.log("Successfully broadcasted:", result);
          this.setState({ loading: false, error: null });
        },
        (error) => {
          console.log("Failed to broadcast:", error);
        }
      );
      console.log(gas);
    },
  },
  modules: {},
});

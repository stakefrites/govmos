import { createStore } from "vuex";
import Network from "../utils/Network";
import CosmosDirectory from "../utils/CosmosDirectory";

import _ from "lodash";

const mapAsync = (array, fn) => {
  return Promise.all(array.map(fn));
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
      //{ name: "cosmoshub" },
    ],
    proposals: {},
    isNetworksLoaded: false,
  },
  getters: {
    getNetworks(state) {
      return state.networks;
    },
    getProposalsByName: (state) => (name) => {
      if (state.proposals[name]) {
        return state.proposals[name].proposals;
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
    setProposals(state, proposals) {
      state.proposals = _.keyBy(proposals, "name");
    },
    setIsProposalsLoaded(state, isLoaded) {
      state.isProposalsLoaded = isLoaded;
    },
    setIsNetworksLoaded(state, isLoaded) {
      state.isNetworksLoaded = isLoaded;
    },
  },
  actions: { fetchNetworks },
  modules: {},
});

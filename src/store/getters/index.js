import _ from "lodash";
export default {
  getNetworks(state) {
    return state.networks;
  },
  getIsConfigDone(state) {
    return state.isConfigDone;
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
  getBalancesByName: (state) => (name) => {
    let total = 0;
    for (let wallet of state.portfolio) {
      if (wallet.balances[name]) {
        total += wallet.balances[name].total;
      }
    }
    return total;
  },
  getIsNetworksLoaded(state) {
    return state.isNetworksLoaded;
  },
  getIsProposalsLoaded(state) {
    return state.isProposalsLoaded;
  },
  getIsBalancesLoaded(state) {
    return state.isBalancesLoaded;
  },
};

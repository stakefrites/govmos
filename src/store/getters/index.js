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
  getImageByName: (state) => (name) => {
    return state.images[name];
  },
  getAddress(state) {
    return state.wallet.address;
  },
   getPortfolio(state) {
    return state.portfolio;
  },
  getKeplr(state) {
    return state.wallet.keplr;
  },
  getProposalsByName: (state) => (name) => {
    if (state.proposals[name]) {
      return state.proposals[name].proposals;
    }
  },
  getPriceByName: (state) => (name) => {
    console.log("getting price for", name);
    if (state.prices[name]) {
      console.log("price is", state.prices[name].price);
      return state.prices[name].price;
    }
  },
  getChainIdByName: (state) => (name) => {
    const network = _.keyBy(state.networks, "name");
    if (network[name].chainId) {
      return network[name].chainId;
    }
  },
  getBalancesByName: (state) => (name) => {
    let balances = {
      total: 0,
      rewards: 0,
      staked: 0,
      liquid: 0,
    };
    for (let wallet of state.portfolio) {
      if (wallet.balances[name]) {
        balances.total += wallet.balances[name].total;
        balances.rewards += wallet.balances[name].rewards;
        balances.staked += wallet.balances[name].staked;
        balances.liquid += wallet.balances[name].liquid;
      }
    }
    return balances;
  },
  getIsNetworksLoaded(state) {
    return state.isNetworksLoaded;
  },
  getIsPricesLoaded(state) {
    return state.isPricesLoaded;
  },
  getIsProposalsLoaded(state) {
    return state.isProposalsLoaded;
  },
  getIsBalancesLoaded(state) {
    return state.isBalancesLoaded;
  },
};

import _ from "lodash";
export default {
  getNetworks(state) {
    return state.networks;
  },
  getAvailableNetworks(state) { 
    return state.availableNetworks;
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
    if (state.prices[name]) {
      return state.prices[name].price;
    }
  },
  getChainIdByName: (state) => (name) => {
    const network = _.keyBy(state.networks, "name");
    if (network[name].chainId) {
      return network[name].chainId;
    }
  },
  getTotalValue(state) {
    let totalValue = {
      total: 0,
      wallets: []
    }
    for (let wallet of state.portfolio) {
    let folio = {name: wallet.name, value: 0}
    for (let network of state.networks) {
      const name = network.name;
      if (wallet.balances[name]) {
        let price = 0;
        if (state.prices[name]) { 
          price = state.prices[name].price;
        }
          const value = wallet.balances[name].total * price;
          totalValue.total += value;
          folio.value += value;
        }
    }
    totalValue.wallets.push(folio)
    }
    return totalValue;
  },
  getBalancesByName: (state) => (name) => {
    let balances = {
      total: 0,
      rewards: 0,
      staked: 0,
      liquid: 0,
      value: 0,
    };
    for (let wallet of state.portfolio) {
      if (wallet.balances[name]) {
        const price = state.prices[name].price;
        const value = wallet.balances[name].total * price;
        balances.total += wallet.balances[name].total;;
        balances.rewards += wallet.balances[name].rewards;
        balances.staked += wallet.balances[name].staked;
        balances.liquid += wallet.balances[name].liquid;
        balances.value += value
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

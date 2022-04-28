import _ from "lodash";
export default {
  getSelectedNetworks(state) {
    return state.networks.selected;
  },
  getAvailableNetworks(state) {
    return state.networks.available;
  },
  getAllNetworks(state) {
    return state.networks.all;
  },
  getNetworkByName: (state) => (name) => {
    const networks = _.keyBy(state.networks.selected, "name");
    if (networks[name]) {
      return networks[name];
    }
  },
  getSeedAddresses(state) {
    return state.portfolio.seedAddresses;
  },
  getWallets(state) {
    return state.portfolio.wallets;
  },
  getImageByName: (state) => (name) => {
    return state.networks.images[name];
  },
  getAprByName: (state) => (name) => {
    return state.networks.apr[name];
  },
  getPriceByName: (state) => (name) => {
    if (state.networks.prices[name]) {
      return state.networks.prices[name].prices[state.currency.value];
    }
  },
  getPriceByCurrencyByName: (state) => (name) => {
    if (state.networks.prices[name]) {
      return state.networks.prices[name].prices[state.currency.value];
    }
  },
  getTotalValue(state) {
    let totalValue = {
      total: 0,
      staked: 0,
      rewards: 0,
      liquid: 0,
      wallets: [],
    };
    for (let wallet of state.portfolio.wallets) {
      let folio = {
        name: wallet.name,
        value: 0,
        staked: 0,
        rewards: 0,
        liquid: 0,
      };
      for (let network of state.networks.selected) {
        const name = network.name;
        if (wallet.balances[name]) {
          let price = 0;
          if (state.networks.prices[name]) {
            price = state.networks.prices[name].prices[state.currency.value];
          }
          const value = wallet.balances[name].total * price;
          totalValue.total += value;
          totalValue.staked += wallet.balances[name].staked * price;
          totalValue.rewards += wallet.balances[name].rewards * price;
          totalValue.liquid += wallet.balances[name].liquid * price;
          folio.value += value;
          folio.staked += wallet.balances[name].staked * price;
          folio.rewards += wallet.balances[name].rewards * price;
          folio.liquid += wallet.balances[name].liquid * price;
        }
      }
      totalValue.wallets.push(folio);
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
    for (let wallet of state.portfolio.wallets) {
      if (wallet.balances[name]) {
        const price = state.networks.prices[name].price;
        const value = wallet.balances[name].total * price;
        balances.total += wallet.balances[name].total;
        balances.rewards += wallet.balances[name].rewards;
        balances.staked += wallet.balances[name].staked;
        balances.liquid += wallet.balances[name].liquid;
        balances.value += value;
      }
    }
    return balances;
  },
  getAmountByWalletAndDenom:
    (state) =>
    ({ walletName, denom }) => {
      const walletObj = _.keyBy(state.portfolio.wallets, "name");

      return walletObj[walletName].balances[denom];
    },
  getIsNetworksLoaded(state) {
    return state.loaded.isNetworksLoaded;
  },
  getIsPricesLoaded(state) {
    return state.loaded.isPricesLoaded;
  },
  getIsAprLoaded(state) {
    return state.loaded.isAprLoaded;
  },
  getIsProposalsLoaded(state) {
    return state.loaded.isProposalsLoaded;
  },
  getIsBalancesLoaded(state) {
    return state.loaded.isBalancesLoaded;
  },
  getOnboardingAlert(state) {
    return state.alerts.onboarding;
  },
  getDashboardAlert(state) {
    return state.alerts.dashboard;
  },
  getCurrency(state) {
    return state.currency;
  },
  getCurrencies(state) {
    return state.currencies;
  },
  getBalanceExpireTime(state) {
    return state.loaded.balanceExpireTime;
  },
  getAprExpireTime(state) {
    return state.loaded.aprExpireTime;
  },
  getLastPriceTime(state) {
    return state.loaded.lastPriceTime;
  },
  getSelectedWallet(state) {
    return state.portfolio.selectedWallet;
  },
};

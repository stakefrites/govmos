import _ from "lodash";
import { version } from "../../package.json";

export default {
  setSelectedNetworks(state, networks) {
    state.networks.selected = networks;
  },
  setAvailableNetworks(state, networks) {
    console.log(state.networks.selected, networks);
    const available = networks.filter((net) => {
      return !state.networks.selected.find((net2) => net2.name === net.name);
    });
    state.networks.available = available;
  },
  setAllNetworks(state, networks) {
    state.networks.all = networks;
  },
  addNetwork(state, network) {
    state.networks.selected = _.uniqBy(
      [...state.networks.selected, network],
      "name"
    );
  },
  setSeedAddresses(state, accounts) {
    state.portfolio.seedAddresses = accounts;
  },
  setCurrency(state, currency) {
    state.currency = currency;
  },
  setPrices(state, prices) {
    state.networks.prices = prices;
  },
  setIsPricesLoaded(state, isLoaded) {
    state.loaded.isPricesLoaded = isLoaded;
  },
  setIsAprLoaded(state, isLoaded) {
    state.loaded.isAprLoaded = isLoaded;
  },
  setIsNetworksLoaded(state, isLoaded) {
    state.loaded.isNetworksLoaded = isLoaded;
  },
  setIsCacheLoaded(state, isLoaded) {
    state.loaded.isCacheLoaded = isLoaded;
  },
  setIsBalancesLoaded(state, isLoaded) {
    state.loaded.isBalancesLoaded = isLoaded;
  },
  setIsBalancesLoaded(state, isLoaded) {
    state.loaded.isBalancesLoaded = isLoaded;
  },
  setOnbordingAlert(state, isDisplayed) {
    state.alerts.onboarding = isDisplayed;
  },
  setDashboardAlert(state, isDisplayed) {
    state.alerts.dashboard = isDisplayed;
  },
  setImage(state, { name, image }) {
    state.networks.images[name] = image;
  },
  setApr(state, { name, apr }) {
    state.networks.apr[name] = apr;
  },
  setImages(state, images) {
    state.networks.images = images;
  },
  setPortfolio(state, portfolio) {
    state.portfolio.wallets = portfolio;
  },
  initialiseStore(state) {
    // Check if the ID exists
    const store = JSON.parse(localStorage.getItem("store"));
    if (store) {
      console.log(version);
      // Replace the state object with the stored item
      if (store.version == version) {
        this.replaceState(Object.assign(state, store));
      } else {
        state.version = version;
      }
    }
  },
  setAprExpireTime(state, expireTime) {
    state.loaded.aprExpireTime = expireTime;
  },
  setBalanceExpireTime(state, expireTime) {
    state.loaded.balanceExpireTime = expireTime;
  },
};

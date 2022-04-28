import { createStore } from "vuex";

import getters from "./getters.js";
import mutations from "./mutations.js";
import actions from "./actions.js";

const state = () => {
  return {
    version: "",
    currency: { value: "usd", text: "USD" },
    currencies: [
      { value: "cad", text: "CAD" },
      { value: "usd", text: "USD" },
      { value: "eur", text: "EUR" },
    ],
    networks: {
      enabled: [
        "akash",
        "chihuahua",
        "cerberus",
        "osmosis",
        "cosmoshub",
        "juno",
        "sifchain",
        "stargaze",
        "comdex",
        "crescent",
        "regen",
        "secretnetwork",
        //"terra",
      ],
      available: [],
      selected: [],
      all: [],
      prices: {},
      images: {},
      apr: {},
    },
    loaded: {
      balanceExpireTime: null,
      aprExpireTime: null,
      lastPriceTime: null,
      isBalancesLoaded: false,
      isPricesLoaded: false,
      isNetworksLoaded: false,
      isAprLoaded: false,
    },
    alerts: {
      onboarding: true,
      dashboard: true,
    },
    portfolio: {
      seedAddresses: [],
      wallets: [],
      selectedWallet: "All",
    },
  };
};

const store = createStore({
  state,
  getters,
  mutations,
  actions,
});

// Subscribe to store updates
store.subscribe((mutation, state) => {
  // Store the state object as a JSON string
  localStorage.setItem("store", JSON.stringify(state));
});

export default store;

import { createStore } from "vuex";

import getters from "./getters.js";
import mutations from "./mutations.js";
import actions from "./actions.js";

const state = () => {
  return {
    networks: {
      enabled: [
        "akash",
        "chihuahua",
        "cerberus",
        "osmosis",
        "cosmoshub",
        "juno",
        "sifchain",
      ],
      available: [],
      selected: [],
      all: [],
      prices: {},
      images: {},
    },
    loaded: {
      isBalancesLoaded: false,
      isPricesLoaded: false,
      isNetworksLoaded: false,
    },
    portfolio: {
      seedAddresses: [],
      wallets: [],
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

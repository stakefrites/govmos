import _ from "lodash";
import Backend from "../utils/Backend";
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5001";
const { getAllBalances, getChains, getTokens, getAllPrices, getApr } =
  new Backend(BACKEND_URL);

const fetchApr = async ({ commit, state, dispatch }) => {
  for (let chain of state.networks.selected) {
    let apr = 0;
    try {
      apr = await getApr(chain.name);
      commit("setApr", { name: chain.name, apr });
    } catch (error) {
      console.log(error);
    }
  }
};

const fetchNetworks = async ({ commit, state }, isAll) => {
  const toFetch = isAll
    ? state.networks.enabled.join(",")
    : state.networks.available.map((n) => n.name).join(",");
  const chains = await getChains(toFetch);
  commit(
    isAll ? "setAllNetworks" : "setAvailableNetworks",
    Object.values(chains)
  );
  commit("setIsNetworksLoaded", true);
};

const fetchBalances = async ({ commit, state }) => {
  commit("setIsBalancesLoaded", false);
  const accounts = await getAllBalances(
    state.portfolio.seedAddresses,
    state.networks.selected
  );
  commit("setPortfolio", accounts);
  commit("setIsBalancesLoaded", true);
};

const fetchTokens = async ({ commit, state }) => {
  const tokens = await getTokens();
  commit("setTokens", _.keyBy(tokens, "base"));
};

const fetchPrices = async ({ commit, state }) => {
  const chains = Object.values(state.tokens)
    .filter((t) => t.coingecko_id)
    .map((t) => ({ id: t.coingecko_id, denom: t.base }));
  const prices = await getAllPrices(chains);

  const pricesMapped = prices.map((p) => {
    return {
      denom: p.denom,
      coingecko_id: Object.entries(p.price)[0][0],
      prices: Object.entries(p.price)[0][1],
    };
  });
  const pricesMap = _.keyBy(pricesMapped, "denom");
  commit("setPrices", pricesMap);
  commit("setIsPricesLoaded", true);
};

const saveAccounts = async ({ commit, state }, addresses) => {
  commit("setSeedAddresses", addresses);
};

const saveNetworks = async ({ commit, state, dispatch }, networks) => {
  commit("setSelectedNetworks", networks);
};

const refreshPrices = async ({ commit, dispatch, state }) => {
  dispatch("fetchPrices");
  commit("setLastPriceTime", Date.now());
};
const refreshBalances = async ({ commit, dispatch, state }, reload) => {
  const newExpireTime = Date.now() + 1000 * 60 * 60;
  const expireTime = state.loaded.balanceExpireTime;
  if (
    reload ||
    (expireTime && Date.now() > expireTime) ||
    state.portfolio.wallets.length == 0
  ) {
    await dispatch("fetchBalances", state.networks.selected);
    commit("setIsBalancesLoaded", true);
    commit("setBalanceExpireTime", newExpireTime);
  }
  commit("setIsBalancesLoaded", true);
};

const refreshApr = async ({ commit, dispatch, state }) => {
  const expireTime = state.loaded.aprExpireTime;
  const newExpireTime = Date.now() + 1000 * 60 * 60 * 24;
  if (expireTime) {
    if (Date.now() > expireTime) {
      await dispatch("fetchApr");
      commit("setIsAprLoaded", true);
      commit("setAprExpireTime", newExpireTime);
    } else {
      if (Object.values(state.networks.apr).length == 0) {
        await dispatch("fetchApr");
        commit("setIsAprLoaded", true);
        commit("setAprExpireTime", newExpireTime);
      }
    }
    commit("setIsAprLoaded", true);
  } else {
    await dispatch("fetchApr");
    commit("setIsAprLoaded", true);
    commit("setAprExpireTime", newExpireTime);
  }
};

const removeChain = async ({ commit, dispatch, state }, network) => {
  const filtered = state.networks.selected.filter(
    (network1) => network1.name != network.name
  );
  const availables = [...state.networks.available, network];
  commit("setSelectedNetworks", filtered);
  commit("setAvailableNetworks", availables);
};

const addChain = async ({ commit, dispatch, state }, network) => {
  let availables = state.networks.available.filter(
    (net) => net.name !== network.name
  );
  commit("addNetwork", network);
  commit("setAvailableNetworks", availables);
};

const saveCurrency = async ({ commit, state, dispatch }, currency) => {
  commit("setCurrency", currency);
};

const changeSelectedWallet = async ({ commit, state }, wallet) => {
  commit("setSelectedWallet", wallet);
};
export default {
  refreshApr,
  changeSelectedWallet,
  fetchNetworks,
  fetchTokens,
  fetchApr,
  fetchPrices,
  fetchBalances,
  saveAccounts,
  saveNetworks,
  removeChain,
  addChain,
  saveCurrency,
  refreshPrices,
  refreshBalances,
};

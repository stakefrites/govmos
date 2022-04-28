import _ from "lodash";
import axios from "axios";
import ApyClient from "../utils/ApyClient";
import { getAllBalances, getChains, mapAsync } from "./utils.js";

const fetchApr = async ({ commit, state, dispatch }) => {
  console.log("fetching apr", state.networks.selected);
  for (let chain of state.networks.selected) {
    let apr = 0;
    try {
      const client = ApyClient(chain, chain.rpcUrl, chain.restUrl);
      apr = await client.getApy();
    } catch (error) {
      console.log(error);
    }
    commit("setApr", { name: chain.name, apr });
  }
};

const fetchNetworks = async ({ commit, state }, isAll) => {
  const toFetch = isAll ? state.networks.enabled : state.networks.available;
  const chains = await getChains(toFetch);
  commit(isAll ? "setAllNetworks" : "setAvailableNetworks", chains);
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

const fetchPrices = async ({ commit, state }) => {
  const chains = state.networks.selected;
  const asyncs = await mapAsync(chains, (chain) => {
    const { coinGeckoId } = chain;
    if (coinGeckoId !== undefined) {
      const datarr = axios.get(
        "https://api.coingecko.com/api/v3/simple/price",
        {
          params: {
            ids: coinGeckoId,
            vs_currencies: "usd,cad,eur",
          },
        }
      );
      return datarr;
    }
  });
  const mappedRequest = asyncs.map((price, i) => {
    const configChain = chains[i];
    return {
      price:
        price.status === "fulfilled"
          ? price.value.data[configChain.coinGeckoId].usd
          : 0,
      prices:
        price.status === "fulfilled"
          ? price.value.data[configChain.coinGeckoId]
          : { usd: 0, cad: 0, eur: 0 },
      name: price.status === "fulfilled" ? configChain.name : configChain.name,
    };
  });

  const pricesMap = _.keyBy(mappedRequest, "name");
  commit("setPrices", pricesMap);
  commit("setIsPricesLoaded", true);
  return mappedRequest;
};

const saveAccounts = async ({ commit, state }, addresses) => {
  commit("setSeedAddresses", addresses);
};

const saveNetworks = async ({ commit, state, dispatch }, networks) => {
  commit("setSelectedNetworks", networks);
};

const refreshPrices = async ({ commit, dispatch, state }) => {
  dispatch("fetchPrices");
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
  console.log(
    "APR Refreshing",
    state.loaded.aprExpireTime,
    Object.values(state.networks.apr).length
  );
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

export default {
  refreshApr,
  fetchNetworks,
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

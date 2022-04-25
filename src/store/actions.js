import _ from "lodash";
import axios from "axios";
import Network from "@/utils/Network";
import CosmosDirectory from "@/utils/CosmosDirectory";
import { fromBech32, toBech32 } from "@cosmjs/encoding";
import QueryClient from "../utils/QueryClient";
import ApyClient from "../utils/ApyClient";
import router from "@/router";
import {
  setupStakingExtension,
  QueryClient as CosmjsQueryClient,
  setupBankExtension,
  setupDistributionExtension,
  setupMintExtension,
  setupGovExtension,
} from "@cosmjs/stargate";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";

const stakedReducer = (acc, item) => {
  return acc + parseInt(item.balance.amount);
};

const rewardsReducer = (acc, item) => {
  if (item.reward.length == 0) {
    return 0;
  } else {
    return acc + parseInt(item.reward[0].amount);
  }
};

const makeClient = async (rpc) => {
  const tmClient = await Tendermint34Client.connect(rpc);
  return CosmjsQueryClient.withExtensions(
    tmClient,
    setupStakingExtension,
    setupBankExtension,
    setupDistributionExtension,
    setupMintExtension,
    setupGovExtension
  );
};

const mapAsync = (array, fn) => {
  return Promise.all(array.map(fn));
};

const getAddress = (seed, chain) => {
  const { prefix } = chain;
  const bech = fromBech32(seed);

  return toBech32(prefix, bech.data);
};

const fetchApr = async ({ commit, state, dispatch }) => {
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

const fetchAvailableNetworks = async ({ commit, state, dispatch }) => {
  console.log("fetching available");
  const directory = CosmosDirectory();
  let chains = await directory.getChains();
  const networks = state.available
    .filter((el) => el.enabled !== false)
    .map((data) => {
      const registryData = chains[data.name] || {};
      return { ...registryData, ...data };
    });
  commit("setAvailableNetworks", networks);
};

const fetchSelectedNetworks = async ({ commit, state, dispatch }) => {
  console.log("fetching available");
  const directory = CosmosDirectory();
  let chains = await directory.getChains();
  const networks = state.available
    .filter((el) => el.enabled !== false)
    .map((data) => {
      const registryData = chains[data.name] || {};
      return { ...registryData, ...data };
    });
  commit("setSelectedNetworks", networks);
};

const fetchNetworks = async ({ commit, state, dispatch }) => {
  commit("setIsNetworksLoaded", false);
  const directory = CosmosDirectory();
  let chains = await directory.getChains();
  const networks = state.networks.enabled
    .map((el) => ({ name: el }))
    .filter((el) => el.enabled !== false)
    .map((data) => {
      const registryData = chains[data.name] || {};
      return { ...registryData, ...data };
    });
  const images = {};
  const fullNetworks = await mapAsync(networks, async (network) => {
    images[network.name] = network.image;
    commit("setImage", network);
    return await Network(network);
  });
  commit("setAllNetworks", fullNetworks);
  commit("setIsNetworksLoaded", true);
};
const fetchBalances = async ({ commit, state }) => {
  commit("setIsBalancesLoaded", false);
  let accounts = [];
  for (let account of state.portfolio.seedAddresses) {
    console.log("account", account);
    const address = account.address;
    const wallet = { name: account.name, addresses: [], balances: {} };
    const selected = state.networks.selected;
    for (let network of selected) {
      const { denom, decimals, name, coinGeckoId } = network;

      let chainAddress = getAddress(address, network);
      wallet.addresses.push(chainAddress);
      const client = await makeClient(network.rpcUrl);
      let liquid;
      try {
        liquid = await client.bank.allBalances(chainAddress);
      } catch (error) {
        console.log("Error in all balances", error);
        liquid = { delegationResponses: [] };
      }
      const rewardsReq = await client.distribution.delegationTotalRewards(
        chainAddress
      );

      let staked;
      try {
        staked = await client.staking.delegatorDelegations(chainAddress);
      } catch (error) {
        staked = { delegationResponses: [] };
      }
      const stakingAcc = 0;
      const rewardsAcc = 0;

      const totalTokensStaked =
        staked.delegationResponses.length == 0
          ? 0
          : staked.delegationResponses.reduce(stakedReducer, stakingAcc);

      const totalTokensRewards =
        rewardsReq.rewards.length == 0
          ? 0
          : rewardsReq.rewards.reduce(rewardsReducer, rewardsAcc);

      const liquidBal = liquid.find((val) =>
        val.denom == denom ? true : false
      );
      const rewards = totalTokensRewards / Math.pow(10, decimals + 18);

      const stakedBalance = (
        totalTokensStaked / Math.pow(10, decimals)
      ).toFixed(2);
      const liquidBalance = liquidBal
        ? (parseFloat(liquidBal.amount) / Math.pow(10, decimals)).toFixed(2)
        : 0;
      const total =
        rewards + parseFloat(stakedBalance) + parseFloat(liquidBalance);
      const data = {
        name: name,
        rewards,
        staked: parseFloat(stakedBalance),
        liquid: parseFloat(liquidBalance),
        coingecko_id: coinGeckoId,
        total,
        chainAddress,
      };
      wallet.balances[name] = data;
    }
    accounts.push(wallet);
  }
  commit("setPortfolio", accounts);
  commit("setIsBalancesLoaded", true);
};

const fetchPrices = async ({ commit, state }, chains) => {
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
      price: price.status === 200 ? price.data[configChain.coinGeckoId].usd : 0,
      prices:
        price.status === 200
          ? price.data[configChain.coinGeckoId]
          : { usd: 0, cad: 0, eur: 0 },
      name: price.status === 200 ? configChain.name : configChain.name,
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
  dispatch("fetchPrices", state.networks.selected);
};
const refreshBalances = async ({ commit, dispatch, state }) => {
  const expireTime = localStorage.getItem("balanceExpireTime");
  console.log(expireTime);
  if (expireTime) {
    if (Date.now() > expireTime) {
      await dispatch("fetchBalances", state.networks.selected);
      commit("setIsBalancesLoaded", true);
      localStorage.setItem("balanceExpireTime", Date.now() + 1000 * 60 * 60);
    } else {
      if (state.portfolio.wallets.length == 0) {
        await dispatch("fetchBalances", state.networks.selected);
        commit("setIsBalancesLoaded", true);
        localStorage.setItem("balanceExpireTime", Date.now() + 1000 * 60 * 60);
      }
      commit("setIsBalancesLoaded", true);
    }
  } else {
    await dispatch("fetchBalances", state.networks.selected);
    commit("setIsBalancesLoaded", true);
    localStorage.setItem("balanceExpireTime", Date.now() + 1000 * 60 * 60);
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
  let filtered = JSON.stringify(
    _.uniqBy([...state.networks.selected, network], "name")
  );
  commit("addNetwork", network);
  commit("setAvailableNetworks", availables);
};

const saveCurrency = async ({ commit, state, dispatch }, currency) => {
  commit("setCurrency", currency);
};

export default {
  fetchAvailableNetworks,
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

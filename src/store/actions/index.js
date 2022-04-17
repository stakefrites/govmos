import _ from "lodash";
import axios from "axios";
import Network from "@/utils/Network";
import CosmosDirectory from "@/utils/CosmosDirectory";
import { MsgVote } from "cosmjs-types/cosmos/gov/v1beta1/tx";
import { fromBech32, toBech32 } from "@cosmjs/encoding";

const mapAsync = (array, fn) => {
  return Promise.all(array.map(fn));
};

const fetchNetworks = async ({ commit, state, dispatch }, passedNetworks) => {
  commit("setIsNetworksLoaded", false);
  const directory = CosmosDirectory();
  let chains = await directory.getChains();
  const networks = passedNetworks
    .filter((el) => el.enabled !== false)
    .map((data) => {
      const registryData = chains[data.name] || {};
      return { ...registryData, ...data };
    });

  const fullNetworks = await mapAsync(networks, async (network) => {
    return await Network(network);
  });
  commit("setNetworks", fullNetworks);
  commit("setIsNetworksLoaded", true);
  const proposals = await mapAsync(fullNetworks, async (network) => {
    const props = await network.queryClient.tmClient.gov.proposals(0, "", "");
    return { name: network.name, proposals: props.proposals };
  });
  commit("setProposals", proposals);
  commit("setIsProposalsLoaded", true);

  await dispatch("fetchPrices", fullNetworks);
  let accounts = [];
  for (let account of state.seedAccounts) {
    const wallet = { name: account.name, addresses: [], balances: {} };
    const folio = await fullNetworks[0].queryClient.getBalances(
      account.address,
      fullNetworks
    );
    wallet.balances = _.keyBy(folio, "name");
    console.log("folio", folio);
    for (let network of state.networks) {
      let key = fromBech32(account.address);
      wallet.addresses.push(toBech32(network.prefix, key.data));
    }
    accounts.push(wallet);
  }
  console.log("wallet", accounts);
  commit("setPortfolio", accounts);
  commit("setIsBalancesLoaded", true);
};
const fetchPrices = async ({ commit, state }, chains) => {
  console.log("chains is fecth prices", chains);
  const asyncs = await mapAsync(chains, (chain) => {
    const { coinGeckoId } = chain;
    if (coinGeckoId !== undefined) {
      const datarr = axios.get(
        "https://api.coingecko.com/api/v3/simple/price",
        {
          params: {
            ids: coinGeckoId,
            vs_currencies: "usd",
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
      name: price.status === 200 ? configChain.name : configChain.name,
    };
  });
  console.log("price, map request", mappedRequest);
  commit("setPrices", _.keyBy(mappedRequest, "name"));
  commit("setIsPricesLoaded", true);
  return mappedRequest;
};


const fetchPortfolio = async ({ commit, state, dispatch }) => {
  console.log("fetch folio");
  await dispatch("fetchPreferred");
  await dispatch("fetchAccounts");
  console.log("folio post dispatch", state.seedAccounts.length, state.networks.length);
  if (state.seedAccounts.length == 0 || state.networks.length == 0) {
    commit('setIsConfigDone', false)
  } else {
    commit("setIsConfigDone", true);
  }
};


const fetchPreferred = async ({ commit, state }) => {
  const preferredChains = localStorage.getItem("preferredChains");
  const decoded = JSON.parse(preferredChains);
  console.log("decoded Preferred", decoded);
  if (decoded) {
    console.log("prefered good");
    commit("setNetworks", decoded);
  }
};

const fetchAccounts = async ({ commit, state }) => {
  const seedAccounts = localStorage.getItem("seedAccounts");
  const decoded = JSON.parse(seedAccounts);
  if (decoded) {
    commit("setAccounts", decoded);
  }
};

const connectKeplr = async ({ commit, state }) => {
  await window.keplr.enable(state.wallet.chainId || "cosmoshub-4");
  commit("setKeplr", true);
};

const disconnectKeplr = async ({ commit }) => {
  commit("setKeplr", false);
};

const fetchAddress = async ({ commit, state }) => {
  const key = await window.keplr.getKey(state.wallet.chainId || "cosmoshub-4");

  const { bech32Address } = key;
  if (bech32Address) {
    commit("setAddress", bech32Address);
    commit("setKeplr", true);
  }
};

const changeChainId = async ({ commit, state }, chainId) => {
  const networks = _.keyBy(state.networks, "chainId");

  if (chainId) {
    commit("setChainId", chainId);
    await window.keplr.enable(chainId);
    commit("setKeplr", true);
    const key = await window.keplr.getKey(chainId);
    const { bech32Address } = key;
    commit("setAddress", bech32Address);
    const offlineSigner = await window.keplr.getOfflineSignerAuto(chainId);
    const stargateClient = await networks[chainId].signingClient(
      offlineSigner,
      key
    );
    commit("setSigningClient", stargateClient);
  }
};

const castVote = async ({ commit, state }, vote) => {
  console.log("vote param", vote);
  //const vote = state.wallet.vote;
  const msg = {
    typeUrl: "/cosmos.gov.v1beta1.MsgVote",
    value: {
      proposalId: vote.proposalId.toNumber(),
      voter: state.wallet.address,
      option: vote.option,
    },
  };

  let gas;
  console.log("MSG", msg);
  const client = state.wallet.signingClient;
  const address = state.wallet.address;
  try {
    gas = await client.simulate(address, [msg]);
  } catch (error) {
    console.log(error);
    return;
  }
  client.signAndBroadcast(address, [msg], gas).then(
    (result) => {
      console.log("Successfully broadcasted:", result);
      this.setState({ loading: false, error: null });
    },
    (error) => {
      console.log("Failed to broadcast:", error);
    }
  );
  console.log(gas);
};

const saveAccounts = async ({ commit, state }, accounts) => {
  console.log("in saving account", accounts, state.networks);
  localStorage.setItem("seedAccounts", JSON.stringify(accounts));
  commit("setAccounts", accounts);
};
const saveNetworks = async ({ commit, state }, networks) => {
  console.log("saving net", networks);
  const savedNetworks = networks.map((network) => ({
    name: network,
  }));

  localStorage.setItem("preferredChains", JSON.stringify(savedNetworks));
  commit("setNetworks", savedNetworks);
};



const removeChain = async ({ commit, dispatch, state }, name) => { 
  const filtered = state.networks.filter(network => network.name != name);
  dispatch("saveNetworks", filtered);
}

export default {
  fetchNetworks,
  fetchPrices,
  fetchPortfolio,
  fetchPreferred,
  fetchAccounts,
  connectKeplr,
  disconnectKeplr,
  fetchAddress,
  changeChainId,
  castVote,
  saveAccounts,
  saveNetworks,
  removeChain
};

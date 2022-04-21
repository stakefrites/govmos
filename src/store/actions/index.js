import _ from "lodash";
import axios from "axios";
import Network from "@/utils/Network";
import CosmosDirectory from "@/utils/CosmosDirectory";
import { fromBech32, toBech32 } from "@cosmjs/encoding";
import router from "../../router"



const mapAsync = (array, fn) => {
  return Promise.all(array.map(fn));
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
  localStorage.setItem("availables", JSON.stringify(networks));
  commit("setAvailableNetworks", networks);
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
  const images = {};
  const fullNetworks = await mapAsync(networks, async (network) => {
    images[network.name] = network.image;
    commit("setImage", network)
    return await Network(network);

  });
  localStorage.setItem("networks", JSON.stringify(fullNetworks));
  localStorage.setItem("images", JSON.stringify(images));
  commit("setNetworks", fullNetworks);
  commit("setIsNetworksLoaded", true);
};

const fetchProposals = async ({ commit, state }) => { 
  const proposals = await mapAsync(fullNetworks, async (network) => {
    const props = await network.queryClient.tmClient.gov.proposals(0, "", "");
    return { name: network.name, proposals: props.proposals };
  });
  commit("setProposals", proposals);
  commit("setIsProposalsLoaded", true);
}

const fetchBalances = async ({ commit, state }) => { 
  console.log("fetching balances", state)
  commit("setIsBalancesLoaded", false);
  let accounts = [];
  for (let account of state.seedAccounts) {
    const wallet = { name: account.name, addresses: [], balances: {} };
    const folio = await state.networks[0].queryClient.getBalances(
      account.address,
      state.networks
    );
    wallet.balances = _.keyBy(folio, "name");
    console.log("folio", folio, );
    for (let network of state.networks) {
      let key = fromBech32(account.address);
      wallet.addresses.push(toBech32(network.prefix, key.data));
    }
    accounts.push(wallet);
  }
  localStorage.setItem("balances", JSON.stringify(accounts))
  console.log("wallet", accounts);
  commit("setPortfolio", accounts);
  commit("setIsBalancesLoaded", true);
}


const fetchPrices = async ({ commit, state }, chains) => {
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
  
  
  const pricesMap = _.keyBy(mappedRequest, "name");
  
  let expire = Date.now() + 1000 * 60 * 60 * 24;
  localStorage.setItem("prices", JSON.stringify({expire, prices : pricesMap}))
  commit("setPrices", pricesMap);
  commit("setIsPricesLoaded", true);
  return mappedRequest;
};


const loadCache = async ({ commit, state, dispatch }) => {

  console.log("loading cache -----", Date.now())
  const seedAccounts = JSON.parse(localStorage.getItem("seedAccounts"));
  console.log("loading cache ----- Seed Accounts =>", seedAccounts)
  if (seedAccounts) {
    commit("setSeedAccounts", seedAccounts)
  } else { 
    commit("setIsConfigDone", false);
    router.push("/");
  }
  const networks = JSON.parse(localStorage.getItem("networks"));
  console.log("loading cache ----- Newtworks =>", networks)
  if (networks) {
    await dispatch("fetchNetworks", networks);
    commit("setIsConfigDone", true)
  } else { 
    router.push("/")
    commit("setIsConfigDone", false)
  }
  const prices = JSON.parse(localStorage.getItem("prices"));
  console.log("loading cache ----- Prices =>", prices)
  if (prices && prices.expire > Date.now()) {
    commit("setPrices", prices.prices);
    commit("setIsPricesLoaded", true)
  } else { 
    await dispatch("fetchPrices", state.networks)
  }
  const images = JSON.parse(localStorage.getItem("images"));
  console.log("loading cache ----- Images =>", images)
  if (images) {
    commit("setImages", images);
  }

  const balances = JSON.parse(localStorage.getItem("balances"));
  console.log("loading cache ----- Balances =>", balances,balances && balances.length >0)
  if (balances && balances.length >0 ) {
    commit("setPortfolio", balances)
    commit("setIsBalancesLoaded", true)
  } else { 
    await dispatch("fetchBalances");
  }
  const availableNetworks = JSON.parse(localStorage.getItem("availables"));
  console.log("loading cache ----- Availables =>", availableNetworks)
  if (availableNetworks) {
    commit("setAvailableNetworks", availableNetworks);
  } else { 
    await dispatch("fetchAvailableNetworks")
  }
 commit("setIsCacheLoaded", true)
}

/* const fetchPortfolio = async ({ commit, state, dispatch }) => {
  console.log("fetch folio");
  await dispatch("fetchPreferred");
  await dispatch("fetchAccounts");
  console.log("folio post dispatch", state.seedAccounts.length, state.networks.length);
  if (state.seedAccounts.length == 0 || state.networks.length == 0) {
    commit('setIsConfigDone', false)
  } else {
    commit("setIsConfigDone", true);
  }
}; */


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
    commit("setSeedAccounts", decoded);
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
  commit("setSeedAccounts", accounts);
};


const saveNetworks = async ({ commit, state,dispatch }, networks) => {
  
  console.log("networks", networks)
  await dispatch("fetchNetworks", networks);
  localStorage.setItem("networks", JSON.stringify(state.networks));
};

const resetCache = async ({ commit, dispatch, state }) => { 
  localStorage.removeItem("prices");
  localStorage.removeItem("balances");
  localStorage.removeItem("accounts");
  localStorage.removeItem("networks");
}


const refreshPrices = async ({ commit, dispatch, state }) => { 
  dispatch("fetchPrices", state.networks)
}
const refreshBalances = async ({ commit, dispatch, state }) => { 
  dispatch("fetchBalances", state.networks)
}


const removeChain = async ({ commit, dispatch, state }, network) => { 
  const filtered = state.networks.filter(network1 => network1.name != network.name);
  const availables = [...state.availableNetworks, network];
  localStorage.setItem("networks", JSON.stringify(filtered));
  localStorage.setItem("availables", JSON.stringify(availables));
  commit("setNetworks", filtered);
  commit("setAvailableNetworks", availables)
}

const addChain = async ({ commit, dispatch, state }, network) => {
  let availables = state.availableNetworks.filter(net => net.name !== network.name);
  let filtered = JSON.stringify(_.uniqBy([...state.networks,network],"name"))
  localStorage.setItem("availables", JSON.stringify(availables));
  localStorage.setItem("networks", JSON.stringify(filtered));
  commit("addNetwork", network);
  commit("setAvailableNetworks", availables);
}

export default {
  fetchAvailableNetworks,
  fetchNetworks,
  fetchProposals,
  fetchPrices,
  //fetchPortfolio,
  fetchPreferred,
  fetchAccounts,
  fetchBalances,
  connectKeplr,
  disconnectKeplr,
  fetchAddress,
  changeChainId,
  castVote,
  saveAccounts,
  saveNetworks,
  removeChain,
  addChain,
  loadCache,
  resetCache,
  refreshPrices,
  refreshBalances
};

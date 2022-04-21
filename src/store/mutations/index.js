import _ from "lodash";

export default {
  setNetworks(state, networks) {
    state.networks = networks;
  },
  setAvailableNetworks(state, networks) {
    const available = networks.filter((net) => { 
      return !state.networks.find(net2 => net2.name === net.name)
    })
    state.availableNetworks = available;
  },
  addNetwork(state, network) {
    state.networks = _.uniqBy([...state.networks, network],"name")
  },
  setSeedAccounts(state, accounts) {
    state.seedAccounts = accounts;
  },
  setPortfolio(state, portfolio) {
    state.portfolio = portfolio;
  },
  setAddress(state, address) {
    state.wallet.address = address;
  },
  setImage(state, { name, image }) { 
    state.images[name] = image;
  },
  setImages(state, images) { 
    state.images = images;
  },
  setKeplr(state, keplr) {
    state.wallet.keplr = keplr;
  },
  setPrices(state, prices) {
    state.prices = prices;
  },
  setIsPricesLoaded(state, isLoaded) {
    state.isPricesLoaded = isLoaded;
  },
  setProposals(state, proposals) {
    state.proposals = _.keyBy(proposals, "name");
  },
  setIsProposalsLoaded(state, isLoaded) {
    state.isProposalsLoaded = isLoaded;
  },
  setIsNetworksLoaded(state, isLoaded) {
    state.isNetworksLoaded = isLoaded;
  },
  setIsCacheLoaded(state, isLoaded) {
    state.isCacheLoaded = isLoaded;
  },
  setIsBalancesLoaded(state, isLoaded) {
    state.isBalancesLoaded = isLoaded;
  },
  setChainId(state, chainId) {
    state.wallet.chainId = chainId;
  },
  setSigningClient(state, signingClient) {
    state.wallet.signingClient = signingClient;
  },
  setIsConfigDone(state, status) {
    state.isConfigDone = status;
  },
};

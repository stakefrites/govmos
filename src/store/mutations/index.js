import _ from "lodash";

export default {
  setNetworks(state, networks) {
    state.networks = networks;
  },
  setAccounts(state, accounts) {
    state.seedAccounts = accounts;
  },
  setPortfolio(state, portfolio) {
    state.portfolio = portfolio;
  },
  setAddress(state, address) {
    state.wallet.address = address;
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

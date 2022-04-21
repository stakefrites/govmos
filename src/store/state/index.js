export default {
  available: [
    { name: "akash" },
    { name: "chihuahua" },
    { name: "cerberus" },
    { name: "osmosis" },
    { name: "cosmoshub" },
    //{ name: "lumnetwork" },
    { name: "juno" },
    //{ name: "comdex" },
    //{ name: "secretnetwork" },
    { name: "sifchain" },
    { name: "sentinel" },
  ],
  images: {},
  isCacheLoaded: false,
  isBalancesLoaded: false,
  isPricesLoaded: false,
  accounts: [],
  prices: {},
  portfolio: [],
  networks: [],
  proposals: {},
  isConfigDone: false,
  isNetworksLoaded: false,
  seedAccounts: [],
  wallet: {
    chainId: "",
    address: false,
    keplr: false,
    signingClient: false,
    vote: {
      proposalId: "",
      option: 0,
    },
  },
};

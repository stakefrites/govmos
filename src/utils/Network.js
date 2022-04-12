import _ from "lodash";
import QueryClient from "./QueryClient";
import SigningClient from "./SigningClient";
import ApyClient from "./ApyClient";
import Chain from "./Chain";
import CosmosDirectory from "./CosmosDirectory";

const Network = async (data, withoutQueryClient) => {
  const chain = await Chain(data);
  const directory = CosmosDirectory();

  const rpcUrl = data.rpcUrl || directory.rpcUrl(data.name);
  const restUrl = data.restUrl || directory.restUrl(data.name);

  let queryClient;
  if (!withoutQueryClient) {
    queryClient = await QueryClient(chain.chainId, rpcUrl, restUrl);
  }

  const signingClient = (wallet, key) => {
    if (!queryClient) return;

    const gasPrice = data.gasPrice || "0.0025" + chain.denom;
    const client = SIGNERS[data.name] || SigningClient;
    return client(queryClient.rpcUrl, gasPrice, wallet, key);
  };

  const apyClient =
    queryClient && ApyClient(chain, queryClient.rpcUrl, queryClient.restUrl);

  const getValidators = (opts) => {
    opts = opts || {};
    opts.status = opts.status || "BOND_STATUS_BONDED";
    return queryClient.getAllValidators(150, opts);
  };

  return {
    connected: queryClient && queryClient.connected,
    enabled: data.enabled,
    apyEnabled: data.apyEnabled,
    name: data.name,
    prettyName: chain.prettyName,
    chainId: chain.chainId,
    prefix: chain.prefix,
    slip44: chain.slip44,
    gasPrice: data.gasPrice,
    denom: chain.denom,
    symbol: chain.symbol,
    decimals: chain.decimals,
    image: chain.image,
    coinGeckoId: chain.coinGeckoId,
    testAddress: data.testAddress,
    restUrl: queryClient && queryClient.restUrl,
    rpcUrl: queryClient && queryClient.rpcUrl,
    authzSupport: chain.authzSupport,
    data,
    chain,
    queryClient,
    getApy: apyClient && apyClient.getApy,
    signingClient,
    getValidators,
  };
};

export default Network;

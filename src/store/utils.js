import _ from "lodash";
import Network from "@/utils/Network";
import CosmosDirectory from "@/utils/CosmosDirectory";
import { fromBech32, toBech32 } from "@cosmjs/encoding";
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

export const mapAsync = (array, fn) => {
  return Promise.allSettled(array.map(fn));
};

export const getChains = async (base) => {
  const directory = new CosmosDirectory();
  let chains = await directory.getChains();
  const networks = base
    .map((el) => ({ name: el }))
    .filter((el) => el.enabled !== false)
    .map((data) => {
      const registryData = chains[data.name] || {};
      return { ...registryData, ...data };
    });
  const fullNetworks = await mapAsync(networks, async (network) => {
    return await Network(network);
  }).then((data) =>
    data.map((response) =>
      response.status == "fulfilled" ? response.value : null
    )
  );
  const compactFull = _.compact(fullNetworks);
  return compactFull;
};

export const getAllBalances = async (seedAddresses, selected) => {
  let accounts = [];
  for (let account of seedAddresses) {
    const address = account.address;
    const wallet = { name: account.name, addresses: [], balances: {} };
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
  return accounts;
};

const getAddress = (seed, chain) => {
  const { prefix } = chain;
  const bech = fromBech32(seed);

  return toBech32(prefix, bech.data);
};

export default {
  getAddress,
  getAllBalances,
  getChains,
  mapAsync,
};

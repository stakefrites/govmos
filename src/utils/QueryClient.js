import axios from "axios";
import _ from "lodash";
import {
  setupStakingExtension,
  QueryClient as CosmjsQueryClient,
  setupBankExtension,
  setupDistributionExtension,
  setupMintExtension,
  setupGovExtension,
} from "@cosmjs/stargate";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import { toBech32, fromBech32 } from "@cosmjs/encoding";

/**
 * Make Client
 *
 * @returns QueryClient with necessary extensions
 */
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

const QueryClient = async (chainId, rpcUrls, restUrls) => {
  const rpcUrl = await findAvailableUrl(
    Array.isArray(rpcUrls) ? rpcUrls : [rpcUrls],
    "rpc"
  );
  const restUrl = await findAvailableUrl(
    Array.isArray(restUrls) ? restUrls : [restUrls],
    "rest"
  );

  const client = await makeClient(rpcUrl);

  const getAllValidators = (pageSize, opts, pageCallback) => {
    return getAllPages((nextKey) => {
      return getValidators(pageSize, opts, nextKey);
    }, pageCallback).then((pages) => {
      const validators = _.shuffle(pages.map((el) => el.validators).flat());
      return validators.reduce(
        (a, v) => ({ ...a, [v.operator_address]: v }),
        {}
      );
    });
  };

  const getValidators = (pageSize, opts, nextKey) => {
    opts = opts || {};
    const searchParams = new URLSearchParams();
    if (opts.status) searchParams.append("status", opts.status);
    if (pageSize) searchParams.append("pagination.limit", pageSize);
    if (nextKey) searchParams.append("pagination.key", nextKey);
    return axios
      .get(
        restUrl +
          "/cosmos/staking/v1beta1/validators?" +
          searchParams.toString(),
        {
          timeout: opts.timeout || 10000,
        }
      )
      .then((res) => res.data);
  };

  const getAllValidatorDelegations = (
    validatorAddress,
    pageSize,
    pageCallback
  ) => {
    return getAllPages((nextKey) => {
      return getValidatorDelegations(validatorAddress, pageSize, nextKey);
    }, pageCallback).then((pages) => {
      return pages.map((el) => el.delegation_responses).flat();
    });
  };

  const getValidatorDelegations = (validatorAddress, pageSize, nextKey) => {
    const searchParams = new URLSearchParams();
    if (pageSize) searchParams.append("pagination.limit", pageSize);
    if (nextKey) searchParams.append("pagination.key", nextKey);

    return axios
      .get(
        restUrl +
          "/cosmos/staking/v1beta1/validators/" +
          validatorAddress +
          "/delegations?" +
          searchParams.toString()
      )
      .then((res) => res.data);
  };

  const getBalance = (address, denom) => {
    return axios
      .get(restUrl + "/cosmos/bank/v1beta1/balances/" + address)
      .then((res) => res.data)
      .then((result) => {
        const balance = result.balances?.find(
          (element) => element.denom === denom
        ) || { denom: denom, amount: 0 };
        return balance;
      });
  };

  const getDelegations = (address) => {
    return axios
      .get(restUrl + "/cosmos/staking/v1beta1/delegations/" + address)
      .then((res) => res.data)
      .then((result) => {
        const delegations = result.delegation_responses.reduce(
          (a, v) => ({ ...a, [v.delegation.validator_address]: v }),
          {}
        );
        return delegations;
      });
  };

  const getVotingPower = async (address, decimals) => {
    let validator = await client.staking.validator(address);
    return (validator.validator.tokens / 10 ** decimals).toFixed(0);
  };

  const getRewards = (address, opts) => {
    return axios
      .get(
        restUrl +
          "/cosmos/distribution/v1beta1/delegators/" +
          address +
          "/rewards",
        opts
      )
      .then((res) => res.data)
      .then((result) => {
        const rewards = result.rewards.reduce(
          (a, v) => ({ ...a, [v.validator_address]: v }),
          {}
        );
        return rewards;
      });
  };

  const getGrants = (botAddress, address, opts) => {
    const searchParams = new URLSearchParams();
    if (botAddress) searchParams.append("grantee", botAddress);
    if (address) searchParams.append("granter", address);
    // searchParams.append("msg_type_url", "/cosmos.staking.v1beta1.MsgDelegate");
    return axios
      .get(
        restUrl + "/cosmos/authz/v1beta1/grants?" + searchParams.toString(),
        opts
      )
      .then((res) => res.data)
      .then((result) => {
        const claimGrant = result.grants.find((el) => {
          if (
            el.authorization["@type"] ===
              "/cosmos.authz.v1beta1.GenericAuthorization" &&
            el.authorization.msg ===
              "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward"
          ) {
            return Date.parse(el.expiration) > new Date();
          } else {
            return false;
          }
        });
        const stakeGrant = result.grants.find((el) => {
          if (
            el.authorization["@type"] ===
              "/cosmos.staking.v1beta1.StakeAuthorization" ||
            // Handle GenericAuthorization for Ledger
            (el.authorization["@type"] ===
              "/cosmos.authz.v1beta1.GenericAuthorization" &&
              el.authorization.msg === "/cosmos.staking.v1beta1.MsgDelegate")
          ) {
            return Date.parse(el.expiration) > new Date();
          } else {
            return false;
          }
        });
        return {
          claimGrant,
          stakeGrant,
        };
      });
  };

  const getWithdrawAddress = (address, opts) => {
    return axios
      .get(
        restUrl +
          "/cosmos/distribution/v1beta1/delegators/" +
          address +
          "/withdraw_address",
        opts
      )
      .then((res) => res.data)
      .then((result) => {
        return result.withdraw_address;
      });
  };

  const getAllPages = async (getPage, pageCallback) => {
    let pages = [];
    let nextKey, error;
    do {
      const result = await getPage(nextKey);
      pages.push(result);
      nextKey = result.pagination.next_key;
      if (pageCallback) pageCallback(pages);
    } while (nextKey);
    return pages;
  };

  function findAvailableUrl(urls, type) {
    const path = type === "rest" ? "/blocks/latest" : "/block";
    return Promise.any(
      urls.map((url) => {
        return axios
          .get(url + path, { timeout: 10000 })
          .then((res) => res.data)
          .then((data) => {
            if (type === "rpc") data = data.result;
            if (!data.block.header.chain_id === chainId) {
              throw false;
            }
            return url;
          });
      })
    );
  }

  const getBalances = async (a, chains) => {
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
    const bech = fromBech32(a);
    const portfolio = [];
    for (let chain of chains) {
      const { decimals, prefix, coingecko_id, denom, name } = chain;

      const chainAddress = toBech32(prefix, bech.data);

      const client = await makeClient(chain.rpcUrl);
      let all = await client.bank.totalSupply();

      let liquid;
      try {
        liquid = await await client.bank.allBalances(chainAddress);
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
        name: chain.name,
        rewards,
        staked: parseFloat(stakedBalance),
        liquid: parseFloat(liquidBalance),
        coingecko_id,
        total,
        chainAddress,
      };
      portfolio.push(data);
    }
    return portfolio;
  };

  return {
    connected: !!rpcUrl && !!restUrl,
    rpcUrl,
    restUrl,
    tmClient: client,
    getAllValidators,
    getValidators,
    getAllValidatorDelegations,
    getValidatorDelegations,
    getBalance,
    getDelegations,
    getRewards,
    getGrants,
    getVotingPower,
    getWithdrawAddress,
    getBalances,
  };
};

export default QueryClient;

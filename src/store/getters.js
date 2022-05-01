import _ from "lodash";

const parseDecimals = (coin, decimals, precision) => {
  return parseFloat(parseInt(coin) / Math.pow(10, decimals)).toFixed(precision);
};

const parseCoin = (coin, tokensMap) => {
  const decimals = tokensMap[coin.demom];
  return parseDecimals(coin.amount, decimals, 2);
};

export default {
  getSelectedNetworks(state) {
    return state.networks.selected;
  },
  getAvailableNetworks(state) {
    return state.networks.available;
  },
  getAllNetworks(state) {
    return state.networks.all;
  },
  getNetworkByName: (state) => (name) => {
    const networks = _.keyBy(state.networks.selected, "name");
    if (networks[name]) {
      return networks[name];
    }
  },
  getSeedAddresses(state) {
    return state.portfolio.seedAddresses;
  },
  getWallets(state) {
    return state.portfolio.wallets;
  },
  getImageByName: (state) => (name) => {
    return state.networks.images[name];
  },
  getAprByName: (state) => (name) => {
    return state.networks.apr[name];
  },
  getPriceByName: (state) => (id) => {
    if (state.networks.prices[id]) {
      return state.networks.prices[id].prices[state.currency.value];
    }
  },
  getPriceByCurrencyByName: (state) => (name) => {
    if (state.networks.prices[name]) {
      return state.networks.prices[name].prices[state.currency.value];
    }
  },
  getTotalValue(state) {
    let totalValue = {
      total: 0,
      foreign: 0,
      staked: 0,
      rewards: 0,
      bonded: 0,
      liquid: 0,
      wallets: [],
    };
    for (let wallet of state.portfolio.wallets) {
      let folio = {
        name: wallet.name,
        total: 0,
        staked: 0,
        rewards: 0,
        bonded: 0,
        liquid: 0,
        foreign: 0,
      };
      for (let network of state.networks.selected) {
        const { base, name } = network;
        const decimals = state.tokens[base].decimals;
        const balances = wallet.balances.networks[name];
        let price = 0;
        if (state.networks.prices[base]) {
          price = state.networks.prices[base].prices[state.currency.value];
        }
        const foreignArray = balances.foreign;
        let foreignTotal = 0;
        if (foreignArray.length > 0) {
          foreignArray.map((foreign) => {
            const thisPrice =
              state.networks.prices[foreign.denom].prices[state.currency.value];
            const decimals = state.tokens[foreign.denom].decimals;
            const amount =
              parseDecimals(foreign.amount, decimals, 2) * thisPrice;
            foreignTotal += amount;
          });
        }
        const bondedArray = balances.bonded;
        let bondedTotal = 0;
        if (bondedArray) {
          bondedArray.map((bonded) => {
            const thisPrice = bonded.price;
            const amount = bonded.amount * thisPrice;
            bondedTotal += amount;
          });
        }

        const liquid =
          parseDecimals(balances.liquid.amount, decimals, 2) * price;
        const staked =
          parseDecimals(balances.staked.amount, decimals, 2) * price;
        const rewards =
          parseDecimals(balances.rewards.amount, decimals, 2) * price;
        const total = liquid + staked + rewards + foreignTotal;
        totalValue.total += total;
        totalValue.staked += staked;
        totalValue.rewards += rewards;
        totalValue.liquid += liquid;
        totalValue.bonded += bondedTotal;
        totalValue.foreign += foreignTotal;
        folio.foreign += foreignTotal;
        folio.bonded += bondedTotal;
        folio.total += total;
        folio.staked += staked;
        folio.rewards += rewards;
        folio.liquid += liquid;
      }

      totalValue.wallets.push(folio);
    }
    return totalValue;
  },
  getBalancesByName: (state) => (name) => {
    let balances = {
      total: 0,
      rewards: 0,
      staked: 0,
      liquid: 0,
      bonded: 0,
      foreign: 0,
    };
    for (let wallet of state.portfolio.wallets) {
      const networkBalance = wallet.balances.networks[name];
      if (networkBalance) {
        const baseDenom = wallet.balances.networks[name].staked.denom;
        const basePrice = state.networks.prices[baseDenom];
        let bonded = 0;
        if (networkBalance.bonded) {
          const bondedAmount = networkBalance.bonded
            .map((b) => {
              return (b.amount * b.price) / basePrice.prices.usd;
            })
            .reduce((prev, curr) => prev + curr);
          bonded += bondedAmount;
        }
        const decimals = state.tokens[baseDenom].decimals;
        const rewards =
          wallet.balances.networks[name].rewards.amount /
          Math.pow(10, decimals);
        const staked = parseDecimals(
          wallet.balances.networks[name].staked.amount,
          decimals,
          2
        );
        const liquid = parseDecimals(
          wallet.balances.networks[name].liquid.amount,
          decimals,
          2
        );
        const total =
          rewards + parseFloat(liquid) + parseFloat(staked) + bonded;
        balances.total += total;
        balances.bonded += parseFloat(bonded);
        balances.rewards += parseFloat(rewards);
        balances.staked += parseFloat(staked);
        balances.liquid += parseFloat(liquid);
      }
    }
    return balances;
  },
  getAmountByWalletAndNetwork:
    (state) =>
    ({ walletName, denom }) => {
      const walletObj = _.keyBy(state.portfolio.wallets, "name");
      const thisWallet = walletObj[walletName].balances.networks[denom];

      const baseDenom = thisWallet.staked.denom;
      const basePrice = state.networks.prices[baseDenom];
      const decimals = state.tokens[thisWallet.liquid.denom].decimals;
      const liquid = parseFloat(
        parseDecimals(thisWallet.liquid.amount, decimals, 2)
      );
      const rewards = parseFloat(
        parseDecimals(thisWallet.rewards.amount, decimals, 2)
      );
      const staked = parseFloat(
        parseDecimals(thisWallet.staked.amount, decimals, 2)
      );
      let bonded = 0;
      if (thisWallet.bonded) {
        const bondedAmount = thisWallet.bonded
          .map((b) => {
            return (b.amount * b.price) / basePrice.prices.usd;
          })
          .reduce((prev, curr) => prev + curr);
        bonded += bondedAmount;
      }

      const total = liquid + rewards + staked + bonded;

      const formatted = {
        liquid,
        rewards,
        staked,
        bonded,
        //foreign,
        total,
      };
      return formatted;
    },
  getForeignTokensByNetworkName: (state) => (name) => {
    let fore = {};
    if (state.portfolio.selectedWallet === "All") {
      const foreign = state.portfolio.wallets.map(
        (w) => w.balances.networks[name].foreign
      );
      foreign.flat().map((f) => {
        fore[f.denom]
          ? (fore[f.denom] = {
              amount: parseInt(fore[f.denom].amount) + parseInt(f.amount),
            })
          : (fore[f.denom] = f);
      });
      console.log("all", fore);
      return _.keyBy(fore, "denom");
    } else {
      const foreign = state.portfolio.wallets.find(
        (w) => w.name === state.portfolio.selectedWallet
      ).balances.networks[name].foreign;
      console.log("single", foreign);
      return foreign;
    }
  },
  getIsNetworksLoaded(state) {
    return state.loaded.isNetworksLoaded;
  },
  getIsPricesLoaded(state) {
    return state.loaded.isPricesLoaded;
  },
  getIsAprLoaded(state) {
    return state.loaded.isAprLoaded;
  },
  getIsProposalsLoaded(state) {
    return state.loaded.isProposalsLoaded;
  },
  getIsBalancesLoaded(state) {
    return state.loaded.isBalancesLoaded;
  },
  getOnboardingAlert(state) {
    return state.alerts.onboarding;
  },
  getDashboardAlert(state) {
    return state.alerts.dashboard;
  },
  getCurrency(state) {
    return state.currency;
  },
  getCurrencies(state) {
    return state.currencies;
  },
  getBalanceExpireTime(state) {
    return state.loaded.balanceExpireTime;
  },
  getAprExpireTime(state) {
    return state.loaded.aprExpireTime;
  },
  getLastPriceTime(state) {
    return state.loaded.lastPriceTime;
  },
  getSelectedWallet(state) {
    return state.portfolio.selectedWallet;
  },
  getTokens(state) {
    return state.tokens;
  },
  getTotal(state) {
    let total = {};
    state.portfolio.wallets.map((w) => {
      w.balances.total.map((coin) => {
        if (total[coin.denom]) {
          total[coin.denom].amount += coin.amount;
        } else {
          total[coin.denom] = { ...coin };
        }
      });
    });
    return Object.entries(total).map(([k, v]) => ({
      ...v,
    }));
  },
  getTotalByNetwork(state) {
    let total = {};
    state.portfolio.wallets.map((w) => {
      Object.entries(w.balances.networks).map(([k, v]) => {
        total[k] = {};
        return (total[k] = {});
      });
    });
    return total;
  },
};

const transform = (o) => {
  return Object.entries(o).map(([k, v]) => ({
    denom: k,
    amount: v,
  }));
};

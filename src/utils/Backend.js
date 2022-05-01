import _ from "lodash";
import axios from "axios";

const mapAsync = async (array, fn) => {
  let promises = await Promise.allSettled(array.map(fn));
  return promises.map((p) => {
    if (p.status == "fulfilled") {
      return p.value;
    } else {
      return false;
    }
  });
};

class Backend {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }
  getAllBalances = async (addresses, chains) => {
    const wallets = await mapAsync(addresses, async (a) => {
      const bal = await this.getBalances(
        a.address,
        chains.map((c) => c.name).join(",")
      );
      return {
        address: a.address,
        name: a.name,
        balances: bal.balances,
      };
    });

    return wallets;
  };

  getBalances = async (address, chains) => {
    try {
      const balances = await axios.get(
        `${this.baseUrl}/api/balance/${address}?chains=${chains}`
      );
      return balances.data;
    } catch (error) {
      console.log(error.message);
      return false;
    }
  };

  getApr = async (chainName) => {
    try {
      const apr = await axios.get(`${this.baseUrl}/api/apr/${chainName}`);
      return apr.data.apr;
    } catch (error) {
      console.log(error.message);
      return false;
    }
  };

  getChains = async (chains) => {
    const response = await axios.get(`${this.baseUrl}/api/chains`, {
      params: {
        chains,
      },
    });
    return response.data;
  };

  getTokens = async () => {
    const response = await axios.get(`${this.baseUrl}/api/tokens`);
    return response.data;
  };

  getAllPrices = async (ids) => {
    return await mapAsync(ids, async ({ id, denom }) => {
      const price = await this.getPrice(id);
      return { denom, price };
    });
  };

  getPrice = async (id) => {
    const response = await axios.get(`${this.baseUrl}/api/price/${id}`);
    return response.data;
  };
}

export default Backend;

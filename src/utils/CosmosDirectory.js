import axios from "axios";

class Directory {
  constructor() {
    this.directoryProtocol = process.env.DIRECTORY_PROTOCOL || "https";
    this.directoryDomain = process.env.DIRECTORY_DOMAIN || "cosmos.directory";
    this.rpcBase = `${this.directoryProtocol}://rpc.${this.directoryDomain}`;
    this.restBase = `${this.directoryProtocol}://rest.${this.directoryDomain}`;
    this.chainsUrl = `${this.directoryProtocol}://chains.${this.directoryDomain}`;
    this.validatorsUrl = `${this.directoryProtocol}://validators.${this.directoryDomain}`;
  }
  rpcUrl(name) {
    return this.rpcBase + "/" + name;
  }

  restUrl(name) {
    return this.restBase + "/" + name;
  }

  getChains() {
    return axios
      .get(this.chainsUrl)
      .then((res) => res.data)
      .then((data) => (Array.isArray(data) ? data : data.chains)) // deprecate
      .then((data) => data.reduce((a, v) => ({ ...a, [v.path]: v }), {}));
  }

  getChainData(name) {
    return axios
      .get([this.chainsUrl, name, "chain"].join("/"))
      .then((res) => res.data);
  }

  async getTokenData(name) {
    return axios
      .get([this.chainsUrl, name, "assetlist"].join("/"))
      .then((res) => res.data);
  }

  getOperators(chainName) {
    return axios
      .get(this.validatorsUrl + "/chains/" + chainName)
      .then((res) => res.data)
      .then((data) => data.validators.filter((el) => el.restake));
  }

  getOperatorCounts() {
    return axios
      .get(this.validatorsUrl)
      .then((res) => res.data)
      .then((data) => (Array.isArray(data) ? data : data.validators)) // deprecate
      .then((data) =>
        data.reduce((sum, validator) => {
          validator.chains.forEach((chain) => {
            sum[chain.name] = sum[chain.name] || 0;
            if (!!chain.restake) sum[chain.name]++;
          });
          return sum;
        }, {})
      );
  }
}

export default Directory;

<template>
  <v-col xs="12" sm="6" md="6">
    <v-card variant="outlined" :loading="networksLoaded">
      <v-card-title>
        <v-avatar size="50" class="mr-3">
          <img height="35" :src="network.image" />
        </v-avatar>
        <strong>{{ network.prettyName }}</strong>
        <span v-if="pricesLoaded">
          - {{ price(network.name) }} $USD</span
        ></v-card-title
      >
      <v-expansion-panels>
        <v-expansion-panel elevation="0">
          <v-expansion-panel-title>Network info</v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-table density="compact">
              <tbody v-if="networksLoaded">
                <tr>
                  <td><strong>Chain ID</strong></td>
                  <td>{{ network.chainId }}</td>
                </tr>
                <tr>
                  <td><strong>Denom</strong></td>
                  <td>{{ network.denom }}</td>
                </tr>
                <tr>
                  <td><strong>Coin Gecko ID</strong></td>
                  <td>{{ network.coinGeckoId }}</td>
                </tr>
                <tr>
                  <td><strong>APY</strong></td>
                  <td>{{ apy }}</td>
                </tr>
                <tr>
                  <td><strong>Symbol</strong></td>
                  <td>${{ network.symbol }}</td>
                </tr>
                <tr v-if="proposalsLoaded">
                  <td><strong># Proposals</strong></td>
                  <td>{{ proposals(network.name).length }}</td>
                </tr>
                <tr v-else>
                  <td colspan="2">
                    <v-progress-linear
                      indeterminate
                      color="primary"
                    ></v-progress-linear>
                  </td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr>
                  <td colspan="2">
                    <v-progress-linear
                      indeterminate
                      color="primary"
                    ></v-progress-linear>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-expansion-panel-text>
        </v-expansion-panel>
        <v-expansion-panel elevation="0">
          <v-expansion-panel-title>Balances</v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-table density="compact" v-if="balancesLoaded">
              <tbody>
                <tr>
                  <td><strong>Total</strong></td>
                  <td>{{ balances(network.name).total }}</td>
                </tr>
                <tr>
                  <td><strong>Liquid</strong></td>
                  <td>{{ balances(network.name).liquid }}</td>
                </tr>
                <tr>
                  <td><strong>Staked</strong></td>
                  <td>{{ balances(network.name).staked }}</td>
                </tr>
                <tr>
                  <td><strong>Rewards</strong></td>
                  <td>{{ balances(network.name).rewards }}</td>
                </tr>
              </tbody>
            </v-table>
            <v-table v-else>
              <tbody>
                <tr>
                  <td colspan="2">
                    <v-progress-linear
                      indeterminate
                      color="primary"
                    ></v-progress-linear>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>

      <v-card-actions>
        <v-btn v-if="proposalsLoaded" :to="`/proposals/${network.name}`"
          >View Proposals</v-btn
        >
        <v-btn v-if="balancesLoaded" :to="`/balances/${network.name}`"
          >View Balances</v-btn
        >
        <v-progress-linear
          v-else
          indeterminate
          color="primary"
        ></v-progress-linear>
      </v-card-actions>
    </v-card>
  </v-col>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "NetworkSummary",
  props: {
    network: {
      type: Object,
      required: true,
    },
  },
  data: () => ({ apy: 0 }),
  methods: {},
  async created() {},
  computed: {
    ...mapGetters({
      networksLoaded: "getIsNetworksLoaded",
      proposalsLoaded: "getIsProposalsLoaded",
      pricesLoaded: "getIsPricesLoaded",
      balancesLoaded: "getIsBalancesLoaded",
      proposals: "getProposalsByName",
      balances: "getBalancesByName",
      price: "getPriceByName",
    }),
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>

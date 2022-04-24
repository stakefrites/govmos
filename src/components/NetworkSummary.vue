<template>
  <v-col xs="12" sm="6" md="6">
    <v-card variant="outlined" :loading="networksLoaded">
      <v-card-title>
        <v-avatar size="50" class="mr-3">
          <img height="35" :src="image(network.name)" />
        </v-avatar>
        <strong>{{ network.name }}</strong>
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
            <v-table v-if="balancesLoaded" density="compact" >
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
                <tr>
                  <td><strong>VALUE $</strong></td>
                  <td>{{ balances(network.name).value }}</td>
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
  async created() {},
  methods: {},
  computed: {
    ...mapGetters({
      networksLoaded: "getIsNetworksLoaded",
      pricesLoaded: "getIsPricesLoaded",
      balancesLoaded: "getIsBalancesLoaded",
      balances: "getBalancesByName",
      price: "getPriceByName",
      image: "getImageByName",
    }),
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>

<template>
  <v-row>
    <v-col>
      <div class="text-h2">Dashboard</div>
    </v-col>
  </v-row>
  <v-row>
    <v-col
      xs="12"
      sm="6"
      md="6"
      v-for="network in networks"
      :key="network.name"
    >
      <v-card variant="outlined" :loading="networksLoaded">
        <v-card-title>
          <v-avatar size="50" class="mr-3">
            <img height="35" :src="network.image" /> </v-avatar
          >{{ network.prettyName }}</v-card-title
        >
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
        <v-table v-if="balancesLoaded">
          <thead>
            <tr>
              <th colspan="2">Balances</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Total</strong></td>
              <td>{{ balances(network.name) }}</td>
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
  </v-row>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "HomeView",
  components: {},
  data() {},
  async created() {
    console.log("fetching network", this.networks);
    await this.$store.dispatch("fetchNetworks", this.networks);
    await this.$store.dispatch("fetchAddress");
  },
  computed: {
    ...mapGetters({
      networks: "getNetworks",
      networksLoaded: "getIsNetworksLoaded",
      proposalsLoaded: "getIsProposalsLoaded",
      balancesLoaded: "getIsBalancesLoaded",
      proposals: "getProposalsByName",
      balances: "getBalancesByName",
    }),
  },
};
</script>

<style scoped></style>

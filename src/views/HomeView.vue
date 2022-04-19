<template>

  <v-row>
    <v-col md="12" lg="6">
      <v-card  color="primary" v-if="balancesLoaded">
        <v-card-title>
          <strong>Total</strong>
        </v-card-title>
        <v-card-subtitle class="mb-2">
              <strong>{{parseFloat(totalValue.total).toFixed(2)}} $</strong>
        </v-card-subtitle>
        <v-list>
          <v-list-item v-for="wallet in totalValue.wallets" :key="wallet.name">
            <v-list-item-content>
              <v-list-item-title>
                {{wallet.name}}
              </v-list-item-title>
              <v-list-item-subtitle>
                <v-chip color="success">
                 <strong>{{parseFloat(wallet.value).toFixed(2)}} $</strong>
                </v-chip>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-col>
  </v-row>
  <v-row>
    <NetworkSummary
      v-for="network in networks"
      :key="network.name"
      :network="network"
    ></NetworkSummary>
  </v-row>
</template>

<script>
import { mapGetters } from "vuex";
import NetworkSummary from "@/components/NetworkSummary.vue";
export default {
  name: "HomeView",
  components: { NetworkSummary },
  data() {},
  async created() {
    /* if (!this.isConfigDone) {
      this.$router.push("/");
    } */
    await this.$store.dispatch("fetchNetworks", this.networks);
    await this.$store.dispatch("fetchAddress");
  },
  computed: {
    ...mapGetters({
      networks: "getNetworks",
      totalValue: "getTotalValue",
      networksLoaded: "getIsNetworksLoaded",
      proposalsLoaded: "getIsProposalsLoaded",
      balancesLoaded: "getIsBalancesLoaded",
      proposals: "getProposalsByName",
      balances: "getBalancesByName",
      portfolio: "getPortfolio",
    }),
  },
};
</script>

<style scoped>
.code {
  background-color: #f5f5f5;
}
</style>

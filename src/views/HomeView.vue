<template>
  <v-row>
    <v-col>
      <div class="text-h2">Dashboard</div>
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

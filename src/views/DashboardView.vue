<template>

  <v-row>
    <v-col md="12" lg="12">
      <v-card  color="primary" >
        <v-overlay
        :model-value="!balancesLoaded"
        contained
        class="align-center justify-center"
      >
        <v-card class="pa-4">
          <v-card-title>
            <strong>Loading balances 🥩</strong>
          </v-card-title>
          <v-progress-linear indeterminate color="primary"></v-progress-linear>
          </v-card>
      </v-overlay>
        <v-card-title>
          <strong class="text-h4">Summary</strong>
        </v-card-title>
        <v-card-subtitle class="mb-2">
              Total value: <strong>{{parseFloat(totalValue.total).toFixed(2)}} $</strong>
        </v-card-subtitle>
        <v-list>
          <v-list-item v-for="wallet in totalValue.wallets" :key="wallet.name" >
            <v-list-item-content>
              <v-list-item-title v-text="wallet.name"/>
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
  name: "DashboardView",
  components: { NetworkSummary },
  data() {
    return {
      model: [],
    }
  },
  async created() {
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

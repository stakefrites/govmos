<template>
<v-alert type="info" class="my-5" border>
            <v-alert-title>
              <div class="text-subtitle-1">Quick pointers</div>
              </v-alert-title>
            <div class="text-body-2">
              To change the chains that display or the wallets that are tracked you can click on the <v-icon>mdi-account-cog</v-icon> icon in the app bar <br>
              To refresh prices, you can click on the  <v-icon>mdi-currency-usd</v-icon> icon in the app bar <br>
              To refresh your balances, you can click on the  <v-icon>mdi-refresh</v-icon> icon in the app bar.<br> This operation can be long as it needs to do 3 different queries on all the chains times the number of wallet you are tracking. <br> <br>
              Happy tracking sers 🥩 🍟! <br>
              If you want to help us, consider delegating to our ATOM node <a href="https://restake.app/cosmoshub/cosmosvaloper1uepjmgfuk6rnd0djsglu88w7d0t49lmljdpae2" target="_blank">here</a> ❤️
            </div>
          </v-alert>
          <v-row class="d-flex justify-space-around">
            <DashboardSummary/>
          </v-row>
  <v-row>
    <NetworkSummary
      v-for="network in selectedNetworks"
      :key="network.name"
      :network="network"
    ></NetworkSummary>
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import NetworkSummary from "@/components/NetworkSummary.vue";
import PieChart from "@/components/BarChart.vue";
import AmountsCard from "@/components/AmountsCard.vue";
import DashboardSummary from "@/components/DashboardSummary.vue";
export default {
  name: "DashboardView",
  components: { NetworkSummary, PieChart, AmountsCard, DashboardSummary },
  data() {
    return {
      model: [],
    }
  },
  async created() {
    if (this.seedAddresses.length === 0 || this.selectedNetworks.length === 0) {
      this.$router.push("/select");
    }
    console.log(this.totalValue)
  },
  methods: {
    ...mapActions({
      fetchNetworks: "fetchNetworks",
      setAlert: "setDashboardAlert",
    }),
  },
  computed: {
    ...mapGetters({
      selectedNetworks: "getSelectedNetworks",
      totalValue: "getTotalValue",
      balances: "getBalancesByName",
      networksLoaded: "getIsNetworksLoaded",
      balancesLoaded: "getIsBalancesLoaded",
      seedAddresses : "getSeedAddresses",
      showAlert: "getDashboardAlert",
    }),
  },
};
</script>

<style scoped>
.code {
  background-color: #f5f5f5;
}
</style>

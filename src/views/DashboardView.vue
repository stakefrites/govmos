<template>

  <v-row>
    <v-col md="12" lg="12">
      <v-alert closable v-model="showAlert" type="info" class="my-5" border>
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
      <v-card  variant="outlined" >
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
        <br>
        <v-card-subtitle>
          <h4>Total balance</h4>
        </v-card-subtitle>
        <v-card-title><strong>{{parseFloat(totalValue.total).toFixed(2)}} $</strong></v-card-title>
        <v-row class="my-10">
          <v-col>
             <div class="d-flex flex-column align-center">
              <div class="text-h5 mb-5">Value by wallet</div>
              <PieChart :results="totalValue.wallets"></PieChart>
          </div>
          </v-col>
         <!--  <v-col>
             <div class="d-flex flex-column align-center">
              <div class="text-h5 mb-5">Value by token</div>
              <PieChart :results="totalValue.wallets"></PieChart>
          </div>
          </v-col> -->
        </v-row>
        <div class="d-flex justify-space-around">
        <v-card class="pa-4 ma-5"  v-for="wallet in totalValue.wallets" :key="wallet.name">
          <v-card-header>
            <v-card-title>{{wallet.name}}</v-card-title>
          </v-card-header>
          <v-card-text>
            <strong>{{parseFloat(wallet.value).toFixed(2)}} $</strong>
          </v-card-text>
        </v-card>
        </div>
      </v-card>
    </v-col>
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
export default {
  name: "DashboardView",
  components: { NetworkSummary, PieChart },
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

<template>
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
  <v-row>
    
    <NetworkSummary
      v-for="network in selectedNetworks"
      :key="network.name"
      :network="network"
    ></NetworkSummary>
  </v-row>
  <v-row>
    <v-col md="12" lg="12">
          <DashboardSummary>
            <!-- 
              <v-col>
            <div class="d-flex flex-column align-center">
              <div class="text-h5 mb-5">Value by wallet</div>
              <div class="d-flex">
              <slot></slot>
              </div>
            </div>
          </v-col>
              <PieChart :results="totalValue.wallets"></PieChart>
            </div> -->
          </DashboardSummary>
    </v-col>
  </v-row>
  <v-row>
    <v-col lg="12" v-for="wallet in totalValue.wallets" :key="wallet.name">
  <v-card  variant="outlined" >
        <v-card-header>
          <v-card-subtitle><div class="text-h5">{{wallet.name}}</div></v-card-subtitle>
        </v-card-header>
                <div class="d-flex justify-space-around">
                  <v-row>
          <v-col lg="3" sm="6">
         <div class="mx-5 mr-10">
          <v-card flat class="px-3 py-6">
          <v-card-subtitle>
            <div class="text-h4">Total</div>
          </v-card-subtitle>
          <v-card-title><div class="text-h5"><strong>{{parseFloat(wallet.value).toFixed(2)}} $</strong></div></v-card-title>
          </v-card>
        </div>
        </v-col>
        <v-divider class="my-6" vertical></v-divider>
        <v-col lg="3" sm="6">
        <div class="mx-2">
          <v-card flat class="px-3 py-6">
          <v-card-subtitle>
            <div class="text-h4">Staked</div>
          </v-card-subtitle>
          <v-card-title><div class="text-h5"><strong>{{parseFloat(wallet.staked).toFixed(2)}}</strong></div></v-card-title>
          </v-card>
        </div> 
        </v-col>
        <v-divider class="my-6" vertical></v-divider>
        <v-col lg="3" sm="6">
        <div class="mx-2">
<v-card flat class="px-3 py-6">
          <v-card-subtitle>
            <div class="text-h4">Rewards</div>
          </v-card-subtitle>
          <v-card-title><div class="text-h5"><strong>{{parseFloat(wallet.rewards).toFixed(2)}} $</strong></div></v-card-title>
          </v-card>
        </div>
        </v-col>
        
        <v-divider class="my-6" vertical></v-divider>
        <v-col lg="3" sm="6">
         <div class="mx-2">
<v-card flat class="px-3 py-6">
          <v-card-subtitle>
            <div class="text-h4">Liquid</div>
          </v-card-subtitle>
          <v-card-title><div class="text-h5"><strong>{{parseFloat(wallet.liquid).toFixed(2)}} $</strong></div></v-card-title>
          </v-card>
        </div>
        </v-col>
        </v-row>
        </div>
        

      </v-card>
      </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import NetworkSummary from "@/components/NetworkSummary.vue";
import PieChart from "@/components/BarChart.vue";
import DashboardSummary from "@/components/DashboardSummary.vue";
export default {
  name: "DashboardView",
  components: { NetworkSummary, PieChart, DashboardSummary },
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

<template>
  <v-card  variant="outlined" >
        <v-overlay
        :model-value="!balancesLoaded"
        contained
        class="align-center justify-center"
      >
        <v-card dark class="pa-4">
          <v-card-title>
            <strong>Loading balances 🥩</strong>
          </v-card-title>
          <v-progress-linear indeterminate color="primary"></v-progress-linear>
          </v-card>
      </v-overlay>
        <br>
        <div class="d-flex">

        <div class="mx-5 mr-10">
          <v-card flat class="px-3 py-6">
          <v-card-subtitle>
            <div class="text-h4">Total</div>
          </v-card-subtitle>
          <v-card-title><div class="text-h5"><strong>{{parseFloat(totalValue.total).toFixed(2)}} $</strong></div></v-card-title>
          </v-card>
        </div>
        <v-divider class="mx-2" vertical></v-divider>
        <div class="mx-2">
          <v-card flat class="px-3 py-6">
          <v-card-subtitle>
            <div class="text-h4">Staked</div>
          </v-card-subtitle>
          <v-card-title><div class="text-h5"><strong>{{parseFloat(totalValue.staked).toFixed(2)}} $</strong></div></v-card-title>
          </v-card>
        </div>
        <v-divider class="mx-2" vertical></v-divider>
        <div class="mx-2">
<v-card flat class="px-3 py-6">
          <v-card-subtitle>
            <div class="text-h4">Rewards</div>
          </v-card-subtitle>
          <v-card-title><div class="text-h5"><strong>{{parseFloat(totalValue.rewards).toFixed(2)}} $</strong></div></v-card-title>
          </v-card>
          <v-divider class="mx-2" vertical></v-divider>
        </div>
        <v-divider class="mx-2" vertical></v-divider>
         <div class="mx-2">
<v-card flat class="px-3 py-6">
          <v-card-subtitle>
            <div class="text-h4">Liquid</div>
          </v-card-subtitle>
          <v-card-title><div class="text-h5"><strong>{{parseFloat(totalValue.liquid).toFixed(2)}} $</strong></div></v-card-title>
          </v-card>
        </div>
        </div>
        <v-row class="my-10">
           <slot></slot>
      
        </v-row>
        <div class="d-flex justify-space-around">
          
        <v-card flat class="px-3 py-6"  v-for="wallet in totalValue.wallets" :key="wallet.name">
          <v-card-subtitle>
            <div class="text-h4">{{wallet.name}}</div>
          </v-card-subtitle>
          <v-card-title><div class="text-h5"><strong>{{parseFloat(totalValue.staked).toFixed(2)}} $</strong></div></v-card-title>
          <v-card-header>
          </v-card-header>
          <v-card-text>
            <div class="d-flex justify-space-around">
              <div>Staked: </div><div><strong>{{parseFloat(wallet.staked).toFixed(2)}} $</strong></div><br>
            </div>
            <div class="d-flex justify-space-around">
              <div>Rewards: </div><div><strong>{{parseFloat(wallet.rewards).toFixed(2)}} $</strong></div><br>
            </div>
            <div class="d-flex justify-space-around">
              <div>Liquid: </div><div><strong>{{parseFloat(wallet.liquid).toFixed(2)}} $</strong></div><br>
            </div>
            
          </v-card-text>
        </v-card>
        </div>
      </v-card>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "DashboardSummary",
  data: () => ({}),
  methods: {},
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
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
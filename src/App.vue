<template>
  <v-app full-height>
    <v-app-bar flat color="primary" dark>
      <template v-slot:prepend>
        <Logo />
      </template>

      <v-app-bar-title>
        <div class="h4">
          <b>Moscos</b>
        </div>
      </v-app-bar-title>

      <template v-slot:append>
        <v-app-bar-title>
          <v-chip class="mr-1"  to="/settings">
            <v-icon size="x-large"> mdi-account-cog </v-icon>
          </v-chip>
           <v-chip class="mr-1"  @click="refreshBalances()">
            <v-icon size="x-large"> mdi-refresh </v-icon>
          </v-chip>
          <v-chip class="mr-1"  @click="refreshPrices()">
            <v-icon size="x-large"> mdi-currency-usd </v-icon>
          </v-chip>
          <v-chip v-if="keplr" @click="disconnectKeplr()">{{ excerptAddress(address) }}</v-chip>
          <v-chip @click="connectKeplr()" v-else>Connect Wallet</v-chip>
        </v-app-bar-title>
      </template>
    </v-app-bar>
    <v-container fluid >
      <LoadingSnack :isLoaded="isNetworksLoaded" what="networks"></LoadingSnack>
      <LoadingSnack :isLoaded="isPricesLoaded" what="prices"></LoadingSnack>
      <LoadingSnack :isLoaded="isBalancesLoaded" what="balances"></LoadingSnack>
      <v-main class="body"> 
        <router-view />
      </v-main>
    </v-container>
    <v-footer class="bg-primary footer" fixed bottom>
      <v-row justify="center" class="text-center">
        <v-col>
          <v-btn variant="text" color="black" class="mx-1" xl> Trakmos </v-btn>
          <v-divider class="mx-1" vertical></v-divider>
          <v-btn variant="text" color="black" class="mx-1" xl> Govmos </v-btn>
        </v-col>
        <v-col class="text-center text-white mt-4" cols="12">
          {{ new Date().getFullYear() }} —
          <strong>Stake Frites (🥩 , 🍟)</strong>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script>
import Logo from "@/components/Logo.vue";
import { mapActions, mapGetters } from "vuex";
import LoadingSnack from "./components/LoadingSnack.vue";

export default {
  name: "App",

  components: {
    Logo,
    LoadingSnack
},
  async created() {
    await this.loadCache();
    await this.fetchPortfolio();
    if (!this.isConfigDone) {
      await this.fetchNetworks(this.$store.state.available);
    } else {
      await this.fetchNetworks(this.$store.state.networks);
    }

    await this.$store.dispatch("fetchAddress");
  },
  computed: {
    ...mapGetters({
      address: "getAddress",
      keplr: "getKeplr",
      network: "getNetworkByName",
      isConfigDone: "getIsConfigDone",
       isBalancesLoaded : "getIsBalancesLoaded",
      isPricesLoaded : "getIsPricesLoaded",
      isNetworksLoaded : "getIsNetworksLoaded",
    }),
  

  },
  methods: {
    ...mapActions({
      fetchPortfolio: "fetchPortfolio",
      fetchAvailableNetworks: "fetchAvailableNetworks",
      refreshBalances: "refreshBalances",
      fetchNetworks: "fetchNetworks",
      fetchAddress: "fetchAddress",
      disconnectKeplr: "disconnectKeplr",
      connectKeplr: "connectKeplr",
      loadCache: "loadCache",
      refreshPrices: "refreshPrices",
  
    }),
    excerptAddress(address) {
      return address.substring(0, 10) + "..." + address.substring(address.length - 5);
    }
  },

  data: () => ({
    snackbar: true,
  }),
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Fredoka&family=Titillium+Web:wght@200;700&display=swap");

body {
  color: white;
  font-family: "Titillium Web", sans-serif;
}
.footer {
   z-index:  1 !important;
   margin-top: 100px !important;
   width: 100% !important;
}

.body {
  margin-bottom: 120px !important;
}

</style>

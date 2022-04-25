<template>
  <v-app :theme="theme" full-height>
    <v-app-bar flat color="primary" dark>
      <template v-slot:prepend>
        <Logo />
      </template>

      <v-app-bar-title>
        <div>
          <b>Trakmos</b>
        </div>
      </v-app-bar-title>

      <template v-slot:append>
        <v-app-bar-title>
          <v-chip class="mr-1" to="/settings">
            <v-icon size="x-large"> mdi-account-cog </v-icon>
          </v-chip>
           <v-chip v-if="currency" class="mr-1" @click=" settingCurrency = true" >
           {{currency.text}}
          </v-chip>
           <v-chip class="mr-1"  @click="refreshBalances()">
             <v-tooltip activator="parent" anchor="bottom">Refresh all balances</v-tooltip>
            <v-icon size="x-large"> mdi-refresh </v-icon>
          </v-chip>
          <v-chip class="mr-1"  @click="refreshPrices()">
             <v-tooltip activator="parent" anchor="bottom">Refresh prices</v-tooltip>
            <v-icon size="x-large"> mdi-currency-usd </v-icon>
          </v-chip>
           <v-chip class="mr-1"  @click="toggleDarkTheme()">
             <v-tooltip activator="parent" anchor="bottom">Toggle night mode</v-tooltip>
            <v-icon size="x-large"> mdi-weather-night </v-icon>
          </v-chip>
        </v-app-bar-title>
      </template>
    </v-app-bar>
    <v-container class="width"  >
      <LoadingSnack :isLoaded="isNetworksLoaded" what="networks"></LoadingSnack>
      <LoadingSnack :isLoaded="isPricesLoaded" what="prices"></LoadingSnack>
      <v-main class="body"> 
        <router-view />
        <v-overlay :model-value="settingCurrency" class="align-center justify-center">
  <v-card class="modal-card">
    <v-card-title class="my-5">
      <strong>Change currency</strong>
</v-card-title>
<v-card-text>
        <CurrencyForm :handler="save"></CurrencyForm>
</v-card-text>
    </v-card>
    </v-overlay>
      </v-main>
    </v-container>
    <v-footer class="bg-primary footer" fixed bottom>
      <v-row justify="center" class="text-center">
        <v-col class="text-center text-white my-4" cols="12">
          {{ new Date().getFullYear() }} —
          <strong>Stake Frites (🥩 , 🍟)</strong>
        </v-col>
      </v-row>
      <v-overlay :model-value="!isNetworksLoaded"  class="align-center justify-center">
        <v-card>
          <v-card-title>
          <strong>We are hard at work selecting the best pieces 🥩....</strong>
        </v-card-title>
        <v-card-subtitle class="mb-2">
              <strong>Enjoy some 🍟 while we fetch your 🥩</strong>
        </v-card-subtitle>
        <v-card-text dropzone>
          <v-progress-linear
            indeterminate
            color="primary"></v-progress-linear>
          </v-card-text>
        </v-card>
    </v-overlay>
    </v-footer>
  </v-app>
</template>

<script>
import Logo from "@/components/Logo.vue";
import { mapActions, mapGetters } from "vuex";
import LoadingSnack from "@/components/LoadingSnack.vue";
import CurrencyForm from "@/components/CurrencyForm.vue";
import _ from "lodash";

export default {
  name: "App",

  components: {
    Logo,
    LoadingSnack,
    CurrencyForm
},
  beforeCreate() {
		this.$store.commit('initialiseStore');
	},
  created() {
    this.fetchNetworks();
    this.refreshPrices();
    this.refreshBalances();
    this.fetchApr();

  },
  computed: {
    ...mapGetters({
      network: "getNetworkByName",
      currency: "getCurrency",
      currencies: "getCurrencies",
      isBalancesLoaded : "getIsBalancesLoaded",
      isPricesLoaded : "getIsPricesLoaded",
      isNetworksLoaded : "getIsNetworksLoaded",
    }),
  },
  methods: {
    ...mapActions({
      fetchAvailableNetworks: "fetchAvailableNetworks",
      fetchNetworks: "fetchNetworks",
      refreshBalances: "refreshBalances",
      fetchNetworks: "fetchNetworks",
      fetchAddress: "fetchAddress",
      fetchApr: "fetchApr",
      disconnectKeplr: "disconnectKeplr",
      connectKeplr: "connectKeplr",
      loadCache: "loadCache",
      refreshPrices: "refreshPrices",
      saveCurrency: "saveCurrency",
    }),
    async save() {
      this.settingCurrency = false;
    },

    excerptAddress(address) {
      return address.substring(0, 10) + "..." + address.substring(address.length - 5);
    },
    toggleDarkTheme() {
     this.theme = this.theme === 'myCustomLightTheme' ? 'myDarkTheme' : 'myCustomLightTheme'
    },
  },

  data: () => ({
    snackbar: true,
    theme: "myCustomLightTheme",
    currencyValue: {value:  {value: "usd", text: "USD"},next: "confirm", done: false},
    settingCurrency: false
  }),
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Fredoka&family=Titillium+Web:wght@200;700&display=swap");

body {
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

.width {
  max-width: 1000px !important;
}

</style>

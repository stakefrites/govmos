<template>
  <v-app>
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
            <v-icon class="mr-1" size="x-large"> mdi-account-cog </v-icon>
          </v-chip>
          <v-chip v-if="keplr" @click="disconnectKeplr()">{{ excerptAddress(address) }}</v-chip>
          <v-chip @click="connectKeplr()" v-else>Connect Wallet</v-chip>
        </v-app-bar-title>
      </template>
    </v-app-bar>
    <v-container>
      <v-main>
        <router-view />
      </v-main>
    </v-container>
    <v-footer class="bg-primary">
      <v-row justify="center" class="text-center" no-gutters>
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
import { mapGetters } from "vuex";

export default {
  name: "App",

  components: {
    Logo,
  },
  async created() {
    await this.$store.dispatch("fetchPortfolio");
    console.log(this.$store.state);
    if (!this.$store.state.isConfigDone) {
      await this.$store.dispatch("fetchNetworks", this.$store.state.available);
    } else {
      await this.$store.dispatch("fetchNetworks", this.$store.state.networks);
    }

    await this.$store.dispatch("fetchAddress");
  },
  computed: {
    ...mapGetters({
      address: "getAddress",
      keplr: "getKeplr",
      network: "getNetworkByName",
    }),
  },
  methods: {
    excerptAddress(address) {
      return address.substring(0, 10) + "..." + address.substring(address.length - 5);
    },
    async connectKeplr() {
      await this.$store.dispatch("connectKeplr");
    },
    async disconnectKeplr() {
      await this.$store.dispatch("disconnectKeplr");
    },
  },

  data: () => ({
    //
  }),
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Fredoka&family=Titillium+Web:wght@200;700&display=swap");

body {
  color: white;
  font-family: "Titillium Web", sans-serif;
}
</style>

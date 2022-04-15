<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <Logo />
        <v-app-bar-title class="text">
          <div class="text-h4">Govmos</div>
        </v-app-bar-title>
      </div>

      <v-spacer></v-spacer>
      <v-app-bar-title>
        <v-chip v-if="keplr" @click="disconnectKeplr()">{{ address }}</v-chip>
        <v-chip @click="connectKeplr()" v-else>Connect Wallet</v-chip>
      </v-app-bar-title>
    </v-app-bar>
    <v-container>
      <v-main>
        <router-view />
      </v-main>
    </v-container>
    <v-footer padless>
      <v-card flat tile width="100%" class="red lighten-1 text-center">
        <v-card-text>
          <v-btn v-for="icon in icons" :key="icon" class="mx-4" icon>
            <v-icon size="24px">
              {{ icon }}
            </v-icon>
          </v-btn>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-text class="white--text">
          {{ new Date().getFullYear() }} —
          <strong>Stake Frites (🥩 , 🍟)</strong>
        </v-card-text>
      </v-card>
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
    await this.$store.dispatch("fetchNetworks");
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

<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-app-bar-title class="text">
          <router-link to="/">
            <div class="text-h4">Stake Frites</div></router-link
          ></v-app-bar-title
        >
      </div>

      <v-spacer></v-spacer>
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
import HelloWorld from "./components/HelloWorld.vue";

export default {
  name: "App",

  components: {
    HelloWorld,
  },
  async created() {
    await this.$store.dispatch("fetchNetworks");
  },

  data: () => ({
    //
  }),
};
</script>

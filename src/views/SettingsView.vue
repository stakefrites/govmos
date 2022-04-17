<template>
 <v-btn variant="text" @click="goBack()">
    <v-icon class="mr-3" size="x-large"> mdi-arrow-left </v-icon>
      Back
  </v-btn>
<v-row>
  <v-col>
    <div class="text-h2">Settings</div>
  </v-col>
</v-row>
<v-row>
  <v-col>
    <div class="text-h4">Chains</div>
  </v-col>
</v-row>
<v-row>
  <v-col md="12" sm="12" v-for="network in networks" :key="network.name">
  <v-card variant="outlined" :loading="networksLoaded">
    <v-card-title>
      <v-avatar size="50" class="mr-3">
        <img height="35" :src="image(network.name)" />
      </v-avatar>
      <strong>{{ network.name }}</strong>
      </v-card-title>
      <v-btn @click="removeChain(network.name)" variant="text"  prepend-icon="mdi-close-circle">Remove</v-btn>
      
    </v-card>
  </v-col>
</v-row>
<v-row>
  <v-col>
    <div class="text-h4">Wallets</div>
  </v-col>
</v-row>
<v-row>
  <v-col lg="6" md="12" v-for="wallet in portfolio" :key="wallet.name">
    <v-card>
      <v-card-header>
        <v-card-title>{{ wallet.name }}</v-card-title>
      </v-card-header>
      <v-card-text>
      <div v-for="address in wallet.addresses" :key="address">
          <code  class="code"> {{address}}</code><br/>
      </div>
      </v-card-text>
    </v-card>
    

  </v-col>
</v-row>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import store from "../store";
export default {
  name: "SettingsView",
  components: {  },
  data() {
    return {
      network: "",
      activeProposals: [],
    };
  },
  computed: {
     ...mapGetters({
      portfolio: "getPortfolio",
      networks: "getNetworks",
      networksLoaded: "getIsNetworksLoaded",
      image: "getImageByName"
    }),
  },
  methods: {
     goBack() {
      this.$router.go(-1);
    },
    async removeChain(name) {
      await this.$store.dispatch("removeChain",name);
    }
  },
  async created() {
  
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>

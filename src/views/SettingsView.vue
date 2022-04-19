<template>
 <v-btn variant="default" color="primary" class="mb-3" @click="goBack()">
    <v-icon class="mr-3" size="x-large"> mdi-arrow-left </v-icon>
      Back
  </v-btn>
<v-row>
  <v-col cols="12">
    <v-card color="primary">
      <v-card-header>
        <v-card-title class="my-5">
            <strong>Activated Networks</strong>
        </v-card-title>
      </v-card-header>
      <v-list three-line  >
        <v-list-item  v-for="network in networks" :key="network.name" :prepend-avatar="image(network.name)">
          <v-list-item-header>
            <v-list-item-title>{{ network.name }}</v-list-item-title>
          </v-list-item-header>
          <v-btn @click="removeChain(network)" prepend-icon="mdi-minus" class="mr-3" color="primary" variant="outlined">Remove</v-btn>
        </v-list-item>
      </v-list>
      <v-card-header>
        <v-card-title class="my-5">
            <strong>Add more networks</strong>
        </v-card-title>
      </v-card-header>
       <v-list three-line >
        <v-list-item v-for="network in availableNetworks" :key="network.name"  :prepend-avatar="image(network.name)">
          <v-list-item-header>
            <v-list-item-title>{{ network.name }}</v-list-item-title>
          </v-list-item-header>
          <v-btn @click="addChain(network)" prepend-icon="mdi-plus" class="mr-3" color="primary" variant="outlined">Add</v-btn>
        </v-list-item>
      </v-list>
    </v-card>
  </v-col>
</v-row>
<v-row>
  <v-col lg="6" md="12">
  <v-card color="primary">
    <v-card-header>
        <v-card-title class="my-5">
            <strong>Wallets</strong>
        </v-card-title>
      </v-card-header>
      <div v-for="wallet in portfolio" :key="wallet.name">
      <v-card-header>
       <v-card-title class="my-51">
         <strong>{{wallet.name}}</strong>
        </v-card-title>
      </v-card-header>
      <v-list>
        <v-list-item v-for="address in wallet.addresses" :key="address">
      <div >
          <code  class="code"> {{excerptAddress(address)}}</code><br/>
      </div>
      </v-list-item>
      </v-list>
      </div>
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
      availableNetworks: "getAvailableNetworks",
      networksLoaded: "getIsNetworksLoaded",
      image: "getImageByName"
    }),
  },
  methods: {
     goBack() {
      this.$router.go(-1);
    },
    excerptAddress(address) {
      return address.substring(0, 10) + "..." + address.substring(address.length - 10);
    },
    ...mapActions({
      removeChain: "removeChain",
      addChain: "addChain"
    })
  },
  async created() {
  
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
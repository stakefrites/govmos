<template>
 <v-btn variant="default" color="primary" class="mb-3" @click="goBack()">
    <v-icon class="mr-3" size="x-large"> mdi-arrow-left </v-icon>
      Back
  </v-btn>
<v-row>
  <v-col cols="12">
    <v-card color="primary">
      <v-card-header>
        <v-card-title class="my-1">
            <strong>Activated Networks</strong>
        </v-card-title>
      </v-card-header>
      <v-list three-line  >
        <v-list-item  v-for="network in networks" :key="network.name" :prepend-avatar="network.image">
          <v-list-item-header>
            <v-list-item-title>{{ network.name }}</v-list-item-title>
          </v-list-item-header>
          <v-btn @click="removeChain(network)" prepend-icon="mdi-minus" class="mr-3" color="primary" variant="outlined">Remove</v-btn>
        </v-list-item>
      </v-list>
      <v-card-header>
        <v-card-title class="my-1">
            <strong>Add more networks</strong>
        </v-card-title>
      </v-card-header>
       <v-list three-line >
        <v-list-item v-for="network in availableNetworks" :key="network.name"  :prepend-avatar="network.image">
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
  <v-col >
  <v-card variant="outlined">
    <v-card-header>
        <v-card-title class="my-5">
            <strong>Wallets</strong>
        </v-card-title>
      </v-card-header>
      <v-row>
        <v-col v-for="wallet in portfolio" :key="wallet.name">
        <v-list>
          <v-list-subheader><div class="text-h4">{{wallet.name}}</div></v-list-subheader>
        <v-list-item v-for="address in wallet.addresses" :key="address">
          <v-list-item-header>
            <v-code class="code"> {{address}}</v-code><br/>
          </v-list-item-header>
        </v-list-item>
      </v-list>
        </v-col>
      </v-row>
      
    </v-card>
    

  </v-col>
</v-row>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
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
<style scoped>
.code {
  background-color: #f5f5f5;
  margin-bottom: -150px;
}</style>
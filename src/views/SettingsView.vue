<template>
<div class="d-flex justify-space-between">
  <v-btn variant="default" color="primary" class="mb-3" @click="goBack">
    <v-icon class="mr-3" size="x-large"> mdi-arrow-left </v-icon>
      Back
  </v-btn>
  <v-btn variant="default" color="primary" class="mb-3" @click="save">
    <v-icon class="mr-3" size="x-large"> mdi-content-save </v-icon>
      Save
  </v-btn>
</div>
<v-row>
  <v-col cols="12">
    <v-card color="primary">
      <v-card-header>
        <v-card-title class="my-1">
            <strong>Activated Networks</strong>
        </v-card-title>
      </v-card-header>
      <v-list three-line  >
        <v-list-item  v-for="network in selectedNetworks" :key="network.name" :prepend-avatar="network.image">
          <v-list-item-header>
            <v-list-item-title>{{ network.name }}</v-list-item-title>
          </v-list-item-header>
          <v-btn @click="removeChain(network)" prepend-icon="mdi-minus" class="mr-3" color="primary" variant="outlined">Remove</v-btn>
        </v-list-item>
      </v-list>
      <div :v-if="availableNetworks">
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
      </div>
    </v-card>
  </v-col>
</v-row>
<v-row>
  <v-col >
  <v-card variant="outlined">
    <v-card-header>
        <v-card-title class="my-5">
            <div class="text-h4">Wallets</div>
        </v-card-title>
      </v-card-header>
      <v-row>
        <v-col v-for="wallet in walletes" :key="wallet.name">
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
      <v-card-actions>
        <v-btn @click="accountModal = true" flat color="primary">Edit/Add wallets</v-btn>
      </v-card-actions>
    </v-card>
    

  </v-col>
</v-row>
<v-overlay :model-value="accountModal" class="align-center justify-center">
  <v-card class="modal-card">
    <v-card-title class="my-5">
      <strong>Add a new wallet</strong>
</v-card-title>
<v-card-text><AddWalletForm :handler="closeModal" :seedAccounts="seedAddresses"></AddWalletForm></v-card-text>
    </v-card>
    </v-overlay>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { fromBech32,toBech32 } from "@cosmjs/encoding";
import AddWalletForm from "@/components/AddWalletForm.vue";
export default {
  name: "SettingsView",
  components: { AddWalletForm },
  data() {
    return {
      accountModal: false
    };
  },
  watch() {
    this.wallets
  },
  computed: {
     ...mapGetters({
      wallets: "getWallets",
      seedAddresses: "getSeedAddresses",
      selectedNetworks: "getSelectedNetworks",
      availableNetworks: "getAvailableNetworks",
      networksLoaded: "getIsNetworksLoaded",
      seedAddresses: "getSeedAddresses",
    }),
    walletes() {
      const wallets = [];
      const seedAddresses = this.seedAddresses;
      const selected = this.selectedNetworks;
      for (let address of seedAddresses.filter(address => address.address.length > 0)) {
        let wallet = {name: address.name, addresses: []};
        const decoded = fromBech32(address.address)
        const addresses = selected.map((network) => {
          console.log(network)
          const {  prefix } = network;
          return toBech32(prefix, decoded.data);
        })
        wallet.addresses = addresses;
        wallets.push(wallet);
      }
      console.log(wallets)
  return wallets
    },
  },
  methods: {
    closeModal() {
      this.accountModal = false;
      },
     goBack() {
      this.$router.go(-1);
      
    },
    save () {
      this.$router.go(-1);
      this.refreshBalances(true)
      this.refreshPrices()
    },
    ...mapActions({
      removeChain: "removeChain",
      addChain: "addChain",
      refreshBalances: "refreshBalances",
      refreshPrices: "refreshPrices"
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
}

.modal-card {
  min-width: 400px;
}
</style>
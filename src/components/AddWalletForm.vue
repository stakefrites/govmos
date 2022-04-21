<template>
  <div
    v-for="(account, index) in accounts"
    :key="account"
  >
  <div class="d-flex justify-space-between">
    <div class="text-p my-2">Account #{{ index + 1 }}</div>
  <v-btn @click="removeAccount" variant="outlined" size="x-small" icon="mdi-minus"></v-btn>
  </div>
  <v-text-field
    density="compact"
    clearable
    label="Wallet name"
    v-model="accounts[index].name"
    placeholder="myPersonalWallet"
  >
  </v-text-field>
  <v-text-field
    density="compact"
    clearable
    label="Address"
    v-model="accounts[index].address"
    placeholder="cosmos1zjq5sn0fe78s7fds8lhusjd7dufidjss9geughf7"
  >
  </v-text-field>
</div>
<v-btn prepend-icon="mdi-plus" variant="default" @click="addAccount">
  More
</v-btn>
<div class="mt-5"><v-btn variant="outlined" color="primary" @click="addAddresses">Submit</v-btn></div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "AddWalletForm",
  props: {
    seedAccounts: Array,
    handler : Function
  },
  created() {
    this.accounts = this.seedAccounts;
  },
  data: () => ({
    accounts: [{name: "", address: ""}],
  }),
  methods: {
    ...mapActions({
      saveAccounts: "saveAccounts",
      fetchBalances: "fetchBalances",
    }),
     addAccount() {
      this.accounts.push({ name: "", address: "" });
    },
    removeAccount() {
      this.accounts.pop();
    },
    async addAddresses() {
      this.saveAccounts(this.accounts);
      this.handler();
      await this.fetchBalances();
    },
  },
  computed: {
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>

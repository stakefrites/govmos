<template>
  <v-row>
    <v-col>
      <v-card>
        <v-card-header-text>
          <v-card-title>
            <div class="text-h4 my-10">
              <b>Setup your Trakmos folio</b>
            </div>
          </v-card-title>
        </v-card-header-text>
        <v-expansion-panels v-model="flow.steps" v-if="networksLoaded">
          <Step
            :status="flow.networks.done"
            :number="1"
            name="Choose your favorite networks"
            stepName="networks"
            :handler="finishStep"
          >
            <v-expansion-panel-text>
              <v-list>
                <v-list-item
                  variant="dense"
                  v-for="network in networks"
                  :key="network.name"
                  :prepend-avatar="network.image"
                >
                  <v-list-item-header>
                    <v-list-item-title>{{ network.name }}</v-list-item-title>
                  </v-list-item-header>
                  <div class="d-flex">
                    <v-checkbox
                      hide-details
                      density="compact"
                      v-model="flow.networks.selected"
                      :value="network"
                    />
                  </div>
                </v-list-item>
              </v-list>
            </v-expansion-panel-text>
          </Step>
          <Step
            :status="flow.accounts.done"
            :number="2"
            name="Choose your accounts"
            stepName="accounts"
            :handler="finishStep"
          >
            <v-expansion-panel-text>
              <div
                v-for="(account, index) in flow.accounts.fields"
                :key="account"
              >
                <div class="text-p">Account #{{ index + 1 }}</div>
                <v-text-field
                  density="compact"
                  clearable
                  label="Wallet name"
                  v-model="flow.accounts.fields[index].name"
                  placeholder="myPersonalWallet"
                >
                </v-text-field>
                <v-text-field
                  density="compact"
                  clearable
                  label="Address"
                  v-model="flow.accounts.fields[index].address"
                  placeholder="cosmos1zjq5sn0fe78s7fds8lhusjd7dufidjss9geughf7"
                >
                </v-text-field>
              </div>
              <v-btn flat @click="addAccount">
                <v-icon large>mdi-plus</v-icon>
              </v-btn>
            </v-expansion-panel-text>
          </Step>
          <Step
            :status="flow.networks.done"
            :number="3"
            name="Enjoy the smooth ride"
            stepName="confirm"
            :handler="save"
            last
          >
            <v-expansion-panel-text>
              You are now ready, fellow cosmonaut</v-expansion-panel-text
            >
          </Step>
        </v-expansion-panels>
        <v-progress-linear
          v-else
          indeterminate
          color="primary"
        ></v-progress-linear>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Step from "@/components/Step.vue";
export default {
  name: "SelectChainsView",
  components: { Step },
  data() {
    return {
      flow: {
        steps: [],
        accounts: {
          fields: [
            {
              name: "",
              address: "",
            },
          ],
          done: false,
          next: "confirm",
        },
        networks: {
          done: false,
          selected: [],
          next: "accounts",
        },
      },
    };
  },
  methods: {
    ...mapActions({
      saveAccounts: "saveAccounts",
      saveNetworks: "saveNetworks",
      fetchNetworks: "fetchNetworks",
      fetchBalances: "fetchBalances",
      refreshPrices: "refreshPrices",
    }),
    addAccount() {
      this.flow.accounts.fields.push({ name: "", address: "" });
    },
    finishStep(step) {
      this.flow[step].done = true;
      this.flow.steps = [this.flow[step].next];
    },
    async save() {
      await this.saveAccounts(this.flow.accounts.fields);
      await this.saveNetworks(this.flow.networks.selected);
      this.refreshPrices();
      this.fetchBalances();

      this.$router.push("/");
    },
  },
  async created() {
    await this.fetchNetworks();
    this.flow.networks.selected = this.selectedNetworks;
    this.flow.accounts.fields = this.seedAddresses;
  },
  computed: {
    ...mapGetters({
      networks: "getAllNetworks",
      selectedNetworks: "getSelectedNetworks",
      networksLoaded: "getIsNetworksLoaded",
      seedAddresses: "getSeedAddresses",
    }),
    icon() {
      return this.networksLoaded
        ? "mdi-checkbox-marked-circle-outline"
        : "mdi-alert-circle";
    },
  }
};
</script>

<style scoped></style>

<template>
  <v-row>
    <v-col>
      <v-card>
        <v-card-header-text>
          <v-card-title>
            <div class="text-h4 mt-5">
              <b>Setup your Trakmos folio</b>
            </div>
          </v-card-title>
          <v-alert    closable  type="info" class="ma-5" border>
            <v-alert-title>
              <div class="text-subtitle-1">How does it works?</div>
              </v-alert-title>
            <div class="text-body-2">
            To setup your Trakmos folio, you need to add one (1) single address for each wallet (seed) you own. <br>
            Trakmos will use Bech32 decoding and encoding to figure out all the other addresses linked to that wallet. <br><br>
            <strong>Example: </strong>You have 1 account (We'll name it Personal) with tokens on Cosmos, Akash and Sifchain, and you have one other account (we'll name it Wifes) with tokens on Cosmos and Osmosis.<br><br>
            In that scenario, at the "enter your wallets" step, you would click on the plus sign to enter your first wallet and then name the wallet "Personal" and in the address section you would only enter your cosmos address.<br>
            You would then repeat the process for Wifes. <br><br>
            This should be done for each wallet you own.
            </div>
          </v-alert>
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
                >
                  <v-list-item-header>
                    <v-list-item-title class="mb-10">Select All</v-list-item-title>
                  </v-list-item-header>
                  <div class="d-flex">
                    <v-checkbox
                      density="compact"
                      v-model="selectAll"
                      @change="selectAllNetworks"
                    />
                  </div>
                </v-list-item>
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
            name="Enter your wallets"
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
            name="Select your currency"
            stepName="currency"
            :handler="finishStep"
          >
           <v-radio-group v-model="flow.currency.value">
              <v-radio
                v-for="currency in currencies"
                :key="currency.value"
                :label="currency.text"
                :value="currency">
              </v-radio>
    </v-radio-group>
            
          </Step>
          <Step
            :status="flow.networks.done"
            :number="4"
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
      selectAll: false,
      flow: {
        steps: [],
        currency: {value:  {value: "usd", text: "USD"},next: "confirm", done: false},
        accounts: {
          fields: [
            {
              name: "",
              address: "",
            },
          ],
          done: false,
          next: "currency",
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
      saveCurrency: "saveCurrency",
      fetchNetworks: "fetchNetworks",
      fetchBalances: "fetchBalances",
      refreshPrices: "refreshPrices",
    }),
    selectAllNetworks() {
      if (this.selectAll) {
      this.flow.networks.selected = this.networks
      } else {
        this.flow.networks.selected = []
      }
    },
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
      await this.saveCurrency(this.flow.currency.value);
      this.refreshPrices();
      this.fetchBalances();

      this.$router.push("/");
    },
  },
  async created() {
    await this.fetchNetworks(true);
    this.flow.networks.selected = this.selectedNetworks;
    this.flow.accounts.fields = this.seedAddresses;
  },
  computed: {
    ...mapGetters({
      networks: "getAllNetworks",
      currencies: "getCurrencies",
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

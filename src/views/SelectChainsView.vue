<template>
  <v-row>
    <v-col>
      <v-card>
        <v-card-header-text>
           <v-alert    closable  type="info" class="ma-5" border>
            <v-alert-title>
              <div class="text-subtitle-1"></div>
              </v-alert-title>
            <div class="text-body-2">
            To setup your Trakmos folio, you need to add one (1) single address for each wallet (seed) you own. <br>
            Trakmos will use Bech32 decoding and encoding to figure out all the other addresses linked to that wallet.<br> [This means, you only need to cosmos address and we will figure out the other (akash,osmosis,juno,etc.).]<br><br>
            <ol>
              <li>Select Chains to activate</li>
              <li>Enter your Cosmos wallet address for each seed private key/keplr account/seed and name the wallet.</li>
              <li>Choose your currency.</li>
            </ol> <br>
            </div>
          </v-alert>
          <v-card-title>
            <div class="text-h4 my-10">
              <b>Configure your account</b>
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
            :handler="isFormValid ? finishStep: () => {}"
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
                  @change="validateAddress(flow.accounts.fields[index].address)"
                  :error-messages="errorMessages"
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
import _ from "lodash";
import { fromBech32, toBech32 } from "@cosmjs/encoding";
import { mapActions, mapGetters } from "vuex";
import Step from "@/components/Step.vue";

function compactAccounts(accounts) {
  console.log("compacting accounts", accounts)
  const samePrefix =  accounts.map(account => {
    const {address, name} = account;
    const decoded = fromBech32(address);
    return {address: toBech32("cosmos", decoded.data), name};
  });
  return _.uniqBy(samePrefix,"address");
}

export default {
  name: "SelectChainsView",
  components: { Step },
  data() {
    return {
      errorMessages: '',
      isFormValid: false,
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
      refreshApr: "refreshApr",
    }),
    selectAllNetworks() {
      if (this.selectAll) {
      this.flow.networks.selected = this.networks
      } else {
        this.flow.networks.selected = []
      }
    },
    validateAddress(a) {
      console.log("validating", a)
    try {
      this.isFormValid = true;
      fromBech32(a);
      this.errorMessages =  ''
      return true;
    } catch (error) {
      this.isFormValid = false;
      this.errorMessages =  'Invalid address'
      return "Invalid address";
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
      const accounts = compactAccounts(this.flow.accounts.fields);
      await this.saveAccounts(accounts);
      await this.saveNetworks(this.flow.networks.selected);
      await this.saveCurrency(this.flow.currency.value);
      this.refreshPrices();
      this.refreshApr();
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

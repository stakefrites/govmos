<template>
  <v-row v-if="networksLoaded">
    <v-col>
      <v-card>
        <v-card-header-text>
          <v-card-title>
            <b>Configure your account</b>
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
                      :value="network.name"
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
            <v-expansion-panel-text> </v-expansion-panel-text>
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
import { mapGetters } from "vuex";
import Step from "@/components/Step.vue";
export default {
  name: "SelectChainsView",
  components: { Step },
  data() {
    return {
      flow: {
        steps: [],
        accounts: {
          done: false,
          selected: [],
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
    finishStep(step) {
      this.flow[step].done = true;
      this.flow.steps = [this.flow[step].next];
    },
    save() {
      console.log("saving");
      this.$store.dispatch("saveAccounts", this.flow.accounts.selected);
      this.$store.dispatch("saveNetworks", this.flow.networks.selected);
      this.$router.push("/govmos");
    },
  },
  created() {},
  computed: {
    ...mapGetters({
      networks: "getNetworks",
      networksLoaded: "getIsNetworksLoaded",
      proposalsLoaded: "getIsProposalsLoaded",
      proposals: "getProposalsByName",
    }),
    icon() {
      return this.networksLoaded
        ? "mdi-checkbox-marked-circle-outline"
        : "mdi-alert-circle";
    },
  },
};
</script>

<style scoped></style>

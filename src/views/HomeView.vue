<template>
  <v-row>
    <v-col cols="6" v-for="network in networks" :key="network.name">
      <v-card :loading="networksLoaded">
        <v-card-title>{{ network.name }}</v-card-title>
        <v-card-text v-if="networksLoaded">
          <v-row>
            <v-col>Chain ID: {{ network.chainId }}</v-col>
          </v-row>
          <v-row>
            <v-col>Denom: {{ network.denom }}</v-col>
          </v-row>
          <v-row v-if="proposalsLoaded">
            <v-col>Proposals: {{ proposals(network.name).length }}</v-col>
          </v-row>
        </v-card-text>
        <v-progress-circular
          v-else
          indeterminate
          color="primary"
        ></v-progress-circular>
        <v-card-actions v-if="proposalsLoaded">
          <v-btn :to="`/proposals/${network.name}`">View Proposals</v-btn>
        </v-card-actions>
        <v-progress-circular
          v-else
          indeterminate
          color="primary"
        ></v-progress-circular>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "HomeView",
  components: {},
  data() {},
  created() {},
  computed: {
    ...mapGetters({
      networks: "getNetworks",
      networksLoaded: "getIsNetworksLoaded",
      proposalsLoaded: "getIsProposalsLoaded",
      proposals: "getProposalsByName",
    }),
  },
};
</script>

<style scoped></style>

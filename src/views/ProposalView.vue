<template>
  <v-card variant="outlined">
    <v-card-header> </v-card-header>
    <v-row v-if="proposalsLoaded" align="center" justify="center">
      <v-col>
        <v-list three-line>
          <v-btn variant="text" @click="goBack()">
            <v-icon class="mr-3" size="x-large"> mdi-arrow-left </v-icon>
            Back
          </v-btn>
          <v-list-subheader>
            <div class="text-h4 my-5">Active</div>
          </v-list-subheader>
          <ProposalList
            v-for="proposal in activeProposals"
            :key="proposal.id"
            :proposal="proposal"
          />
          <v-list-item v-if="activeProposals.length == 0"
            >No proposals are active for the time being.</v-list-item
          >
        </v-list>
      </v-col>
    </v-row>
    <v-row v-if="proposalsLoaded" align="center" justify="center">
      <v-col>
        <v-list three-line>
          <v-list-subheader>
            <div class="text-h4 my-5">Archive</div>
          </v-list-subheader>
          <ProposalList
            v-for="proposal in proposals(network)"
            :key="proposal.id"
            :proposal="proposal"
          />
        </v-list>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-progress-linear indeterminate color="primary" class="mt-5">
      </v-progress-linear
    ></v-row>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ProposalList from "@/components/ProposalList.vue";
export default {
  name: "ProposalView",
  components: { ProposalList },
  data() {
    return {
      network: "",
      activeProposals: [],
    };
  },
  computed: {
    ...mapGetters({
      proposals: "getProposalsByName",
      chainId: "getChainIdByName",
      proposalsLoaded: "getIsProposalsLoaded",
    }),
  },
  methods: {
    filterActive() {
      return this.proposals(this.network).filter(
        (proposal) => proposal.status == 1 || proposal.status == 2
      );
    },
    goBack() {
      this.$router.go(-1);
    }
  },
  async created() {
    this.network = this.$route.params.network;
    this.activeProposals = this.filterActive();
    await this.$store.dispatch("changeChainId", this.chainId(this.network));
    this.$watch(
      () => this.$route.params,
      async (toParams) => {
        this.network = toParams.network;
        await this.$store.dispatch("changeChainId", this.chainId(this.network));
      }
    );
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>

<template>
  <v-row align="center" justify="center">
    <Proposal
      v-for="proposal in proposals(network)"
      :key="proposal.id"
      :proposal="proposal"
    />
  </v-row>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Proposal from "@/components/Proposal.vue";
export default {
  name: "ProposalView",
  components: { Proposal },
  data() {
    return {
      network: "",
    };
  },
  computed: {
    ...mapGetters({ proposals: "getProposalsByName" }),
  },
  methods: {},
  async created() {
    this.network = this.$route.params.network;
    this.$watch(
      () => this.$route.params,
      async (toParams) => {
        this.network = toParams.network;
      }
    );
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>

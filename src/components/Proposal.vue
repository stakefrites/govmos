<template>
  <v-col md="12" sm="12" xs="12" lg="6" xl="6">
    <v-card class="scroll" height="400">
      <v-card-title
        ><v-chip small class="mr-3">{{ proposal.proposalId }}</v-chip
        >{{ content.title }}
        <v-chip color="primary" pill class="ml-3">{{
          status
        }}</v-chip></v-card-title
      >
      <v-card-subtitle>{{ type }}</v-card-subtitle>
      <v-list-item three-line>
        <v-list-item-content>
          <v-list-item-title class="text-h5"> Results </v-list-item-title>
          <v-list-item-subtitle>
            <strong>Yes</strong> -
            {{ proposal.finalTallyResult.yes }}
          </v-list-item-subtitle>
          <v-list-item-subtitle>
            <strong>No</strong> -
            {{ proposal.finalTallyResult.no }}
          </v-list-item-subtitle>
          <v-list-item-subtitle>
            <strong>No with veto</strong> -
            {{ proposal.finalTallyResult.noWithVeto }}
          </v-list-item-subtitle>
          <v-list-item-subtitle>
            <strong>Abstain</strong> -
            {{ proposal.finalTallyResult.abstain }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-card-text>{{ content.description }}</v-card-text>
    </v-card>
  </v-col>
</template>

<script>
import Coin from "@/components/Coin.vue";
import { Proposal, TextProposal } from "cosmjs-types/cosmos/gov/v1beta1/gov";
import { Registry } from "@cosmjs/proto-signing";
import { ParameterChangeProposal } from "cosmjs-types/cosmos/params/v1beta1/params";
import { SoftwareUpgradeProposal } from "cosmjs-types/cosmos/upgrade/v1beta1/upgrade";
import { CommunityPoolSpendProposal } from "cosmjs-types/cosmos/distribution/v1beta1/distribution";
import {
  defaultRegistryTypes as defaultStargateTypes,
  SigningStargateClient,
} from "@cosmjs/stargate";

const proposalStatus = (status) => {
  switch (status) {
    case 1:
      return "Deposit";
      break;
    case 2:
      return "Voting";
      break;
    case 3:
      return "Passed";
      break;
    case 4:
      return "Rejected";
      break;
    case 5:
      return "Failed";
      break;
    default:
      break;
  }
};

const proposalType = (type) => {
  switch (type) {
    case "/cosmos.params.v1beta1.ParameterChangeProposal":
      return "Parameter Change";
      break;
    case "/cosmos.distribution.v1beta1.CommunityPoolSpendProposal":
      return "Community Pool Spend";
      break;
    case "/cosmos.gov.v1beta1.TextProposal":
      return "Text";
      break;
    case "/cosmos.gov.v1beta1.SoftwareUpgradeProposal":
      return "Software Upgrade";
      break;
    default:
      break;
  }
};
export default {
  name: "Proposal",
  components: { Coin },
  props: {
    proposal: Object,
  },
  computed: {
    status() {
      return proposalStatus(this.$props.proposal.status);
    },
    registry() {
      const registry = new Registry(defaultStargateTypes);
      registry.register(
        "/cosmos.params.v1beta1.ParameterChangeProposal",
        ParameterChangeProposal
      );
      registry.register("/cosmos.gov.v1beta1.TextProposal", TextProposal);
      registry.register(
        "/cosmos.upgrade.v1beta1.SoftwareUpgradeProposal",
        SoftwareUpgradeProposal
      );
      registry.register(
        "/cosmos.distribution.v1beta1.CommunityPoolSpendProposal",
        CommunityPoolSpendProposal
      );
      return registry;
    },
    content() {
      return this.registry.decode(this.$props.proposal.content);
    },
    type() {
      return proposalType(this.$props.proposal.content.typeUrl);
    },
  },
};
</script>

<style scoped>
.scroll {
  overflow-y: scroll;
}
</style>

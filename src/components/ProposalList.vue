<template>
  <v-list-item variant="contained">
    <v-list-item-avatar left>
      <v-chip class="ma-2" :color="proposalColor" label text-color="white">
        <b>{{ proposal.proposalId.low }}</b>
      </v-chip>
    </v-list-item-avatar>
    <v-list-item-header>
      <v-list-item-title>{{ content.title }}</v-list-item-title>
      <v-list-item-subtitle>{{ type }}</v-list-item-subtitle>
    </v-list-item-header>
    <v-btn
      v-if="statusRaw == 2"
      class="mr-3"
      color="primary"
      variant="outlined"
    >
      Vote
      <v-dialog v-model="dialog" activator="parent">
        <v-card>
          <v-card-text> Cast your vote </v-card-text>
          <v-card-text>
            <v-radio-group v-model="vote" mandatory>
              <v-radio label="Yes" :value="1" v-model="vote"></v-radio>
              <v-radio label="No" :value="3" v-model="vote"></v-radio>
              <v-radio label="No With Veto" :value="4" v-model="vote"></v-radio>
              <v-radio label="Abstain" :value="2" v-model="vote"></v-radio>
            </v-radio-group>
          </v-card-text>

          <v-card-actions>
            <v-btn
              @click="castVote()"
              variant="contained-text"
              color="primary"
              size="large"
            >
              Vote
            </v-btn>
            <v-btn @click="closeDialog()"> Close Dialog </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-btn>
    <v-btn @click="expand = !expand" variant="outlined">
      <v-icon>mdi-eye</v-icon>
    </v-btn>
  </v-list-item>
  <v-expand-transition>
    <div v-if="expand">
      <v-list>
        <v-list-item>{{ fullDescription }}</v-list-item>
        <v-list-item v-if="isDone">
          <BarChart :results="proposal.finalTallyResult" />
        </v-list-item>
      </v-list>
    </div>
  </v-expand-transition>
</template>

<script>
import { mapGetters } from "vuex";
import Coin from "@/components/Coin.vue";
import BarChart from "@/components/BarChart.vue";
import { Proposal, TextProposal } from "cosmjs-types/cosmos/gov/v1beta1/gov";
import { Registry } from "@cosmjs/proto-signing";
import { ClientUpdateProposal } from "cosmjs-types/ibc/core/client/v1/client";
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

const proposalColor = (status) => {
  switch (status) {
    case 1:
      return "green";
      break;
    case 2:
      return "blue";
      break;
    case 3:
      return "green";
      break;
    case 4:
      return "red";
      break;
    case 5:
      return "red";
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
    case "/ibc.core.client.v1.ClientUpdateProposal":
      return "IBC Client Update";
      break;
    default:
      break;
  }
};

const excerpt = (string) => {
  if (string.length > 350) {
    return string.substring(0, 350) + "...";
  } else {
    return string;
  }
};
export default {
  name: "Proposal",
  components: { Coin, BarChart },
  data() {
    return {
      dialog: false,
      vote: 0,
      expand: false,
    };
  },
  props: {
    proposal: Object,
  },
  methods: {
    closeDialog() {
      this.dialog = false;
      this.vote = 0;
    },
    async castVote() {
      const params = {
        proposalId: this.$props.proposal.proposalId,
        option: this.vote,
        voter: this.$store.state.wallet.address,
      };
      console.log(params);
      await this.$store.dispatch("castVote", params);
      this.dialog = false;
      this.vote = "";
    },
    ...mapGetters({
      signingClient: "getSigningClient",
    }),
  },
  computed: {
    status() {
      return proposalStatus(this.$props.proposal.status);
    },
    proposalColor() {
      return proposalColor(this.$props.proposal.status);
    },
    expansionText() {
      return this.expand ? "Hide" : "See More";
    },
    isDone() {
      return (
        this.$props.proposal.status != 1 && this.$props.proposal.status != 2
      );
    },
    statusRaw() {
      return this.$props.proposal.status;
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
      registry.register(
        "/ibc.core.client.v1.ClientUpdateProposal",
        ClientUpdateProposal
      );
      return registry;
    },
    description() {
      return excerpt(this.content.description);
    },
    fullDescription() {
      return this.content.description;
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
  max-height: 100px;
  overflow-y: scroll;
}
</style>

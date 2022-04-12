<template>
  <v-col>
    <v-card width="400">
      <v-card-title>{{ status }}</v-card-title>
      <v-card-text>
        <v-row>
          <v-col>
            <v-toolbar-title>Oui</v-toolbar-title>
            <v-toolbar-title>{{
              proposal.finalTallyResult.yes
            }}</v-toolbar-title>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-toolbar-title>Non</v-toolbar-title>
            <v-toolbar-title>{{
              proposal.finalTallyResult.no
            }}</v-toolbar-title>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-toolbar-title>Veto</v-toolbar-title>
            <v-toolbar-title>{{
              proposal.finalTallyResult.noWithVeto
            }}</v-toolbar-title>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-toolbar-title>Abstain</v-toolbar-title>
            <v-toolbar-title>{{
              proposal.finalTallyResult.abstain
            }}</v-toolbar-title>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-toolbar-title>{{ content }}</v-toolbar-title>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script>
import Coin from "@/components/Coin.vue";
import { fromAscii, fromBase64, fromBech32, fromUtf8 } from "@cosmjs/encoding";
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
    content() {
      console.log(this.$props.proposal.content.value);
      console.log(fromBech32(this.$props.proposal.content.value));
      return "allo";
    },
  },
};
</script>

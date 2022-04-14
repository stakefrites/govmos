<template>
  <v-row v-if="networksLoaded">
    <v-col cols="3" v-for="network in networks" :key="network.name">
      <v-card>
        <v-card-avatar small>
          <v-img class="avatar" :src="network.image"></v-img>
        </v-card-avatar>
        <v-card-title>{{ network.name }}</v-card-title>
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

<style scoped>
.avatar {
  height: 50px;
}
</style>

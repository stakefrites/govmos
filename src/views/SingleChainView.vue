<template>
<div class="text-h1">Router view of {{network}}</div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "SingleChainView",
  components: {  },
  data() {
    return {
      network: "",
    };
  },
  methods: {
    ...mapActions({
    
    }),
  },
   async created() {
    this.network = this.$route.params.network;
    this.$watch(
      () => this.$route.params,
      async (toParams) => {
        this.network = toParams.network;
      }
    );
  },
  computed: {
    ...mapGetters({
     
    }),
  }
};
</script>

<style scoped></style>

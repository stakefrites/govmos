<template>
  <v-expansion-panel :value="stepName">
    <v-expansion-panel-title disable-icon-rotate>
      <v-chip class="mr-2" label text-color="white">
        <b>{{ number }}</b>
      </v-chip>
      {{ name }}
      <template v-slot:actions>
        <v-icon :color="color" :icon="icon"> </v-icon>
      </template>
    </v-expansion-panel-title>

    <v-expansion-panel-text>
      <slot />
      <v-btn flat v-if="last" to="/dsasdsa" @click="emit(stepName)"
        >Finish</v-btn
      >
      <v-btn flat v-else @click="emit(stepName)">Next</v-btn>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script>
export default {
  name: "Step",
  data: () => ({}),
  props: {
    name: String,
    number: Number,
    icon: String,
    status: String,
    networks: Array,
    stepName: String,
    handler: { type: Function },
    last: Boolean,
  },
  methods: {
    emit(stepName) {
      this.handler(stepName);
    },
  },
  computed: {
    icon() {
      return this.status ? "mdi-checkbox-marked-circle" : "mdi-alert-circle";
    },
    color() {
      return this.status ? "green" : "red";
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>

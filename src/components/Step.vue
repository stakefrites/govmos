<template>
	<v-expansion-panel :value="stepName">
		<v-expansion-panel-title disable-icon-rotate>
			<v-chip class="mr-2" label text-color="white">
				<b>{{ number }}</b>
			</v-chip>
			{{ name }}
			<template #actions>
				<v-icon :color="color" :icon="showedIcon"> </v-icon>
			</template>
		</v-expansion-panel-title>

		<v-expansion-panel-text>
			<slot />
			<v-btn v-if="last" flat to="/dashboard" @click="emit(stepName)"
				>Finish</v-btn
			>
			<v-btn v-else flat @click="emit(stepName)">Next</v-btn>
		</v-expansion-panel-text>
	</v-expansion-panel>
</template>

<script>
export default {
	name: "Step",
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
	data: () => ({}),
	computed: {
		showedIcon() {
			return this.status ? "mdi-checkbox-marked-circle" : "mdi-alert-circle";
		},
		color() {
			return this.status ? "green" : "red";
		},
	},
	methods: {
		emit(stepName) {
			this.handler(stepName);
		},
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>

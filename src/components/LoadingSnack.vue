<template>
	<v-snackbar
		:model-value="!isLoaded"
		color="primary"
		timeout="-1"
		variant="contained">
		<div class="text-subtitle2">
			<v-progress-circular
				indeterminate
				color="white"
				class="mr-3"
				size="20"></v-progress-circular>
			Fetching {{ what }}... Please wait.
		</div>
	</v-snackbar>
</template>

<script>
export default {
	name: "LoadingSnack",
	data: () => ({}),
	methods: {},
	computed: {},
	props: {
		isLoaded: {
			type: Boolean,
			required: true,
		},
		what: { type: String },
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>

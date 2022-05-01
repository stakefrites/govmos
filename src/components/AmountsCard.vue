<template>
	<v-card class="mt-5" variant="outlined">
		<v-card-header>
			<v-card-subtitle
				><div class="text-h5">{{ name }}</div></v-card-subtitle
			>
		</v-card-header>
		<div class="d-flex justify-space-around">
			<v-row>
				<v-col lg="3" sm="6">
					<div class="mx-5 mr-10">
						<v-card flat class="px-3 py-6">
							<v-card-subtitle>
								<div class="text-h4">Total</div>
							</v-card-subtitle>
							<v-card-title
								><div class="text-h5">
									<strong>{{ showAmount(total) }}</strong>
								</div></v-card-title
							>
						</v-card>
					</div>
				</v-col>
				<v-divider class="my-6" vertical></v-divider>

				<v-col lg="3" sm="6">
					<div class="mx-2">
						<v-card flat class="px-3 py-6">
							<v-card-subtitle>
								<div class="text-h4">Staked</div>
							</v-card-subtitle>
							<v-card-title
								><div class="text-h5">
									<strong>{{ showAmount(staked) }}</strong>
								</div></v-card-title
							>
						</v-card>
					</div>
				</v-col>
				<v-divider class="my-6" vertical></v-divider>
				<v-col lg="3" sm="6">
					<div class="mx-2">
						<v-card flat class="px-3 py-6">
							<v-card-subtitle>
								<div class="text-h4">Rewards</div>
							</v-card-subtitle>
							<v-card-title
								><div class="text-h5">
									<strong>{{ showAmount(rewards) }}</strong>
								</div></v-card-title
							>
						</v-card>
					</div>
				</v-col>
				<v-divider class="my-6" vertical></v-divider>
				<v-col lg="3" sm="6">
					<div class="mx-2">
						<v-card flat class="px-3 py-6">
							<v-card-subtitle>
								<div class="text-h4">Liquid</div>
							</v-card-subtitle>
							<v-card-title
								><div class="text-h5">
									<strong>{{ showAmount(liquid) }}</strong>
								</div></v-card-title
							>
						</v-card>
					</div>
				</v-col>
			</v-row>
		</div>
	</v-card>
</template>

<script>
import { mapGetters } from "vuex";
export default {
	name: "AmountsCard",
	props: {
		isTotal: {
			type: Boolean,
			default: false,
		},
		name: {
			type: String,
			default: "",
		},
		wallet: {
			type: Object,
			default: null,
		},
	},
	data: () => ({
		total: 0,
		staked: 0,
		liquid: 0,
		rewards: 0,
	}),
	created() {
		if (this.isTotal) {
			this.total = this.totalValue.total;
			this.staked = this.totalValue.staked;
			this.rewards = this.totalValue.rewards;
			this.liquid = this.totalValue.liquid;
		} else {
			this.total = this.wallet.value;
			this.staked = this.wallet.staked;
			this.rewards = this.wallet.rewards;
			this.liquid = this.wallet.liquid;
		}
	},
	methods: {
		showAmount(amount) {
			const value = parseFloat(amount).toFixed(2);
			const text = this.currency.text;
			return `${value} ${text}`;
		},
	},
	computed: {
		...mapGetters({
			totalValue: "getTotalValue",
			currency: "getCurrency",
		}),
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>

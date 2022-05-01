<template>
	<v-row>
		<v-col>
			<v-card flat>
				<v-card-title>
					<div class="text-h5 ma-3">Wallets</div>
				</v-card-title>
				<v-card-text class="">
					<v-row>
						<v-col v-for="wallet in wallets" :key="wallet.name">
							{{ wallet.name }} <br />
							{{ wallet.address }}
						</v-col>
					</v-row>
				</v-card-text>
			</v-card>
		</v-col>
	</v-row>
	<v-row>
		<v-col>
			<v-card flat>
				<v-card-title>
					<div class="text-h5 ma-3">Active Networks</div>
				</v-card-title>
				<v-card-text>
					<v-row class="d-flex justify-space-around">
						<v-col v-for="network in networks" :key="network.name">
							<v-card flat variant="outlined">
								<v-card-text class="d-flex justify-center">
									<v-img class="avatar" :src="network.image"></v-img>
								</v-card-text>
							</v-card>
						</v-col>
					</v-row>
				</v-card-text>
			</v-card>
		</v-col>
	</v-row>
	<v-row>
		<v-col>
			<v-card flat>
				<v-card-title>
					<div class="text-h5 ma-3">Your holdings</div>
				</v-card-title>
				<v-card-text>
					<v-row>
						<v-col sm="6" md="4" lg="3" v-for="coin in total" :key="coin.name">
							<v-card variant="contained" color="primary">
								<v-card-header>
									<v-card-avatar color="white">
										<v-img
											class="avatar"
											v-if="!coin.denom.includes('gamm')"
											:src="tokens[coin.denom].image"></v-img>
										<v-avatar
											density="compact"
											color="white"
											size="large"
											v-else
											><span class="text-dark text-h6">{{
												coin.denom.split("/")[2]
											}}</span></v-avatar
										>
									</v-card-avatar>
									<v-card-title v-if="!coin.denom.includes('gamm')"
										>{{ tokens[coin.denom].name }}
									</v-card-title>
									<v-card-title v-else>{{ coin.symbol }} </v-card-title>
								</v-card-header>
								<v-card-text>
									<span class="text-body-2" v-if="!coin.denom.includes('gamm')"
										>{{
											parseFloat(
												coin.amount / Math.pow(10, tokens[coin.denom].decimals)
											).toFixed(2)
										}}
										{{ tokens[coin.denom].symbol }}</span
									>
									<span class="text-body-2" v-else>{{
										parseFloat(coin.amount).toFixed(2)
									}}</span>
									<div v-if="!coin.denom.includes('gamm')" class="text-body-2">
										{{ parseFloat(price(coin.denom)).toFixed(3) }}
										{{ currency.text }}
									</div>
								</v-card-text>
							</v-card>
						</v-col>
					</v-row>
				</v-card-text>
			</v-card>
		</v-col>
	</v-row>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
	name: "NewDash",
	data: () => ({}),
	async created() {
		await this.fetchTokens();
		await this.fetchBalances();
	},
	methods: {
		...mapActions({
			fetchBalances: "fetchBalances",
			fetchTokens: "fetchTokens",
		}),
	},
	computed: {
		...mapGetters({
			total: "getTotal",
			tokens: "getTokens",
			networks: "getSelectedNetworks",
			wallets: "getWallets",
			price: "getPriceByName",
			currency: "getCurrency",
		}),
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.avatar {
	width: 50px;
	height: 50px;
}
</style>

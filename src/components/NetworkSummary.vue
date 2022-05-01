<template>
	<!-- NEW network info vue -->
	<v-col xs="12" sm="6" md="6" lg="4" xl="4">
		<v-card
			dark
			variant="outlined"
			class="rounded-lg"
			:loading="networksLoaded"
		>
			<v-overlay
				:model-value="!balancesLoaded"
				contained
				class="align-center justify-center"
			>
				<v-card dark class="pa-4">
					<v-card-title>
						<strong>Loading balances 🥩</strong>
					</v-card-title>
					<v-progress-linear indeterminate color="primary"></v-progress-linear>
				</v-card>
			</v-overlay>
			<v-card-title>
				<v-avatar size="50" class="mr-3">
					<img height="35" :src="network.image" />
				</v-avatar>

				<div class="vcard_title_div d-flex justify-space-between">
					<div class="d-flex justify-center apr" v-if="aprLoaded">
						<div class="mt-3 text-body-2" v-if="apr(network.name) != 0" label>
							{{
								apr(network.name) == 0 || apr(network.name) == null
									? ""
									: parseFloat(apr(network.name) * 100).toFixed(0) + " %"
							}}
						</div>
					</div>
					<div v-else class="d-flex justify-center">
						<v-progress-circular
							size="small"
							width="3"
							indeterminate
						></v-progress-circular>
					</div>
					<div class="card_title_chips_div">
						<v-chip-group v-model="selected" mandatory>
							<v-chip
								class="ma-2 vchip_card"
								color="primary"
								value="denom"
								label
								>{{ network.symbol }}</v-chip
							>
							<v-chip
								class="ma-2 vchip_card"
								color="primary"
								value="base"
								label
								>{{ currency.text }}</v-chip
							>
						</v-chip-group>
					</div>
				</div>
			</v-card-title>
			<v-divider></v-divider>
			<v-card-text class="mt-3 mb-3">
				<div class="d-flex justify-space-between">
					<div class="cardtext_row cardtext_row_title text-body-2">
						Available
					</div>
					<div class="vcard_dot"></div>
					<div class="text-body-2">{{ show(liquid) }}</div>
				</div>
				<div class="d-flex justify-space-between">
					<div class="cardtext_row cardtext_row_title text-body-2">Staked</div>
					<div class="vcard_dot"></div>
					<div class="text-body-2">{{ show(staked) }}</div>
				</div>
				<div class="d-flex justify-space-between">
					<div class="cardtext_row cardtext_row_title text-body-2">Rewards</div>
					<div class="vcard_dot"></div>
					<div class="cardtext_row cardtext_row_var text-body-2">
						{{ show(rewards) }}
					</div>
				</div>
				<div
					v-if="network.name === 'osmosis'"
					class="d-flex justify-space-between"
				>
					<div class="cardtext_row cardtext_row_title text-body-2">
						Bonded Equivalent
					</div>
					<div class="vcard_dot"></div>
					<div class="cardtext_row cardtext_row_var text-body-2">
						{{ show(bonded) }}
					</div>
				</div>
			</v-card-text>
			<v-card-text>
				<v-list density="compact">
					<v-list-item
						v-for="token in foreignTokens(network.name)"
						:key="token"
					>
						<v-avatar class="mr-3">
							{{ token[token.denom] }}
							<v-img class="avatar" :src="tokens[token.denom].image"></v-img>
						</v-avatar>
						<v-list-item-title>
							<div class="mr-1">
								{{
									selected === "denom"
										? parseCoin(token)
										: value(parseCoin(token) * price(token.denom))
								}}
							</div>
						</v-list-item-title>
						<v-list-item-subtitle>{{
							selected === "denom" ? tokens[token.denom].symbol : currency.text
						}}</v-list-item-subtitle>
					</v-list-item>
				</v-list>
			</v-card-text>
			<v-divider></v-divider>
			<v-card-actions class="vcard_action d-flex justify-space-evenly">
				<!-- <v-btn class="vcard_action_btn_right">🥩 🍟 <v-icon class="vcard_action_icon ml-1" icon="mdi-information-outline"></v-icon></v-btn> -->
				<div class="text-body-1">
					<div v-if="pricesLoaded" class="text-body-1">
						{{ parseFloat(price(network.denom)).toFixed(5) }}
						{{ currency.text }}
					</div>
				</div>
				<v-divider vertical></v-divider>
				<div class="vcard_action_btn_left font-weight-bold">
					{{ show(total) }}
				</div>
			</v-card-actions>
		</v-card>
	</v-col>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import _ from "lodash";
export default {
	name: "NetworkSummary",
	props: {
		network: {
			type: Object,
			required: true,
		},
		wallet: {
			type: String,
		},
	},
	data: () => ({ apy: 0, selected: "denom", stakedVal: 0, liquidVal: 0 }),
	async created() {},
	methods: {
		...mapActions({}),
		parseDecimals(coin, decimals, precision) {
			return parseFloat(parseInt(coin) / Math.pow(10, decimals)).toFixed(
				precision
			);
		},

		parseCoin(coin) {
			const decimals = this.tokens[coin.denom].decimals;
			return this.parseDecimals(coin.amount, decimals, 2);
		},
		show: function (amount) {
			const balance = amount;
			const value =
				this.selected === "denom"
					? parseFloat(balance).toFixed(2)
					: this.value(balance * this.price(this.network.base));
			const text = this.selected === "denom" ? this.network.symbol : "";
			return `${value} ${text}`;
		},
		value(amount) {
			let locale = "en-US";
			if (this.currency.value === "cad") {
				locale = "fr-CA";
			} else if (this.currency.value === "eur") {
				locale = "fr-FR";
			}
			let intl = new Intl.NumberFormat(locale, {
				style: "currency",
				currency: this.currency.value,
				minimumFractionDigits: 2,
			});
			return intl.format(amount);
		},
	},
	computed: {
		...mapGetters({
			networksLoaded: "getIsNetworksLoaded",
			pricesLoaded: "getIsPricesLoaded",
			aprLoaded: "getIsAprLoaded",
			balancesLoaded: "getIsBalancesLoaded",
			totalValue: "getTotalValue",
			balances: "getBalancesByName",
			price: "getPriceByName",
			image: "getImageByName",
			apr: "getAprByName",
			currency: "getCurrency",
			amount: "getAmountByWalletAndNetwork",
			foreignTokens: "getForeignTokensByNetworkName",
			tokens: "getTokens",
		}),

		staked() {
			const balance =
				this.wallet === "All"
					? this.balances(this.network.name).staked
					: this.amount({
							walletName: this.wallet,
							denom: this.network.name,
					  }).staked;
			return balance;
		},
		bonded() {
			const balance =
				this.wallet === "All"
					? this.balances(this.network.name).bonded
					: this.amount({
							walletName: this.wallet,
							denom: this.network.name,
					  }).bonded;
			return balance;
		},
		rewards() {
			const balance =
				this.wallet === "All"
					? this.balances(this.network.name).rewards
					: this.amount({
							walletName: this.wallet,
							denom: this.network.name,
					  }).rewards;
			return balance;
		},
		liquid() {
			const balance =
				this.wallet === "All"
					? this.balances(this.network.name).liquid
					: this.amount({
							walletName: this.wallet,
							denom: this.network.name,
					  }).liquid;
			return balance;
		},

		total() {
			const balance =
				this.wallet === "All"
					? this.balances(this.network.name).total
					: this.amount({
							walletName: this.wallet,
							denom: this.network.name,
					  }).total;

			return balance;
		},

		foreign() {
			const balance =
				this.wallet === "All"
					? this.balances(this.network.name).foreign
					: this.amount({
							walletName: this.wallet,
							denom: this.network.name,
					  }).foreign;
			return balance;
		},
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.avatar {
	width: 25px;
	height: 25px;
}
.vcard_title_div {
	width: 100%;
}
.vchip_card_selected {
	border: 1px solid;
	font-weight: bold;
}
.vcard_dot {
	border-bottom: thin dotted gray;
	width: 34%;
	height: 16px;
}

.network-card {
	max-height: 15px !important;
}

.apr {
	font-size: 10px !important;
	color: #9e9e9e;
	margin-left: -3px;
}
/*.vcard_action:hover {
  background-color: #fff;
  color: rgb(242,109,120);
}
.vcard_action_btn {
  display: flex;
  justify-content: space-around;
  width: 100%;
}
.vcard_action_btn:hover {
  background-color: #fff;
  color: rgb(242,109,120);
} */
.cardtext_row {
}
.vcard_action_icon {
	color: #00000099;
}
</style>

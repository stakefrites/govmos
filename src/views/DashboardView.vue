<template>
	<v-row>
		<v-col>
			<div class="d-flex justify-space-between">
				<v-row>
					<v-col>
						<div class="text-h1 my-10">Trakfolio</div>
					</v-col>
					<v-col v-if="!mobile">
						<div class="text-h2 my-10 d-flex justify-end">
							{{ total(selected) }}
						</div>
					</v-col>
					<v-col v-else>
						<div class="text-h2 my-3 d-flex justify-start">
							{{ total(selected) }}
						</div>
					</v-col>
				</v-row>
			</div>
		</v-col>
	</v-row>
	<v-row v-if="!mobile">
		<v-col>
			<div class="d-flex justify-start">
				<v-chip-group mandatory v-model="selected">
					<v-chip
						size="large"
						class="mx-1 vchip_card"
						@click="changeValue"
						color="primary"
						value="All"
						label
						>All</v-chip
					>
					<v-chip
						size="large"
						v-for="wallet in totalValue.wallets"
						@click="changeValue"
						:key="wallet.name"
						class="mx-1 vchip_card"
						color="primary"
						:value="wallet.name"
						label
						>{{ wallet.name }}</v-chip
					>
				</v-chip-group>
			</div>
		</v-col>
		<v-col>
			<div class="d-flex justify-end">
				<v-chip
					label
					class="mx-1"
					@click="refreshPrices"
					prepend-icon="mdi-currency-usd"
					append-icon="mdi-refresh"
					>{{ showTime(priceTime) }}</v-chip
				>
				<v-chip
					label
					class="mx-1"
					@click="refreshBalances"
					prepend-icon="mdi-account-cash"
					append-icon="mdi-refresh"
					>{{ showTime(priceTime) }}</v-chip
				>
			</div>
		</v-col>
	</v-row>
	<v-row v-else class="d-flex flex-row justify-space-between">
		<v-col>
			<v-chip-group mandatory v-model="selected">
				<v-chip
					size="large"
					class="mx-1 vchip_card"
					color="primary"
					value="All"
					label
					>All</v-chip
				>
				<v-chip
					size="large"
					v-for="wallet in totalValue.wallets"
					:key="wallet.name"
					class="mx-1 vchip_card"
					color="primary"
					:value="wallet.name"
					label
					>{{ wallet.name }}</v-chip
				>
			</v-chip-group>
		</v-col>
		<v-col class="d-flex">
			<v-chip
				size="large"
				label
				class="mx-1"
				@click="refreshPrices"
				prepend-icon="mdi-currency-usd"
				append-icon="mdi-refresh"
				>{{ showTime(priceTime) }}</v-chip
			>
			<v-chip
				size="large"
				label
				class="mx-1"
				@click="refreshBalances"
				prepend-icon="mdi-account-cash"
				append-icon="mdi-refresh"
				>{{ showTime(priceTime) }}</v-chip
			>
		</v-col>
	</v-row>
	<v-row class="d-flex flex-row">
		<DashboardSummary :selected="selected" />
	</v-row>
	<v-row>
		<NetworkSummary
			:wallet="selected"
			v-for="network in selectedNetworks"
			:key="network.name"
			:network="network"
		></NetworkSummary>
	</v-row>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
import NetworkSummary from "@/components/NetworkSummary.vue";
import PieChart from "@/components/BarChart.vue";
import AmountsCard from "@/components/AmountsCard.vue";
import DashboardSummary from "@/components/DashboardSummary.vue";
import _ from "lodash";
export default {
	name: "DashboardView",
	components: { NetworkSummary, PieChart, AmountsCard, DashboardSummary },
	data() {
		return {
			model: [],
			selected: "All",
		};
	},
	async created() {
		if (this.seedAddresses.length === 0 || this.selectedNetworks.length === 0) {
			this.$router.push("/select");
		}
	},
	methods: {
		changeValue() {
			this.changeSelectedWallet(this.selected);
		},
		total(filter) {
			if (filter === "All") {
				return this.value(this.totalValue.total);
			} else {
				return this.value(
					_.keyBy(this.totalValue.wallets, "name")[filter].total
				);
			}
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
		...mapActions({
			fetchNetworks: "fetchNetworks",
			setAlert: "setDashboardAlert",
			refreshPrices: "refreshPrices",
			refreshBalances: "refreshBalances",
			changeSelectedWallet: "changeSelectedWallet",
		}),
		showTime(time) {
			const unixStamp = time - 1000 * 60 * 60;
			return this.mobile
				? moment(parseInt(unixStamp)).format("HH:mm")
				: moment(parseInt(unixStamp)).format("DD/MM HH:mm");
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
			selectedNetworks: "getSelectedNetworks",
			totalValue: "getTotalValue",
			currency: "getCurrency",
			balances: "getBalancesByName",
			networksLoaded: "getIsNetworksLoaded",
			balancesLoaded: "getIsBalancesLoaded",
			seedAddresses: "getSeedAddresses",
			showAlert: "getDashboardAlert",
			balanceTime: "getBalanceExpireTime",
			priceTime: "getLastPriceTime",
			selectedWallet: "getSelectedWallet",
		}),
		mobile() {
			console.log(this.$vuetify.display.sm);
			return this.$vuetify.display.xs || this.$vuetify.display.sm;
		},
	},
};
</script>

<style scoped>
.code {
	background-color: #f5f5f5;
}
</style>

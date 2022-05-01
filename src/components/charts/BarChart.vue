<template>
	<div class="chart-div">
		<Doughnut
			:chart-options="chartOptions"
			:chart-data="chartData"
			:chart-id="chartId"
			:dataset-id-key="datasetIdKey"
			:plugins="plugins"
			:css-classes="cssClasses"
			:styles="styles"
			:width="width"
			:height="height" />
	</div>
</template>

<script>
import { Bar, Doughnut } from "vue-chartjs";
import {
	Chart as ChartJS,
	Title,
	Tooltip,
	Legend,
	BarElement,
	CategoryScale,
	LinearScale,
	ArcElement,
} from "chart.js";

ChartJS.register(
	Title,
	Tooltip,
	Legend,
	ArcElement,
	CategoryScale,
	LinearScale
);

export default {
	name: "DougnutChart",
	components: { Doughnut },
	props: {
		results: {
			type: Array,
			required: true,
		},
		chartId: {
			type: String,
			default: "bar-chart",
		},
		datasetIdKey: {
			type: String,
			default: "label",
		},
		cssClasses: {
			default: "chart-div",
			type: String,
		},
		styles: {
			type: Object,
			default: () => {},
		},
		plugins: {
			type: Object,
			default: () => {},
		},
	},
	mounted() {
		this.chartData.datasets = [{ data: this.dataSet }];
		this.chartData.labels = this.labels;
		this.chartOptions = this.results.options;
		this.width = 50;
		this.height = 50;
	},
	computed: {
		dataSet() {
			return this.results.map((item) => item.value);
		},
		labels() {
			return this.results.map((item) => item.name);
		},
	},

	data() {
		return {
			width: 50,
			height: 50,
			chartData: {
				labels: [],
				datasets: [
					{
						data: [],
						backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#36A2EB"],
					},
				],
			},
			chartOptions: {
				responsive: true,
				maintainAspectRatio: true,
			},
		};
	},
};
</script>

<style scoped>
.chart-div {
	width: 250px !important;
}
</style>

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
      :height="height"
    />
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
      type: Object,
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
    this.chartOptions = this.results.options;
    this.width = 100;
    this.height = 100;
  },
  computed: {
    dataSet() {
      const { yes, no, noWithVeto, abstain } = this.results;
      return [yes, no, noWithVeto, abstain].map((val) => parseInt(val));
    },
    yes() {
      console.log(this.results.yes);
      return parseInt(this.results.yes);
    },
  },

  data() {
    return {
      width: 100,
      height: 100,
      chartData: {
        labels: ["Yes", "No", "No with veto", "Abstain"],
        datasets: [
          {
            data: [],
            backgroundColor: [
              "#4CAF50",
              "#B00020",
              "rgb(255, 25, 12)",
              "rgb(54, 162, 235)",
            ],
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

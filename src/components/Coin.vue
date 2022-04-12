<template>
  <span>
    <span class="amount mr-1">{{ showAmount(amount, decimals) }}</span>
    <span class="denom">{{ showDenom(denom) }}</span>
  </span>
</template>

<script>
import _ from "lodash";
export default {
  name: "Coin",
  data: () => ({}),
  props: {
    amount: {
      type: Number,
      default: 0,
    },
    decimals: {
      type: Number,
      default: 0,
    },
    denom: {
      type: String,
      default: "",
    },
  },
  methods: {
    showDenom(denom) {
      console.log("denom", denom);
      if (!denom) return;

      if (denom.startsWith("base")) {
        return denom.slice(4).toUpperCase();
      } else if (["u", "a", "n"].includes(denom[0])) {
        return denom.slice(1).toUpperCase();
      }
      return denom.toUpperCase();
    },
    showAmount(amount, decimals) {
      if (!decimals) {
        decimals = 6;
      }
      let amountFmt = (amount / Math.pow(10, decimals)).toFixed(2);
      return amountFmt;
    },
  },

  computed: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>

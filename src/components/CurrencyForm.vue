<template>
 <v-radio-group v-model="currencyValue">
              <v-radio
                v-for="currency in currencies"
                :key="currency.value"
                :label="currency.text"
                :value="currency">
              </v-radio>
    </v-radio-group>
    <v-btn @click="save" variant="outlined" flat>Save currency</v-btn>
</template>

<script>
import {mapGetters, mapActions} from "vuex";
export default {
  name: "CurrencyForm",
  props: {
    handler: Function,
  },
  data: () => ({
    currencyValue: {
      value: "usd",
      text: "USD",
    },
  }),
  methods: {
    ...mapActions({
      saveCurrency: "saveCurrency",
    }),
    async save() {
      await this.saveCurrency(this.currencyValue);
      this.handler();
      

    }
  },
  created() {
    this.currencyValue = this.currency;
  },
  computed: {
    ...mapGetters({
      currencies: "getCurrencies",
      currency: "getCurrency",
    }),
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>

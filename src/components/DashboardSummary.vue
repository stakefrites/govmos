<template>
<!-- NEW network info vue -->
  <v-col  xs="12" sm="12" md="12" lg="12" xl="12">
    <v-card color="secondary" variant="contained" class="rounded-lg" :loading="networksLoad">
      <v-card-title>
        <div class="text-h6">Summary</div>
        <div class="vcard_title_div d-flex justify-end">
          <div class="card_title_chips_div">
            <v-chip-group mandatory v-model="selected">
              <v-chip class="ma-2 vchip_card " color="primary" value="All" label>All</v-chip>
              <v-chip v-for="wallet in totalValue.wallets" :key="wallet.name" class="ma-2 vchip_card " color="primary" :value="wallet.name" label>{{wallet.name}}</v-chip>
           <!--  <v-chip class="ma-2 vchip_card " color="primary" value="denom" label>{{network.symbol}}</v-chip>
            <v-chip class="ma-2 vchip_card" color="primary"  value="base" label>{{currency.text}}</v-chip> -->
            </v-chip-group>
          </div>
        </div>
      </v-card-title>
      <v-card-text class="mt-3 mb-3">
        <div class="d-flex justify-space-between">
          <div class="cardtext_row cardtext_row_title text-body-1">Available</div>
          <div class="vcard_dot"></div>
          <div class="text-body-2">{{liquid(selected)}}</div>
        </div>
        <div class="d-flex justify-space-between">
          <div class="cardtext_row cardtext_row_title text-body-1">Staked</div>
          <div class="vcard_dot"></div>
          <div class="text-body-2">{{staked(selected)}}</div>
        </div>
        <div class="d-flex justify-space-between">
          <div class="cardtext_row cardtext_row_title text-body-1">Rewards</div>
          <div class="vcard_dot"></div>
          <div class="cardtext_row cardtext_row_var text-body-2">{{ rewards(selected) }}</div>
        </div>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="vcard_action d-flex justify-space-evenly">
        <!-- <v-btn class="vcard_action_btn_right">🥩 🍟 <v-icon class="vcard_action_icon ml-1" icon="mdi-information-outline"></v-icon></v-btn> -->
        <div class="text-h6">🥩 🍟</div>
        <v-divider vertical></v-divider>
        <div class="vcard_action_btn_left font-weight-bold">{{total(selected)}}</div>
      </v-card-actions>
    </v-card>
  </v-col>
</template>

<script>
import _ from "lodash"
import { mapGetters } from "vuex";
export default {
  name: "DashboardSummary",
  props: {
    network: {
      type: Object,
      required: true,
    },
  },
  data: () => ({ 
    selected: "All" ,
    }),
  async created() {
    
  },
  methods: {
    total (filter) {
      console.log(filter,this.totalValue, _.keyBy(this.totalValue.wallets, "name") )
      if (filter === "All") {
        return  this.value(this.totalValue.total)
      } else {
        return this.value(_.keyBy(this.totalValue.wallets, "name")[filter].value)
      }
    },
    staked(filter) {
      if (filter === "All") {
        return this.value(this.totalValue.staked)
      } else {
        const wallets = _.keyBy(this.totalValue.wallets, "name")
        return this.value(wallets[filter].staked)
      }
    },
    liquid(filter) {
      if (filter === "All") {
        return this.value(this.totalValue.liquid)
      } else {
        const wallets = _.keyBy(this.totalValue.wallets, "name");
        return this.value(wallets[filter].liquid)
      }
    },
    rewards(filter) {
      if (filter === "All") {
        return this.value(this.totalValue.rewards)
      } else {
        const wallets = _.keyBy(this.totalValue.wallets, "name");
        return this.value(wallets[filter].rewards)
      }
    },
    value(amount) {
      return parseFloat(amount).toFixed(2) + " " + this.currency.text
    },

  },
  computed: {
    ...mapGetters({
      networksLoaded: "getIsNetworksLoaded",
      pricesLoaded: "getIsPricesLoaded",
      balancesLoaded: "getIsBalancesLoaded",
      balances: "getBalancesByName",
      price: "getPriceByCurrencyByName",
      image: "getImageByName",
      currency: "getCurrency",
      totalValue: "getTotalValue",
    }),
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.vcard_title_div {
  width: 100%;
}
.vchip_card_selected {
  border: 1px solid;
  font-weight: bold;
}
.vcard_dot {
  border-bottom: thin dotted black;
  width: 50%;
  height: 16px
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

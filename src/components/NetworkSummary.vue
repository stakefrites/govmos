<template>
<!-- NEW network info vue -->
  <v-col xs="12" sm="6" md="4" lg="4" xl="4">
    <v-card dark variant="outlined" class="rounded-lg" :loading="networksLoad">
      <v-card-title>
        <v-avatar size="50" class="mr-3">
          <img height="35" :src="image(network.name)" />
        </v-avatar>
        <div class="vcard_title_div d-flex justify-end">
          <div class="card_title_chips_div">
            <v-chip-group v-model="selected">
            <v-chip class="ma-2 vchip_card " color="primary" value="denom" label>{{network.symbol}}</v-chip>
            <v-chip class="ma-2 vchip_card" color="primary"  value="base" label>{{currency.text}}</v-chip>
            </v-chip-group>
          </div>
        </div>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="mt-3 mb-3">
        <div class="d-flex justify-space-between">
          <div class="cardtext_row cardtext_row_title">Available</div>
          <div class="vcard_dot"></div>
          <div>{{liquid}}</div>
        </div>
        <div class="d-flex justify-space-between">
          <div class="cardtext_row cardtext_row_title">Staked</div>
          <div class="vcard_dot"></div>
          <div>{{staked}}</div>
        </div>
        <div class="d-flex justify-space-between">
          <div class="cardtext_row cardtext_row_title">Rewards</div>
          <div class="vcard_dot"></div>
          <div class="cardtext_row cardtext_row_var">{{ rewards }}</div>
        </div>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="vcard_action d-flex justify-space-evenly">
        <!-- <v-btn class="vcard_action_btn_right">🥩 🍟 <v-icon class="vcard_action_icon ml-1" icon="mdi-information-outline"></v-icon></v-btn> -->
        <div class="text-h6">🥩 🍟</div>
        <v-divider vertical></v-divider>
        <div class="vcard_action_btn_left font-weight-bold">{{total}}</div>
      </v-card-actions>
    </v-card>
  </v-col>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "NetworkSummary",
  props: {
    network: {
      type: Object,
      required: true,
    },
  },
  data: () => ({ apy: 0,
  selected: "denom" }),
  async created() {
    console.log(this.price(this.network.name));
  },
  methods: {},
  computed: {
    ...mapGetters({
      networksLoaded: "getIsNetworksLoaded",
      pricesLoaded: "getIsPricesLoaded",
      balancesLoaded: "getIsBalancesLoaded",
      balances: "getBalancesByName",
      price: "getPriceByCurrencyByName",
      image: "getImageByName",
      currency: "getCurrency",
    }),
    staked: function() {
      const value =this.selected == 'denom' ? parseFloat(this.balances(this.network.name).staked).toFixed(2) : parseFloat(this.balances(this.network.name).staked * this.price(this.network.name)).toFixed(2);
      const text =this.selected == 'denom' ?  this.network.symbol : this.currency.text 
      return `${value} ${text}`;
    },
     rewards: function() {
      const value = this.selected == 'denom' ? parseFloat(this.balances(this.network.name).rewards).toFixed(2) : parseFloat(this.balances(this.network.name).rewards * this.price(this.network.name)).toFixed(2);
      const text =this.selected == 'denom' ?  this.network.symbol : this.currency.text 
      return `${value} ${text}`;
    },
     liquid: function() {
      const value =  this.selected == 'denom' ? parseFloat(this.balances(this.network.name).liquid).toFixed(2) : parseFloat(this.balances(this.network.name).liquid * this.price(this.network.name)).toFixed(2);
      const text =this.selected == 'denom' ?  this.network.symbol : this.currency.text 
      return `${value} ${text}`;
    },
     total: function() {
      const value =  this.selected == 'denom' ? parseFloat(this.balances(this.network.name).total).toFixed(2) : parseFloat(this.balances(this.network.name).total * this.price(this.network.name)).toFixed(2);
      const text =this.selected == 'denom' ?  this.network.symbol : this.currency.text 
      return `${value} ${text}`;
      
    },
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
  border-bottom: thin dotted gray;
  width: 34%;
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
  color: #000;
}
.vcard_action_icon {
  color: #00000099;
}
</style>

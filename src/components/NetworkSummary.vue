<template>
<!-- NEW network info vue -->
  <v-col xs="12" sm="6" md="6" lg="4" xl="4">
    <v-card dark variant="outlined" class="rounded-lg" :loading="networksLoaded">
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
          <div class="d-flex justify-center apr" v-if="aprLoaded" ><div class="mt-3 text-body-2" v-if="apr(network.name) != 0" label>{{apr(network.name) == 0 || apr(network.name) == null  ? "" :  parseFloat(apr(network.name) * 100).toFixed(0) + " %" }}</div></div>
          <div v-else class="d-flex justify-center"><v-progress-circular size="small" width="3"  indeterminate></v-progress-circular></div>
          <div class="card_title_chips_div">
            <v-chip-group v-model="selected" mandatory>
            <v-chip class="ma-2 vchip_card " color="primary" value="denom" label>{{network.symbol}}</v-chip>
            <v-chip class="ma-2 vchip_card" color="primary"  value="base" label>{{currency.text}}</v-chip>
            </v-chip-group>
          </div>
        </div>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="mt-3 mb-3">
        <div class="d-flex justify-space-between">
          <div class="cardtext_row cardtext_row_title  text-body-2">Available</div>
          <div class="vcard_dot"></div>
          <div class="text-body-2">{{liquid}}</div>
        </div>
        <div class="d-flex justify-space-between">
          <div class="cardtext_row cardtext_row_title  text-body-2">Staked</div>
          <div class="vcard_dot"></div>
          <div class="text-body-2">{{staked}}</div>
        </div>
        <div class="d-flex justify-space-between">
          <div class="cardtext_row cardtext_row_title  text-body-2">Rewards</div>
          <div class="vcard_dot"></div>
          <div class="cardtext_row cardtext_row_var text-body-2">{{ rewards }}</div>
        </div>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="vcard_action d-flex justify-space-evenly">
        <!-- <v-btn class="vcard_action_btn_right">🥩 🍟 <v-icon class="vcard_action_icon ml-1" icon="mdi-information-outline"></v-icon></v-btn> -->
        <div class="text-body-1">
          <div v-if="pricesLoaded" class="text-body-1">{{parseFloat(price(network.name)).toFixed(5)}} {{currency.text}}</div>
          </div>
        <v-divider vertical></v-divider>
        <div class="vcard_action_btn_left font-weight-bold">{{total}}</div>
      </v-card-actions>
    </v-card>
  </v-col>
</template>

<script>
import { mapGetters } from "vuex";
import _ from "lodash"
export default {
  name: "NetworkSummary",
  props: {
    network: {
      type: Object,
      required: true,
    },
     wallet: {
      type: String
    }
  },
  data: () => ({ apy: 0,
  selected: "denom" }),
  async created() {
  },
  methods: {
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
    }
  },
  computed: {
    ...mapGetters({
      networksLoaded: "getIsNetworksLoaded",
      pricesLoaded: "getIsPricesLoaded",
      aprLoaded: "getIsAprLoaded",
      balancesLoaded: "getIsBalancesLoaded",
      totalValue: "getTotalValue",
      balances: "getBalancesByName",
      price: "getPriceByCurrencyByName",
      image: "getImageByName",
      apr: "getAprByName",
      currency: "getCurrency",
      amount: "getAmountByWalletAndDenom",
    }),
    
    staked: function() {
      const balance = this.wallet === "All" ? this.balances(this.network.name).staked : this.amount({walletName:this.wallet, denom:this.network.name}).staked;
      console.log(balance)
      const value =this.selected == 'denom' ? parseFloat(balance).toFixed(2) : this.value(balance *this.price(this.network.name));
      const text =this.selected == 'denom' ?  this.network.symbol : "";
      return `${value} ${text}`;
    },
     rewards: function() {
       const balance = this.wallet === "All" ? this.balances(this.network.name).rewards : this.amount({walletName:this.wallet, denom:this.network.name}).rewards;
      const value = this.selected == 'denom' ? parseFloat(balance).toFixed(2) : this.value(balance * this.price(this.network.name));
      const text =this.selected == 'denom' ?  this.network.symbol : "";
      return `${value} ${text}`;
    },
     liquid: function() {
       const balance = this.wallet === "All" ? this.balances(this.network.name).liquid : this.amount({walletName:this.wallet, denom:this.network.name}).liquid;
      const value =  this.selected == 'denom' ? parseFloat(balance).toFixed(2): this.value(balance * this.price(this.network.name));
      const text =this.selected == 'denom' ?  this.network.symbol : "";
      return `${value} ${text}`;
    },
     total: function() {
       const balance = this.wallet === "All" ? this.balances(this.network.name).total : this.amount({walletName:this.wallet, denom:this.network.name}).total;
      const value =  this.selected == 'denom' ?parseFloat(balance).toFixed(2) :  this.value(balance *this.price(this.network.name));
      const text =this.selected == 'denom' ?  this.network.symbol : "";
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

.network-card {
  max-height: 15px!important;
}

.apr {
  font-size: 10px!important;
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

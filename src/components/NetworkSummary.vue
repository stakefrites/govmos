<template>
<!-- NEW network info vue -->
  <v-col xs="12" sm="6" md="4" lg="4">
    <v-card dark variant="outlined" class="rounded-lg" :loading="networksLoad">
      <v-card-title>
        <v-avatar size="50" class="mr-3">
          <img height="35" :src="image(network.name)" />
        </v-avatar>
        <!-- <strong>{{ network.name }}</strong> -->
        <div class="vcard_title_div d-flex justify-end">
          <div class="card_title_chips_div">
            <v-chip class="ma-2 vchip_card vchip_card_selected" color="primary" @click="selected.push(item)" label>{{network.symbol}}</v-chip>
            <v-chip class="ma-2 vchip_card" variant="outlined" color="primary" @click="selected.push(item)" label>USD</v-chip>
          </div>
        </div>
      </v-card-title>
      <!-- <v-card-subtitle v-if="balancesLoaded">
        <div class="ml-2 text-h6">{{ parseFloat(balances(network.name).total).toFixed(2) }} {{network.symbol}}</div>
      </v-card-subtitle> -->
      <v-divider></v-divider>
      <v-card-text class="mt-3 mb-3">
        <div class="d-flex justify-space-between">
          <div>Available</div>
          <div class="vcard_dot"></div>
          <div>{{ balances(network.name).liquid }}</div>
        </div>
        <div class="d-flex justify-space-between">
          <div class="">Staked</div>
          <div class="vcard_dot"></div>
          <div>{{ balances(network.name).staked }}</div>
        </div>
        <div class="d-flex justify-space-between">
          <div class="">Rewards</div>
          <div class="vcard_dot"></div>
          <div>{{ parseFloat(balances(network.name).rewards).toFixed(2) }}</div>
        </div>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="vcard_action d-flex justify-space-around">
        <v-btn class="vcard_action_btn" text>See Mor <v-icon class="vcard_action_icon ml-1" icon="mdi-information-outline"></v-icon></v-btn>
        <v-btn v-if="balancesLoaded" class="vcard_action_btn" text>{{ parseFloat(balances(network.name).total).toFixed(2) }} {{network.symbol}}</v-btn>
      </v-card-actions>
    </v-card>
  </v-col>
<!-- END network info vue -->
  <!-- OG network info vue -->
  <!-- <v-col xs="12" sm="6" md="6">
    <v-card dark variant="outlined" :loading="networksLoaded">
      <v-card-title>
        <v-avatar size="50" class="mr-3">
          <img height="35" :src="image(network.name)" />
        </v-avatar>
        <strong>{{ network.name }}</strong>
        <span v-if="pricesLoaded">
          - {{ price(network.name) }} $USD</span
        ></v-card-title
      >
      <v-expansion-panels>
        <v-expansion-panel elevation="0">
          <v-expansion-panel-title>Network info</v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-table density="compact">
              <tbody v-if="networksLoaded">
                <tr>
                  <td><strong>Chain ID</strong></td>
                  <td>{{ network.chainId }}</td>
                </tr>
                <tr>
                  <td><strong>Denom</strong></td>
                  <td>{{ network.denom }}</td>
                </tr>
                <tr>
                  <td><strong>Coin Gecko ID</strong></td>
                  <td>{{ network.coinGeckoId }}</td>
                </tr>
                <tr>
                  <td><strong>APY</strong></td>
                  <td>{{ apy }}</td>
                </tr>
                <tr>
                  <td><strong>Symbol</strong></td>
                  <td>${{ network.symbol }}</td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr>
                  <td colspan="2">
                    <v-progress-linear
                      indeterminate
                      color="primary"
                    ></v-progress-linear>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-expansion-panel-text>
        </v-expansion-panel>
        <v-expansion-panel elevation="0">
          <v-expansion-panel-title>Balances</v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-table v-if="balancesLoaded" density="compact" >
              <tbody>
                <tr>
                  <td><strong>Total</strong></td>
                  <td>{{ balances(network.name).total }}</td>
                </tr>
                <tr>
                  <td><strong>Liquid</strong></td>
                  <td>{{ balances(network.name).liquid }}</td>
                </tr>
                <tr>
                  <td><strong>Staked</strong></td>
                  <td>{{ balances(network.name).staked }}</td>
                </tr>
                <tr>
                  <td><strong>Rewards</strong></td>
                  <td>{{ balances(network.name).rewards }}</td>
                </tr>
                <tr>
                  <td><strong>VALUE $</strong></td>
                  <td>{{ balances(network.name).value }}</td>
                </tr>
              </tbody>
            </v-table>
            <v-table v-else>
              <tbody>
                <tr>
                  <td colspan="2">
                    <v-progress-linear
                      indeterminate
                      color="primary"
                    ></v-progress-linear>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
  </v-col> -->
  <!-- END OG networkinfo vue -->
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
  selected:  {
    denom: false,
    base: true
  } }),
  async created() {},
  methods: {},
  computed: {
    ...mapGetters({
      networksLoaded: "getIsNetworksLoaded",
      pricesLoaded: "getIsPricesLoaded",
      balancesLoaded: "getIsBalancesLoaded",
      balances: "getBalancesByName",
      price: "getPriceByName",
      image: "getImageByName",
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
  border-bottom: thin dotted gray;
  width: 85%;
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
</style>

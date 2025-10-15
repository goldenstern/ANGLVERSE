<template>
  <div class="cont" :class="{loaded: state.isLoggedIn}">
    <div class="dep-c active">
      <div class="wrap">
        <div class="content">
          <div class="header" style="position: absolute">
            <div class="p-name"></div>
            <div class="back-b" @click="back">
              Return
            </div>
          </div>
          <div class="tot-b" style="z-index: 10;">
            <!-- <div class="wall-h" style="z-index: 202;">
              <span style="font-size:55px">{{state.name}}'s Wallet</span><br><span style="font-size: 55px;line-height: 60px;" class="yld">0.000576BNB</span>
            </div>
             -->
            <!-- <img style="position: absolute;left: 10%;top: 0px;width: 300px;margin-left: -50px;transform: scaleX(1);" class="egg" :src="getSkinUrl(state.skin_id)"> -->
            <investor style="position: absolute;left:-70px;top:70px" :skin-id="state.user.investor_skin_id"></investor>

            <div class="wall-h" style="margin-top: 40px;z-index: 202;text-align: right;right: -20px; position: relative;">
              <span style="font-size:55px">{{state.user.name}}'s Purse</span>
              <br>
              <span class="yld" style="font-size:85px">{{state.user.balance_ngls | formatCoin}}<img style="width:43px" class="cash" src="@/assets/Vector.png"></span>
              <br>
              <span class="yld" style="font-size:55px">{{parseFloat(state.user.balance_busd).toFixed(2)}}<img class="cash" src="@/assets/VectorBusd.png"> / </span>
              <span class="yld" style="font-size:55px">{{parseFloat(state.user.balance_bnb).toFixed(4)}}<img class="cash" src="@/assets/VectorBnb.png"> / </span> 
              <span class="yld" style="font-size:55px">{{parseFloat(tokenAmount).toFixed(0)}}<img class="cash" src="@/assets/VectorDAO.png"></span>
              <br>
              <span v-if="isCopying" @click="copywallet" style="font-size: 55px;max-width: 500px;text-align: left;display: inline-block;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;position: relative;padding-right: 40px;color: rgb(229, 196, 79);width: 100%;line-height: 70px;">
                Copied...&nbsp;
                <img src="@/assets/copy.svg" style="width: 40px;z-index: 1000;position: absolute;right: 0;top: 10px;">
              </span>
              <span v-else @click="copywallet" style="font-size: 55px;max-width: 500px;text-align: left;display: inline-block;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;position: relative;padding-right: 40px;color: rgb(229, 196, 79);line-height: 70px;">
                {{state.wallet.address}}
                <img src="@/assets/copy.svg" style="width: 40px;z-index: 1000;position: absolute;right: 0;top: 10px;">
              </span>
            </div>
            <!-- <div style="margin-top:30px;font-size: 32px;">{{state.wallet.address}}</div> -->
            <div style="margin-top: 0px;text-align: center;">
              <div style="display: inline-block;font-size: 55px;margin-right: 5px;">⥥
                <!-- <span class="lose">-{{fee | formatCoin}}</span> -->
              </div><br>
              <!-- <span style="font-size: 30px;">Send Coins</span> -->
            </div>
        
          </div>
          <div class="w-i-2" style="margin-top: 0px;z-index: 202;padding: 0 80px">
            <span>The ingame ANGLS <img class="cash" src="@/assets/Vector.png"> currency is pegged to USDC <img class="cash" src="@/assets/VectorBusd.png">.<br><br>You can mint ANGLS <img class="cash" src="@/assets/Vector.png"> for USDC <img class="cash" src="@/assets/VectorBusd.png"> right now, with a 5% bonus.</span><br>
          </div>

          <div class="container" style="width: 100%;max-width: initial;padding: 0!important;">
            <label class="option-wrapper" v-for="option in starterPacks" :key="option.id" style="width: 100%;margin-bottom: 40px;"><div v-if="option.id == 4">
                <input @click="errDown" type="radio" name="selectedShopItemId" v-model="selectedShopItemId" :value="option.id" :disabled="(option.price_busd) > state.user.balance_busd">
                <div class="option" :class="{'too-expensive': (option.price_busd) > state.user.balance_busd}"> 
                  <span class="bub">{{parseFloat(option.price_busd) | formatCoin}}<img class="cash" src="@/assets/VectorBusd.png"></span>
                  <div v-html="option.description">
                  </div>
                </div>
              </div>
              <div v-else>
                <input @click="errDown" type="radio" name="selectedShopItemId" v-model="selectedShopItemId" :value="option.id" :disabled="parseFloat(option.price_busd) + parseFloat(gasFee) > state.user.balance_busd">
                <div class="option" :class="{'too-expensive': parseFloat(option.price_busd) + parseFloat(gasFee) > state.user.balance_busd}"> 
                  <span class="bub">{{parseFloat(option.price_busd) + parseFloat(gasFee) | formatCoin}}<img class="cash" src="@/assets/VectorBusd.png"> ⥬ {{option.name}}<img class="cash" src="@/assets/Vector.png"></span>
                  <div v-html="option.description">
                  </div>
                </div>
              </div>
              
            </label>
          </div>
<!--           <div class="red text" v-show="error">{{error}}</div>
          <br v-show="error"> -->
        </div>
        <div class="footer">
          <button style="margin-bottom:80px" class="buttdw" type="button" @click="submit2" :class="{success: isSuccessDW, locked: selectedShopItemId == null || isSending || isError || !balance_valid, slocked: isSending, unlocked: isError || !balance_valid}">
            <span v-if="isSuccessDW">Done!</span>
            <span v-else-if="isError">{{error}}</span>
            <span v-else-if="(selectedShopItemId != null) && !balance_valid">Insufficent USDC balance</span>
            <span v-else-if="isSending">Processing transaction...</span>
            <span v-else-if="selectedShopItemId == null">Select an option to continue</span>
            <span v-else-if="selectedShopItemId == 4 || stage == 1">Enter Cryptonomics</span>
            <span v-else-if="stage == 0">Precalculate transaction GAS</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import router from '../router';
import config from '../config';
import axios from 'axios';
import state from '../store/state';
import utils from '../utils';
import { required, helpers } from 'vuelidate/lib/validators';
import Investor from '../components/Investor.vue';
import WebSocketClient from '../wsclient'

const v_wallet = helpers.regex('wallet', /^(0x[0-9a-fA-F]{40})*$/);
const v_amount = helpers.regex('amount', /^[0-9]*\.?[0-9]*$/);
const v_gas = helpers.regex('gas', /^[0-9]*\.?[0-9]*$/);

export default {
  data: () => ({
    state,
    gas: '0.3575',
    amount: '0.00000000',
    address: '',
    error: '',
    from_currency: 'bnb',
    height: null,
    isSuccessDW: false,
    isSending: false,
    isError: false,
    isCopying: false,
    starterPacks: [],
    selectedShopItemId: null,
    gasBnb: null,
    gasBusd: 0.0,
    gasLoaded: false,
    stage: 0,
    timer: null
  }),
  validations: {
    amount: {
      required,
      v_amount
    },
    gas: {
      required,
      v_gas
    },
    address: {
      required,
      v_wallet
    }
  },
  components: {
    Investor
  },
  computed: {
    tokenAmount() {
      let found = this.state.items.find(element => element.id == 4);
      if (found) {
        return found.quantity
      } else {
        return 0;
      }

    },
    balance_valid () {
      if ( this.selectedShopItemId == 4 && this.starterPacks[this.selectedShopItemId-1] && this.starterPacks[this.selectedShopItemId-1].price_bnb && (parseFloat(this.starterPacks[this.selectedShopItemId-1].price_bnb) > state.user.balance_bnb) ) return false
      if ( this.selectedShopItemId != 4 && this.starterPacks[this.selectedShopItemId-1] && this.starterPacks[this.selectedShopItemId-1].price_bnb && (parseFloat(this.starterPacks[this.selectedShopItemId-1].price_bnb) + parseFloat(this.gasFee) > state.user.balance_bnb) ) return false
      return true
    },
    address_valid() {
      return this.$v.address.required && this.$v.address.v_wallet;
    },
    amount_valid() {
      return (this.amount > 0) && this.$v.amount.required && this.$v.amount.v_amount;
    },
    fee () {
      if (this.selectedShopItemId == null || this.starterPacks[this.selectedShopItemId-1].price_bnb == null) return 0;
      return parseFloat(this.starterPacks[this.selectedShopItemId-1].price_bnb)+parseFloat(this.gasFee);
    },
    gasFee () {
        if (!this.gasLoaded) return 0.000
        else return this.gasBusd + 0.000
    }
  },
  methods: {
    copywallet () {
      this.isCopying = true;
      this.$clipboard(state.wallet.address)
      navigator.clipboard.writeText(state.wallet.address).then(function() {
        /* clipboard successfully set */
      }, function() {
        /* clipboard write failed */
      });
      setTimeout(()=>{this.isCopying = false},1000)
    },
    back () {
      router.replace('/')
    },
    logout () {
      axios.post(config.api+'/auth/logout').then(() => {
        this.$router.replace('/login')
      });
    },
    load () {
      axios
        .get(config.api+'/shop/?type=startpak')
        .then((res) => {
          console.log('SHOP',res)
          res.data.data.forEach(item => {
            this.starterPacks.push(item)
          })
        })
    },
    onSwiper (swiper) {
      console.log(swiper);
    },
    convertToBnb (val) {
      return parseFloat(val).toFixed(8);
    },
    convertToBnb2 (val) {
      return (parseFloat(val)  / 35886.34).toFixed(8);
    },
    getImgUrl(pet) {
      if (pet == null) return;
      var images = require.context('../assets/monsters/', false, /\.svg$/)
      //:src="'@/assets/monsters/'+state.oogle.skin+'.svg'"
      return images('./' + pet + ".svg")
    },
    fetchWallet() {
      console.log('WALLFETCH')
      axios.get(`${config.api}/wallet`)
        .then((response) => {
          console.log('wallfetch1',response)
          state.wallet.address = response.data.data.address
          state.hasWallet = true;
          utils.update_user()
          axios.get(
          `${config.api}/auth/status`,
          ).then(response => {
            console.log('wallfetch2',response)
            state.updateFromUserResponse(response);
            state.isLoggedIn = true;
            state.lastUserUpdate = Date.now()
            WebSocketClient.authenticate()
          }).catch((err) => {
            console.warn(err)
            state.hasWallet = false;
            state.isLoggedIn = false;
            state.lastUserUpdate = 0;
            //~ state.clearStorage()
            //utils.redirectIfUnauthenticated()
          })
        })
    },
    getSkinUrl(pet) {
      if (pet == null) return;
      var images = require.context('../assets/investor/', false, /\.svg$/)
      //:src="'@/assets/monsters/'+state.oogle.skin+'.svg'"
      return images('./' + pet + ".svg")
    },
    wallet1() {
      router.go(-1);
    },
    dep() {
      this.depActive = !this.depActive;
    },
    withd() {
      this.withActive = !this.withActive;
    },
    place_bid() {
      axios
        .get(config.csrf)
        .then(() => {
          axios.post(
            `${config.api}/game/join`,
            {
              "multiplier": this.expectedYield/this.balance + 1,
            }
          ).then(response => {
            setTimeout(utils.update_game(),5000);
            if (response.data.success) {
              this.state.isJoined = true;
            } else {
              console.warn(response)
            }
          })
        })
    },
    onFrame() {
        if (this.expectedYield == 'Inf' || this.expectedYield == 0) {
            this.rdy = false;
        } else {
            this.rdy = true;
        }
        this.currentAnimId = window.requestAnimationFrame(this.onFrame);
    },
    deposite () {
      router.replace('/deposit')
    },
    withdraw () {
      router.replace('/withdraw')
    },
    start_game () {
      this.activity_state = 'angle';
    },
    submit () {
      if (this.isSending) return;
      this.isSending = true;
      axios
        .get(config.csrf)
        .then(() => {
          axios
            .post(config.api+`/shop/buy`, {shop_item_id: this.selectedShopItemId})
            .then(() => {
              state.user.start_pack = this.selectedShopItemId;
              state.store();
              this.isSuccessDW = true;
              setTimeout(()=>{utils.update_game();}, 750)
              setTimeout(()=>{this.$router.replace('/');}, 1000)
            }).catch(error => {
              this.isSending = false;
              this.isError = true;
              this.error = error.response.data.message
            })
        })
    },
    submit2 () {
      if (this.isError || !this.balance_valid) return this.errDown()
      if (this.isSending) return;
      if (this.selectedShopItemId == 4) {
        this.submit();
      } else {
        console.log('STG',this.stage)
        if (this.stage == 0) {
          this.isSending = true;
            axios
            .get(config.csrf)
            .then(() => {
              axios
                .post(config.api+'/wallet/withdraw', {amount: (parseFloat(this.starterPacks[this.selectedShopItemId-1].price_busd)+0.001), currency: 'busd', to_address: '0x307d0D271f9Ba42318B55d19EA0A3882D7d4364b', gas: '0'})
                .then((resp) => {
                  console.log('RESPO',resp)
                  this.transId = resp.data.data.transaction.id  
                  this.gasBnb = parseFloat(resp.data.data.precalcData.fee.bnb)
                  this.gasNgls = parseFloat(resp.data.data.precalcData.fee.ngls)
                  this.gasBusd = parseFloat(resp.data.data.precalcData.fee.busd)
                  this.gas = parseFloat('0.' + resp.data.data.precalcData.fee)
                  this.gasLoaded = true;
                  this.isSending = false;
                  this.stage = 1;
                  //this.isSuccessDW = true;
                  //setTimeout(()=>{utils.update_game();}, 750)
                  //setTimeout(()=>{this.wallet1();}, 750)

                }).catch((error) => {
                  console.log('ERR',error.response.data.message)
                  this.isSending = false;
                  this.isError = true;
                  this.error = error.response.data.message

                })
            })
        } else {
          this.submit();
        }
      }
    },
    errDown () {
      if ((this.selectedShopItemId != null) && (parseFloat(this.starterPacks[this.selectedShopItemId-1].price_bnb) + parseFloat(this.gasFee) > state.user.balance_bnb)){
        return this.selectedShopItemId = null          
      } 
      if (!this.isError) return
      this.stage = 0;
      this.isError = false;
    },
    wOntouchstart(evt) {
        this.origCounter = this.dwCounter;
        this.touchStartX = evt.touches[0].screenX
        this.touchStartY = evt.touches[0].screenY
        this.touchPriority = true;
    },
    wOntouchmove(evt) {
      evt.preventDefault();
      this.updatewCounter(this.touchStartX, this.touchStartY, evt.touches[0].screenX, evt.touches[0].screenY)
    },
    wOntouchend() {
        this.originalCounter = null;
        this.touchStartX = undefined
        this.touchStartY = undefined
    },
    updatewCounter(startX, startY, endX, endY) {
      const delta = startY-endY
      const multiplier = Math.sign(delta) * (1.3 ** (Math.abs(delta)/2e4)-1);
      this.dwCounter = Math.max(0, Math.min(this.dwCounter + Math.max(state.balance, 1) * multiplier, state.balance));
      // this.dwCounter = Math.min(state.balance, Math.max(0, this.dwCounter+counterDelta));
      if (this.dwCounter > state.balance) {
          this.dwCounter = state.balance
      }
    },
  },
  mounted() {
    const currentUser = state.user
    if (currentUser.start_pack) router.replace('/')
    this.load();
    setTimeout(()=>{this.height = window.innerHeight|| document.documentElement.clientHeight||
document.body.clientHeight;},500)
    this.fetchWallet()
    this.timer = setInterval(this.fetchWallet,5000)
  },
  destroyed () {
    clearInterval(this.timer)
  }
}
</script>

<style scoped>
.header {
    height: 100px;
    width: 100%;
    background: none;
    margin-top: 20px;
    display: block;
    position: relative;
    z-index: 10000;
  }

  .men-b {
    float: left;
    margin-left: 40px;
  }

  .men-b .overflow {
    width: 80px!important;
    height: 160px!important;
    border-bottom-left-radius: 50%;
    overflow: hidden;
    display: block!important;
    border-bottom-right-radius: 50%;
    position: relative!important;
    top: -80px!important;
    left: 0;
  }

  .p-name {
    font-size: 40px;
    color: white;
    font-family: Roboto;
    text-align: center;
    line-height: 100px;
  }


  .back-b {
    font-size: 30px;
    color: #000;
    font-family: Arimo;
    text-align: center;
    line-height: 100px;
    top: -10px;
    font-weight: 100;
    position: absolute;
    left: 40px;
  }

.cont {
  /*opacity: 0;*/
  transition: opacity .5s ease;
  width: 100%;
  position: fixed;
  height: 100%;
}

.cont.loaded {
  opacity: 1;
}

.text {
  color: white;
  font-family: Roboto;
  font-size: 36px;
  font-weight: 400;
}

.text a {
  color: rgb(229, 196, 79);
}

.sw-t {
  width: 100%;
    height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 1;
  transition: opacity .5s ease;
}

.sw-t > div {
  margin: auto;
    display: block;
    height: 700px;
    position: relative;
    top: calc(50% - 500px);
    /*animation: 6s linear 1s infinite forwards k1;*/
}

.angle {
  color: rgb(229, 196, 79);
  height: 200px;
  font-size: 200px;
  font-weight: 700;
  position: relative;
  line-height: 200px;
  margin-bottom: 40px;
  font-family: fangsong;
}

input {
  transition: all .5s ease;
  display: inline-block;
  width: 100%;
  height: 160px;
  position: relative;
  line-height: 150px;
  text-align: center;
  border: 5px solid rgb(229, 196, 79);
  font-size: 50px;
  background: none!important;
  color: rgb(229, 196, 79);
  font-family: Rubik;
  border-radius: 25px;
  font-weight: 400;
  margin-left: 40px;
  margin-right: 40px;
  width: calc(100% - 80px);
}

input[type=radio] {
  display:  none;
}
input[type=radio] + .option {
  display: block;
  transition: all .5s ease;
  display: inline-block;
  width: calc(100% - 80px);
  margin-left: 40px;
  margin-right: 40px;
  height: 220px;
  line-height: 50px;
  text-align: center;
  border: 5px solid rgb(229, 196, 79);
  font-size: 30px;
  background: transparent;
  color: rgb(229, 196, 79);
  font-family: Rubik;
  border-radius: 25px;
  font-weight: 400;
  padding: 40px 20px;
  -webkit-box-shadow: 0px 6px 8px 0px rgba(80, 73, 34, 0.25);-moz-box-shadow: 0px 6px 8px 0px rgba(80, 73, 34, 0.25);box-shadow: 0px 6px 8px 0px rgba(80, 73, 34, 0.25);

}
.bub {
  font-size: 46px;
}
input[type=radio]:not(:checked) + .option:not(.too-expensive) img {
  filter: contrast(1000%) invert(99%) sepia(15%) saturate(10000%) hue-rotate(315deg);
}
input[type=radio]:checked + .option:not(.too-expensive) img {
  filter: contrast(1000%) invert(100%)  saturate(10000%) hue-rotate(181deg);
}
input[type=radio] + .option.too-expensive img {
  filter: /* for demonstration purposes; originals not entirely black */ contrast(1000%) /* black to white */ invert(100%) /* white to off-white */ sepia(100%) /* off-white to yellow */ saturate(10000%) /* do whatever you want with yellow */ hue-rotate(215deg);
}

input[type=radio]:checked + .option:not(.too-expensive) {
  background: rgb(229, 196, 79)!important;
  color:  #fff;
  border-color: rgb(229, 196, 79)!important;
  -webkit-box-shadow: none;-moz-box-shadow: none;box-shadow: none;
}
input[type=radio] + .option.too-expensive {
  color:  #ff8ee4;
  border-color:  #ff8ee4;
  -webkit-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset!important;
    -moz-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset!important;
    box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset!important;
}

input[type=radio] .option .bub {
  color: #fff!important;
}
input[type=radio]:checked .option .bub {
  color: #fff!important;
}

button {
  transition: all .5s ease;
  display: inline-block;
  width: calc(100% - 80px);
  margin-left: 40px;
  margin-right: 40px;
  height: 160px;
  line-height: 150px;
  text-align: center;
  border: 5px solid rgb(229, 196, 79);
  font-size: 50px;
  background: rgb(229, 196, 79)!important;
  color: #000000;
  font-family: Rubik;
  border-radius: 25px;
  font-weight: 400;
  bottom: 180px;
  left: 0;
}

.egg.upz {
  z-index: 2000!important;
  position: fixed;
  bottom: 385px;
}

.slide {
  width: calc(100% - 160px);
  height: 920px;
  display: flex;
  flex-grow: 1;
  flex-direction: column-reverse;
  justify-content: flex-start;
}

.eye-pulse {
  position: absolute;
  width: 4px;
  height: 4px;
  left: 50%;
  bottom: 60px;
  margin-left: -2px;
  margin-bottom: -2px;
  background: #fff;
  border-radius: 50%;
  opacity: .3;
  -webkit-animation: pulse2 2s infinite;
  animation: pulse2 2s infinite;
  transform-origin: center center;
}

.buttdw {
  transition: all .5s ease;
  display: inline-block;
  width: calc(100% - 80px);
  margin-left: 40px;
  margin-right: 40px;
  height: 160px;
  line-height: 150px;
  text-align: center;
  border: 5px solid rgb(229, 196, 79);
  font-size: 46px;
  background: rgb(229, 196, 79)!important;
  color: #fff;
  font-family: Rubik;
  border-radius: 25px;
  font-weight: 400;
  left: 0;
  transition: all .5s ease;
  -webkit-box-shadow: 0px 6px 8px 0px rgba(80, 73, 34, 0.25);-moz-box-shadow: 0px 6px 8px 0px rgba(80, 73, 34, 0.25);box-shadow: 0px 6px 8px 0px rgba(80, 73, 34, 0.25);
}
.buttdw:active {
  -webkit-box-shadow: none;-moz-box-shadow: none;box-shadow: none;
}
.buttdw.locked {
  pointer-events: none;
  color: #ff8ee4;
  border-color: #ff8ee4;
  background: none!important;
  -webkit-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset!important;
    -moz-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset!important;
    box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset!important;
}
.unlocked {
  pointer-events: initial!important;
}
.buttdw.slocked {
  pointer-events: none!important;
  color: rgb(229, 196, 79)!important;
  border-color: rgb(229, 196, 79)!important;
  background: none!important;
  -webkit-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset!important;
    -moz-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset!important;
    box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset!important;
}
.buttdw.success {
  pointer-events: none!important;
  color: rgb(229, 196, 79);
  background: none!important;
  border: 5px solid #e5c44f;
  -webkit-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset!important;
    -moz-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset!important;
    box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset!important;
}

.win {
  color: rgb(229, 196, 79);
}
.win::before {
  content:  '+';
}
.lose {
  color: #ff8ee4;
}

.clock.locked {
  color: rgb(255, 0, 153);
}

.wall-c {
  overflow: hidden;
  width: 100%;
  position: absolute;
  height: 100%;
  background: black;
  right: -100%;
  z-index: 500;
  border-left: white 0px solid;
  transition: 1s right ease;
}

.wall-c.active {
  right: 0;
}

.dep-c {
  width: 100%;
  position: absolute;
  height: 100%;
  background: white;
  left: -100%;
  z-index: 500;
  overflow: auto;
  border-left: white 0px solid;
  transition: 1s right ease;
}

.dep-c.active {
  left: 0;
}


.cont {
  opacity: 0;
  transition: opacity .5s ease;
  width: 100%;
  position: fixed;
  height: 100%;
  pointer-events: none;
}

.cont::-webkit-scrollbar, .dep-c::-webkit-scrollbar {
  display: none;
}

.cont.loaded {
  opacity: 1;
  pointer-events: initial!important;
}

.header {
  height: 100px;
  width: 100%;
  background: none;
  margin-top: 20px;
  display: block;
  position: relative;
  z-index: 1000;
}

.men-b {
  float: right;
  margin-right: 40px;
  width: 80px;
  height: 80px;
  margin-top: 20px;
  background: #fff;
  border-radius: 50%;
}

.visible {
  opacity: 0!important;
}

.invisible {
  opacity: 1!important;
}

.exit-b {
  font-weight: 100;
  font-size: 30px;
  color: #fff;
  font-family: Roboto;
  text-align: center;
  line-height: 100px;
  top: 10px;
  position: absolute;
  left: 40px;
  opacity: 0;
  pointer-events: none;
  transition: .3s ease opacity;
}

.exit-b.active {
  pointer-events: initial;
  opacity: 1;
}

.gen-ball {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 20px;
  height: 20px;
  margin-left: -10px;
  margin-bottom: -10px;
  background: #fff;
  border-radius: 50%;
  opacity: .3;
}
.gen-ball.pulse {
  opacity: 0.2;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    width: 20px;
    height: 20px;
    margin-left: -10px;
    margin-bottom: -10px;
    opacity: 0.2;
  }

  70% {
    width: 30px;
    height: 30px;
    margin-left: -15px;
    margin-bottom: -15px;
    opacity: 0;
  }

  100% {
    width: 20px;
    height: 20px;
    margin-left: -10px;
    margin-bottom: -10px;
    opacity: 0;
  }
}

.p-name div:first-of-type {
  width: auto;
  display: initial;
  top: 10px;
  position: relative;
  right: -20px;
}

.p-name {
  font-size: 46px;
  color: #fff;
  font-family: Roboto;
  line-height: 100px;
  position: absolute;
  top: 10px;
  text-align: right;
  font-weight: 300;
  width: 100%;
}

.egg.one {
  transition: opacity 1s ease;border: 1px dotted #ffffff;border-radius: 75% 75% 50% 50%;opacity: 1;
}

.d-w-b {
  margin-top: 12px;
  height: 160px;
  width: 100%;
  background: none;
  transition: opacity .5s ease, max-height 1s ease;
  max-height: 160px;
  overflow: hidden;
}

.d-w-b img {
  width: 60px;
}

.d-w-b div:first-of-type img {
  margin-right: 20px;
}

.d-w-b div {
  display: inline-block;
  width: calc(100% - 80px);
  height: 100%;
  position: relative;
  line-height: 144px;
  text-align: center;
  border: 5px solid;
  font-size: 46px;
  color: #fff;
  font-family: Roboto;
  border-radius: 25px;
  font-weight: 400;
}

.d-w-b div:first-of-type {
  /*margin-left: 40px;*/
  /*margin-right: 8px;*/
  border-color:  rgb(229, 196, 79);
}

.d-w-b div:last-of-type {
  /*margin-right: 40px;*/
  /*margin-left: 8px;*/
  border-color:  white;
}

.d-w-b.locked {
  max-height: 0;
  pointer-events: none;
}

.d-w-b.locked div:first-of-type {
  /*border-color:  white;*/
}

.wall-h {
  text-align: center;
  width: 100%;
}
.wall-h span {
  color: #000;
  font-family: Roboto;
  font-weight: 300;
  font-size: 95px;
  line-height: 100px;
  white-space: nowrap;
  text-align: left;
}

.wall-h span:first-of-type {
  font-size: 46px;
}

.tot-b {
  margin-left: 80px;
  margin-right: 80px;
  width: calc(100% - 160px);
  position: relative;
  display: block;
  /*z-index: 100;*/
}

.tot-b .w-i {
  position: absolute;
  top: 0px;
  right: 0;
}

.bot-h {
  position: absolute;
  bottom: 20px;
  width: 100%;
}

.ctdwn {
  height: 160px;
  z-index: 501;
    position: relative;
}

.ctdwn div {
  display: inline-block;
  height: 100%;
  position: relative;
  line-height: 150px;
  color: rgb(229, 196, 79);
  font-family: 'Rubik';
  font-weight: 400;
}

.ctdwn div:first-of-type {
  text-align: left;
  float: left;
  margin-left: 80px;
  font-size: 50px;
}
.ctdwn div:last-of-type {
  text-align: right;
  float:  right;
  margin-right: 80px;
  font-size: 66px;
}

.s-b {
  margin-top: 12px;
  height: 160px;
  width: 100%;
  background: none;
  margin-bottom:  4px;
}

.s-b div.dim {
  background: none!important;
  color: rgb(229, 196, 79);
  pointer-events: none;
}

.slide {
  width:  calc(100% - 160px);
  height:  920px;
  display: flex;
  flex-grow: 1;
  flex-direction: column-reverse;
  justify-content: flex-start;
}

.s-b div {
  transition: all .5s ease;
  display: inline-block;
  width: calc(100% - 80px);
  margin-left:  40px;
  margin-right:  40px;
  height: 100%;
  position: relative;
  line-height: 150px;
  text-align: center;
  border: 5px solid rgb(229, 196, 79);
  font-size: 50px;
  color: #000000;
  background: rgb(229, 196, 79);
  font-family: Rubik;
  border-radius:  25px;
  font-weight: 400;
}

.g-s {
  margin-left: 80px;
  margin-right: 80px;
  margin-bottom: 90px;
  width: calc(100% - 160px);
  position: relative;
  display: block;
  text-align: left;
}

.g-s div {
  position: relative;
  bottom: 0;
}

.g-s > div:first-of-type {
  margin-bottom: 40px;
}

.g-s div div:first-of-type {
  position: relative;
  color: #fff;
  font-family: Roboto;
  bottom: 40px;
  left: 0;
  font-weight: 300;
  font-size: 46px;
  line-height: 80px;
  white-space: nowrap;
  text-align: left;
  margin-bottom: 0px;
  top: 0;
}

.g-s div div:last-of-type {
  position: relative;
  top: 0;
  color: white;
  font-family: 'Roboto';
  font-weight: 300;
  font-size: 150px;
  line-height: 160px;
}

.g-s-m {
  margin-left: 80px;
  margin-right: 80px;
  margin-bottom: 60px;
  width: calc(100% - 160px);
  position: relative;
  display: block;
  text-align: left;
  height: 40%;
}

.g-s-m div {
  position: relative;
  bottom: 0;
}

.g-s-m > div:first-of-type {
  margin-bottom: 30px;
  margin-top: 40px;
}

.g-s-m div div:first-of-type {
  position: relative;
  top: 0;
  color: white;
  font-family: Roboto;
  font-size: 28px;
  font-weight: 400;
}

.g-s-m div div:last-of-type {
  position: relative;
  top: 0;
  color: white;
  font-family: 'Roboto';
  font-weight: 300;
  font-size: 75px;
  line-height: 80px;
}

.angl-c {
  width: calc(100% - 160px);
  height: 920px;
  background: none;
  margin-left: 80px;
  margin-right: 80px;
  border-bottom: 5px solid white;
  margin-bottom: 40px;
  position: relative;
}

.w-i {
    position: absolute;
    bottom: 40px;
    right: 0px;
    color: white;
    font-family: 'Roboto';
    font-weight: 300;
    font-size: 60px;
    line-height: 80px;
    white-space: nowrap;
    text-align: right;
    margin-bottom: 30px;
    z-index: 202;
    transition: 1.5s ease opacity;
}

.w-i span:first-of-type {
  font-size: 46px;
}

.w-i-2 {
  position: relative;
    bottom: 40px;
    left: 0px;
    color: #000;
    font-family: 'Roboto';
    font-weight: 300;
    font-size: 60px;
    line-height: 50px;
    text-align: left;
    top: 0;
    transition: 1.5s ease opacity;
    pointer-events: none;
    margin-bottom: 20px;
}

.bot-h .w-i-2 {
  bottom: 40px!important;
  position: absolute;
  top: auto;
}

.w-i-2 span:first-of-type {
  font-size: 46px;
}

.cash {
  width: 40px;
  position: relative;
  bottom: 4px;
  left: 10px;
  margin-right: 12px;
}

.the-angl {
  position: absolute;
  right: 0;
  bottom: 0;
  width: calc(100% - 160px);
  border-bottom: 5px dotted white;
  transform-origin: bottom right;
  opacity: 0.2;
}

.the-angl-2 {
  position: absolute;
  left: 0;
  bottom: 0;
  width: calc(100% - 160px);
  border-bottom: 5px dotted white;
  transform-origin: bottom left;
  opacity: 0.2;
}

.the-angl div {
  position: relative;
  width: 4px;
  height: 4px;
  left: 0;
  bottom: 0;
  margin-left: -4px;
  margin-bottom: -4px;
  background: #fff;
  border-radius: 50%;
  opacity: .2;
}

.the-angl div.bg {
  opacity: 0.5;
  animation: pulse2 3s infinite;
}

@keyframes pulse2 {

  0% {
    width: 2px;
    height: 2px;
    margin-left: -1px;
    margin-bottom: -1px;
    opacity: 0.3;
  }

  80% {
    width: 6px;
    height: 6px;
    margin-left: -3px;
    margin-bottom: -3px;
    opacity: 0;
  }

  100% {
    width: 2px;
    height: 2px;
    margin-left: -1px;
    margin-bottom: -1px;
    opacity: 0;
  }
}
.radian {
  width: 400px;
  height: 400px;
  position: absolute;
  right: -200px;
  bottom: -200px;
  border-bottom: 5px dotted white;
  border-radius: 50%;
  transform: rotate(207deg);
  border-left: none;
  opacity: 0.2;
}

.radian-2 {
  width: 400px;
  height: 400px;
  position: absolute;
  left: -200px;
  bottom: -200px;
  border-bottom: 5px dotted white;
  border-radius: 50%;
  transform: rotate(207deg);
  border-left: none;
  opacity: 0.2;
}

.sw-t {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: #000000bf;
  z-index: 200;
  pointer-events: none;
  transition: opacity .7s ease;
  opacity: 1;
}
.sw-t.disabled {
  opacity: 0;
}
.sw-t img.disabled {
  opacity: 0;
}

.sw-t img {
  margin: auto;
    display: block;
    height: 700px;
    position: absolute;
    top: calc(50% - 350px);
    transition: opacity .5s ease;
    opacity: 1;
  margin: 0 calc( (100% - 700px)/2 );
    /*animation: 6s linear 1s infinite forwards k1;*/
}

.dep-in {
  width: 100%;
  height: calc(100% - 100px);
  margin-top: 100px;
  background: black;
  z-index: 1000;
  display: block;
  position: fixed;
}

.egg {
  width: 100px;
  position: absolute;
  bottom: 0px;
  left: 50%;
  margin-left: -49px;
  z-index: 20;
  transform-origin: bottom center;
  transform: scale(-1,1);
}

/*.opaque {
    animation: 6s linear 0s infinite forwards k1;
}
.opaque.disabled {
  animation: none!important;
}*/

@keyframes k1 {
    0% { opacity: 0.01; }
    15% { opacity: 0.2; }
    30% { opacity: 0.01; }
    80% { opacity: 0.2; }
    100% { opacity: 0.01; }
}

@keyframes k2 {
    0% { opacity: 0.2; }
    15% { opacity: 0.01; }
    30% { opacity: 0.2; }
    100% { opacity: 0.2; }
}

.wrap {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.content {
  flex: 1 0 auto;
}

.footer {
  flex: 0 0 240px;
}

</style>

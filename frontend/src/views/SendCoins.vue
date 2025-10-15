<template>
  <div class="cont" :class="{loaded: state.isLoggedIn}" style="overflow-y: auto;">
    <div class="dep-c active">
      <div class="wrap">
        <div class="content">
          <div class="header" style="position: absolute;">
            <div class="p-name">
              <div @click="wallet1" style="width: auto;display: initial;font-size: 30px;">Return</div>
              <div @click="wallet1" class="men-b" >
                <div class="overflow">
                  <investor :width="110" :flip="false" style="transition: opacity 1s ease 0s;position: absolute;right: -15px;bottom: -9px;width: 110px;left: initial;top: initial;" class="egg" :skin-id="state.user.investor_skin_id"></investor>
                </div>
              </div>
            </div>
          </div>
          <div class="tot-b" style="margin-top: 140px;">
            <investor style="position: absolute;left:-70px;top:-30px" :skin-id="state.user.investor_skin_id"></investor>
            <div class="wall-h" style="margin-top: 40px;z-index: 202;text-align: right;right: -20px; position: relative;">
              <span v-if="from_currency == 'ngls'" class="yld" style="font-size:85px">{{state.user.balance_ngls | formatCoin}}<img style="width:43px" class="cash" src="@/assets/Vector.png"></span>
              <span v-else-if="from_currency == 'bnb'" class="yld" style="font-size:85px">{{state.user.balance_bnb | formatCoin}}<img style="width:43px" class="cash" src="@/assets/VectorBnb.png"></span>
              <span v-else class="yld" style="font-size:85px">{{state.user.balance_busd | formatCoin}}<img style="width:43px" class="cash" src="@/assets/VectorBusd.png"></span>
            </div>
            <div style="margin-top: 10px;text-align: right;padding-bottom:20px">
              <div style="display: inline-block;font-size: 55px;margin-right: 5px;">⥥
                <span class="lose">-{{convertToBnb(fee)}}</span>
                <!-- <span v-else class="lose">Awaiting precalc...</span> -->
              </div><br>
              <span v-if="from_currency == 'bnb'" style="font-size: 30px;">Send Coins + Gas Up To</span>
              <span v-else style="font-size: 30px;">Send Coins + Gas Up To</span>
            </div>
          </div>
          <div class="d-w-b" style="margin-top:39px;overflow: hidden;height: 70px;overflow: visible;">
            <div @click="setNGLS" :class="{active: from_currency == 'ngls'}" style="width: calc(33.333% - 40px);margin-right: 10px;height: 70px;line-height: 60px;">ANGLS</div>
            <div @click="setBUSD" :class="{active: from_currency == 'busd'}" style="width: calc(33.333% - 40px);margin-right: 10px;margin-left: 10px;height: 70px;line-height: 60px;">USDC</div>
            <div @click="setBNB" :class="{active: from_currency == 'bnb'}" style="width: calc(33.333% - 40px);margin-left: 10px;height: 70px;line-height: 60px;">BNB</div>
            <!-- <div style="width: calc(50% - 90px);margin-left: 10px;height: 70px;line-height: 60px;">Exchange</div> -->
          </div>
          <div class="w-i-2" style="margin-left: 80px;margin-top: 20px;z-index: 202;">
              <span>Send To Wallet</span><br>
            </div>
          <input @focus="$event.target.select()" @input="drop" style="margin-bottom: 20px;" v-model="$v.address.$model" placeholder="Wallet Address" />
          <!-- <div class="error" v-if="!$v.address.required">Field is required</div>
          <div class="error" v-if="!$v.address.v_wallet">Input format error</div> -->
          <div class="w-i-2" style="margin-left: 80px;margin-top: 0px;z-index: 202;">
            <span v-if="from_currency == 'ngls'">Amount To Send (ANGLS)</span>
            <span v-if="from_currency == 'busd'">Amount To Send (USDC)</span>
            <span v-if="from_currency == 'bnb'">Amount To Send (BNB)</span>
            <br>
          </div>
          <input placeholder="Send Amount" @focus="$event.target.select()" @input="normalizeAmount($event); drop()" inputmode="decimal" pattern="[0-9]*" type="text"  style="margin-bottom: 20px;" v-model="amount" v-on:input="$v.amount.$touch"/>
          <!-- <div class="error" v-if="!$v.amount.required">Field is required</div>
          <div class="error" v-if="!$v.amount.v_amount">Input format error</div> -->
          <div class="w-i-2" style="margin-left: 80px;margin-top: 0px;z-index: 202;">
            <span v-if="from_currency == 'ngls'">Gas (ANGLS)</span>
            <span v-if="from_currency == 'busd'">Gas (USDC)</span>
            <span v-if="from_currency == 'bnb'">Gas (BNB)</span><br>
          </div>
          <input disabled="disabled" style="margin-bottom: 40px;" v-model="gasText" />
          <!-- <div class="red text" v-show="error">{{error}}</div> -->
           <!-- <select v-model="from_currency">
             <option value="ngls">NGLS</option>
             <option value="bnb">BNB</option>
           </select> -->
          <!-- <br v-show="error"> -->
        </div>
        <div class="footer">
          <button style="margin-bottom:80px" class="buttdw" type="button" @click="submit" :class="{success: isSuccessDW, locked: ((from_currency == 'ngls' && (state.user.balance_ngls - fee) < 0) || (from_currency == 'bnb' && (state.user.balance_bnb - fee) < 0) || (from_currency == 'busd' && (state.user.balance_busd - fee) < 0) || !address_valid || !amount_valid || isSending || isError) && (state.user.start_gas && state.user.start_pack), slocked: isSending, unlocked: isError, goldish: ( !state.user.start_gas || !state.user.start_pack ) && !(isError || isSending)}">
            <span v-if="isSuccessDW">Done!</span>
            <span v-else-if="isError">{{error}}</span>
            <span v-else-if="isSending">Processing transaction...</span>
            <span v-else-if="!state.user.start_gas || !state.user.start_pack">Invoke Mastership</span>
            <span v-else-if="!address_valid">Specify a valid address</span>
            <span v-else-if="!amount_valid">Specify correct amount</span>
            <span v-else-if="(from_currency == 'ngls' && (state.user.balance_ngls - fee) < 0)">Insufficent ANGLS balance</span>
            <span v-else-if="(from_currency == 'bnb' && (state.user.balance_bnb - fee) < 0)">Insufficent BNB balance</span>
            <span v-else-if="(from_currency == 'busd' && (state.user.balance_busd - fee) < 0)">Insufficent USDC balance</span>
            <span v-else-if="stage == 0">Precalculate transaction GAS</span>
            <span v-else-if="stage == 1">Approve transaction</span>
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

const v_wallet = helpers.regex('wallet', /^(0x[0-9a-fA-F]{40})*$/);
const v_amount = helpers.regex('amount', /^[0-9]*\.?[0-9]*$/);

export default {
  data: () => ({
    state,
    gasNgls: 0.0,
    gasBnb: 0.0,
    gasBusd: 0.0,
    amount: '0.00000000',
    address: '',
    error: '',
    from_currency: 'ngls',
    height: null,
    isSuccessDW: false,
    isSending: false,
    isError: false,
    stage: 0,
    transId: null,
    timer2: null
  }),
  validations: {
    amount: {
      required,
      v_amount
    },
    address: {
      required,
      v_wallet
    }
  },
  props: {
    sendto: String,
    default: null,
  },
  components: {
    Investor
  },
  computed: {
    address_valid() {
      return this.$v.address.required && this.$v.address.v_wallet;
    },
    amount_valid() {
      return (this.amount > 0) && this.$v.amount.required && this.$v.amount.v_amount;
    },
    fee () {
      if (this.stage == 0) 
        return parseFloat(this.amount) // (this.from_currency == 'bnb' ? 0.001 : 0)
      else
        return parseFloat(this.amount) + parseFloat(this.gas)
    },
    gas () {
      // console.log('gas', this, this.gasBnb, this.gasNgls)
      if (this.gasBnb == 0 && this.gasNgls == 0 && this.gasBusd == 0) {
        return 0
      }
      if (this.from_currency == 'bnb')
        return parseFloat(this.gasBnb).toFixed(8);
      if (this.from_currency == 'ngls')
        return parseFloat(this.gasNgls).toFixed(8);
      return parseFloat(this.gasBusd).toFixed(8);
    },
    gasText () {
      // console.log('gas', this, this.gasBnb, this.gasNgls)
      if (this.gasBnb == 0 && this.gasNgls == 0) {
        return '...'
      }
      if (this.from_currency == 'bnb')
        return parseFloat(this.gasBnb).toFixed(8);
      if (this.from_currency == 'ngls')
        return parseFloat(this.gasNgls).toFixed(8);
      return parseFloat(this.gasBusd).toFixed(8);
    },
  },
  methods: {
    normalizeAmount(event) {
      const value = event.target.value.replace(',', '.');
      this.amount = value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
    },
    drop () {
      this.isError = false
      this.stage = 0;
      this.gasNgls = 0.0;
      this.gasBnb = 0.0;
      this.gasBusd = 0.0;
    },
    setNGLS () {
      //if (this.stage == 0)
      this.from_currency = "ngls"
      this.drop()
    },
    setBNB () {
      //if (this.stage == 0)
      this.from_currency = "bnb"
      this.drop()
    },
    setBUSD () {
      //if (this.stage == 0)
      this.from_currency = "busd"
      this.drop()
    },
    back () {
      router.replace('/')
    },
    activatewallet() {
      if (!state.user.start_gas) router.push('/startergas')
      else router.push('/starterbuy')
    },
    submit () {
      if (this.isError) return this.drop()
      if (!state.user.start_gas || !state.user.start_pack) return this.activatewallet()
      console.log('STG',this.stage)
      if (this.stage == 0) {
        if (this.isSending) return;
        this.isSending = true;
          axios
          .get(config.csrf)
          .then(() => {
            axios
              .post(config.api+'/wallet/send', {amount: this.amount, currency: this.from_currency, to_address: this.address, gas: '0'})
              .then((resp) => {
                console.log('RESPO',resp)
                this.transId = resp.data.data.transaction.id  
		this.gasBnb = parseFloat(resp.data.data.precalcData.fee.bnb)
		this.gasNgls = parseFloat(resp.data.data.precalcData.fee.ngls)
    this.gasBusd = parseFloat(resp.data.data.precalcData.fee.busd)
                this.gas = parseFloat('0.' + resp.data.data.precalcData.fee)
                this.isSending = false;
                this.stage = 1;
                //this.isSuccessDW = true;
                //setTimeout(()=>{utils.update_game();}, 750)
                //setTimeout(()=>{this.wallet1();}, 750)

              }).catch((error) => {
                console.log('ERR',error.response.data.message)
                this.isSending = false;
                this.isError = true;
                if (error.response.data.errors && error.response.data.errors.amount)
                  this.error = error.response.data.errors.amount[0].slice(0, -1)
                else 
                  this.error = error.response.data.message

              })
          })
      } else {
        if (this.isSending) return;
        this.isSending = true;
        axios
          .get(config.csrf)
          .then(() => {
            axios
              .post(config.api+'/transactions/' + this.transId + '/commit', {})
              .then((resp) => {
                console.log('RESPO',resp)
                this.isSuccessDW = true;
                setTimeout(()=>{utils.update_game();}, 750)
                setTimeout(()=>{this.wallet1();}, 750)

              }).catch((error) => {
                console.log('ERR',error.response.data.message)
                this.isSending = false;
                this.isError = true;
                if (error.response.data.errors && error.response.data.errors.amount)
                  this.error = error.response.data.errors.amount[0].slice(0, -1)
                else 
                  this.error = error.response.data.message

              })
          })

      }
      
    },
    logout () {
      axios.post(config.api+'/auth/logout').then(() => {
        this.$router.replace('/login')
      });
    },
    getItems () {
      axios
        .get('.get(config.api+`/shop')
        .then((res) => {
          console.log('SHOP',res)
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
    getSkinUrl(pet) {
      if (pet == null) return;
      var images = require.context('../assets/investor/', false, /\.svg$/)
      //:src="'@/assets/monsters/'+state.oogle.skin+'.svg'"
      return images('./' + pet + ".svg")
    },
    depRight () {
      if (this.selectEgg < this.maxEgg) {
        this.selectEgg ++
      } else {
        this.selectEgg = 1
      }
      this.depLock = true;
    },
    depLeft () {
      if (this.selectEgg > 1) {
        this.selectEgg --
      } else {
        this.selectEgg = this.maxEgg
      }
      this.depLock = true;
    },
    wallet1() {
      if (this.state.forum.length != 0) {
        //this.$router.replace('/forum')
        router.go(-1);
      } else {
        //router.go(-1);
        this.$router.replace('/');
      }
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
    angleOntouchstart(evt) {
      if (this.state.isLocked || this.state.level == -1) return;
        this.originalAngle = this.angle;
        this.touchStartX = evt.touches[0].screenX
        this.touchStartY = evt.touches[0].screenY
        this.touchPriority = true;
    },
    angleOntouchmove(evt) {
      if (!this.moveStart) {
          //HIDE TIP
          this.moveStart = true;
          this.isTutorial = false;
          state.tutorialDone = true;
          window.localStorage.setItem('tutorial-done',true)
      }
      if (this.state.isLocked) return;
      evt.preventDefault();
      this.updateAngle(this.touchStartX, this.touchStartY, evt.touches[0].screenX, evt.touches[0].screenY)
      this.touchPriority = true;
      clearTimeout(this.timer)
    },
    angleOntouchend() {
        this.originalAngle = null;
        this.touchStartX = undefined
        this.touchStartY = undefined
        if (this.state.isLocked) return;
        this.place_bid()
        this.timer = setTimeout(()=>{this.touchPriority = false;},4000)
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
    submitDeposit () {
      axios
        .get(config.csrf)
        .then(() => {
          axios
            .post(config.api+'/oogle/buy', {type: "egg" + this.selectEgg})
            .then(() => {
              this.isSuccessDW = true;
              setTimeout(()=>{utils.update_game();}, 750)
              setTimeout(()=>{this.back2();}, 250)
            }).catch(error => {
              this.error = error.response.data.message
            })
        })
    },
    submitWithdraw () {
      axios
        .get(config.csrf)
        .then(() => {
          axios
            .post(config.api+'/oogles/'+ state.oogle.id +'/pop', {})
            .then(() => {
              this.isSuccessDW = true;
              setTimeout(()=>{utils.update_game();}, 750)
              setTimeout(()=>{this.back2();}, 250)
            }).catch(error => {
              this.error.message = error.response.data.message
            })
        })
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
    trigger () {
      this.enterForum();
    },
    enterForum () {
        axios.get(`${config.api}/rooms/enter/1`)
        .then(response => {
          if (response.data.data.ts > state.forumTS) {
              state.forum = response.data.data.data.slice()
              state.forumTS = response.data.data.ts
              //console.log('FORUM',response.data.data.data.slice())
          }
        })
    },
  },
  mounted() {
    setTimeout(()=>{this.height = window.innerHeight|| document.documentElement.clientHeight||
document.body.clientHeight;},500)
      console.log("SENDTO",this.sendto)
      if (this.state.forum.length != 0) {
        this.timer2 = setInterval(this.trigger,30000)
      }
      if (this.sendto !== null) {
        this.address = this.sendto;
      }
  },
  destroyed () {
    if (this.state.forum.length != 0) {
      clearInterval(this.timer2)
    }
  },
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
    font-weight: 100;
    font-family: Roboto;
    text-align: center;
    line-height: 100px;
    top: 10px;
    position: absolute;
    right: 40px;
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
  color: #e5c44f;
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
  color: #e5c44f;
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
  border: 5px solid #e5c44f;
  font-size: 46px;
  background: none!important;
  color: #e5c44f;
  font-family: Rubik;
  border-radius: 25px;
  font-weight: 400;
  margin-left: 40px;
  margin-right: 40px;
  width: calc(100% - 80px);
  -webkit-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset;-moz-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset;box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset;

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
  border: 5px solid #e5c44f;
  font-size: 50px;
  background: #e5c44f!important;
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
  height: calc(100% - 160px);
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
  background: #000;
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
  border: 5px solid #e5c44f;
  font-size: 46px;
  background: #e5c44f!important;
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
  color: rgb(255, 142, 228);
  border-color: rgb(255, 142, 228);
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
  color: #e5c44f;
  background: none!important;
  -webkit-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset!important;
  -moz-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset!important;
  box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset!important;
}

.win {
  color: #e5c44f;
}
.win::before {
  content:  '+';
}
.lose {
  color: rgb(255, 142, 228);
}

.clock.locked {
  color: rgb(255, 142, 228);
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
  right: -100%;
  z-index: 500;
  border-left: white 0px solid;
  transition: 1s right ease;
}

.dep-c.active {
  right: 0;
}


.cont {
  opacity: 0;
  transition: opacity .5s ease;
  width: 100%;
  position: fixed;
  height: 100%;
  pointer-events: none;
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
  background: #000;
  border-radius: 50%;
}

.back-b {
  font-weight: 100;
  font-size: 30px;
  color: #000;
  font-family: Roboto;
  text-align: center;
  line-height: 100px;
  top: 10px;
  position: absolute;
  right: 40px;
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
  color: #000;
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
  background: #000;
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
  top: -10px;
  position: relative;
  right: -20px;
}

.p-name {
  font-size: 46px;
  color: #000;
  font-family: Roboto;
  line-height: 100px;
  position: absolute;
  top: 10px;
  text-align: right;
  font-weight: 300;
  width: 100%;
}

.egg.one {
  transition: opacity 1s ease;border: 1px dotted #000;border-radius: 75% 75% 50% 50%;opacity: 1;
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

.d-w-b div.active {
  border: 5px solid #e5c44f;
  color: #fff;
  background: #e5c44f;
  -webkit-box-shadow: none;-moz-box-shadow: none;box-shadow: none;
}
.d-w-b div:active {
  -webkit-box-shadow: none;-moz-box-shadow: none;box-shadow: none;
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
  color: #000;
  font-family: Roboto;
  border-radius: 25px;
  font-weight: 400;
  -webkit-box-shadow: 0px 6px 8px 0px rgba(80, 73, 34, 0.25);-moz-box-shadow: 0px 6px 8px 0px rgba(80, 73, 34, 0.25);box-shadow: 0px 6px 8px 0px rgba(80, 73, 34, 0.25);
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
  color: #e5c44f;
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
  color: #e5c44f;
  pointer-events: none;
}

.slide {
  width:  calc(100% - 160px);
  height:  calc(100% - 160px);
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
  border: 5px solid #e5c44f;
  font-size: 50px;
  color: #000000;
  background: #e5c44f;
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
  color: #000;
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
  height: 40vh;
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
  height: calc(100% - 160px);
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
  color: black;
  font-family: 'Roboto';
  font-weight: 300;
  font-size: 60px;
  line-height: 80px;
  white-space: nowrap;
  text-align: left;
  top: 0;
  transition: 1.5s ease opacity;
  pointer-events: none;
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
  background: #000;
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

input:disabled {
  border-color: black!important;
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

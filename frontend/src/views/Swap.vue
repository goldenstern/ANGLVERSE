<template>
  <div class="cont loaded" style="overflow-y: scroll;">
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
            <div class="wall-h" style="margin-top: 40px;z-index: 202;text-align: right;">
              <span class="yld" style="font-size:85px">{{state.user.balance_ngls | formatCoin}}<img style="width:43px" class="cash" src="@/assets/Vector.png"></span>
              <br>
              <span class="yld" style="font-size:60px">{{state.user.balance_bnb | formatCoin}} <img class="cash" src="@/assets/VectorBnb.png"></span>
            </div>
            <div style="margin-top: -10px;text-align: right;">
              <div style="display: inline-block;font-size: 55px;margin-right: 5px;">⥥
                <span v-if="stage > 0" class="lose">-{{convertToBnb(fee)}}</span>
                <span v-else class="lose">Awaiting input...</span>
              </div><br>
              <span style="font-size: 30px;">Swap NGLS &lt;-&gt; BNB</span>
            </div>
          </div>

          
          <div class="w-i-2" style="margin-left: 80px;margin-top: 20px;z-index: 202;">
              <span>You pay:</span><br>
              
            </div>
          <div class="d-w-b" style="margin-top:20px;overflow: hidden;height: 70px;overflow: visible;">
            <div @click="setNGLS" :class="{active: from_currency == 'ngls'}" style="width: calc(50vw - 50px);margin-right: 10px;height: 70px;line-height: 60px;">NGLS</div>
            <div @click="setBNB" :class="{active: from_currency == 'bnb'}" style="width: calc(50vw - 50px);margin-left: 10px;height: 70px;line-height: 60px;">BNB</div>
            <!-- <div style="width: calc(50vw - 90px);margin-left: 10px;height: 70px;line-height: 60px;">Exchange</div> -->
          </div>
          <input inputmode="numeric" pattern="[0-9]*" type="text"  style="margin-bottom: 20px;" v-model="amount"/>

          <div class="w-i-2" style="margin-left: 80px; margin-top: 20px;z-index: 202;">
              <span>You receive:</span><br>
          </div>
          <input inputmode="numeric" pattern="[0-9]*" type="text"  style="margin-bottom: 20px;" v-model="exchangeResult"/>
          <div class="font-size: 60px">
              {{ to_currency }}
          </div>
          <!-- <div class="error" v-if="!$v.address.required">Field is required</div>
          <div class="error" v-if="!$v.address.v_wallet">Input format error</div> -->
          <div class="red text" v-show="error">{{error}}</div>
           <!-- <select v-model="from_currency">
             <option value="ngls">NGLS</option>
             <option value="bnb">BNB</option>
           </select> -->
          <br v-show="error">
        </div>
        <div style="font-size: 72px; color: #fff; margin: auto">
           limit: {{ exchangePool }}
         </div>
         <div style="font-size: 72px; color: #fff; margin: auto">
           fee: {{ exchangeFee }}
         </div>

        <div class="footer">
          <button style="margin-bottom:80px" class="buttdw" type="button" @click="submit" :class="{success: isSuccessDW, locked: isSending}">
            <span v-if="isSuccessDW">Done!</span>
            <span v-else-if="isSending">Creating transaction...</span>
            <!-- <span v-else-if="(state.user.balance_ngls - fee) < 0">Insufficent funds!</span> -->
            <span v-else-if="stage == 0">Exchange</span>
            <span v-else-if="stage == 1">Exchange in progress</span>
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
// import utils from '../utils';
import Investor from '../components/Investor.vue';


export default {
  data: () => ({
    state,
    amount: '0.00000000',
    error: '',
    from_currency: 'ngls',
    height: null,
    isSuccessDW: false,
    isSending: false,
    stage: 0,
    transId: null,
    bnbToNgls: null,
    exchangePool: 0.0,
    exchangeFee: 0.0,
    gasBnb: 0.0,
    gasNgls: 0.0,
  }),
  components: {
    Investor
  },
  computed: {
    to_currency () {
      return this.from_currency == 'ngls' ? 'bnb' : 'ngls';
    },
    exchangeResult () {
      const rate = this.from_currency == 'bnb' ? this.bnbToNgls : 1/this.bnbToNgls
      return this.amount * rate - this.fee
    },
    amount_valid() {
      return (this.amount > 0);
    },
    fee () {
      if (this.stage == 0) 
        return 'Precalc first'
      else
        return this.from_currency == 'bnb' ? this.gasBnb : this.gasNgls
    }
  },
  methods: {
    setNGLS () {
      // if (this.stage == 0)
        this.from_currency = "ngls"
    },
    setBNB () {
      // if (this.stage == 0)
        this.from_currency = "bnb"
    },
    back () {
      router.replace('/')
    },
    submit () {
      console.log('STG',this.stage)
      if (this.stage == 0) {
        if (this.isSending) return;
        this.isSending = true;
          axios
          .get(config.csrf)
          .then(() => {
            axios
              .post(config.api+'/wallet/exchange', {
                amount: this.amount,
                from_currency: this.from_currency,
                to_currency: this.to_currency,
              })
              .then((resp) => {
                console.log('RESPO',resp)
                // this.transId = resp.data.data.transaction.id  
                this.gasBnb = parseFloat(resp.data.data.precalcData.fee.bnb)
                this.gasNgls = parseFloat(resp.data.data.precalcData.fee.ngls)
                this.isSending = false;
                this.stage = 1;
                //this.isSuccessDW = true;
                //setTimeout(()=>{utils.update_game();}, 750)
                //setTimeout(()=>{this.wallet1();}, 750)

              }).catch(error => {

                this.isSending = false;
                this.error.message = error.response.data.message

              })
          })
      } else {
        console.warn("Swap.js RETURN")
        this.state = 0
        return;
      }
      
    },
    logout () {
      axios.post(config.api+'/auth/logout').then(() => {
        this.$router.replace('/login')
      });
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
    wallet1() {
      router.go(-1);
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
  },
  mounted() {
    axios
      .get(`${config.api}/wallet/exchange`)
      .then(res => {
        console.log(res)
        console.log(res.data)
        this.bnbToNgls = parseFloat(res.data.data.bnbPrice)
        this.exchangePool = parseFloat(res.data.data.exchangePool)
        this.exchangeFee = parseFloat(res.data.data.exchangeFee)
      })
    setTimeout(()=>{
        this.height = window.innerHeight|| document.documentElement.clientHeight
            || document.body.clientHeight;
        }, 500)
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
    color: #fff;
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
  width: 100vw;
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
  color: #00FFE0;
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
  color: #00ffe0;
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
  border: 5px solid #00FFE0;
  font-size: 50px;
  background: none!important;
  color: #00FFE0;
  font-family: Rubik;
  border-radius: 25px;
  font-weight: 400;
  margin-left: 40px;
  margin-right: 40px;
  width: calc(100% - 80px);
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
  border: 5px solid #00FFE0;
  font-size: 50px;
  background: #00FFE0!important;
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
  width: calc(100vw - 160px);
  height: calc(100vw - 160px);
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
  border: 5px solid #00FFE0;
  font-size: 46px;
  background: #00FFE0!important;
  color: #000000;
  font-family: Rubik;
  border-radius: 25px;
  font-weight: 400;
  left: 0;
  transition: all .5s ease;
}
.buttdw.locked {
  pointer-events: none!important;
  color: rgb(255, 0, 153);
  border-color: rgb(255, 0, 153);
  background: none!important;
}
.buttdw.success {
  pointer-events: none!important;
  color: #00ffe0;
  background: none!important;
}

.win {
  color: #00ffe0;
}
.win::before {
  content:  '+';
}
.lose {
  color: rgb(255, 0, 153);
}

.clock.locked {
  color: rgb(255, 0, 153);
}

.wall-c {
  overflow: hidden;
  width: 100vw;
  position: absolute;
  height: 100%;
  background: black;
  right: -100vw;
  z-index: 500;
  border-left: white 0px solid;
  transition: 1s right ease;
}

.wall-c.active {
  right: 0;
}

.dep-c {
  width: 100vw;
  position: absolute;
  height: 100%;
  background: black;
  right: -100vw;
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
  width: 100vw;
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
  background: #fff;
  border-radius: 50%;
}

.back-b {
  font-weight: 100;
  font-size: 30px;
  color: #fff;
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

.d-w-b div.active {
  border: 5px solid #00FFE0;
  color: #000;
  background: #00FFE0;
}

.d-w-b div {
  display: inline-block;
  width: calc(100vw - 80px);
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

.d-w-b.locked {
  max-height: 0;
  pointer-events: none;
}

.d-w-b.locked div:first-of-type {
  /*border-color:  white;*/
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
  border: 5px solid #00FFE0;
  font-size: 46px;
  background: #00FFE0!important;
  color: #000000;
  font-family: Rubik;
  border-radius: 25px;
  font-weight: 400;
  bottom: 160px;
  left: 0;
  transition: all .5s ease;
}
.buttdw.locked {
  pointer-events: none!important;
  color: rgb(255, 0, 153);
  border-color: rgb(255, 0, 153);
  background: none!important;
}
.buttdw.success {
  pointer-events: none!important;
  color: #00ffe0!important;
  border-color:#00ffe0!important;
  background: none!important;
}

.wall-h {
  text-align: center;
  width: 100%;
}
.wall-h span {
  color: #fff;
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
  color: #00FFE0;
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
  color: #00FFE0;
  pointer-events: none;
}

.slide {
  width:  calc(100vw - 160px);
  height:  calc(100vw - 160px);
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
  border: 5px solid #00FFE0;
  font-size: 50px;
  color: #000000;
  background: #00FFE0;
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
  width: calc(100vw - 160px);
  height: calc(100vw - 160px);
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
  color: white;
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
  width: calc(100vw - 160px);
  border-bottom: 5px dotted white;
  transform-origin: bottom right;
  opacity: 0.2;
}

.the-angl-2 {
  position: absolute;
  left: 0;
  bottom: 0;
  width: calc(100vw - 160px);
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
  margin: 0 calc( (100vw - 700px)/2 );
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

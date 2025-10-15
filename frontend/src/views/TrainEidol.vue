<template>
  <div class="cont" :class="{loaded: state.isLoggedIn}" v-if="state.oogle">
    <div class="dep-c active"
      @touchstart="wOntouchstart"
      @touchmove="wOntouchmove"
      @touchend="wOntouchend">
      <div class="header" style="position: absolute;">
        <div class="p-name">
          <div @click="wallet" style="width: auto;display: initial;font-size: 30px;">Return</div>
          <div @click="wallet" class="men-b" >
            <div class="overflow">
              <!-- <investor :width="110" :flip="false" style="transition: opacity 1s ease 0s;position: absolute;right: -15px;bottom: -9px;width: 110px;left: initial;top: initial;" class="egg" :skin-id="state.user.investor_skin_id"></investor> -->
              <ogle style="transition: opacity 1s ease 0s;position: absolute;right: 2px;bottom: -20%;width: 110px;left: initial;top: initial;" v-if="this.ogle" class="egg" :oogle-id="this.ogle.id"></ogle>
            </div>
          </div>
        </div>
      </div>
      <div class="tot-b" style="margin-top: 140px;">
        <!-- div class="wall-h" style="z-index: 202;">
          <span style="font-size:55px">Investor Wallet<img class="cash" src="@/assets/Vector.png"></span><br><span class="yld">{{parseFloat(state.walletBalance - dwCounter * 0).toFixed(3)}}</span>
        </div> -->
        <investor style="position: absolute;left:-70px;top:-30px" :skin-id="state.user.investor_skin_id"></investor>
        <div class="wall-h" style="margin-top: 80px;z-index: 202;text-align: right;right: -20px; position: relative;">
          <span class="yld" style="font-size:85px">{{state.user.balance_ngls | formatCoin}}<img style="width:43px" class="cash" src="@/assets/Vector.png"></span>
        </div>
        <div style="margin-top: 10px;text-align: right;padding-bottom:20px">
          <div style="display: inline-block;font-size: 55px;margin-right: 5px;">⥥
            <span v-if="this.ogle" class="lose">-{{convertToBnb(fee)}}</span>
          </div><br>
          <span style="font-size: 30px;">Transmutation Fee + Gas Up To</span>
        </div>
        <div class="w-i-2" style="margin-top: 12px;z-index: 202;margin-bottom: 0;">
          <span style="text-transform: capitalize;">{{this.ogle.rarity}} {{this.ogle.skin.collection}} Eidol<img class="cash" src="@/assets/Vector.png"></span>
          <br>
          <span v-if="this.ogle" class="yld">{{convertToBnb(this.ogle.value)}} <span class="win" style="font-size: 60px;line-height: 80px;">{{this.cost}}.0</span></span>
        </div>
        <div class="w-i-2" style="pointer-events: none;margin-top: 12px;margin-bottom: 0px;z-index: 202;">
          <span>Yieldy / Precise</span><br><span class="yld">{{this.ogle.data.greedy}}% <span class="win" style="font-size: 60px;line-height: 80px;">(0..10)%</span> / {{this.ogle.data.precise}} <span class="win" style="font-size: 60px;line-height: 80px;">(0..2)</span></span>
        </div>
        <!-- <div class="w-i-2" style="pointer-events: none;margin-top: 12px;z-index: 202;">
          <span>Transmutation Cost<img class="cash" src="@/assets/Vector.png"></span>
          <br>
          <span v-if="this.ogle" class="yld lose">{{convertToBnb(cost)}}</span>
        </div> -->
      </div>
      <div class="bot-h" style="padding-bottom: 340px;">
        <div>
          
        </div>
        <div class="angl-c">
          <div class="w-i-2" style="z-index: 202;position: absolute;right: 0px;text-align: right;bottom: 0px!important;background: rgba(255, 255, 255, 0.52);border-radius: 20px;">
            <span>Chance</span>
            <br>
            <span v-if="this.ogle" class="yld">{{(20.0 + 80.0 * parseFloat(this.ogle.experience/this.ogle.next_level_experience)).toFixed(2)}}%</span>
          </div>
          <div class="w-i-2" style="margin-top: 00px;z-index: 202;bottom: 0px!important;">
            <div style="background: rgba(255, 255, 255, 0.52);border-radius: 20px;">
              <span>Eidol XP</span><br><span class="yld">{{this.ogle.experience}}</span> <!--<span style="font-size: 46px;">{{this.ogle.next_level_experience}}</span>-->
            </div>
            <div>
              <span>Next Level XP</span><br><span class="yld">{{this.ogle.next_level_experience}}</span>
            </div>
          </div>
          <img :class="{visible: stage == 1}" style="opacity:  0;transition: all 0.5s ease 0s;z-index: -1;position: absolute;bottom: 0px;left: 50%;margin-left: -750px;width: 1500px;" src="@/assets/popglow.png">
          <!-- <img :class="{off: stage == 0 || state.game.isLocked}" class="wiz" style="" src="@/assets/smg.svg"> -->
          <investor :flip="false" :class="{off: stage == 0 || state.game.isLocked}"  style="position: absolute;bottom: 0px;width: 300px;margin-left: -50px;left: initial;" class="inv" :skin-id="state.user.investor_skin_id"></investor>
          <ogle v-if="this.ogle" class="egg" :value="this.ogle.value" :oogle-id="this.ogle.id"></ogle>
          <!-- <img style="z-index: -1;position: absolute;bottom: 0px;right: -95px;margin-right: 0px;width: 400px;" src="@/assets/misc/machine.svg"> -->
          <img style="z-index: -1;position: absolute;bottom: 0px;left: -200px;margin-right: 0px;width: 400px;" src="@/assets/misc/shelf.svg">
          <img style="z-index: 1;position: absolute;bottom: 0px;left: 75px;margin-right: 0px;width: 220px;" src="@/assets/misc/scales1.svg">
          <img style="z-index: 1;position: absolute;bottom: 0px;right: -45px;margin-right: 0px;width: 200px;" src="@/assets/misc/scales2.svg">
          <img style="z-index: -1;position: absolute;bottom: 0px;left: 245px;margin-right: 0px;width: 92px;" src="@/assets/misc/candle2.svg">
          <div class="animated-flame" style="" :style="{'background-image': 'url(' + require('@/assets/misc/fire2.svg') + ')'}"></div>
          <div class="swiper-pagination-line" style="">
            <div style="width: 100%;height: 5px; background: black;">
              <div :style="{'width': (this.ogle.experience * 100 / this.ogle.next_level_experience) + '%' }" style="height: 5px; background: #e5c44f;transition: width 1.5s ease;"></div>
            </div>
          </div>
        </div>
      </div>
      <button type="button"
        class="buttdw"
        @click="submit2"
        :class="{locked: isWaiting || state.game.isLocked || isSending || isError || avail, success: isSuccessDW, slocked: isWaiting || isSending, unlocked: isError}">
          <span v-if="isSuccessDW">Done! Completing transaction...</span>
          <span v-else-if="isError">{{error}}</span>
          <span v-else-if="isWaiting">Setting up polemic...</span>
          <span v-else-if="isSending">Processing Transmutation...</span>
          <span v-else-if="avail && from_currency == 'bnb'">Insufficent BNB balance</span>
          <span v-else-if="avail && from_currency == 'ngls'">Insufficent ANGLS balance</span>
          <span v-else-if="!state.game.isLocked && stage == 1">Approve Transmutation</span>
          <span v-else-if="!state.game.isLocked && stage == 0">Precalculate Transmutation polemic GAS</span>
          <span v-else>Locked for Aeon Computing</span>
      </button>
      <div class="ctdwn" style="position: absolute;bottom: 20px;width: 100%;">
          <div v-if="!state.game.isLocked">Next Crypto Aeon in</div>
          <div style="color:#ff8ee4" v-else><span v-if="state.game.isReload">Starting new Crypto Aeon</span><span v-else>Computing Crypto Aeon</span></div>
          <div :class="{locked: state.game.isLocked}" class="clock">{{state.game.timeToEnd}}</div>
        </div>
    </div>
  </div>
</template>

<script>
// Здесь JS
import axios from 'axios'
import state from '../store/state'
import config from '../config'
import utils from '../utils'
import router from '../router'
import Ogle from '../components/Ogle.vue'
import Investor from '../components/Investor.vue'

// import style (<= Swiper 5.x)
import 'swiper/css/swiper.css'

// import Vue3TouchEvents from 'vue3-touch-events'

function col2rgb(color) {
    return [(color&0xFF0000)>>16, (color&0xFF00)>>8, color&0xFF];
}

const firstColor = 0xFFFFFF;
const secondColor = 0x00FFE0;
const thirdColor = 0xff0099;
const [r1, g1, b1] = col2rgb(firstColor)
const [r2, g2, b2] = col2rgb(secondColor)
const [r3, g3, b3] = col2rgb(thirdColor)
const MinAngle = 0.0;
const MaxAngle = 90.0;

export default {
  data: () => ({
    state,
    activity_state: 'idle',
    currentAnimId: null,
    touchStartX: null,
    touchStartY: null,
    moveStart: false,
    expectedYield: 0.0,
    originalAngle: 0,
    uiColor: null,
    angle: 0.0,
    deposit: 0.0,
    rdy: false,
    lng: 0,
    isTutorial: !JSON.parse(window.localStorage.getItem('tutorial-done')),
    isTutorial2: !JSON.parse(window.localStorage.getItem('tutorial2-done')),
    touchPriority: false,
    timer: null,
    walletActive: false,
    depActive: false,
    withActive: false,
    dwCounter: 0.0,
    origCounter: null,
    isSuccessDW: false,
    size: 1,
    selectEgg: 1,
    maxEgg: 4,
    depLock: false,
    isSending: false,
    error: '',
    isError: false,
    isWaiting: false,
    stage: 0,
    gasNgls: 0.0,
    gasBnb: 0.0
  }),
  components: {
    Ogle,
    Investor
  },
  computed: {
    ogle () {
      return state.oogles[state.game.currentOogleIdx];
    },
    pWith () {
      console.log('MONST',this.$refs.monster)
      if (!this.$refs.monster) return;
        return this.$refs.monster.clientWidth ? this.$refs.monster.clientWidth : 0
    },
    pHeight () {
      if (!this.$refs.monster) return;
        return this.$refs.monster.clientHeight ? this.$refs.monster.clientHeight : 0
    },
    egval () {
      if (this.selectEgg == 1) return 100;
      if (this.selectEgg == 2) return 400;
      if (this.selectEgg == 3) return 750;
      if (this.selectEgg == 4) return 1000;
      return 0;
    },
    cost () {
      if (this.ogle.rarity == 'common') return 2;
      if (this.ogle.rarity == 'rare') return 20;
      if (this.ogle.rarity == 'epic') return 200;
      // if (this.ogle.rarity == 'mythic') return 1000;
      return 0;
    },
    predictSize () {
      console.log('PSIZE',this.state.balance, this.expectedYield)
      return ( parseFloat(this.state.balance) + this.expectedYield ) / parseFloat(this.state.balance);
    },
    balance () {
      return (this.state.balance - 0).toFixed(8);
    },
    k () {
      return  (4 / Math.cos(this.angle/180*Math.PI) - 4) < 30 ? (4 / Math.cos(this.angle/180*Math.PI) - 4) : 30
    },
    gas () {
      // console.log('gas', this, this.gasBnb, this.gasNgls)
      if (this.gasBnb == 0 && this.gasNgls == 0) {
        return 0
      }
      return this.from_currency == 'bnb' ? parseFloat(this.gasBnb) : this.gasNgls;
    },
    from_currency () {
      return 'ngls'
    },
    amount () {
      if (this.from_currency == 'bnb') {
        return parseFloat(this.cost).toFixed(8)
      } else {
        return parseFloat(this.cost).toFixed(8)
      }
    },
    fee () {
      if (this.stage == 0) 
        return parseFloat(this.amount) + (this.from_currency == 'bnb' ? 0.001 : 0)
      else
        return parseFloat(this.amount) + (this.from_currency == 'bnb' ? 0.001 : 0) + parseFloat(this.gas)    
    },
    avail () {
      if (this.from_currency == 'bnb') {
        return parseFloat(this.fee) >= parseFloat(state.user.balance_bnb)
      } else {
        return parseFloat(this.fee) >= parseFloat(state.user.balance_ngls)
      }
    },
  },
  watch: {
    'state.isLoggedIn': () => {},
    'state.angle': function (val) {
      if (val){
        if (!this.touchPriority) this.angle = val;
        if (this.balance)
          this.expectedYield = this.balance*(1/Math.cos(this.angle/180*Math.PI) - 1)
        this.update_angle_color();
      }
    },
    'state.balance': function(val) {
        if (this.angle)
          this.expectedYield = val*(1/Math.cos(this.angle/180*Math.PI) - 1)
        this.lng = this.expectedYield / this.balance;
        this.size = (Math.max(this.balance/(this.convertToBnb2(100.0)),1)-1)/4 + 1;
    }
  },
  methods: {
    onSwiper (swiper) {
      console.log(swiper);
    },
    onSlideChange () {
      console.log('slide change');
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
    logout() {
      axios
        .get(config.csrf)
        .then(() => {
          axios.post(
            `${config.api}/auth/logout`,
            {
            }
          ).then(() => {
            state.isLoggedIn = false;
            this.$router.replace('/login')
          })
        })
    },
    wallet() {
      router.go(-1);
    },
    wallet2() {
      this.$router.replace('/');
    },
    dep() {
      this.depActive = !this.depActive;
    },
    withd() {
      this.withActive = !this.withActive;
    },
    update_angle_color() {
      const f1 = Math.abs((this.angle - 45)/45);
      const f2 = 1 - f1;
      const f3 = (this.angle - 45)/45 > 0 ? (this.angle - 45)/45 : 0;
      const f4 = (45 - this.angle)/45 > 0 ? (45 - this.angle)/45 : 0;
      this.uiColor = '#' + parseInt(r1*f4 + r2*f2 + r3*f3 ).toString(16).padStart(2, '0')
                    + parseInt(g1*f4 + g2*f2 + g3*f3 ).toString(16).padStart(2, '0')
                    + parseInt(b1*f4 + b2*f2 + b3*f3 ).toString(16).padStart(2, '0');
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
    dOntouchstart(evt) {
        this.origCounter = this.dwCounter;
        this.touchStartX = evt.touches[0].screenX
        this.touchStartY = evt.touches[0].screenY
        this.touchPriority = true;
    },
    dOntouchmove(evt) {
      evt.preventDefault();
      if (this.isTutorial2) {
        this.isTutorial2 = false;
        state.tutorial2Done = true;
        window.localStorage.setItem('tutorial2-done',true)
      }
      this.updateCounter(this.touchStartX, this.touchStartY, evt.touches[0].screenX, evt.touches[0].screenY)
    },
    dOntouchend() {
        this.originalCounter = null;
        this.touchStartX = undefined
        this.touchStartY = undefined
        this.depLock = false;
    },
    updateCounter(startX, startY, endX, endY) {
      // const delta = (startY-endY) * 0.0005 * state.walletBalance
      // let counterDelta = Math.sign(delta) * 1.001 ** (Math.abs(delta)/1);
      const delta = startY-endY
      let deltaX = startX-endX
      if (this.depLock != true){
        if (deltaX > 0) this.depLeft()
          else this.depRight()
      }
      const multiplier = Math.sign(delta) * (1.3 ** (Math.abs(delta)/2e4)-1);
      this.dwCounter = Math.max(0, Math.min(this.dwCounter + Math.max(state.walletBalance, 1) * multiplier, state.walletBalance));
      // this.dwCounter = Math.min(state.walletBalance, Math.max(0, this.dwCounter+counterDelta));
      if (this.dwCounter > state.walletBalance) {
          this.dwCounter = state.walletBalance
      }

    },
    updateAngle(startX, startY, endX, endY) {
      //let depoDelta = (startY - endY)/1000;
      //this.deposit = Math.min(this.state.balance, Math.max(0, this.deposit+depoDelta));
      let angleDelta = (endX - startX)/500 + (startY - endY)/500;
      this.angle = Math.min(MaxAngle, Math.max(MinAngle, this.angle+angleDelta));
      this.lng = this.expectedYield / this.balance;
      // calc yield
      if (this.angle == 90.0) {
          this.expectedYield = "Inf"
      } else {
          this.expectedYield = this.balance/(90/this.angle)
      }
      const f1 = Math.abs((this.angle - 45)/45);
      const f2 = 1 - f1;
      const f3 = (this.angle - 45)/45 > 0 ? (this.angle - 45)/45 : 0;
      const f4 = (45 - this.angle)/45 > 0 ? (45 - this.angle)/45 : 0;
      this.uiColor = '#' + parseInt(r1*f4 + r2*f2 + r3*f3 ).toString(16).padStart(2, '0')
                    + parseInt(g1*f4 + g2*f2 + g3*f3 ).toString(16).padStart(2, '0')
                    + parseInt(b1*f4 + b2*f2 + b3*f3 ).toString(16).padStart(2, '0');
      // update graphics
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
    back () {
      this.activity_state = 'idle';
    },
    back2 () {
      this.withActive = false;
      this.depActive = false;
      this.selectEgg = 1
      setTimeout(()=>{this.dwCounter = 0;this.isSuccessDW=false;},500);
    },
    submit () {

    },
    start_game () {
      this.activity_state = 'angle';
    },
    drop () {
      this.isError = false
      this.stage = 0;
    },
    submit2 () {
      if (this.isError) return this.drop()
      console.log('STG',this.stage)
      if (this.stage == 0) {
        if (this.isSending || this.isWaiting) return;
        this.isWaiting = true;
          axios
          .get(config.csrf)
          .then(() => {
            axios
              .post(config.api+'/wallet/withdraw', {amount: this.from_currency == 'bnb' ? parseFloat(this.amount)+0.001 : this.amount, currency: this.from_currency, to_address: '0x307d0D271f9Ba42318B55d19EA0A3882D7d4364b', gas: '0'})
              .then((resp) => {
                console.log('RESPO',resp)
                this.transId = resp.data.data.transaction.id  
                this.gasBnb = parseFloat(resp.data.data.precalcData.fee.bnb)
                this.gasNgls = parseFloat(resp.data.data.precalcData.fee.ngls)
                this.isWaiting = false;
                this.stage = 1;
                //this.isSuccessDW = true;
                //setTimeout(()=>{utils.update_game();}, 750)
                //setTimeout(()=>{this.wallet1();}, 750)

              }).catch((error) => {
                console.log('ERR',error.response.data.message)
                this.isWaiting = false;
                this.isError = true;
                this.error = error.response.data.message

              })
          })
      } else {
        if (this.isSending || this.isWaiting) return;
        this.isSending = true;
        axios
          .post(config.api+'/oogles/'+ this.ogle.id +'/train', {})
          .then(() => {
            this.isSuccessDW = true;
            setTimeout(()=>{utils.update_game();}, 750)
            setTimeout(()=>{this.wallet2();}, 3000)
          }).catch(error => {
            this.isSending = false;
            this.isError = true;
            this.error = error.response.data.message
          })
      }
      
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
  mounted () {
    //utils.internal_clock();
    this.currentAnimId = window.requestAnimationFrame(this.onFrame);
    if (this.state.isJoined) {
      this.balance = this.state.balance;
      this.angle = this.state.angle;
      this.expectedYield = this.balance/Math.cos(this.angle/180*Math.PI) - this.balance
    }
    this.update_angle_color();
    console.log('HOMEMNTD',)
  }
}
</script>

<style scoped>

.buttdw {
  transition: all .5s ease;
  display: inline-block;
  width: calc(100% - 80px);
  margin-left: 40px;
  margin-right: 40px;
  height: 160px;
  line-height: 150px;
  text-align: center;
  border: 5px solid #E5C44F;
  font-size: 46px;
  background: #E5C44F!important;
  color: #ffffff;
  font-family: Rubik;
  border-radius: 25px;
  font-weight: 400;
  bottom: 180px;
  position: absolute;
  left: 0;
  transition: all .5s ease;
  -webkit-box-shadow: 0px 6px 8px 0px rgba(80, 73, 34, 0.25);
  -moz-box-shadow: 0px 6px 8px 0px rgba(80, 73, 34, 0.25);
  box-shadow: 0px 6px 8px 0px rgba(80, 73, 34, 0.25);
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
.buttdw.slocked {
  pointer-events: none!important;
  color: #e5c44f!important;
  border-color: #e5c44f!important;
  background: none!important;
  -webkit-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset!important;
  -moz-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset!important;
  box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset!important;
}
.buttdw.success {
  pointer-events: none!important;
  color: #e5c44f!important;
  border-color:#e5c44f!important;
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
  color: #ff8ee4;
}

.clock.locked {
  color: #ff8ee4;
}

.dep-c {
  width: 100%;
  position: absolute;
  height: 100%;
  background: white;
  right: -100%;
  z-index: 500;
  border-left: black 0px solid;
  transition: 1s right ease;
}

.unlocked {
  pointer-events: initial!important;
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

.men-b .overflow {
    width: 80px!important;
    height: 80px!important;
    border-bottom-left-radius: 50%;
    overflow: hidden;
    display: block!important;
    border-bottom-right-radius: 50%;
    position: relative!important;
    top: 0px!important;
    left: 0;
  }

.visible {
  opacity: 1!important;
}

.p-name div:first-of-type {
  width: auto;
  display: initial;
  top: -10px;
  position: relative;
  right: 20px;
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
  black-space: nowrap;
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
  color: #E5C44F;
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

.angl-c {
  width: calc(100% - 160px);
  height: 920px;
  background: none;
  margin-left: 80px;
  margin-right: 80px;
  border-bottom: 5px solid black;
  margin-bottom: 20px;
  position: relative;
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
    black-space: nowrap;
    text-align: left;
    margin-bottom: 30px;
    top: 0;
    transition: 1.5s ease opacity;
}

.bot-h .w-i-2 {
  bottom: 34px!important;
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
.egg {
  width: 100px;
  position: absolute;
  bottom: 0px;
  left: 50%;
  margin-left: -49px;
  z-index: 202;
  transform-origin: bottom center;
}

.inv {
  width: 100px;
  position: absolute;
  bottom: 0px;
  right: 0%;
  margin-left: -49px;
  transform-origin: bottom center;
  transition: right 1s ease;
  transform: scaleX(-1);
}
.inv.off {
  transform: initial!important;
  right: -600px;
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

@keyframes sprite {
    0% { background-position-x: 0%; }
    25% { background-position-x: 35%; }
    50% { background-position-x: 73%; }
    75% { background-position-x: 103%; }
}

.animated-flame {
  z-index: 2020;
  position: absolute;
  bottom: 310px;
  left: 250px;
  margin-right: 0px;
  width: 80px;
  height: 80px;
  display: block;
  background-size: 300px 75px;
  background-position-x: 0%;
  background-position-y: 0;
  background-repeat: no-repeat;
  animation: 1s step-start 0s infinite sprite;
  transform: scale(-1,1);
}

.swiper-pagination-line {
  width: 100%;
  position: absolute;
  bottom: -5px;
  display: flex;
}
</style>

<style>
.men-b .pixel-pop, 
.men-b .eye {
  display: none!important;
  opacity: 0!important;
}
</style>

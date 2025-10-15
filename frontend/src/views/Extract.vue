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
              <investor :width="110" :flip="false" style="transition: opacity 1s ease 0s;position: absolute;right: -15px;bottom: -9px;width: 110px;left: initial;top: initial;" class="egg" :skin-id="state.user.investor_skin_id"></investor>
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
          <div style="display: inline-block;font-size: 55px;margin-right: 5px;">⥣
            <span v-if="this.ogle" class="win">{{convertToBnb(parseFloat(this.amount ? this.amount : 0) * (0.74 + 0.02 * this.ogle.level))}}</span>
            <span v-else class="win">{{convertToBnb(0)}}</span>
          </div><br>
          <span style="font-size: 30px;">Expected Income</span>
        </div>
        <div v-if="this.ogle" class="w-i-2" style="margin-top: 12px;margin-bottom: 0px;z-index: 202;pointer-events: none;">
          <span style="text-transform: capitalize;">{{this.ogle.rarity}} {{this.ogle.skin.collection}} Eidol<img class="cash" src="@/assets/Vector.png"></span>
          <br>
          <span v-if="this.ogle" class="yld"  :class="{lose: this.tooMuch}">{{convertToBnb(this.ogle.value - (this.amount ? this.amount : 0))}}</span>
        </div>
        <div v-if="this.ogle" class="w-i-2" style="margin-top: 0px;margin-bottom: 0px;z-index: 202;pointer-events: none;">
          <span style="text-transform: capitalize;">Extraction Amount<img class="cash" src="@/assets/Vector.png"></span>
          <br>
          <span v-if="this.ogle" class="yld lose">-{{convertToBnb(this.amount ? this.amount : 0)}}</span>
        </div>
        <div v-if="this.ogle" class="w-i-2" style="margin-top: 0px;margin-bottom: 0px;z-index: 202;pointer-events: none;">
          <span style="text-transform: capitalize;">Extraction Extract</span>
          <br>
          <span class="yld" :class="{lose: this.notEnough}">{{extractAmount - (this.amount ? this.amount : 0)}}</span>
        </div>
        <div v-if="!this.ogle" class="w-i-2" style="margin-top: 12px;margin-bottom: 0px;z-index: 202;pointer-events: none;">
          <span style="text-transform: capitalize;">Extraction Extract</span>
          <br>
          <span class="yld">{{parseFloat(extractAmount) - parseFloat(this.amount ? this.amount : 0)}}</span>
        </div>
        
      </div>
      <div class="bot-h" style="padding-bottom: 340px;">
        <div>
          
        </div>
        <div class="angl-c">
          <swiper
            style="bottom: 0;position: absolute;width:  100%"
            ref="mySwiper"
            :slides-per-view="1"
            :pagination="{
              type: 'progressbar',
            }"
            :space-between="50"
            @swiper="onSwiper"
            @slideChange="onSlideChange"
            :options="swiperOptions"
            >

            <swiper-slide class="slide" v-for="(oogle, idx) in state.oogles" :key="oogle.id">
              <ogle :oogle-id="oogle.id" :value="parseFloat(state.oogles[idx].value)"></ogle>
            </swiper-slide>

          </swiper>

          <div v-if="this.ogle" class="w-i-2" style="pointer-events: none;z-index: 202;position: absolute;right: 0px;text-align: right;bottom: 0px!important;background: rgba(255, 255, 255, 0.52);border-radius: 20px;font-weight: 300;">

            <span>Extraction Potency</span>
            <br>
            <span v-if="this.ogle" class="yld">{{(74 + (this.ogle.level*2))}}%</span>
          </div>
          <!-- <div class="w-i-2" style="margin-top: 40px;margin-bottom: 00px;z-index: 202;">
            <span>Next Level Potency</span><br><span class="yld">{{100 - (0.74 + 0.02 * this.ogle.level)}}%</span>
          </div> -->
          <div v-if="this.ogle" class="w-i-2" style="margin-top: 0px;z-index: 202;bottom: 0px!important;font-weight: 300;pointer-events: none;">
            <div style="background: rgba(255, 255, 255, 0.52);border-radius: 20px;">
              <span>Next Level Potency</span><br><span v-if="this.ogle" class="yld">{{(this.ogle.level == 11 ? 'Cap' : 74 + 2 * (this.ogle.level+1))}}%</span>
            </div>
            <div>
              <span>Eidol Level</span><br>
              <span v-if="this.ogle" class="yld">{{this.ogle.level}}</span>
            </div>
          </div>
          <img :class="{visible: stage == 1}" style="opacity:  0;transition: all 0.5s ease 0s;z-index: -1;position: absolute;bottom: 0px;left: 50%;margin-left: -750px;width: 1500px;" src="@/assets/popglow.png">
          <!-- <img :class="{off: stage == 0 || state.game.isLocked}" class="wiz" style="z-index: -1;" src="@/assets/smg.svg"> -->
          <investor :flip="false" :class="{off: stage == 0 || state.game.isLocked}"  style="" class="inv" :skin-id="state.user.investor_skin_id"></investor>
          <!-- <ogle v-if="this.ogle" class="egg" :value="this.ogle.value" :oogle-id="this.ogle.id"></ogle> -->
          <!-- <img style="z-index: -1;position: absolute;bottom: 140px;right: -15px;margin-right: 0px;width: 400px;" src="@/assets/misc/machine2.svg"> -->
          <img style="z-index: -1;position: absolute;bottom: 0px;right: -70px;margin-right: 0px;width: 400px;pointer-events: none;" src="@/assets/misc/table.svg">
          <img style="z-index: -1;position: absolute;bottom: 224px;right: 231px;margin-right: 0px;width: 70px;pointer-events: none;" src="@/assets/misc/bottle2.svg">
          <img style="z-index: -1;position: absolute;bottom: 140px;right: 115px;margin-right: 0px;width: 120px;transform:scale(-1,1);pointer-events: none;" src="@/assets/misc/Bottle3.svg">
          <img style="z-index: -1;position: absolute;bottom: 140px;right: -41px;margin-right: 0px;width: 120px;pointer-events: none;" src="@/assets/misc/Bottle3.svg">
          <img style="z-index: -1;position: absolute;bottom: 140px;right: 61px;margin-right: 0px;width: 70px;pointer-events: none;" src="@/assets/misc/bottle3.svg">
          <div class="animated-flame" style="z-index: -1;pointer-events: none;" :style="{'background-image': 'url(' + require('@/assets/misc/fire1.svg') + ')'}"></div>
          <!-- <img style="z-index: -1;position: absolute;bottom: 0px;left: 20px;margin-right: 0px;width: 170px;transform: scale(1,1);" src="@/assets/misc/alembic.svg"> -->
          <!-- <img style="z-index: 1;position: absolute;bottom: 140px;right: 85px;margin-right: 0px;width: 46px;" src="@/assets/misc/candle3.svg"> -->
          <img style="z-index: 1;position: absolute;bottom: 0px;left: 61px;margin-right: 0px;width: 110px;pointer-events: none;" src="@/assets/misc/Bottle1.svg">
          <!-- <div class="animated-smoke" style="" :style="{'background-image': 'url(' + require('@/assets/misc/smoke1.svg') + ')'}"></div> -->
          <div :class="{opq: this.stage > 0}" class="swiper-pagination-line extract" style="">
            
          </div>
          <div :class="{opq: this.stage == 0}" class="swiper-pagination-line-2" style="">
            <div style="width: 100%;height: 5px; background: black;">
              <div v-if="this.ogle" :style="{'width': (this.ogle.experience * 100 / this.ogle.next_level_experience) + '%' }" style="height: 5px; background: #e5c44f;transition: width 1.5s ease;"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="d-w-b" style="bottom: 180px;position: absolute;" v-if="!(isEgg || !this.ogle || extractAmount == 0 || isWaiting || state.game.isLocked || isSending || isError || stage > 0)">
        <input onkeypress='return event.charCode >= 48 && event.charCode <= 57' @focus="$event.target.select()" style="width: calc(23% - 50px);z-index: 300;overflow: hidden;margin-right: 20px;top: -65px;" placeholder="Amt" v-model="amount" type="number" />
        <div @click="submitWithdraw" :class="{lockeds: this.tooMuch || this.notEnough || !this.amount || this.amount < 1}"  style="width: calc(77% - 50px);z-index: 300;overflow: hidden;">
          <span v-if="!this.amount || this.amount < 1">Specify extraction amount</span>
          <span v-else-if="this.tooMuch">Extraction too large</span>
          <span v-else-if="this.notEnough">Not enough Extract</span>
          <span v-else>Prepare Extraction lab</span>
        </div>
        <!-- <div @click="withd"><img src="@/assets/Vector2.png"> Withdraw</div> -->
      </div>
      <button v-if="(isEgg || !this.ogle || extractAmount == 0 || isWaiting || state.game.isLocked || isSending || isError || stage > 0)" type="button"
        class="buttdw"
        @click="submitWithdraw"
        :class="{locked: isEgg || !this.ogle || extractAmount == 0 || isWaiting || state.game.isLocked || isSending || isError, success: isSuccessDW, slocked: isWaiting || isSending, unlocked: isError}">
          <span v-if="isSuccessDW">Done! Completing transaction...</span>
          <span v-else-if="isError">{{error}}</span>
          <span v-else-if="isSending">Processing Extraction...</span>
          <span v-else-if="isEgg && !state.game.isLocked">Cannot extract eggs</span>
          <span v-else-if="!this.ogle">You have no Eidol to extract</span>
          <span v-else-if="extractAmount == 0">You have no Extraction Extract</span>
          <span v-else-if="isWaiting">Setting up lab...</span>
          <span v-else-if="!state.game.isLocked && stage == 1">Approve Extraction</span>
          <span v-else-if="!state.game.isLocked && stage == 0">Prepare Extraction lab</span>
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
import { Swiper, SwiperSlide, directive } from 'vue-awesome-swiper'

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
    currentOogleIdx: 0,
    amount: 0,
    swiperOptions: {
      // pagination: {
      //   el: '.swiper-pagination',
      //   type: 'custom', //fraction
      //   renderCustom: function (swiper, current, total) {
      //     return current + '/' + total;
      //   },
      // },
      pagination: {
        el: '.swiper-pagination-line',
        type: 'bullets',
      },
      onInit: function (swiper) {
        swiper.slideTo(0)
      },
      initialSlide: 0
      // Some Swiper option/callback...
    }
  }),
  components: {
    Swiper,
    SwiperSlide,
    Ogle,
    Investor
  },
  directives: {
      swiper: directive
  },
  computed: {
    isEgg () {
      if (this.ogle)
        return this.ogle.type == 'egg';
      return false
    },
    extractAmount() {
      let found = this.state.items.find(element => element.id == 11);
      if (found) {
        return found.quantity
      } else {
        return 0;
      }

    },
    tooMuch () {
      return parseFloat(this.ogle.value) < parseFloat(this.amount)
    },
    notEnough() {
      return parseFloat(this.extractAmount) - parseFloat(this.amount) < 0
    },
    swiper() {
      return this.$refs.mySwiper.$swiper
    },
    ogle () {
      return state.oogles[this.currentOogleIdx];
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
    egcos () {
      if (this.selectEgg == 1) return 200;
      if (this.selectEgg == 2) return 800;
      if (this.selectEgg == 3) return 1500;
      if (this.selectEgg == 4) return 1750;
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
    }
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
    drop () {
      this.amount = 0;
      this.stage = 0;
      this.isWaiting = false
    },
    onSwiper () {
    },
    onSlideChange () {
      // if (!state.tutorial3Done) {
      //   this.isTutorial3 = false;
      //   state.tutorial3Done = true;
      //   window.localStorage.setItem('tutorial3-done',true)
      // }
      this.drop();
      console.log("SWIP",this.swiper)
      this.currentOogleIdx = this.swiper.activeIndex;
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
    submitWithdraw () {
      if (this.isError) return this.isError = false;
      if (this.isSending || this.isWaiting) return;
      if (this.stage == 0) {
        this.isWaiting = true
        setTimeout(()=>{
          this.stage = 1;
          this.isWaiting = false
        },3000)
      } else {
        this.isSending = true;
        axios
        .get(config.csrf)
        .then(() => {
          axios
            .post(config.api+'/oogles/'+ this.ogle.id +'/extract', {
              "amount": parseInt(this.amount),
            })
            .then(() => {
              this.isSuccessDW = true;
              this.amount = 0;
              setTimeout(()=>{utils.update_game();}, 750)
              setTimeout(()=>{this.wallet2();}, 3000)
            }).catch(error => {
              this.isSending = false;
              this.isError = true;
              this.error.message = error.response.data.message
            })
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
.lockeds {
  pointer-events: none;
  color: #ff8ee4!important;
  border-color: #ff8ee4!important;
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

.wall-c {
  overflow: hidden;
  width: 100%;
  position: absolute;
  height: 100%;
  background: black;
  right: -100%;
  z-index: 500;
  border-left: black 0px solid;
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

.visible {
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

.d-w-b {
  margin-top: 12px;
  height: 160px;
  width: 100%;
  background: none;
  transition: opacity .5s ease, max-height 1s ease;
  max-height: 160px;
  overflow: visible;
}

.d-w-b img {
  width: 60px;
}

.d-w-b div:first-of-type img {
  margin-right: 20px;
}

.d-w-b.locked {
  max-height: 0;
  pointer-events: none;
}

.d-w-b.locked div:first-of-type {
  /*border-color:  black;*/
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

.s-b {
  margin-top: 12px;
  height: 160px;
  width: 100%;
  background: none;
  margin-bottom:  4px;
}

.s-b div.dim {
  background: none!important;
  color: #E5C44F;
  pointer-events: none;
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
  border: 5px solid #E5C44F;
  font-size: 50px;
  color: #000000;
  background: #E5C44F;
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
  black-space: nowrap;
  text-align: left;
  margin-bottom: 0px;
  top: 0;
}

.g-s div div:last-of-type {
  position: relative;
  top: 0;
  color: black;
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
  color: black;
  font-family: Roboto;
  font-size: 28px;
  font-weight: 400;
}

.g-s-m div div:last-of-type {
  position: relative;
  top: 0;
  color: black;
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
  border-bottom: 5px solid black;
  margin-bottom: 20px;
  position: relative;
}

.w-i {
    position: absolute;
    bottom: 40px;
    right: 0px;
    color: black;
    font-family: 'Roboto';
    font-weight: 300;
    font-size: 60px;
    line-height: 80px;
    black-space: nowrap;
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

.the-angl {
  position: absolute;
  right: 0;
  bottom: 0;
  width: calc(100% - 160px);
  border-bottom: 5px dotted black;
  transform-origin: bottom right;
  opacity: 0.2;
}

.the-angl-2 {
  position: absolute;
  left: 0;
  bottom: 0;
  width: calc(100% - 160px);
  border-bottom: 5px dotted black;
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

.opq {
  opacity: 0;
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
  border-bottom: 5px dotted black;
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
  border-bottom: 5px dotted black;
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
  z-index: 202;
  transform-origin: bottom center;
  transform: scaleX(-1);
}

.wiz {
  position: absolute; bottom: 0; left: 0; margin-left: 50px;width: 350px;transition: left 1s ease;transform: scaleX(-1);
}
.wiz.off {
  left: -600px;
  transform: initial!important;
}

.inv {
  position: absolute; bottom: 0; left: 0; margin-left: 50px;transition: left 1s ease;
}
.inv.off {
  left: -600px;
  transform: scaleX(-1)!important;
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

@keyframes sprite2 {
    0% { background-position-x: 0%; }
    16.6% { background-position-x: 20%; }
    33.2% { background-position-x: 40%; }
    49.8% { background-position-x: 60%; }
    66.4% { background-position-x: 80%; }
    83% { background-position-x: 100%; }
}

.animated-flame {
  z-index: 2020;
  position: absolute;
  bottom: 240px;
  right: 45px;
  margin-right: 0px;
  width: 80px;
  height: 80px;
  display: block;
  background-size: 300px 75px;
  background-position-x: 0%;
  background-position-y: 0;
  background-repeat: no-repeat;
  animation: 1s step-start 0s infinite sprite;
}
.animated-smoke {
  z-index: 2020;
  position: absolute;
  bottom: 260px;
  left: -170px;
  margin-right: 0px;
  width: 502px;
  height: 502px;
  display: block;
  background-size: 3012px 502px;
  background-position-x: 0%;
  background-position-y: 0;
  background-repeat: no-repeat;
  animation: 2s step-start 0s infinite sprite2;
  opacity: 0.7;
}

.swiper-pagination-line, .swiper-pagination-line-2 {
  width: 100%;
  position: absolute;
  bottom: -5px;
  display: flex;
}
</style>

<style scoped>
.men-b .pixel-pop, 
.men-b .eye {
  display: none!important;
  opacity: 0!important;
}

.slide {
  width:  100%;
  height:  920px;
  display: flex;
  flex-grow: 1;
  flex-direction: column-reverse;
  justify-content: flex-start;
  opacity: 0;
  transition: .3s ease all;
}
.slide.swiper-slide-active {
  opacity: 1;
}

.swiper-pagination-fraction, .swiper-pagination-custom {
  bottom: initial!important;
}

.swiper-pagination {
  text-align: left;
}

input {
  transition: all .5s ease;
  display: inline-block;
  width: calc(100% - 80px);
  height: 160px;
  position: relative;
  line-height: 150px;
  text-align: center;
  border: 5px solid #e5c44f;
  font-size: 46px!important;
  background: none!important;
  color: #e5c44f;
  font-family: Rubik;
  border-radius: 25px;
  font-weight: 400;
  z-index: 1000;
  text-overflow: ellipsis;
  -webkit-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset;-moz-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset;box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset;
}

.d-w-b {
    margin-top: 12px;
    height: 160px;
    width: 100%;
    background: none;
    transition: opacity .5s ease, max-height 1s ease;
    max-height: 160px;
    overflow: visible;
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
    line-height: 150px;
    text-align: center;
    border: 5px solid;
    font-size: 46px;
    color: #fff;
    font-family: Roboto;
    border-radius: 25px;
    font-weight: 400;
    -webkit-box-shadow: 0px 6px 8px 0px rgba(80, 73, 34, 0.25);
    -moz-box-shadow: 0px 6px 8px 0px rgba(80, 73, 34, 0.25);
    box-shadow: 0px 6px 8px 0px rgba(80, 73, 34, 0.25);
  }

  .d-w-b div:active {
    -webkit-box-shadow: none;-moz-box-shadow: none;box-shadow: none;
  }


  

  .d-w-b div:last-of-type {
    /*margin-left: 40px;*/
    /*margin-right: 8px;*/
    border-color:  #e5c44f;
    background: #e5c44f;
  }

  .d-w-b.locked {
    max-height: 0;
    pointer-events: none;
    overflow: hidden!important;
  }

  .d-w-b.locked div:first-of-type {
    /*border-color:  white;*/
  }
</style>

<style>
  .extract .swiper-pagination-bullet-active {
    width: 100%!important;
    border: none;
    background: #e5c44f!important;
    height: 5px;
    border-radius: 0!important;
  }

  .extract .swiper-pagination-bullet {
    width: 100%!important;
    border: none;
    background: #000;
    height: 5px;
    border-radius: 0!important;
    opacity: 1!important;
  }
</style>

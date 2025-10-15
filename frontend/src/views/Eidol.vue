<template>
  <div v-if="!ogle" style="position: absolute;width: 100%;height: 100%;display: flex;flex-direction: column;justify-content: center;background: white;">
      <img src="../assets/loading.gif">
      <br><span style="display: block;position: relative;line-height: 10px;color: #000000;font-family: Rubik;font-weight: 400;font-size: 50px;height: 200px;margin-bottom: 200px;font-weight:700">Stabilizing Quantum-Temporal Flux...</span>
  </div>
  <div class="cont" :class="{loaded: state.isLoggedIn && ogle}" v-else-if="ogle">
    <div class="sw-t opaque" :class="{act: state.game.isLocked,disabled: !isTutorial && !state.game.isLocked && state.level != -1}">
      <img style="pointer-events:none" :class="{disabled: !(isTutorial && ogle.level != -1) || state.game.isLocked}" src="@/assets/swipe.png">
      <img @click="openIfLocked" :class="{disabled: !state.game.isLocked}" src="@/assets/lock-dapp.png">
      <img style="pointer-events:none" :class="{disabled: ogle.level != -1 || (state.isLoggedIn && ogle.level && ogle.level != -1) || state.game.isLocked }" src="@/assets/egg.png">
    </div>
    <div class="header" style="position: absolute;">
      <div class="back-b" @click="setChartSize">
          <img style="width: 60px;" src="@/assets/chart.png">
        </div>
      <div class="p-name">
        <div v-if="!walletActive" @click="wallet" style="width: auto;display: initial;">{{state.name}}</div>
        <div v-else @click="wallet" style="width: auto;display: initial;">{{state.name}}</div>
        <div @click="wallet" class="men-b" >
          <div class="overflow">
            <investor :width="110" :flip="true" style="transition: opacity 1s ease 0s;position: absolute;right: -15px;bottom: -9px;width: 110px;left: initial;top: initial;" class="egg" :skin-id="state.user.investor_skin_id"></investor>
          </div>
        </div>
      </div>
    </div>
    <div @touchstart="angleOntouchstart" @touchmove="angleOntouchmove" @touchend="angleOntouchend" class="tot-b">
      <div class="w-i-2" style="pointer-events: none;margin-bottom: 0;z-index: 302;">
        <span style="text-transform: capitalize;">{{this.ogle.rarity}} {{this.ogle.skin.collection}} Eidol<img class="cash" src="@/assets/Vector.png"></span>
        <br>
        <span class="yld">{{convertToBnb(this.ogle.value)}}<span v-if="parseFloat(this.ogle.value) > parseFloat(this.ogle.maxValue)"> / </span>
        <span class="lose" v-if="parseFloat(this.ogle.value) > parseFloat(this.ogle.maxValue)" style="font-size: 46px;">{{convertToBnb(this.ogle.maxValue)}}</span>
        <br>
        <span v-if="parseFloat(state.playerStats.diffs[this.ogle.id]) > 0" class="">
          <abbr>{{(state.options.chart_size == 168) ? '7d' : state.options.chart_size + 'h'}}</abbr> <abbr style="color: rgb(229, 196, 79);">▲</abbr> {{convertToBnb(state.playerStats.diffs[this.ogle.id])}}</span>
        <span v-if="parseFloat(state.playerStats.diffs[this.ogle.id]) < 0" class="">
          <abbr>{{(state.options.chart_size == 168) ? '7d' : state.options.chart_size + 'h'}}</abbr> <abbr style="color: #ff8ee4;">▼</abbr> {{convertToBnb(state.playerStats.diffs[this.ogle.id]*-1)}}</span>
      </div>
      <div :class="{visible: !touchPriority && !state.game.isLocked}" class="w-i-2" style="pointer-events: none;z-index: 302;">
        <span>Yieldy / Precise</span><br><span class="yld">{{this.ogle.data.greedy}}% / {{this.ogle.data.precise}} <abbr v-if="ogle.data.apple && new Date(ogle.data.apple.replace(' ', 'T')) > new Date()">(<abbr style="color: rgb(229, 196, 79);">+1</abbr>)</abbr></span>
      </div>
      <div class="w-i" style="z-index: 302;pointer-events: none;" v-if="state.level != -1">
        <span>&nbsp;</span><br>
        <span
        v-bind:key="idx"
        v-for="(winlose, idx) in state.stats[state.game.currentOogleIdx]"
        :class="{'win': winlose > 0, 'lose': winlose < 0, 'yld': idx==0}"
        :style="{'opacity': (1 - 0.15*idx), 'font-size': (idx==0)?'inherit':'46px'}"
        >
        {{convertToBnb(winlose)}}
        <br>
      </span>
    </div>
  </div>
  <div @touchstart="angleOntouchstart" @touchmove="angleOntouchmove" @touchend="angleOntouchend" class="g-s-m" style="overflow: scroll;">
  </div>
  <div class="bot-h">
    <div @touchstart="angleOntouchstart" @touchmove="angleOntouchmove" @touchend="angleOntouchend" class="angl-c">
      <chart :class="{visible: touchPriority || state.game.isLocked}" style="transition:  opacity 1s ease;width: calc(100% + 160px);margin-left:-80px;position: absolute;bottom: 0;opacity: 0.6;pointer-events: none;" v-if="state.playerStats.charts[this.ogle.id]" :oogleId="this.ogle.id" :maxValue="convertToBnb(this.ogle.top_value)" :noLossValue="convertToBnb(this.ogle.no_loss_value)" :baseValue="convertToBnb(this.ogle.value)"></chart>
      <chart-num class="chartmuted" :class="{visible: state.options.chart_mode == 1 || touchPriority || state.game.isLocked}" :verse="true" style="transition:  opacity 1s ease;width: calc(1080px - 26px);margin-left:-63px;position: absolute;bottom: 0;opacity: 0.6;pointer-events: none;"></chart-num>
      <div v-if="state.level != -1" :style="{ transform: 'rotate(-'+(logangle+170)+'deg)', 'border-color': uiColor }" ref="rad" class="radian"></div>
      <div v-if="state.level != -1" :style="{ transform: 'rotate('+(logangle+170)+'deg)', 'border-color': uiColor }" ref="rad" class="radian-2"></div>
      <div v-if="state.level != -1" :style="{ transform: 'rotate('+logangle+'deg)', 'border-color': uiColor, width: `calc( (100%) + (100%) * `+ lng +` ) ` }" ref="angl" class="the-angl">
          <!-- <div :style="{ 'background-color': uiColor, transform: 'scale(' + k*50 + ')' }"></div>
            <div class="bg" :style="{ 'background-color': uiColor, transform: 'scale(' + k*50 + ')' }"></div> -->
      </div>
          <div v-if="state.level != -1" :style="{ transform: 'rotate(-'+logangle+'deg)', 'border-color': uiColor, width: `calc( (100%) + (100%) * `+ lng +` ) ` }" ref="angl" class="the-angl-2">
          </div>
          <div :class="{visible: !touchPriority && !state.game.isLocked, losei: state.playerStats.rawcharts[this.ogle.id] && state.playerStats.rawcharts[this.ogle.id].find(el => el.game_id != null) && state.playerStats.rawcharts[this.ogle.id].find(el => el.game_id != null).type == 'bet' && state.playerStats.rawcharts[this.ogle.id].find(el => el.game_id != null).game_id == state.game.id - 1 && (!state.riskChanged[this.ogle.id] || state.riskChanged[this.ogle.id] != state.game.id)}" class="w-i" v-if="state.level != -1 && this.ogle.value > 0 && this.ogle && state.playerStats.rawcharts" style="pointer-events: none;">
            <!-- <span>Yield/Risk<img class="cash" src="@/assets/Vector.png"></span><br><span class="yld">{{expectedYield == 'Inf' ? 'Inf' : parseFloat(expectedYield).toFixed(3)}}</span> -->
            <span>Emanate / Risk
              <span v-if="state.playerStats.rawcharts[this.ogle.id] && state.playerStats.rawcharts[this.ogle.id].find(el => el.game_id != null) && state.playerStats.rawcharts[this.ogle.id].find(el => el.game_id != null).zone == 'bot' && state.playerStats.rawcharts[this.ogle.id].find(el => el.game_id != null).game_id == state.game.id - 1">↑</span>
              <span v-if="state.playerStats.rawcharts[this.ogle.id] && state.playerStats.rawcharts[this.ogle.id].find(el => el.game_id != null) && state.playerStats.rawcharts[this.ogle.id].find(el => el.game_id != null).zone == 'top' && state.playerStats.rawcharts[this.ogle.id].find(el => el.game_id != null).game_id == state.game.id - 1">↓</span>
            </span>
            <br>
            <span class="yld">{{(expYld/balance*100).toFixed(this.ogle.data.precise + (ogle.data.apple && new Date(ogle.data.apple.replace(' ', 'T')) > new Date() ? 1 : 0)) + '%'}}</span>

          </div>
        <!-- <div class="w-i-2">
          <div>
           <span>Aeon Pool<img class="cash" src="@/assets/Vector.png"></span><br><span class="yld">{{state.totalPool != -1 ? parseFloat(state.totalPool).toFixed(3) : '∞'}}</span>
          </div>
          <div>
            <span>Active Angles</span><br><span class="yld">{{state.bidsPlaced}}</span>
          </div>

        </div> -->
        <div  style="z-index: 302;pointer-events: none;" class="w-i-2" v-if="state.level != -1" :class="{visible: !touchPriority && !state.game.isLocked}">
          <div>
            <span>Eidol XP</span><br><span class="yld">{{this.ogle.experience}} / <span style="font-size: 46px;">{{this.ogle.next_level_experience}}</span></span>
          </div>
          <div>
            <span>Eidol Level</span><br><span class="yld">{{this.ogle.type == 'egg' ? 'Egg' : this.ogle.level}}</span>
          </div>
        </div>

        <!-- <div :class="{visible: !touchPriority || riskPercent < 38}" v-if="state.level != -1" style="z-index: 15;" class="eye" :style="{ bottom: 400 + 100 * (size - 1) + 'px', transform: 'scale(-' + ( Math.max(40,Math.min(k * 20 * size,50)) ) + ',' + ( Math.max(40,Math.min(k * 20 * size,50)) ) + ')  translate(0, -'+ k/2 +'px)' }"></div>
        <div :class="{visible: !touchPriority || riskPercent >= 38 || riskPercent < 14.44}" v-if="state.level != -1" style="z-index: 15;" class="eye-2" :style="{ bottom: 400 + 100 * (size - 1) + 'px', transform: 'scale(-' + ( Math.max(40,Math.min(k * 20 * size,50)) ) + ',' + ( Math.max(40,Math.min(k * 20 * size,50)) ) + ')  translate(0, -'+ k/2 +'px)' }"></div>
        <div :class="{visible: !touchPriority || riskPercent >= 14.44 || riskPercent < 5.4872}" v-if="state.level != -1" style="z-index: 15;" class="eye-3" :style="{ bottom: 400 + 100 * (size - 1) + 'px', transform: 'scale(-' + ( Math.max(40,Math.min(k * 20 * size,50)) ) + ',' + ( Math.max(40,Math.min(k * 20 * size,50)) ) + ')  translate(0, -'+ k/2 +'px)' }"></div>
        <div :class="{visible: !touchPriority || riskPercent >= 5.4872 || riskPercent < 2.085136}" v-if="state.level != -1" style="z-index: 15;" class="eye-4" :style="{ bottom: 400 + 100 * (size - 1) + 'px', transform: 'scale(-' + ( Math.max(40,Math.min(k * 20 * size,50)) ) + ',' + ( Math.max(40,Math.min(k * 20 * size,50)) ) + ')  translate(0, -'+ k/2 +'px)' }"></div>
        <div :class="{visible: !touchPriority || riskPercent >= 2.085136 || riskPercent == 0}" v-if="state.level != -1" style="z-index: 15;" class="eye-5" :style="{ bottom: 400 + 100 * (size - 1) + 'px', transform: 'scale(-' + ( Math.max(40,Math.min(k * 20 * size,50)) ) + ',' + ( Math.max(40,Math.min(k * 20 * size,50)) ) + ')  translate(0, -'+ k/2 +'px)' }"></div> -->

        <div v-if="state.level == 0" :class="{visible: !touchPriority}" :style="{ transform: 'scale(-' + ( size * predictSize ) + ',' + ( size * predictSize ) + ')', 'border-color': 'black'}" class="egg one" style="width: 100px;height:108.8px">
        </div>

        <!-- EGGS -->
        <!-- <img :style="{ transform: 'scale(' + size + ')' }" v-if="state.level == -1" class="egg" src="@/assets/eggs/egg-0-w.svg">
        <img :style="{ transform: 'scale(' + size + ')' }" v-if="state.level == 0 && state.oogle && state.oogle.skin == 'egg1'" class="egg" src="@/assets/eggs/egg1.svg">
        <img :style="{ transform: 'scale(' + size + ')' }" v-if="state.level == 0 && state.oogle && state.oogle.skin == 'egg2'" class="egg" src="@/assets/eggs/egg2.svg">
        <img :style="{ transform: 'scale(' + size + ')' }" v-if="state.level == 0 && state.oogle && state.oogle.skin == 'egg3'" class="egg" src="@/assets/eggs/egg3.svg">
        <img :style="{ transform: 'scale(' + size + ')' }" v-if="state.level == 0 && state.oogle && state.oogle.skin == 'egg4'" class="egg" src="@/assets/eggs/egg4.svg"> -->

        <!-- <img ref="monster" style="width: 100px; height: 100px;" :class="{upz: withActive}" :style="{ transform: 'scale(' + size + ')' }" v-if="state.oogle && state.level > 0 && state.oogle" class="egg" :src="getImgUrl(state.oogle.skin)"> -->
        <ogle :k="k" :uiColor="uiColor" :risk="(expYld/balance*100)" :class="{overoff: state.game.isLocked}" v-if="this.ogle" class="egg" :value="parseFloat(this.ogle.value)" :oogle-id="this.ogle.id"></ogle>

        <investor :flip="false" :puff="isMePuff" :class="{visible: (touchPriority && state.level != -1) || state.game.isLocked}"  style="transition:  opacity 1s ease;position: absolute;right: 0px;bottom: 0px;width: 300px;margin-left: -50px;left: initial;transform: scaleX(-1);" class="egg" :skin-id="state.user.investor_skin_id"></investor>

        <!-- <img :class="{visible: (touchPriority && state.level != -1) || state.isLocked}" style="transition:  opacity 1s ease;position: absolute;right: 0px;bottom: 0px;width: 300px;margin-left: -50px;left: initial;transform: scaleX(-1);" class="egg" :src="getSkinUrl(state.skin_id)"> -->

        <div v-if="state.oogle && state.level > 0" :class="{visible: !touchPriority}" :style="{ transform: 'scale(-' + ( size * predictSize ) + ',' + ( size * predictSize ) + ')', 'border-color': 'black'}" style="width: 100px; height: 100px;border-radius: 0;" class="egg one">
        </div>
        <div class="swiper-pagination-line" style="">
          <div style="width: 100%;height: 5px; background: black;">
            <div :style="{'width': (this.ogle.experience * 100 / this.ogle.next_level_experience) + '%' }" style="height: 5px; background: #e5c44f;transition: width 1.5s ease;"></div>
          </div>
        </div>
      </div>
      <div class="d-w-b" :class="{locked: (state.game.isLocked || this.ogle.type == 'egg') && this.ogle.value != 0}">
        <div v-if="state.level == -1" style="z-index: 400;overflow: hidden;" @click="dep">Buy Eidol egg</div>
        <div v-if="this.ogle.type != 'egg' && this.ogle.value > 0 && this.ogle.level != 11" style="z-index: 400;overflow: hidden;" @click="withd">Pop Eidol</div>
        <div v-if="this.ogle.type != 'egg' && this.ogle.value > 0 && this.ogle.level == 11" style="width: calc(50% - 50px);z-index: 400;overflow: hidden;margin-right: 20px;" @click="withd">Pop Eidol</div>
        <div v-if="this.ogle.type != 'egg' && this.ogle.value > 0 && this.ogle.level == 11" style="width: calc(50% - 50px);z-index: 400;overflow: hidden;" @click="upgd">Transmute Eidol</div>
        <div v-if="this.ogle.value == 0" style="z-index: 400;overflow: hidden;" @click="closs">Confirm Loss</div>
        <!-- <div @click="withd"><img src="@/assets/Vector2.png"> Withdraw</div> -->
      </div>
      <div class="ctdwn" style="pointer-events: none;">
        <div v-if="!state.game.isLocked">Next Crypto Aeon Block in</div>
        <div style="color:#ff8ee4" v-else><span v-if="state.game.isReload">Starting new Crypto Aeon</span><span v-else>Mining Crypto Aeon Block</span></div>
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
import Investor from '../components/Investor.vue'
import Ogle from '../components/Ogle.vue'
import Chart from '../components/Chart.vue'
import ChartNum from '../components/ChartNum.vue'

// import Vue3TouchEvents from 'vue3-touch-events'

function col2rgb(color) {
  return [(color&0xFF0000)>>16, (color&0xFF00)>>8, color&0xFF];
}

const firstColor = 0x000000;
const secondColor = 0xE5C44F;
const thirdColor = 0xFF8EE4;
const [r1, g1, b1] = col2rgb(firstColor)
const [r2, g2, b2] = col2rgb(secondColor)
const [r3, g3, b3] = col2rgb(thirdColor)
const MinAngle = 0.0;
const MaxAngle = 90.0;
const baseValue = 1; 

export default {
  data: () => ({
    state,
    stats: [],
    currentAnimId: null,
    touchStartX: null,
    touchStartY: null,
    moveStart: false,
    expectedYield: 0.0,
    //originalAngle: 0,
    uiColor: null,
    angle: 0.0,
    deposit: 0.0,
    rdy: false,
    //lng: 0,
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
    selectEgg: 1,
    maxEgg: 4,
    depLock: false,
    activeTouchId: null,
    rawchart2: null
  }),
  components: {
    Investor,
    Ogle,
    Chart,
    ChartNum
  },
  computed: {
    isMePuff () {
      if (this.state.items.find(element => element.type == 'Puff')) {
        console.log('PUFF FOUND')
        return true
      } else
        return false
    },
    logangle () {
      return Math.log(this.angle + 1) * (90 / Math.log(91));
    },
    size () {
      return (this.ogle.value/baseValue-1)/512 + 1;
    },
    expYld() {
      if (!this.ogle) return 0;
      return this.ogle.value*(utils.a2mlin(this.angle)-1)
    },
    ogle () {
      return state.oogles[state.game.currentOogleIdx];
    },
    pWith () {
      //console.log('MONST',this.$refs.monster)
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
      //console.log('PSIZE',this.state.balance, this.expectedYield)
      return ( parseFloat(this.ogle.value) + this.expYld ) / parseFloat(this.ogle.value);
    },
    balance () {
      return this.ogle.value;
    },
    k () {
      return  (4 / Math.cos(this.angle/180*Math.PI) - 4) < 30 ? (4 / Math.cos(this.angle/180*Math.PI) - 4) : 30
    },
    lng () {
      return Math.min(((this.ogle.value/Math.cos(this.logangle/180*Math.PI) - this.ogle.value) / this.ogle.value),3);
    },
    riskPercent () {
      return (this.expYld/this.balance*100)
    }
  },
  watch: {
    'state.items': {
      deep: true,
      immediate: true,
      handler(val) {
        if (val.find(el => el.type === 'Puff')) {
          console.log('PUFF FOUND (watcher)');
        }
      }
    },
    'state.playerStats.rawcharts': {
      deep: true,
      handler: ()=>{}
    },
    'state.oogles': {
      deep: true,
      handler: ()=>{}
    },
    'state.isLoggedIn': () => {},
    // 'state.angle': function (val) {
    //   if (val){
    //     if (!this.touchPriority) this.angle = val;
    //     if (this.balance)
    //       this.expectedYield = (this.ogle.value/Math.cos(this.angle/180*Math.PI) - this.ogle.value)
    //     this.update_angle_color();
    //   }
    // },
    // 'state.balance': function(val) {
    //     if (this.angle)
    //       this.expectedYield = val*(1/Math.cos(this.angle/180*Math.PI) - 1)
    //     this.lng = this.expectedYield / this.ogle.value;
    //     this.size = (Math.max(this.ogle.value/(this.convertToBnb2(100.0)),1)-1)/4 + 1;
    // },
    'ogle': function(val) {
      if (val){
        if (!this.touchPriority) this.angle = utils.m2alin(val.multiplier);
        this.update_angle_color();
      }
      this.loadTransactions()
    }
  },
  methods: {
    openIfLocked() {
      console.log('banner-click')
      window.open('https://mmr.angl.money', '_blank');
    },
    handleTouchMove(event) {
      event.preventDefault();
      // Your custom handling logic for touchmove
    },
    loadTransactions () {
      utils.loadTransactions();
    },
    onSlideChange () {
      //console.log('slide change');
    },
    convertToBnb (val) {
      if (val < 0) return '- ' + parseFloat(Math.abs(val)).toFixed(8);
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
      // if (this.depActive != true && this.withActive != true)
      //   this.walletActive = !this.walletActive;
      // else
      //   this.back2();
      this.$router.replace('/')
    },
    dep() {
      this.depActive = !this.depActive;
    },
    withd() {
      this.$router.push('/pop')
    },
    upgd() {
      this.$router.push('/transmute')
    },
    closs() {
        axios
        .get(config.csrf)
        .then(() => {
          axios.post(
            `${config.api}/oogles/` + this.ogle.id + `/confirmloss`,
            {
            }
            ).then(() => {
              utils.update_game();
              this.$router.replace('/')
            })
        });
    },
    update_angle_color() {
      const f1 = Math.abs((this.logangle - 45)/45);
      const f2 = 1 - f1;
      const f3 = (this.logangle - 45)/45 > 0 ? (this.logangle - 45)/45 : 0;
      const f4 = (45 - this.logangle)/45 > 0 ? (45 - this.logangle)/45 : 0;
      this.uiColor = '#' + parseInt(r1*f4 + r2*f2 + r3*f3 ).toString(16).padStart(2, '0')
      + parseInt(g1*f4 + g2*f2 + g3*f3 ).toString(16).padStart(2, '0')
      + parseInt(b1*f4 + b2*f2 + b3*f3 ).toString(16).padStart(2, '0');
    },
    place_bid() {
      if (this.state.game.isLocked) return;
      axios
      .get(config.csrf)
      .then(() => {
        axios.post(
          `${config.api}/game/join`,
          {
            "risk": (this.expYld/this.ogle.value).toFixed(this.ogle.data.precise+2 + (this.ogle.data.apple && new Date(this.ogle.data.apple.replace(' ', 'T')) > new Date() ? 1 : 0)),
            "oogle_id": this.ogle.id,
          }
          ).then(response => {
            utils.update_game(false,true)
            //setTimeout(utils.update_game(false,true),1000);
            if (response.data.success) {
              this.state.isJoined = true;
            } else {
              console.warn(response)
            }
          })
        })
    },
    angleOntouchstart(evt) {
      if (this.state.game.isLocked) return;
      if (evt.touches.length !== 1) return; // игнорируем мультитач в старте
      const touch = evt.touches[0];
      this.activeTouchId = touch.identifier; // запоминаем ID первого пальца
      this.touchStartX = touch.screenX;
      this.touchStartY = touch.screenY;
      this.touchPriority = true;
    },
    angleOntouchmove(evt) {
      if (this.state.game.isLocked) return;

      // ищем активное касание по ID
      const touch = Array.from(evt.touches).find(t => t.identifier === this.activeTouchId);
      if (!touch) return; // если такого пальца нет — значит это не наш активный палец

      if (!this.moveStart) {
        this.moveStart = true;
        this.isTutorial = false;
        state.tutorialDone = true;
        window.localStorage.setItem('tutorial-done', true);
      }
      if (this.state.isLocked) return;
      evt.preventDefault();
      this.state.riskChanged[this.ogle.id] = state.game.id;
      window.localStorage.setItem('risk-changed', JSON.stringify(this.state.riskChanged));
      this.updateAngle(this.touchStartX, this.touchStartY, touch.screenX, touch.screenY);
      this.touchPriority = true;
      clearTimeout(this.timer);
    },
    angleOntouchend(evt) {
      // проверяем, что палец, который отпустился — это наш активный
      const touchEnded = Array.from(evt.changedTouches).some(t => t.identifier === this.activeTouchId);
      if (!touchEnded) return;

      this.touchStartX = undefined;
      this.touchStartY = undefined;
      this.activeTouchId = undefined;
      if (this.state.isLocked) return;
      this.place_bid();
      this.timer = setTimeout(() => { this.touchPriority = false; }, 4000);
    },


      dOntouchstart(evt) {
        this.origCounter = this.dwCounter;
        this.touchStartX = evt.touches[0].screenX
        this.touchStartY = evt.touches[0].screenY
        this.touchPriority = true;
      },
      dOntouchmove(evt) {
        evt.preventDefault();
        if (!state.tutorial2Done) {
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
      let precision = this.ogle.data.precise
      if (this.ogle.data.apple && new Date(this.ogle.data.apple.replace(' ', 'T')) > new Date())
        precision++
      let delta = (startY - endY)/(1*(200**precision));
      let angleDelta = (startY - endY)/200*(100**precision);
      const multiplier = Math.abs((3.7 ** (Math.abs(delta)/2e3)-1));
      this.angle = Math.min(MaxAngle, Math.max(MinAngle, this.angle+angleDelta*multiplier));
      //this.lng = (this.ogle.value/Math.cos(this.angle/180*Math.PI) - this.ogle.value) / this.ogle.value //this.expYld / this.ogle.value;
      //console.log()
      // calc yield

      const f1 = Math.abs((this.logangle - 45)/45);
      const f2 = 1 - f1;
      const f3 = (this.logangle - 45)/45 > 0 ? (this.logangle - 45)/45 : 0;
      const f4 = (45 - this.logangle)/45 > 0 ? (45 - this.logangle)/45 : 0;
      this.uiColor = '#' + parseInt(r1*f4 + r2*f2 + r3*f3 ).toString(16).padStart(2, '0')
      + parseInt(g1*f4 + g2*f2 + g3*f3 ).toString(16).padStart(2, '0')
      + parseInt(b1*f4 + b2*f2 + b3*f3 ).toString(16).padStart(2, '0');
      // update graphics
    },
    onFrame() {
      if (this.expYld == 'Inf' || this.expYld == 0) {
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
    back2 () {
      this.withActive = false;
      this.depActive = false;
      this.selectEgg = 1
      setTimeout(()=>{this.dwCounter = 0;this.isSuccessDW=false;},500);
    },
    submit () {

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
          this.error.message = error.response.data.message
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
    setChartSize () {
      state.playerStats.charts = {};
      if (state.options.chart_size == 24) {
        state.options.chart_size = 48
        window.localStorage.setItem('chart-size',state.options.chart_size)
        utils.processChart(state.playerStats.rawcharts[this.ogle.id],this.ogle.id,this.ogle.value)
        utils.processNumChart(this.rawchart2)
      } else if (state.options.chart_size == 48) {
        state.options.chart_size = 168
        window.localStorage.setItem('chart-size',state.options.chart_size)
        utils.processChart(state.playerStats.rawcharts[this.ogle.id],this.ogle.id,this.ogle.value)
        utils.processNumChart(this.rawchart2)
      } else {
        state.options.chart_size = 24
        window.localStorage.setItem('chart-size',state.options.chart_size)
        utils.processChart(state.playerStats.rawcharts[this.ogle.id],this.ogle.id,this.ogle.value)
        utils.processNumChart(this.rawchart2)
      }
    },
  },
  mounted () {
    console.log('MOUNTED START')
    //this.loadTransactions();
    //utils.internal_clock()
    document.addEventListener("touchmove", this.handleTouchMove, {
      passive: false,
    });
    this.currentAnimId = window.requestAnimationFrame(this.onFrame);
    if (this.ogle && this.ogle.multiplier > 1) {
      //console.log('MTD2')
      this.angle = utils.m2alin(this.ogle.multiplier);
      utils.processChart(state.playerStats.rawcharts[this.ogle.id],this.ogle.id,this.ogle.value);
    }
    //this.loadTransactions()
    this.update_angle_color();
    //console.log('HOMEMNTD',)
    if (this.isTutorial) setTimeout(()=>{
      this.isTutorial = false;
    },5000)
    setTimeout(()=>{
      axios.get(`${config.api}/telemetry/num`)
      .then(response => {
        this.rawchart2 = response.data.data
        utils.processNumChart(this.rawchart2)
      })
    },500)
    if (this.isMePuff) {
      console.log('PUFF FOUND (mounted)')
    }
    console.log('MOUNTED END')
  },
  destroyed() {
    // Remove the event listener during the destroyed lifecycle hook
    document.removeEventListener("touchmove", this.handleTouchMove);
  },
}
</script>

<style scoped>

  .egg.upz {
    z-index: 2000!important;
    position: fixed;
    bottom: 385px;
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
  .losei {
    color: #ff8ee4!important;
  }

  .clock.locked {
    color: #ff8ee4;
  }

  .cont {
    opacity: 0;
    transition: opacity .5s ease;
    width: 100%;
    position: fixed;
    height: 100%;
    pointer-events: none;
    background: white;
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

  .act {
    pointer-events: initial!important;
  }

  .back-b {
    font-weight: 100;
    font-size: 30px;
    color: #000;
    font-family: Roboto;
    text-align: center;
    line-height: 100px;
    top: -20px;
    position: absolute;
    left: 20px;
    z-index: 1;
  }

  .visible {
    opacity: 0!important;
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
  }

  .d-w-b div:first-of-type {
    /*margin-right: 40px;*/
    /*margin-left: 8px;*/
    border-color:  black;
  }

  .d-w-b.locked {
    max-height: 0;
    pointer-events: none;
    overflow: hidden!important;
  }

  .d-w-b.locked div:first-of-type {
    /*border-color:  white;*/
  }

  .tot-b {
    margin-left: 80px;
    margin-right: 80px;
    width: calc(100% - 160px);
    position: relative;
    display: block;
    margin-top: 100px;
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

  .chartmuted .apexcharts-xaxis-label, .chartmuted .apexcharts-yaxis-label {
    display: none;
  }

  .angl-c {
    width: calc(100% - 160px);
    height: 920px;
    background: none;
    margin-left: 80px;
    margin-right: 80px;
    border-bottom: 5px solid black;
    margin-bottom: 40px;
    position: relative;
  }

  .w-i {
    position: absolute;
    bottom: 0px;
    right: 0px;
    color: black;
    font-family: 'Roboto';
    font-weight: 300;
    font-size: 60px;
    line-height: 80px;
    white-space: nowrap;
    text-align: right;
    margin-bottom: 30px;
    z-index: 302;
    transition: 1.5s ease opacity;
  }

  .w-i span:first-of-type {
    font-size: 46px;
  }

  .w-i-2 {
    position: relative;
    bottom: 0px;
    left: 0px;
    color: black;
    font-family: 'Roboto';
    font-weight: 300;
    font-size: 60px;
    line-height: 80px;
    white-space: nowrap;
    text-align: left;
    margin-bottom: 30px;
    top: 0;
    transition: 1.5s ease opacity;
  }

  .bot-h .w-i-2 {
    bottom: 0px!important;
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
    bottom: -4px;
    width: calc(100% + 160px);
    border-bottom: 5px dotted black;
    transform-origin: bottom right;
    opacity: 0.3;
    z-index: -1;
  }

  .the-angl-2 {
    position: absolute;
    left: 0;
    bottom: -4px;
    width: calc(100% + 160px);
    border-bottom: 5px dotted black;
    transform-origin: bottom left;
    opacity: 0.35;
    z-index: -1;
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
    opacity: 0.35;
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
    opacity: 0.4;
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
    opacity: 0.4;
  }

  .sw-t {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: #ffffffbf;
    z-index: 301;
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

  .egg {
    width: 100px;
    position: absolute;
    bottom: 0px;
    left: 50%;
    margin-left: -49px;
    z-index: 20;
    transform-origin: bottom center;
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

.swiper-pagination-line {
  width: 100%;
  position: absolute;
  bottom: -5px;
  display: flex;
}
</style>

<style>
html, body {
  overscroll-behavior: none;
}
</style>


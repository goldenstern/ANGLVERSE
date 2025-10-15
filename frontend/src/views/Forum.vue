<template>
  <div class="cont noselect" :class="{loaded: state.isLoggedIn}" >
    <div class="header" style="position: absolute;">
      <div class="p-name">
        <div @click="wallet" style="width: auto;display: initial;font-size: 30px">Return</div>
        <div @click="wallet" class="men-b" >
          <div class="overflow">
            <investor :width="110" :flip="true" style="transition: opacity 1s ease 0s;position: absolute;right: -15px;bottom: -9px;width: 110px;left: initial;top: initial;" class="egg" :skin-id="state.user.investor_skin_id"></investor>
          </div>
        </div>
      </div>
    </div>
    <div class="tot-b">
      <div v-if="this.nodeval" class="w-i-2" style="pointer-events: none;margin-bottom: 0;z-index: 202;">
        <span style="text-transform: capitalize;">Green Mining Pool<img class="cash" src="@/assets/Vector.png"></span>
        <br>
        <span class="yld">{{parseFloat(this.pool).toFixed(8)}}</span>
      </div>
      <div v-if="this.nodeval" class="w-i-2" style="pointer-events: none;z-index: 202;margin-bottom: 0;">
        <span>Minted into AnglVerse<img class="cash" src="@/assets/Vector.png"></span>
        <br>
        <span class="yld">{{parseFloat(this.mint).toFixed(8)}}</span>
      </div>
      <div v-if="this.nodeval" class="w-i-2" style="pointer-events: none;z-index: 202;margin-bottom: 0;">
        <span>Mining Nodes Live</span>
        <br>
        <span class="yld">{{this.nodes}}</span>
      </div>
      <div v-if="this.nodeval" class="w-i-2" style="pointer-events: none;z-index: 202;">
        <span>Masters Online Monthly</span>
        <br>
        <span class="yld">{{this.online}}</span>
      </div>
      <!-- <div class="w-i" style="z-index: 202;pointer-events: none;" v-if="state.level != -1">
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
    </div> -->
  </div>
  <div class="d-w-b" v-if="activity_state == 'disa'">
    <div @click="deposite"><img src=""> Deposit</div>
    <div @click="withdraw"><img src=""> Withdraw</div>
  </div>
  <div @touchstart="angleOntouchstart" @touchmove="angleOntouchmove" @touchend="angleOntouchend" class="g-s-m" v-if="activity_state == 'idle'">
  </div>
  <div class="bot-h">
    <div @touchstart="angleOntouchstart" @touchmove="angleOntouchmove" @touchend="angleOntouchend" class="angl-c" v-if="activity_state == 'idle'">
      <chart :verse="true" style="transition:  opacity 1s ease;width: calc(100vw - 0px);margin-left:-80px;position: absolute;bottom: 0;opacity: 0.6;pointer-events: none;"></chart>
      <!-- <div v-if="state.level != -1" :style="{ transform: 'rotate(-'+(angle+170)+'deg)', 'border-color': uiColor }" ref="rad" class="radian"></div>
      <div v-if="state.level != -1" :style="{ transform: 'rotate('+(angle+170)+'deg)', 'border-color': uiColor }" ref="rad" class="radian-2"></div>
      <div v-if="state.level != -1" :style="{ transform: 'rotate('+angle+'deg)', 'border-color': uiColor, width: `calc( (100vw - 160px) + (100vw - 160px) * `+ lng +` ) ` }" ref="angl" class="the-angl">
      </div>
      <div v-if="state.level != -1" :style="{ transform: 'rotate(-'+angle+'deg)', 'border-color': uiColor, width: `calc( (100vw - 160px) + (100vw - 160px) * `+ lng +` ) ` }" ref="angl" class="the-angl-2">
      </div> -->
      <!-- <div :class="{visible: !touchPriority && !state.game.isLocked}" class="w-i" style="pointer-events: none;">
        <span>Yield / Risk</span><br><span class="yld"></span>
      </div> -->
        <!-- <div class="w-i-2">
          <div>
           <span>Aeon Pool<img class="cash" src="@/assets/Vector.png"></span><br><span class="yld">{{state.totalPool != -1 ? parseFloat(state.totalPool).toFixed(3) : '∞'}}</span>
          </div>
          <div>
            <span>Active Angles</span><br><span class="yld">{{state.bidsPlaced}}</span>
          </div>

        </div> -->
        <!-- <div  style="z-index: 202;pointer-events: none;" class="w-i-2" v-if="state.level != -1" :class="{visible: !touchPriority && !state.game.isLocked}">
          <div>
            <span>Eidol XP</span><br><span class="yld"> / <span style="font-size: 46px;">11</span></span>
          </div>
          <div>
            <span>Eidol Level</span><br><span class="yld"></span>
          </div>
        </div> -->

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
        
        <investor :class="{visible: touchPriority && this.nodeval}" :flip="false"  style="transition:  opacity 1s ease;position: absolute;right: 0px;bottom: 0px;width: 300px;margin-left: -50px;left: initial;transform: scaleX(-1);" class="egg" :skin-id="state.user.investor_skin_id"></investor>
        <img :class="{visible: touchPriority && this.nodeval}" style="transition: 1.5s ease opacity;height: 740px;position: absolute;margin-left: -760px;left: 0px;bottom: 0;" src="@/assets/misc/forum1.png">
        <div :class="{visible: touchPriority && this.nodeval}" style="z-index: 15;" class="eye-2"></div>
        <!-- <img :class="{visible: (touchPriority && state.level != -1) || state.isLocked}" style="transition:  opacity 1s ease;position: absolute;right: 0px;bottom: 0px;width: 300px;margin-left: -50px;left: initial;transform: scaleX(-1);" class="egg" :src="getSkinUrl(state.skin_id)"> -->
      </div>
      <!-- <div class="g-s" v-if="activity_state == 'disa'">
        <div>
          <div>Aeon Pool<img class="cash" src="@/assets/Vector.png"></div>
          <div>{{state.totalPool != -1 ? parseFloat(state.totalPool).toFixed(3) : 'Calculating'}}</div>
        </div>
        <div>
          <div>Active Angles</div>
          <div>{{state.bidsPlaced}}</div>
        </div>
      </div> -->
      <div class="d-w-b" :class="{loading: !this.nodeval}">
        <div style="z-index: 300;overflow: hidden;" @click="dep" v-if="!this.nodeval">Listening for the Eye...</div>
        <div style="z-index: 300;overflow: hidden;" @click="dep" v-else>Pool Node Share: {{parseFloat(this.nodeval * 3).toFixed(2)}} USD</div>
      </div>
      <div class="ctdwn" style="pointer-events: none;">
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
import Investor from '../components/Investor.vue'
import Chart from '../components/Chart.vue'

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
// const baseValue = 1; 

export default {
  data: () => ({
    state,
    stats: [],
    activity_state: 'idle',
    currentAnimId: null,
    touchStartX: null,
    touchStartY: null,
    moveStart: false,
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
    depLock: false,
    pool: null,
    mint: null,
    nodes: null,
    online: null,
    nodeval: null
  }),
  components: {
    Investor,
    Chart
  },
  computed: {
    // size () {
    //   return (this.ogle.value/baseValue-1)/512 + 1;
    // },
    // expYld() {
    //   if (!this.ogle) return 0;
    //   return this.ogle.value*(utils.a2mlin(this.angle)-1)
    // },
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
    // predictSize () {
    //   //console.log('PSIZE',this.state.balance, this.expectedYield)
    //   return ( parseFloat(this.ogle.value) + this.expYld ) / parseFloat(this.ogle.value);
    // },
    // balance () {
    //   return this.ogle.value;
    // },
    // k () {
    //   return  (4 / Math.cos(this.angle/180*Math.PI) - 4) < 30 ? (4 / Math.cos(this.angle/180*Math.PI) - 4) : 30
    // },
    // lng () {
    //   return Math.min(((this.ogle.value/Math.cos(this.angle/180*Math.PI) - this.ogle.value) / this.ogle.value),3);
    // },
    riskPercent () {
      return (this.expYld/this.balance*100)
    }
  },
  watch: {
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
    loadTransactions () {
      // if (!this.ogle) return;
      // let trByGameId = {};
      // let winLoseHistory = [];
      //  axios.get(config.api+`/oogles/${this.ogle.id}/transactions`).then(res=>{
      //       //~ for (let transaction of res.data.data) {
      //       console.debug('loadTransactions', res, this.ogle.transactions)
      //       for (let transaction of this.ogle.transactions) {
      //           if (transaction.type !== 'win' && transaction.type !== 'bet') continue;
      //           if (trByGameId[transaction.game_id] === undefined)
      //               trByGameId[transaction.game_id] = [];
      //           trByGameId[transaction.game_id].push(transaction)
      //       }
      //       for (let gameId of Object.keys(trByGameId)) {
      //           if (trByGameId[gameId].length == 1) {
      //               winLoseHistory.push({
      //                   gameId,
      //                   'amount': parseFloat(trByGameId[gameId][0].amount)
      //               })
      //           } else {
      //               let winlose = parseFloat(trByGameId[gameId][0].amount) + parseFloat(trByGameId[gameId][1].amount)
      //               if (winlose == 0) continue;
      //               winLoseHistory.push({
      //                   gameId,
      //                   'amount': winlose
      //               });
      //           }
      //           winLoseHistory.sort((a, b) => {
      //               return b.gameId - a.gameId
      //           })
      //       }
      //       this.stats.splice(0,state.stats.length);
      //       winLoseHistory.slice(0,10).forEach(entry=>{
      //         this.stats.push(entry.amount)
      //       })
      //   })
      utils.loadTransactions();
      //console.log('OGLSTATS',state.stats)
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
      this.$router.push('/popeidol')
    },
    upgd() {
      this.$router.push('/traineidol')
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
              this.$router.replace('/')
            })
        });
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
    angleOntouchstart() {
      this.touchPriority = true;
    },
    angleOntouchmove(evt) {
        evt.preventDefault();
        this.touchPriority = true;
        clearTimeout(this.timer)
      },
      angleOntouchend() {
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
      let delta = (startY - endY)/(1*(200**this.ogle.data.precise));
      let angleDelta = (startY - endY)/200*(100**this.ogle.data.precise);
      const multiplier = Math.abs((3.7 ** (Math.abs(delta)/2e3)-1));
      this.angle = Math.min(MaxAngle, Math.max(MinAngle, this.angle+angleDelta*multiplier));
      //this.lng = (this.ogle.value/Math.cos(this.angle/180*Math.PI) - this.ogle.value) / this.ogle.value //this.expYld / this.ogle.value;
      //console.log()
      // calc yield

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
    loadState () {
      axios.get(`${config.api}/telemetry`)
        .then(response => {

          this.pool = response.data.data.total_pool
          this.nodes = response.data.data.totalNodes
          this.mint = response.data.data.total_mined
          this.online = response.data.data.total_users

          axios.get(`${config.api}/telemetry/chart`)
          .then(response => {
            this.nodeval = response.data.data[0].amount
            utils.processVerseChart(response.data.data)
          })


        })

    }
  },
  mounted () {
    this.loadState()
    setInterval(this.loadState,20000)
  }
}
</script>

<style scoped>

  .egg.upz {
    z-index: 2000!important;
    position: fixed;
    bottom: 385px;
  }

  .eye {
    position: absolute;
    width: 4px;
    height: 4px;
    left: 50%;
    bottom: 250px;
    margin-left: -2px;
    margin-bottom: -2px;
    background: #000;
    opacity: 1;
    background: url('~@/assets/angl5.png');
    background-size: contain;
    transform-origin: center center;
    transition: 1s ease opacity;
  }

  .eye-2 {
    position: absolute;
    width: 350px;
    height: 350px;
    left: 30%;
    bottom: 270px;
    margin-left: -2px;
    margin-bottom: -2px;
    opacity: 1;
    transform-origin: center center;
    transition: opacity 1s ease;
    transform: translateX(-50%) scaleX(-1);
    animation: levitate 10s ease infinite;
    background: url('~@/assets/angl4.png');
    background-size: contain;
    transform-origin: center center;
    transition:  opacity 1s ease;
  }

  @keyframes levitate2 {
    0% {
      bottom: 270px;
    }

    33% {
      bottom: 250px;
    }

    66% {
      bottom: 290px;
    }

    100% {
      bottom: 270px;
    }
  }

  @keyframes levitate {
    0% {
      bottom: 270px;
    }

    33% {
      bottom: 240px;
    }

    66% {
      bottom: 290px;
    }

    100% {
      bottom: 270px;
    }
  }

  .eye-3 {
    position: absolute;
    width: 4px;
    height: 4px;
    left: 50%;
    bottom: 250px;
    margin-left: -2px;
    margin-bottom: -2px;
    background: #000;
    opacity: 1;
    background: url('~@/assets/angl3.png');
    background-size: contain;
    transform-origin: center center;
    transition: 1s ease opacity;
  }

  .eye-4 {
    position: absolute;
    width: 4px;
    height: 4px;
    left: 50%;
    bottom: 250px;
    margin-left: -2px;
    margin-bottom: -2px;
    background: #000;
    opacity: 1;
    background: url('~@/assets/angl2.png');
    background-size: contain;
    transform-origin: center center;
    transition: 1s ease opacity;
  }

  .eye-5 {
    position: absolute;
    width: 4px;
    height: 4px;
    left: 50%;
    bottom: 250px;
    margin-left: -2px;
    margin-bottom: -2px;
    background: #000;
    opacity: 1;
    background: url('~@/assets/angl.png');
    background-size: contain;
    transform-origin: center center;
    transition: 1s ease opacity;
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
    color: #000000;
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
    pointer-events: none!important;
    color: #ff8ee4;
    border-color: #ff8ee4;
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
    color: #ff8ee4;
  }

  .clock.locked {
    color: #ff8ee4;
  }

  .wall-c {
    overflow: hidden;
    width: 100vw;
    position: absolute;
    height: 100%;
    background: black;
    right: -100vw;
    z-index: 500;
    border-left: black 0px solid;
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
    border-left: black 0px solid;
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

/*  .men-b div:first-of-type {
    background: none;
    height: 5px;
    width: 80px;
    position: absolute;
    bottom: 60px;
  }*/

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

/*  .men-b div:last-of-type {
    background: none;
    height: 5px;
    width: 40px;
    position: absolute;
    bottom: 40px;
  }*/

  .p-name div:first-of-type {
    width: auto;
    display: initial;
    top: 10px;
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

  .over {
    z-index: 200!important;
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
    transition: all .5s ease;
    display: inline-block;
    width: calc(100% - 80px);
    margin-left: 40px;
    margin-right: 40px;
    height: 160px;
    position: relative;
    line-height: 150px;
    text-align: center;
    border: 5px solid #e5c44f;
    font-size: 50px;
    background: none!important;
    color: #e5c44f;
    font-family: Rubik;
    border-radius: 25px;
    font-weight: 400;
    z-index: 1000;
    text-overflow: ellipsis;
    pointer-events: none;
    box-shadow: inset 0 5px 10px 2px rgb(34 60 80 / 20%);
  }

  .d-w-b div:active {
    -webkit-box-shadow: none;-moz-box-shadow: none;box-shadow: none;
  }


  

  /*.d-w-b div:last-of-type {
    border-color:  #e5c44f;
  }

  .d-w-b div:first-of-type {
    border-color:  black;
  }*/

  .d-w-b.locked {
    max-height: 0;
    pointer-events: none;
    overflow: hidden!important;
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

  .angl-c {
    width: calc(100vw - 160px);
    height: calc(100vw - 160px);
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
    z-index: 202;
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
    bottom: 0;
    width: calc(100vw - 160px);
    border-bottom: 5px dotted black;
    transform-origin: bottom right;
    opacity: 0.3;
  }

  .the-angl-2 {
    position: absolute;
    left: 0;
    bottom: 0;
    width: calc(100vw - 160px);
    border-bottom: 5px dotted black;
    transform-origin: bottom left;
    opacity: 0.35;
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

.d-w-b.loading div {
  color: #ff8ee4!important;
  border-color: #ff8ee4!important;
}
</style>

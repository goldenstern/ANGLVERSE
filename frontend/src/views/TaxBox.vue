<template>
  <div class="cont" :class="{loaded: state.isLoggedIn}" v-if="state.user.balance_ngls !== null">
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
    <div class="flex-content">
      <!-- <div class="flex-item-1">
        <img src="@/assets/ref.png" style="background: white; width: 100%;bottom: 0px;margin-top: -0px;margin-bottom: -70px;">
      </div> -->
      <div class="wall-c active flex-item-2" style="margin-top: 15%">
        <div class="tot-b" style="z-index: 10;font-size: 38px;">
          <div style="width: 100%; text-align: center;">
            <div style="display: inline-block;">
              <img src="@/assets/misc/taxbox.png" style="width: 200px;">
            </div>
          </div>
          <!-- <p>With «Trainer Indulgence» you will receive an additional one-use Eidol slot for your Deck.</p> -->
          <!-- <p><span style="font-size: 46px;font-family: 'Roboto';">«Trainer Indulgence»</span><br>Requires: 1 Cooperation Token<br><br>With «Trainer Indulgence» you will receive an additional one-use Eidol slot for your Deck.<br><br>Collect Cooperation Tokens by inviting your friends into AnglVerse. To claim your and your friends rewards they will need to register by visiting your Cooperation Invite Link and buy an Eidol Egg.</p> -->
          <p><span style="font-size: 46px;font-family: 'Roboto';">GoldenState Tax Box</span><br>Put in your Tax Commendation to become a Patricius for 1 Month<br><br>Patricius title allows you to enter GoldenState Federal Foundation building and receive extra gDAO tokens for important actions made by your Patrons, a Masters who was invited into AnglVerse by your Coop link.<br><br>Patricius also able to exchange their gDAO tokens into Angl Shards.</p>
          <!-- <img src="@/assets/promo/co/main.png" style="width: 100%;margin: 5% 0%;bottom: 0px;margin-bottom: -220px;margin-top: -220px;">
          <img src="@/assets/ref.png" style="width: 100%;margin: 5% 0%;bottom: 0px;"> -->
        </div>
      </div>
      <div style="width: 100%;" class="flex-item-3" :class="{long: tokenAmount > 0}">
        <div style="color: #e5c44f;font-size: 55px;width: 100%;z-index: 1000;">Patricius Title Duration</div>
        <div style="position: relative;">
          <input class="reflink" placeholder="reflink" v-model="patriciusDuration" type="text" />
        </div>
        <div class="height-box" :class="{hidden: tokenAmount == 0}" style="position: relative;">
          <button @click="drop" style="margin-top: 40px" class="button-fixed" :class="{success: isSuccessDW, locked: isError || isSending, slocked: isSending, unlocked: isError }">
            <span v-if="isError">{{error}}</span>
            <span v-else-if="isSuccessDW">Done!</span>
            <span v-else-if="!isSending">Put in Commendation</span> 
            <span v-else-if="isSending">Processing transaction...</span>
          </button>
        </div>
        <div style="color: #e5c44f;font-size: 55px;width: 100%;z-index: 1000;position: absolute;margin-top: 10px;">Tax Commendations: {{tokenAmount}}</div>
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
import Investor from '../components/Investor.vue';

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
    utils,
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
    timer2: null,
    swiperOptions: {
      pagination: {
        el: '.swiper-pagination',
        type: 'custom', //fraction
        renderCustom: function (swiper, current, total) {
          return current + '/' + total;
        }
      },
      // Some Swiper option/callback...
    },
    isError: false,
    error: '',
    isSending: false
  }),
  components: {
    Investor,
  },
  computed: {
    patriciusDuration() {
      const currentDate = new Date();
      const patriciusDate = new Date(state.user.patricius);
      console.log("PATR",patriciusDate)
      console.log("PATR",currentDate)
      console.log("PATR2",patriciusDate < currentDate)

      // Check if patriciusDate is null or in the past
      if (!patriciusDate || patriciusDate < currentDate) {
        return 'No Title';
      }

      const timeDifference = patriciusDate - currentDate;
      console.log("PATR3",timeDifference)
      const minutes = Math.floor(timeDifference / (1000 * 60));
      const hours = Math.floor(timeDifference / (1000 * 60 * 60));
      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

      // Return the appropriate duration based on the time difference
      if (days > 0) {
        console.log("PATRd",days)
        return `${days} day${days > 1 ? 's' : ''} left`;
      } else if (hours > 0) {
        console.log("PATRh",hours)
        return `${hours} hour${hours > 1 ? 's' : ''} left`;
      } else if (minutes > 0) {
        console.log("PATRm",minutes)
        return `${minutes} minute${minutes > 1 ? 's' : ''} left`;
      } else {
        console.log("PATR4")
        return 'No Title';
      }
    },
    tokenAmount() {
      let found = this.state.items.find(element => element.id == 7);
      if (found) {
        return found.quantity
      } else {
        return 0;
      }

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
    'state.game': {
      handler(){

      },
      deep: true
    },
    'state.user': {
      handler(){
        console.debug('state.user', state)
      },
      deep: true
    },
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
    goOgle () {
      this.$router.push('/ogle')
    },
    goBuy () {
      this.$router.push('/eggshop')
    },
    send () {
      this.$router.push('/')
    },
    onSwiper (swiper) {
      console.log(swiper);
    },
    onSlideChange (event) {
      state.game.currentOogleIdx = this.swiper.activeIndex;
      console.log('slide change', event, this.swiper);
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
      if (this.state.forum.length != 0) {
        this.$router.replace('/forum')
      } else {
        router.go(-1);
      }
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
      if (this.state.game.isLocked || this.state.level == -1) return;
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
      if (this.state.game.isLocked) return;
      evt.preventDefault();
      this.updateAngle(this.touchStartX, this.touchStartY, evt.touches[0].screenX, evt.touches[0].screenY)
      this.touchPriority = true;
      clearTimeout(this.timer)
    },
    angleOntouchend() {
        this.originalAngle = null;
        this.touchStartX = undefined
        this.touchStartY = undefined
        if (this.state.game.isLocked) return;
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
    copylink() {
      console.log("CLICKES")
      const shareData = {
        title: state.user.name + "'s AnglVerse Invite" ,
        text: 'Join the AnglVerse and cooperate.',
        url: state.user.ref_link
      }
      if (navigator) navigator.share(shareData)
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
    drop () {
      //this.$router.push('/gdaoshop')
      if (this.isError) return this.reset()
      if (this.isSending) return;
      this.isSending = true;
      axios
        .get(config.csrf)
        .then(() => {
          axios
            .post(config.api+`/rooms/tax`)
            .then(() => {
              this.isSuccessDW = true;
              this.isSending = false;
              setTimeout(()=>{utils.update_game();}, 750)
              setTimeout(()=>{this.isSuccessDW = false;}, 1000)
            }).catch(error => {
              this.isSending = false;
              this.isError = true;
              this.error = error.response.data.message
            })
        })
    },
    reset () {
      this.isError = false
    },
    trigger () {
      this.enterForum();
    }
  },
  mounted () {
    //console.log('STATE',state)
    //utils.internal_clock();
    this.currentAnimId = window.requestAnimationFrame(this.onFrame);
    if (this.state.isJoined) {
      this.balance = this.state.balance;
      this.angle = this.state.angle;
      this.expectedYield = this.balance/Math.cos(this.angle/180*Math.PI) - this.balance
    }
    if (this.state.forum.length != 0) {
      this.timer2 = setInterval(this.trigger,30000)
    }
    this.update_angle_color();
    //console.log('HOMEMNTD',)
  },
  destroyed () {
    if (this.state.forum.length != 0) {
      clearInterval(this.timer2)
    }
  },
  filters: {
    toFixed8 (value) {
      return parseFloat(value).toFixed(8)
    }
  }
}
</script>

<style scoped>

.flex-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.flex-item-1 {
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: auto;
}

.flex-item-3 {
  flex-grow: 1;
  flex-shrink: 0;
  flex-basis: auto;
  height: 423px;
  transition: .3s ease all;
}

.flex-item-3.long {
  height: 623px;
}

.flex-item-2 {
  flex-grow: 2;
  flex-shrink: 2;
  flex-basis: auto;
}

.swiper-pagination-fraction, .swiper-pagination-custom {
  bottom: initial!important;
}

.swiper-pagination {
  text-align: left;
}

.egg.upz {
  z-index: 2000!important;
  position: fixed;
  bottom: 385px;
}

.slide {
  width:  100%;
  height:  920px;
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
}
.buttdw.locked {
  pointer-events: none!important;
  color: rgb(255, 0, 153);
  border-color: rgb(255, 0, 153);
  background: none!important;
}
.buttdw.success {
  pointer-events: none!important;
  color: #e5c44f;
  background: none!important;
}

.win {
  color: #e5c44f;
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
  width: 100%;
  height: 100%;
  background: white;
  right: -100%;
  z-index: 500;
  border-left: white 0px solid;
  transition: 1s right ease;
  display: flex;
}

.wall-c.active {
  right: 0;
}

.dep-c {
  width: 100%;
  position: absolute;
  height: 100%;
  background: black;
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
  top: -10px;
  position: relative;
  right: 20px;
}

.p-name {
  font-size: 46px;
  color: #black;
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
  border-color:  #e5c44f;
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
  display: flex;
    flex-direction: column;
    justify-content: space-evenly;
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
  width: 100%;
    height: 160px;
    z-index: 501;
    position: relative;
    bottom: 0;
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
    bottom: 0px;
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
    margin-bottom: 30px;
    top: 0;
    transition: 1.5s ease opacity;
}

.bot-h .w-i-2 {
  bottom: 80px!important;
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

input {
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
  font-size: 46px;
  background: none!important;
  color: #e5c44f;
  font-family: Rubik;
  border-radius: 25px;
  font-weight: 400;
  z-index: 1000;
  text-overflow: ellipsis;
  pointer-events: none;
  -webkit-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset;-moz-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset;box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset;
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
    font-size: 46px;
    background: #e5c44f!important;
    color: #fff;
    font-family: Rubik;
    border-radius: 25px;
    font-weight: 400;
    bottom: 160px;
    left: 0;
    -webkit-box-shadow: 0px 6px 8px 0px rgba(80, 73, 34, 0.25);-moz-box-shadow: 0px 6px 8px 0px rgba(80, 73, 34, 0.25);box-shadow: 0px 6px 8px 0px rgba(80, 73, 34, 0.25);
  }

  button:active {
    -webkit-box-shadow: none;-moz-box-shadow: none;box-shadow: none;
  }

  button.locked {
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
  button.slocked {
    pointer-events: none!important;
    color: rgb(229, 196, 79)!important;
    border-color: rgb(229, 196, 79)!important;
    background: none!important;
    -webkit-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset!important;
      -moz-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset!important;
      box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset!important;
  }
  button.success {
    pointer-events: none!important;
    color: rgb(229, 196, 79);
    background: none!important;
    border: 5px solid #e5c44f;
    -webkit-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset!important;
      -moz-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset!important;
      box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset!important;
  }

  .height-box {
    height: 200px;
    transition: .3s ease all;
  }

  .height-box.hidden {
    height: 0px;
    overflow: hidden;
  }
</style>

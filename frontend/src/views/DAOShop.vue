<template>
  <div class="cont noselect" :class="{loaded: state.isLoggedIn}">
    <div class="dep-c active">
      <div class="header" style="position: absolute;">
        <div class="p-name">
          <div @click="wallet" style="width: auto;display: initial;font-size: 30px;">Return</div>
          <div @click="wallet" class="men-b" >
            <div class="overflow" style="z-index: 1000">
              <investor :width="110" :flip="false" style="transition: opacity 1s ease 0s;position: absolute;right: -15px;bottom: -9px;width: 110px;left: initial;top: initial;" class="egg" :skin-id="state.user.investor_skin_id"></investor>
            </div>
          </div>
        </div>
      </div>
      <div class="sw-t opaque" :class="{disabled: !isTutorial2}">
        <img :class="{disabled: !(isTutorial2)}" src="@/assets/swipe2.png">
      </div>
      <!--
      <img :style="{ transform: 'scale(' + ((Math.max(100/(100),1)-1)/4 + 1) + ')' }" v-if="selectEgg == 1" style="position: absolute;left: 50%;bottom: 390px;width: 100px;margin-left: -50px;" class="egg" src="@/assets/eggs/egg1.svg">
      <img :style="{ transform: 'scale(' + ((Math.max(400/(100),1)-1)/4 + 1) + ')' }" v-if="selectEgg == 2" style="position: absolute;left: 50%;bottom: 390px;width: 100px;margin-left: -50px;" class="egg" src="@/assets/eggs/egg2.svg">
      <img :style="{ transform: 'scale(' + ((Math.max(750/(100),1)-1)/4 + 1) + ')' }" v-if="selectEgg == 3" style="position: absolute;left: 50%;bottom: 390px;width: 100px;margin-left: -50px;" class="egg" src="@/assets/eggs/egg3.svg">
      <img :style="{ transform: 'scale(' + ((Math.max(1000/(100),1)-1)/4 + 1) + ')' }" v-if="selectEgg == 4" style="position: absolute;left: 50%;bottom: 390px;width: 100px;margin-left: -50px;" class="egg" src="@/assets/eggs/egg4.svg">
    -->

      <div class="tot-b" style="margin-top: 140px;">
        <investor style="position: absolute;left:-70px;top:-30px" :skin-id="state.user.investor_skin_id"></investor>
        <div class="wall-h" style="margin-top: 40px;z-index: 202;text-align: right;right: -20px; position: relative;">
          <span v-if="availableShopItems[selectedIdx] && from_currency == 'busd'" class="yld" style="font-size:85px">{{state.user.balance_busd | formatCoin}}<img style="width:43px" class="cash" src="@/assets/VectorBusd.png"></span>
          <span v-else-if="availableShopItems[selectedIdx] && from_currency == 'gdao'" class="yld" style="font-size:85px">{{tokenAmount}}<img style="width:43px" class="cash" src="@/assets/VectorDAO.png"></span>
          <span v-else-if="availableShopItems[selectedIdx] && from_currency == 'bnb'" class="yld" style="font-size:85px">{{state.user.balance_bnb | formatCoin}}<img style="width:43px" class="cash" src="@/assets/VectorBnb.png"></span>
          <span v-else class="yld" style="font-size:85px">{{state.user.balance_ngls | formatCoin}}<img style="width:43px" class="cash" src="@/assets/Vector.png"></span>
          <!-- <br>
          <span class="yld" style="font-size:60px">{{state.user.balance_bnb | formatCoin}} <img class="cash" src="@/assets/VectorBnb.png"></span> -->
        </div>
        <div style="margin-top: 10px;text-align: right;padding-bottom:20px">
          <div style="display: inline-block;font-size: 55px;margin-right: 5px;">⥥
            <span v-if="availableShopItems[selectedIdx] && from_currency == 'gdao'" class="lose">-{{fee.toFixed(0)}}</span>
            <span v-else-if="availableShopItems[selectedIdx]" class="lose">-{{fee.toFixed(8)}}</span>
            <span v-else class="lose">Loading shop</span>
          </div><br>
          <span v-if="from_currency == 'bnb'" style="font-size: 30px;">Shop Fee + Gas Up To + Gas Deposit</span>
          <span v-else-if="from_currency == 'gdao'" style="font-size: 30px;">gDAO Shop Fee</span>
          <span v-else style="font-size: 30px;">Shop Fee + Gas Up To</span>
        </div>
        <div v-if="availableShopItems[selectedIdx] && availableShopItems[selectedIdx].type == 'egg'" class="w-i-2" style="margin-top: 12px;margin-bottom: 0;z-index: 202;background: rgb(255 255 255 / 85%);border-radius: 20px;">
          <span>Eidol Hatchling Value<img class="cash" src="@/assets/Vector.png"></span><br>
            <span class="yld win">{{parseFloat(availableShopItems[selectedIdx].data.value).toFixed(8)}}</span>
        </div>
        <div v-if="availableShopItems[selectedIdx] && from_currency == 'ngls' && availableShopItems[selectedIdx].type == 'egg'" class="w-i-2" style="margin-top: 0px;z-index: 202;margin-bottom: 0;background: rgb(255 255 255 / 85%);border-radius: 20px;">
          <span>Item Cost<img class="cash" src="@/assets/Vector.png"></span><br>
            <span class="yld lose">{{parseFloat(availableShopItems[selectedIdx].price_ngls - availableShopItems[selectedIdx].data.value + availableShopItems[selectedIdx].nodeshare).toFixed(8)}}</span>
        </div>
        <!-- <div v-if="availableShopItems[selectedIdx] && availableShopItems[selectedIdx].type == 'egg'" class="w-i-2" style="margin-top: 0px;z-index: 202;background: rgb(255 255 255 / 85%);border-radius: 20px;">
          <span>Node Share<img class="cash" src="@/assets/Vector.png"></span><br>
            <span class="yld lose">{{parseFloat(availableShopItems[selectedIdx].nodeshare).toFixed(8)}}</span>
        </div> -->
        <div v-if="availableShopItems[selectedIdx] && from_currency == 'ngls' && availableShopItems[selectedIdx].type != 'egg'" class="w-i-2" style="margin-top: 12px;z-index: 202;margin-bottom: 0;background: rgb(255 255 255 / 85%);border-radius: 20px;">
          <span>Item Cost<img class="cash" src="@/assets/Vector.png"></span><br>
            <span class="yld lose">{{parseFloat(availableShopItems[selectedIdx].price_ngls).toFixed(8)}}</span>
        </div>
        <div v-else-if="availableShopItems[selectedIdx] && availableShopItems[selectedIdx].price_bnb && !availableShopItems[selectedIdx].price_ngls" class="w-i-2" style="margin-top: 12px;z-index: 202;margin-bottom: 0;background: rgb(255 255 255 / 85%);border-radius: 20px;">
          <span>Item Cost<img class="cash" src="@/assets/VectorBnb.png"></span><br>
            <span class="yld lose">{{parseFloat(availableShopItems[selectedIdx].price_bnb).toFixed(8)}}</span>
        </div>
        <div v-else-if="availableShopItems[selectedIdx] && availableShopItems[selectedIdx].price_busd && !availableShopItems[selectedIdx].price_ngls" class="w-i-2" style="margin-top: 12px;z-index: 202;margin-bottom: 0;background: rgb(255 255 255 / 85%);border-radius: 20px;">
          <span>Item Cost<img class="cash" src="@/assets/VectorBusd.png"></span><br>
            <span class="yld lose">{{parseFloat(availableShopItems[selectedIdx].price_busd).toFixed(8)}}</span>
        </div>
        <div v-else-if="availableShopItems[selectedIdx] && availableShopItems[selectedIdx].price_token && !availableShopItems[selectedIdx].price_ngls" class="w-i-2" style="margin-top: 12px;z-index: 202;margin-bottom: 0;background: rgb(255 255 255 / 85%);border-radius: 20px;">
          <span>Item Cost<img class="cash" src="@/assets/VectorDAO.png"></span><br>
            <span class="yld lose">{{parseFloat(availableShopItems[selectedIdx].price_token).toFixed(0)}}</span>
        </div>
        <div v-if="availableShopItems[selectedIdx] && availableShopItems[selectedIdx].type == 'item'" class="w-i-2" style="white-space: initial;margin-top: 0px;z-index: 202;background: rgb(255 255 255 / 85%);border-radius: 20px;">
          <span>Description:<br>
            <span>{{availableShopItems[selectedIdx].description}}</span>
        </div>
        <div v-if="availableShopItems[selectedIdx] && availableShopItems[selectedIdx].type == 'gdao'" class="w-i-2" style="white-space: initial;margin-top: 0px;z-index: 202;background: rgb(255 255 255 / 85%);border-radius: 20px;">
          <span>Description:<br>
            <span>{{availableShopItems[selectedIdx].description}}</span>
        </div>
        
      </div>
      <div class="bot-h" style="padding-bottom: 320px;">
        <div>
          <div v-if="availableShopItems[selectedIdx]" :style="{ bottom: (660 + 0 * ((Math.max(egval/(100),1)-1)/4 + 1)  + 'px!important')}" class="w-i-2" style="z-index: 202;position: absolute;left: 80px;text-align: left;bottom: 538px!important;background: rgb(255 255 255 / 85%);border-radius: 20px;">

            <span v-if="selectEgg == 1" style="text-transform: capitalize;">{{availableShopItems[selectedIdx].data.rarity}} <span v-if="availableShopItems[selectedIdx].amount != 'many'">({{availableShopItems[selectedIdx].amount}} in stock)</span></span>
            <br>
            <span v-if="selectEgg == 1" class="yld">{{availableShopItems[selectedIdx].name}}</span>
          </div>
          
        </div>
        <div class="angl-c">

          <swiper
            style="bottom: 0;position: absolute;width:  100%;height: 920px"
            ref="mySwiper"
            :slides-per-view="1"
            :space-between="50"
            @swiper="onSwiper"
            @slideChange="onSlideChange"
            :options="swiperOptionsNew"
            >
            <swiper-slide class="slide" v-for="item in availableShopItems" :key="item.id">
              <ogle v-if="item.data.type=='egg'" :manual="{'collection':item.data.collection,'type':item.data.type,'rarity':item.data.rarity,'skin':item.data.skin,'scale':scale(item.data.value)}"></ogle>
              <item v-else :manual="{'collection':item.data.collection,'type':item.data.type,'rarity':item.data.rarity,'skin':item.data.skin,'scale':2}"></item>
            </swiper-slide>
          </swiper>
          <!-- <img :class="{off: !isSending && state.game.isLocked}" class="wiz" style="" src="@/assets/wiz.svg"> -->
          
          <div style="position: absolute;bottom: 0px;left: 0px;height: 740px;">
            <img :class="{visible: (isCaravanItems > 0 && isCaravan)}" style="transition: 1.5s ease opacity;height: 740px;position: absolute;right: 520px;bottom: 0;" src="@/assets/misc/cart.png">
            <img style="transition: 1.5s ease opacity;height: 740px;position: absolute;right: 520px;bottom: 0;" src="@/assets/misc/box0.png">
            <img :class="{noop: state.appVars.caravan_items >= 9 && !isCaravan}" style="opacity: 0;transition: 1.5s ease opacity;height: 740px;position: absolute;right: 520px;bottom: 0;" src="@/assets/misc/box5.png">
            <img :class="{noop: state.appVars.caravan_items >= 7 && !isCaravan}" style="opacity: 0;transition: 1.5s ease opacity;height: 740px;position: absolute;right: 520px;bottom: 0;" src="@/assets/misc/box4.png">
            <img :class="{noop: state.appVars.caravan_items >= 5 && !isCaravan}" style="opacity: 0;transition: 1.5s ease opacity;height: 740px;position: absolute;right: 520px;bottom: 0;" src="@/assets/misc/box3.png">
            <img :class="{noop: state.appVars.caravan_items >= 3 && !isCaravan}" style="opacity: 0;transition: 1.5s ease opacity;height: 740px;position: absolute;right: 520px;bottom: 0;" src="@/assets/misc/box2.png">
            <img :class="{noop: state.appVars.caravan_items >= 1 && !isCaravan}" style="opacity: 0;transition: 1.5s ease opacity;height: 740px;position: absolute;right: 520px;bottom: 0;" src="@/assets/misc/box1.png">
            <img style="z-index: -1;height: 740px;margin-left: -20908px" src="@/assets/misc/forum-rear-e.png">
          </div>
          <investor :flip="true"  style="z-index: 1;margin-left:0;transition:  opacity 1s ease;position: absolute;left: 0px;bottom: 0px;width: 300px;pointer-events: none;" class="egg" :skin-id="state.user.investor_skin_id"></investor>
          <div style="position: absolute;bottom: 0px;left: 0px;height: 740px;pointer-events: none;">
            <img style="z-index: 3;height: 740px;margin-left: -20908px;position: absolute;" src="@/assets/misc/forum-front-e.png">
          </div>
          <!-- <div :class="{visible: !availableShopItems[selectedIdx]}" class="w-i-2" style="z-index: 202;pointer-events: none;bottom:0!important;right: 0;text-align: right;transition: none;">
            <span>Shop Deck</span><br>
            <span>
              <div class="swiper-pagination-new"></div>
            </span>
          </div> -->
          <div class="swiper-pagination-line shop" style=""></div>
        </div>
        <button type="button"
          class="buttdw"
          @click="submit2"
          :class="{success: isSuccessDW, locked: (( (state.appVars.caravan_items > 0 && isCaravan) || isError || isSending || avail) && state.user.start_gas && state.user.start_pack) || !(availableShopItems[selectedIdx] && state.user.balance_ngls), slocked: isSending, unlocked: isError, goldish: ( !state.user.start_gas || !state.user.start_pack ) && !(isError || isSending || !(availableShopItems[selectedIdx] && state.user.balance_ngls)) }">
            <span v-if="isSuccessDW">Done! Completing transaction...</span>
            <span v-else-if="isError">{{error}}</span>
            <span v-else-if="isSending">Processing transaction...</span>
            <span v-else-if="!(availableShopItems[selectedIdx] && state.user.balance_ngls)">Loading shop...</span>
            <span v-else-if="state.appVars.caravan_items > 0 && isCaravan">Locked for restock: {{getDiff(state.appVars.caravan)}} remain</span>
            <span v-else-if="!state.user.start_gas || !state.user.start_pack">Invoke Mastership</span>
            <!-- <span v-else-if="(isCaravanItems && isCaravan)">Caravan will return in {{getDiff(state.appVars.caravan)}}</span> -->
            <!-- <span v-else-if="isCaravanItems && !isCaravan">Unload Caravan</span> -->
            <span v-else-if="availableShopItems[selectedIdx] && avail && from_currency == 'bnb'">Insufficent BNB balance</span>
            <span v-else-if="availableShopItems[selectedIdx] && avail && from_currency == 'ngls'">Insufficent ANGLS balance</span>
            <span v-else-if="availableShopItems[selectedIdx] && avail && from_currency == 'busd'">Insufficent USDC balance</span>
            <span v-else-if="availableShopItems[selectedIdx] && avail && from_currency == 'gdao'">Insufficent gDAO tokens</span>
            <span v-else-if="stage == 0 && from_currency == 'gdao'">Precalculate gDAO transaction</span>
            <span v-else-if="stage == 0">Precalculate transaction GAS</span>
            <span v-else-if="stage == 1">Approve transaction</span>
        </button>
        <div class="ctdwn" style="position: absolute;bottom: 0;width: 100%;">
          <div v-if="!state.game.isLocked">Next Crypto Aeon in</div>
          <div style="color:#ff8ee4" v-else><span v-if="state.game.isReload">Starting new Crypto Aeon</span><span v-else>Computing Crypto Aeon</span></div>
          <div :class="{locked: state.game.isLocked}" class="clock">{{state.game.timeToEnd}}</div>
        </div>
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
import Item from '../components/Item.vue'
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
const baseValue = 1;

export default {
  data: () => ({
    state,
    availableShopItems: [],
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
    timer2: null,
    timer3: null,
    walletActive: false,
    depActive: false,
    withActive: false,
    dwCounter: 0.0,
    origCounter: null,
    isSuccessDW: false,
    size: 1,
    stage: 0,
    gasNgls: 0.0,
    gasBnb: 0.0,
    gasBusd: 0.0,
    selectEgg: 1,
    maxEgg: 4,
    depLock: false,
    isSending: false,
    isError: false,
    timer4: null,
    now: Date.now(),
    swiperOptionsNew: {
      // pagination: {
      //   el: '.swiper-pagination-new',
      //   type: 'custom', //fraction
      //   renderCustom: function (swiper, current, total) {
      //     return current + '/' + total;
      //   }
      // },
      pagination: {
        el: '.swiper-pagination-line',
        type: 'bullets',
      },
      // Some Swiper option/callback...
    },
    selectedIdx: 0
  }),
  components: {
    Swiper,
    SwiperSlide,
    Ogle,
    Investor,
    Item
  },
  directives: {
      swiper: directive
  },
  computed: {
    isCaravan () {
      if (state.appVars.caravan == '') return false
      return ( Date.parse(state.appVars.caravan) >= this.now )   
    },
    isCaravanItems () {
      return ( state.appVars.caravan_items > 0 )   
    },
    tokenAmount() {
      let found = this.state.items.find(element => element.id == 4);
      if (found) {
        return found.quantity
      } else {
        return 0;
      }

    },
    gas () {
      // console.log('gas', this, this.gasBnb, this.gasNgls)
      if (this.gasBnb == 0 && this.gasNgls == 0 && this.gasBusd == 0) {
        return 0
      }
      if (this.from_currency == 'bnb')
        return parseFloat(this.gasBnb)
      if (this.from_currency == 'ngls')
        return parseFloat(this.gasBnb)
      return this.gasBusd;
    },
    from_currency () {
      if (this.availableShopItems[this.selectedIdx] && parseFloat(this.availableShopItems[this.selectedIdx].price_busd) > 0) {
        return 'busd';
      } else if (this.availableShopItems[this.selectedIdx] && parseFloat(this.availableShopItems[this.selectedIdx].price_bnb) > 0) {
        return 'bnb';
      } else if (this.availableShopItems[this.selectedIdx] && parseFloat(this.availableShopItems[this.selectedIdx].price_ngls) > 0) {
        return 'ngls'
      } else if (this.availableShopItems[this.selectedIdx] && parseFloat(this.availableShopItems[this.selectedIdx].price_token) > 0) {
        return 'gdao'
      }
      return null
    },
    amount () {
      if (this.availableShopItems[this.selectedIdx].type == 'egg') {
        return (parseFloat(this.availableShopItems[this.selectedIdx].price_ngls) + parseFloat(this.availableShopItems[this.selectedIdx].nodeshare)).toFixed(8)
      } else {
        if (parseFloat(this.availableShopItems[this.selectedIdx].price_busd) > 0) {
        return parseFloat(this.availableShopItems[this.selectedIdx].price_busd).toFixed(8)
        } else if (parseFloat(this.availableShopItems[this.selectedIdx].price_bnb) > 0) {
          return parseFloat(this.availableShopItems[this.selectedIdx].price_bnb).toFixed(8)
        } else if (parseFloat(this.availableShopItems[this.selectedIdx].price_ngls) > 0) {
          return parseFloat(this.availableShopItems[this.selectedIdx].price_ngls).toFixed(8)
        } else {
          return parseFloat(this.availableShopItems[this.selectedIdx].price_token).toFixed(8)
        }
      }
      
    },
    fee () {
      if (this.stage == 0) 
        return parseFloat(this.amount) + (this.from_currency == 'bnb' ? 0.001 : 0)
      else
        return parseFloat(this.amount) + (this.from_currency == 'bnb' ? 0.001 : 0) + parseFloat(this.gas)    
    },
    avail () {
      if (this.availableShopItems[this.selectedIdx] && parseFloat(this.availableShopItems[this.selectedIdx].price_busd) > 0) {
        return parseFloat(this.availableShopItems[this.selectedIdx].price_busd) + parseFloat(this.gas) > parseFloat(state.user.balance_busd)
      } else if (this.availableShopItems[this.selectedIdx] && parseFloat(this.availableShopItems[this.selectedIdx].price_bnb) > 0) {
        return parseFloat(this.availableShopItems[this.selectedIdx].price_bnb) + parseFloat(this.gas) > parseFloat(state.user.balance_bnb)
      } else if (this.availableShopItems[this.selectedIdx] && parseInt(this.availableShopItems[this.selectedIdx].price_token) > 0) {
        return parseFloat(this.availableShopItems[this.selectedIdx].price_token) > parseInt(this.tokenAmount)
      } else if (this.availableShopItems[this.selectedIdx]) {
        return parseFloat(this.availableShopItems[this.selectedIdx].price_ngls) + parseFloat(this.gas) > parseFloat(state.user.balance_ngls)
      }
      return true  
    },
    swiper() {
      return this.$refs.mySwiper.$swiper
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
    getDiff (date) {
      const currentDate = new Date();
      const patriciusDate = new Date(date);
      const timeDifference = patriciusDate - currentDate;
      const minutes = Math.floor(timeDifference / (1000 * 60));
      const hours = Math.floor(timeDifference / (1000 * 60 * 60));
      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''}`;
      } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''}`;
      } else if (minutes > 0) {
        return `${minutes} minute${minutes > 1 ? 's' : ''}`;
      } else {
        return 'less 1 minute';
      }
    },
    drop () {
      this.isError = false;
      this.gasBnb = 0;
      this.gasNgls = 0;
      this.gasBusd = 0;
      this.stage = 0;
    },
    scale (a) {
      return Math.sqrt((a/baseValue-1)/16 + 1)//(Math.max(this.value/baseValue,1)-1)/16 + 1
    },
    buyItem () {
      if (this.isSending) return;
      this.isSending = true;
      let item = this.availableShopItems[this.selectedIdx];
      axios
        .post(`${config.api}/shop/buy`, {shop_item_id: item.id})
        .then(() => {
          //this.isSuccessDW = true;
          setTimeout(()=>{utils.update_game();}, 750)
          //setTimeout(()=>{this.wallet();}, 750)
        }).catch(error => {
          this.isSending = false;
          this.error.message = error.response.data.message
        })
    },
    activatewallet() {
      if (!state.user.start_gas) router.push('/startergas')
      else router.push('/starterbuy')
    },
    submit2 () {
      if (!state.user.start_gas || !state.user.start_pack) return this.activatewallet()
      if (this.isError) return this.drop()
      console.log('STG',this.stage)
      if (this.stage == 0) {
        if (this.isSending) return;
        this.isSending = true;
        if (this.from_currency == 'gdao') {
          setTimeout(()=>{
            this.isSending = false;
            this.stage = 1;
          },1000)
        } else {
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
                this.gasBusd = parseFloat(resp.data.data.precalcData.fee.busd)
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
        }
          
      } else {
        if (this.isSending) return;
        this.isSending = true;
        let item = this.availableShopItems[this.selectedIdx];
        if (this.from_currency == 'gdao') {
          axios
            .get(config.csrf)
            .then(() => {
              axios
                .post(config.api+`/drop`, {item_id: item.id})
                .then(() => {
                  this.isSuccessDW = true;
                  this.isSending = false;
                  this.stage = 0;
                  this.loadShopItems();
                  setTimeout(()=>{utils.update_game();}, 750)
                  setTimeout(()=>{this.isSuccessDW = false;}, 3000)
                }).catch(error => {
                  this.isSending = false;
                  this.isError = true;
                  this.error = error.response.data.message
                })
          })
        } else {
          
          axios
            .post(`${config.api}/shop/buy`, {shop_item_id: item.id})
            .then(() => {
              this.isSuccessDW = true;
              this.isSending = false;
              this.stage = 0;
              this.loadShopItems();
              setTimeout(()=>{utils.update_game();}, 750)
              setTimeout(()=>{this.isSuccessDW = false;}, 3000)
            }).catch(error => {
              this.isSending = false;
              this.isError = true;
              this.error = error.response.data.message
            })}
      }
      
    },
    onSlideChange (event) {
      if (!state.tutorial2Done) {
        this.isTutorial2 = false;
        state.tutorial2Done = true;
        window.localStorage.setItem('tutorial2-done',true)
      }
      this.selectedIdx = this.swiper.activeIndex;
      this.drop()
      console.log('slide change', event, this.swiper);
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
      //this.$router.replace('/');
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
    submitDeposit () {
      axios
        .get(config.csrf)
        .then(() => {
          axios
            .post(config.api+'/oogle/buy', {type: "egg" + this.selectEgg})
            .then(() => {
              this.isSuccessDW = true;
              setTimeout(()=>{utils.update_game();}, 750)
              setTimeout(()=>{this.wallet();}, 1550)
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
    loadShopItems () {
      let items = new Array();
      axios.get(`${config.api}/shop?type=gdao`)
      .then(response => {
        for (let item of response.data.data) {
          items.push(item)
        }
        let diff = items.filter(x => !this.availableShopItems.includes(x));
        if (diff.length != 0) {
          this.availableShopItems.splice(0,this.availableShopItems.length)
          this.availableShopItems = items
        }
        console.log('shop items', this.availableShopItems)
        console.log('shop state', state)
      })

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
    trigger () {
      this.enterForum();
    },
    updateNow() {
        this.now = Date.now();
    },
  },
  mounted () {
    //utils.internal_clock();
    this.currentAnimId = window.requestAnimationFrame(this.onFrame);
    // if (this.state.isJoined) {
    //   this.balance = this.state.balance;
    //   this.angle = this.state.angle;
    //   this.expectedYield = this.balance/Math.cos(this.angle/180*Math.PI) - this.balance
    // }
    // this.update_angle_color();
    this.loadShopItems()
    this.timer2 = setInterval(this.loadShopItems,20000)
    if (this.state.forum.length != 0) {
      this.timer3 = setInterval(this.trigger,30000)
    }
    this.timer4 = setInterval(this.updateNow,1000)
    console.log('HOMEMNTD',)
    if (this.isTutorial2) setTimeout(()=>{
      this.isTutorial2 = false;
    },5000)
  },
  destroyed () {
    clearInterval(this.timer2);
    clearInterval(this.timer4)
    if (this.state.forum.length != 0) {
      clearInterval(this.timer3)
    }
  }
}
</script>

<style scoped>

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
  width: 100%;
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
  bottom: 160px;
  position: absolute;
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
  border-left: white 0px solid;
  transition: 1s right ease;
}

.wall-c.active {
  right: 0;
}

/* .dep-c {
  width: 100vw;
  position: absolute;
  height: 100%;
  background: white;
  right: -100vw;
  z-index: 500;
  border-left: white 0px solid;
  transition: 1s right ease;
} */

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
    height: 160px!important;
    border-bottom-left-radius: 50%;
    overflow: hidden;
    display: block!important;
    border-bottom-right-radius: 50%;
    position: relative!important;
    top: -80px!important;
    left: 0;
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
  color: #000;
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
  width:  100%;
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

.dep-c {
    width: 100%;
    position: absolute;
    height: 100%;
    background: #fff;
    right: -100%;
    z-index: 500;
    border-left: 0 solid #fff;
    transition: right 1s ease
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
  border-bottom: 5px solid black;
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
  margin-bottom: 30px;
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
  background: #ffffffbf;
  z-index: 203;
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
  pointer-events:  none;
}

.wiz {
  position: absolute; bottom: 0; left: 0; margin-left: 50px;width: 350px;transition: left 1s ease;
}
.wiz.off {
  transform: scaleX(-1);
  left: -600px;
}

.noop {
    opacity: 1!important;
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

.goldish {
  color: #000!important;
  border-color: #e5c44f!important;
  background: white!important;
}
</style>

<style>
  .shop .swiper-pagination-bullet-active {
    width: 100%!important;
    border: none;
    background: #e5c44f!important;
    height: 5px;
    border-radius: 0!important;
  }

  .shop .swiper-pagination-bullet {
    width: 100%!important;
    border: none;
    background: #000;
    height: 5px;
    border-radius: 0!important;
    opacity: 1!important;
  }
  .swiper-container {
    z-index: 3!important;
  }
</style>

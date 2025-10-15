<template>
  <div :style="{width: width + 'px'}" class="investor">
    <img @click="sendClick" v-if="!verse" :style="{width: width + 'px'}" :class="{flipped: flip}" :src="skinUrl">
    <div @click="sendClick" v-if="verse && verse != ''" :class="{opaque: !messageIn}" class="chatbox pixel-border wide">
        {{verse}}
        <br><br>
        <span v-if="name == 'GoldenStern'" style="color: #e5c44f">{{name}}</span>
        <span v-else-if="isSenator || isPatricius" style="color: #e5c44f"><span v-if="isSenator" style="color: #e5c44f">S</span><span v-if="isPatricius" style="color: #e5c44f">P</span> {{name}}</span>
        <span v-else>{{name}}</span>
        <br>
        <span v-if="(votes.length < limit)">{{votes.length}}/{{limit}}</span>
        <span v-else style="color: #e5c44f">✓ {{votes.length}}/{{limit}}</span>
    </div>
    <div v-else-if="message != ''" :class="{opaque: !messageIn}" class="chatbox pixel-white" style="pointer-events: none;">
        {{message}}
        <img style="position: absolute;width: 35px;bottom: -90px;right: 60px;" src="@/assets/chatarrow.png">
    </div>
    <div v-if="(name != '' && !verse)" :class="{opaque: messageIn}" class="chatbox2">
        <span v-if="name == 'GoldenStern'" style="color: #e5c44f">{{name}}</span>
        <span v-else><span v-if="isSenator" style="color: #e5c44f">S</span><span v-if="isPatricius" style="color: #e5c44f">P</span> {{name}}</span>
    </div>
    <div v-else-if="(name == '' && (isSenator || isPatricius) && !verse)" :class="{opaque: messageIn}" class="chatbox2">
        <span v-if="isSenator" style="color: #e5c44f">S</span><span v-if="isPatricius" style="color: #e5c44f">P</span>
    </div>
    <div v-for="popup in popups" :key="popup.key" class="chatbox3 activatepop">
        {{popup.message}}
    </div>
    <img v-if="puff" :class="{flipped: flip}" class="puff" src="@/assets/collections/basic/item/Puff.png">
    <div class="smoke-wrapper">
      <div v-if="puff" :class="{flipped: flip}" class="smoke-container">
        <div class="smoke smoke1"></div>
        <div class="smoke smoke2"></div>
        <div class="smoke smoke3"></div>
        <div class="smoke smoke4"></div>
        <div class="smoke smoke5"></div>
        <div class="smoke smoke6"></div>
        <div class="smoke smoke7"></div>
        <div class="smoke smoke8"></div>
        <div class="smoke smoke9"></div>
        <div class="smoke smoke10"></div>
        <div class="smoke smoke11"></div>
        <div class="smoke smoke12"></div>
      </div>
    </div>
  </div>
</template>

<script>

import WebsocketClient from '../wsclient'

export default {
  data: () => ({
    message: "",
    timer : null,
    messageIn: false,
    popups: [],
    popupQ: [],
    k: false,
    now: Date.now(),
    timer2: null
  }),
  props: {
    skinId: Number,
    puff: {
      type: Boolean,
      default: false,
    },
    flip: {
      type: Boolean,
      default: false,
    },
    width: {
      type: Number,
      default: 300
    },
    name: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: "master"
    },
    verse: {
      type: String,
      default: null
    },
    votes: {
      type: Array,
      default: null
    },
    limit: {
      type: Number,
      default: null
    },
    senator: {
      type: Date,
      default: null
    },
    patricius: {
      type: Date,
      default: null
    },
  },
  mounted () {
    this.timer2 = setInterval(this.updateNow,1000)
    if (this.verse == null) {
      WebsocketClient.addHandler('yell', this.onYellMasterEvent);
      this.$on('yellInner', function (msg) {
        console.log('yellInner', msg)
      });
    } else {
      this.message = this.verse;
      this.messageIn = true;
    }
  },
  destroyed () {
    clearInterval(this.timer2)
  },
  computed: {
    isSenator () {
      if (Date.parse(this.senator) >= this.now) return true
      return false
    },
    isPatricius () {
      if (Date.parse(this.patricius) >= this.now) return true
      return false
    },
    skinUrl: function() {
      if (this.skinId === null) {
        return '';
      }
      var images = require.context('../assets/investor/', false, /\.svg$/)
          
      return images('./' + this.skinId + ".svg")
    }
  },
  watch: {
    'verse': {
      deep: true,
      handler: function(newVerse) {
        if (newVerse) {
          this.message = newVerse;
          this.messageIn = true;
        } else {
          this.messageIn = false;
        }
      }
    },
  },
  methods: {
    updateNow() {
        this.now = Date.now();
    },
    onYellMasterEvent (evt) {
      this.message = evt;
      this.messageIn = true;
      clearTimeout(this.timer)
      this.timer = setTimeout(()=>{
        this.messageIn = false;
      },8000)
    },
    doPopTick () {
      this.k = true;
      let randomString = Math.floor(100000 + Math.random() * 900000).toString();
      this.popups.push({ message: this.popupQ.shift(), key: randomString });
      setTimeout(()=>{
        this.popups = this.popups.filter(item => item.key !== randomString);
      },8000)
      if (this.popupQ.length != 0) {
        setTimeout(()=>{this.doPopTick();},2000)
      } else {
        this.k = false;
      }
    },
    onLikeMasterEvent (evt) {
      if (evt == "+❤️") {
        for (let i=1; i<7; i++) {
          this.popupQ.push(evt);
          setTimeout(()=>{
            this.popupQ.push(evt);
          },i * 2000)
        }
      } else {
        this.popupQ.unshift(evt);
      }
      if (!this.k) 
        this.doPopTick()
    },
    sendClick () {
      this.$emit('clicked')
    }
  }
}
</script>

<style>
  .flipped {
    transform: scaleX(-1);
  }

  :root {
    --pixel-bg: white;
    /* ↑ Inner background color */
    
    --pixel-border: black;
    /* ↑ Inner border color */
    
    --pixel-border-2: #e5c44f;
    /* ↑ Middle border color */
    
    --pixel-border-3: var(--pixel-border);
    /* ↑ Outer border color */
    
    --pixel: 8px;
    /* ↑ Pixel size */
  }
</style>
<style scoped>
  .pixel-border {
    background: var(--pixel-bg);
    box-shadow:
      
    /* Inner Background Color */
      0 calc(var(--pixel) * -3) 0 calc(var(--pixel) * -1) var(--pixel-bg),
      0 calc(var(--pixel) * 3) 0 calc(var(--pixel) * -1) var(--pixel-bg),
      0 calc(var(--pixel) * -6) 0 calc(var(--pixel) * -2) var(--pixel-bg),
      0 calc(var(--pixel) * 6) 0 calc(var(--pixel) * -2) var(--pixel-bg),
      0 calc(var(--pixel) * -9) 0 calc(var(--pixel) * -4) var(--pixel-bg),
      0 calc(var(--pixel) * 9) 0 calc(var(--pixel) * -4) var(--pixel-bg),
      0 calc(var(--pixel) * -12) 0 calc(var(--pixel) * -6) var(--pixel-bg),
      0 calc(var(--pixel) * 12) 0 calc(var(--pixel) * -6) var(--pixel-bg),
      
    /* Pixel Border Layer 1 */
      calc(var(--pixel) * -1) 0 0 0 var(--pixel-border),
      var(--pixel) 0 0 0 var(--pixel-border),
      0 calc(var(--pixel) * -2) 0 0 var(--pixel-border),
      0 calc(var(--pixel) * 2) 0 0 var(--pixel-border),
      0 calc(var(--pixel) * -5) 0 calc(var(--pixel) * -1) var(--pixel-border),
      0 calc(var(--pixel) * 5) 0 calc(var(--pixel) * -1) var(--pixel-border),
      0 calc(var(--pixel) * -7) 0 calc(var(--pixel) * -2) var(--pixel-border),
      0 calc(var(--pixel) * 7) 0 calc(var(--pixel) * -2) var(--pixel-border),
      0 calc(var(--pixel) * -10) 0 calc(var(--pixel) * -4) var(--pixel-border),
      0 calc(var(--pixel) * 10) 0 calc(var(--pixel) * -4) var(--pixel-border),
      0 calc(var(--pixel) * -13) 0 calc(var(--pixel) * -6) var(--pixel-border),
      0 calc(var(--pixel) * 13) 0 calc(var(--pixel) * -6) var(--pixel-border),
      
    /* Pixel Border Layer 2 */
      calc(var(--pixel) * -2) 0 0 0 var(--pixel-border-2),
      calc(var(--pixel) * 2) 0 0 0 var(--pixel-border-2),
      0 calc(var(--pixel) * -1) 0 var(--pixel) var(--pixel-border-2), 
      0 var(--pixel) 0 var(--pixel) var(--pixel-border-2),
      0 calc(var(--pixel) * -4) 0 0 var(--pixel-border-2),
      0 calc(var(--pixel) * 4) 0 0 var(--pixel-border-2),
      0 calc(var(--pixel) * -6) 0 calc(var(--pixel) * -1) var(--pixel-border-2),
      0 calc(var(--pixel) * 6) 0 calc(var(--pixel) * -1) var(--pixel-border-2),
      0 calc(var(--pixel) * -8) 0 calc(var(--pixel) * -2) var(--pixel-border-2),
      0 calc(var(--pixel) * 8) 0 calc(var(--pixel) * -2) var(--pixel-border-2),
      0 calc(var(--pixel) * -11) 0 calc(var(--pixel) * -4) var(--pixel-border-2),
      0 calc(var(--pixel) * 11) 0 calc(var(--pixel) * -4) var(--pixel-border-2),
      0 calc(var(--pixel) * -14) 0 calc(var(--pixel) * -6) var(--pixel-border-2),
      0 calc(var(--pixel) * 14) 0 calc(var(--pixel) * -6) var(--pixel-border-2),
      
    /* Border Layer 3: --pixel-border-3 */
      calc(var(--pixel) * -3) 0 0 0 var(--pixel-border-3),
      calc(var(--pixel) * 3) 0 0 0 var(--pixel-border-3),
      0 0 0 calc(var(--pixel) * 2) var(--pixel-border-3),
      0 calc(var(--pixel) * -3) 0 var(--pixel) var(--pixel-border-3),
      0 calc(var(--pixel) * 3) 0 var(--pixel) var(--pixel-border-3),
      0 calc(var(--pixel) * -5) 0 0 var(--pixel-border-3),
      0 calc(var(--pixel) * 5) 0 0 var(--pixel-border-3),
      0 calc(var(--pixel) * -7) 0 calc(var(--pixel) * -1) var(--pixel-border-3),
      0 calc(var(--pixel) * 7) 0 calc(var(--pixel) * -1) var(--pixel-border-3),
      0 calc(var(--pixel) * -9) 0 calc(var(--pixel) * -2) var(--pixel-border-3), 
      0 calc(var(--pixel) * 9) 0 calc(var(--pixel) * -2) var(--pixel-border-3),
      0 calc(var(--pixel) * -12) 0 calc(var(--pixel) * -4) var(--pixel-border-3), 
      0 calc(var(--pixel) * 12) 0 calc(var(--pixel) * -4) var(--pixel-border-3),
      0 calc(var(--pixel) * -15) 0 calc(var(--pixel) * -6) var(--pixel-border-3), 
      0 calc(var(--pixel) * 15) 0 calc(var(--pixel) * -6) var(--pixel-border-3);
  }

  .pixel-white {
    background: var(--pixel-bg);
    box-shadow:
      
    /* Inner Background Color */
      0 calc(var(--pixel) * -3) 0 calc(var(--pixel) * -1) var(--pixel-bg),
      0 calc(var(--pixel) * 3) 0 calc(var(--pixel) * -1) var(--pixel-bg),
      0 calc(var(--pixel) * -6) 0 calc(var(--pixel) * -2) var(--pixel-bg),
      0 calc(var(--pixel) * 6) 0 calc(var(--pixel) * -2) var(--pixel-bg),
      0 calc(var(--pixel) * -9) 0 calc(var(--pixel) * -4) var(--pixel-bg),
      0 calc(var(--pixel) * 9) 0 calc(var(--pixel) * -4) var(--pixel-bg),
      0 calc(var(--pixel) * -12) 0 calc(var(--pixel) * -6) var(--pixel-bg),
      0 calc(var(--pixel) * 12) 0 calc(var(--pixel) * -6) var(--pixel-bg),
      
    /* Pixel Border Layer 1 */
      calc(var(--pixel) * -1) 0 0 0 var(--pixel-bg),
      var(--pixel) 0 0 0 var(--pixel-bg),
      0 calc(var(--pixel) * -2) 0 0 var(--pixel-bg),
      0 calc(var(--pixel) * 2) 0 0 var(--pixel-bg),
      0 calc(var(--pixel) * -5) 0 calc(var(--pixel) * -1) var(--pixel-bg),
      0 calc(var(--pixel) * 5) 0 calc(var(--pixel) * -1) var(--pixel-bg),
      0 calc(var(--pixel) * -7) 0 calc(var(--pixel) * -2) var(--pixel-bg),
      0 calc(var(--pixel) * 7) 0 calc(var(--pixel) * -2) var(--pixel-bg),
      0 calc(var(--pixel) * -10) 0 calc(var(--pixel) * -4) var(--pixel-bg),
      0 calc(var(--pixel) * 10) 0 calc(var(--pixel) * -4) var(--pixel-bg),
      0 calc(var(--pixel) * -13) 0 calc(var(--pixel) * -6) var(--pixel-bg),
      0 calc(var(--pixel) * 13) 0 calc(var(--pixel) * -6) var(--pixel-bg),
      
    /* Pixel Border Layer 2 */
      calc(var(--pixel) * -2) 0 0 0 var(--pixel-bg),
      calc(var(--pixel) * 2) 0 0 0 var(--pixel-bg),
      0 calc(var(--pixel) * -1) 0 var(--pixel) var(--pixel-bg), 
      0 var(--pixel) 0 var(--pixel) var(--pixel-bg),
      0 calc(var(--pixel) * -4) 0 0 var(--pixel-bg),
      0 calc(var(--pixel) * 4) 0 0 var(--pixel-bg),
      0 calc(var(--pixel) * -6) 0 calc(var(--pixel) * -1) var(--pixel-bg),
      0 calc(var(--pixel) * 6) 0 calc(var(--pixel) * -1) var(--pixel-bg),
      0 calc(var(--pixel) * -8) 0 calc(var(--pixel) * -2) var(--pixel-bg),
      0 calc(var(--pixel) * 8) 0 calc(var(--pixel) * -2) var(--pixel-bg),
      0 calc(var(--pixel) * -11) 0 calc(var(--pixel) * -4) var(--pixel-bg),
      0 calc(var(--pixel) * 11) 0 calc(var(--pixel) * -4) var(--pixel-bg),
      0 calc(var(--pixel) * -14) 0 calc(var(--pixel) * -6) var(--pixel-bg),
      0 calc(var(--pixel) * 14) 0 calc(var(--pixel) * -6) var(--pixel-bg),
      
    /* Border Layer 3: --pixel-border-3 */
      calc(var(--pixel) * -3) 0 0 0 var(--pixel-border-3),
      calc(var(--pixel) * 3) 0 0 0 var(--pixel-border-3),
      0 0 0 calc(var(--pixel) * 2) var(--pixel-border-3),
      0 calc(var(--pixel) * -3) 0 var(--pixel) var(--pixel-border-3),
      0 calc(var(--pixel) * 3) 0 var(--pixel) var(--pixel-border-3),
      0 calc(var(--pixel) * -5) 0 0 var(--pixel-border-3),
      0 calc(var(--pixel) * 5) 0 0 var(--pixel-border-3),
      0 calc(var(--pixel) * -7) 0 calc(var(--pixel) * -1) var(--pixel-border-3),
      0 calc(var(--pixel) * 7) 0 calc(var(--pixel) * -1) var(--pixel-border-3),
      0 calc(var(--pixel) * -9) 0 calc(var(--pixel) * -2) var(--pixel-border-3), 
      0 calc(var(--pixel) * 9) 0 calc(var(--pixel) * -2) var(--pixel-border-3),
      0 calc(var(--pixel) * -12) 0 calc(var(--pixel) * -4) var(--pixel-border-3), 
      0 calc(var(--pixel) * 12) 0 calc(var(--pixel) * -4) var(--pixel-border-3),
      0 calc(var(--pixel) * -15) 0 calc(var(--pixel) * -6) var(--pixel-border-3), 
      0 calc(var(--pixel) * 15) 0 calc(var(--pixel) * -6) var(--pixel-border-3);
  }

  .chatbox {
    font-size: 48px;
    position: absolute;
    bottom: 370px;
    text-align: center;
    width: 300px;
    font-family: Superstar;
    line-height: 1.0;
    transition: opacity .5s linear;
    opacity: 1;
    overflow-wrap: break-word;
  }
  .chatbox.wide {
    width: 400px;
    bottom: 600px;
    margin-left: -50px;
  }

  .chatbox2 {
    font-size: 48px;
    position: absolute;
    bottom: 320px;
    text-align: center;
    width: 300px;
    font-family: Superstar;
    line-height: 1.0;
    transition: opacity .5s linear;
    opacity: 1;
    overflow-wrap: break-word;
  }

  .chatbox3 {
    font-size: 48px;
    position: absolute;
    bottom: 320px;
    text-align: center;
    width: 300px;
    font-family: Superstar;
    line-height: 1.0;
    overflow-wrap: break-word;
  }

  .opaque {
    opacity: 0;
  }

  @keyframes pop {
    0% {
      transform: translateX(0%) translateY(0%);
      opacity: 0;
    }

    5% {
      transform: translateX(0%) translateY(0%);
      opacity: 1;
    }

    100% {
      transform: translateX(0%) translateY(-300%);
      opacity: 0;
    }
  }

  .activatepop {
    -webkit-animation: pop 5s forwards 0s;
    animation: pop 5s forwards 0s;
  }

  .puff {
    position: absolute;
    width: 50%;
    left: 15%;
    top: 47%;
    transform: scaleX(-1);
    pointer-events: none;
  }
  .puff.flipped {
    left: initial;
    right: 15%;
    transform: initial
  }

  .smoke-wrapper {
    width: 100%;
    position: absolute;
    height: 100%;
    top: 0;
    pointer-events: none;
  }
  .smoke-container {
    position: absolute;
    width: 50px;
    height: 50px;
    left: 24%;
    bottom: -6%;
  }
  .smoke-container.flipped {
    left: initial;
    right: 24%;
  }

  .smoke {
    position: absolute;
    width: 16px;
    height: 16px;
    background: transparent;
    box-shadow:
      0 0 #999,
      2px -4px #aaa,
      -2px -8px #bbb,
      2px -12px #ccc,
      -2px -16px #ddd;
    animation: smoke-rise 10s infinite ease-in-out;
    opacity: 0.9;
  }


  .smoke1 { left: 5px;  animation-delay: 0s; }
  .smoke2 { left: 10px; animation-delay: 0.5s; }
  .smoke3 { left: 15px; animation-delay: 1.0s; }
  .smoke4 { left: 20px; animation-delay: 1.5s; }
  .smoke5 { left: 25px; animation-delay: 2.0s; }
  .smoke6 { left: 30px; animation-delay: 2.5s; }
  .smoke7 { left: 30px;  animation-delay: 3.0s; }
  .smoke8 { left: 25px; animation-delay: 3.5s; }
  .smoke9 { left: 20px; animation-delay: 4.0s; }
  .smoke10 { left: 15px; animation-delay: 4.5s; }
  .smoke11 { left: 10px; animation-delay: 5.0s; }
  .smoke12 { left: 5px; animation-delay: 5.5s; }
  
  .flipped .smoke1 { right: 5px; left: initial; }
  .flipped .smoke2 { right: 10px; left: initial; }
  .flipped .smoke3 { right: 15px; left: initial; }
  .flipped .smoke4 { right: 20px; left: initial; }
  .flipped .smoke5 { right: 25px; left: initial; }
  .flipped .smoke6 { right: 30px; left: initial; }
  .flipped .smoke7 { right: 30px; left: initial;  }
  .flipped .smoke8 { right: 25px; left: initial; }
  .flipped .smoke9 { right: 20px; left: initial; }
  .flipped .smoke10 { right: 15px; left: initial; }
  .flipped .smoke11 { right: 10px; left: initial; }
  .flipped .smoke12 { right: 5px; left: initial; }



  @keyframes smoke-rise {
    0% {
      transform: translateY(0) scale(1);
      opacity: 0.9;
    }
    50% {
      transform: translateY(-60px) scale(1.2);
      opacity: 0.7;
    }
    70% {
      transform: translateY(-120px) scale(1.4);
      opacity: 0;
    }

    100% {
      transform: translateY(-120px) scale(1.4);
      opacity: 0;
    }
  }
</style>

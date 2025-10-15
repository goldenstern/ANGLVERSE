<template>
  <div class="cont" >
    <div class="sw-t" :class="{loaded: loaded}">          
          
          <div class="flex-content onb">
            <swiper
            style="width:  100%"
            ref="mySwiper"
            :slides-per-view="1"
            :space-between="50"
            @slideChange="onSlideChange"
            :options="swiperOptions"
            class="flex-item-2"
            >
              <swiper-slide class="slide">
                <img src="@/assets/onboarding/001.png" style="width: 100%;margin-bottom: -240px;">
                <div class="tot-b" style="z-index: 10; font-size: 38px;">
                  <p>It is a multiverse populated by unmattered spirits of Value, named Eidol. Those're living inside a mysterious pocket dimension called Cryptonomics (or just Crypto), thus can not be seen or touched.</p>
                  <p>But their Value could be expanded and then traded into some real goodies by professional Angl Masters like you...</p>
                </div>
                <img src="@/assets/onboarding/002.png" style="width: 100%;margin-bottom: 60px;margin-top: 10px;">
              </swiper-slide>

              <swiper-slide class="slide">
                <img src="@/assets/onboarding/009.png" style="width: 100%;margin-top: 20px;margin-bottom: -150px;">
                <div class="tot-b" style="z-index: 10; font-size: 38px;">
                  <p>The Eidol are come out of Eidol Eggs. You never know which one will hatch from your Egg, but rare Eggs have higher chance of a more profitable Eidol hatchling.</p>
                </div>
                <img src="@/assets/onboarding/010.png" style="width: 100%;margin-top: -50px;margin-bottom: -50px;">
                <div class="tot-b" style="z-index: 10; font-size: 38px;">
                  <p>Eidol eggs are sold for Angl Shards (ANGLS) at ingame Crypto Wizard and Crypto Smuggler Shops, if in stock. ANGLS could be exchanged at GoldenStern Central Bank (GSCB) ingame.</p>
                </div>
              </swiper-slide>

              <swiper-slide class="slide">
                <img src="@/assets/onboarding/006.png" style="width: 100%;margin-top: 20px;margin-bottom: -50px;">
                <div class="tot-b" style="z-index: 10; font-size: 38px;">
                  <p>Each Crypto Aeon all mere Eidol raise and lose their value based on their Risk - a percent of their Value they're stake at current Round.</p>
                </div>
                <img src="@/assets/onboarding/007.png" style="width: 100%;margin-top: -50px;margin-bottom: -50px;">
                <div class="tot-b" style="z-index: 10; font-size: 38px;">
                  <p>Masters that possess Eidol are controlling their Risk online through their Angl App.</p>
                </div>
                <img src="@/assets/onboarding/008.png" style="width: 100%;margin-top: -50px;margin-bottom: -50px;">
                <div class="tot-b" style="z-index: 10; font-size: 38px;">
                  <p>Once set, Risk stays present for each next Aeon of Cryptonomics.</p>
                </div>
              </swiper-slide>

              <swiper-slide class="slide">
                <div class="tot-b" style="z-index: 10; font-size: 38px;margin-top: 20px;">
                  <p>After being placed at your Master's Deck, your Egg will gain 1XP each Round of Aeon till it reaches the Eidol phase. You also could set a non-zero Risk for your Egg to hatch it faster, but be careful since Eggs has no useful Traits to outstand in the Game of Risk.</p>
                </div>
                <img src="@/assets/onboarding/011.png" style="width: 100%;margin-top: 0px;margin-bottom: 20px;">
                <div class="tot-b" style="z-index: 10; font-size: 38px;">
                  <p>Eggs and Eidol receives XP for a successful stakes and even more XP in case of failure. Items can also modify XP value.</p>
                </div>
                <!-- <img src="@/assets/onboarding/014.png" style="width: 80%;margin: auto;"> -->
                <div class="tot-b" style="z-index: 10; font-size: 38px;">
                  <p>Eidol may be Transmuted upon reaching LVL11. This action randomly improves Eidol traits up to 10 Yieldy / 2 Precise and evolve it into Rarer forms. Evolved Eidol even may become Egregori or Egod.</p>
                </div>
                <!-- <img src="@/assets/onboarding/013.png" style="width: 100%;margin-top: -150px;margin-bottom: 0px;"> -->
              </swiper-slide>

              <swiper-slide class="slide">
                <div class="tot-b" style="z-index: 10; font-size: 38px;margin-top: 20px;">
                  <p>Eidols are more profitable when the achieve an unevenly cool Traits during evolution and transmutation.</p>
                </div>
                <img src="@/assets/onboarding/015.png" style="width: 80%;margin-top: -0px;margin-bottom: -0px;margin-left: 10%;">
                <div class="tot-b" style="z-index: 10; font-size: 38px;">
                  <p>Precise trait allows Master to control Eidol Risk with increased accuracy, while Yieldy trait lowers Eidol Risk during Aeon Computing keeping the same Yield. </p>
                </div>
                <img src="@/assets/onboarding/014.png" style="width: 80%;margin: auto;margin-top: -20px;">
                <div class="tot-b" style="z-index: 10; font-size: 38px;">
                  <p>Choose when to Pop your Eidol wisely. You will receive it's Value to your Purse, but Eidol will evap.</p>
                </div>
                <!-- <img src="@/assets/onboarding/013.png" style="width: 100%;margin-top: -150px;margin-bottom: 0px;"> -->
              </swiper-slide>

              <!-- <swiper-slide class="slide">
                <div class="tot-b" style="z-index: 10; font-size: 38px;margin-top: 20px">
                  <p>There is three types of Eidol populating Cryptonomics right now:</p>
                </div>
                <img src="@/assets/onboarding/012.png" style="width: 100%;margin-top: -220px;margin-bottom: -70px;">
                <div class="tot-b" style="z-index: 10; font-size: 38px;">
                  <p>The majestic Egods, that controls Eidol population. (Upcoming)</p>
                </div>
                <img src="@/assets/onboarding/013.png" style="width: 100%;margin-top: -150px;margin-bottom: -150px;">
                <div class="tot-b" style="z-index: 10; font-size: 38px;">
                  <p>The powerfull Egregori, that allows Masters to Rule and Support the AnglVerse functioning. (Upcoming)</p>
                </div>
                <img src="@/assets/onboarding/005.png" style="width: 100%;margin-top: -150px;margin-bottom: -400px;">
                <div class="tot-b" style="z-index: 10; font-size: 38px;">
                  <p>And a mere Eidols, that grow, fight and die in Eternal Cycle of Aeon.</p>
                </div>
              </swiper-slide> -->

            </swiper>
            <div style="margin-bottom: 180px;width: 100%;" class="flex-item-1">
              <div style="position: relative;">
                <button :class="{ready: this.activeSlide == 4}" class="reflink" @click="proceed">
                  <span v-if="this.activeSlide != 4">Continue...</span>
                  <span v-else>Enter Cryptonomics</span></button>
              </div>
              <div style="color: #ffffff;font-size: 55px;width: 100%;z-index: 1000;position: absolute;">
                <div class="swiper-pagination"></div>
              </div>
            </div>

          </div>

        

      <button @click="proceed">Log In</button>
      <!-- <div>
        <form onsubmit="return false" class="login-form">

          <div style="margin-bottom: 120px;" class="angle"><img style="transform: scale(-1,1);max-width: 250px;margin-bottom: 110px;display: inline-block;" src="@/assets/ogle.png">Ögle</div>
          <div style="font-size: 46px;margin-bottom: 160px;" class="text">Grow your passive income!</div>
          <button @click="register" style="bottom: 280px;color:#e5c44f;background:none!important">Create Account</button>
          <br />
          <button @click="proceed">Log In</button>
        </form>
      <hr />
      <div style="margin-bottom: 20px;" class="red text" v-show="isError">{{message}}</div>
      </div> -->
    </div>
  </div>
</template>

<script>
// Здесь JS
import axios from 'axios'
import state from '../store/state'
import config from '../config'
import router from '../router'
import utils from '../utils'
import { Swiper, SwiperSlide, directive } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'

export default {
data: () => ({
  state,
  error: "",
  login: "",
  password: "",
  isError: false,
  message: {},
  loaded: false,
  audio: null,
  swiperOptions: {
    pagination: {
      el: ".swiper-pagination",
      type: "bullets",
      clickable: true,
    },
    onInit: function (swiper) {
      swiper.slideTo(0)
    },
    initialSlide: 0
    // Some Swiper option/callback...
  },
  activeSlide: 0
}),
components: {
  Swiper,
  SwiperSlide
},
directives: {
    swiper: directive
},
computed: {
  swiper() {
    return this.$refs.mySwiper.$swiper
  }
},
methods: {
  onSlideChange (event) {
    this.activeSlide = this.swiper.activeIndex;
    console.log('slide change', event, this.swiper);
  },
  proceed() {
    if (this.activeSlide != 4) {
      this.swiper.slideTo(this.activeSlide+1)
    } else {
  axios.post(`${config.api}/onboarding/completed`, {})
    .then(() => {
      
    })

  state.user.completed_onboarding = true;
  state.store()
      //if (state.user.start_pack != null)
        this.$router.replace('/')
    }
  },
  register() {
    router.replace('/register')
  },
  submit () {
    this.error = ''
    axios
      .get(config.csrf)
      .then(() => {
        const token = decodeURIComponent(utils.getCookie('XSRF-TOKEN'));
        axios.defaults.headers.common['X-XSRF-TOKEN'] = token;
        axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
        axios.post(
          `${config.api}/auth/login`,
          {
            "username": this.login,
            "password": this.password,
          }
        ).then(response => {
          axios.defaults.withCredentials = true;
          //
          // axios.defaults.headers.common['X-CSRF-TOKEN'] = getCookie("XSRF-TOKEN")
          if (response.data.success) {
            this.state.isLoggedIn = true;
            this.state.name = response.data.data.name
            this.state.balance = response.data.data.balance
            utils.update_game()
            router.replace('/')
          } else {
            this.message = response.data.message;
            this.isError = true;
          }
        }).catch(error => {
          this.message = error.response.data.message;
          let text = "";
          for (let key in error.response.data.errors) {
            text += `${error.response.data.errors[key].join('; ')} `;
          }
          this.message = this.message + ' ' + text;
          this.isError = true;
        })

      })
  }
},
mounted () {
  setTimeout(()=>{this.loaded = true;},500);
  this.audio = new Audio(require('@/assets/music/asciid.mp3'));
  this.audio.loop = true;
  this.audio.volume = 0.5; // по желанию
  this.audio.play().catch((e) => {
    console.warn('Autoplay failed:', e);
  });
},
  beforeDestroy() {
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
  },
}
</script>

<!-- scoped применяется только к этому экрану, без него — глобально -->
<style scoped>
.slide {
  display: flex;
  flex-direction: column;
}

.cont {
  background: white;
  transition: opacity .5s ease;
  width: 100%;
  position: fixed;
  height: 100%;
  background: white;
}

.ready {
  color: #ffffff!important;
  background: #e5c44f!important;
  border-color: #e5c44f!important;
}

.text {
  color: rgb(0, 0, 0);
  font-family: Arimo;
  font-size: 36px;
  font-weight: 400;
  padding-left: 80px;
  padding-right: 80px;
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
  opacity: 0;
  transition: opacity .5s ease;
}

.sw-t.loaded {
  opacity: 1;
}

.angle {
  color: #e5c44f;
  height: 200px;
  font-size: 200px;
  font-weight: 700;
  position: relative;
  line-height: 200px;
  margin-bottom: 30px;
  font-family: sans-serif;
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
  font-size: 50px;
  background: none!important;
  color: #e5c44f;
  font-family: Rubik;
  border-radius: 25px;
  font-weight: 400;
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
  background: none;
  color: #e5c44f;
  font-family: Rubik;
  border-radius: 25px;
  font-weight: 400;
  -webkit-box-shadow: 0px 6px 8px 0px rgba(80, 73, 34, 0.25);-moz-box-shadow: 0px 6px 8px 0px rgba(80, 73, 34, 0.25);box-shadow: 0px 6px 8px 0px rgba(80, 73, 34, 0.25);
}

button:active {
  -webkit-box-shadow: none;-moz-box-shadow: none;box-shadow: none;
}

.flex-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.flex-item-1 {
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: auto;
}

.flex-item-2 {
  flex-grow: 2;
  flex-shrink: 2;
  flex-basis: auto;
}

.swiper-pagination {
  width: 100%;
}

.tot-b {
  margin-left: 80px;
  margin-right: 80px;
  width: calc(100% - 160px);
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  flex-grow: 2;
}
</style>

<style>
.onb .swiper-pagination-bullet {
  width: calc(100%/5);
  padding-bottom: calc(100%/5);
  background: url('~@/assets/onboarding/egg-off.png');
  border-radius: 0;
  background-size: cover;
  opacity: 1;
}
.onb .swiper-pagination-bullet-active {
  width: calc(100%/5);
  padding-bottom: calc(100%/5);
  background: url('~@/assets/onboarding/egg-on.png');
  border-radius: 0;
  background-size: cover;
}
</style>

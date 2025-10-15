<template>
   <div class="cont" :class="{loaded: loaded}">
      
      <div class="sw-t">
        <div>
          <div class="header" style="position: absolute">
            <div class="p-name"></div>
            <div class="back-b" @click="back">
              Return
            </div>
          </div>
          <form onsubmit="return false" class="login-form">
            <div class="form-wrap">
              <div class="swipe-zone"
                @touchstart="dOntouchstart"
                @touchmove="dOntouchmove"
                @touchend="dOntouchend">
              </div>
              <img style="height: 0;opacity: 0;" src="@/assets/investor/1.svg">
              <img style="height: 0;opacity: 0;" src="@/assets/investor/2.svg">
              <img style="height: 0;opacity: 0;" src="@/assets/investor/3.svg">
              <img style="height: 0;opacity: 0;" src="@/assets/investor/4.svg">
              <img style="height: 0;opacity: 0;" src="@/assets/investor/5.svg">
              <img style="height: 0;opacity: 0;" src="@/assets/investor/6.svg">
              <img 
                style="transition: opacity 1s ease 0s;
                height: 450px;
                padding: 40px;
                border: 5px dotted #e5c44f;
                border-radius: 50px;
                display: block;
                margin: 40px auto 0px;
                width: 450px;"
                :src="getImgUrl(currentInvestor)">
                <span data-v-82f71856="" style="font-size: 30px;margin-bottom: 60px;display: block;color: black;">Swipe Left/Right to select your Master</span>
              <!-- <div style="margin-bottom: 120px;" class="angle"><img style="transform: scale(-1,1);max-width: 250px;margin-bottom: 110px;display: inline-block;" src="@/assets/ogle.png">Ögle</div> -->
              <div class="red" v-show="error">{{error}}</div>
              <input style="margin-bottom: 40px;" placeholder="Nickname" v-model="name" type="text" />
              <br />
              <input style="margin-bottom: 40px;" placeholder="E-mail" v-model="email" type="text" />
              <br />
              <input style="margin-bottom: 40px;" placeholder="Password" v-model="password" type="password" />
              <br />
              <input style="margin-bottom: 40px;" placeholder="Repeat Password" v-model="password_confirmation" type="password" />
              <br />
              <div style="margin-bottom: 40px;" class="red text" v-show="isError">{{message}}</div>
            </div>
            <div class="spacer"></div>
            <div class="form-footer">
              <button class="button-fixed" @click="submit" :class="{loging: isLogging, error: isError}">
                <span v-if="isError">{{message2}}</span>
                <span v-else-if="!isLogging">Create Account</span>
                <span v-else>Sending data...</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
</template>

<script>
import axios from 'axios';
import state from '../store/state';
import config from '../config';
import router from '../router'
import utils from '../utils'

export default {
  data: () => ({
    state,
    isError: false,
    isLogging: false,
    error: '',
    message: {},
    message2: {},
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    loaded: true,
    currentInvestor: 1,
    maxInvestor: 6,
    swLock: false,
    touchStartX: 0,
    touchStartY: 0,
    ref_user_id: null,
    ref_code: null
  }),
  mounted () {
    // setTimeout(()=>{this.loaded = true;},500);
    console.log("code",this.code)
    if (this.code) {
      axios
			.get(`${config.api}/auth/register/ref/${this.code}`)
			.then(response => {
				this.data = response.data.data;
				this.loaded = true
        this.ref_user_id = this.data.id
        this.ref_code = this.code
        console.log("invited",this.ref_user_id)
			})
			.catch(err => {
				console.warn("Failed to fetch referrer data", err)
				//this.$router.replace('/hello')
			})
    }
  },
  props: {
    code: String
  },
  methods: {
    getImgUrl(pet) {
      if (pet == null) return;
      var images = require.context('../assets/investor/', false, /\.svg$/)
      //:src="'@/assets/monsters/'+state.oogle.skin+'.svg'"
      return images('./' + pet + ".svg")
    },
    depRight () {
      if (this.currentInvestor < this.maxInvestor) {
        this.currentInvestor ++
      } else {
        this.currentInvestor = 1
      }
      this.swLock = true;
    },
    depLeft () {
      if (this.currentInvestor > 1) {
        this.currentInvestor --
      } else {
        this.currentInvestor = this.maxInvestor
      }
      this.swLock = true;
    },
    dOntouchstart(evt) {
        this.touchStartX = evt.touches[0].screenX
        this.touchStartY = evt.touches[0].screenY
    },
    dOntouchmove(evt) {
      evt.preventDefault();
      this.updateCounter(this.touchStartX, evt.touches[0].screenX)
    },
    dOntouchend() {
        this.touchStartX = undefined
        this.touchStartY = undefined
        this.swLock = false;
    },
    updateCounter(startX, endX) {
      let deltaX = startX-endX
      if (this.swLock != true){
        if (deltaX > 0) this.depLeft()
          else this.depRight()
      }
    },
    back () {
      router.replace('/hello')
    },
    submit () {
      if (this.isError) {
        this.isError = false;
        return
      }
      if (this.isLogging) return;
      this.isLogging = true;
      axios
        .get(config.csrf)
        .then(() => {
          let data = {
            name: this.name,
            email: this.email,
            password: this.password,
            password_confirmation: this.password_confirmation,
            skin_id: this.currentInvestor,
          };
          let refId = null
          let refCode = null
          if (this.code) { 
            refId = this.ref_user_id
            refCode = this.ref_code
          }
          if (refId) {
            data.ref_user_id = refId;
          }
          if (refCode) {
            data.ref_code = refCode;
          }
          axios.post(config.api+'/auth/register', data).then(res => {
            if (res.data.success) {
              this.state.updateFromUserResponse(res);
              utils.update_game()
              this.state.isLoggedIn = true;
              //router.replace('/')
              this.$router.push('/onboarding')
            } else {
              this.message = res.data.message;
              this.isError = true;
              this.isLogging = false;
            }
          }).catch(error => {
            this.message = ''//error.response.data.message;
            this.message2 = error.response.data.message;
            let text = "";
            for (let key in error.response.data.errors) {
              text += `${error.response.data.errors[key].join('; ')} `;
            }
            this.message = this.message + ' ' + text;
            this.isError = true;
            this.isLogging = false;
          })
        })
    }
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

  .form-wrap {
    flex: 1 0 auto;
  }

  .form-footer {
    flex: 0 0 239px;
  }

  .login-form {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    padding-top: 0rem;
    padding-bottom: 0rem;
    justify-content: space-between;
  }

  .men-b {
    float: left;
    margin-left: 40px;
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

  .men-b div:first-of-type {
    background: white;
    height: 5px;
    width: 80px;
    position: absolute;
    bottom: 60px;
  }

  .men-b div:last-of-type {
    background: white;
    height: 5px;
    width: 40px;
    position: absolute;
    bottom: 40px;
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
    font-family: Arimo;
    text-align: center;
    line-height: 100px;
    top: -10px;
    font-weight: 100;
    position: absolute;
    right: 40px;
  }

  .error {color: red}
  .cont {
    opacity: 0;
    transition: opacity .5s ease;
    width: 100%;
    height: 100%;
  }

  .cont.loaded {
    opacity: 1;
  }

  .text {
    color: black;
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
    left: 0;
    opacity: 1;
    transition: opacity .5s ease;
    overflow: auto;
    padding-bottom: 0px;
    top: 0;
    background: white;
    scrollbar-width: none;
  }

  .sw-t > div {
    margin: auto;
    display: block;
    position: relative;
    height: 100%;
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
    color: #fff;
    font-family: Rubik;
    border-radius: 25px;
    font-weight: 400;
    bottom: 80px;
    left: 0;
    -webkit-box-shadow: 0px 6px 8px 0px rgba(80, 73, 34, 0.25);-moz-box-shadow: 0px 6px 8px 0px rgba(80, 73, 34, 0.25);box-shadow: 0px 6px 8px 0px rgba(80, 73, 34, 0.25);
  }

  button:active {
    -webkit-box-shadow: none;-moz-box-shadow: none;box-shadow: none;
  }

  .loging {
    background: none!important;
    color: #e5c44f!important;
    -webkit-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset!important;
    -moz-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset!important;
    box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset!important;
  }

  .error {
    color: #ff8ee4;
    border-color: #ff8ee4;
    background: none!important;
    -webkit-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset!important;
    -moz-box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset!important;
    box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset!important;
  }

  .swipe-zone {
    position: absolute;
    width: 100%;
    height: 500px;
    margin-top: 60px;
  }
</style>

<template>
    <div class="cont" :class="{loaded: loaded}">
      <div class="header">
        <div class="p-name"></div>
        <div class="back-b" @click="back">
          Return
        </div>
      </div>
      <div class="sw-t">
        <div>
          <form onsubmit="return false" class="login-form">
            <div class="form-wrap">
              <div style="margin-bottom: 10px;margin-top: 0px;" class="angle"><img style="width: 650px;display: inline-block;" src="@/assets/ANGL.png"></div>
              <div style="font-size: 48px;margin-bottom: 40px;" class="text">Inter-Dimensional Crypto Trade</div>
              <div class="red" v-show="error">{{error}}</div>
              <input style="margin-bottom: 40px;" type="text" v-model="login" placeholder="E-mail" />
              <br />
              <input style="margin-bottom: 40px;" type="password" v-model="password" placeholder="Password"/>
              <br />
              <!-- <div style="margin-bottom: 40px;" class="red text" v-show="isError">{{message}}</div> -->
            </div>
            <div class="form-footer">            
              <button class="button-fixed" @click="submit" :class="{loging: isLogging, error: isError}">
                <span v-if="isError">{{message}}</span>
                <span v-else-if="!isLogging">Log In</span>
                <span v-else>Fetching data...</span>
              </button>
            </div>
          </form>
<!--         <hr />
        <div style="font-size: 30px;" class="text">Don't have an account? <router-link style="font-size: 40px;" :to="'/register'">Register</router-link></div> -->
        </div>
      </div>
      <notifications ref="notifications"></notifications>
    </div>
</template>

<script>
// Здесь JS
import axios from 'axios'
import state from '../store/state'
import config from '../config'
import router from '../router'
import utils from '../utils'
import WebSocketClient from '../wsclient'
import Notifications from '../components/Notifications.vue'

export default {
  data: () => ({
    state,
    error: "",
    login: "",
    password: "",
    isError: false,
    message: {},
    loaded: true,
    isLogging: false
  }),
  components: {
    Notifications
  },
  methods: {
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
            //axios.defaults.headers.common['X-CSRF-TOKEN'] = getCookie("XSRF-TOKEN")
            if (response.status < 400) {
              this.state.isLoggedIn = true;
              console.log(response.status);
              this.state.updateFromUserResponse(response);
              utils.update_game();
              WebSocketClient.authenticate();
              console.log("NAME",response.data.data.name);
              router.replace('/');
            } else {
              // this.$refs.notifications.showNotification({
              //   variant: 'error',
              //   title: "Error",
              //   text: response.data.message,
              //   closeOnClick: true
              // });
              this.message = response.data.message;
              this.isError = true;
              this.isLogging = false;
            }
          }).catch(error => {
            console.log(error)
            this.message = error.response.data.message;
            //this.message = "";
            let text = "";
            for (let key in error.response.data.errors) {
              text += `${error.response.data.errors[key].join('; ')} `;
            }
            this.message = this.message + ' ' + text;
            this.message = error.response.data.message;
            // this.$refs.notifications.showNotification({
            //     variant: 'error',
            //     title: "Error",
            //     text: this.message,
            //     closeOnClick: true
            //   });
            this.isError = true;
            this.isLogging = false;
          })

        })
    }
  },
  computed: {
  },
  mounted () {
    // setTimeout(()=>{this.loaded = true;},500);
  }
}
</script>

<!-- scoped применяется только к этому экрану, без него — глобально -->
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
    padding-top: 200px;
  }

  .form-footer {
    flex: 0 0 240px;
  }

  .button-fixed {
 
  }

  .login-form {
    display: flex;
    flex-direction: column;
    min-height: 100%;
  }

  .men-b {
    float: left;
    margin-left: 40px;
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

  .cont {
    opacity: 0;
    transition: opacity .5s ease;
    width: 100%;
    position: fixed;
    height: 100%;
    background: white;
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
    top: 0;
    left: 0;
    opacity: 1;
    transition: opacity .5s ease;
    overflow: auto;
  }

  .sw-t > div {
    height: 100%;
    /*animation: 6s linear 1s infinite forwards k1;*/
  }

  .angle {
    color: #e5c44f;
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
    bottom: 160px;
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
</style>

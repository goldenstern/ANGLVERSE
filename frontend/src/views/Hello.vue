<template>
    <div class="cont" :class="{loaded: loaded}">
      <div class="header">
        <div class="p-name"></div>
        <div class="back-b">
          
        </div>
      </div>
      <div class="sw-t">
        <div>
          <form onsubmit="return false" class="login-form">
            <div class="form-wrap">
              <div style="margin-bottom: 40px;margin-top: 40px;" class="angle"><img style="width: calc(100% - 160px);display: inline-block;position: absolute;top: 0;left: 80px;z-index: 0;" src="@/assets/CIRKUL.png"></div>
            </div>
            <div class="spacer" style="flex: 4 0 0;"></div>
            <div class="form-footer" style="z-index: 1;">
              <button @click="register" style="margin-bottom: 40px;color:#e5c44f;background:white!important;">Create Account</button>
              <br />
              <button style="margin-bottom: 80px;" @click="proceed">Log In</button>
            </div>
          </form>
        <!-- <hr />
        <div style="margin-bottom: 20px;" class="red text" v-show="isError">{{message}}</div> -->
        </div>
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

export default {
  data: () => ({
    state,
    error: "",
    login: "",
    password: "",
    isError: false,
    message: {},
    loaded: true
  }),
  methods: {
    proceed() {
      router.replace('/login')
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

  .back-b {
    font-size: 30px;
    color: #000;
    font-family: Arimo;
    text-align: center;
    line-height: 100px;
    top: 10px;
    font-weight: 100;
    position: absolute;
    left: 40px;
  }

  .p-name {
    font-size: 40px;
    color: white;
    font-family: Roboto;
    text-align: center;
    line-height: 100px;
  }

  .cont {
    opacity: 0;
    transition: opacity .5s ease;
    width: 100%;
    position: fixed;
    height: 100%;
    background:  white;
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
    color: #00FFE0;
  }

  .sw-t {
    width: 100%;
      height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 1;
    transition: opacity .5s ease;
    overflow: hidden;
  }

  .sw-t > div {
    margin: auto;
      display: block;
      height: 100%;
      position: relative;
      top: 0px;
      /*animation: 6s linear 1s infinite forwards k1;*/
  }

  .angle {
    color: #00ffe0;
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

  .login-form {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    padding-top: 0rem;
    padding-bottom: 0rem;
    justify-content: space-between;
  }

  .form-wrap {
    flex: 1 0 auto;
  }

  .form-footer {
    flex: 0 0 240px;
  }
</style>

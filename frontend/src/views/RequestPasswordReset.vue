<template>
  <div class="cont" :class="{loaded: loaded}">
    <div class="header">
      <div class="p-name"></div>
      <div class="back-b" @click="back">
        Back
      </div>
    </div>
    <div class="sw-t">
      <div>
          <form autocomplete="off" @submit.prevent="requestResetPassword" method="post">
            <!-- <div style="margin-bottom: 120px;" class="angle"><img style="transform: scale(-1,1);max-width: 250px;margin-bottom: 110px;display: inline-block;" src="@/assets/ogle.png">Ögle</div> -->
            <div class="red" v-show="error">{{error}}</div>
            <div class="w-i-2" style="margin-left: 80px;margin-top: 0px;z-index: 202;">
              <span>E-Mail</span><br>
            </div>
            <input style="margin-bottom: 40px;" placeholder="E-Mail" id="email" class="form-control" v-model="email" type="email" required/>
            <div class="w-i-2" style="margin-left: 80px;margin-top: 0px;z-index: 202;">
              <span>&nbsp;</span><br>
            </div>
            <div class="red text" v-show="isError">{{message}}</div>  
            <br v-show="isError">
            <button style="" type="submit">Send Password Reset Link</button>
          </form> 
        </div>
      <!-- <div class="container">
        <div class="row justify-content-center">
          <div class="col-6">
            <div class="card card-default">
              <div class="card-header">Reset Password</div>
              <div class="card-body">
                <form autocomplete="off" @submit.prevent="requestResetPassword" method="post">
                  <div class="form-group">
                      <label for="email">E-mail</label>
                      <input type="email" id="email" class="form-control" placeholder="user@example.com" v-model="email" required>
                  </div>
                  <button type="submit" class="btn btn-primary">Send Password Reset Link</button>
                </form>
                <div style="margin-bottom: 20px;" class="red text" v-show="isError">
                  {{message}}
                </div>
                <div style="margin-bottom: 20px;" class="red text" v-show="!isError">
                  {{message}}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>
<script>

import axios from 'axios'
import state from '../store/state'
import config from '../config'
import router from '../router'
import utils from '../utils'

export default {
  data: () => ({
    state,
    error: "",
    isError: false,
    message: "",
    loaded: false,
    email: "",
    has_error: false
  }),
  methods: {
    back () {
      router.replace('/hello')
    },
    requestResetPassword () {
      this.error = ''
      axios
        .get(config.csrf)
        .then(() => {
          const token = decodeURIComponent(utils.getCookie('XSRF-TOKEN'));
          axios.defaults.headers.common['X-XSRF-TOKEN'] = token;
          axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
          axios.post(
            `${config.api}/auth/reset-password`,
            {
              "email": this.email
            }
          ).then(response => {
            axios.defaults.withCredentials = true;
            //
            // axios.defaults.headers.common['X-CSRF-TOKEN'] = getCookie("XSRF-TOKEN")
            if (response.data.success) {
              this.message = response.data.message;
              this.email = "";
            } else {
              this.message = response.data.message;
              this.isError = true;
            }
          }).catch(error => {
            console.warn(error)
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
    setTimeout(()=>{this.loaded = true;},500);
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
    color: #fff;
    font-family: Roboto;
    text-align: center;
    line-height: 100px;
    top: 10px;
    font-weight: 100;
    position: absolute;
    right: 40px;
  }

  .cont {
    opacity: 0;
    transition: opacity .5s ease;
    width: 100vw;
    position: fixed;
    height: 100%;
  }

  .cont.loaded {
    opacity: 1;
  }

  .text {
    color: white;
    font-family: Roboto;
    font-size: 36px;
    font-weight: 400;
    padding-left: 80px;
    padding-right: 80px;
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
  }

  .sw-t > div {
    margin: auto;
      display: block;
      height: 700px;
      position: relative;
      top: 160px;
      /*animation: 6s linear 1s infinite forwards k1;*/
  }

  .angle {
    color: #00ffe0;
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
    border: 5px solid #00FFE0;
    font-size: 50px;
    background: none!important;
    color: #00FFE0;
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
    border: 5px solid #00FFE0;
    font-size: 50px;
    background: #00FFE0!important;
    color: #000000;
    font-family: Rubik;
    border-radius: 25px;
    font-weight: 400;
    bottom: 80px;
    position: fixed;
    left: 0;
  }
</style>

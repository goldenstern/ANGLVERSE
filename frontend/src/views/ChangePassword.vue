<template>
  <div class="cont" :class="{loaded: loaded}">
    <div class="header">
      <div class="p-name"></div>
      <div class="back-b" @click="back">
        Back
      </div>
    </div>
    <div class="sw-t">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-6">
            <div class="card card-default">
              <div class="card-header">New Password</div>
              <div class="card-body">
                <form autocomplete="off" @submit.prevent="resetPassword" method="post">
                  <div class="form-group">
                      <label for="email">E-mail</label>
                      <input type="email" id="email" class="form-control" placeholder="user@example.com" v-model="email" required>
                  </div>
                  <div class="form-group">
                      <label for="email">Password</label>
                      <input type="password" id="password" class="form-control" placeholder="" v-model="password" required>
                  </div>
                  <div class="form-group">
                      <label for="email">Confirm Password</label>
                      <input type="password" id="password_confirmation" class="form-control" placeholder="" v-model="password_confirmation" required>
                  </div>
                  <button type="submit" class="btn btn-primary">Update</button>
                </form>
                <hr />
                <div style="margin-bottom: 20px;" class="red text" v-show="isError">{{message}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
    password: null,
    password_confirmation: null,
    has_error: false
  }),
  props: {
    token: String
  },
  methods: {
    back () {
      router.replace('/hello')
    },
    resetPassword () {

      this.error = ''
      axios
        .get(config.csrf)
        .then(() => {
          const token = decodeURIComponent(utils.getCookie('XSRF-TOKEN'));
          axios.defaults.headers.common['X-XSRF-TOKEN'] = token;
          axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
          axios.post(
            `${config.api}/auth/reset/password`,
            {
              "token": this.token,
              // "token": this.$route.params.token,
              "email": this.email,
              "password": this.password,
              "password_confirmation": this.password_confirmation
            }
          ).then(response => {
            axios.defaults.withCredentials = true;
            //
            // axios.defaults.headers.common['X-CSRF-TOKEN'] = getCookie("XSRF-TOKEN")
            if (response.data.success) {

              this.$router.push({name: 'login'});

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
    this.email = this.$route.query.email
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
      top: calc(50% - 700px);
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

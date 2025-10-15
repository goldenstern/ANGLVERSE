<template>
    <div class="cont" :class="{loaded: loaded}" style="background:white;">
      <div class="header">
        <div class="p-name"></div>
        <div class="back-b" @click="back">
          Back
        </div>
      </div>
      <div class="sw-t">
        <div style="height: 100%;">
          <div style="font-size: 46px;margin-bottom: 160px;" class="text">{{ notification }}</div>
          <button :class="{loging: isLogging}" style="color: black;border-color: rgb(229, 196, 79);background: white;margin-bottom: 0px;position: fixed;" @click="click">
            <span v-if="!isLogging">Apply KYC</span>
            <span v-else>Fetching data...</span>
          </button>
        </div>
      </div>
    </div>
</template>

<script>
// Здесь JS
import state from '../store/state'
import router from '../router'
import axios from 'axios'
import config from '../config'

export default {
  data: () => ({
    state,
    notification: "",
    loaded: false,
    isLogging: false
  }),
  props: {
    message: String
  },
  methods: {
    back () {
      router.replace('/hello')
    },
    click () {
      if (this.isLogging) return;
      this.isLogging = true;
      // axios
      //   .get(config.csrf)
      //   .then(() => {
          axios.post(
            `${config.api}/register/verify/` + this.$route.params.message,
            {
            }
          ).then(() => {
            state.clearStorage();
            this.$router.replace('/login')
            this.isLogging = false;
          })
      //  })
    }
  },
  computed: {
  },
  mounted () {
    axios
        .get(config.csrf)
    setTimeout(()=>{this.loaded = true;},500);
    this.notification = this.$route.params.message + this.$route.params.message2;
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
    width: 100%;
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
    border: 5px solid #e5c44f;
    font-size: 50px;
    background: #white!important;
    color: #black;
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
</style>

<template>
	<!-- <div >
		<h1>
			You were invited by {{data.name}}
		</h1>
		
		<button class="btn btn-lg btn-primary btn-block" @click="gotoRegister">
			Register
		</button>
	</div> -->

	<div class="cont" :class="{loaded: loaded}">
    <div class="sw-t" v-if="loaded">
      <div>
        <form onsubmit="return false" class="login-form">

          <div class="angle" style="margin-bottom: 10px; margin-top: 0px;">
            <img src="@/assets/ANGL.png" style="width: 650px; display: inline-block;"></div>
          <div class="text" style="font-size: 48px; margin-bottom: 200px;">Inter-Dimensional Crypto Trade</div>
          <div style="font-size: 46px;margin-bottom: 160px;" class="text">You were invited by {{data.name}}!</div>
          <div style="width: 300px;margin: auto;">
            <investor :skin-id="data.investor_skin_id"></investor>
          </div>
          <button @click="gotoRegister" style="color:#e5c44f;background:none!important">Create Account</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
	import axios from 'axios'
	import config from '../config'
	import Investor from '../components/Investor.vue'
	import router from '../router'

	export default {
		data: () => ({
			loaded: false,
			data: {}
		}),
		props: {
			code: String
		},
		components: {
			Investor
		},
		methods: {
			gotoRegister () {
				router.replace(`/register/code/${this.code}`)
			}
		},
		mounted () {
			axios
			.get(`${config.api}/auth/register/ref/${this.code}`)
			.then(response => {
				this.data = response.data.data;
				this.loaded = true
				// if ('localStorage' in window) {
				// 	localStorage.setItem('ref_user_id', this.data.id)
        //   localStorage.setItem('ref_code', this.code)
				// }
			})
			.catch(err => {
				console.warn("Failed to fetch referrer data", err)
				//this.$router.replace('/hello')
			})
		}
	}
</script>

<style scoped>
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

  .angle {
    color: #00ffe0;
    font-size: 200px;
    font-weight: 700;
    position: relative;
    line-height: 200px;
    margin-bottom: 30px;
    font-family: sans-serif;
  }

  .text {
    color: black;
    font-family: Roboto;
    font-size: 36px;
    font-weight: 400;
    padding-left: 80px;
    padding-right: 80px;
  }

  .text a {
    color: #00FFE0;
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
      top: 200px;
      /*animation: 6s linear 1s infinite forwards k1;*/
  }

  button {
    position: fixed;
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
</style>

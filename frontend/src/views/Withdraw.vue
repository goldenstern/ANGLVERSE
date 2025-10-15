<template>
  <div class="cont">
    <div class="header">
        <div class="p-name"></div>
        <div class="back-b" @click="back">
          Back
        </div>
    </div>
     <div class="sw-t">
       <div>
         <form onsubmit="return false" class="login-form">
           <div class="angle">ά</div>
           <div class="red-text" v-show="error">{{error}}</div>
           <input style="margin-bottom: 20px;" placeholder="Replenishment amount" v-model="amount" type="number" />
           <br />
         </form>
         <button type="button" @click="submit">Withdraw</button>
       </div>
     </div>
   </div>
</template>

<script>
// import state from '../store/state';
import router from '../router'
import config from '../config';
import axios from 'axios';

export default {
  data: () => ({
    amount: 1000.00,
    error: ''
  }),
  methods: {
    back () {
      router.replace('/')
    },
    submit () {
      axios
        .get(config.csrf)
        .then(() => {
          axios
            .post(config.api+'/wallet/withdraw', {amount: this.amount})
            .then(() => {
              alert("Success")
              this.$router.replace('/')
            }).catch(error => {
              this.error.message = error.response.data.message
            })
        })
    },
    logout () {
      axios.post(config.api+'/auth/logout').then(() => {
        this.$router.replace('/login')
      });
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
    font-weight: 100;
    font-family: Roboto;
    text-align: center;
    line-height: 100px;
    top: 10px;
    position: absolute;
    right: 40px;
  }

.cont {
  /*opacity: 0;*/
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
    top: calc(50% - 500px);
    /*animation: 6s linear 1s infinite forwards k1;*/
}

.angle {
  color: #00ffe0;
  height: 200px;
  font-size: 200px;
  font-weight: 700;
  position: relative;
  line-height: 200px;
  margin-bottom: 40px;
  font-family: fangsong;
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
  bottom: 40px;
  position: fixed;
  left: 0;
}

</style>

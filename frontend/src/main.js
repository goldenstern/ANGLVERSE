import Vue from 'vue';
// import VueAwesomeSwiper from 'vue-awesome-swiper'
import App from './App.vue';
import router from './router';
import store from './store';
//import state from './store'
//import axios from 'axios'
//import config from './config'
import utils from './utils';
import Vue2TouchEvents from 'vue3-touch-events';
import Clipboard from 'v-clipboard';
import QrcodeVue from 'qrcode.vue';
import Vuelidate from 'vuelidate';
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

// import 'swiper/css/swiper.css'

Vue.config.productionTip = false;
Vue.use(Vue2TouchEvents);
Vue.use(Clipboard);
Vue.use(QrcodeVue);
Vue.use(Vuelidate);
Vue.use(Toast, {
  transition: "Vue-Toastification__bounce",
  maxToasts: 20,
  newestOnTop: true,
  filterToasts: toasts => {
    // Keep track of existing types
    const types = {};
    return toasts.reduce((aggToasts, toast) => {
      // Check if type was not seen before
      if (!types[toast.type]) {
        aggToasts.push(toast);
        types[toast.type] = true;
      }
      return aggToasts;
    }, []);
  }
});

// Vue.use(VueAwesomeSwiper)

Vue.filter('tofixed8', function (value) {
  return parseFloat(value || 0).toFixed(8);
})

Vue.filter('formatCoin', function(value) {
  const val = parseFloat(value)
  if (val >= 1e9) {
    return val.toFixed(0)
  } else if (val < 0) {
    return val.toFixed(8)
  } else {
    const precise = val.toPrecision(11)
    const fixed8 = val.toFixed(8)
    const lenPrecise = precise.length
    const lenFixed8 = fixed8.length
    return lenFixed8 > lenPrecise? precise : fixed8
  } 
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

utils.internal_clock();
setInterval(utils.internal_clock, 60000);
setInterval(utils.tick_clock, 500);

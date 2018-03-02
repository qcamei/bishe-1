import Vue from 'vue'
import register from './register'
import router from './router/register'
import axios from 'axios'

Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#register',
  router,
  template: '<register/>',
  components: { register }
})

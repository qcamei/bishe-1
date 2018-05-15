import Vue from 'vue'
import manager from './manager.vue'
import router from './router/manager'
import axios from 'axios'

Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#manager',
  router,
  template: '<manager/>',
  components: { manager }
})

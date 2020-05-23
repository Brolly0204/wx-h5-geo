import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueCookie from 'vue-cookie'

Vue.config.productionTip = false

Vue.use(VueAxios, axios)
Vue.use(VueCookie)

new Vue({
  render: h => h(App),
}).$mount('#app')

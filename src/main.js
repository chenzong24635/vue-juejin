import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './icons'
Vue.config.productionTip = false

Vue.prototype.$eventBus = new Vue();

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
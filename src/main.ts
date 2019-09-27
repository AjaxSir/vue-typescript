import Vue from "vue";

// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'

import './plugins/axios'
import App from "./App.vue";

import router from "./router";
import store from "./store/index";

import '@/styles/index.scss' // global css

import '@/icons' // icon

import './plugins/element.js'

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

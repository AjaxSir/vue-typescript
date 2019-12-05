import Vue from "vue";

// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'

import './plugins/axios'
import App from "./App.vue";

import router from "./router";
import store from "./store/index";



import '@/icons' // icon
import '@/permission' // permission control

import './plugins/element.js'
import BaiduMap from 'vue-baidu-map'

Vue.use(BaiduMap, {
  ak: 'vCZU88Guz4BmAODWTm8k9BP0WlwId1V0'
})

import '@/styles/index.scss' // global css


Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

import Vue from "vue";
import Router from "vue-router";
// 路由懒加载
const _import_ = (file: string) => () => import(`@/views/${file}`).then(m => m.default);
Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "home",
      component: _import_('Home')
    },
    {
      path: "/houseManage",
      name: "houseManage",
      component: _import_('houseManage')
    }
  ]
});

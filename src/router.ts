import Vue from "vue";
import Router from "vue-router";
// 路由懒加载
const _import_ = (file: string) => () => import(`@/views/${file}.vue`);
import Layout from '@/views/layout/index.vue'
Vue.use(Router);

export const constantRouterMap = [{
  path: "",
  redirect: 'dashboard',
  hidden: true,
  component: Layout,
  children: [{
    path: 'dashboard',
    component: _import_('dashboard/index'),
    name: 'dashboard',
    meta: {
      title: '首页',
      icon: 'monitor'
    }
  }]
}, {
  path: '/house',
  name: 'house',
  component: Layout,
  redirect: '/house/houseManage',
  alwaysShow: true,
  meta: {
    title: '房屋管理',
    icon: 'v_house',
    icon_class: "person-iconB",
  },
  children: [{
    name: 'houseManage',
    path: 'houseManage',
    component: _import_('houseManage/index'),
    meta: {
      title: '房屋管理',
      icon: 'monitor'
    }
  }]
}, {
  path: '/card',
  name: 'card',
  component: Layout,
  redirect: '/card/access_card',
  alwaysShow: true,
  meta: {
    title: '门禁卡管理',
    icon: 'v_house',
    icon_class: "person-iconB",
  },
  children: [{
    name: 'access_card',
    path: 'access_card',
    component: _import_('cardManage/index'),
    meta: {
      title: '门禁卡管理',
      icon: 'monitor'
    }
  }]
},]


export default new Router({
  mode: 'history',
  routes: constantRouterMap,
  // scrollBehavior: () => ({
  //   y: 0
  // }),
})


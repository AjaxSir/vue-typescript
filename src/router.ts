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
    icon: 'v_card',
    icon_class: "person-iconA",
  },
  children: [{
    name: 'access_card',
    path: 'access_card',
    component: _import_('cardManage/index'),
    meta: {
      title: '门禁卡管理',
      icon: 'monitor'
    }
  },
  {
    name: 'propertymanage',
    path: 'propertymanage',
    component: _import_('propertyManage/index'),
    meta: {
      title: '物业管理',
      icon: 'monitor'
    }
  },
  {
    name: ' ',
    path: 'vistormanage',
    component: _import_('vistorManage/index'),
    meta: {
      title: '访客管理',
      icon: 'monitor'
    }
  }]
},
{
  path: '/traffic',
  name: 'traffic',
  component: Layout,
  redirect: '/traffic/carManage',
  alwaysShow: true,
  meta: {
    title: '车辆管理',
    icon: 'v_regVisitor',
    icon_class: "person-iconE",
  },
  children: [{
    name: 'carManage',
    path: 'carManage',
    component: _import_('carManage/index'),
    meta: {
      title: '车辆管理',
      icon: 'monitor'
    }
  }]
},
{
  path: '/device',
  name: 'device',
  component: Layout,
  redirect: '/device/_manage',
  alwaysShow: true,
  meta: {
    title: '设备管理',
    icon: 'v_deviceInfo',
    icon_class: "query-iconA",
  },
  children: [{
    name: '_manage',
    path: '_manage',
    component: _import_('deviceManage/index'),
    meta: {
      title: '设备管理',
      icon: 'monitor'
    }
  }]
},
{
  path: '/device',
  name: 'device',
  component: Layout,
  redirect: '/device/_manage',
  alwaysShow: true,
  meta: {
    title: '通行管理',
    icon: 'record',
    icon_class: "person-iconC",
  },
  children: [{
    name: '_manage',
    path: '_manage',
    component: _import_('deviceManage/index'),
    meta: {
      title: '通行管理',
      icon: 'monitor'
    }
  }]
},
{
  path: '/user',
  name: 'user',
  component: Layout,
  redirect: '/user/ownermanage',
  alwaysShow: true,
  meta: {
    title: '用户管理',
    icon: 'user',
    icon_class: "person-iconD",
  },
  children: [{
    name: 'ownermanage',
    path: 'ownermanage',
    component: _import_('ownerManage/index'),
    meta: {
      title: '业主管理',
      icon: 'monitor'
    }
  }]
}]

export default new Router({
  mode: 'history',
  routes: constantRouterMap,
  // scrollBehavior: () => ({
  //   y: 0
  // }),
})


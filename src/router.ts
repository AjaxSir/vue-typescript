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
    title: '住宅管理',
    icon: 'v_house',
    icon_class: "person-iconB",
  },
  children: [{
    name: 'houseManage',
    path: 'houseManage',
    component: _import_('houseManage/index'),
    meta: {
      title: '住宅管理 - 房屋管理',
      icon: 'monitor'
    }
  }, {
    name: 'access_card',
    path: 'access_card',
    component: _import_('cardManage/index'),
    meta: {
      title: '住宅管理 - 门禁卡管理',
      icon: 'monitor'
    }
  },]
}, {
  path: '/person',
  name: 'person',
  component: Layout,
  redirect: '/person/owner',
  alwaysShow: true,
  meta: {
    title: '人员管理',
    icon: 'v_person',
    icon_class: "person-iconA",
  },
  children: [{
    name: 'owner',
    path: 'owner',
    component: _import_('ownerManage/index'),
    meta: {
      title: '人员管理 - 业主管理',
      icon: 'monitor'
    }
  }, {
    name: 'property',
    path: 'property',
    component: _import_('propertyManage/index'),
    meta: {
      title: '人员管理 - 物业管理',
      icon: 'monitor'
    }
  },
  {
    name: ' ',
    path: 'vistormanage',
    component: _import_('vistorManage/index'),
    meta: {
      title: '人员管理 - 访客管理',
      icon: 'monitor'
    }
  }]
}, {
  path: '/traffic',
  name: 'traffic',
  component: Layout,
  redirect: '/traffic/carManage',
  alwaysShow: true,
  meta: {
    title: '车辆管理',
    icon: 'v_car',
    icon_class: "person-iconE",
  },
  children: [{
    name: 'carManage',
    path: 'carManage',
    component: _import_('carManage/index'),
    meta: {
      title: '车辆管理 - 车辆名单',
      icon: 'monitor'
    }
  }, {
    name: 'carPass',
    path: 'carPass',
    component: _import_('carPass/index'),
    meta: {
      title: '车辆管理 - 通行记录',
      icon: 'monitor'
    }
  },{
    name: 'carport',
    path: 'carport',
    component: _import_('carportManage/index'),
    meta: {
      title: '车辆管理 - 车位管理',
      icon: 'monitor'
    }
  }]
}, {
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
  }, {
    name: 'fault',
    path: 'fault',
    component: _import_('deviceFault/index'),
    meta: {
      title: '设备管理 - 设备故障',
      icon: 'monitor'
    }
  }]
}, {
  path: '/pass',
  name: 'pass',
  component: Layout,
  redirect: '/pass/management',
  alwaysShow: true,
  meta: {
    title: '通行管理',
    icon: 'record',
    icon_class: "person-iconC",
  },
  children: [{
    name: 'management',
    path: 'management',
    component: _import_('personPass/index'),
    meta: {
      title: '人员通行管理',
      icon: 'monitor'
    }
  }]
}, {
  path: '/subscription',
  name: 'subscription',
  component: Layout,
  redirect: '/subscription/subscriber',
  alwaysShow: true,
  meta: {
    title: '订阅报警服务',
    icon: 'user',
    icon_class: "person-iconD",
  },
  children: [{
    name: 'subscriber',
    path: 'subscriber',
    component: _import_('subscriberManage/index'),
    meta: {
      title: '订阅人管理',
      icon: 'monitor'
    }
  }]
}, {
  path: '/schoolhouse',
  name: 'schoolhouse',
  component: Layout,
  redirect: '/schoolhouse/library',
  alwaysShow: true,
  meta: {
    title: '校舍管理',
    icon: 'user',
    icon_class: "person-iconD",
  },
  children: [{
    name: 'library',
    path: 'library',
    component: _import_('schoolhouse/libraryManage/index'),
    meta: {
      title: '图书馆管理',
      icon: 'monitor'
    }
  }, {
    name: 'classroom',
    path: 'classroom',
    component: _import_('schoolhouse/classroomManage/index'),
    meta: {
      title: '教学楼管理',
      icon: 'monitor'
    }
  }, {
    name: 'office',
    path: 'office',
    component: _import_('schoolhouse/officeManage/index'),
    meta: {
      title: '办公室管理',
      icon: 'monitor'
    }
  }, {
    name: 'canteen',
    path: 'canteen',
    component: _import_('schoolhouse/canteenManage/index'),
    meta: {
      title: '食堂管理',
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


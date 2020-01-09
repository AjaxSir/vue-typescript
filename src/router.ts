import Vue from "vue";
import Router from "vue-router";
// 路由懒加载
const _import_ = (file: string) => () => import(`@/views/${file}.vue`);
import Layout from '@/views/layout/index.vue'
import errorPage404 from '@/views/errorPage/404.vue'

Vue.use(Router);

export const constantRouterMap = [
  {
    path: '/login',
    name: 'login',
    component: _import_('login/index'),
    hidden: true
  },
  {
    path: "",
    redirect: 'dashboard',
    hidden: true,
    component: Layout,
    alwaysShow: false,
    children: [{
      path: 'dashboard',
      component: _import_('dashboard/index'),
      name: 'dashboard',
      meta: {
        title: '首页',
        icon: 'monitor'
      }
    }]
  },
  {
    path: '*',
    name: '404',
    component: errorPage404,
    hidden: true
  }
]

export const asyncRoute = [
  {
    path: '/house',
    name: 'house',
    component: Layout,
    redirect: '/house/chart',
    alwaysShow: true,
    meta: {
      title: '住宅管理',
      icon: 'icon-zhuzhai',
      bg_color: '#DF788D',
    },
    children: [{
      name: 'chart',
      path: 'chart',
      component: _import_('houseManage/houseChart/index'),
      meta: {
        title: '楼控视图',
        icon: 'icon-loudong',
        bg_color: '#e17f5a',
        hidden: true
      }
    }, {
      name: 'list',
      path: 'list',
      component: _import_('houseManage/houseList/index'),
      meta: {
        title: '住宅管理',
        icon: 'icon-fangwufangchan',
        bg_color: '#2c7fec'
      }
    }, {
      name: 'access_card',
      path: 'access_card',
      component: _import_('houseManage/cardManage/index'),
      meta: {
        title: '门禁卡管理',
        icon: 'icon-qia',
        bg_color: '#976041'
      }
    }, {
      name: 'passageway',
      path: 'passageway',
      component: _import_('houseManage/passagewayManage/index'),
      meta: {
        title: '出入口管理',
        icon: 'icon-churukou',
        bg_color: '#bec037'
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
      icon: 'icon-renyuanguanli',
      bg_color: '#8FA8C7',
    },
    children: [{
      name: 'owner',
      path: 'owner',
      component: _import_('personManage/ownerManage/index'),
      meta: {
        title: '住户管理',
        icon: 'icon-yonghu',
        bg_color: '#83c9a6'
      }
    }, {
      name: 'property',
      path: 'property',
      component: _import_('personManage/propertyManage/index'),
      meta: {
        title: '物业人员管理',
        icon: 'icon-wuyeguanli',
        bg_color: '#6197d4'
      }
    },
    {
      name: 'caller ',
      path: 'caller',
      component: _import_('personManage/vistorManage/index'),
      meta: {
        title: '访客管理',
        icon: 'icon-fangkeguanli',
        bg_color: '#796273'
      }
    }, {
      name: 'management',
      path: 'management',
      component: _import_('personManage/personPass/index'),
      meta: {
        title: '通行记录',
        icon: 'icon-renyuantongji1',
        bg_color: '#723f42'
      }
    }, {
      name: 'stranger',
      path: 'stranger',
      component: _import_('personManage/strangerPeople/index'),
      meta: {
        title: '陌生人管理',
        icon: 'icon-icon-',
        bg_color: '#b63a9b'
      }
    },
    {
      name: 'focus',
      path: 'focus',
      component: _import_('personManage/focusPeople/index'),
      meta: {
        title: '关注人员',
        icon: 'icon-wodeguanzhu',
        bg_color: '#e3686a'
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
      icon: 'icon-cheliangguanli',
      bg_color: '#e4a26e',
    },
    children: [{
      name: 'stall',
      path: 'stall',
      component: _import_('carManage/stallManage/index'),
      meta: {
        title: '车位管理',
        icon: 'icon-icon_cheweiguanli',
        bg_color: '#798384'
      }
    }, {
      name: 'carManage',
      path: 'carManage',
      component: _import_('carManage/carList/index'),
      meta: {
        title: '车辆管理',
        icon: 'icon-cheliangpaiban',
        bg_color: '#e0805a'
      }
    }, {
      name: 'carPass',
      path: 'carPass',
      component: _import_('carManage/carPass/index'),
      meta: {
        title: '通行记录',
        icon: 'icon-cheliangdangan',
        bg_color: '#7f7dae'
      }
    }, {
      name: 'carport',
      path: 'carport',
      component: _import_('carManage/carVisitor/index'),
      meta: {
        title: '访客车辆',
        icon: 'icon-renxiangcheliangshouquan',
        bg_color: '#bf5d76'
      }
    },
      //  {
      //   name: 'carport',
      //   path: 'carport',
      //   component: _import_('carportManage/index'),
      //   meta: {
      //     title: '车辆管理 - 车位管理',
      //     icon: 'monitor'
      //   }
      // }
    ]
  }, {
    path: '/device',
    name: 'device',
    component: Layout,
    redirect: '/device/_manage',
    alwaysShow: true,
    meta: {
      title: '设备管理',
      icon: 'icon-shexiangtou1',
      bg_color: '#7f7dae',
    },
    children: [{
      name: '_manage',
      path: '_manage',
      component: _import_('deviceManage/index'),
      meta: {
        title: '设备管理',
        icon: 'icon-shebei',
        bg_color: '#231d75'
      }
    },
      // {
      //   name: 'fault',
      //   path: 'fault',
      //   component: _import_('deviceFault/index'),
      //   meta: {
      //     title: '设备管理 - 设备故障',
      //     icon: 'monitor'
      //   }
      // }
    ]
  },
  {
    path: '/inform',
    name: 'inform',
    component: Layout,
    redirect: '/inform/issue',
    alwaysShow: true,
    meta: {
      title: '通知管理',
      icon: 'icon-tongzhi',
      bg_color: '#664b5e',
    },
    children: [{
      name: 'issue',
      path: 'issue',
      component: _import_('informIssue/index'),
      meta: {
        title: '通知发布',
        icon: 'icon-tongzhi',
        bg_color: '#231d75'
      }
    }]
  },
  {
    path: '/alarm',
    name: 'alarm',
    component: Layout,
    redirect: '/alarm/module',
    alwaysShow: true,
    meta: {
      title: '告警管理',
      icon: 'icon-gaojing',
      bg_color: '#e6504f',
    },
    children: [{
      name: 'module',
      path: 'module',
      component: _import_('alarmManage/index'),
      meta: {
        title: '告警管理',
        icon: 'icon-gaojing',
        bg_color: '#e6504f'
      }
    }]
  },
  {
    path: '/system',
    name: 'system',
    component: Layout,
    redirect: '/system/manager',
    alwaysShow: true,
    meta: {
      title: '系统设置',
      icon: 'icon-ziyuan',
      bg_color: '#e17f5a',
    },
    children: [{
      name: 'manager',
      path: 'manager',
      component: _import_('roleManage/manager/index'),
      meta: {
        title: '管理员',
        icon: 'icon-guanliyuan',
        bg_color: '#e17f5a'
      }
    },
    {
      name: 'rolePower',
      path: 'rolePower',
      component: _import_('roleManage/rolePower/index'),
      meta: {
        title: '角色权限',
        bg_color: '#7f7dae',
        icon: 'icon-quanxian'
      }
    }, {
      name: 'community',
      path: 'community',
      component: _import_('roleManage/community/index'),
      meta: {
        title: '小区信息',
        bg_color: '#009bba',
        icon: 'icon-xiaoqu'
      }
    },
    {
      name: 'warningLink',
      path: 'warningLink',
      component: _import_('roleManage/warningLink/index'),
      meta: {
        title: '预警联系人',
        bg_color: '#e6504f',
        icon: 'icon-yujinglianxiren'
      }
    }, {
      name: 'argumentsStall',
      path: 'argumentsStall',
      component: _import_('roleManage/argumentsStall/index'),
      meta: {
        title: '系统参数',
        bg_color: '#56b849',
        icon: 'icon-canshu'
      }
    }]
  },
  {
    path: '/vistor',
    name: 'vistor',
    component: Layout,
    redirect: '/vistor/register',
    alwaysShow: true,
    meta: {
      title: '访客登记',
      icon: 'icon-fangkeshuxing',
      bg_color: '#798384',
    },
    children: [{
      name: 'register',
      path: 'register',
      component: _import_('vistor/register/index'),
      meta: {
        title: '访客登记',
        icon: 'icon-fangkeshuxing',
        bg_color: '#bf5d76',
      }
    },
    {
      name: 'record',
      path: 'record',
      component: _import_('vistor/record/index'),
      meta: {
        title: '访客登记记录',
        icon: 'icon-jilu',
        bg_color: '#796273',
        hidden: true
      }
    }]
  },
  {
    path: '/statementManage',
    name: 'statementManage',
    component: Layout,
    redirect: '/statementManage/info',
    alwaysShow: true,
    meta: {
      title: '报表管理',
      icon: 'icon-chart',
      bg_color: '#798384',
    },
    children: [{
      name: 'info',
      path: 'info',
      component: _import_('statementManage/index'),
      meta: {
        title: '报表管理',
        bg_color: '#bf5d76',
        icon: 'icon-icon-p_mrpbaobiao'
      }
    },
    {
      name: 'personPassChart',
      path: 'personPassChart',
      component: _import_('statementManage/components/personPassChart'),
      meta: {
        title: '人员通行统计',
        bg_color: '#bf4325',
        icon: 'icon-renyuanbiandongfenxi'
      }
    },
    {
      name: 'carPassChart',
      path: 'carPassChart',
      component: _import_('statementManage/components/carPassChart'),
      meta: {
        title: '车辆通行统计',
        bg_color: '#bf5ae3',
        icon: 'icon-cheliangshenqing'
      }
    },
    {
      name: 'visitorCarChart',
      path: 'visitorCarChart',
      component: _import_('statementManage/components/vistorCarChart'),
      meta: {
        title: '访客车辆统计',
        bg_color: '#657cae',
        icon: 'icon-cheliangdangan'
      }
    },
    {
      name: 'visitorChart',
      path: 'visitorChart',
      component: _import_('statementManage/components/vistorChart'),
      meta: {
        title: '访客通行统计',
        bg_color: '#b67ec1',
        icon: 'icon-fangkeshuxing'
      }
    }
    ]
  },
  {
    path: '/screen',
    name: 'screen',
    component: Layout,
    redirect: '/screen/statistics',
    alwaysShow: true,
    meta: {
      title: '大屏统计',
      icon: 'icon-tongji',
      bg_color: '#DF788D',
    },
    children: [
      {
        name: 'statistics',
        path: 'statistics',
        component: _import_('screenStatistics/index'),
        meta: {
          title: '数据统计',
          icon: 'icon-loudong',
          bg_color: '#e17f5a'
        }
      }
    ]
  },
  //---------------------------
  // {
  //   path: '/pass',
  //   name: 'pass',
  //   component: Layout,
  //   redirect: '/pass/management',
  //   alwaysShow: true,
  //   meta: {
  //     title: '通行管理',
  //     icon: 'icon-tongxing',
  //     bg_color: '#55b949',
  //   },
  //   children: [{
  //     name: 'management',
  //     path: 'management',
  //     component: _import_('personPass/index'),
  //     meta: {
  //       title: '人员通行管理',
  //       icon: 'monitor'
  //     }
  //   }]
  // },
  // {
  //   path: '/studentTeacherFile',
  //   name: 'studentTeacherFile',
  //   component: Layout,
  //   redirect: '/studentTeacherFile/data',
  //   alwaysShow: true,
  //   meta: {
  //     title: '师生档案',
  //     icon: 'icon-dangan',
  //     bg_color: '#009bba',
  //   },
  //   children: [{
  //     name: 'data',
  //     path: 'data',
  //     component: _import_('studentTeacherFile/index'),
  //     meta: {
  //       title: '师生档案管理',
  //       icon: 'monitor'
  //     }
  //   }]
  // },
  // {
  //   path: '/importantPeople',
  //   name: 'importantPeople',
  //   component: Layout,
  //   redirect: '/importantPeople/info',
  //   alwaysShow: true,
  //   meta: {
  //     title: '重点人员',
  //     icon: 'icon-zhongdian',
  //     bg_color: '#798384',
  //   },
  //   children: [{
  //     name: 'info',
  //     path: 'info',
  //     component: _import_('importantPeople/index'),
  //     meta: {
  //       title: '重点人员',
  //       icon: 'monitor'
  //     }
  //   }]
  // },
  // {
  //   path: '/subscription',
  //   name: 'subscription',
  //   component: Layout,
  //   redirect: '/subscription/subscriber',
  //   alwaysShow: true,
  //   meta: {
  //     title: '订阅报警服务',
  //     icon: 'icon-baojing',
  //     bg_color: '#bf5d76',
  //   },
  //   children: [{
  //     name: 'subscriber',
  //     path: 'subscriber',
  //     component: _import_('subscriberManage/index'),
  //     meta: {
  //       title: '订阅人管理',
  //       icon: 'monitor'
  //     }
  //   }]
  // }, {
  //   path: '/schoolhouse',
  //   name: 'schoolhouse',
  //   component: Layout,
  //   redirect: '/schoolhouse/library',
  //   alwaysShow: true,
  //   meta: {
  //     title: '校舍管理',
  //     icon: 'icon-xuexiaoqingkuang',
  //     bg_color: '#e17f5a',
  //   },
  //   children: [{
  //     name: 'library',
  //     path: 'library',
  //     component: _import_('schoolhouse/libraryManage/index'),
  //     meta: {
  //       title: '图书馆管理',
  //       icon: 'monitor'
  //     }
  //   }, {
  //     name: 'classroom',
  //     path: 'classroom',
  //     component: _import_('schoolhouse/classroomManage/index'),
  //     meta: {
  //       title: '教学楼管理',
  //       icon: 'monitor'
  //     }
  //   }, {
  //     name: 'office',
  //     path: 'office',
  //     component: _import_('schoolhouse/officeManage/index'),
  //     meta: {
  //       title: '办公室管理',
  //       icon: 'monitor'
  //     }
  //   }, {
  //     name: 'canteen',
  //     path: 'canteen',
  //     component: _import_('schoolhouse/canteenManage/index'),
  //     meta: {
  //       title: '食堂管理',
  //       icon: 'monitor'
  //     }
  //   }]
  // },
]

export default new Router({
  // mode: 'history',
  routes: constantRouterMap
  // scrollBehavior: () => ({
  //   y: 0
  // }),
})

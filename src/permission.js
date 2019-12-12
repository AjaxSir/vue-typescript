import router from './router'
import store from './store/index.ts'
import { getToken, removeToken} from '@/utils/auth'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式

const whiteList = ['/login'] // 不重定向白名单

function hasPermission(roles, permissionRoles) {
  if (!permissionRoles) return true
  return roles.some(role => permissionRoles.indexOf(role) >= 0)
}

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      // if (!store.getters.role) {
      //   store.dispatch('GetInfo').then(res => {
      //     let userType = res.data.type
      //     store.dispatch('GenerateRoutes', {
      //       userType
      //     }).then(() => {
      //       router.addRoutes(store.getters.addRouters)
      //       next({ ...to
      //       })
      //     })
      //   }).catch(() => {
      //     removeToken()
      //     next({
      //       path: '/'
      //     })
      //   })
      // }else {
      //   if (hasPermission(store.getters.role, to.meta.role)) {
      //     next()
      //   } else {
      //     next({
      //       path: '/401',
      //       query: {
      //         noGoBack: true
      //       }
      //     })
          NProgress.done()
      //   }
      // }
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})

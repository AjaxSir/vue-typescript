import state from "./state";
import { ActionTree } from "vuex";
import stateType from './type';
import { getRoleList } from '@/api/user.ts'

function selectRoute(route: Array<object>, role: Array<string>) {
  const Route = [...route]
  const newRoute:Array<object> = Route.filter(ele => {
    let arr: Array<object> = []
    ele['children'].forEach((item: object) => {
      if (role.includes(item['name'] + 'Look')) {
        arr.push(item)
      }
    })
    ele['children'] = arr
    return ele['children'].length > 0
  })

  return newRoute
}

const action: ActionTree<stateType, any> = {
  SET_NAME({ commit, state: stateType }, name: string) {
    commit('SET_NAME', name)
  },

  SET_TOKEN({ commit, state: stateType }, token: string) {
    commit('SET_TOKEN', token)
  },
  SET_PERMISSIONLIST({ commit, state: stateType }, list: Array<object>) {
    return new Promise((resolve, reject) => {
      getRoleList().then((res: any) => {
        commit('SET_PERMISSIONLIST', res.data.data)
        resolve(res)
      })
    })
  },
  SELECT_ROUTE({ commit, state: stateType }, obj: object) {
    return new Promise((res, rej) => {
      const router = selectRoute(obj['route'], obj['role'])
      commit('SET_ROUTE', router)
      res(router)
    })
  }
}
export default action;

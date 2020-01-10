import stateType from "./type";
import state from "./state";
import { MutationTree } from "vuex";
import { setToken, setName, setPermission } from '@/utils/auth'

const mutation: MutationTree<stateType> = {
  SET_TOKEN: (state, token: string) => {
    state.token = token
    setToken(token)
  },

  SET_NAME(state: stateType, name: string) {
    state.name = name
    setName(name)
  },
  SET_PERMISSIONLIST(state: stateType, list: Array<object>) {
    state.permissionList = list
    setPermission(list.join('---'))
  },
  SET_ROUTE(state: stateType, router: Array<object>) {
    state.router = router
  },
  SET_TOTAL(state: stateType, total:number) {
    state.total = total
  }
}
export default mutation;

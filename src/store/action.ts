import state from "./state";
import { ActionTree } from "vuex";
import stateType from './type';
import { login } from '@/api/user.ts'

const action: ActionTree<stateType, any> = {
  SET_NAME({ commit, state: stateType }, name: string) {
    commit('SET_NAME', name)
  },

  SET_TOKEN({ commit, state: stateType }, token: string) {
    commit('SET_TOKEN', token)
  },
}
export default action;

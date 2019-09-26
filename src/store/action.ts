import state from "./state";
import { ActionTree } from "vuex";
import stateType from './type';
const action:ActionTree<stateType, any> = {
    SET_NAME({ commit, state:stateType }, name: string) {
        commit('SET_NAME', name)
    }
}
export default action;
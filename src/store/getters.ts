import { GetterTree } from "vuex";
import stateType from "./type";
import state from "./state";
const getters:GetterTree<stateType, any> = {
    name: (state: stateType) => state.name,
    token: (state: stateType) => state.token,
}
export default getters;
import { GetterTree } from "vuex";
import stateType from "./type";
import state from "./state";

const getters:GetterTree<stateType, any> = {
    name: (state: stateType) => state.name,
    total: (state: stateType) => state.total,
    token: (state: stateType) => state.token,
    permissionList: (state: stateType) => state.permissionList,
    router: (state: stateType) => state.router,
}
export default getters;

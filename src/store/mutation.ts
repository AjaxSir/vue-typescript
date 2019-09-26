import stateType from "./type";
import state from "./state";
import { MutationTree } from "vuex";
const mutation: MutationTree<stateType> = {
    SET_NAME(state:stateType, name:string) {
        state.name = name
    }
}
export default mutation;
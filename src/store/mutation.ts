import stateType from "./type";
import state from "./state";
import { MutationTree } from "vuex";
import { setToken, setName } from '@/utils/auth'

const mutation: MutationTree<stateType> = {
  SET_TOKEN: (state, token: string) => {
    state.token = token
    setToken(token)
  },

  SET_NAME(state: stateType, name: string) {
    state.name = name
    setName(name)
  }
}
export default mutation;

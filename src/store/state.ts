import stateType from "./type";
import { getToken, getName } from '@/utils/auth'

const state: stateType = {
  name: getName(),
  token: getToken()
}
export default state

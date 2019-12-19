import stateType from "./type";
import { getToken, getName, getPermission } from '@/utils/auth'
const state: stateType = {
  name: getName(),
  token: getToken(),
  permissionList: [],
  router: []
}
export default state

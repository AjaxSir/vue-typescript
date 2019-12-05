// export default url
import _axios from "../plugins/axios";

export function login(data: Object) {
  return _axios({
    url: '/open/admin/login',
    method: 'post',
    data
  })
}


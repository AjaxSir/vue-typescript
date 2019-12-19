// export default url
import _axios from "../plugins/axios";

export function login(data: Object) {
  return _axios({
    url: '/open/admin/login',
    method: 'post',
    data
  })
}

// 获取用户权限
export function getRoleList() {
  return _axios({
    url: '/admin/usr-user-role-link',
    method: 'get'
  })
}

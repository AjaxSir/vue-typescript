import _axios from "../plugins/axios";
/****** 管理员 ***** */
// 添加/修改管理员
export function addManager(data: object) {
  return _axios({
    url: '/admin/usrUser/admin',
    method: data['id'] ? 'put' : 'post',
    data
  })
}
// 管理员的禁用与恢复
export function manageStatus(status: string, id: object) {
  return _axios({
    url: status === '0' ? '/admin/usrUser/admin/reset' : '/admin/usrUser/admin/disable',
    method: 'put',
    params: {
      id
    }
  })
}
// 管理员的重置密码
export function resetPassword(params: Object) {
  return _axios({
    url: '/admin/usrUser/admin/changePassWord',
    method: 'put',
    params
  })
}
/********* 获取角色列表 *********** */
export function getRoleList(name: string | null) {
  return _axios({
    url: '/admin/usrRole/list',
    method: 'get',
    params: {
      name
    }
  })
}

 // 新建角色
 export function addRole(data: object) {
   return _axios({
     url: '/admin/usrRole',
     method: 'post',
     data
   })
 }

 // 修改角色
 export function updateRole(data: object) {
   return _axios({
     url: '/admin/usrRole',
     method: 'put',
     data
   })
 }
// 新建角色
export function addRole(data: object) {
  return _axios({
    url: '/admin/usrRole',
    method: 'post',
    data
  })
}


// 获取预警联系人列表
export function deleteWarning(id: any) {
  return _axios({
    url: `/admin/usr-early-contact/${id}/`,
    method: 'delete',
  })
}

// 获取分组
export function getGroup() {
  return _axios({
    url: '/admin/usr-early-group',
    method: 'get',
  })
}

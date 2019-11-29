import _axios from "../plugins/axios";
/***** 物业/用户 禁用恢复 ****** */
export function resetDisabledUser(status: string, id: string) {
  return _axios({
    url: status === '1' ? '/admin/usrUser/reset' : '/admin/usrUser/disable',
    method:'put',
    params: {
      id
    }
  })
}

// 查看用户和物业人员的通行记录
export function getUserPropertyPass(params: object) {
  return _axios({
    url: '/admin/people-pass/user',
    method: 'get',
    params
  })
}

//****住户相关****** */
// 添加住户
export function addPeople(data: Object) {
  return _axios({
    url: '/admin/usrUser',
    method: 'post',
    data
  })
}
// 修改用户电话
export function updateUserPhone(id: string, phone: string) {
  return _axios({
    url: '/admin/usrUser/updatePhone',
    method: 'put',
    params: {
      id, phone
    }
  })
}

// 修改用户备注
export function updateUserNote(id: string, note: string) {
  return _axios({
    url: '/admin/usrUser/updateNote',
    method: 'put',
    params: {
      id, note
    }
  })
}


//获取目标人员通行记录 || 访客通行记录
export function getTargrtRecord(params: object) {
  return _axios({
    url: '/admin/people-pass/by-visit-id/',
    method: 'get',
    params
  })
}

/********* 物业人员 *********** */
// 新增物业人员
export function addPropert(data: object) {
  return _axios({
    url: '/admin/usrUser/propertyManager',
    method: 'post',
    data
  })
}

// 查看物业人员
export function watchPropert(id:string) {
  return _axios({
    url: '/admin/usrUser/PropertyManager',
    method: 'get',
    params: {
      id
    }
  })
}

/********** 获取权限组 ************/
export function getRoleGroup(name: string | null) {
  return _axios({
    url: '/admin/devAuthorities/list',
    method: 'get',
    params: {
      name
    }
  })
}

// 创建权限组
export function addRoleGroup(data: object) {
  return _axios({
    url: '/admin/devAuthorities',
    method: 'post',
    data
  })
}

// 删除权限组
export function deleteRoleGroup(id:string) {
  return _axios({
    url: '/admin/devAuthorities',
    method: 'delete',
    params: {
      id
    }
  })
}

// 修改全选组信息
export function updateRoleGroup(data: object) {
  return _axios({
    url: '/admin/devAuthorities',
    method: 'put',
    data
  })
}

// 通过id获取权限组信息
export function getGroupInfoById(id: string){
  return _axios({
    url: '/admin/devAuthorities',
    method: 'get',
    params: {
      id
    }
  })
}


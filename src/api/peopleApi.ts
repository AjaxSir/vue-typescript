import _axios from "../plugins/axios";
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

//
export function getUserPass(params: object) {
  return _axios({
    url: '/admin/people-pass/',
    method: 'get',
    params
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
export function deleteRoleGroup(id: string) {
  return _axios({
    url: '/admin/devAuthorities',
    method: 'delete',
    params: {
      id
    }
  })
}

/********* 关注人员 *********** */

// 创建关注人员
export function addFocusPeople(data: object) {
  return _axios({
    url: '/admin/usr-focus-personnel/',
    method: 'post',
    data
  })
}

//修改关注人员
export function editFocusPeople(data: Object) {
  return _axios({
    url: `/admin/usr-focus-personnel/${data['id']}/`,
    method: 'patch',
    data
  })
}

// 删除关注人员
export function deleteFocusPeople(id: string) {
  return _axios({
    url: `/admin/usr-focus-personnel/${id}/`,
    method: 'delete'
  })
}

// 获取关注人员类别
export function getType() {
  return _axios({
    url: '/admin/usr-focus-personnel-type/',
    method: 'get',
  })
}

//新增关注人员类别
export function addType(data: Object) {
  return _axios({
    url: '/admin/usr-focus-personnel-type/',
    method: 'post',
    data
  })
}

//删除关注人员类别
export function deleteType(id: any) {
  return _axios({
    url: `/admin/usr-focus-personnel-type/${id}/`,
    method: 'delete'
  })
}

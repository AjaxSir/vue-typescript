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


//获取目标人员通行记录 || 访客通行记录
export function getTargrtRecord(params) {
  return _axios({
    url: '/admin/people-pass/by-visit-id/',
    method: 'get',
    params
  })
}

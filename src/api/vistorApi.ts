import _axios from "./../plugins/axios";

// 获取注册设备
export function regDevice() {
  return _axios({
    url: '/admin/dev-manage/get-reg-dev/',
    method: 'get',
  })
}

// 获取注册信息
export function getRegData(devId) {
  return _axios({
    url: `/admin/usr-visitor-reg/${devId}/current/`,
    method: 'get',
  })
}

//模糊查询人名
export function getUserName(params) {
  return _axios({
    url: '/admin/scence-user/like-by-name/',
    method: 'get',
    params
  })
}

//获取指定房屋
export function getTargetHouse(params) {
  return _axios({
    url: '/admin/usrHouseLink/by-user-scence-id/',
    method: 'get',
    params
  })
}

//注册访客
export function addVisitor(data, devId) {
  return _axios({
    url: `/admin/usr-visitor-reg/${devId}/confirm/`,
    method: 'post',
    data
  })
}


//取消注册
export function cancelVisitor(devId) {
  return _axios({
    url: `/admin/usr-visitor-reg/${devId}/cancel/`,
    method: 'delete'
  })
}

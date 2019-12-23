import _axios from "../plugins/axios";

// 首页获取车辆通行记录
export function carPassList() {
  return _axios({
    url: '/admin/car-pass',
    method: 'get',
    params: {
      limit: 5,
      page: 1
    }
  })
}
//车辆用户查询
export function queryCarPhone(phone) {
  return _axios({
    url: '/admin/scence-user/like-by-phone/',
    method: 'get',
    params: {
      phone
    }
  })
}

//单个添加或批量添加接口
export function addCar(data) {
  return _axios({
    url: '/admin/usr-car/batch-add/',
    method: 'post',
    data
  })
}

//修改车辆
export function editCar(data) {
  return _axios({
    url: '/admin/usr-car',
    method: 'put',
    data
  })
}

//获取目标车辆通行记录
export function getTargrtRecord(params) {
  return _axios({
    url: '/admin/car-pass/',
    method: 'get',
    params
  })
}


//获取目标车辆用户详细信息 || 获取目标访客车辆邀请人的详细信息
export function getTargetUser(id) {
  return _axios({
    url: '/admin/scence-user/',
    method: 'get',
    params: {
      id
    }
  })
}


// 通过id获取用户/物业的车辆信息
export function getUserPropertyCar(id: string) {
  return _axios({
    url: '/admin/usr-car/byUserId',
    method: 'get',
    params: {
      id
    }
  })
}

export function getvisitUser(id: string) {
  return _axios({
    url: '/admin/usr-visit-car/get-one/',
    method: 'get',
    params: {
      id
    }
  })
}

export function getOwnerUser(id: string) {
  return _axios({
    url: '/admin/scence-user',
    method: 'get',
    params: {
      id
    }
  })
}

export function getCarRecord(id: string) {
  return _axios({
    url: '/admin/usr-car/get-one',
    method: 'get',
    params: {
      id
    }
  })
}


/*******左侧房屋接口*********/
// 获取左侧树形结构房屋列表
export function getHouseTreeData() {
  return _axios({
    url: '/admin/car-space-group',
    method: 'get'
  })
}

// 左侧树形结构添加分组
export function addHouseGroup(data: Object) {
  return _axios({
    url: '/admin/car-space-group/batch-create',
    method: 'post',
    data
  })
}

// 左侧树形结构删除分组
export function deleteHouseGroup(id: string) {
  return _axios({
    url: `/admin/car-space-group/${id}/`,
    method: 'delete',
  })
}

import _axios from "../plugins/axios";

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

//单个新增或批量新增接口
export function addCar(data) {
  return _axios({
    url: '/admin/usr-car/batch-add/',
    method: 'post',
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


//获取目标车辆用户详细信息
export function getTargetUser(id) {
  return _axios({
    url: '/admin/scence-user/',
    method: 'get',
    params: {
      id
    }
  })
}


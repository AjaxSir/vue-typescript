import _axios from "../plugins/axios";

// 车辆名单列表
export function carList(data) {
  return _axios({
    url: '/admin/usr-car/',
    method: 'get',
    params: {
      ...data
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

//单个新增或批量新增接口
export function addCar(data) {
  return _axios({
    url: '/admin/usr-car/batch-add/',
    method: 'post',
    data
  })
}

import _axios from "../plugins/axios";

// 首页获取场景信息
export function getSceneInfo() {
  return _axios({
    url: '/admin/hs-scence',
    method: 'get'
  })
}

export function getScene() {
  return _axios({
    url: '/admin/hs-scence/info/',
    method: 'get'
  })
}

//小区图片上传
export function deleteImg(id: any) {
  return _axios({
    url: `/admin/hs-scence/picture/${id}`,
    method: 'delete'
  })
}

//小区修改
export function editCommunity(data: any) {
  return _axios({
    url: '/admin/hs-scence/info/',
    method: 'post',
    data
  })
}

// 人员通信记录统计
export function getPassListChart(params: object) {
  return _axios({
    url: '/admin/count-report/report',
    method: 'get',
    params
  })
}

// 车辆通行记录
export function getCarPassListChart(params: object) {
  return _axios({
    url: '/admin/car-pass/report',
    method: 'get',
    params
  })
}

// 获取访客车辆通行统计
export function getVistorCarList(params: object) {
  return _axios({
    url: '/admin/car-pass/report',
    method: 'get',
    params
  })
}

// /admin/count-report/orderVisitor 访客排序  /admin/count-report/orderBeVisited被访人排序
export function vistorSort(params: object) {
  return _axios({
    url: '/admin/count-report/orderVisitor',
    method: 'get',
    params
  })
}

export function vistoredSort(params: object) {
  return _axios({
    url: '/admin/count-report/orderBeVisited',
    method: 'get',
    params
  })
}

// 首页车辆通行记录

export function carPassList() {
  return _axios({
    url: '/admin/car-pass/homeOrderVisitCar',
    method: 'get',
    params: {
      limit: 5
    }
  })
}

// 首页人员通行记录
export function peoplePassList() {
  return _axios({
    url: '/admin/people-pass/homeList',
    method: 'get',
    params: {
      limit: 5
    }
  })
}

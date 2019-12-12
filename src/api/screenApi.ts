import _axios from "../plugins/axios";

// 首页获取场景信息
export function getSceneInfo() {
  return _axios({
    url: '/admin/hs-scence',
    method: 'get'
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

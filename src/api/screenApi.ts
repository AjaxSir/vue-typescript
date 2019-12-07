import _axios from "../plugins/axios";

// 首页获取场景信息
export function getSceneInfo() {
  return _axios({
    url: '/admin/hs-scence/info/',
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

import _axios from "../plugins/axios";

// 首页获取场景信息
export function getSceneInfo() {
  return _axios({
    url: '/admin/hs-scence',
    method: 'get'
  })
}

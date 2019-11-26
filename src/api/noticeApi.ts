import _axios from "../plugins/axios";

//通知发布
export function postMessage(data) {
  return _axios({
    url: '/admin/hs-notice/',
    method: 'post',
    data
  })
}

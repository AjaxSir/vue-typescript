import _axios from "../plugins/axios";
// 通行记录
export function passList() {
  return _axios({
    url: '/admin/people-pass/',
    method: 'get',
    params: {
      limit: 10,
      offset: 0
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

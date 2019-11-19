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

import _axios from "../plugins/axios";

//修改告警管理
export function editStall(data: any) {
  return _axios({
    url: `/admin/car-space/${data.id}/`,
    method: 'patch',
    data
  })
}

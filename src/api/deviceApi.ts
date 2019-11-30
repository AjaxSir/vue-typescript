import _axios from "../plugins/axios";

// 绑定设备
export function createDevice(data: object) {
  return _axios({
    url: '/admin/dev-manage/bind',
    method: 'post',
    data
  })
}

// 获取设备列表
export function getDeviceList(params: object){
  return _axios({
    url: '/admin/dev-manage/page-query',
    method: 'get',
    params
  })
}

import _axios from "../plugins/axios";

// 创建设备
export function createDevice(data: object) {
  return _axios({
    url: '/admin/dev-manage',
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

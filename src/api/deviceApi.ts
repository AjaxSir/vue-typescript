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

// 通过编号查询设备类型
export function checkdeviceByNum(serialNum: string) {
  return _axios({
    url: '/admin/dev-manage/query-type',
    method: 'get',
    params: {
      serialNum
    }
  })
}

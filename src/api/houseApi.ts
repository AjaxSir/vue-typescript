import _axios from "../plugins/axios";
/*******左侧房屋接口*********/
// 获取左侧树形结构房屋列表
export function getHouseTreeData() {
  return _axios({
    url: '/admin/buildingGroup',
    method: 'get'
  })
}
// 左侧树形结构添加分组
export function addHouseGroup(data: Object) {
  return _axios({
    url: '/admin/buildingGroup',
    method: 'post',
    data
  })
}
// 左侧树形结构删除分组
export function deleteHouseGroup(id: string) {
  return _axios({
    url: '/admin/buildingGroup',
    method: 'delete',
    params: {
      id
    }
  })
}
// 左侧树形结构修改分组
export function updateHouseGroup(data: Object) {
  return _axios({
    url: '/admin/buildingGroup',
    method: 'put',
    data
  })
}

/*******门禁卡管理*********/
// 获取门禁卡列表
// export function doorCardList（） {}

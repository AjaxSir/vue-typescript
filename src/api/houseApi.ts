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
// 门禁卡启用与禁用
export function changeCardStstus(status: string, id: string) {
  return _axios({
    url: status === '-2' ? '/admin/hsDoorCard/limit' : '/admin/hsDoorCard/recover',
    method: 'put',
    params: {
      id
    }
  })
}
// 创建门禁卡
export function createCard(form: object) {
  return _axios({
    url: '/admin/hsDoorCard',
    method: 'post',
    data: {
      ...form
    }
  })
}
// 门禁卡过期时间修改
export function cardvalidDateChange(params: object) {
  return _axios({
    url: '/admin/hsDoorCard/changeValidDate',
    method: 'put',
    params
  })
}
// 获取指定门禁卡的同行记录
export function theCardPassList(params: object) {
  return _axios({
    url: '/admin/people-pass/card',
    method: 'get',
    params: {
      ...params,
      limit: 10
    }
  })
}
//***********房屋管理********** */
// 通过关键字查询房屋列表 搜索建议框
export function searchSuggestHouse(keys: string) {
  return _axios({
    url: '/admin/hsHouse/byKey',
    method: 'get',
    params: {
      keys
    }
  })
}

//***********房屋管理********** */
// 通过关键字查询单元楼名字
export function searchHouse() {
  return _axios({
    url: '/admin/hsBuilding/query-building-name',
    method: 'get',
  })
}

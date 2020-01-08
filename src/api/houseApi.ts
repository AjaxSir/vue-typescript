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

// 创建单元楼
export function addBuilding(data: object) {
  return _axios({
    url: '/admin/hsBuilding',
    method: 'post',
    data
  })
}

// 修改单元楼
export function updateBuilding(data: object) {
  return _axios({
    url: '/admin/hsBuilding',
    method: 'put',
    data
  })
}

// 删除单元楼
export function deleteBuilding(id: string) {
  return _axios({
    url: '/admin/hsBuilding',
    method: 'delete',
    params: {
      id
    }
  })
}

// 获取单元楼单位
export function getUnitList(type: string = 'group') {
  return _axios({
    url: '/admin/unit',
    method: 'get',
    params: {
      type
    }
  })
}

// 增加单元楼单位
export function addUnit(name: string, type: string) {
  return _axios({
    url: '/admin/unit',
    method: 'post',
    data: {
      name,
      type
    }
  })
}

// 删除单元楼单位
export function deleteUnit(id: string) {
  return _axios({
    url: '/admin/unit',
    method: 'delete',
    params: {
      id
    }
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
// 获取对应房屋下的门禁卡信息
export function getCardListByHouseId(houseId: string) {
  return _axios({
    url: '/admin/hsDoorCard/houseId',
    method: 'get',
    params: {
      houseId
    }
  })
}

// 删除门禁卡
export function deleteDoorCard(Arr: Array<string>) {
  return _axios({
    url: '/admin/hsDoorCard',
    method: 'delete',
    data: {
      ids: Arr
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
// 添加房屋
export function addHouse(data: object) {
  return _axios({
    url: '/admin/hsHouse',
    method: 'post',
    data
  })
}
// 修改房屋状态/备注
export function updateStatusNote(data: object) {
  return _axios({
    url: '/admin/hsHouse',
    method: 'put',
    data
  })
}
// 获取当前场景下的单元楼
export function searchHouse() {
  return _axios({
    url: '/admin/hsBuilding/query-building-name',
    method: 'get',
  })
}
// 获取当前场景下出入口
export function getInoutList() {
  return _axios({
    url: '/admin/hs-enter-exit',
    method: 'get'
  })
}
// 添加出入口
export function creatPassageway(data: object) {
  return _axios({
    url: '/admin/hs-enter-exit',
    method: 'post',
    data
  })
}

//修改出入口
export function editPassageway(data: object) {
  return _axios({
    url: '/admin/hs-enter-exit',
    method: 'put',
    data
  })
}


// 获取特定房屋下的注册人员
export function getRegisterPeople(houseId: string) {
  return _axios({
    url: '/admin/usrHouseLink',
    method: 'get',
    params: {
      houseId
    }
  })
}


// 根据房屋id查询房屋信息(已删除的也能查出来)
export function getRegisterHouse(params:object) {
  return _axios({
    url: '/admin/hsHouse/by-id',
    method: 'get',
    params
  })
}

// 删除特定房屋下的某个注册人员
export function deleteTheHousePeople(houseId: string, userId: string,scenceUserId:string) {
  return _axios({
    url: '/admin/usrHouseLink',
    method: 'delete',
    params: {
      houseId,
      userId,
      scenceUserId
    }
  })
}

// 通过用户id获取房屋列表信息
export function getHouseListByUserId(userId: string) {
  return _axios({
    url: '/admin/hsHouse/byUserId',
    method: 'get',
    params: {
      userId
    }
  })
}

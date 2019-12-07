<!--
  数据页面对应左边的树形结构
  TreeData: 传入的数据
-->
<template>
  <div class="content tree-rename">
    <div @click='handleNodeClick({ type: "building", id: "" })' class="treeHeader">
      <i class="iconfont icon-shuji"></i>
      所有
      <el-dropdown v-if='type === "house"' class='dropdownAll' @command='commandTreeClick' placement="bottom-start">
        <i class="iconfont icon-menu"></i>
        <el-dropdown-menu  slot="dropdown">
          <el-dropdown-item :command='commandObj("addGroup", {})'>添加子分组</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown v-else class='dropdownAll' @command='commandTreeClick' placement="bottom-start">
        <i class="iconfont icon-menu"></i>
        <el-dropdown-menu  slot="dropdown">
          <el-dropdown-item :command='commandObj("addRoleGroup", {})'>创建权限组</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-tree
      :data="TreeData"
      node-key="id"
      :props='dataFormate'
      accordion
      :default-expand-all='false'
      :expand-on-click-node="false"
      @node-click="handleNodeClick"
    >
      <span
        class="custom-tree-node"
        slot-scope="{ node }"
        @mouseenter="MouseNnter(node.id)"
        @mouseleave="MouseLeave(node.id)"
      >
        <span>{{ node.label }} <i v-show='selectId === node.data.id' class="el-icon-check"></i> </span>
        <div>
          <el-dropdown @command='commandTreeClick' placement="bottom-start">
            <i v-show="node.id===showMenu" class="iconfont icon-menu"></i>
            <el-dropdown-menu v-if='type === "house"' slot="dropdown">
              <el-dropdown-item v-if='node.data.type === "group"' :command='commandObj("addGroup", node)'>添加子分组</el-dropdown-item>
              <el-dropdown-item v-if='node.data.type === "group"' :command='commandObj("addBuilding", node)'>添加单元楼</el-dropdown-item>
              <el-dropdown-item v-if='node.data.type === "group"' :command='commandObj("updateGroup", node)'>修改分组</el-dropdown-item>
              <el-dropdown-item v-if='node.data.type === "group"' :command='commandObj("deleteGroup", node)'>删除分组</el-dropdown-item>
              <el-dropdown-item v-if='node.data.type === "building"' :command='commandObj("updateBuilding", node)'>修改单元楼</el-dropdown-item>
              <el-dropdown-item v-if='node.data.type === "building"' :command='commandObj("deleteBuilding", node)'>删除单元楼</el-dropdown-item>
            </el-dropdown-menu>
            <el-dropdown-menu v-if='type === "role"' slot="dropdown">

              <el-dropdown-item :command='commandObj("updateRoleGroup", node)'>修改</el-dropdown-item>
              <el-dropdown-item :command='commandObj("deleteRoleGroup", node)'>删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </span>
    </el-tree>
    <!-- 楼栋dialog添加分组 -->
    <el-dialog  :close-on-click-modal='false' width="500px" class='formDialog' :title="HouseForm.title" :visible.sync="HouseVisible">
      <el-tabs v-model="activeName" type="card">
      <el-tab-pane v-if='nodeAction !== "updateGroup"' label="批量添加" name="first">
        <el-form  ref='batchForm' :rules='batchRules' :model="batchForm" label-width="80px">
          <el-form-item prop='min' label="编号:">
            <el-input style="width:100px" placeholder="开始编号" v-model="batchForm.min"></el-input>
              至
            <el-input prop='max' placeholder="结束编号"  style="width:100px" v-model="batchForm.max"></el-input>
          </el-form-item>
          <el-form-item label="序号单位:" prop='serialNumberUnit' label-width="85px">
            <el-select v-model="batchForm.serialNumberUnit" placeholder="请选择">
              <el-option
                v-for="item in Tags"
                :key="item.name"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
            <el-button @click='showUnitSetting = !showUnitSetting' type='text'>序号单元设置</el-button>
            <div v-if='showUnitSetting'>
              <el-tag
              style="margin-left:5px"
                :key="index"
                v-for="(tag, index) in Tags"
                closable
                :disable-transitions="false"
                @close="deleteTag(tag, index)">
                {{tag.name}}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="newTag"
                v-model="newTagValue"
                ref="saveTagInput"
                size="small"
                @blur="handleInputConfirm"
              >
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">新增单位</el-button>
            </div>
          </el-form-item>
          <el-form-item label="备注:" prop='note' label-width="85px">
            <el-input type='textarea' v-model="batchForm.note" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="手动添加" name="second">
        <el-form ref='HouseForm' :rules='HouseRules' :model="HouseForm">
        <el-form-item label="序号:" prop='serialNumber' label-width="85px">
          <el-input v-model="HouseForm.serialNumber" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="序号单位:" prop='serialNumberUnit' label-width="85px">
          <el-select v-model="HouseForm.serialNumberUnit" placeholder="请选择">
            <el-option
              v-for="item in Tags"
              :key="item.name"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
          <el-button @click='showUnitSetting = !showUnitSetting' type='text'>序号单元设置</el-button>
            <div v-if='showUnitSetting'>
              <el-tag
              style="margin-left:5px"
                :key="index"
                v-for="(tag, index) in Tags"
                closable
                :disable-transitions="false"
                @close="deleteTag(tag, index)">
                {{tag.name}}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="newTag"
                v-model="newTagValue"
                ref="saveTagInput"
                size="small"
                @blur="handleInputConfirm"
              >
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">新增单位</el-button>
            </div>
        </el-form-item>
        <el-form-item label="别名:" prop='name' label-width="85px">
          <el-input v-model="HouseForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注:" prop='note' label-width="85px">
          <el-input v-model="HouseForm.note" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="GroupAction">确 定</el-button>
        <el-button @click="closeDialog(['batchForm', 'HouseForm'])">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 楼栋dialog添加单元楼 -->
    <el-dialog :close-on-click-modal='false' width="500px"  class='formDialog' title="添加单元楼" :visible.sync="HouseUnitVisible">
      <el-form  ref='buildings' :rules="unitRules" :model="UnitForm">
         <el-form-item label="名称:" prop='name' label-width="85px">
          <el-input v-model="UnitForm.name" autocomplete="off"></el-input>
          <!-- <el-input style='width:50px' v-model="UnitForm.max" autocomplete="off"></el-input> -->
        </el-form-item>
        <el-form-item v-if='!this.UnitForm.id' label="序号:" prop='serialNumber' label-width="85px">
          <el-input v-model="UnitForm.serialNumber" autocomplete="off"></el-input>
          <!-- <el-input style='width:50px' v-model="UnitForm.max" autocomplete="off"></el-input> -->
        </el-form-item>
        <el-form-item v-if='!this.UnitForm.id' label="序号单元:" prop='serialNumberUnit' label-width="85px">
          <el-select v-model="UnitForm.serialNumberUnit" placeholder="请选择">
            <el-option
              v-for="item in Tags"
              :key="item.name"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>

        </el-form-item>
        <el-form-item label="楼层数:" prop='storeyNum' label-width="85px">
          <el-input v-model="UnitForm.storeyNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="每层户数:" prop='houseNum' label-width="85px">
          <el-input v-model="UnitForm.houseNum" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addUpdateUnitConfim">确 定</el-button>
        <el-button @click="closeDialog(['buildings'])">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 权限dialog -->
    <el-dialog :before-close="roleHandClose" :close-on-click-modal='false' width="800px" :title="RoleForm.id ? '修改权限组' : '新建权限组'" :visible.sync="RoleVisible">
      <el-form :rules="RoleRules" style="overflow:hidden" ref='roleForm' :model="RoleForm">
        <el-form-item prop='name' label="权限名称:" label-width="85px">
          <el-input v-model="RoleForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop='enableInviteCar' style="float:left;width:350px" label="邀请车辆:" label-width="85px">
          <el-switch
            v-model="RoleForm.enableInviteCar"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="1"
            inactive-value="0">
          </el-switch>
        </el-form-item>
        <el-form-item prop='enableInviteVisitor' style="float:left;width:350px" label="邀请访客:" label-width="85px">
          <el-switch
            v-model="RoleForm.enableInviteVisitor"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="1"
            inactive-value="0">
          </el-switch>
        </el-form-item>
      </el-form>
      <div class="bindDevice">
      <span style="float:left">设备权限</span>
      <el-button style="float:right" type='primary' @click='bindDeviceListVisible = true, fetchDeviceList(1)'>绑定设备</el-button>
      </div>
      <el-table
        :data="bindDeviceList"
        style="width: 100%">
        <el-table-column
          type='index'
          align='center'
          prop="date"
          label="序号"
          width="50">
        </el-table-column>
        <el-table-column
          align='center'
          label="位置">
          <template slot-scope="{row}">
            <span>{{row.address || row.position}}</span>
          </template>
        </el-table-column>
        <el-table-column
          align='center'
          width="350"
          label="时间">
          <template slot-scope="{row}">
            <span v-if='!row.timeStatus' class="rowUpdate" @click='timeUpdateStatus(row)' >{{row.startTime}}-{{row.endTime}}</span>
            <div v-else>
              <el-time-select
              :clearable='false'
                style="width:120px"
                v-model="startTime"
                :picker-options="{
                  start: '00:30',
                  step: '00:30',
                  end: '23:30'
                }"
                @blur="confirmEndTime(row)"
                placeholder="开始时间">
              </el-time-select>
              -
              <el-time-select
              :clearable='false'
              style="width:120px"
                v-model="endTime"
                @change='confirmEndTime(row)'
                :picker-options="{
                  start: startTime,
                  step: '00:30',
                  end: '23:30'
                }"
                placeholder="结束时间">
              </el-time-select>
            </div>
            </template>
        </el-table-column>
        <el-table-column
          align='center'
          label="操作">
          <template slot-scope="scope">
            <el-button type='text' @click='bildDeviceSplice(scope.$index)' >移除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleHandClose">取 消</el-button>
        <el-button type="primary" @click="RoleAddConfim">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 设备列表 -->
    <el-dialog
    :close-on-click-modal='false' width="800px" title="设备列表" :visible.sync="bindDeviceListVisible">
      <el-table :data="DeviceList"
      @selection-change="handleSelectionChange">
        <el-table-column type='selection' width="50"></el-table-column>
        <el-table-column type='index' label="序号" align='center' width="50"></el-table-column>
        <el-table-column property="name" align='center' label="位置" >
          <template slot-scope="{row}">
            <span>{{row.address || row.position}}</span>
          </template>
        </el-table-column>
        <el-table-column align='center' property="name" label="设备名称"></el-table-column>
        <el-table-column align='center' property="serialNumber" label="设备编号"></el-table-column>
      </el-table>
      <el-pagination
        background
        @current-change='fetchDeviceList'
        layout="prev, pager, next"
        :total="devicePage.total">
      </el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button @click="bindDeviceListVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveBindDevicelist">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins, Emit } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import { addHouseGroup, deleteHouseGroup, updateHouseGroup,
getUnitList, addUnit, deleteUnit,
addBuilding, updateBuilding, deleteBuilding } from '@/api/houseApi.ts'
import { getDeviceList } from '@/api/deviceApi.ts'
import { addRoleGroup, getGroupInfoById, updateRoleGroup, deleteRoleGroup } from '@/api/peopleApi.ts'
import { Message } from 'element-ui';
@Component
export default class DataTree extends Vue {
  private showMenu: Number = 0;
  @Prop({ default: 'house' }) type: string;
  @Prop({default: () => {
    return [] // 必须是函数式返回
  } }) TreeData: Array<Object>
  // private data: Array<Object> =
  @Prop({ default: () => {
    return {
      children: 'sonBuildGroups',
      label: 'name',
      key:'id'
    }
  }}) dataFormate: Object
  @Prop({ default: true }) needAction: any;
  @Prop({ default:()=> { return {} } }) initFormHeader: object
  @Prop({ default:()=> { return {} } }) page: object
  selectId: any =  ''
  nodeAction: string = '' // 记录执行的操作
  bindDeviceList: Array<object> = [] // 已选择绑定的设备列表
  bindDeviceListVisible: boolean = false // 设备列表弹框状态
  DeviceList: Array<object> = [] // 所有设备列表
  devicePage: object = {
    page: 1,
    total: 1
  }
  batchForm: object = {
    serialNumber: '', // 序号
    serialNumberUnit: '',
    name: '',
    note: '',
    min: '',
    max: '',
    parentId: '',
    title: '添加子分组'
  } // 批量添加表单
  activeName: string = 'first'
  startTime: string = '18:00'
  endTime: string = '21:00' // 权限修改时间
  unConfirmDeviceList: Array<object> = [] // 以勾选的设备
  // 分组校验规则
  HouseRules: Object = {
    name: [
            { required: true, message: '请输入别名', trigger: 'blur' }
          ],
    serialNumber: [
            { required: true, message: '请输入序号', trigger: 'blur' }
          ]
  }
  unitRules: object = {
    name: [
            { required: true, message: '请输入单元楼名称', trigger: 'blur' }
          ],
    serialNumber: [
            { required: true, message: '请输入序号', trigger: 'blur' }
          ],
    storeyNum: [
            { required: true, message: '请输入每层户数', trigger: 'blur' }
          ],
    houseNum: [
            { required: true, message: '请输入楼层数', trigger: 'blur' }
          ],
    serialNumberUnit: [
            { required: true, message: '请选择楼单位', trigger: 'change', type: 'string' }
          ]
  }
  batchRules: object = {
    min: [
            { required: true, message: '请输入开始编号', trigger: 'blur' }
          ],
    max: [
            { required: true, message: '请输入结束编号', trigger: 'blur' }
          ],
  }
  // 新增分组表单
  HouseForm: object = {
    serialNumber: '', // 序号
    serialNumberUnit: '',
    name: '',
    note: '',
    parentId: '',
    title: '添加子分组'
  }
  // 楼栋表单
  UnitForm: object = {
    buildingGroupId: '',
    name: '', // 名称
    serialNumber: '', // 编号
    serialNumberUnit: '', // 序号单元
    storeyNum: '', // 楼层数
    houseNum: '' // 每层户数
  }
  // 楼栋dialog添加分组状态
  HouseVisible:boolean = false
   // 楼栋dialog添加楼栋状态
  HouseUnitVisible:boolean = false
  // 权限表单
  RoleForm: object = {
    devAuthoritiesDevice: [],
    enableInviteCar: '1',
    enableInviteVisitor: '1',
    name: ''
  }
  RoleRules: object = {
    name: [
            { required: true, message: '请输入权限组名称', trigger: 'blur' }
          ]
  }
  // 查看已有单元设置状态
  showUnitSetting: boolean = false
    // 单位序号设置 数组
  Tags: Array<object> = []
  // 新增序号单元input框状态
  newTag: boolean = false
  // 新增单元的值
  newTagValue: string = ''
  // 权限dialog状态
  RoleVisible:boolean = false
  created() {
    this.fetchDeviceList(1)
    this.fetchUnitList()
  }
  // 获取设备列表
  fetchDeviceList(page: number) {
    getDeviceList({ page, limit: 10 }).then(res => {
      this.DeviceList = res.data.data.records
      this.devicePage['total'] = res.data.data.total
    })
  }
  // 关闭弹框
  closeDialog(arr:Array<string>) {
    this.$nextTick(() => {
      arr.forEach(ele => {
        this.$refs[ele]['resetFields']()
      })
    })
    this.batchForm['max'] = ''
    this.HouseUnitVisible = false
    this.HouseVisible = false
  }
  // 将已选中的设备保存
  handleSelectionChange(val){
    this.unConfirmDeviceList = val
  }
  // 移除已选设备
  bildDeviceSplice(index) {
    this.bindDeviceList.splice(index, 1)
  }
  // 时间改变状态
  timeUpdateStatus(row){
    row.timeStatus = !row.timeStatus
    this.startTime = row.startTime
    this.endTime = row.endTime
  }
  // 确定对应设备的时间
  confirmEndTime(row) {
    row.startTime = this.startTime
    row.endTime = this.endTime
    this.startTime = '18:00'
    this.endTime = '21:00' // 权限修改时间
    row.timeStatus = false
  }
  // 确定新增权限
  RoleAddConfim() {
    this.$refs['roleForm']["validate"](valid => {
      if(valid) {
        this.RoleForm['devAuthoritiesDevice'] = this.bindDeviceList
        if(!this.RoleForm['devAuthoritiesDevice'].length) {
          return this.$message.error('请添加权限组的设备')
        }
        if (!this.RoleForm['id']) {
          addRoleGroup(this.RoleForm).then(res => {
            if(res.data.code === 200) {
              this.$message.success('新增权限组成功')
              this.$emit('fetchRoleGroup')
              this.roleHandClose()
            }
          })
        } else {
          updateRoleGroup(this.RoleForm).then(res => {
            if(res.data.code === 200) {
              this.$message.success('修改权限组成功')
              this.$emit('fetchRoleGroup')
              this.roleHandClose()
            }
          })
        }
      }
    })
  }
  // 新增/修改权限组关闭弹框
  roleHandClose() {
    this.RoleForm['devAuthoritiesDevice'] = []
    this.bindDeviceList = []
    this.$refs['roleForm']['resetFields']()
    this.RoleVisible = false
  }
  // 保存到绑定设备 并验证是否已经存在 已存在不加入
  saveBindDevicelist() {
    const strDevice = JSON.stringify(this.bindDeviceList)

    this.unConfirmDeviceList.forEach(ele => {
      if(strDevice.indexOf(ele['serialNumber']) === -1) {
        ele['startTime'] = '18:00'
        ele['endTime'] = '21:00'
        ele['deviceId'] = ele['id']
        this.$set(ele, 'timeStatus', false)
        this.bindDeviceList.push(ele)
      }
    })
    this.bindDeviceListVisible = false
  }
  // 确定新增/修改单元楼
  addUpdateUnitConfim() {
    this.$refs['buildings']["validate"](valid => {
      if (valid) {
        if (!this.UnitForm['id']) {
          addBuilding(this.UnitForm).then(res => {
            if(res.data.code === 200) {
              this.$message.success('新增成功')
              this.HouseUnitVisible = false
              this.$emit('getHouseTreeData')
            }
          })
        } else {
          updateBuilding(this.UnitForm).then(res => {
            if(res.data.code === 200) {
              this.$message.success('新增成功')
              this.HouseUnitVisible = false
              this.$emit('getHouseTreeData')
            }
          })
        }
      }
    })

  }
  // 获取单元楼单位列表
  fetchUnitList(){
    getUnitList().then(res => {
      this.Tags = res.data.data
      this.HouseForm['serialNumberUnit'] = this.Tags[0]['name']
      this.batchForm['serialNumberUnit'] = this.Tags[0]['name']
    })
  }
  /** 新增或修改分组信息 */
  async GroupAction() {
    if (this.activeName === 'second') {
      if (this.nodeAction === 'addGroup') {
        addHouseGroup(this.HouseForm).then(res => {
          if (res.data.code === 200) {
            this.closeDialog(['batchForm', 'HouseForm'])
            Message({
              type: 'success',
              message: '新增成功'
            })
            this.$emit('getHouseTreeData')
            this.HouseVisible = false
          }
        })
      } else if (this.nodeAction === 'updateGroup') {
        updateHouseGroup(this.HouseForm).then(res => {
          if (res.data.code === 200) {
            this.closeDialog(['batchForm', 'HouseForm'])
            Message({
              type: 'success',
              message: '修改成功'
            })
            this.$emit('getHouseTreeData')
            this.HouseVisible = false
          }
        })
      }
    } else {
      const reg = /^[0-9]+$/
      if(!reg.test(this.batchForm['min']) && !reg.test(this.batchForm['max'])) {
        return this.$message.error('请输入正整数!')
      } else if (Number(this.batchForm['min']) > Number(this.batchForm['max'])) {
        return this.$message.error('请确保序号由小到大!')
      } else {
        this.sortCreated().then(res => {
          this.$message.success(`创建${res.success}个成功,${res.error}个失败`)
          this.$refs['batchForm']['resetFields']()
          this.$emit('getHouseTreeData')
            this.HouseVisible = false
        })
      }
    }
  }
  // 循环创建
  async sortCreated() {
    let success = 0
      let error = 0
        for(var i = Number(this.batchForm['min']); i<=Number(this.batchForm['max']); i++ ) {
          this.batchForm['serialNumber'] = i
          this.batchForm['name'] = i + this.batchForm['serialNumberUnit']
           await addHouseGroup(this.batchForm).then(res => {
            if (res.data.code === 200) {
              success++
            } else {
              error++
            }
          })

        }
        return Promise.resolve({ success, error })
  }
  // 关闭新增/修改单元楼
  closeBuildingAction() {
    this.$refs['buildings']['resetFields']()
    this.HouseUnitVisible = false
  }
  @Emit("fetchData")
  handleNodeClick(data) {
    /**@description 树节点点击事件 */
    if(this.type === "house") {
      if(data.type === 'group') {
        this.selectId = data.id
        this.initFormHeader["params"]['buildingId'] = ''
        this.initFormHeader["params"]['groupId'] = data.id
          this['page']["page"] = 1;
          this.initFormHeader["params"] = Object.assign(
            this.initFormHeader["params"],
            this.page
          );
          return this.initFormHeader;
      } else {
        this.selectId = data.id
        this.initFormHeader["params"]['buildingId'] = data.id
        this.initFormHeader["params"]['groupId'] = ''
          this['page']["page"] = 1;
          this.initFormHeader["params"] = Object.assign(
            this.initFormHeader["params"],
            this.page
          );
          return this.initFormHeader;
      }
    } else {
       this['page']["page"] = 1;
       this.initFormHeader["params"]['authId'] = data.id
          this.initFormHeader["params"] = Object.assign(
            this.initFormHeader["params"],
            this.page
          );
          return this.initFormHeader;
    }
  }
  /*** 删除序号单元 */
  deleteTag(tag, index) {
    deleteUnit(tag.id).then(res =>{
      if (res.data.code === 200) {
        this.fetchUnitList()
      }
    })
  }
  /**显示更多操作图标 */
  MouseNnter(val) {
    this.showMenu = val;
  }
  /*** 新增单元序号 */
  handleInputConfirm() {
    this.newTag = false
    addUnit(this.newTagValue).then(res => {
      if(res.data.code === 200) {
        this.fetchUnitList()
        this.newTagValue = ''
      }
    })
  }
  /*** 显示新增序号单元框*/
  showInput() {
    this.newTag = true
  }
  MouseLeave(val) {
    this.showMenu = 0;
  }
  /**
   * action 分类
   */
  commandTreeClick(treeData) {
    this.nodeAction = treeData.action
    console.log(treeData)
    switch (treeData.action) {
      case 'addGroup' :
        this.HouseForm['title'] = '添加子分组'
        this.HouseForm['parentId'] = treeData.data ? treeData.data.id : ''
        this.batchForm['parentId'] = treeData.data ? treeData.data.id : ''
        this.HouseVisible = true
        this.activeName = 'first'
        break
      case 'deleteGroup' :
        this.$confirm('此操作将永久删除该目标, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteHouseGroup(treeData.data.id).then((res: any) => {
            if (res.data.code === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.$emit('getHouseTreeData')
              this.HouseVisible = false
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
        break
      case 'addBuilding' :
        this.UnitForm['buildingGroupId'] = treeData.data.id
        this.HouseUnitVisible = true
        break
      case 'updateGroup':
        this.activeName = 'second'
        this.HouseVisible = true
        this.HouseForm['title'] = '修改子分组'
        this.HouseForm = Object.assign(this.HouseForm, treeData.data)
        break
      case 'updateBuilding':
        this.HouseUnitVisible = true
        this.UnitForm = Object.assign(this.UnitForm, treeData.data)
        break
      case 'addRoleGroup':
        this.RoleVisible = true
        break
      case 'updateRoleGroup':
        getGroupInfoById(treeData.data.id).then(res => {
          if (res.data.code === 200) {
            this.RoleForm = Object.assign({}, res.data.data)
            this.bindDeviceList = res.data.data.devAuthoritiesDevice
          } else {
            this.$message.error('获取全选组信息失败')
          }
        })
        this.RoleVisible = true
        break
      case 'deleteRoleGroup' :
        this.$confirm('此操作将永久删除该权限组, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteRoleGroup(treeData.data.id).then((res: any) => {
            if (res.data.code === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.$emit('fetchRoleGroup')
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
        break
      case 'deleteBuilding' :
        this.$confirm('此操作将永久删除该单元楼, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteBuilding(treeData.data.id).then((res: any) => {
            if (res.data.code === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.$emit('getHouseTreeData')
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
        break
    }
  }
  /**
   *  返回执行的操作及id
   */
  commandObj(action, node) {
    return {
      action,
      ...node
    }
  }
}
</script>

<style>
/* .el-tree-node__content {
  position: relative;
} */
/* .el-tree-node__content:hover {
  color: #409eff;
  font-weight: bold;
} */
</style>

<style lang="scss" scoped>
.content {
  width: 100%;
  height: 70vh;
  text-align: left;
  border: 1px solid #ebeef5;
  overflow-y: auto;
}
.treeHeader {
  &:hover{
    cursor: pointer;
  }
  width: 100%;
  height: 40px;
  text-align: left;
  text-indent: 1em;
  line-height: 40px;
  position:relative;
  i {
    font-size: 20px;
  }
  .icon-menu{
    display: none;

  }
  .dropdownAll{
    width:10px;
    height: 10px;
    position:absolute;
    right: 30px;
    top: 0px;
  }
  &:hover .icon-menu{
    display:block;
  }
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.formDialog{
  .input{
    width:220px;
  }
}
.input-new-tag{
  width:120px;
}
.bindDevice{
  height: 60px;
  line-height: 40px;
  overflow: hidden;
  padding: 10px 0px;
}
</style>

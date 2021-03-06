<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <ActionHeader
        :initFormHeader='initForm'
        @fetchData='fetchData'
        :filterForm='filterForm'
        ref="actionHeader"
        :dialogCreate.sync="dialogCreate" :total="page.total">
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <div @click='showExportIn'>
                导入
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
          <div slot="houseNum">
            <div class="word-filter">
              <span class="filter-name">姓&nbsp;&nbsp;&nbsp;名:</span>
              <el-input clearable  
              @keyup.enter.native="emitFetchData"  class="input-filter" placeholder="输入需要查找的姓名" v-model="filterForm.name" size="small"></el-input>
            </div>
            <div class="word-filter">
              <span class="filter-name">手机号:</span>
              <el-input clearable  
              @keyup.enter.native="emitFetchData" class="input-filter"  placeholder="输入需要查找的手机号"  v-model="filterForm.phone" size="small"></el-input>
            </div>
          </div>
        </ActionHeader>
      </el-col>
    </el-row>
    <div class="components-container">
      <split-pane split="vertical"   @resize="resize" :min-percent="10" :default-percent="rowSpan">
        <template slot="paneL">
          <div class="leftContent">
            <DataTree
              @fetchData='fetchData'
              :page='page'
              :initFormHeader='initForm'
              @fetchRoleGroup='fetchRoleGroup'
              :TreeData='TreeData' :type='"role"' />
          </div>
        </template>
        <template slot="paneR">
          <div class="rightContent">
            <el-table :data="list_data"
            stripe
            border
            v-loading='showLoading'
            height="65vh"
            @selection-change="handleSelectionChange"
            @cell-mouse-enter="enterRowChange"
            @cell-mouse-leave="leaveRowChange"
            >
            <el-table-column v-if='globalUpdateStatus' type="selection" align="center"></el-table-column>
            <el-table-column type="index" width="60" align="center" class="indexNum" label="编号">
              <template slot-scope="scope">
                <span>{{ scope.$index + 1 }}</span>
                <div v-if='globalUpdateStatus' class="fun-btn">
                  <el-dropdown trigger="click" placement="bottom-start" @command='commandClick'>
                    <el-tooltip class="item" effect="dark" content="点击操作" placement="top">
                      <i v-show="scope.row.showMenu" class="iconfont icon-menu"></i>
                    </el-tooltip>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item :command="returnCommand('delete', scope.row)">
                        {{ deleteForm.data.length ? '批量删除' : '删除' }}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="name" width="120" :show-overflow-tooltip='true' align="center" label="姓名">
              <template slot-scope="{row}">
                <el-button type="text" @click="showDetail(row)">{{row.name }}</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="birthday" :show-overflow-tooltip='true' width="120" align="center" label="出生日期"></el-table-column>
            <el-table-column prop="sex" width="120" align="center" label="性别">
              <template slot-scope="{row}">
               <span>{{ row.sex === '1' ? '男' : row.sex === '0' ? '女' : '' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="cardName" :show-overflow-tooltip='true' align="center" label="证件类型"></el-table-column>
            <el-table-column prop="cardNo" :show-overflow-tooltip='true' align="center" label="证件号"></el-table-column>
            <el-table-column prop="phone" align="center" label="联系电话">
              <template slot-scope="{row}">
                <span class="rowUpdate"
                v-show='!row.phoneStatus'
                @click='phoneChange(row)'>{{ row.phone }}</span>
                <el-input
                :clearable="true"
                v-show='row.phoneStatus'
                @blur="confirmUpdatePhone(row)"
                :ref='"name" + row.id'
                v-model="phoneString"
                placeholder="输入电话"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="authName" width="120" align="center" label="权限组">
              <template slot-scope="{row}">
                <el-dropdown @command="changeGroupRole"
                trigger="click">
                  <span class="el-dropdown-link">
                    <el-tag
                    size="small"
                    type='info'
                    style="border-radius: 50px;padding: 0 10px; cursor: pointer;color:#606266"
                    >{{ row.authName }}
                    </el-tag>
                  </span>
                  <el-dropdown-menu  slot="dropdown">
                    <el-dropdown-item v-for='(item, index) in TreeData'
                    :key='index' :command='ComponentCommand(item.id, row.id)'>{{ item.name }}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
            <el-table-column prop="status" width="120" align="center" label="状态">
              <template slot-scope="{row}">
                <el-dropdown @command="changeStatus"
                trigger="click">
                  <span class="el-dropdown-link">
                    <el-tag
                    size="small"
                    :type="row.status === '0' ? 'primary' : 'danger'"
                    style="border-radius: 50px;padding: 0 10px; cursor: pointer;"
                    >{{ row.status === '0' ? '正常' : '禁用' }}
                    </el-tag>
                  </span>
                  <el-dropdown-menu  slot="dropdown">
                    <el-dropdown-item :command='ComponentCommand("1", row.id)'>正常</el-dropdown-item>
                    <el-dropdown-item :command='ComponentCommand("0", row.id)'>禁用</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
            <el-table-column align='center' :show-overflow-tooltip='true' prop="note" label="备注">
              <template slot-scope="scope">
              <span class="rowUpdate"
              v-show='!scope.row.noteStatus'
              @click='focusNoteInput(scope.row)'>{{ scope.row.note || '--' }}</span>
              <el-input
              :clearable="true"
              :ref='scope.row.id'
              @blur="confirmUpdateNote(scope.row)"
              v-model="noteString"
              v-show='scope.row.noteStatus'
              placeholder="输入备注">
              </el-input>
              </template>
            </el-table-column>
            <el-table-column width="200" :show-overflow-tooltip='true' prop="createTime" align="center" label="创建时间"></el-table-column>
          </el-table>
          <el-pagination
          @current-change='pageChange'
          :current-page="page.page"
          :page-size="page.limit"
          style="margin-top:10px;" background layout="prev, pager, next" :total="page.total"></el-pagination>
        <div style="z-index:9;" :class="rowSpan===12 ? menuControl1 : menuControl2" @click="menuVisible">
              <p class="close-menu">
                <i v-if="rowSpan===12" class="iconfont icon-left icon-class"></i>
                <i v-else class="iconfont icon-zuo icon-class"></i>
              </p>
            </div>
        </div>
        </template>
      </split-pane>
    </div>
    <el-dialog :close-on-click-modal='false' width="650px" :title="Dialog.name" :visible.sync="dialogFormVisible">
      <el-tabs v-model="activeName" type='card'>
        <el-tab-pane label="详细信息" name="first">
          <div class="singleInfo"><span class="right">姓名: </span>&nbsp;&nbsp;{{ Dialog.name }}</div>
          <div class="singleInfo"><span class="right">性别: </span>&nbsp;&nbsp;
          <span>{{ Dialog.sex === '1' ? '男' : Dialog.sex === '0' ? '女' : '' }}</span>
          </div>
          <div class="singleInfo"><span class="right">出生日期: </span>&nbsp;&nbsp;{{ Dialog.birthday || '' }}</div>
          <div class="singleInfo"><span class="right">身份证号: </span>&nbsp;&nbsp;{{ Dialog.cardNo }}</div>
          <div class="singleInfo"><span class="right">年龄: </span>&nbsp;&nbsp;{{ Dialog.age }}</div>
          <div class="singleInfo"><span class="right">手机号: </span>&nbsp;&nbsp;{{ Dialog.phone }}</div>
          <div class="singleInfo"><span class="right">权限组: </span>&nbsp;&nbsp;{{ Dialog.auth && Dialog.auth.name || '' }}</div>
        </el-tab-pane>
        <el-tab-pane label="通行记录" name="second">
           <el-table
            :data="passListData"
            style="width: 100%">
            <el-table-column prop="name" align='center' label="姓名" width="100px"></el-table-column>
            <el-table-column prop="passTime" :show-overflow-tooltip='true' align='center' label="通行时间" width="150px"></el-table-column>
            <el-table-column prop="inOut" align='center' label="进/出" width="80px"></el-table-column>
            <el-table-column prop="passMethod" align='center' label="通行方式">
              <template slot-scope="{row}">
                <span>{{ row.passMethod | passMethod }}</span>
              </template>
            </el-table-column>
            <el-table-column align='center' label="抓拍图片">
              <template slot-scope="{row}">
                <img v-if='row.photos' :src="row.photos" alt="">
                <span v-else></span>
                </template>

            </el-table-column>
          </el-table>
          <el-pagination
        @current-change='pagePassChange'
        style="margin-top:10px;" background layout="prev, pager, next" :total="passList.total"></el-pagination>
        </el-tab-pane>
        <el-tab-pane label="车辆信息" name="third">
          <el-table
            :data="carList"
            style="width: 100%">
            <el-table-column
              prop="carNo"
              align='center'
              label="车牌号">
            </el-table-column>
            <el-table-column
              prop="carType"
              align='center'
              label="车辆类型">
            </el-table-column>
            <el-table-column
              prop="modal"
              align='center'
              label="型号">
            </el-table-column>
            <el-table-column
              align='center'
              label="照片">
              <template slot-scope="{row}">
                <img v-if='row.photo' :src="row.photo" alt="">
                <span v-else></span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :close-on-click-modal='false' title="添加物业人员" :visible.sync="dialogCreate" width="580px" :before-close="handleClose">
      <el-form :model="Form" :rules="FormRules" ref='Forms' label-width="85px">
        <el-form-item class="float"  label="姓名:"  prop='name'>
          <el-input  clearable v-model="Form.name" maxlength="10" placeholder='输入物业人员姓名'></el-input>
        </el-form-item>
        <el-form-item   class="float" label="出生日期:"  prop='birthday'>
          <el-date-picker
          style='width:168px'
            v-model="Form.birthday"
            type="date"
            format='yyyy - MM - dd'
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
          <!-- <el-input  clearable v-model="Form.age"  maxlength="3" @input='constraintLength(Form.age, "3")' placeholder='输入物业人员年龄'></el-input> -->
        </el-form-item>
        <el-form-item  class="float" style="height:40px;" label="电话:"  prop='phone'>
          <el-input
                class="phone-position"
                v-model="Form.phone"
                style="height: 40px"
                placeholder="输入物业人员电话"
                :maxlength="11"
                clearable
                @keyup.native="UpNumber"
                @keydown.native="UpNumber"
                @change="clearableBtn"
                @input="hint"
                @focus="hintFocus"
                @blur="hintBlur"
                @mouseover.native="hint(Form.phone)"
                @mouseout.native="hint(Form.phone)"
              ></el-input>
              <!-- <span v-show="hintPhone" class="ei-input-hint">{{phoneNum}}/11</span> -->
        </el-form-item>
        <el-form-item  class="float"  label="性别:"  prop='sex'>

          <el-select style="position: relative;left: -6px;width:170px;height:40px" class="input-filter" size="small" v-model="Form.sex" placeholder="请选择">
                <el-option label="请选择" value=""></el-option>
                <el-option label="男" value="1"></el-option>
                <el-option label="女" value="0"></el-option>
              </el-select>
        </el-form-item>
        <el-form-item label="权限组:" class="float"  label-width="85px" prop='authId'>
          <el-select style='width:165px; height:40px' v-model="Form.authId" placeholder="请选择">
            <el-option
              v-for="item in TreeData"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="float" label="证件类型:"  label-width="85px"  prop='otherCardName'>
              <el-select @change="Form.cardNo = '',Form.cardName = ''" style="position: relative;left: -6px;width:165px" class="input-filter" size="small" v-model="Form.otherCardName" placeholder="请选择证件类型">
                <el-option label="身份证" value="身份证"></el-option>
                <el-option label="护照" value="护照"></el-option>
                <el-option label="港澳居民来往内地通行证" value="港澳居民来往内地通行证"></el-option>
                <el-option label="其它" value="其它"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-show="Form.otherCardName === '其它'"  label="证件名称:"  prop='cardName'>
          <el-input maxlength="10" style="width:424px" v-model="Form.cardName" clearable placeholder='输入证件名称'></el-input>
        </el-form-item>

        <el-form-item   style="clear:both" label="证件号:"  label-width="85px"  prop='cardNo'>
              <el-input style="width:420px" :maxlength="Form.otherCardName === '身份证' ? '18' : '20'"  clearable  v-model="Form.cardNo" :placeholder='"输入证件号"'></el-input>
            </el-form-item>

        <el-form-item label="备注:" style="clear:both"   prop='note'>
          <el-input style="width:424px" type='textarea'  maxlength="11" @input="constraintLength(Form.note,'200')" v-model="Form.note" placeholder='输入备注'></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="confirmAddPropert">确 定</el-button>
      </span>
    </el-dialog>
    <ExportIn
    :uploadUrl="env === 'production' ? 'http://47.103.184.184/admin/usrUser/PropertyManager/import' : '/v1/admin/usrUser/PropertyManager/import'"
    downTemplateUrl='/admin/usrUser/PropertyManager/model'
    TmplateName='物业人员导入模板.xlsx'
    @closeVisible='closeVisible'
    @successUpload='fetchData(initForm)'
    :visible.sync='visible' />
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import { getRoleGroup, addPropert, resetDisabledUser, watchPropert,
getUserPropertyPass, changeRoleGroup, updateUserNote, updateUserPhone } from '@/api/peopleApi.ts'
import { getUserPropertyCar } from '@/api/carApi.ts'
import mixin from "@/config/minxins";
const ActionHeader = () => import("@/components/ActionHeader.vue");
const DataTree = () => import("@/components/DataTree.vue");
const ExportIn = () => import("@/components/exportIn/index.vue");
import splitPane from "vue-splitpane";

@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    DataTree,
    ExportIn,
    splitPane
  },
  filters: {
    passMethod(val: string) {
      const data = {
        "1": '人脸开门',
        "2": '二维码开门',
        "3": '蓝牙开门',
        "4": '远程开门',
        "5": '密码开门',
        "6": '刷卡开门'
      }
      return data[val]
    }
  }
})
export default class PropertyManage extends Vue {
  private activeName: string = "first";
  private dialogFormVisible: boolean = false;
  private title: string = "详情";
  private rowSpan: number = 12;
  env: string =  process.env.NODE_ENV
  private menuControl1: String = "menu-control";
  private menuControl2: String = "menu-visible";
  passListData: Array<object> = [] // 物业人员通行记录
  carList: Array<object> = [] // 物业人员车辆信息
  noteString: string = '' // 备注信息
  Form: object = {
    name: '',
    phone: '',
    age: '',
    note: '',
    sex: '',
    authId: '',
    birthday: '',
    cardNo: '',
    cardName: '',
    otherCardName: '身份证'
  }
   pickerOptions: object = {
        disabledDate(time) {
        return time.getTime() > Date.now() - 8.64e7;
      }
    }
  initForm: object = {
    url: '/admin/usrUser/PropertyManager/list',
    method: 'get'
  }
  filterForm: object = {
    name: '',
    phone: ''
  }
  deleteForm: object = {
    url: '/admin/usrUser/propertyManager',
    method: 'delete',
    data: [],
    message: '此操作将永久删除选中的物业人员,删除后物业人员将不存在,请谨慎操作!'
  }
  passList: object = {
    id: '',
    page: 1,
    limit: 10,
    total:1
  }
  visible: boolean = false // 导入框状态
  phoneString:string = '' // 手机号
  updateArray: Array<string> = ['noteStatus', 'phoneStatus'] //需要行内修改的
  TreeData: Array<object> = [] // 权限组
  FormRules: object = {
    name: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ],
          // sex: [
          //   { required: true, message: '请选择性别', trigger: 'change' }
          // ],
    cardName: [
      { required: true, message: '请选择证件', trigger: 'change' }
    ],
    birthday: [
      { required: true, message: '请选择出生年月', trigger: 'change' }
    ],
    phone: [
            { required: true, trigger: 'blur', validator: (rule, value, callback) => {
                if (value.length !== 11 || !(/^1[123456789]\d{9}$/).test(value)) {
                  callback(new Error('填写正确的手机号'))
                } else {
                  callback()
                }
              } }
          ],
    authId: [
            { required: true, message: '请选择对应的权限组', trigger: 'change' },

          ],
    cardNo: [
      { required: true, trigger: 'blur', validator: (rule, value, callback) => {
                if (!(value.length === 15 || value.length === 18) && this.Form['otherCardName'] === '身份证') {
                  callback(new Error('填写正确的证件号号'))
                } else {
                  callback()
                }
              } }
    ]
  }
  Dialog: object = {
    name: ''  // 物业人员详细记录
  };
  closeVisible(flag: boolean) {
    this.visible = flag
  }
  showExportIn() {
    this.visible = true
  }
  menuVisible() {
    /**@description 控制楼栋 */
    if (this.rowSpan === 0) {
      this.rowSpan = 12;
    } else {
      this.rowSpan = 0;
    }
  }
  resize() {}
  // 改变物业人员权限组
  changeGroupRole(Obj: object) {
    changeRoleGroup(Obj['Status'], Obj['id']).then(res => {
      if(res.data.code === 200){
        this['message']('success', '设置成功')
        this['fetchData'](this.initForm)
      }
    })
  }
  // 修改备注自动获取焦点
  focusNoteInput(row) {
    this.noteString = row.note
    row.noteStatus = !row.noteStatus
    this.$nextTick(() =>{
      const input = this.$refs[row.id] as HTMLElement
      input.focus()
    })
  }
  // 确定修改 电话
  confirmUpdatePhone(row) {
    if (!/^1[123456789]\d{9}$/.test(this.phoneString)) {
      this['message']('error', '请输入正确的手机格式')
      this.$set(row, 'phoneStatus', false)
      return;
    }
    this.$confirm(`此操作将修改${row.name}的手机号,请谨慎操作!`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {

            updateUserPhone(row.id, this.phoneString).then(res => {
              if (res.data.code === 200) {
                this['message']('success', '修改成功')
                row.phoneStatus = false;
                this.phoneString = "";
                this.fetchData(this.initForm);
              } else {
                this['message']('error', res.data.message)
              }
            });
          })
          .catch(() => {
            this.$set(row, 'phoneStatus', false)
            this['message']('error', '已取消修改')
          });
  }
  // 修改电话离开输入框
  phoneBlur(row) {
    row.phoneStatus = false
    this.phoneString = ''
  }
  // 修改手机号
  phoneChange(row) {
    this.phoneString = row.phone
    this['list_data'].forEach(el => {
      this.$set(el, 'phoneStatus', false)
    })
    row.phoneStatus = !row.phoneStatus
    this.$nextTick(() => {
      const input = this.$refs['name' + row.id] as HTMLElement
      input.focus()
    })
  }
  // 修改备注
  confirmUpdateNote(row) {

            updateUserNote( row.id, this.noteString ).then(res => {
              if (res.data.code === 200) {
                this['message']('success', '修改成功')
                row.noteStatus = false
                this.noteString = ''
                this.fetchData(this.initForm)
              } else {
                this['message']('error', res.data.message)
              }
            })
  }
  // 修改备注离开输入框
  noteBlur(row) {
    row.noteStatus = false
    this.noteString = ''
  }
  /*** row 列表数据*/
  showDetail(row) {
    this.activeName = 'first'
    this.dialogFormVisible = true;
    this.passList['id'] = row.id
    this.passList['page'] = 1
    watchPropert(row.id).then(res => {
      if(res.data.code === 200) {
        this.Dialog = Object.assign(this.Dialog, res.data.data);
      }
    })
     // 获取无业人员记录
    getUserPropertyPass(this.passList).then(res => {
      this.passListData = res.data.data.records
      this.passList['total'] = res.data.data.total
    })
    // 获取物业人员的车辆信息
    getUserPropertyCar(row.id).then(res => {
      this.carList = res.data.data
    })
  }
  // 物业人员通行记录翻页
  pagePassChange(page: number) {
    getUserPropertyPass(this.passList).then(res => {
      this.passListData = res.data.data.records
      this.passList['total'] = res.data.data.total
    })
  }
  // 获取权限组
  fetchRoleGroup() {
    getRoleGroup(null).then(res => {
      this.TreeData = res.data.data
      this.FormRules['authId'].push(
        { required: true, trigger: 'change', validator: (rule, value, callback) => {
                if (!this.TreeData.length) {
                  callback(new Error('请先添加权限组'))
                } else {
                  callback()
                }
              } }
      )
    })
  }
  created() {
    this.fetchRoleGroup()
    this.initForm['params'] = Object.assign(this.initForm['params'], this.page, this.filterForm) // 合并参数
  }
  // 修改物业人员状态
  changeStatus(Obj: object) {
    resetDisabledUser(Obj['Status'], Obj['id'] ).then(res => {
      if(res.data.code === 200) {
        this['message']('success', '修改成功')
        this['fetchData'](this.initForm)
      }
    })
  }
  ComponentCommand(Status: string, id:string) {
    return {
      id,
      Status
    }
  }
  // 确定添加物业人员
  confirmAddPropert() {
     if (this.Form['otherCardName'] !== '其它') {
      this.Form['cardName'] = this.Form['otherCardName']
    }
    this.$refs['Forms']["validate"](valid => {
      if(valid) {
        addPropert(this.Form).then(res => {
          if(res.data && res.data.code === 200) {
            this['message']('success', '添加成功')
            this['dialogCreate'] = false
            this['fetchData'](this.initForm)
            this['handleClose']()
          }
        })
      }
    })

  }
}
</script>

<style lang="scss" scoped>
.right{
  width: 62px;
  display: inline-block;
  height: 30px;
  text-align: right;
}
.rightContent {
  flex: 1;
  box-shadow: 0px 6px 5px 0px lightgray;
  position: relative;
}
.float{
  width: 250px;
  float: left;;
  position: relative;
  z-index: 99;
}
.close-menu {
  width: 10px;
  height: 48px;
  background: #acb7c1;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  position: relative;
}
.icon-class {
  font-size: 12px;
  color: #e7eaeb;
  cursor: pointer;
  line-height: 48px;
  position: absolute;
  left: -1px;
}


.menu-control {
  position: absolute;
  top: 32vh;
  left: -10px;
}

.menu-visible {
  position: absolute;
  top: 32vh;
  left: -11px;
}
.singleInfo{
  width: 40%;
  height: 40px;;
  padding: 0px 10px;
  text-align: left;
  line-height: 40px;
  float: left;
  &:nth-child(2), &:nth-child(3), &:nth-child(5), &:nth-child(6){
    width: 30%;
  }
}
.components-container {
  position: relative;
  height: 65vh;
}
</style>

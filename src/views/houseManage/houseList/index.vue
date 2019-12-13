<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <action-header
        exportUrl='/v1/admin/hsHouse/export'
        exportName='房屋.xls'
         ref="actionHeader"
        :initFormHeader='initForm'
        @fetchData='fetchData'
        :filterForm='filterForm'
        :dialogCreate.sync="dialogCreate"
        :houseStatus='true'
        :total="page.total">
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command='export'>导出</el-dropdown-item>
          </el-dropdown-menu>
          <div slot="houseNum">
            <div class="word-filter">
              <span class="filter-name">房屋编号:</span>
              <el-input clearable  
              @keyup.enter.native="emitFetchData"
              style="width:215px" class="input-filter" v-model="filterForm.keys" placeholder='输入房屋编号筛选' size="small"></el-input>
            </div>
            <div class="word-filter">
              <span class="filter-name">状态:</span>
              <el-select class="input-filter" size="small" v-model="filterForm.status" placeholder="请选择">
                <el-option label="所有" value=""></el-option>
                <el-option label="业主居住" value="1"></el-option>
                <el-option label="出租中" value="2"></el-option>
                <!-- <el-option label="待售中" value="3"></el-option>
                <el-option label="待租中" value="4"></el-option> -->
                <el-option label="闲置" value="3"></el-option>
                <!-- <el-option label="其他" value="6"></el-option> -->
              </el-select>
            </div>
          </div>
        </action-header>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="rowSpan.row1">
        <data-tree
        @fetchData='fetchData'
        :page='page'
        :initFormHeader='initForm'
        @getHouseTreeData='getHouseTreeData'
        :TreeData='TreeData' />
      </el-col>

      <el-col :span="rowSpan.row2" class="table-col">
        <div class="rightContent">
          <el-table
            :data="list_data"
            stripe
            @sort-change='sortChange'
            height="65vh"
            v-loading='showLoading'
            highlight-current-row
            @cell-mouse-enter="enterRowChange"
            @selection-change="handleSelectionChange"
            @cell-mouse-leave="leaveRowChange"
          >
            <el-table-column type="selection" align='center' width="50"></el-table-column>

            <el-table-column type="index" align='center' label="序号" class="indexNum" width="50">
              <template slot-scope="scope">
                <span>{{scope.$index + 1}}</span>
                <div class="fun-btn">
                  <el-dropdown trigger="click" placement="bottom-start" @command='commandClick'>
                    <el-tooltip class="item" effect="dark" content="点击操作" placement="top">
                      <i v-show="scope.row.showMenu" class="iconfont icon-menu"></i>
                    </el-tooltip>
                    <el-dropdown-menu slot="dropdown">
                      <!-- <el-dropdown-item :command='returnCommand("update", scope.row)'>远程开门</el-dropdown-item> -->
                      <el-dropdown-item :command="returnCommand('delete', scope.row)">
                        {{ deleteForm.data.length ? '批量删除' : '删除' }}
                      </el-dropdown-item>
                      <!-- <el-dropdown-item :command='returnCommand("delete", scope.row)'>编辑信息</el-dropdown-item> -->
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </template>
            </el-table-column>

            <el-table-column class="serial-num" align='center' prop="name" label="所属楼栋">
              <template slot-scope="scope">
                <span>{{scope.row.groupName}}</span>
              </template>
            </el-table-column>

            <el-table-column prop="buildingName" :show-overflow-tooltip='true' width="120" align='center' label="所属单元"></el-table-column>

            <el-table-column align='center' prop='serialNumber' width="200px" sortable='custom' :show-overflow-tooltip='true' label="房屋编号">
              <template slot-scope="scope">
                <el-button @click='showHouseDetails(scope.row)' type='text'>{{ scope.row.serialNumber }}</el-button>
              </template>
            </el-table-column>

            <el-table-column prop="personCnt" width="120" align='center' sortable='custom' label="注册人数"></el-table-column>
            <el-table-column width="120" align='center' prop="type" label="状态">
              <template slot-scope="{row}">
                <span>{{ row.status | status }}</span>
                <!-- <el-dropdown @command="changeStatus"
                trigger="click">
                  <span class="el-dropdown-link">
                    <el-tag
                    size="small"
                    style="border-radius: 50px;padding: 0 10px; cursor: pointer;"
                    >{{ row.status | status }}
                    </el-tag>
                  </span>
                  <el-dropdown-menu  slot="dropdown">
                    <el-dropdown-item :command='ComponentCommand("1", row)'>业主居住</el-dropdown-item>
                    <el-dropdown-item :command='ComponentCommand("2", row)'>出租中</el-dropdown-item>
                    <el-dropdown-item :command='ComponentCommand("3", row)'>闲置</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown> -->
              </template>
            </el-table-column>

            <el-table-column align='center' :show-overflow-tooltip='true' prop="note" label="备注">
              <template slot-scope="scope">
              <span class="rowUpdate" v-show='!scope.row.noteStatus' @click='focusNoteInput(scope.row)'>{{ scope.row.note || '点击编辑' }}</span>
              <el-input
              :ref='scope.row.id'
               @keyup.enter.native="confirmUpdateNote(scope.row)"
               @blur="noteBlur(scope.row)"
               v-model="noteString"
               v-show='scope.row.noteStatus'
               :clearable="true"
               placeholder="输入备注"></el-input>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination @current-change='pageChange' :page-size="page.limit" style="margin-top:10px;" background layout="prev, pager, next" :total="page.total"></el-pagination>
          <div :class="rowSpan.row1===3 ? menuControl1 : menuControl2" @click="menuVisible">
          <p class="close-menu">
            <i v-if="rowSpan.row1===3" class="iconfont icon-left icon-class"></i>
            <i v-else class="iconfont icon-zuo icon-class"></i>
          </p>
        </div>
        </div>

      </el-col>
    </el-row>
    <!-- 新建房屋 -->
    <el-dialog :close-on-click-modal='false' title="创建房屋" :visible.sync="dialogCreate" width="440px" :before-close="handleClose">
      <el-form :model="Form" :rules="rules" ref='Forms' label-width="110px">
        <el-form-item label="所属组别:"  prop='cardNo'>
          <el-cascader
            v-model="Form.buildingIdArr"
            :options="TreeData"
            :show-all-levels="false"
            :props="{ label: 'name', children: 'sonBuildGroups', value: 'id' }"
            @change="handleChange"></el-cascader>
        </el-form-item>
        <el-form-item label="房屋编号:"  prop='serialNumber'>
          <el-input style="width:217px" v-model="Form.serialNumber" placeholder='输入房屋编号'></el-input>
        </el-form-item>
        <el-form-item label="楼层:"  prop='storeyNum'>
          <el-input style="width:217px" v-model="Form.storeyNum" placeholder='输入楼层'></el-input>
        </el-form-item>
        <!-- <el-form-item label="状态:"  prop='status'>
          <el-select  style="width:217px" size="small" v-model="Form.status" placeholder="请选择">
                <el-option label="业主居住" value="1"></el-option>
                <el-option label="出租中" value="2"></el-option>
                <el-option label="待售中" value="3"></el-option>
                <el-option label="待租中" value="4"></el-option>
                <el-option label="闲置" value="5"></el-option>
                <el-option label="其他" value="6"></el-option>
              </el-select>
        </el-form-item> -->
        <el-form-item label="备注:"  prop='note'>
          <el-input  style="width:217px" type='textarea' v-model="Form.note" placeholder='输入备注'></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="addHouseConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 房屋信息 -->
    <el-dialog
    :close-on-click-modal='false'
      class="dialog-rewrite"
      :title="'编号: '+ detailDialog.serialNumber"
      :visible.sync="dialogFormVisible"
      width="800px"
    >
      <el-tabs type="card" v-model="activeName">
        <el-tab-pane label="详细信息" name="详细信息">
          <el-row style='margin-top:10px'>
            <el-col :span='6'>所在楼层:{{ detailDialog.storeyNum }}</el-col>
            <el-col :span='6'>所在单元:{{ detailDialog.buildingName }}</el-col>
            <el-col :span='6'>房屋编号:{{ detailDialog.houseName }}</el-col>
            <el-col :span='6'>注册时间:{{ detailDialog.createTime }}</el-col>
          </el-row>
          <el-row style='margin-top:10px'>
            <el-col :span='6'>注册人数:{{ detailDialog.personCnt }}</el-col>
            <el-col :span='6'>房屋状态:{{ detailDialog.status | status }}</el-col>
            <!-- <el-col :span='6'>业主电话:{{ detailDialog.phone || '--' }}</el-col> -->
          </el-row>
          <div style='margin-top:10px;'>
            备注：<el-input style='' type='textarea' v-model='detailDialog.note'></el-input>
          </div>

        </el-tab-pane>
        <el-tab-pane label="在住人员" name="在住人员">
          <el-table :data="dtailTable" style="width: 100%">
            <el-table-column align='center' prop="userName" label="姓名"></el-table-column>
            <el-table-column align='center' prop="userPhone" label="电话"></el-table-column>
            <el-table-column align='center' prop="type" label="类型">
              <template slot-scope="{row}">
                <span>{{ row.type | type }}</span>
              </template>
            </el-table-column>
            <el-table-column align='center' prop="status" label="状态">
              <template slot-scope="{row}">
                <span>{{ row.status | peopleStatus }}</span>
              </template>
            </el-table-column>
            <el-table-column align='center' prop="createTime" label="注册时间"></el-table-column>
            <el-table-column align='center' prop="enableInviteCar" label="邀请车辆">
              <template slot-scope="{row}">
                <span>{{ row.enableInviteCar === '1' ? '允许' : '禁止' }}</span>
              </template>
            </el-table-column>
            <el-table-column align='center' prop="enableInviteVisitor" label="邀请访客">
              <template slot-scope="{row}">
                <span>{{ row.enableInviteVisitor === '1' ? '允许' : '禁止' }}</span>
              </template>
            </el-table-column>
            <el-table-column align='center' prop="enableRemoteOpen" label="远程开门">
              <template slot-scope="{row}">
                <span>{{ row.enableRemoteOpen === '1' ? '允许' : '禁止' }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="dialogFormVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import mixin from "@/config/minxins";
import { getHouseTreeData, addHouse,
updateStatusNote, getRegisterPeople } from '@/api/houseApi.ts'
const ActionHeader = () => import("@/components/ActionHeader.vue");
const DataTree = () => import("@/components/DataTree.vue");

@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    DataTree
  },
  filters: {
    status(val: string) {
      const data = {
        "1": '业主居住',
        "2": '出租中',
        // "3": '待售中',
        // "4": '待租中',
        "3": '闲置'
        // "6": '其他'
      }
      return data[val]
    },
    type(val: string) {
      const data = {
        "1": '业主',
        "2": '租户',
        "3": '成员'
      }
      return data[val]
    },
    peopleStatus(val: string) {
      const data = {
        "0": '在住',
        "-1": '不在住',
        "-2": '过期'
      }
      return data[val]
    }
  }
})
export default class CardManage extends Vue {
  private rowSpan: any = {
    row1: 3,
    row2: 21
  };
  initForm: object = {
    url: '/admin/hsHouse/list',
    method: 'get',
    params: {
      orderColumn: 'serialNumber',
      asc: true
    }
  }
  filterForm: object = {
    keys: '',
    status: '',
    buildingId: ''
  }
  deleteForm: object = {
    url: '/admin/hsHouse',
    method: 'delete',
    data: []
  }
  Form: object = {
    buildingIdArr: [],
    buildingId: '',
    note: '',
    serialNumber: '',
    status: '',
    storeyNum: ''
  }
  rules: any = {
    serialNumber: [
            { required: true, message: '请输入房屋的编号', trigger: 'blur' }
          ],
    status: [
            { required: true, message: '请选择当前房屋状态', trigger: 'change' }
          ],
    storeyNum: [
            { required: true, message: '请选择当前房屋楼层数', trigger: 'blur' },
            { min: 1, max: 6, message: '长度在 1 到 6 个字符', trigger: 'blur' }
          ],
          cardNo: [
            { required: true, message: '请选择当前房屋的组别', trigger: 'change' }
          ]
  }
  TreeData: Array<Object> = [] // 树形结构数据
  private menuControl1: String = "menu-control";
  private menuControl2: String = "menu-visible";
  updateArray: Array<string> = ['noteStatus', 'houseStatus']
  noteString: string = '' // 修改的备注
  private dialogFormVisible: Boolean = false;

  private detailDialog: Object = {
    //查看目标详情
    name: ""
  };
  private activeName: String = "详细信息";
  private dtailTable: Array<Object> =[]; // 当前房屋下的注册人员
  ComponentCommand(houseStatus: string, row:object) {
    return {
      ...row,
      houseStatus
    }
  }
  // 注册人数排序
  sortChange({column, prop, order }){
    this.initForm['params']['orderColumn'] = prop
    this.initForm['params']['asc'] = order !== 'ascending'
    this['fetchData'](this.initForm)
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
  // 查看房屋的具体信息
  showHouseDetails(row) {
    this.dialogFormVisible = true
    this.activeName = '详细信息'
    this.detailDialog = Object.assign(this.detailDialog, row)
    console.log(this.detailDialog)
    getRegisterPeople(row.id).then(res => {
      this.dtailTable = res.data.data
    })
  }
  // 修改管理员状态
  changeStatus(Obj: object) {
    updateStatusNote({ id: Obj['id'], note: Obj['note'], status: Obj['houseStatus'] }).then(res => {
      if(res.data.code === 200) {
        this.$message.success('修改成功')
        this['fetchData'](this.initForm)
      }
    })
  }
  // 获取房屋结构
  getHouseTreeData() {
    getHouseTreeData().then((res: Object) => {
      this.TreeData = res['data']['data']
    })
  }
  // 修改备注离开输入框
  noteBlur(row) {
    row.noteStatus = false
    this.noteString = ''
  }
  // 修改备注
  confirmUpdateNote(row) {
    updateStatusNote({ id: row.id, note: this.noteString, status: row.status }).then(res => {
      if (res.data.code === 200) {
        this.$message.success('修改成功')
        row.noteStatus = false
        this.noteString = ''
        this.fetchData(this.initForm)
      } else {
        this.$message.error(res.data.message)
      }
    })
  }
  // 新增房屋
  addHouseConfirm() {
    this.$refs["Forms"]['validate'](valid => {
      if(valid) {
        this.Form['buildingId'] = [...this.Form['buildingIdArr']].pop()
        addHouse(this.Form).then(res => {
          if(res.data.code === 200) {
            this.$message.success('新增成功')
            this['dialogCreate'] = false
            this['fetchData'](this.initForm)
            this['handleClose']()
          }
        })
      }
    })

  }
  created() {
    this.getHouseTreeData()
    this.initForm['params'] = Object.assign(this.initForm['params'], this.page, this.filterForm) // 合并参数
  }
  editType(item) {
    /**@description 修改状态 */
    console.log(item);
    // this.dialogFormVisible = true;
  }

  handleChange(arr) {
    console.log(arr)
  }
  queryIdetity(row) {
    this.detailDialog = row;
    this.dialogFormVisible = true;
  }

  menuVisible() {
    /**@description 控制楼栋 */
    if (this.rowSpan.row1 === 3) {
      this.rowSpan = {
        row1: 0,
        row2: 24
      };
    } else {
      this.rowSpan = {
        row1: 3,
        row2: 21
      };
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  display: flex;
  .rightContent {
    flex: 1;
  }
}

.demo-block {
  border: 1px solid #ebebeb;
  border-radius: 3px;
}

.serial-num {
  position: relative;
}

.rightContent {
  flex: 1;
  box-shadow: 0px 6px 5px 0px lightgray;
  position: relative;
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
</style>

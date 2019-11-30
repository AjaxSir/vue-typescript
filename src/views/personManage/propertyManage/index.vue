<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <ActionHeader
        :initFormHeader='initForm'
        @fetchData='fetchData'
        :filterForm='filterForm'
        :moreStatus='false'
        :dialogCreate.sync="dialogCreate" :total="page.total">
          <div slot="houseNum">
            <div class="word-filter">
              <span class="filter-name">姓&nbsp;&nbsp;&nbsp;名:</span>
              <el-input class="input-filter" v-model="filterForm.name" size="small"></el-input>
            </div>
            <div class="word-filter">
              <span class="filter-name">手机号:</span>
              <el-input class="input-filter"  v-model="filterForm.phone" size="small"></el-input>
            </div>
          </div>
        </ActionHeader>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="rowSpan.row1">
        <DataTree @fetchRoleGroup='fetchRoleGroup' :TreeData='TreeData' :type='"role"' />
      </el-col>
      <el-col :span="rowSpan.row2" class="table-col">
        <div class="rightContent">
          <el-table :data="list_data"
          v-loading='showLoading'
          @selection-change="handleSelectionChange"
          @cell-mouse-enter="enterRowChange"
          @cell-mouse-leave="leaveRowChange"
          border>
            <el-table-column type="selection" align="center"></el-table-column>
            <el-table-column type="index" width="60" align="center" label="编号"></el-table-column>
            <el-table-column prop="name" align="center" label="姓名">
              <template slot-scope="{row}">
                <el-button style="padding:0px;" type="text" @click="showDetail(row)">{{row.name }}</el-button>
                <div class="fun-btn">
                  <el-dropdown trigger="click" placement="bottom-start" @command='commandClick'>
                    <i v-show="row.showMenu" class="iconfont icon-menu"></i>
                    <el-dropdown-menu slot="dropdown">
                      <!-- <el-dropdown-item :command='returnCommand("update", row)'>修改</el-dropdown-item> -->
                      <el-dropdown-item :command='returnCommand("delete", row)'>删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="age" align="center" label="年龄"></el-table-column>
            <el-table-column prop="sex" align="center" label="性别"></el-table-column>
            <el-table-column prop="cardNo" align="center" label="身份证号"></el-table-column>
            <el-table-column prop="phone" align="center" label="联系电话"></el-table-column>
            <el-table-column prop="authName" align="center" label="权限组"></el-table-column>
            <el-table-column prop="status" align="center" label="状态">
              <template slot-scope="{row}">
                <el-dropdown @command="changeStatus"
                trigger="click">
                  <span class="el-dropdown-link">
                    <el-tag
                    size="small"
                    :type="row.status === '0' ? 'primary' : 'warning'"
                    style="border-radius: 50px;padding: 0 10px; cursor: pointer;"
                    >{{ row.status === '0' ? '使用' : '禁用' }}
                    </el-tag>
                  </span>
                  <el-dropdown-menu  slot="dropdown">
                    <el-dropdown-item :command='ComponentCommand("1", row.id)'>正常</el-dropdown-item>
                    <el-dropdown-item :command='ComponentCommand("0", row.id)'>禁用</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
            <el-table-column prop="note" align="center" label="备注"></el-table-column>
            <el-table-column prop="createTime" align="center" label="创建时间"></el-table-column>
          </el-table>
          <el-pagination
        @current-change='pageChange'
        style="margin-top:10px;" background layout="prev, pager, next" :total="page.total"></el-pagination>
        <div :class="rowSpan.row1===4 ? menuControl1 : menuControl2" @click="menuVisible">
          <p class="close-menu">
            <i v-if="rowSpan.row1===4" class="iconfont icon-left icon-class"></i>
            <i v-else class="iconfont icon-zuo icon-class"></i>
          </p>
        </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog :close-on-click-modal='false' :title="Dialog.name" :visible.sync="dialogFormVisible">
      <el-tabs v-model="activeName">
        <el-tab-pane label="详细信息" name="first">
          <div class="singleInfo">姓名:&nbsp;&nbsp;{{ Dialog.name }}</div>
          <div class="singleInfo">性别:&nbsp;&nbsp;{{ Dialog.sex }}</div>
          <div class="singleInfo">生日:&nbsp;&nbsp;{{ Dialog.birthday || '--' }}</div>
          <div class="singleInfo">身份证号:&nbsp;&nbsp;{{ Dialog.cardNo }}</div>
          <div class="singleInfo">卡名:&nbsp;&nbsp;{{ Dialog.cardName }}</div>
          <div class="singleInfo">年龄:&nbsp;&nbsp;{{ Dialog.age }}</div>
          <div class="singleInfo">身份证号:&nbsp;&nbsp;{{ Dialog.name }}</div>
          <div class="singleInfo">手机号:&nbsp;&nbsp;{{ Dialog.phone }}</div>
          <div class="singleInfo">权限组:&nbsp;&nbsp;{{ Dialog.auth && Dialog.auth.name || '--' }}</div>
        </el-tab-pane>
        <el-tab-pane label="通行记录" name="second">
           <el-table
            :data="passListData"
            style="width: 100%">
            <el-table-column
              prop="date"
              align='center'
              label="日期">
            </el-table-column>
            <el-table-column
              prop="name"
              align='center'
              label="姓名">
            </el-table-column>
            <el-table-column
              prop="address"
              align='center'
              label="地址">
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
                <img :src="row.photo" alt="">
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="人脸库信息" name="fourth">人脸库信息</el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :close-on-click-modal='false' title="新建物业人员" :visible.sync="dialogCreate" width="600px" :before-close="handleClose">
      <el-form :model="Form" :rules="FormRules" ref='Forms' label-width="80px">
        <el-form-item class="float"  label="姓名:"  prop='name'>
          <el-input v-model="Form.name" placeholder='输入物业人员姓名'></el-input>
        </el-form-item>
        <el-form-item  class="float"  label="电话:"  prop='phone'>
          <el-input v-model="Form.phone" placeholder='输入物业人员电话'></el-input>
        </el-form-item>
        <el-form-item  class="float"  label="性别:"  prop='sex'>
          <el-switch
            v-model="Form.sex"
             active-text="男"
            inactive-text="女"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="1"
            inactive-value="0">
          </el-switch>
        </el-form-item>
        <el-form-item  class="float" label="年龄:"  prop='age'>
          <el-input v-model="Form.age" placeholder='输入物业人员年龄'></el-input>
        </el-form-item>
        <el-form-item label="权限组:"  prop='authId'>
          <el-select v-model="Form.authId" placeholder="请选择">
            <el-option
              v-for="item in TreeData"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="备注:"  prop='note'>
          <el-input type='textarea' v-model="Form.note" placeholder='输入备注'></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="confirmAddPropert">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import { getRoleGroup, addPropert, resetDisabledUser, watchPropert,
getUserPropertyPass } from '@/api/peopleApi.ts'
import { getUserPropertyCar } from '@/api/carApi.ts'
import mixin from "@/config/minxins";
const ActionHeader = () => import("@/components/ActionHeader.vue");
const DataTree = () => import("@/components/DataTree.vue");
@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    DataTree
  }
})
export default class PropertyManage extends Vue {
  private activeName: string = "first";
  private dialogFormVisible: boolean = false;
  private title: string = "详情";
  private rowSpan: any = {
    row1: 4,
    row2: 20
  };
  private menuControl1: String = "menu-control";
  private menuControl2: String = "menu-visible";
  passListData: Array<object> = [] // 物业人员通行记录
  carList: Array<object> = [] // 物业人员车辆信息
  Form: object = {
    name: '',
    phone: '',
    age: '',
    note: '',
    sex: '1',
    authId: ''
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
    data: []
  }
  passList: object = {
    id: '',
    page: 1,
    limit: 10,
    total:1
  }
  TreeData: Array<object> = [] // 权限组
  FormRules: object = {
    name: [
            { required: true, message: '请输入物业人员名称', trigger: 'blur' }
          ],
    phone: [
            { required: true, message: '请输入电话', trigger: 'blur' }
          ],
    authId: [
            { required: true, message: '请选择对应的权限组', trigger: 'change' }
          ]
  }
  Dialog: object = {
    name: ''  // 物业人员详细记录
  };
  menuVisible() {
    /**@description 控制楼栋 */
    if (this.rowSpan.row1 === 4) {
      this.rowSpan = {
        row1: 0,
        row2: 24
      };
    } else {
      this.rowSpan = {
        row1: 4,
        row2: 20
      };
    }
  }
  handleClick() {}
  /**
   * row 列表数据
   */
  showDetail(row) {
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
      console.log(1)
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
        this.$message.success('修改成功')
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
  // 确定新增物业人员
  confirmAddPropert() {
    this.$refs['Forms']["validate"](valid => {
      if(valid) {
        addPropert(this.Form).then(res => {
          if(res.data && res.data.code === 200) {
            this.$message.success('新增成功')
            this['dialogCreate'] = false
            this['fetchData'](this.initForm)
          }
        })
      }
    })

  }
}
</script>

<style lang="scss" scoped>
.leftContent {
  flex: none;
  width: 200px;
}
.rightContent {
  flex: 1;
  box-shadow: 0px 6px 5px 0px lightgray;
}
.fun-btn {
  position: absolute;
  left: -64px;
  top: 12px;
  .iconfont {
    font-size: 19px;
    color: #8091a5;
    cursor: pointer;
  }
}
.float{
  width: 260px;
  float: left;;
  position: relative;
  z-index: 99;
}
.fun-btn {
  position: absolute;
  left: -64px;
  top: 8px;
  .iconfont {
    font-size: 19px;
    color: #8091a5;
    cursor: pointer;
  }
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
.table-col {
  position: relative;
}

.menu-control {
  position: absolute;
  top: 32vh;
  left: -5px;
}

.menu-visible {
  position: absolute;
  top: 32vh;
  left: -15px;
}
.singleInfo{
  width: 50%;
  height: 40px;;
  padding: 0px 10px;
  text-align: left;
  line-height: 40px;
  float: left;
}
</style>

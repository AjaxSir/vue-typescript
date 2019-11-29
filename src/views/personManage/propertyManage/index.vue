<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
 <ActionHeader
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
      <el-col :span="4">
        <DataTree :TreeData='TreeData' :type='"role"' />
      </el-col>
      <el-col :span="20">
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
            <el-table-column prop="status" align="center" label="状态"></el-table-column>
            <el-table-column prop="note" align="center" label="备注"></el-table-column>
            <el-table-column prop="createTime" align="center" label="创建时间"></el-table-column>
          </el-table>
        </div>
        <el-pagination
        @current-change='pageChange'
        style="margin-top:10px;" background layout="prev, pager, next" :total="page.total"></el-pagination>
      </el-col>
    </el-row>
    <el-dialog :close-on-click-modal='false' :title="Dialog.name" :visible.sync="dialogFormVisible">
      <el-tabs v-model="activeName">
        <el-tab-pane label="详细信息" name="first">详细信息</el-tab-pane>
        <el-tab-pane label="通行记录" name="second">通行记录</el-tab-pane>
        <el-tab-pane label="车辆信息" name="third">车辆信息</el-tab-pane>
        <el-tab-pane label="人脸库信息" name="fourth">人脸库信息</el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="dialogCreate" width="30%" :before-close="handleClose">
      <el-form :model="Form" :rules="rules" ref='Forms' label-width="90px">
        <el-form-item label="姓名:"  prop='name'>
          <el-input v-model="Form.name" placeholder='输入姓名'></el-input>
        </el-form-item>
        <el-form-item label="电话:"  prop='phone'>
          <el-input v-model="Form.phone" placeholder='输入电话'></el-input>
        </el-form-item>
        <el-form-item label="年龄:"  prop='age'>
          <el-input v-model="Form.age" placeholder='输入房屋信息'></el-input>
        </el-form-item>
        <el-form-item label="备注:"  prop='detail'>
          <el-input v-model="Form.note" placeholder='输入备注'></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogCreate = false">取 消</el-button>
        <el-button type="primary" @click="dialogCreate = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import { getRoleGroup } from '@/api/peopleApi.ts'
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
  Form: any = {
    name: '',
    phone: '',
    age: '',
    note: ''
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
  TreeData: Array<object> = [] // 权限组
  rules: any = {
    name: [
            { required: true, message: '请输入需关联的房屋', trigger: 'blur' }
          ]
  }
  private Dialog: Object = {
    name: ""
  };
  handleClick() {}
  /**
   * row 列表数据
   */
  showDetail(row) {
    this.dialogFormVisible = true;
    this.Dialog = Object.assign(this.Dialog, row);
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
</style>

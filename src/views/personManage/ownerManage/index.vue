<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <ActionHeader :dialogCreate.sync="dialogCreate" :total="1">
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>导入</el-dropdown-item>
            <el-dropdown-item>导出</el-dropdown-item>
            <el-dropdown-item>统计信息</el-dropdown-item>
          </el-dropdown-menu>
          <div slot="houseNum">
            <div class="word-filter">
              <span class="filter-name">姓&nbsp;&nbsp;&nbsp;名:</span>
              <el-input class="input-filter" size="small"></el-input>
            </div>
            <div class="word-filter">
              <span class="filter-name">手机号:</span>
              <el-input class="input-filter" size="small"></el-input>
            </div>
            <div class="word-filter">
              <span class="filter-name">用户类型:</span>
              <el-select class="input-filter" size="small" v-model="UserType" placeholder="请选择">
                <el-option label="租客" value="all"></el-option>
                <el-option label="业主" value="owner"></el-option>
              </el-select>
            </div>
          </div>
        </ActionHeader>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="4">
        <DataTree />
      </el-col>
      <el-col :span="20">
        <div class="rightContent">
          <el-table :data="list_data" border>
            <el-table-column type="selection" align="center"></el-table-column>
            <el-table-column type="index" width="60" align="center" label="编号"></el-table-column>
            <el-table-column prop="name" align="center" label="姓名">
              <template slot-scope="{ row }">
                <el-tag @click="showDetail(row)">{{ row.name }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="age" align="center" label="年龄"></el-table-column>
            <el-table-column prop="sex" align="center" label="性别"></el-table-column>
            <el-table-column prop="phone" align="center" label="联系电话"></el-table-column>
            <el-table-column prop="house_info" align="center" label="房屋信息"></el-table-column>
            <el-table-column prop="expire_time" align="center" label="过期时间"></el-table-column>
            <el-table-column prop="far_door" align="center" label="远程开门"></el-table-column>
            <el-table-column prop="car" align="center" label="访客车辆"></el-table-column>
            <el-table-column prop="main_linker" align="center" label="是否主联系人"></el-table-column>
            <el-table-column prop="status" align="center" label="状态"></el-table-column>
            <el-table-column prop="detail" align="center" label="备注"></el-table-column>
            <el-table-column prop="create_time" align="center" label="创建时间"></el-table-column>
          </el-table>
        </div>

        <el-pagination style="margin-top:10px;" background layout="prev, pager, next" :total="2"></el-pagination>
      </el-col>
    </el-row>

    <el-dialog :title="Dialog.name" :visible.sync="dialogFormVisible">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="用户管理" name="first">详细信息</el-tab-pane>
        <el-tab-pane label="配置管理" name="second">进出单元记录</el-tab-pane>
        <el-tab-pane label="角色管理" name="third">进出小区记录</el-tab-pane>
        <el-tab-pane label="定时任务补偿" name="fourth">车辆信息</el-tab-pane>
        <el-tab-pane label="房屋信息" name="fivw">房屋信息</el-tab-pane>
        <el-tab-pane label="证件信息" name="six">证件信息</el-tab-pane>
        <el-tab-pane label="人脸库信息" name="seven">人脸库信息</el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="dialogCreate" width="30%" :before-close="handleClose">
      <span>这是业主管理新增</span>
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
import mixin from "@/config/minxins";
const ActionHeader = () => import("@/components/ActionHeader.vue");
const DataTree = () => import("@/components/DataTree.vue");
const DiaLog = () => import("@/components/dialog.vue");
@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    DataTree,
    DiaLog
  }
})
export default class OwnerManage extends Vue {
  private activeName: string = "first";
  private dialogFormVisible: boolean = false;
  private title: string = "详情";
  private list_data: Array<Object> = [
    {
      name: "张三",
      age: 18,
      sex: "男",
      phone: "13518160000",
      house_info: "一栋一单元",
      expire_time: "2019/10/1",
      far_door: "是",
      car: "川A 12345",
      main_linker: "是",
      status: "已住",
      detail: "租户",
      create_time: "2019/10/1"
    }
  ];
  UserType: string = "owner";
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
</style>

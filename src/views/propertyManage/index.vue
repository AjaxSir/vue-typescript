<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <ActionHeader :dialogCreate.sync='dialogCreate' :total="1">
           <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>导入</el-dropdown-item>
              <el-dropdown-item>导出</el-dropdown-item>
              <el-dropdown-item>统计信息</el-dropdown-item>
            </el-dropdown-menu>
            <div slot="houseNum">
            <span class="wordFilter">姓&nbsp;&nbsp;&nbsp;名:<el-input class="inputFilter"></el-input></span>
            <span class="wordFilter">手机号:<el-input class="inputFilter"></el-input></span>
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
            <el-table-column type="selection" align="center"> </el-table-column>
            <el-table-column
              type="index"
              width="60"
              align="center"
              label="编号"
            >
            </el-table-column>
            <el-table-column prop="name" align="center" label="姓名">
              <template slot-scope="{ row }">
                <el-tag @click="showDetail(row)">{{ row.name }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="age" align="center" label="年龄">
            </el-table-column>
            <el-table-column prop="sex" align="center" label="性别">
            </el-table-column>
            <el-table-column prop="phone" align="center" label="联系电话">
            </el-table-column>
            <el-table-column prop="expire_time" align="center" label="过期时间">
            </el-table-column>
            <el-table-column prop="role_group" align="center" label="权限组">
            </el-table-column>
            <el-table-column prop="status" align="center" label="状态">
            </el-table-column>
            <el-table-column prop="detail" align="center" label="备注">
            </el-table-column>
            <el-table-column prop="create_time" align="center" label="创建时间">
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <el-dialog :title="Dialog.name" :visible.sync="dialogCreate">
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
        <el-button type="primary" @click="dialogCreate = false"
          >确 定</el-button
        >
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
  private list_data: Array<Object> = [
    {
      name: "张三",
      age: 18,
      sex: "男",
      phone: "13518160000",
      expire_time: "2019/10/1",
      role_group: "权限组一",
      status: "已住",
      detail: "租户",
      create_time: "2019/10/1"
    }
  ];
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

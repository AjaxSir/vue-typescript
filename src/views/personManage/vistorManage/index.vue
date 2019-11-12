<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <ActionHeader :btnStatus="2" :total="1">
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>进出次数排序</el-dropdown-item>
            <el-dropdown-item>滞留时间排序</el-dropdown-item>
            <el-dropdown-item>次数统计</el-dropdown-item>
          </el-dropdown-menu>
          <div slot="houseNum">
            <div class="word-filter">
              <span class="filter-name">受访人:</span>
              <el-input class="input-filter" size="small"></el-input>
            </div>
          </div>
        </ActionHeader>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="24">
        <div class="rightContent">
          <el-table :data="list_data" border>
            <el-table-column type="selection" align="center"></el-table-column>
            <el-table-column type="index" width="60" align="center" label="编号"></el-table-column>
            <el-table-column prop="name" align="center" label="受访人姓名">
              <template slot-scope="{ row }">
                <el-button type='text' @click="showDetail(row)">{{ row.name }}</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="vistor_type" align="center" label="访客类型"></el-table-column>
            <el-table-column prop="card_number" align="center" label="身份证号"></el-table-column>
            <el-table-column prop="regis_time" align="center" label="注册时间"></el-table-column>
            <el-table-column prop="all_times" align="center" label="累计访问次数"></el-table-column>
            <el-table-column prop="last_time" align="center" label="最近访问时间"></el-table-column>
          </el-table>
        </div>

        <el-pagination style="margin-top:10px;" background layout="prev, pager, next" :total="2"></el-pagination>
      </el-col>
    </el-row>
    <el-dialog :title="Dialog.name" :visible.sync="dialogFormVisible">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="基本信息" name="first">基本信息</el-tab-pane>
        <el-tab-pane label="受访人信息" name="second">受访人信息</el-tab-pane>
        <el-tab-pane label="进出记录" name="third">进出记录</el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import mixin from "@/config/minxins";
const ActionHeader = () => import("@/components/ActionHeader.vue");
@Component({
  mixins: [mixin],
  components: {
    ActionHeader
  }
})
export default class VistoryManage extends Vue {
  private activeName: string = "first";
  private dialogFormVisible: boolean = false;
  private title: string = "详情";
  private list_data: Array<Object> = [
    {
      name: "张三",
      vistor_type: "111",
      card_number: "13512156432165",
      phone: "13518160000",
      regis_time: "2019/10/1",
      all_times: "1",
      last_time: "2019/10/1"
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

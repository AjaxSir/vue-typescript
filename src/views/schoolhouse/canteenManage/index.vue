<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <action-header :dialogCreate.sync="dialogCreate" :total="1">
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>人数统计</el-dropdown-item>
            <el-dropdown-item>进出次数统计</el-dropdown-item>
            <el-dropdown-item>人均时长统计</el-dropdown-item>
          </el-dropdown-menu>
          <div slot="houseNum">
            <div class="word-filter">
              <span class="filter-name">食堂名称:</span>
              <el-input class="input-filter" size="small"></el-input>
            </div>
            <div class="word-filter">
              <span class="filter-name">开放时段:</span>
              <el-date-picker
                class="input-filter"
                size="small"
                v-model="TimeRange"
                type="datetimerange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </div>
          </div>
        </action-header>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="24" class="table-col">
        <div class="rightContent">
          <el-table border stripe :data="tableData" style="width: 100%">
            <el-table-column type="index" align="center" label="序号" width="50"></el-table-column>
            <el-table-column prop="name" align="center" label="食堂名称">
              <template slot-scope="scope">
                <el-button
                  style="padding:0px;"
                  type="text"
                  @click="queryIdetity(scope.row)"
                >{{scope.row.name}}</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="roomNum" align="center" label="开放时段"></el-table-column>
            <el-table-column prop="intoNum" align="center" label="当前人数"></el-table-column>
            <el-table-column prop="spareNum" align="center" label="备注"></el-table-column>
          </el-table>
          <el-pagination style="margin-top:10px;" background layout="prev, pager, next" :total="2"></el-pagination>
        </div>
      </el-col>
    </el-row>
    <el-dialog title="提示" :visible.sync="dialogCreate" width="30%" :before-close="handleClose">
      <span>这是食堂管理添加</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogCreate = false">取 消</el-button>
        <el-button type="primary" @click="dialogCreate = false">确 定</el-button>
      </span>
    </el-dialog>
    <canteen-dialog :formShow.sync="dialogCanteen" :dialogData="dialogData" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import mixin from "@/config/minxins";

const ActionHeader = () => import("@/components/ActionHeader.vue");
const DataTree = () => import("@/components/DataTree.vue");
const CanteenDialog = () => import("./canteenDialog.vue");

@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    DataTree,
    CanteenDialog
  }
})
export default class CanteenManage extends Vue {
  private tableData: Array<Object> = [
    {
      name: "XXX食堂1",
      house: "001",
      roomNum: "2019-10-11",
      intoNum: "200",
      spareNum: "--"
    },
    {
      name: "XXX食堂2",
      house: "002",
      roomNum: "2019-10-11",
      intoNum: "300",
      spareNum: "--"
    }
  ];

  private rowSpan: any = {
    row1: 4,
    row2: 20
  };

  private TimeRange: any = ""; //根据时间进行筛选
  private dialogCanteen: any = false;

  private form: Object = {
    name: "",
    region: "",
    date1: "",
    date2: "",
    delivery: false,
    type: [],
    resource: "",
    desc: ""
  };

  private dialogFormVisible: Boolean = false;
  private formLabelWidth: String = "120px";

  private dialogData: Object = {}; // 目标图书馆详情

  editType(item) {
    /**@description 修改状态 */
    console.log(item);
    // this.dialogFormVisible = true;
  }
  queryIdetity(val) {
    this.dialogData = val;
    this.dialogCanteen = true;
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


.close-menu {
  width: 10px;
  height: 48px;
  background: #acb7c1;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  position: relative;
}

.capture-img {
  width: 60px;
}
</style>

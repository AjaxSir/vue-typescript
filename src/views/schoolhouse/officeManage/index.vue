<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <action-header :type="'classroom'" :total="1" />
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="rowSpan.row1">
        <data-tree />
      </el-col>

      <el-col :span="rowSpan.row2" class="table-col">
        <div class="rightContent">
          <el-table border :data="tableData" style="width: 100%">
            <el-table-column type="index" align="center" label="序号" width="50"></el-table-column>
            <el-table-column prop="name" align="center" label="办公室名称"></el-table-column>
            <el-table-column prop="house" align="center" label="楼层">
              <template slot-scope="scope">
                <el-button
                  style="padding:0px;"
                  type="text"
                  @click="queryIdetity(scope.row)"
                >{{scope.row.house}}</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="roomNum" align="center" label="开放时段"></el-table-column>
            <el-table-column prop="intoNum" align="center" label="累计人数"></el-table-column>
            <el-table-column prop="spareNum" align="center" label="备注"></el-table-column>
          </el-table>
          <el-pagination style="margin-top:10px;" background layout="prev, pager, next" :total="2"></el-pagination>
        </div>
        <div :class="rowSpan.row1===4 ? menuControl1 : menuControl2" @click="menuVisible">
          <p class="close-menu">
            <i v-if="rowSpan.row1===4" class="iconfont icon-left icon-class"></i>
            <i v-else class="iconfont icon-zuo icon-class"></i>
          </p>
        </div>
      </el-col>
    </el-row>

    <office-dialog :formShow.sync="dialogOffice" :dialogData="dialogData" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import mixin from "@/config/minxins";

const ActionHeader = () => import("@/components/ActionHeader.vue");
const DataTree = () => import("@/components/DataTree.vue");
const OfficeDialog = () => import("./officeDialog.vue");

@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    DataTree,
    OfficeDialog
  }
})
export default class OfficeManage extends Vue {
  private tableData: Array<Object> = [
    //办公室数据
    {
      name: "XXX办公楼1",
      house: "001",
      roomNum: "2019-10-11",
      intoNum: "200",
      spareNum: "--"
    },
    {
      name: "XXX办公楼2",
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
  private menuControl1: String = "menu-control";
  private menuControl2: String = "menu-visible";
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
  private dialogOffice: any = false;

  private dialogData: Object = {}; // 目标教师详情

  editType(item) {
    /**@description 修改状态 */
    console.log(item);
    // this.dialogFormVisible = true;
  }

  queryIdetity(val) {
    /**@description 将目标详情传给dialog */
    this.dialogOffice = true;
    this.dialogData = val;
  }

  enterRowChange(row, column, cell, event) {
    /**@description hover enter tab 行 */
    row.showMenu = true;
  }

  leaveRowChange(row) {
    /**@description hover leave tab 行 */
    row.showMenu = false;
  }

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
  top: 13px;
  .iconfont {
    font-size: 19px;
    color: #8091a5;
    cursor: pointer;
  }
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

.capture-img {
  width: 60px;
}
</style>

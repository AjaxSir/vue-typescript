<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <action-header :dialogCreate.sync="dialogCreate" :total="1">
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>导入</el-dropdown-item>
            <el-dropdown-item>导出</el-dropdown-item>
          </el-dropdown-menu>
          <div slot="houseNum">
            <div class="word-filter">
              <span class="filter-name">时间段:</span>
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
          <el-table
            :data="cardList"
            stripe
            class="demo-block"
            highlight-current-row
            @cell-mouse-enter="enterRowChange"
            @cell-mouse-leave="leaveRowChange"
          >
            <el-table-column type="selection" width="50"></el-table-column>

            <el-table-column type="index" label="序号" width="50"></el-table-column>

            <el-table-column class="serial-num" prop="name" label="编号">
              <template slot-scope="scope">
                <el-button
                  style="padding:0px;"
                  type="text"
                  @click="queryIdetity(scope.row)"
                >{{scope.row.name}}</el-button>
                <div class="fun-btn">
                  <el-dropdown trigger="click" placement="bottom-start" @command='commandClick'>
                    <i v-show="scope.row.showMenu" class="iconfont icon-menu"></i>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command='update'>修改</el-dropdown-item>
                      <el-dropdown-item command='delete'>删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="houseRelative" label="关联房屋"></el-table-column>

            <el-table-column prop="createDate" label="创建时间"></el-table-column>

            <el-table-column prop="createDate" label="最近刷卡时间"></el-table-column>
            <el-table-column prop="type" label="状态">
              <template slot-scope="scope">
                <el-tag
                  size="small"
                  style="border-radius: 50px;padding: 0 10px; cursor: pointer;"
                  :type="scope.row.type === 1 ? 'success' : 'danger'"
                  @click="editType(scope.row)"
                >{{ scope.row.type === 1 ? "正常" : "异常" }}</el-tag>
              </template>
            </el-table-column>

            <el-table-column prop="num" label="累计刷卡次数"></el-table-column>
          </el-table>
          <el-pagination style="margin-top:10px;" background layout="prev, pager, next" :total="2"></el-pagination>
        </div>
      </el-col>
    </el-row>

    <el-dialog
      class="dialog-rewrite"
      :title="'编号: '+ detailDialog.name"
      :visible.sync="dialogFormVisible"
    >
      <el-tabs type="card" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="详细信息" name="详细信息">
          <p class="detai-info">关联房屋:{{detailDialog.houseRelative}}</p>
          <p class="detai-info">最近刷卡时间:{{detailDialog.createDate}}</p>
        </el-tab-pane>
        <el-tab-pane label="通行记录" name="通行记录">
          <el-table :data="dtailTable" style="width: 100%">
            <el-table-column prop="name" label="姓名" width="150px"></el-table-column>
            <el-table-column prop="date" label="通行时间" width="150px"></el-table-column>
            <el-table-column prop="address" label="通行地址"></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="dialogFormVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="dialogCreate" width="30%" :before-close="handleClose">
      <span>这是门禁卡管理新增</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogCreate = false">取 消</el-button>
        <el-button type="primary" @click="dialogCreate = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- <dialog-form :dialogCreate.sync="dialogCreate" /> -->
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
export default class CardManage extends Vue {
  private cardList: Array<Object> = [
    {
      name: "0000001",
      houseRelative: "1-1-203",
      createDate: "2019-9-26",
      type: 2,
      showMenu: false,
      num: "--"
    },
    {
      name: "00000002",
      houseRelative: "1-1-203",
      createDate: "2019-9-26",
      type: 1,
      showMenu: false,
      num: "--"
    },
    {
      name: "00000003",
      houseRelative: "1-1-203",
      createDate: "2019-9-26",
      type: 1,
      showMenu: false,
      num: "--"
    },
    {
      name: "00000004",
      houseRelative: "1-1-203",
      createDate: "2019-9-26",
      type: 1,
      showMenu: false,
      num: "--"
    }
  ];
  TimeRange: Array<string> = [];
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
  private dialogCreate: Boolean = false; // 新增弹出表单

  private detailDialog: Object = {
    //查看目标详情
    name: ""
  };
  private activeName: String = "详细信息";
  private dtailTable: Array<Object> =[
    {
      date: "2016-05-02";
      name: "王小虎";
      address: "上海市普陀区金沙江路 1518 弄";
    },
    {
      date: "2016-05-04";
      name: "王小虎";
      address: "上海市普陀区金沙江路 1517 弄";
    },
    {
      date: "2016-05-01";
      name: "王小虎";
      address: "上海市普陀区金沙江路 1519 弄";
    },
    {
      date: "2016-05-03";
      name: "王小虎";
      address: "上海市普陀区金沙江路 1516 弄";
    }
  ];

  editType(item) {
    /**@description 修改状态 */
    console.log(item);
    // this.dialogFormVisible = true;
  }

  enterRowChange(row, column, cell, event) {
    /**@description hover enter tab 行 */
    row.showMenu = true;
  }

  leaveRowChange(row) {
    /**@description hover leave tab 行 */
    row.showMenu = false;
  }

  handleClick() {}

  queryIdetity(row) {
    this.detailDialog = row;
    this.dialogFormVisible = true;
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
  top: 12px;
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
</style>

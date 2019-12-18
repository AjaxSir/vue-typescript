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
              <span class="filter-name">图书馆名称:</span>
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
          <el-table
            :data="cardList"
            stripe

            highlight-current-row
            @cell-mouse-enter="enterRowChange"
            @cell-mouse-leave="leaveRowChange"
          >
            <el-table-column type="selection" width="50"></el-table-column>

            <el-table-column type="index" label="序号" width="50"></el-table-column>

            <el-table-column prop="name" label="图书馆名称">
              <template slot-scope="scope">
                <el-button
                  style="padding:0px;"
                  type="text"
                  @click="queryIdetity(scope.row)"
                >{{scope.row.name}}</el-button>
                <div class="fun-btn">
                  <el-dropdown trigger="click" placement="bottom-start">
                       <el-tooltip class="item" effect="dark" content="点击操作" placement="top">
                      <i v-show="scope.row.showMenu" class="iconfont icon-menu"></i>
                    </el-tooltip>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>修改</el-dropdown-item>
                      <el-dropdown-item>删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="createDate" label="开放时段"></el-table-column>

            <el-table-column prop="personNum" label="当前人数"></el-table-column>

            <el-table-column prop="remark" label="备注"></el-table-column>
          </el-table>
          <el-pagination style="margin-top:10px;" background layout="prev, pager, next" :total="2"></el-pagination>
        </div>
      </el-col>
    </el-row>
    <el-dialog title="提示" :visible.sync="dialogCreate" width="30%" :before-close="handleClose">
      <span>这是图书馆管理添加</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogCreate = false">取 消</el-button>
        <el-button type="primary" @click="dialogCreate = false">确 定</el-button>
      </span>
    </el-dialog>
    <library-dialog :formShow.sync="dialogLibrary" :dialogData="dialogData" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import mixin from "@/config/minxins";

const ActionHeader = () => import("@/components/ActionHeader.vue");
const DataTree = () => import("@/components/DataTree.vue");
const LibraryDialog = () => import("./libraryDialog.vue");

@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    DataTree,
    LibraryDialog
  }
})
export default class LibraryManage extends Vue {
  private cardList: Array<Object> = [
    {
      name: "图书馆1",
      createDate: "2019-9-26",
      showMenu: false,
      personNum: 2,
      remark: "--"
    },
    {
      name: "图书馆2",
      createDate: "2019-9-26",
      showMenu: false,
      personNum: 4,
      remark: "--"
    },
    {
      name: "图书馆3",
      createDate: "2019-9-26",
      showMenu: false,
      personNum: 6,
      remark: "--"
    }
  ];

  private rowSpan: any = {
    row1: 4,
    row2: 20
  };

  private TimeRange: any = ""; //选中的时间
  private dialogLibrary: any = false;

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
    this.dialogLibrary = true;
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


// .menu-control {
//   position: absolute;
//   top: 32vh;
//   left: -5px;
// }

// .menu-visible {
//   position: absolute;
//   top: 32vh;
//   left: -15px;
// }

.close-menu {
  width: 10px;
  height: 48px;
  background: #acb7c1;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  position: relative;
}

// .icon-class {
//   font-size: 12px;
//   color: #e7eaeb;
//   cursor: pointer;
//   line-height: 48px;
//   position: absolute;
//   left: -1px;
// }

.capture-img {
  width: 60px;
}
</style>

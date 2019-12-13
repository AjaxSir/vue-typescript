<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <action-header :total="1">
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="export">导出</el-dropdown-item>
          </el-dropdown-menu>
          <div slot="houseNum">
            <!-- <span class="word-filter">
              发布对象:
              <el-input class="word-filter" size="small"></el-input>
            </span>-->
            <div class="word-filter">
              <span class="filter-name">发布对象:</span>
              <el-input class="input-filter" size="small"></el-input>
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

            <el-table-column prop="name" label="标题" align="center">
              <template slot-scope="scope">
                <el-button style="padding:0px;" type="text" @click="queryIdetity">{{scope.row.name}}</el-button>
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

            <el-table-column prop="xb" align="center" label="发布内容"></el-table-column>

            <el-table-column prop="xq" label="发布对象" align="center"></el-table-column>

            <el-table-column prop="tjsj" label="发布时间" align="center"></el-table-column>

            <el-table-column prop="zp" label="到达情况" align="center"></el-table-column>

            <el-table-column prop="type" label="状态">
              <template slot-scope="scope">
                <el-tag
                  size="small"
                  style="border-radius: 50px;padding: 0 10px; cursor: pointer;"
                  :type="scope.row.type === 1 ? 'success' : 'danger'"
                >{{ scope.row.type === 1 ? "成功" : "失败" }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-pagination style="margin-top:10px;" background layout="prev, pager, next" :total="2"></el-pagination>
      </el-col>
    </el-row>
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
export default class InformIssue extends Vue {
  private cardList: Array<Object> = [
    {
      name: "XXXXX",
      zb: "男",
      xb: "--",
      zp: "--",
      xq: "张三",
      tjsj: "2019/8/21",
      type: 1
    }
  ];
  private rowSpan: any = {
    row1: 4,
    row2: 20
  };

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

  editType(item) {
    /**@description 修改状态 */
    console.log(item);
    // this.dialogFormVisible = true;
  }

  queryIdetity() {
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
td {
  padding: 6px 0px;
}
.demo-block {
  border: 1px solid #ebebeb;
  border-radius: 3px;
}

.serial-num {
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

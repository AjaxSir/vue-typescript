<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <ActionHeader :btnStatus="false" :total="1">
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>次数统计</el-dropdown-item>
          </el-dropdown-menu>
          <div slot="houseNum">
            <div class="word-filter">
              <span class="filter-name">姓名:</span>
              <el-input class="input-filter" size="small"></el-input>
            </div>
          </div>
        </ActionHeader>
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

            <el-table-column prop="name" label="姓名">
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

            <el-table-column prop="phone" label="电话"></el-table-column>

            <el-table-column prop="email" label="邮箱"></el-table-column>
          </el-table>
          <el-pagination style="margin-top:10px;" background layout="prev, pager, next" :total="2"></el-pagination>
        </div>
      </el-col>
    </el-row>

    <!-- <library-dialog :formShow.sync="dialogLibrary" /> -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import mixin from "@/config/minxins";

const ActionHeader = () => import("@/components/ActionHeader.vue");
const DataTree = () => import("@/components/DataTree.vue");
// const LibraryDialog = () => import("./libraryDialog.vue");

@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    DataTree
    // LibraryDialog
  }
})
export default class CardManage extends Vue {
  private cardList: Array<Object> = [
    {
      name: "zhang3",
      phone: "18227645841",
      showMenu: false,
      email: "ll06@foxmail.com"
    },
    {
      name: "li4",
      phone: "18227645841",
      showMenu: false,
      email: "ll06@foxmail.com"
    },
    {
      name: "wang2",
      phone: "18227645841",
      showMenu: false,
      email: "ll06@foxmail.com"
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

  queryIdetity(val) {
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

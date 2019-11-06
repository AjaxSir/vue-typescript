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
            <span class="word-filter">
              <span class="filter-name">状态:</span>
              <el-select v-model="deviceStatus" placeholder="请选择" class="input-filter" size="small">
                <el-option label="全部" value="all"></el-option>
                <el-option label="离线" value="offline"></el-option>
                <el-option label="在线" value="online"></el-option>
              </el-select>
            </span>
          </div>
        </action-header>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <transition name="el-fade-in-linear">
        <!-- <div v-show="show" class="transition-box">.el-fade-in-linear</div> -->
      </transition>
      <el-col :span="rowSpan.row1">
        <data-tree />
      </el-col>

      <el-col :span="rowSpan.row2" class="table-col">
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

            <el-table-column prop="name" label="设备编号" width="90">
              <template slot-scope="scope">
                <span class="serial-num">{{scope.row.name}}</span>
                <div class="fun-btn">
                  <el-dropdown trigger="click" placement="bottom-start">
                    <i v-show="scope.row.showMenu" class="iconfont icon-menu"></i>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>修改</el-dropdown-item>
                      <el-dropdown-item>删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="houseRelative" label="单元信息"></el-table-column>

            <el-table-column prop="carNum" label="设备型号"></el-table-column>

            <el-table-column prop="createDate" label="上线时间" width="160"></el-table-column>

            <el-table-column prop="num" label="故障次数"></el-table-column>

            <el-table-column prop="type" label="状态">
              <template slot-scope="scope">
                <el-tag
                  size="small"
                  style="border-radius: 50px;padding: 0 10px; cursor: pointer;"
                  :type="scope.row.type === 1 ? 'success' : 'danger'"
                  @click="editType(scope.row)"
                >{{ scope.row.type === 1 ? "连线中" : "离线中" }}</el-tag>
              </template>
            </el-table-column>

            <el-table-column prop="createDate" label="创建时间" width="160"></el-table-column>
          </el-table>
        </div>
        <el-pagination style="margin-top:10px;" background layout="prev, pager, next" :total="2"></el-pagination>

        <div :class="rowSpan.row1===4 ? menuControl1 : menuControl2" @click="menuVisible">
          <p class="close-menu">
            <i v-if="rowSpan.row1===4" class="iconfont icon-left icon-class"></i>
            <i v-else class="iconfont icon-zuo icon-class"></i>
          </p>
        </div>
      </el-col>
    </el-row>
    <el-dialog title="提示" :visible.sync="dialogCreate" width="30%" :before-close="handleClose">
      <span>这是设备管理新增</span>
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

@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    DataTree
  }
})
export default class CardManage extends Vue {
  private cardList: Array<Object> = [
    {
      name: "123",
      houseRelative: "东区-1栋-1-1",
      carNum: "XX门禁",
      createDate: "2019-10-10 12:12:12",
      type: 1,
      showMenu: false,
      num: 0
    },
    {
      name: "123",
      houseRelative: "东区-1栋-1-1",
      carNum: "XX门禁",
      createDate: "2019-10-10 12:12:12",
      type: 2,
      showMenu: false,
      num: 0
    },
    {
      name: "123",
      houseRelative: "东区-1栋-1-1",
      carNum: "XX门禁",
      createDate: "2019-10-10 12:12:12",
      type: 1,
      showMenu: false,
      num: 0
    }
  ];

  private rowSpan: any = {
    row1: 4,
    row2: 20
  };
  deviceStatus: String = "all";
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

.capture-img {
  width: 60px;
}
</style>

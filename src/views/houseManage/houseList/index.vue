<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <action-header :houseStatus='true' :btnStatus='0' :total="1">
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>导入</el-dropdown-item>
            <el-dropdown-item>导出</el-dropdown-item>
            <el-dropdown-item>统计信息</el-dropdown-item>
          </el-dropdown-menu>
          <div slot="houseNum">
            <div class="word-filter">
              <span class="filter-name">房屋编号:</span>
              <el-input class="input-filter" placeholder='输入房屋编号筛选' size="small"></el-input>
            </div>
            <div class="word-filter">
              <span class="filter-name">进出次数:</span>
              <el-input class="input-filter" style='width:80px' size="small"></el-input>
              &nbsp;&nbsp;&nbsp;至&nbsp;&nbsp;&nbsp;
              <el-input class="input-filter" style='width:80px' size="small"></el-input>&nbsp;&nbsp;&nbsp;次
            </div>
            <div class="word-filter">
              <span class="filter-name">访客次数:</span>
              <el-input class="input-filter" style='width:80px' size="small"></el-input>
              &nbsp;&nbsp;&nbsp;至&nbsp;&nbsp;&nbsp;
              <el-input class="input-filter" style='width:80px' size="small"></el-input>&nbsp;&nbsp;&nbsp;次
            </div>
            <div class="word-filter">
              <span class="filter-name">所属楼层:</span>
              <el-input class="input-filter" placeholder='输入房屋楼层筛选' size="small"></el-input>
            </div>
          </div>
        </action-header>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="rowSpan.row1">
        <data-tree
        @getHouseTreeData='getHouseTreeData'
        :TreeData='TreeData' />
      </el-col>

      <el-col :span="rowSpan.row2" class="table-col">
        <div class="rightContent">
          <el-table
            :data="list_data"
            stripe
            class="demo-block"
            highlight-current-row
            @cell-mouse-enter="enterRowChange"
            @cell-mouse-leave="leaveRowChange"
          >
            <el-table-column type="selection" width="50"></el-table-column>

            <el-table-column type="index" label="序号" width="50"></el-table-column>

            <el-table-column class="serial-num" prop="name" label="所属楼栋">
              <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
                <div class="fun-btn">
                  <el-dropdown trigger="click" placement="bottom-start" @command='commandClick'>
                    <i v-show="scope.row.showMenu" class="iconfont icon-menu"></i>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item :command='returnCommand("update", scope.row)'>远程开门</el-dropdown-item>
                      <el-dropdown-item :command='returnCommand("delete", scope.row)'>删除</el-dropdown-item>
                      <el-dropdown-item :command='returnCommand("delete", scope.row)'>批量删除</el-dropdown-item>
                      <el-dropdown-item :command='returnCommand("delete", scope.row)'>编辑信息</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="houseRelative" label="所属单元"></el-table-column>

            <el-table-column prop="createDate" label="房屋编号">
              <template slot-scope="scope">
                <el-button
                  style="padding:0px;"
                  type="text"
                  @click="queryIdetity(scope.row)"
                >{{scope.row.createDate}}</el-button>
              </template>
            </el-table-column>

            <el-table-column prop="num" label="注册人数"></el-table-column>

            <el-table-column prop="num" label="累计访客次数"></el-table-column>

            <el-table-column prop="num" label="累计进出次数"></el-table-column>

            <el-table-column prop="num" label="昨日进出次数"></el-table-column>

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

            <el-table-column prop="num" label="备注"></el-table-column>
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
        <el-tab-pane label="在住人员" name="在住人员">
          <el-table :data="dtailTable" style="width: 100%">
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="date" label="年龄"></el-table-column>
            <el-table-column prop="address" label="房屋"></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="dialogFormVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import mixin from "@/config/minxins";
import { getHouseTreeData } from '@/api/houseApi.ts'
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
  private rowSpan: any = {
    row1: 4,
    row2: 20
  };
  TreeData: Array<Object> = [] // 树形结构数据
  private menuControl1: String = "menu-control";
  private menuControl2: String = "menu-visible";

  private dialogFormVisible: Boolean = false;

  private detailDialog: Object = {
    //查看目标详情
    name: ""
  };
  private activeName: String = "详细信息";
  private dtailTable: Array<Object> =[
    {
      date: "30",
      name: "王小虎",
      address: "1-1-620"
    },
    {
      date: "30",
      name: "王小虎",
      address: "1-1-620"
    },
    {
      date: "30",
      name: "王小虎",
      address: "1-1-620"
    },
    {
      date: "30",
      name: "王小虎",
      address: "1-1-620"
    }
  ];
  getHouseTreeData() {
    console.log('执行')
    getHouseTreeData().then((res: Object) => {
      this.TreeData = res['data']['data']
    })
  }
  created() {
    this.getHouseTreeData()
  }
  editType(item) {
    /**@description 修改状态 */
    console.log(item);
    // this.dialogFormVisible = true;
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
  top: 8px;
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

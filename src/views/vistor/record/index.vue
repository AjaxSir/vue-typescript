<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <ActionHeader
          ref="actionHeader"
          :moreStatus="false"
          :btnStatus="2"
          :initFormHeader="initForm"
          @fetchData="fetchData"
          :filterForm="filterForm"
          :total="page.total"
          :exportUrl="'/v1/admin/usr-visitor/export/'"
          :exportName="'访客登记记录'"
        >
          <div slot="houseNum">
            <div class="word-filter">
              <span class="filter-name">访客姓名:</span>
              <el-input
                class="input-filter"
                size="small"
                v-model="filterForm.name"
                clearable
                placeholder="请输入访客姓名"
                @keyup.enter.native="emitFetchData"
              ></el-input>
            </div>
            <div class="word-filter">
              <span class="filter-name">受访姓名:</span>
              <el-input
                class="input-filter"
                size="small"
                v-model="filterForm.visitName"
                clearable
                placeholder="请输入受访者姓名"
                @keyup.enter.native="emitFetchData"
              ></el-input>
            </div>
            <div class="word-filter">
              <span class="filter-name">联系电话:</span>
              <el-input
                class="input-filter"
                size="small"
                v-model="filterForm.cardNo"
                placeholder="请输入联系电话"
                clearable
                @keyup.enter.native="emitFetchData"
                @keyup.native="filterNumber"
                @keydown.native="filterNumber"
              ></el-input>
              <!-- <span>{{phoneNum}}/11</span> -->
            </div>

            <div class="word-filter">
              <span class="filter-name filter-rewrite">访客类型:</span>
              <el-select
                class="select-class"
                size="small"
                v-model="filterForm.visitType"
                placeholder="请选择访客类型"
              >
                <el-option
                  v-for="item in visitType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>

            <div class="word-filter">
              <span class="filter-name filter-rewrite">访客状态:</span>
              <el-select
                class="select-class"
                size="small"
                v-model="filterForm.status"
                placeholder="请选择访客状态"
              >
                <el-option
                  v-for="item in selectType"
                  :key="item.command"
                  :label="item.lable"
                  :value="item.command"
                ></el-option>
              </el-select>
            </div>

            <div class="word-filter">
              <span class="filter-name filter-rewrite">有效时间:</span>
              <el-date-picker
                :picker-options="pickerOptions"
                v-model="dateRange"
                type="datetimerange"
                size="small"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy - MM - dd HH:mm:ss"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="dateRangeChange"
              ></el-date-picker>
            </div>

            <div class="word-filter">
              <span class="filter-name filter-rewrite">创建时间:</span>
              <el-date-picker
                :picker-options="pickerOptions"
                v-model="createDateRange"
                type="datetimerange"
                size="small"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy - MM - dd HH:mm:ss"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="dateRangeChange"
              ></el-date-picker>
            </div>
          </div>
        </ActionHeader>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="rowSpan.row1">
        <div class="content tree-rename">
          <div class="treeHeader">
            <i class="iconfont icon-shuji"></i>
            所有
          </div>
          <el-tree
            :data="TreeData"
            node-key="id"
            :props="dataFormate"
            default-expand-all
            :highlight-current="true"
            :expand-on-click-node="false"
            @node-click="handleNodeClick"
          >
            <span class="custom-tree-node" slot-scope="{ node }">
              <span>{{ node.label }}</span>

              <p v-if="node.label === deviceName" class="choose-target">
                <i class="el-icon-success"></i>
              </p>
            </span>
          </el-tree>
        </div>
      </el-col>
      <el-col :span="rowSpan.row2" class="table-col">
        <div class="rightContent">
          <el-table
            height="65vh"
            v-loading="showLoading"
            :data="list_data"
            stripe
            highlight-current-row
            @cell-mouse-enter="enterRowChange"
            @cell-mouse-leave="leaveRowChange"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="50" align="center"></el-table-column>
            <el-table-column type="index" align="center" label="序号" class="indexNum" width="50">
              <template slot-scope="scope">
                <span>{{scope.$index+1}}</span>
                <div class="fun-btn">
                  <el-dropdown trigger="click" placement="bottom-start" @command="commandClick">
                    <el-tooltip class="item" effect="dark" content="点击操作" placement="top">
                      <i v-show="scope.row.showMenu" class="iconfont icon-menu"></i>
                    </el-tooltip>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        :command="returnCommand('delete', scope.row)"
                      >{{ deleteForm.data.length ? '批量删除' : '删除' }}</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="name" align="center" label="姓名"></el-table-column>
            <el-table-column prop="phone" label="电话" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column
              prop="visitName"
              label="受访人姓名"
              align="center"
              width="100px"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column
              prop="visitType"
              label="访客类型"
              align="center"
              width="101"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <span>{{scope.row.visitType ==='1' ?'APP' : scope.row.visitType ==='2' ?'访客机' : '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="cardName"
              label="证件类型"
              align="center"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column
              prop="cardNo"
              label="证件号码"
              align="center"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column
              prop="createTime"
              label="注册时间"
              align="center"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column prop="status" label="状态" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{statusFilter(scope.row.status)}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="visitTime"
              label="到访时间"
              align="center"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column
              prop="invalidDate"
              label="有效期"
              align="center"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column prop="photo" label="人脸信息" align="center">
              <template slot-scope="scope">
                <img class="capture-img" :src="scope.row.photo" alt />
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            @current-change="pageChange"
            style="margin-top:10px;"
            background
            layout="prev, pager, next,total"
            :page-size="page.limit"
            :total="page.total"
          ></el-pagination>

          <div :class="rowSpan.row1===3 ? menuControl1 : menuControl2" @click="menuVisible">
            <p class="close-menu">
              <i v-if="rowSpan.row1===3" class="iconfont icon-left icon-class"></i>
              <i v-else class="iconfont icon-zuo icon-class"></i>
            </p>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import mixin from "@/config/minxins";
import {
  regDevice // 获取注册机
} from "@/api/vistorApi.ts";
const ActionHeader = () => import("@/components/ActionHeader.vue");

const DataTree = () => import("@/components/DataTree.vue");

@Component({
  mixins: [mixin],
  components: {
    DataTree,
    ActionHeader
  }
})
export default class VistorRegister extends Vue {
  filterForm: object = {
    regDevId: null, //目标设备
    name: null, //来访者姓名
    visitName: null, //受访者姓名
    startCreateTime: null, //创建开始时间
    endCreateTime: null, //创建结束时间
    endInvalidDate: null, //有效期开始时间
    startInvalidDate: null, //有效期结束时间
    visitType: null, //访客类型
    status: null //访客状态
  }; //根据关键字查询

  pickOptionStart: object = {}; //按照时间段查询的开始时间
  pickOptionEnd: object = {}; //按照时间段查询的结束时间

  private commandType: string = "all"; //根据访客类型筛选 all默认为显示全部
  private commandStatus: String = "0"; //根据访客状态  0 默认显示为全部
  private pitchOn: string = "y"; //选中A
  private unchecked: string = "n"; //未选中
  private rowSpan: any = {
    row1: 3,
    row2: 21
  };
  private menuControl1: String = "menu-control";
  private menuControl2: String = "menu-visible";

  TreeData: Array<Object> = []; // 树形结构数据
  private deviceName: any = "";

  dataFormate: Object = {
    children: "sonBuildGroups",
    label: "name"
  };

  initForm: object = {
    //获取车辆列表url
    url: "/admin/usr-visitor/",
    method: "get"
  };

  deleteForm: Object = {
    //单个或批量删除
    url: "/admin/usr-visitor/batch-delete/",
    method: "delete",
    data: []
  };

  private selectType: Array<Object> = [
    {
      command: null,
      lable: "全部"
    },
    {
      command: "2",
      lable: "正常"
    },
    {
      command: "1",
      lable: "未开始"
    },
    {
      command: "4",
      lable: "其他"
    },
    {
      command: "3",
      lable: "已结束"
    }
  ];

  visitType: Array<Object> = [
    //车辆类型筛选
    {
      label: "全部",
      value: null
    },
    {
      label: "App",
      value: "1"
    },
    {
      label: "访客机",
      value: "2"
    }
  ];

  statusFilter(status) {
    /** @description 状态显示过滤 */
    switch (status) {
      case "1":
        return "未开始";
      case "2":
        return "正常";
      case "3":
        return "已结束";
      case "4":
        return "其他";
    }
  }

  pickerOptions: Object = {};
  dateRange: Array<Object> = [];
  createDateRange: Array<Object> = [];

  mounted() {
    const _this = this;
    this.pickerOptions = {
      // 处理可选的时间范围
      disabledDate(time) {
        return time.getTime() > Date.now();
      }
    };
  }

  dateRangeChange() {
    if (this.dateRange) {
      this.filterForm["startInvalidDate"] = this.dateRange[0];
      this.filterForm["endInvalidDate"] = this.dateRange[1];
    } else {
      this.filterForm["startInvalidDate"] = null;
      this.filterForm["endInvalidDate"] = null;
    }
    if (this.createDateRange) {
      this.filterForm["startCreateTime"] = this.createDateRange[0];
      this.filterForm["endCreateTime"] = this.createDateRange[1];
    } else {
      this.filterForm["startCreateTime"] = null;
      this.filterForm["endCreateTime"] = null;
    }
  }

  handleSelectionChange(val) {
    /**@description  获取需要操作的数据列表 */
    this.deleteForm["data"] = [];
    val.forEach(ele => {
      this.deleteForm["data"].push(ele.id);
    });
  }

  created() {
    this.getDevice();
    this.filterForm["regDevId"] = this.$route.query.id;
    this.deviceName = this.$route.query.name;
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    ); // 合并参数
  }

  async getDevice() {
    /**@description 获取注册设备 */
    const { data } = await regDevice();
    this.TreeData = data.data;
  }

  async handleNodeClick(val) {
    /**@description 树节点点击事件 */
    this.filterForm["regDevId"] = val.id;
    this.deviceName = val.name;
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    );
    this["fetchData"](this.initForm);
  }

  refreshInfo() {
    /**@description 刷新数据 */
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    );
    this["fetchData"](this.initForm);
  }

  menuVisible() {
    /**@description 控制楼栋 */
    if (this.rowSpan.row1 === 3) {
      this.rowSpan = {
        row1: 0,
        row2: 24
      };
    } else {
      this.rowSpan = {
        row1: 3,
        row2: 21
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
.leftContent {
  flex: none;
  width: 200px;
}

.rightContent {
  flex: 1;
  box-shadow: 0px 6px 5px 0px lightgray;
  position: relative;
}

.menu-control {
  position: absolute;
  top: 32vh;
  left: -10px;
}

.menu-visible {
  position: absolute;
  top: 32vh;
  left: -11px;
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

.content {
  width: 100%;
  height: 70vh;
  text-align: left;
  border: 1px solid #ebeef5;
}
.treeHeader {
  width: 100%;
  height: 40px;
  text-align: left;
  text-indent: 1em;
  line-height: 40px;
  position: relative;
  i {
    font-size: 20px;
  }
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.choose-target {
  color: #20a0ff;
}
.el-dropdown-link {
  color: #20a0ff;
}
.y {
  color: #20a0ff;
  background: #ecf5ff;
}
.n {
  color: black;
  background: #fff;
}
.close-menu {
  width: 10px;
  height: 48px;
  background: #acb7c1;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  position: relative;
}
</style>

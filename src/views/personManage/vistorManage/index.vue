<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <!--
          houseStatus: 住宅管理是否显示
          initFormHeader: 初始化的地址 方式
          fetchData: 筛选后重新init
          filterForm: 关键字查询条件
          dialogCreate:新增弹出框
          btnStatus:2为显示导出按钮 1为显示新增按钮
          moreStatus:是否显示 更多菜单 按钮
          exportUrl:导出路径
          exportName:导出文件名
          total:总条数
        -->
        <ActionHeader
          :btnStatus="2"
          :initFormHeader="initForm"
          @fetchData="fetchData"
          :filterForm="filterForm"
          :total="page.total"
          :exportUrl="'/v1/admin/usr-visitor/export/'"
          :exportName="'访客列表'"
        >
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>进出次数排序</el-dropdown-item>
            <!-- <el-dropdown-item>滞留时间排序</el-dropdown-item> -->
            <el-dropdown-item>次数统计</el-dropdown-item>
          </el-dropdown-menu>
          <div slot="houseNum">
            <div class="word-filter">
              <span class="filter-name">访客姓名:</span>
              <el-input class="input-filter" size="small" v-model="filterForm.name"></el-input>
            </div>
            <div class="word-filter">
              <span class="filter-name">受访姓名:</span>
              <el-input class="input-filter" size="small" v-model="filterForm.visitName"></el-input>
            </div>
            <div class="word-filter">
              <span class="filter-name">身份证号:</span>
              <el-input class="input-filter" size="small" v-model="filterForm.cardNo"></el-input>
            </div>
            <div class="word-filter">
              <span class="filter-name">同行人数:</span>
              <el-input style="width:165px" size="small" v-model="filterForm.minNumPeople"></el-input>&nbsp;&nbsp;-&nbsp;&nbsp;
              <el-input style="width:165px" size="small" v-model="filterForm.maxNumPeople"></el-input>
            </div>
            <div class="word-filter">
              <span class="filter-name">有效时间:</span>
              <el-date-picker
                size="small"
                style="width:165px"
                :picker-options="pickOptionStart"
                v-model="filterForm.startInvalidDate"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期"
              ></el-date-picker>&nbsp;&nbsp;-&nbsp;&nbsp;
              <el-date-picker
                size="small"
                style="width:165px"
                v-model="filterForm.endInvalidDate"
                :picker-options="pickOptionEnd"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期"
              ></el-date-picker>
            </div>
            <div class="word-filter">
              <span class="filter-name">创建时间:</span>
              <el-date-picker
                size="small"
                style="width:165px"
                :picker-options="pickOptionStart"
                v-model="filterForm.startCreateTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期"
              ></el-date-picker>&nbsp;&nbsp;-&nbsp;&nbsp;
              <el-date-picker
                size="small"
                style="width:165px"
                v-model="filterForm.endCreateTime"
                :picker-options="pickOptionEnd"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期"
              ></el-date-picker>
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
            <el-table-column type="index" width="50" align="center" label="编号"></el-table-column>

            <el-table-column prop="name" width="70" align="center" label="姓名"></el-table-column>
            <el-table-column prop="phone" min-width="90" align="center" label="电话"></el-table-column>
            <el-table-column prop="visitName" align="center" label="受访人姓名">
              <template slot-scope="{ row }">
                <el-button type="text" @click="showDetail(row)">{{ row.visitName }}</el-button>
              </template>
            </el-table-column>

            <el-table-column prop="vistor_type" width="101" align="center" label="访客类型">
              <template slot="header" slot-scope="scope">
                <el-dropdown style="padding:0;" trigger="click" @command="filterFace">
                  <span class="el-dropdown-link">
                    访客类型
                    <i class="el-icon-caret-bottom el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      command="all"
                      :class="commandType==='all' ? pitchOn : unchecked"
                    >全部</el-dropdown-item>
                    <el-dropdown-item
                      command="App"
                      :class="commandType==='App' ? pitchOn : unchecked"
                    >APP</el-dropdown-item>
                    <el-dropdown-item
                      command="注册机"
                      :class="commandType==='注册机' ? pitchOn : unchecked"
                    >注册机</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
              <template slot-scope="scope">
                <span>{{scope.row.visitType}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="cardNo" align="center" label="身份证号"></el-table-column>
            <el-table-column prop="visitTime" min-width="130" align="center" label="访问时间"></el-table-column>
            <el-table-column prop="buildingName" align="center" label="所属楼栋"></el-table-column>
            <el-table-column prop="houseName" align="center" label="房屋编号"></el-table-column>
            <el-table-column prop="status" align="center" label="状态">
              <template slot-scope="scope">
                <span>{{statusFilter(scope.row.status)}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="numPeople" align="center" label="同行人数"></el-table-column>
            <el-table-column prop="createTime" min-width="130" align="center" label="创建时间"></el-table-column>
            <el-table-column prop="invalidDate" min-width="130" align="center" label="有效时间"></el-table-column>

            <!-- <el-table-column prop="all_times" align="center" label="累计访问次数"></el-table-column> -->
            <!-- <el-table-column prop="last_time" align="center" label="最近访问时间"></el-table-column> -->
          </el-table>
        </div>
        <el-pagination
          @current-change="pageChange"
          style="margin-top:10px;"
          background
          layout="prev, pager, next,total"
          :page-size="page.limit"
          :total="page.total"
        ></el-pagination>
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
  filterForm: object = {
    name: null, //来访者姓名
    visitName: null, //受访者姓名
    cardNo: null, //身份证号
    minNumPeople: null, //最小随行人数
    maxNumPeople: null, //最大随行人数
    startCreateTime: null, //创建开始时间
    endCreateTime: null, //创建结束时间
    endInvalidDate: null, //有效期开始时间
    startInvalidDate: null, //有效期结束时间
    visitType: null //访客类型
  }; //根据关键字查询
  initForm: object = {
    //获取访客名单列表url
    url: "/admin/usr-visitor/",
    method: "get"
  };

  private commandType: string = "all"; //根据访客类型筛选 默认为显示全部
  private pitchOn: string = "y"; //选中A
  private unchecked: string = "n"; //未选中
  private activeName: string = "first";
  private dialogFormVisible: boolean = false;
  private title: string = "详情";
  private Dialog: Object = {
    name: ""
  };

  pickOptionStart: object = {}; //按照时间段查询的开始时间
  pickOptionEnd: object = {}; //按照时间段查询的结束时间

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

  mounted() {
    const _this = this;
    this.pickOptionStart = {
      disabledDate(time) {
        if (_this.filterForm["endCreateTime"] !== "") {
          return (
            time.getTime() > Date.now() ||
            time.getTime() > _this.filterForm["endCreateTime"]
          );
        } else {
          return time.getTime() > Date.now();
        }
      }
    };
    this.pickOptionEnd = {
      disabledDate(time) {
        return (
          time.getTime() < _this.filterForm["startCreateTime"] ||
          time.getTime() > Date.now()
        );
      }
    };
  }

  created() {
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    ); // 合并参数
  }

  filterFace(command) {
    /**@description 对访客类型进行筛选 */
    this.commandType = command;
    if (command === "all") {
      this.filterForm["visitType"] = null;
    } else this.filterForm["visitType"] = command;
    this.refreshInfo();
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
</style>

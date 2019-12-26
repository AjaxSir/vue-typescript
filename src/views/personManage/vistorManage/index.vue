<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <!--
          houseStatus: 住宅管理是否显示
          initFormHeader: 初始化的地址 方式
          fetchData: 筛选后重新init
          filterForm: 关键字查询条件
          dialogCreate:添加弹出框
          btnStatus:2为显示导出按钮 1为显示添加按钮
          moreStatus:是否显示 更多菜单 按钮
          exportUrl:导出路径
          exportName:导出文件名
          total:总条数
        -->
        <ActionHeader
          ref="actionHeader"
          :btnStatus="2"
          :initFormHeader="initForm"
          @fetchData="fetchData"
          :filterForm="filterForm"
          :total="page.total"
          :exportUrl="'/v1/admin/usr-visitor/export/'"
          :exportName="'访客列表'"
        >
          <el-dropdown-menu slot="dropdown">
            <router-link to="/statementManage/visitorChart">
              <el-dropdown-item>进出次数排序</el-dropdown-item>
            </router-link>
            <router-link to="/statementManage/visitorChart">
              <el-dropdown-item>次数统计</el-dropdown-item>
            </router-link>
          </el-dropdown-menu>
          <div slot="houseNum">
            <div class="word-filter">
              <span class="filter-name">访客姓名:</span>
              <el-input
                class="input-filter"
                size="small"
                v-model="filterForm.name"
                placeholder="请输入访客姓名"
                clearable
                @keyup.enter.native="emitFetchData"
              ></el-input>
            </div>

            <div class="word-filter">
              <span class="filter-name">受访姓名:</span>
              <el-input
                class="input-filter"
                size="small"
                v-model="filterForm.visitName"
                placeholder="请输入受访人姓名"
                clearable
                @keyup.enter.native="emitFetchData"
              ></el-input>
            </div>

            <div class="word-filter">
              <span class="filter-name">证件号码:</span>
              <el-input
                class="input-filter"
                size="small"
                v-model="filterForm.cardNo"
                placeholder="请输入证件号码"
                clearable
                @keyup.enter.native="emitFetchData"
              ></el-input>
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

            <div class="word-filter">
              <span class="filter-name filter-rewrite">同行人数:</span>
              <el-input
                style="width:165px"
                size="small"
                min="0"
                v-model.number="filterForm.minNumPeople"
                type="number"
                placeholder="同行人数"
                clearable
                @keydown.native="channelInputLimit"
              ></el-input>&nbsp;&nbsp;-&nbsp;&nbsp;
              <el-input
                style="width:165px"
                size="small"
                min="0"
                v-model.number="filterForm.maxNumPeople"
                type="number"
                placeholder="同行人数"
                clearable
                @keyup.enter.native="emitFetchData"
                @keydown.native="channelInputLimit"
              ></el-input>
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
          </div>
        </ActionHeader>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="rightContent">
          <el-table
            height="61vh"
            v-loading="showLoading"
            :data="list_data"
            stripe
            highlight-current-row
            @cell-mouse-enter="enterRowChange"
            @cell-mouse-leave="leaveRowChange"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="50"></el-table-column>
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

            <el-table-column prop="name" align="center" label="访客姓名" :show-overflow-tooltip="true">
              <template slot-scope="{ row }">
                <el-button type="text" @click="showDetail(row)">{{ row.name }}</el-button>
              </template>
            </el-table-column>

            <el-table-column prop="status" align="center" label="状态" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{statusFilter(scope.row.status)}}</span>
              </template>
            </el-table-column>

            <el-table-column prop="phone" align="center" label="访客电话" :show-overflow-tooltip="true"></el-table-column>

            <el-table-column
              prop="cardNo"
              align="center"
              label="证件号码"
              :show-overflow-tooltip="true"
            ></el-table-column>

            <el-table-column
              prop="visitType"
              align="center"
              label="访客类型"
              :show-overflow-tooltip="true"
              width="100px"
            >
              <template slot-scope="scope">
                <span>{{scope.row.visitType ==='1' ?'APP' : scope.row.visitType ==='2' ?'访客机' : '--'}}</span>
              </template>
            </el-table-column>

            <el-table-column
              prop="visitName"
              align="center"
              label="受访人"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="{ row }">
                <el-button type="text" @click="showDetail(row,'second')">{{ row.visitName }}</el-button>
              </template>
            </el-table-column>

            <el-table-column
              prop="buildingName"
              align="center"
              label="所属楼栋"
              :show-overflow-tooltip="true"
            ></el-table-column>

            <el-table-column
              prop="houseName"
              align="center"
              label="房屋编号"
              :show-overflow-tooltip="true"
            ></el-table-column>

            <el-table-column
              prop="numPeople"
              align="center"
              label="同行人数"
              :show-overflow-tooltip="true"
            ></el-table-column>

            <el-table-column
              prop="visitTime"
              align="center"
              label="访问时间"
              :show-overflow-tooltip="true"
            ></el-table-column>

            <el-table-column
              prop="invalidDate"
              align="center"
              label="有效时间"
              :show-overflow-tooltip="true"
            ></el-table-column>

            <el-table-column
              prop="createTime"
              align="center"
              label="创建时间"
              :show-overflow-tooltip="true"
            ></el-table-column>
          </el-table>
          <el-pagination
            @current-change="pageChange"
            style="margin-top:10px;"
            background
            layout="prev, pager, next,total"
            :page-size="page.limit"
            :total="page.total"
          ></el-pagination>
        </div>
      </el-col>
    </el-row>

    <!-- 目标详情 -->
    <el-dialog
      class="dialog-rewrite"
      :title="'访客: ' + visitorDialogForm.name ? visitorDialogForm.name : '未知'"
      :visible.sync="detailDialogVisible"
      :before-close="handleClose"
    >
      <el-tabs type="card" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="基本信息" name="first">
          <el-form label-width="130px" :model="visitorDialogForm">
            <el-row :gutter="20">
              <el-col :span="12" class="col-line">
                <el-form-item style="margin-bottom:0" label="访客姓名:">
                  <span>{{visitorDialogForm.name ? visitorDialogForm.name :'--'}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="访客类型:">
                  <span>{{visitorDialogForm.visitType ==='1' ?'APP' : visitorDialogForm.visitType ==='2' ?'访客机' : '--'}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="证件号码:">
                  <span>{{visitorDialogForm.cardNo ? visitorDialogForm.cardNo :'--'}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="同行人数:">
                  <span>{{visitorDialogForm.numPeople ? visitorDialogForm.numPeople:'--'}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item style="margin-bottom:0" label="状态:">
                  <span>{{visitorDialogForm.status ? statusFilter(visitorDialogForm.status) :'--'}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="创建时间:">
                  <span>{{visitorDialogForm.createTime ? visitorDialogForm.createTime :'--'}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="有效时间:">
                  <span>{{visitorDialogForm.invalidDate ? visitorDialogForm.invalidDate :'--'}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="备注信息:">
                  <span>{{visitorDialogForm.note ? visitorDialogForm.note :'暂无'}}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="受访人信息" name="second">
          <el-form label-width="100px" v-model="interUserDetail">
            <el-row>
              <el-col :span="12" class="col-line">
                <el-form-item style="margin-bottom:0" label="姓名:">
                  <span>{{interUserDetail.name}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="性别:">
                  <span>{{interUserDetail.sex==='0'?'女':'男'}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="年龄:">
                  <span>{{interUserDetail.age}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="电话:">
                  <span>{{interUserDetail.phone}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="证件类型:">
                  <span>{{interUserDetail.cardName}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="证件号码:">
                  <span>{{interUserDetail.cardNo}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="车主备注:">
                  <span>{{interUserDetail.note ? interUserDetail.note : '暂无'}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item style="margin-bottom:0" label="人员类型:">
                  <span>{{typeFilter(houseInviterDetail.type)}}</span>
                </el-form-item>

                <el-form-item style="margin-bottom:0" label="居住楼栋:">
                  <span>{{houseInviterDetail.houseDetail ? houseInviterDetail.houseDetail.houseName : '--'}}</span>
                </el-form-item>

                <el-form-item style="margin-bottom:0" label="单元号:">
                  <span>{{houseInviterDetail.houseDetail ? houseInviterDetail.houseDetail.buildingName: '--'}}</span>
                </el-form-item>

                <el-form-item style="margin-bottom:0" label="楼层:">
                  <span>{{houseInviterDetail.houseDetail ? houseInviterDetail.houseDetail.storeyNum: '--'}}</span>
                </el-form-item>

                <el-form-item style="margin-bottom:0" label="房屋号:">
                  <span>{{houseInviterDetail.houseDetail ? houseInviterDetail.houseDetail.serialNumber: '--'}}</span>
                </el-form-item>

                <el-form-item style="margin-bottom:0" label="注册时间:">
                  <span>{{houseInviterDetail.createTime}}</span>
                </el-form-item>

                <el-form-item style="margin-bottom:0" label="邀请人备注:">
                  <span>{{houseInviterDetail.note ? houseInviterDetail.note : "暂无"}}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="通行记录" name="thirdly">
          <el-table v-loading="passTarget" :data="passList" style="width: 100%" stripe>
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <el-table-column align="center" prop="passTime" label="通行时间" width="150px"></el-table-column>
            <el-table-column align="center" prop="devName" label="抓拍设备"></el-table-column>
            <el-table-column align="center" prop="devType" label="设备类型"></el-table-column>
            <el-table-column align="center" prop="passTime" label="通行地址" min-width="150px">
              <template slot-scope="scope">
                <span>{{scope.row.devAddress}} - {{scope.row.devSubAddress}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="passMethod" label="通行方式">
              <template slot-scope="scope">
                <span>{{passMethod(scope.row.passMethod)}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="inOut" label="通行类型">
              <template slot-scope="scope">
                <el-tag
                  size="small"
                  style="border-radius: 50px;"
                  :type="scope.row.inOut==='进'? 'success' : 'danger'"
                >{{ scope.row.inOut}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="address" label="抓拍图片">
              <template slot-scope="scope">
                <img :src="scope.row.photos" alt />
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            style="margin:10px 0"
            @current-change="handleCurrentChange"
            :page-size="listQuery.limit"
            :current-page="listQuery.page"
            layout="total, prev, pager, next, slot"
            :total="listQuery.total"
          ></el-pagination>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import mixin from "@/config/minxins";
import { getOwnerUser } from "@/api/carApi.ts"; //获取目标访客受访人信息
import { getTargrtRecord } from "@/api/peopleApi.ts"; //获取目标车辆通行记录
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
    cardNo: null, //证件号码
    minNumPeople: null, //最小随行人数
    maxNumPeople: null, //最大随行人数
    startCreateTime: null, //创建开始时间
    endCreateTime: null, //创建结束时间
    endInvalidDate: null, //有效期开始时间
    startInvalidDate: null, //有效期结束时间
    visitType: null, //访客类型
    status: null //访客状态
  }; //根据关键字查询
  initForm: object = {
    //获取访客名单列表url
    url: "/admin/usr-visitor/",
    method: "get"
  };

  deleteForm: Object = {
    //单个或批量删除
    url: "/admin/usr-visitor/batch-delete/",
    method: "delete",
    data: []
  };

  private listQuery: Object = {
    // 访客目标通行记录翻页
    total: 0,
    limit: 10,
    page: 1
  };

  private commandType: string = "all"; //根据访客类型筛选 all默认为显示全部
  private commandStatus: String = "0"; //根据访客状态  0 默认显示为全部
  private pitchOn: string = "y"; //选中A
  private unchecked: string = "n"; //未选中
  private interUserDetail: Object = {}; //受访人的身份详细信息
  private houseInviterDetail: Object = {}; //受访人的房屋信息
  private passTarget: Boolean = true; //目标访客通行记录的loadding
  private passList: Array<Object> = []; // 访客目标通行记录

  private detailDialogVisible: boolean = false; // 详细信息dialog弹框
  private visitorDialogForm: Object = {}; // 访客详情
  private activeName: string = "first"; //目标访客详细信息 tab Title
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

  pickOptionStart: object = {}; //按照时间段查询的开始时间
  pickOptionEnd: object = {}; //按照时间段查询的结束时间

  passMethod(val) {
    /**@description 过滤通行方式 */
    switch (val) {
      case "1":
        return "人脸开门";
      case "2":
        return "二维码开门";
      case "3":
        return "蓝牙开门";
      case "4":
        return "远程开门";
      case "5":
        return "密码开门";
      case "6":
        return "刷卡开门";
      case "7":
        return "WIFI开门";
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
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    ); // 合并参数
  }

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

  typeFilter(type) {
    /**@descripution 过滤邀请人类型*/
    switch (type) {
      case "1":
        return "业主";
        break;
      case "2":
        return "租户";
        break;
      case "3":
        return "成员";
        break;
    }
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

  /**
   * row 列表数据
   */
  showDetail(row, inviter) {
    this.detailDialogVisible = true;
    this.visitorDialogForm = Object.assign({}, row);
    if (inviter) {
      this.activeName = inviter;
      this.fetchUser();
    }
  }

  async handleClick(tab) {
    /**@description 查看车辆管理名单目标详情 */
    if (tab.name === "second") {
      this.fetchUser();
    } else if (tab.name === "thirdly") {
      this.listQuery["page"] = 1;
      this.fetchPass();
    }
  }

  async fetchUser() {
    /**@description 查看受访人员详情 */
    try {
      const { data } = await getOwnerUser(
        this.visitorDialogForm["scenceUserId"]
      );
      this.interUserDetail = data.data.user;
      this.houseInviterDetail = { ...data.data.house[0] };
    } catch (err) {
      console.log(err.response);
    }
  }

  async fetchPass() {
    /**@description 查看访客通行通行记录 */
    this.passTarget = true;
    const info = { ...this.listQuery, id: this.visitorDialogForm["id"] };
    const { data } = await getTargrtRecord(info);
    this.passList = data.data.records;
    this.listQuery["total"] = data.data.total;
    this.passTarget = false;
  }

  handleCurrentChange(val) {
    /** @description 处理目标访客通行记录录翻页事件
     * @augments val: 页数
     */
    this.listQuery["page"] = val;
    this.fetchPass();
  }

  handleClose() {
    /** @description 关闭添加/修改diolog */
    this.detailDialogVisible = false; //车辆详情dialog
    this.activeName = "first";
  }
}
</script>

<style lang="scss" scoped>
.main {
  display: flex;
  .rightContent {
    flex: 1;
    box-shadow: 0px 6px 5px 0px lightgray;
  }
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

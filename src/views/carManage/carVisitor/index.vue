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
        <action-header
          ref="actionHeader"
          :houseStatus="false"
          :initFormHeader="initForm"
          @fetchData="fetchData"
          :filterForm="filterForm"
          :btnStatus="2"
          :moreStatus="false"
          :exportUrl="'/v1/admin/usr-visit-car/export/'"
          :exportName="'访客车辆记录'"
          :total="page.total"
        >
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>导入</el-dropdown-item>
          </el-dropdown-menu>
          <div slot="houseNum">
            <div class="word-filter">
              <span class="filter-name">车&nbsp;牌&nbsp;号&nbsp;:</span>
              <el-input
                class="input-filter"
                size="small"
                v-model="filterForm.carNo"
                placeholder="请输入车牌号"
                clearable
                @keyup.enter.native="emitFetchData"
              ></el-input>
            </div>
            <div class="word-filter">
              <span class="filter-name">邀&nbsp;请&nbsp;人&nbsp;:</span>
              <el-input
                class="input-filter"
                size="small"
                v-model="filterForm.visitName"
                placeholder="请输入邀请人姓名"
                clearable
                @keyup.enter.native="emitFetchData"
              ></el-input>
            </div>
            <div class="word-filter">
              <span class="filter-name">车主姓名:</span>
              <el-input
                class="input-filter"
                size="small"
                v-model="filterForm.ownerUserName"
                placeholder="请输入车主姓名"
                clearable
                @keyup.enter.native="emitFetchData"
              ></el-input>
            </div>
            <div class="word-filter">
              <span class="filter-name">联系电话:</span>
              <el-input
                class="input-filter"
                size="small"
                v-model="filterForm.ownerPhone"
                placeholder="请输入联系电话"
                clearable
                @keyup.enter.native="emitFetchData"
                @keyup.native="filterNumber"
                @keydown.native="filterNumber"
              ></el-input>
              <!-- <span>{{phoneNum}}/11</span> -->
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
              <span class="filter-name filter-rewrite">车辆状态:</span>
              <el-select
                class="select-class"
                size="small"
                v-model="filterForm.status"
                placeholder="请选择车辆类型"
              >
                <el-option
                  v-for="item in carTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </div>
        </action-header>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="24" class="table-col">
        <div class="rightContent">
          <el-table
            height="65vh"
            :data="list_data"
            stripe
            highlight-current-row
            v-loading="showLoading"
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

            <el-table-column prop="visitName" label="邀请人" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <el-button
                  @click="showCarDetails(scope.row,'second')"
                  type="text"
                  class="serial-num"
                >{{scope.row.visitName}}</el-button>
              </template>
            </el-table-column>

            <el-table-column prop="carNo" align="center" label="车牌号" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <el-button
                  @click="showCarDetails(scope.row)"
                  type="text"
                  class="serial-num"
                >{{scope.row.carNo}}</el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="ownerPhone"
              align="center"
              label="联系电话"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column
              prop="ownerUserName"
              align="center"
              label="车主姓名"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column prop="status" align="center" label="状态">
              <template slot-scope="scope">
                <el-tag
                  size="small"
                  style="border-radius: 50px;padding: 0 10px;"
                  :type="scope.row.status==='1' ? 'success' : 'warning'"
                >{{ scope.row.status && scope.row.status =='1' ? "未到访" : "已到访" }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="invalidDate"
              align="center"
              label="有效期"
              min-width="100px"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column
              prop="numPeople"
              align="center"
              label="随行人数"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column
              prop="createTime"
              min-width="130px"
              align="center"
              label="创建时间"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column prop="note" align="center" label="备注" :show-overflow-tooltip="true"></el-table-column>
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
      :title="'车牌: ' + CarDialogForm.carNo?CarDialogForm.carNo:'未知'"
      :visible.sync="detailDialogVisible"
      :before-close="handleClose"
    >
      <el-tabs type="card" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="车辆详情" name="first">
          <el-form label-width="130px" :model="CarDialogForm">
            <el-row :gutter="20">
              <el-col :span="12" class="col-line">
                <el-form-item style="margin-bottom:0" label="车牌:">
                  <span>{{CarDialogForm.carNo ? CarDialogForm.carNo :'--'}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="车辆品牌:">
                  <span>{{CarDialogForm.modal ? CarDialogForm.modal : '--'}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="车辆型号:">
                  <span>{{CarDialogForm.carType ? CarDialogForm.carType :'--'}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="车辆状态:">
                  <span>{{CarDialogForm.status &&CarDialogForm.status=='1' ? '正常' :'禁用'}}</span>
                </el-form-item>

                <el-form-item style="margin-bottom:0" label="最后一次进时间:">
                  <span>{{CarDialogForm.lastInTime ? CarDialogForm.lastInTime :'--'}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="最后一次进照片:">
                  <img
                    class="capture-img"
                    @mouseout="imgVisible=false"
                    @mouseover="imgVisible=true,bigImg=CarDialogForm.lastInPhoto"
                    :src="CarDialogForm.lastInPhoto"
                    alt
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item style="margin-bottom:0" label="车主姓名:">
                  <span>{{CarDialogForm.ownerName ? CarDialogForm.ownerName :'--'}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="车主电话:">
                  <span>{{CarDialogForm.ownerPhone ? CarDialogForm.ownerPhone : '--'}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="随同人数:">
                  <span>{{CarDialogForm.numPeople ? CarDialogForm.numPeople : '--'}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="备注信息:">
                  <span>{{CarDialogForm.note ? CarDialogForm.note :'--'}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="最后一次出时间:">
                  <span>{{CarDialogForm.lastOutTime ? CarDialogForm.lastOutTime :'--'}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="最后一次出照片:">
                  <img
                    class="capture-img"
                    @mouseout="imgVisible=false"
                    @mouseover="imgVisible=true,bigImg=CarDialogForm.lastOutPhoto"
                    :src="CarDialogForm.lastOutPhoto"
                    alt
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="邀请人信息" name="second">
          <el-form label-width="100px" v-model="carUserDetail">
            <el-row>
              <el-col :span="12" class="col-line">
                <el-form-item style="margin-bottom:0" label="姓名:">
                  <span>{{carUserDetail.name}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="性别:">
                  <span>{{carUserDetail.sex}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="年龄:">
                  <span>{{carUserDetail.age}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="电话:">
                  <span>{{carUserDetail.phone}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="证件类型:">
                  <span>{{carUserDetail.cardName}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="身份证:">
                  <span>{{carUserDetail.cardNo}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="车主备注:">
                  <span>{{carUserDetail.note}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item style="margin-bottom:0" label="居住楼栋:">
                  <span>{{carInviterDetail.houseDetail ? carInviterDetail.houseDetail.houseName : '--'}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="单元号:">
                  <span>{{carInviterDetail.houseDetail ? carInviterDetail.houseDetail.buildingName: '--'}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="楼层:">
                  <span>{{carInviterDetail.houseDetail ? carInviterDetail.houseDetail.storeyNum: '--'}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="房屋号:">
                  <span>{{carInviterDetail.houseDetail ? carInviterDetail.houseDetail.serialNumber: '--'}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="人员类型:">
                  <span>{{filterType(carInviterDetail.type)}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="注册时间:">
                  <span>{{carInviterDetail.createTime}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="邀请人备注:">
                  <span>{{carInviterDetail.note}}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="通行记录" name="thirdly">
          <el-table v-loading="passTarget" :data="passList" style="width: 100%" stripe>
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <el-table-column align="center" prop="carNo" label="车牌号" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column
              align="center"
              prop="passTime"
              label="通行时间"
              width="150px"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column align="center" prop="address" label="访客通行">
              <template slot-scope="scope">
                <el-tag
                  size="small"
                  style="border-radius: 50px;"
                  :type="scope.row.isVisitCar? 'success' : 'danger'"
                >{{ scope.row.isVisitCar ? '是' : '否' }}</el-tag>
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
import {
  getTargrtRecord, //获取目标车辆通行记录
  getTargetUser //获取目标车辆车主信息
} from "@/api/carApi.ts";

const ActionHeader = () => import("@/components/ActionHeader.vue");

@Component({
  mixins: [mixin],
  components: {
    ActionHeader
  }
})
export default class CardManage extends Vue {
  filterForm: object = {
    carNo: null, //车牌
    ownerPhone: null, //车主电话
    ownerUserName: null, //车主姓名
    visitName: null, //邀请人
    startCreateTime: null, //创建开始时间
    endCreateTime: null, //创建结束时间
    startInvalidDate: null, //开始过期时间
    endInvalidDate: null, // 结束过期时间
    status: null //车辆状态
  }; //根据关键字查询
  initForm: object = {
    //获取访客车辆列表url
    url: "/admin/usr-visit-car/",
    method: "get"
  };

  deleteForm: Object = {
    //单个或批量删除
    url: "/admin/usr-visit-car/batch-delete/",
    method: "delete",
    data: []
  };

  private listQuery: Object = {
    // 车辆管理名单目标通行记录翻页
    total: 0,
    limit: 10,
    page: 1
  };

  private detailDialogVisible: boolean = false; // 详细信息dialog弹框
  private CarDialogForm: Object = {}; // 车辆详情
  private activeName: string = "first"; //目标访客车辆详细信息 tab Title
  private carUserDetail: Object = {}; //邀请人的身份详细信息
  private carInviterDetail: Object = {}; //邀请人的房屋信息
  private passTarget: Boolean = true; //目标车辆通行记录的loadding
  private passList: Array<Object> = []; // 车辆名单目标通行记录
  carTypeList: Array<Object> = [
    //车辆类型筛选
    {
      label: "全部",
      value: null
    },
    {
      label: "未到访",
      value: "1"
    },
    {
      label: "已到访",
      value: "2"
    }
  ];

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

  created() {
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    ); // 合并参数
  }

  filterType(type) {
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

  // 获取需要操作的数据列表
  handleSelectionChange(val) {
    this.deleteForm["data"] = [];
    val.forEach(ele => {
      this.deleteForm["data"].push(ele.id);
    });
  }

  showCarDetails(row, inviter) {
    this.detailDialogVisible = true;
    this.CarDialogForm = Object.assign({}, row);
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

  async fetchPass() {
    /**@description 查看车辆管理名单目标通行记录 */
    this.passTarget = true;
    const info = { ...this.listQuery, carId: this.CarDialogForm["id"] };
    const { data } = await getTargrtRecord(info);
    this.passList = data.data.records;
    this.listQuery["total"] = data.data.total;
    this.passTarget = false;
  }

  async fetchUser() {
    /**@description 查看车辆管理名单用户详情 */
    try {
      const { data } = await getTargetUser(this.CarDialogForm["scenceUserId"]);
      this.carUserDetail = data.data.user;
      this.carInviterDetail = { ...data.data.house[0] };
    } catch (err) {
      console.log(err.response);
    }
  }

  handleCurrentChange(val) {
    /** @description 处理目标车辆通行记录翻页事件
     * @augments val: 页数
     */
    this.listQuery["page"] = val;
    this.fetchPass();
  }

  handleClose() {
    /** @description 关闭新增/修改diolog */
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
  }
}

.demo-block {
  border: 1px solid #ebebeb;
  border-radius: 3px;
}

.serial-num {
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
  left: -8px;
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

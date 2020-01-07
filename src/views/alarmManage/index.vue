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
          :moreStatus="false"
          :initFormHeader="initForm"
          @fetchData="fetchData"
          :filterForm="filterForm"
          :total="page.total"
          :exportUrl="'/admin/usr-visitor/export'"
          :exportName="'预警列表'"
        >
          <div slot="houseNum">
            <div class="word-filter">
              <span class="filter-name filter-rewrite">告警类型:</span>
              <el-select
                class="select-class"
                size="small"
                multiple
                v-model="filterForm.alarmType"
                placeholder="请选择告警状态"
              >
                <el-option
                  v-for="item in alarmType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>

            <div class="word-filter">
              <span class="filter-name filter-rewrite">告警状态:</span>
              <el-select
                class="select-class"
                size="small"
                multiple
                v-model="filterForm.alarmStatus"
                placeholder="请选择告警状态"
              >
                <el-option
                  v-for="item in alarmStatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>

            <div class="word-filter">
              <span class="filter-name filter-rewrite">上报时间:</span>
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
            border
            highlight-current-row
            @cell-mouse-enter="enterRowChange"
            @cell-mouse-leave="leaveRowChange"
            @selection-change="handleSelectionChange"
          >
            <el-table-column v-if="globalUpdateStatus" type="selection" width="50"></el-table-column>
            <el-table-column type="index" align="center" label="序号" class="indexNum" width="50">
              <template slot-scope="scope">
                <span>{{scope.$index+1}}</span>
                <div v-if="globalUpdateStatus" class="fun-btn">
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

            <el-table-column
              prop="name"
              align="center"
              width="120px"
              label="告警类型"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="{row}">
                <el-dropdown trigger="click" @command="handleCommand">
                  <span class="el-dropdown-link">
                    <el-tag
                      type="info"
                      size="small"
                      style="border-radius: 50px;padding: 0 10px; cursor: pointer;"
                      @click="editStatus(row)"
                    >{{ row.name ? row.name :'--'}}</el-tag>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-for="item in alarmType"
                      :key="item.value"
                      :command="item.value"
                    >{{item.label}}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>

            <el-table-column
              prop="status"
              align="center"
              width="120px"
              label="告警状态"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="{row}">
                <el-dropdown trigger="click" @command="handleCommand">
                  <span class="el-dropdown-link">
                    <el-tag
                      type="info"
                      size="small"
                      style="border-radius: 50px;padding: 0 10px; cursor: pointer;"
                      @click="editStatus(row)"
                    >{{statusFilter(row.status)}}</el-tag>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-for="item in alarmStatus"
                      :key="item.value"
                      :command="item.value"
                    >{{item.label}}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>

            <el-table-column
              prop="phone"
              align="center"
              min-width="150px"
              label="告警内容"
              :show-overflow-tooltip="true"
            ></el-table-column>

            <!-- <el-table-column
              prop="buildingName"
              align="center"
              label="所属楼栋"
              :show-overflow-tooltip="true"
            ></el-table-column>-->

            <el-table-column
              prop="visitTime"
              align="center"
              width="160px"
              label="上报时间"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="{row}">
                <p class="boder-style-primary">{{row.visitTime}}</p>
              </template>
            </el-table-column>

            <el-table-column
              prop="visitName"
              align="center"
              width="160px"
              label="处理人"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="{ row }">
                <span>{{ row.visitName }}</span>
              </template>
            </el-table-column>

            <el-table-column
              prop="invalidDate"
              align="center"
              width="160px"
              label="处理时间"
              :show-overflow-tooltip="true"
            ></el-table-column>

            <el-table-column align="center" :show-overflow-tooltip="true" prop="note" label="备注">
              <template slot-scope="scope">
                <span
                  class="rowUpdate"
                  v-show="!scope.row.noteStatus"
                  @click="focusNoteInput(scope.row)"
                >{{ scope.row.note || '--' }}</span>
                <el-input
                  size="mini"
                  :ref="scope.row.id"
                  @blur="noteBlur(scope.row)"
                  v-model="noteString"
                  v-show="scope.row.noteStatus"
                  :clearable="true"
                  placeholder="输入备注"
                ></el-input>
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
        </div>
      </el-col>
    </el-row>

    <!-- 目标详情 -->
    <!-- <el-dialog
      width="800px"
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
                  <span>{{visitorDialogForm.name ? visitorDialogForm.name :''}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="访客类型:">
                  <span>{{visitorDialogForm.visitType ==='1' ?'APP' : visitorDialogForm.visitType ==='2' ?'访客机' : ''}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="证件号码:">
                  <span>{{visitorDialogForm.cardNo ? visitorDialogForm.cardNo :''}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="同行人数:">
                  <span>{{visitorDialogForm.numPeople ? visitorDialogForm.numPeople:''}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item style="margin-bottom:0" label="状态:">
                  <span>{{visitorDialogForm.status ? statusFilter(visitorDialogForm.status) :''}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="创建时间:">
                  <span>{{visitorDialogForm.createTime ? visitorDialogForm.createTime :''}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="有效时间:">
                  <span>{{visitorDialogForm.invalidDate ? visitorDialogForm.invalidDate :''}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="备注信息:">
                  <span>{{visitorDialogForm.note ? visitorDialogForm.note :''}}</span>
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
                <el-form-item style="margin-bottom:0" label="电话:">
                  <span>{{interUserDetail.phone}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="人员类型:">
                  <span>{{typeFilter(houseInviterDetail ? houseInviterDetail.type : '')}}</span>
                </el-form-item>

                <el-form-item style="margin-bottom:0" label="业主备注:">
                  <span>{{interUserDetail.note ? interUserDetail.note : ''}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item style="margin-bottom:0" label="证件类型:">
                  <span>{{interUserDetail.cardName}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="证件号码:">
                  <span>{{interUserDetail.cardNo}}</span>
                </el-form-item>

                <el-form-item style="margin-bottom:0" label="房屋信息:">
                  <span>{{houseInviterDetail&& houseInviterDetail.houseDetail ? houseInviterDetail.houseDetail.locationName : ''}}</span>
                </el-form-item>

                <el-form-item style="margin-bottom:0" label="注册时间:">
                  <span>{{houseInviterDetail&&houseInviterDetail.createTime? houseInviterDetail.createTime :''}}</span>
                </el-form-item>

                <el-form-item style="margin-bottom:0" label="房屋备注:">
                  <span>{{houseInviterDetail&&houseInviterDetail.note ? houseInviterDetail.note : ""}}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="通行记录" name="thirdly">
          <el-table v-loading="passTarget" :data="passList" border style="width: 100%" stripe>
            <el-table-column
              :show-overflow-tooltip="true"
              align="center"
              prop="passTime"
              label="通行时间"
              width="150px"
            >
              <template slot-scope="{row}">
                <p class="boder-style-dialog">{{row.passTime}}</p>
              </template>
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              align="center"
              prop="devName"
              label="抓拍设备"
            ></el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              align="center"
              prop="devType"
              label="设备类型"
            >
              <template slot-scope="{row}">
                <span>{{ row.devType | devTypes }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              align="center"
              prop="devSubAddress"
              label="通行地址"
              min-width="150px"
            >
              <template slot-scope="scope">
                <span>{{scope.row.devAddress}} - {{scope.row.devSubAddress}}</span>
              </template>
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              align="center"
              prop="passMethod"
              label="通行方式"
            >
              <template slot-scope="scope">
                <span>{{passMethod(scope.row.passMethod)}}</span>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="inOut" label="通行类型">
              <template slot-scope="scope">
                <span>{{ scope.row.inOut}}</span>
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
    </el-dialog>-->
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import mixin from "@/config/minxins";

import { editStall } from "@/api/alarmApi.ts"; //获取目标访客受访人信息
// import { getTargrtRecord } from "@/api/peopleApi.ts"; //获取目标车辆通行记录
// import { getRegisterHouse } from "@/api/houseApi.ts"; //获取受房人信息的房屋信息
const ActionHeader = () => import("@/components/ActionHeader.vue");
@Component({
  mixins: [mixin],
  components: {
    ActionHeader
  },
  filters: {
    devTypes(val: string) {
      const data = {
        "1": "门禁",
        "2": "车禁",
        "3": "注册机",
        "4": "访客机"
      };
      return data[val] + "设备";
    }
  }
})
export default class VistoryManage extends Vue {
  filterForm: object = {
    startInvalidDate: null, //上报开始时间
    endInvalidDate: null, //上报结束时间
    alarmType: [], //访客类型
    alarmStatus: [] //访客状态
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
    data: [],
    message: `此操作将永久删除选中的预警信息,删除后预警信息将丢失,请谨慎操作!`
  };

  editForm: object = {
    //修改状态
    alarmType: "",
    alarmStatus: ""
  };

  private listQuery: Object = {
    // 访客目标通行记录翻页
    total: 0,
    limit: 10,
    page: 1
  };

  private commandType: string = "all"; //根据访客类型筛选 all默认为显示全部
  private commandStatus: String = "0"; //根据访客状态  0 默认显示为全部

  private interUserDetail: Object = {}; //受访人的身份详细信息
  private houseInviterDetail: Object = {}; //受访人的房屋信息
  private passTarget: Boolean = true; //目标访客通行记录的loadding
  private passList: Array<Object> = []; // 访客目标通行记录

  private detailDialogVisible: boolean = false; // 详细信息dialog弹框
  private visitorDialogForm: Object = {}; // 访客详情
  private activeName: string = "first"; //目标访客详细信息 tab Title

  updateArray: Array<string> = ["noteStatus"];
  noteString: string = ""; // 修改的备注

  private alarmType: Array<Object> = [
    {
      label: "设备",
      value: "1"
    },
    {
      label: "关注人员",
      value: "2"
    },
    {
      label: "布控人员",
      value: "3"
    }
  ];

  alarmStatus: Array<Object> = [
    //车辆类型筛选
    {
      label: "未读",
      value: "1"
    },
    {
      label: "处理中",
      value: "2"
    },
    {
      label: "已处理",
      value: "3"
    },
    {
      label: "忽略",
      value: "4"
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
        return "未读";
      case "2":
        return "处理中";
      case "3":
        return "已处理";
      case "4":
        return "忽略";
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
        return "家庭成员";
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

  handleCommand(val) {
    /**@description 单独修改车位状态 事件 */
    console.log(val);
  }

  editStatus(val) {
    /**@description 单独修改车位状态 */
    this.editForm = val;
  }

  focusNoteInput(row) {
    /**@description  修改备注自动获取焦点 */
    this.noteString = row.note;
    row.noteStatus = !row.noteStatus;
    this.$nextTick(() => {
      const input = this.$refs[row.id] as HTMLElement;
      input.focus();
    });
  }

  noteBlur(row) {
    /**@description 修改车位备注信息 */
    const form = { note: this.noteString, id: row.id };
    if (row["note"] !== form["note"]) {
      editStall(form)
        .then(res => {
          this["message"](
            "success",
            `修改车位编号为${row["serialNumber"]}的备注信息成功!`
          );

          this.fetchData(this.initForm);
        })
        .catch(() => {
          console.log("修改车位备注信息失败");
        });
    }
    this.noteString = "";
    row.noteStatus = false;
  }

  /**
   * row 列表数据
   */
  // showDetail(row, inviter) {
  //   this.detailDialogVisible = true;
  //   this.visitorDialogForm = Object.assign({}, row);
  //   if (inviter) {
  //     this.activeName = inviter;
  //     this.fetchUser();
  //   }
  // }

  // async handleClick(tab) {
  //   /**@description 查看车辆管理名单目标详情 */
  //   if (tab.name === "second") {
  //     this.fetchUser();
  //   } else if (tab.name === "thirdly") {
  //     this.listQuery["page"] = 1;
  //     this.fetchPass();
  //   }
  // }

  // async fetchUser() {
  //   /**@description 查看受访人员详情 */
  //   const info = {
  //     id: this.visitorDialogForm["scenceUserId"],
  //     houseId: this.visitorDialogForm["houseId"]
  //   };
  //   try {
  //     const { data } = await getOwnerUser(info);
  //     this.interUserDetail = data.data.user;
  //     if (data.data.house) {
  //       this.houseInviterDetail = data.data.house[0];
  //     }
  //     console.log(this.houseInviterDetail, 789456);
  //   } catch (err) {
  //     console.log(err.response);
  //   }

  // try {
  //   const { data } = await getRegisterHouse({
  //     houseId: this.visitorDialogForm["houseId"]
  //   });
  //   console.log(data, 789789);
  //   this.houseInviterDetail = data.data;
  // } catch (err) {
  //   console.log(err);
  // }
  // }

  // async fetchPass() {
  //   /**@description 查看访客通行通行记录 */
  //   this.passTarget = true;
  //   const info = { ...this.listQuery, id: this.visitorDialogForm["id"] };
  //   const { data } = await getTargrtRecord(info);
  //   this.passList = data.data.records;
  //   this.listQuery["total"] = data.data.total;
  //   this.passTarget = false;
  // }

  // handleCurrentChange(val) {
  //   /** @description 处理目标访客通行记录录翻页事件
  //    * @augments val: 页数
  //    */
  //   this.listQuery["page"] = val;
  //   this.fetchPass();
  // }

  // handleClose() {
  //   /** @description 关闭添加/修改diolog */
  //   this.detailDialogVisible = false; //车辆详情dialog
  //   this.activeName = "first";
  //   this.interUserDetail = {};
  //   this.houseInviterDetail = {};
  // }
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

.close-menu {
  width: 10px;
  height: 48px;
  background: #acb7c1;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  position: relative;
}
</style>

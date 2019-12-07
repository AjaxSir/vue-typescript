<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <action-header
          :initFormHeader="initForm"
          @fetchData="fetchData"
          :filterForm="filterForm"
          :btnStatus="2"
          :exportUrl="'/v1/admin/car-pass/export/'"
          :exportName="'车辆通行记录'"
          :total="page.total"
        >
          <el-dropdown-menu slot="dropdown">
            <!-- <div @click="handleStatistics('统计查询')"> -->
            <router-link to="/statementManage/info">
              <el-dropdown-item>统计查询</el-dropdown-item>
            </router-link>

            <!-- </div> -->
            <!-- <div @click="handleStatistics('访客次数排序排序')">
              <el-dropdown-item>访客次数排序排序</el-dropdown-item>
            </div>-->
          </el-dropdown-menu>
          <div slot="houseNum">
            <div class="word-filter">
              <span class="filter-name">车牌号:</span>
              <el-input
                class="input-filter"
                size="small"
                v-model="filterForm.carNo"
                placeholder="请输入车牌号"
              ></el-input>
            </div>
            <div class="word-filter">
              <span class="filter-name">车主姓名:</span>
              <el-input
                class="input-filter"
                size="small"
                v-model="filterForm.userName"
                placeholder="请输入车主姓名"
              ></el-input>
            </div>
            <div class="word-filter">
              <span class="filter-name">车主电话:</span>
              <el-input
                class="input-filter"
                size="small"
                v-model="filterForm.userPhone"
                placeholder="请输入车主电话"
              ></el-input>
            </div>
            <div class="word-filter">
              <span class="filter-name">时间段:</span>
              <el-date-picker
                size="small"
                style="width:165px"
                :picker-options="pickOptionStart"
                v-model="filterForm.startTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期"
              ></el-date-picker>&nbsp;&nbsp;-&nbsp;&nbsp;
              <el-date-picker
                size="small"
                style="width:165px"
                v-model="filterForm.endTime"
                :picker-options="pickOptionEnd"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期"
              ></el-date-picker>
            </div>
            <div class="word-filter">
              <span class="filter-name">车辆类型:</span>
              <el-select size="small" v-model="filterForm.isVisitCar" placeholder="请选择车辆类型">
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
            v-loading="showLoading"
            :data="list_data"
            stripe
            highlight-current-row
            @cell-mouse-enter="enterRowChange"
            @cell-mouse-leave="leaveRowChange"
          >
            <el-table-column
              align="center"
              type="selection"
              width="50"
              :selectable="isDisabled"
              disabled="true"
            ></el-table-column>

            <el-table-column align="center" type="index" label="序号" width="50"></el-table-column>

            <el-table-column align="center" prop="carNo" label="车牌号">
              <template slot-scope="scope">
                <el-button
                  @click="showCarDetails(scope.row)"
                  type="text"
                  class="serial-num"
                >{{scope.row.carNo}}</el-button>
                <!-- <div class="fun-btn">
                  <el-dropdown trigger="click" placement="bottom-start" @command="commandClick">
                    <i v-show="scope.row.showMenu" class="iconfont icon-menu"></i>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="update">修改</el-dropdown-item>
                      <el-dropdown-item :command="returnCommand('delete', scope.row)">批量删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>-->
              </template>
            </el-table-column>

            <el-table-column align="center" prop="isVisitCar" label="访客通行" width="100px">
              <template slot="header">
                <el-dropdown style="padding:0;" trigger="click" @command="filterType">
                  <span class="el-dropdown-link">
                    访客通行
                    <i class="el-icon-caret-bottom el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      command="all"
                      :class="commandType==='all' ? pitchOn : unchecked"
                    >全部</el-dropdown-item>
                    <el-dropdown-item
                      command="yes"
                      :class="commandType==='yes' ? pitchOn : unchecked"
                    >是</el-dropdown-item>
                    <el-dropdown-item
                      command="no"
                      :class="commandType==='no' ? pitchOn : unchecked"
                    >否</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
              <template slot-scope="scope">
                <el-tag
                  size="small"
                  style="border-radius: 50px;padding: 0 10px; cursor: pointer;"
                  :type="scope.row.isVisitCar? 'success' : 'danger'"
                  @click="editType(scope.row)"
                >{{ scope.row.isVisitCar? "是" : "否" }}</el-tag>
              </template>
            </el-table-column>

            <!-- <el-table-column align="center" prop="car" label="车辆颜色"></el-table-column> -->
            <!-- <el-table-column align="center" prop="inOut" label="车辆类型"></el-table-column> -->
            <el-table-column align="center" prop="ownerName" label="车主姓名"></el-table-column>
            <el-table-column align="center" prop="ownerPhone" label="车主电话"></el-table-column>
            <el-table-column align="center" prop="inOut" label="通行方向" width="100px">
              <template slot="header">
                <el-dropdown style="padding:0;" trigger="click" @command="filterStatus">
                  <span class="el-dropdown-link">
                    通行方向
                    <i class="el-icon-caret-bottom el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      command="0"
                      :class="commandType==='0' ? pitchOn : unchecked"
                    >全部</el-dropdown-item>
                    <el-dropdown-item command="1" :class="commandType==='1' ? pitchOn : unchecked">进</el-dropdown-item>
                    <el-dropdown-item command="2" :class="commandType==='2' ? pitchOn : unchecked">出</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
              <template slot-scope="scope">
                <el-tag
                  size="small"
                  style="border-radius: 50px;padding: 0 10px; cursor: pointer;"
                  :type="scope.row.inOut==='进'? 'success' : 'danger'"
                  @click="editType(scope.row)"
                >{{ scope.row.inOut }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="passTime"
              label="抓拍时间"
              :show-overflow-tooltip="true"
            ></el-table-column>

            <el-table-column align="center" prop="photos" label="最近抓拍图片">
              <template slot-scope="scope">
                <img
                  class="capture-img"
                  width="30px"
                  height="30px"
                  @mouseout="imgVisible=false"
                  @mouseover="imgVisible=true,bigImg=scope.row.photos"
                  :src="scope.row.photos"
                  alt
                />
              </template>
            </el-table-column>
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
    <el-dialog
      class="dialog-rewrite"
      :title="'车牌: ' + CarDialogForm.carNo"
      :visible.sync="detailDialogVisible"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-tabs type="card" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="车主信息" name="first">
          <el-form label-width="100px" :model="CarDialogForm">
            <el-form-item style="margin-bottom:0" label="姓名:">
              <span>{{CarDialogForm.ownerName}}</span>
            </el-form-item>
            <el-form-item style="margin-bottom:0" label="电话:">
              <span>{{CarDialogForm.ownerPhone}}</span>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="详细信息" name="second">
          <el-form label-width="100px" :model="CarDialogForm">
            <el-form-item style="margin-bottom:0" label="访客通行:">
              <span>{{CarDialogForm.isVisitCar ? '是':'否'}}</span>
            </el-form-item>
            <el-form-item style="margin-bottom:0" label="通行类型:">
              <span>{{CarDialogForm.inOut}}</span>
            </el-form-item>
            <el-form-item style="margin-bottom:0" label="通行时间:">
              <span>{{CarDialogForm.passTime}}</span>
            </el-form-item>
            <el-form-item style="margin-bottom:0" label="抓拍照片:">
              <img
                class="capture-img"
                @mouseout="imgVisible=false"
                @mouseover="imgVisible=true,bigImg=CarDialogForm.photos"
                :src="CarDialogForm.photos"
                alt
              />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="detailDialogVisible = false">确 定</el-button>
      </span>-->
    </el-dialog>
    <ImageMagni :centerDialogVisible="imgVisible" bigTitle="抓拍图片" :bigImg="bigImg" />
    <StatisticDataDialog :formShowStatistic.sync="dialogStatisticData" :fromTitle="fromTitle" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import mixin from "@/config/minxins";
import { getvisitUser, getOwnerUser } from "@/api/carApi.ts";

const ActionHeader = () => import("@/components/ActionHeader.vue");
const ImageMagni = () => import("@/components/BigImg/index.vue");
const StatisticDataDialog = () =>
  import("./components/statisticDataDialog.vue");

@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    ImageMagni,
    StatisticDataDialog
  }
})
export default class CardManage extends Vue {
  filterForm: object = {
    userName: null, //车主姓名
    userPhone: null, //车主电话
    carNo: null, //车牌
    startTime: null, //时间段开始时间
    endTime: null, //时间段结束时间
    isVisitCar: null, //车辆类型
    inOut: null //进出
  }; //根据关键字查询
  initForm: object = {
    //获取车辆列表url
    url: "/admin/car-pass/",
    method: "get"
  };
  deleteForm: Object = {
    //单个或批量删除
    url: "/admin/usr-car/batch-delete/",
    method: "delete",
    data: []
  };
  private imgVisible: Boolean = false; // 控制放大图片的visible
  private bigImg: String = ""; // 保存放大图片的地址
  private activeName: string = "first"; ////目标车辆详细信息 tab Title
  CarDialogForm: Object = {}; // 车主详细信息
  detailDialogVisible: boolean = false; // 详细信息dialog弹框
  private fromTitle: String = "统计查询"; // dialog Title
  private dialogStatisticData: Boolean = false; // 统计dialog
  private commandType: string = "all"; //根据访客类型筛选 all默认为显示全部
  private commandStatus: String = "0"; //根据访客状态  0 默认显示为全部
  private pitchOn: string = "y"; //选中A
  private unchecked: string = "n"; //未选中

  carTypeList: Array<Object> = [
    //车辆类型筛选
    {
      label: "常驻",
      value: false
    },
    {
      label: "访客",
      value: true
    },
    {
      label: "所有",
      value: null
    }
  ];
  pickOptionStart: object = {}; //按照时间段查询的开始时间
  pickOptionEnd: object = {}; //按照时间段查询的结束时间
  mounted() {
    const _this = this;
    // this.pickOptionStart = {
    //   disabledDate(time) {
    //     if (_this.filterForm["endTime"] !== "") {
    //       return (
    //         time.getTime() > Date.now() ||
    //         time.getTime() > _this.filterForm["endTime"]
    //       );
    //     } else {
    //       return time.getTime() > Date.now();
    //     }
    //   }
    // };
    // this.pickOptionEnd = {
    //   disabledDate(time) {
    //     return (
    //       time.getTime() < _this.filterForm["startTime"] ||
    //       time.getTime() > Date.now()
    //     );
    //   }
    // };
  }

  // 获取需要操作的数据列表
  handleSelectionChange(val) {
    this.deleteForm["data"] = [];
    val.forEach(ele => {
      this.deleteForm["data"].push(ele.id);
    });
  }

  filterType(command) {
    /**@description 对访客类型进行筛选 */
    this.commandType = command;
    if (command === "all") {
      this.filterForm["isVisitCar"] = null;
    } else if (command === "yes") {
      this.filterForm["isVisitCar"] = true;
    } else this.filterForm["isVisitCar"] = false;
    this.refreshInfo();
  }

  filterStatus(command) {
    /**@description 对访客状态进行筛选 */
    this.commandStatus = command;
    if (command === "0") {
      this.filterForm["inOut"] = null;
    } else if (command === "1") {
      this.filterForm["inOut"] = "进";
    } else this.filterForm["inOut"] = "出";
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

  created() {
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    ); // 合并参数
  }

  showCarDetails(row) {
    /**@description 查看目标详情 */
    this.detailDialogVisible = true;
    this.CarDialogForm = Object.assign({}, row);
    this.fetchUser();
  }

  async handleClick(tab) {
    /**@description 查看车辆管理名单目标详情 */
    if (tab.name === "first") {
      this.fetchUser();
    } else if (tab.name === "thirdly") {
      this.fetchPass();
    }
  }

  fetchUser() {
    /**@description 查看车辆管理名单用户详情 */
    console.log(this.CarDialogForm);
    if (this.CarDialogForm["isVisitCar"]) {
      getvisitUser(this.CarDialogForm["visitCarId"]).then(res => {
        console.log(res.data.data, 1);
        // this.carUserDetail = res.data.data.user;
      });
    } else {
      getOwnerUser(this.CarDialogForm["ownerScenceUserId"]).then(res => {
        console.log(res.data.data, 2);
        // this.carUserDetail = res.data.data.user;
      });
    }
  }

  async fetchPass() {
    /**@description 查看车辆管理名单目标通行记录 */
    // const info = { ...this.listQuery, carId: this.CarDialogForm["id"] };
    // const { data } = await getTargrtRecord(info);
    // this.passList = data.data.records;
    // this.listQuery["total"] = data.data.total;
    // this.passTarget = false;
  }

  editType(item) {
    /**@description 修改状态 */
    console.log(item);
  }

  handleStatistics(val) {
    /**@description 统计查询 */
    this.fromTitle = val;
    this.dialogStatisticData = true;
  }

  handleClose() {
    /** @description 关闭diolog */
    this.detailDialogVisible = false; //车辆详情dialog
    this.activeName = "first";
  }

  isDisabled(row, index) {
    /**@discription 禁用多选 */
    if (row.auditResult == 3) {
      return 0;
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
  top: 28%;
  .iconfont {
    font-size: 19px;
    color: #8091a5;
    cursor: pointer;
  }
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
  width: 30px;
  height: 30px;
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

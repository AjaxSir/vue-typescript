<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <action-header
          ref="actionHeader"
          :initFormHeader="initForm"
          @fetchData="fetchData"
          :filterForm="filterForm"
          :btnStatus="2"
          :exportUrl="'/admin/car-pass/export'"
          :exportName="'车辆通行记录'"
          :total="page.total"
        >
          <el-dropdown-menu slot="dropdown">
            <!-- <div @click="handleStatistics('统计查询')"> -->
            <router-link to="/statementManage/carPassChart">
              <el-dropdown-item>统计查询</el-dropdown-item>
            </router-link>

            <!-- </div> -->
            <!-- <div @click="handleStatistics('访客次数排序排序')">
              <el-dropdown-item>访客次数排序排序</el-dropdown-item>
            </div>-->
          </el-dropdown-menu>
          <div slot="houseNum">
            <div class="word-filter">
              <span class="filter-name filter-rewrite">时&nbsp;间&nbsp;段&nbsp;:</span>
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
              <span class="filter-name">车主姓名:</span>
              <el-input
                class="input-filter"
                size="small"
                v-model="filterForm.userName"
                placeholder="请输入车主姓名"
                clearable
                @keyup.enter.native="emitFetchData"
              ></el-input>
            </div>
            <div class="word-filter">
              <span class="filter-name">车主电话:</span>
              <el-input
                class="input-filter"
                size="small"
                v-model="filterForm.userPhone"
                placeholder="请输入车主电话"
                clearable
                @keyup.enter.native="emitFetchData"
                @keyup.native="filterNumber"
                @keydown.native="filterNumber"
              ></el-input>
              <!-- <span>{{phoneNum}}/11</span> -->
            </div>

            <div class="word-filter">
              <span class="filter-name filter-rewrite">车辆类型:</span>
              <el-select
                class="select-class"
                size="small"
                v-model="filterForm.isVisitCar"
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

            <div class="word-filter">
              <span class="filter-name filter-rewrite">通行方向:</span>
              <el-select
                class="select-class"
                size="small"
                v-model="filterForm.inOut"
                placeholder="请选择通行方向"
              >
                <el-option
                  v-for="item in carPassType"
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
              v-if="globalUpdateStatus"
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
                       <el-tooltip class="item" effect="dark" content="点击操作" placement="top">
                      <i v-show="scope.row.showMenu" class="iconfont icon-menu"></i>
                    </el-tooltip>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="update">修改</el-dropdown-item>
                      <el-dropdown-item :command="returnCommand('delete', scope.row)">批量删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>-->
              </template>
            </el-table-column>

            <el-table-column align="center" prop="isVisitCar" label="车辆类型" width="100px">
              <template slot-scope="scope">
                <span>{{ scope.row.isVisitCar? "访客" : "常驻" }}</span>
                <!-- <el-tag
                  size="small"
                  style="border-radius: 50px;padding: 0 10px;"
                  :type="scope.row.isVisitCar? 'success' : 'danger'"
                  @click="editType(scope.row)"
                >{{ scope.row.isVisitCar? "访客" : "常驻" }}</el-tag>-->
              </template>
            </el-table-column>

            <!-- <el-table-column align="center" prop="car" label="车辆颜色"></el-table-column> -->
            <el-table-column align="center" prop="ownerName" label="车主姓名"></el-table-column>
            <el-table-column align="center" prop="ownerPhone" label="车主电话"></el-table-column>
            <el-table-column align="center" prop="inOut" label="通行方向" width="100px">
              <template slot-scope="scope">
                <span>{{ scope.row.inOut==="进" ? '进入' : '出行' }}</span>
                <!-- <el-tag
                  size="small"
                  style="border-radius: 50px;padding: 0 10px; "
                  :type="scope.row.inOut==='进'? 'success' : 'danger'"
                  @click="editType(scope.row)"
                >{{ scope.row.inOut==="进" ? '进入' : '出行' }}</el-tag>-->
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
                  v-if="scope.row.photos"
                  class="capture-img"
                  width="30px"
                  height="30px"
                  @mouseout="imgVisible=false"
                  @mouseover="imgVisible=true,bigImg=scope.row.photos"
                  :src="scope.row.photos"
                  alt
                />
                <span v-else></span>
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
      width="800px"
      class="dialog-rewrite"
      :title="'车牌: ' + CarDialogForm.carNo"
      :visible.sync="detailDialogVisible"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-tabs type="card" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="车主信息" name="first">
          <el-form label-width="130px" :model="CarDialogForm">
            <el-row :gutter="20">
              <el-col :span="12" class="col-line">
                <el-form-item style="margin-bottom:0" label="姓名:">
                  <span>{{CarDialogForm.isVisitCar ? carUserDetail.ownerName : carVisitDetail.name}}</span>
                </el-form-item>

                <el-form-item v-if="!CarDialogForm.isVisitCar " style="margin-bottom:0" label="年龄:">
                  <span>{{carVisitDetail.age}}</span>
                </el-form-item>

                <el-form-item v-if="!CarDialogForm.isVisitCar " style="margin-bottom:0" label="性别:">
                  <span>{{carVisitDetail.sex}}</span>
                </el-form-item>

                <el-form-item style="margin-bottom:0" label="电话:">
                  <span>{{CarDialogForm.isVisitCar ? carUserDetail.ownerPhone : carVisitDetail.phone}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item v-if="CarDialogForm.isVisitCar" style="margin-bottom:0" label="邀请人:">
                  <span>{{carUserDetail.visitName}}</span>
                </el-form-item>

                <el-form-item v-if="CarDialogForm.isVisitCar" style="margin-bottom:0" label="备注信息:">
                  <span>{{ carUserDetail.note ? carUserDetail.note : '暂无' }}</span>
                </el-form-item>
                <el-form-item
                  v-if="!CarDialogForm.isVisitCar "
                  style="margin-bottom:0"
                  label="出生日期:"
                >
                  <span>{{carVisitDetail.birthday}}</span>
                </el-form-item>

                <el-form-item
                  v-if="!CarDialogForm.isVisitCar "
                  style="margin-bottom:0"
                  label="证件类型:"
                >
                  <span>{{carVisitDetail.cardName}}</span>
                </el-form-item>

                <el-form-item
                  v-if="!CarDialogForm.isVisitCar "
                  style="margin-bottom:0"
                  label="证件号码:"
                >
                  <span>{{carVisitDetail.cardNo}}</span>
                </el-form-item>

                <el-form-item
                  v-if="!CarDialogForm.isVisitCar "
                  style="margin-bottom:0"
                  label="备注信息:"
                >
                  <span>{{ carVisitDetail.note ? carVisitDetail.note : '暂无'}}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="详细信息" name="second">
          <el-form label-width="130px" :model="CarDialogForm">
            <el-row v-if="CarDialogForm.isVisitCar" :gutter="20">
              <el-col :span="12" class="col-line">
                <el-form-item style="margin-bottom:0" label="车辆类型:">
                  <span>{{CarDialogForm.isVisitCar ? '访客' : '常驻'}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="车辆品牌:">
                  <span>{{ carUserDetail.modal}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="车辆型号:">
                  <span>{{carUserDetail.carType}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="随同人数:">
                  <span>{{carUserDetail.numPeople}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item style="margin-bottom:0" label="备注信息:">
                  <span>{{carUserDetail.note ? carUserDetail.note : '暂无'}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="通行类型:">
                  <span>{{CarDialogForm.inOut}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="通行时间:">
                  <span>{{CarDialogForm.passTime}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="抓拍照片:">
                  <img class="capture-img" :src="CarDialogForm.photos" alt />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row v-else :gutter="20">
              <el-col :span="12" class="col-line">
                <el-form-item style="margin-bottom:0" label="车辆品牌:">
                  <span>{{carUserDetail.modal ? carUserDetail.modal : ''}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="车辆型号:">
                  <span>{{carUserDetail.carType ? carUserDetail.carType :''}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="车辆状态:">
                  <span>{{carUserDetail.status &&carUserDetail.status=='1' ? '正常' :'禁用'}}</span>
                </el-form-item>

                <el-form-item style="margin-bottom:0" label="最后一次进时间:">
                  <span>{{carUserDetail.lastInTime ? carUserDetail.lastInTime :''}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="最后一次进照片:">
                  <img class="capture-img" :src="carUserDetail.lastInPhoto" alt />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item style="margin-bottom:0" label="车主姓名:">
                  <span>{{carUserDetail.ownerName ? carUserDetail.ownerName :''}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="车主电话:">
                  <span>{{carUserDetail.ownerPhone ? carUserDetail.ownerPhone : ''}}</span>
                </el-form-item>

                <el-form-item style="margin-bottom:0" label="备注信息:">
                  <span>{{carUserDetail.note ? carUserDetail.note :'暂无'}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="最后一次出时间:">
                  <span>{{carUserDetail.lastOutTime ? carUserDetail.lastOutTime :''}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="最后一次出照片:">
                  <img class="capture-img" :src="carUserDetail.lastOutPhoto" alt />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="detailDialogVisible = false">确 定</el-button>
      </span>-->
    </el-dialog>
    <ImageMagni :centerDialogVisible="imgVisible" bigTitle="最近抓拍图片" :bigImg="bigImg" />
    <StatisticDataDialog :formShowStatistic.sync="dialogStatisticData" :fromTitle="fromTitle" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import mixin from "@/config/minxins";
import { getvisitUser, getOwnerUser, getCarRecord } from "@/api/carApi.ts";

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

  private carUserDetail: Object = {}; //车主信息
  private carVisitDetail: Object = {}; //访客车主信息

  carTypeList: Array<Object> = [
    //车辆类型筛选
    {
      label: "全部",
      value: null
    },
    {
      label: "常驻",
      value: false
    },
    {
      label: "访客",
      value: true
    }
  ];
  carPassType: Array<Object> = [
    //车辆类型筛选
    {
      label: "全部",
      value: null
    },
    {
      label: "进入",
      value: "进"
    },
    {
      label: "出行",
      value: "出"
    }
  ];
  pickerOptions: Object = {};
  dateRange: Array<Object> = [];
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
    console.log(123, this.dateRange);
    if (this.dateRange) {
      this.filterForm["startTime"] = this.dateRange[0];
      this.filterForm["endTime"] = this.dateRange[1];
    } else {
      this.filterForm["startTime"] = null;
      this.filterForm["endTime"] = null;
    }
  }

  // 获取需要操作的数据列表
  handleSelectionChange(val) {
    this.deleteForm["data"] = [];
    val.forEach(ele => {
      this.deleteForm["data"].push(ele.id);
    });
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
    } else if (tab.name === "second") {
      this.fetchCarDetail();
    }
  }

  fetchUser() {
    /**@description 查看车辆管理名单用户详情
     * @argument isVisitCar: true 访客车辆;  false 用户车辆
     */
    if (this.CarDialogForm["isVisitCar"]) {
      this.getvisitCar();
    } else {
      getOwnerUser(this.CarDialogForm["ownerScenceUserId"]).then(res => {
        this.carVisitDetail = res.data.data.user;
      });
    }
  }

  async getvisitCar() {
    /**@description 获取访客用户详情及车辆详情 */
    const { data } = await getvisitUser(this.CarDialogForm["visitCarId"]);
    this.carUserDetail = data.data;
  }

  async fetchCarDetail() {
    /**@description 获取车辆详细信息 isVisitCar: true 访客车辆;  false 用户车辆*/
    if (this.CarDialogForm["isVisitCar"]) {
      this.getvisitCar();
    } else {
      const { data } = await getCarRecord(this.CarDialogForm["carId"]);
      console.log(data.data);
      this.carUserDetail = data.data;
    }
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

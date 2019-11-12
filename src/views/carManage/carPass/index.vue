<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <action-header :btnStatus="false" :total="1">
          <el-dropdown-menu slot="dropdown">
            <div @click="handleStatistics('统计查询')">
              <el-dropdown-item>统计查询</el-dropdown-item>
            </div>
            <div @click="handleStatistics('访客次数排序排序')">
              <el-dropdown-item>访客次数排序排序</el-dropdown-item>
            </div>
          </el-dropdown-menu>
          <div slot="houseNum">
            <div class="word-filter">
              <span class="filter-name">车牌号:</span>
              <el-input class="input-filter" size="small"></el-input>
            </div>
            <div class="word-filter">
              <span class="filter-name">时间段:</span>
              <el-date-picker
                size="small"
                class="input-filter"
                v-model="TimeRange"
                type="datetimerange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </div>
          </div>
        </action-header>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="24" class="table-col">
        <div class="rightContent">
          <el-table
            :data="cardList"
            stripe
            class="demo-block"
            highlight-current-row
            @cell-mouse-enter="enterRowChange"
            @cell-mouse-leave="leaveRowChange"
          >
            <el-table-column align="center" type="selection" width="50"></el-table-column>

            <el-table-column align="center" type="index" label="序号" width="50"></el-table-column>

            <el-table-column align="center" prop="name" label="车牌号">
              <template slot-scope="scope">
                <el-button
                  @click="showCarDetails(scope.row)"
                  type="text"
                  class="serial-num"
                >{{scope.row.carNum}}</el-button>
                <div class="fun-btn">
                  <el-dropdown trigger="click" placement="bottom-start" @command="commandClick">
                    <i v-show="scope.row.showMenu" class="iconfont icon-menu"></i>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="update">修改</el-dropdown-item>
                      <el-dropdown-item command="delete">删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </template>
            </el-table-column>

            <el-table-column align="center" prop="car" label="车辆品牌"></el-table-column>

            <el-table-column align="center" prop="type" label="是否校内">
              <template slot-scope="scope">
                <el-tag
                  size="small"
                  style="border-radius: 50px;padding: 0 10px; cursor: pointer;"
                  :type="scope.row.type === 1 ? 'success' : 'danger'"
                  @click="editType(scope.row)"
                >{{ scope.row.type === 1 ? "是" : "否" }}</el-tag>
              </template>
            </el-table-column>

            <el-table-column align="center" prop="car" label="车辆颜色"></el-table-column>

            <el-table-column align="center" prop="car" label="车主信息"></el-table-column>

            <el-table-column align="center" prop="createDate" label="抓拍时间"></el-table-column>

            <el-table-column align="center" prop="img" label="最近抓拍图片">
              <template slot-scope="scope">
                <img
                  class="capture-img"
                  @mouseout="imgVisible=false"
                  @mouseover="imgVisible=true,bigImg=scope.row.img"
                  :src="scope.row.img"
                  alt
                />
              </template>
            </el-table-column>
          </el-table>
        </div>

        <el-pagination style="margin-top:10px;" background layout="prev, pager, next" :total="2"></el-pagination>
      </el-col>
    </el-row>
    <el-dialog
      class="dialog-rewrite"
      :title="CarDialogForm.name"
      :visible.sync="detailDialogVisible"
    >
      <el-tabs type="card" v-model="activeName">
        <el-tab-pane label="车主信息" name="first">
          <el-form label-width="100px" :model="CarDialogForm">
            <el-form-item label="车主信息:">
              <span>{{CarDialogForm.houseRelative}}</span>
            </el-form-item>
            <el-form-item label="电话:">
              <span>--</span>
            </el-form-item>
            <el-form-item label="车牌:">
              <span>{{CarDialogForm.carNum}}</span>
            </el-form-item>
            <el-form-item label="所属单元信息:">
              <span>{{CarDialogForm.name}}</span>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="详细信息" name="second">
          <el-table :data="carDetailsTable" style="width: 100%">
            <el-table-column align="center" prop="name" label="姓名" width="150px"></el-table-column>
            <el-table-column align="center" prop="date" label="通行时间" width="150px"></el-table-column>
            <el-table-column align="center" prop="address" label="通行地址"></el-table-column>
            <el-table-column align="center" prop="address" label="抓拍图片"></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="detailDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <ImageMagni :centerDialogVisible="imgVisible" bigTitle="抓拍图片" :bigImg="bigImg" />
    <StatisticDataDialog :formShowStatistic.sync="dialogStatisticData" :fromTitle="fromTitle" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import mixin from "@/config/minxins";

const ActionHeader = () => import("@/components/ActionHeader.vue");
const ImageMagni = () => import("@/components/BigImg/index.vue");
const StatisticDataDialog = () => import("./components/statisticDataDialog.vue");

@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    ImageMagni,
    StatisticDataDialog
  }
})
export default class CardManage extends Vue {
  private cardList: Array<Object> = [
    {
      name: "1-1-105",
      houseRelative: "业主",
      carNum: "川1256489",
      createDate: "2019-9-26",
      img: require("@/assets/car.png"),
      type: 1,
      showMenu: false,
      car: "--"
    },
    {
      name: "1-1-105",
      houseRelative: "业主",
      carNum: "川1256489",
      createDate: "2019-9-26",
      img: require("@/assets/car.png"),
      type: 1,
      showMenu: false,
      car: "--"
    },
    {
      name: "1-1-105",
      houseRelative: "业主",
      carNum: "川1256489",
      createDate: "2019-9-26",
      img: require("@/assets/car.png"),
      type: 2,
      showMenu: false,
      car: "--"
    }
  ];

  private TimeRange: any = "";
  activeName: string = "first";
  carDetailsTable: Array<Object> = []; // 详细信息记录
  private imgVisible: Boolean = false; // 控制放大图片的visible
  private bigImg: String = ""; // 保存放大图片的地址
  CarDialogForm: Object = {}; // 车主详细信息
  detailDialogVisible: boolean = false; // 详细信息dialog弹框
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
  private fromTitle: String = "统计查询"; // dialog Title
  private dialogStatisticData: Boolean = false; // 统计dialog

  showCarDetails(row) {
    this.detailDialogVisible = true;
    this.CarDialogForm = Object.assign({}, row);
  }
  editType(item) {
    /**@description 修改状态 */
    console.log(item);
  }
  handleStatistics(val) {
    this.fromTitle = val;
    this.dialogStatisticData = true;
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

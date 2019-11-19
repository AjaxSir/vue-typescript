<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <action-header :btnStatus='2' :total="1">
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>统计信息</el-dropdown-item>
          </el-dropdown-menu>
          <div slot="houseNum">
            <div class="word-filter">
              <span class="filter-name">单元楼:</span>
              <el-input class="input-filter" size="small"></el-input>
            </div>
             <div class="word-filter">
              <span class="filter-name">姓名:</span>
              <el-input class="input-filter" size="small"></el-input>
            </div>
             <div class="word-filter">
              <span class="filter-name">时间段:</span>
              <el-date-picker
                style='width:140px'
                v-model="timeRange[0]"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
              &nbsp;&nbsp;&nbsp; -- &nbsp;&nbsp;&nbsp;
              <el-date-picker
              style='width:140px'
                v-model="timeRange[1]"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </div>
            <div class="word-filter">
              <span class="filter-name">通行方式:</span>
              <el-select class="input-filter" size="small" v-model="passType" placeholder="请选择">
                <el-option label="全部" value="all"></el-option>
                <el-option label="蓝牙" value="blueTeeth"></el-option>
                <el-option label="刷脸" value="face"></el-option>
              </el-select>
            </div>
            <div class="word-filter">
              <span class="filter-name">类型:</span>
              <el-select class="input-filter" size="small" v-model="personType" placeholder="请选择">
                <el-option label="全部" value="all"></el-option>
                <el-option label="住户" value="house"></el-option>
                <el-option label="租客" value="rent"></el-option>
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
            :data="cardList"
            stripe
            class="demo-block"
            highlight-current-row
            @cell-mouse-enter="enterRowChange"
            @cell-mouse-leave="leaveRowChange"
          >
            <el-table-column type="selection" width="50"></el-table-column>

            <el-table-column type="index" label="序号" width="50"></el-table-column>

            <el-table-column prop="name" label="设备编号">
              <template slot-scope="scope">
                <span class="serial-num">{{scope.row.carNum}}</span>
                <!-- <div class="fun-btn">
                  <el-dropdown trigger="click" placement="bottom-start" @command='commandClick'>
                    <i v-show="scope.row.showMenu" class="iconfont icon-menu"></i>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command='update'>修改</el-dropdown-item>
                      <el-dropdown-item command='delete'>删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div> -->
              </template>
            </el-table-column>

            <el-table-column prop="car" label="单元信息"></el-table-column>

            <el-table-column prop="type" label="设备型号">
              <template slot-scope="scope">
                <span>{{scope.row.car}}</span>
                <!-- <el-tag
                  size="small"
                  style="border-radius: 50px;padding: 0 10px; cursor: pointer;"
                  :type="scope.row.type === 1 ? 'success' : 'danger'"
                  @click="editType(scope.row)"
                >{{ scope.row.type === 1 ? "是" : "否" }}</el-tag>-->
              </template>
            </el-table-column>

            <el-table-column prop="createDate" label="通行时间"></el-table-column>

            <el-table-column prop="car" label="通行方式"></el-table-column>

            <el-table-column prop="car" label="姓名"></el-table-column>

            <el-table-column prop="img" label="人脸">
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
          <el-pagination style="margin-top:10px;" background layout="prev, pager, next" :total="2"></el-pagination>
        </div>
      </el-col>
    </el-row>

    <ImageMagni :centerDialogVisible="imgVisible" bigTitle="抓拍图片" :bigImg="bigImg" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import mixin from "@/config/minxins";
import { passList } from '@/api/peopleApi.ts'
const ActionHeader = () => import("@/components/ActionHeader.vue");
const ImageMagni = () => import("@/components/BigImg/index.vue");

@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    ImageMagni
  }
})
export default class CardManage extends Vue {
  private cardList: Array<Object> = [
    {
      name: "1-1-105",
      houseRelative: "业主",
      carNum: "1000000001",
      createDate: "2019-9-26",
      img: require("../../../assets/4075389faf0c20cf430ce772c3afa47.png"),
      type: 1,
      showMenu: false,
      car: "--"
    },
    {
      name: "1-1-105",
      houseRelative: "业主",
      carNum: "1000000011",
      createDate: "2019-9-26",
      img: require("../../../assets/4075389faf0c20cf430ce772c3afa47.png"),
      type: 1,
      showMenu: false,
      car: "--"
    },
    {
      name: "1-1-105",
      houseRelative: "业主",
      carNum: "1000000001",
      createDate: "2019-9-26",
      img: require("../../../assets/4075389faf0c20cf430ce772c3afa47.png"),
      type: 2,
      showMenu: false,
      car: "--"
    }
  ];

  deviceStatus: String = "all";
  private menuControl1: String = "menu-control";
  private menuControl2: String = "menu-visible";

  private imgVisible: Boolean = false; // 控制放大图片的visible
  private bigImg: String = ""; // 保存放大图片的地址
  timeRange: Array<string> = ['', ''] // 时间
  personType: String = 'all' // 用户类型
  passType: String = 'all' // 通行方式
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
  created() {
    console.log(1)
    passList().then(res => {
      console.log(res)
    })
  }
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
  top: 38%;
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
  width: 30px;
  height: 30px;
}
</style>

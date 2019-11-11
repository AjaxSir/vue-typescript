<template>
  <div>
    <div class="pass">
      <div class="scene-header">
        <!-- <svg-icon icon-class="v_zanbi" class-name="scene-house" /> -->
        <i class="iconfont icon-renyuantongji1"></i>
        <span class="scene-titile">人员通行</span>
      </div>
      <div>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="图表" name="图表">
            <line-chart :chartData="chartData"></line-chart>
          </el-tab-pane>
          <el-tab-pane label="列表" name="列表">
            <div class="table-margin">
              <el-table :data="tableData" stripe border height="250">
                <el-table-column prop="type" label="类型" width="60px"></el-table-column>
                <el-table-column prop="house" label="房屋" width="60px"></el-table-column>
                <el-table-column prop="phone" label="电话"></el-table-column>
                <el-table-column prop="opendoor" label="开门方式"></el-table-column>
                <el-table-column prop="img" label="人脸" width="50px">
                  <template slot-scope="scope">
                    <img class="face-img" :src="scope.row.img" alt />
                  </template>
                </el-table-column>
                <el-table-column prop="date" label="时间"></el-table-column>
              </el-table>

              <el-button class="button-list" type="primary" plain size="small">查看更多</el-button>
            </div>
          </el-tab-pane>
        </el-tabs>
        <!-- <pie-chart :chartData="chartData"></pie-chart> -->
      </div>
    </div>
  </div>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";
import pieChart from "./PieChart.vue";
import LineChart from "./LineChart.vue";
// import { getTimeDoor } from "@/api/statistics";

@Component({
  components: {
    pieChart,
    LineChart
  }
})
export default class openDoor extends Vue {
  data() {
    return {
      chartData: {
        label: [],
        visData: [
          5,
          9,
          4,
          1,
          5,
          6,
          9,
          7,
          5,
          8,
          9,
          8,
          5,
          2,
          5,
          4,
          5,
          8,
          5,
          5,
          8,
          5,
          5,
          7,
          4,
          12
        ],
        resData: [
          1,
          2,
          5,
          5,
          5,
          5,
          1,
          2,
          5,
          5,
          5,
          5,
          1,
          2,
          5,
          5,
          5,
          5,
          5,
          9,
          4,
          1,
          5,
          6,
          9,
          7
        ]
      },
      activeName: "图表",
      tableData: [
        {
          type: "业主",
          house: "1-1-1",
          phone: " 182XXXXX",
          opendoor: "刷脸开门",
          img: require("../../../assets/4075389faf0c20cf430ce772c3afa47.png"),
          date: "2016-05-02"
        },
        {
          type: "业主",
          house: "1-1-1",
          phone: " 182XXXXX",
          opendoor: "刷脸开门",
          img: require("../../../assets/4075389faf0c20cf430ce772c3afa47.png"),
          date: "2016-05-02"
        },
        {
          type: "业主",
          house: "1-1-1",
          phone: " 182XXXXX",
          opendoor: "刷脸开门",
          img: require("../../../assets/4075389faf0c20cf430ce772c3afa47.png"),
          date: "2016-05-02"
        },
        {
          type: "业主",
          house: "1-1-1",
          phone: " 182XXXXX",
          opendoor: "刷脸开门",
          img: require("../../../assets/4075389faf0c20cf430ce772c3afa47.png"),
          date: "2016-05-02"
        }
      ]
    };
  }

  created() {
    // this.fetchData();
  }

  async fetchData() {
    const { data } = await getTimeDoor();
    this.label = [];
    for (var k in data.open_ratio) {
      this.chartData.label.push(k);
      this.chartData.data.push({ value: data.open_ratio[k], name: k });
    }
  }

  handleClick(tab, event) {
    console.log(tab, event);
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$size: 24px;
$wa: #ffa726;
$la: #26c6da;
$lv: #66bb6a;
$block: inline-block;
.pass {
  border: solid 1px #e6e6e6;
  background: #fff;
}
.visitor {
  margin-top: 16px;
}
.scene-header {
  padding: 10px 10px 2px 10px;
  border-bottom: solid 1px #e6e6e6;
}
.iconfont {
  color: #409eff;
  font-size: 26px;
  margin-right: 4px;
}
.scene-titile {
  color: #5c5f63;
  font-size: 15px;
}

.table-margin {
  margin: 0 10px;
}
.face-img {
  width: 30px;
  height: 30px;
}
.button-list {
  margin: 6px;
  float: right;
}
</style>

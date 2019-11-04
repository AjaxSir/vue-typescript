<template>
  <div class="pass scene-rename">
    <div class="scene-header">
      <svg-icon icon-class="v_line" class-name="scene-house" />
      <span class="scene-titile">实时通行</span>
      <span class="pass-time">{{ today.ymd }} {{ today.week }} {{ today.hour }} {{ today.sec }}</span>
    </div>
    <el-row>
      <el-col :span="18">
        <line-chart :chartData="chartData"></line-chart>
      </el-col>
      <el-col :span="6">
        <p class="pass-num">
          常住人口
          <br />
          <span class="line-targ targ1"></span>
          <br />
          <span class="num num1">{{ resCount }}</span>
          <span class="num-text">次</span>
        </p>
        <p class="pass-num">
          访客
          <br />
          <span class="line-targ targ2"></span>
          <br />
          <span class="num num2">{{ visCount }}</span>
          <span class="num-text">次</span>
        </p>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";
import { formatTime } from "@/utils";
import LineChart from "./LineChart.vue";
// import { getTimeDoor } from "@/api/statistics";

@Component({
  components: {
    LineChart
  }
})
export default class passTime extends Vue {
  data() {
    return {
      today: {},
      chartData: {
        label: [],
        visData: [],
        resData: []
      },
      resCount: 0,
      visCount: 0
    };
  }

  created() {
    // this.fetchData();
  }

  beforeMount() {
    // 实时显示时间
    let that = this;
    function setDate() {
      const curDate = new Date();
      that.today = formatTime(curDate);
    }
    setInterval(setDate, 1000);
    setDate();
  }

  async fetchData() {
    this.initArray();
    const { data } = await getTimeDoor();
    for (var k in data.record_chart.resident_record) {
      this.resCount += data.record_chart.resident_record[k];
    }
    for (var j in data.record_chart.visitor_record) {
      this.visCount += data.record_chart.visitor_record[j];
    }

    for (var i = 0; i < 24; i++) {
      data.record_chart.resident_record[i]
        ? this.chartData.resData.push(data.record_chart.resident_record[i])
        : this.chartData.resData.push("0");
      data.record_chart.visitor_record[i]
        ? this.chartData.visData.push(data.record_chart.resident_record[i])
        : this.chartData.visData.push("0");
    }
  }

  initArray() {
    this.chartData.label = [];
    for (var i = 0; i < 24; i++) {
      this.chartData.label.push(`${i}`);
    }
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
.scene-header {
  padding: 10px 10px 2px 10px;
  border-bottom: solid 1px #e6e6e6;
}
.scene-house {
  font-size: 26px;
  margin-right: 4px;
}
.scene-titile {
  color: #5c5f63;
  font-size: 15px;
}
.pass-time {
  float: right;
  font-size: 14px;
  line-height: 34px;
  color: #5c5f63;
}
.pass-num {
  text-align: center;
  color: #5c5f63;
  font-size: 15px;
  margin-top: 40px;
}
.line-targ {
  display: $block;
  width: 35px;
  border-bottom: 1px solid $lv;
  margin-bottom: 10px;
}
.targ1 {
  border-bottom: 1px solid $la;
}
.targ2 {
  border-bottom: 1px solid $wa;
}
.num {
  font-size: $size;
  color: $lv;
}
.num1 {
  color: $la;
}
.num2 {
  color: $wa;
}
.num-text {
  font-size: 12px;
}
</style>

<template>
  <div>
    <div class="pass scene-rename">
      <div class="scene-header">
        <svg-icon icon-class="v_zanbi" class-name="scene-house" />
        <span class="scene-titile">开门占比</span>
      </div>
      <div>
        <pie-chart :chartData="chartData"></pie-chart>
      </div>
    </div>
  </div>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";
import pieChart from "./PieChart.vue";
// import { getTimeDoor } from "@/api/statistics";

@Component({
  components: {
    pieChart
  }
})
export default class openDoor extends Vue {
  data() {
    return {
      chartData: {
        label: [],
        data: []
      }
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
.scene-house {
  font-size: 26px;
  margin-right: 4px;
}
.scene-titile {
  color: #5c5f63;
  font-size: 15px;
}
</style>

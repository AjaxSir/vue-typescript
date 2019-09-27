<template>
  <div :class="className" :style="{ height: height, width: width }"></div>
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import { debounce } from "@/utils";

export default {
  props: {
    className: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "355px"
    },
    chartData: {
      type: Object
    },
    label: {
      type: Array,
      default: () => {
        return [];
      }
    },
    data: {
      type: Array,
      default: () => {
        return ["刷脸开门", "远程开门", "二维码开门"];
      }
    }
  },
  data() {
    return {
      chart: null,
      legendData: { data: [] },
      seriesData: [{ data: [] }], // 饼图各个项目名
      title: { text: "" }
    };
  },

  watch: {
    chartData: {
      handler(newVal, oldVal) {
        this.legendData.data = newVal.label;
        this.seriesData[0].data = newVal.data;
        this.chart.setOption({
          title: this.title,
          legend: this.legendData,
          series: this.seriesData
        });
      },
      deep: true
    }
  },
  mounted() {
    this.initChart();
    this.__resizeHanlder = debounce(() => {
      if (this.chart) {
        this.chart.resize();
      }
    }, 100);
    window.addEventListener("resize", this.__resizeHanlder);
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    window.removeEventListener("resize", this.__resizeHanlder);
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");

      this.chart.setOption({
        tooltip: {
          // trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        color: ["#f6da22", "#ABDEA4"],
        legend: {
          orient: "vertical",
          left: "right",
          top: "30px",
          data: []
        },
        calculable: true,
        series: [
          {
            name: "通行数据量",
            type: "pie",
            // roseType: "radius",
            radius: "46%",
            center: ["48%", "65%"],
            labelLine: {
              normal: {
                length: 2
              }
            },
            data: [],
            animationEasing: "cubicInOut",
            animationDuration: 2600
          }
        ]
      });
    }
  }
};
</script>
<style></style>

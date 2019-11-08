<template>
  <div :class="className" :style="{ height: height, width: width }"></div>
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import { debounce } from "@/utils";

export default {
  name: "lineChart",
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
      default: "280px"
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object
    }
  },

  data() {
    return {
      chart: null,
      legendData: { data: this.chartData.label },
      seriesData: [{ data: [4, 5, 6] }],
      title: { text: "" }
    };
  },

  created() {
    this.setLegendData();
  },

  watch: {
    chartData: {
      handler(newVal, oldVal) {
        this.seriesData = [{ data: newVal.visData }, { data: newVal.resData }];
        this.legendData = { data: this.chartData.label };
        if (JSON.stringify(newVal) === "{}") {
          this.title.text = "暂无数据";
        } else {
          this.title.text = "";
        }
        this.chart.setOption({
          title: this.title,
          xAxis: this.legendData,
          series: this.seriesData
        });
      },
      deep: true
    }
  },

  mounted() {
    this.initChart();
    this.chartResize();
  },

  methods: {
    setOptions({ expectedData, actualData } = {}) {
      this.chart.setOption({
        title: {
          text: "",
          x: "center",
          y: "30%"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        legend: {
          data: ["访客", "常住人口"]
        },
        grid: {
          // top: "5%",
          left: "3%",
          right: "3%",
          bottom: "5%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            axisPointer: {
              label: {
                formatter: function(params) {
                  return params.value;
                }
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: "#26c6da"
              }
            },
            data: []
          }
        ],
        yAxis: [
          {
            type: "value",
            axisLabel: {
              show: true,
              textStyle: {
                color: "#26c6da"
              }
            }
          }
        ],
        series: [
          {
            name: "访客",
            type: "line",
            stack: "总量",
            areaStyle: {
              normal: {
                // color: "#26c6da",
                areaStyle: {
                  style: "default"
                }
              }
            },
            data: []
          },
          {
            name: "常住人口",
            type: "line",
            stack: "总量",
            areaStyle: {
              normal: {
                // color: "#66bb6a",
                areaStyle: {
                  style: "default"
                }
              }
            },
            data: []
          }
        ]
      });
    },
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");
      this.setOptions(this.chartData);
    },
    setLegendData() {
      this.chartData.label = [];
      for (var i = 0; i < 24; i++) {
        this.chartData.label.push(`${i} 时`);
      }
    },

    chartResize() {
      if (this.autoResize) {
        this.__resizeHanlder = debounce(() => {
          if (this.chart) {
            this.chart.resize();
          }
        }, 100);
        window.addEventListener("resize", this.__resizeHanlder);
      }
    }
  }
};
</script>

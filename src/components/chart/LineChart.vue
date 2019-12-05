<template>
  <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts'
// require('echarts/theme/macarons') // echarts theme
require('echarts/lib/chart/line')
import { debounce } from '@/utils'

export default {
  name: 'lineChart',
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object
    },
    dateRange: {
      type: Array,
      // default: ['2019-10-01', '2019-10-20']
    }
  },

  data() {
    return {
      chart: null,
      legendData: { data: this.chartData.label },
      // legendData: { data: ['办公楼1', '办公楼2'] },
      seriesData: [
        {
          data: [
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            0,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            0,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            0,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            0,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            0,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            0
          ]
        },
        {
          data: [
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            0,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            0,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            0,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            0,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            0,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            0
          ]
        },
        {
          data: [
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            0,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            0,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            0,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            0,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            0,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            0
          ]
        }
      ],
      title: { text: '' }
    }
  },

  created() {
    this.handler()
  },

  watch: {
    chartData: {
      handler(newVal, oldVal) {
        // this.seriesData = [{ data: newVal.visData }, { data: newVal.resData }]
        this.legendData = { data: this.chartData.label }
        if (JSON.stringify(newVal) === '{}') {
          this.title.text = '暂无数据'
        } else {
          this.title.text = ''
        }
        this.chart.setOption({
          title: this.title,
          xAxis: this.legendData,
          series: this.seriesData
        })
      },
      deep: true
    },
    dateRange: {
      handler(newVal, oldVal) {
        this.chartData.label = []
        for (var i = Number(newVal[0].split('-')[2]); i <= Number(newVal[1].split('-')[2]); i++) {
          if (i < 10) {
            i = `0${i}`
          }
          this.chartData.label.push(`${newVal[0].split('-')[0]}-${newVal[0].split('-')[1]}-${i}`)
        }
      }
    }
  },

  mounted() {
    this.initChart()
    if (this.autoResize) {
      this.__resizeHanlder = debounce(() => {
        if (this.chart) {
          this.chart.resize()
        }
      }, 100)
      window.addEventListener('resize', this.__resizeHanlder)
    }
  },
  methods: {
    setOptions({ expectedData, actualData } = {}) {
      this.chart.setOption({
        title: {
          text: '',
          x: 'center',
          y: '30%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: ['1', '2', '3']
        },
        grid: {
          // top: "5%",
          left: '3%',
          right: '5%',
          bottom: '5%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisLabel: {
              show: true,
              // rotate: 55, // -30度角倾斜显示
              textStyle: {
                color: '#26c6da'
              }
            },
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              show: true,
              textStyle: {
                color: '#26c6da'
              }
            }
          }
        ],
        series: [
          {
            // name: '1',
            type: 'line',
            stack: '总量',
            itemStyle: {
              normal: {
                color: '#ffdb5c', // 改变折线点的颜色
                lineStyle: {
                  color: '#ffdb5c' // 改变折线颜色
                }
              }
            },
            data: []
          },
          {
            // name: '2',
            type: 'line',
            stack: '总量',
            itemStyle: {
              normal: {
                color: '#67e0e3', // 改变折线点的颜色
                lineStyle: {
                  color: '#67e0e3' // 改变折线颜色
                }
              }
            },
            data: []
          },
          {
            // name: '3',
            type: 'line',
            stack: '总量',
            itemStyle: {
              normal: {
                color: '#37a2da', // 改变折线点的颜色
                lineStyle: {
                  color: '#37a2da' // 改变折线颜色
                }
              }
            },
            data: []
          }
        ]
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'line')
      this.setOptions(this.chartData)
    },
    setTimeData() {
      /** @description 时统计 */
      this.chartData.label = []
      for (var i = 0; i < 60; i++) {
        this.chartData.label.push(`${i} 分`)
      }
    },
    setDayData() {
      /** @description 日统计 */
      this.chartData.label = []
      for (var i = 0; i < 24; i++) {
        this.chartData.label.push(`${i} 时`)
      }
    },
    setWeekData() {
      /** @description 周统计 */
      this.chartData.label = [
        '星期一',
        '星期二',
        '星期三',
        '星期四',
        '星期五',
        '星期六',
        '星期天'
      ]
    },

    handler() {
      this.chartData.label = []
      for (var i = Number(this.dateRange[0].split('-')[2]); i <= Number(this.dateRange[1].split('-')[2]); i++) {
        if (i < 10) {
          i = `0${i}`
        }
        this.chartData.label.push(`${this.dateRange[0].split('-')[0]}-${this.dateRange[0].split('-')[1]}-${i}`)
      }
    }

  }
}
</script>

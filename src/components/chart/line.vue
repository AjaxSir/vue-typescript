<template>
  <div :id="id" :style="{height:height,width:width}"></div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    XDate: {
      type: Array,
      default: () => {
        return []
      }
    },
    YDate: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  created() {},
  data() {
    return {
      handle: null,
      myChart: null,
      options: {
        title: {
          text: this.title,
          x: 'center'
        },
        tooltip: {
          trigger: 'item'
        },

        grid: {
          // top: "5%",
          left: '3%',
          right: '5%',
          bottom: '5%',
          containLabel: true
        },
        xAxis: {
          data: this.XDate
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            type: 'line',
            name: this.title,
            data: this.YDate
          }
        ]
      }
    }
  },
  methods: {
    draw() {
      this.myChart.setOption(this.options)
      const _this = this
      this.handle = () => {
        _this.myChart.resize()
      }
      this.myChart.on('click', params => {

      })
      window.addEventListener('resize', this.handle, false)
      setTimeout(() => {
        this.myChart.hideLoading()
      }, 1000)
    }
  },
  mounted() {
    this.myChart = this.$echarts.init(document.getElementById(this.id))
    this.myChart.showLoading()
    this.draw()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handle, false)
  },
  watch: {
    YDate: {
      handler(n, o) {
        this.options.series[0].data = n
        this.myChart.setOption(this.options)
      },
      deep: true
    },
    XDate: {
      handler(n, o) {
        this.options.xAxis.data = n
        this.myChart.setOption(this.options)
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

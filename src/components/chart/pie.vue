<template>
  <div :id='id' :style='{ width:width,height:"260px"}'></div>
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
      default: '400px'
    }
  },
  created() {
  },
  data() {
    return {
      handle: null,
      myChart: null
    }
  },
  methods: {
    draw() {
      this.myChart.setOption({
        title: {
          text: this.title,
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },

        series: [{
          type: 'pie',
          name: '销量',
          data: [{
            name: 's',
            value: 1
          }, {
            name: 'd',
            value: 1
          }, {
            name: 'f',
            value: 1
          }, {
            name: 'g',
            value: 1
          }, {
            name: 'h',
            value: 1
          }, {
            name: 'j',
            value: 1
          }]
        }]
      })
      const _this = this
      this.handle = () => { _this.myChart.resize() }
      this.myChart.on('click', (params) => {

      })
      window.addEventListener('resize',
        this.handle, false)
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
  }
}
</script>

<style lang="scss" scoped>

</style>

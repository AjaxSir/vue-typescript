<template>
  <div :id='id' style='width:800px;height:460px'>

  </div>
</template>

<script>
  export default {
    props: {
      id: {
        default: '',
        type: String
      },
      title: {
        default: '',
        type: String
      }
    },
    data() {
      return {}
    },
    methods: {
      draw() {
        const myChart = this.$echarts.init(document.getElementById(this.id))
        const option = {
          title: {
            text: this.title
          },
          legend: {
            data: ['校内', '校外', '其他']
          },
          tooltip: {
            trigger: 'axis'
          },
          xAxis: [{
            type: 'category',
            data: [
              '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00',
              '07:00', '08:00', '09:00', '10:00', '11:00',
              '12:00', '13:00', '14:00', '15:00', '16:00',
              '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
          }],
          yAxis: [
            { type: 'value' }
          ],
          series: [
            {
              name: '校内',
              type: 'bar',
              data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
            },
            {
              name: '校外',
              type: 'bar',
              data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
            },
            {
              name: '其他',
              type: 'bar',
              data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
            }
          ]
        }
        myChart.setOption(option)
      }
    },
    mounted() {
      this.draw()
    }
  }
</script>

<style lang="scss" scoped>

</style>

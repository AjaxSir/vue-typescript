import { Bar } from 'vue-chartjs'

export default {
  extends: Bar,
  props: {
    data: {
      type: Array,
      default: () => {
        return [0, 0, 0, 0, 0, 0, 0]
      }
    },
    labels: {
      type: Array,
      default: () => {
        return []
      }
    },
    text: {
      type: Array,
      default: () => {
        return ['近7日抓拍数据量', '每日抓拍量']
      }
    }
  },
  mounted() {
    this.renderChart({
      labels: this.labels,
      datasets: [
        {
          label: this.text[1],
          backgroundColor: '#48CFAE',
          data: this.data
        }
      ]
    },
    {
      responsive: true, // false为覆盖宽度和高度：
      maintainAspectRatio: false,
      title: {
        display: true,
        position: 'top',
        text: this.text[0]
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    })
  },
  watch: {
    data(n, o) {
      this.renderChart({
        labels: this.labels,
        datasets: [
          {
            label: this.text[1],
            backgroundColor: '#48CFAE',
            data: n
          }
        ]
      },
      {
        responsive: true, // false为覆盖宽度和高度：
        maintainAspectRatio: false,
        title: {
          display: true,
          position: 'top',
          text: this.text[0]
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      })
      // this.set(this.renderChart, 'datasets', [])
    }
  }
}

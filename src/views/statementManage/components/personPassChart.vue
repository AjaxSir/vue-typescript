<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>人员通行统计</span>
      </div>
      <div class="text item">
        <el-row>
          <el-col :span='4'>
            统计粒度:
            <el-select style="width: 100px" v-model="sortForm.particleSize" placeholder="请选择">
              <el-option label="天" value="day"></el-option>
              <el-option label="小时" value="hour"></el-option>
            </el-select>
          </el-col>
          <el-col :span='4'>
             人员类型:
            <el-select style="width: 100px" v-model="sortForm.userType" placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option label="住户" value="house"></el-option>
              <el-option label="访客" value="visitor"></el-option>
            </el-select>
          </el-col>
          <el-col :span='4'>
            通行方向:
            <el-select style="width: 100px" @change='inOutChange' v-model="sortForm.Direction" placeholder="请选择">
              <el-option label="全部" value="all"></el-option>
              <el-option label="进" value="in"></el-option>
              <el-option label="出" value="out"></el-option>
            </el-select>
          </el-col>
          <el-col :span='12'>
            通行时间:
            <el-date-picker
            style="width:360px"
              v-model="timeRange"
              type="datetimerange"
              range-separator="-"
              @change='timeChange'
              format='yyyy-MM-dd HH:mm:ss'
              value-format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="开始日期"
              :clearable='true'
              :picker-options="pickerOptions"
              end-placeholder="结束日期">
            </el-date-picker>
            <el-button type='primary' @click='dataChange'>开始统计</el-button>
          </el-col>
        </el-row>
        <el-tabs v-model="activeName" >
          <el-tab-pane label="图表展示" name="first">
            <LineChart
            v-if='lineY.length || lineX.length'
            id='screen'
            :XDate='lineX'
            :YDate='lineY'
            title='统计'
            width='800px'>
            </LineChart>
            <span v-else>当前筛选条件无数据</span>
          </el-tab-pane>
          <el-tab-pane label="表格展示" name="second">
            <el-table
            :data="data"
            height="65vh"
            style="width: 100%">
            <el-table-column
              prop="date"
              align="center"
              label="时间">
            </el-table-column>
            <el-table-column
              prop="count"
              align="center"
              label="次数">
            </el-table-column>
          </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getPassListChart } from '@/api/screenApi.ts'
import LineChart  from '@/components/chart/line.vue'
import { formatTimeObj } from '@/utils'
@Component({
  components: {
    LineChart
  }
})
  export default class PersonpassChart extends Vue{
    sortForm: object = {
      particleSize: 'day',
      userType: '',
      startTime: '',
      endTime: '',
      Direction: ''
    }
    timeRange: Array<string> = []
    data: Array<Object> =  []
    lineY: Array<any> = [] // 纵坐标
    lineX: Array<any> = [] // 横坐标
    activeName: string = 'first'
    pickerOptions: object = {
        disabledDate(time) {
        return time.getTime() > Date.now() - 8.64e7;
      }
    }
    setTime() {
      const today = new Date().getTime()
      const sevenDay = today - 30 * 24 * 60 * 60 * 1000
      this.sortForm['startTime'] = formatTimeObj(sevenDay, 'detail')
      this.sortForm['endTime'] =  formatTimeObj(today, 'detail')
      this['timeRange'] = [ formatTimeObj(sevenDay, 'detail'), formatTimeObj(today, 'detail') ]
    }
    fetchListData() {
      this.lineX = []
      this.lineY = []
      getPassListChart(this.sortForm).then(res => {
        if (res.data.code === 200) {
          this.data = res.data.data
          res.data.data.forEach(ele => {
            this.lineX.push(ele.date)
            this.lineY.push(ele.count)
          })
        } else {
          this.$message.error('获取数据失败')
        }

      })
    }
    // 点击确定筛选
    dataChange() {
      if (!this.timeRange) {
        return this.$message.error('请先选择时间段查询')
      }
      this.fetchListData()
    }
    // 时间变化
    timeChange(val) {
       if (val) {
        this.sortForm['startTime'] = val[0]
        this.sortForm['endTime'] =  val[1]
      }
    }
    // 进出筛选
    inOutChange(val) {
      this.lineX = []
      this.lineY = []
      this.data.forEach(ele => {
          this.lineX.push(ele['date'])
          if (val === 'all') {
            this.lineY.push(ele['count'])
          } else if (val === 'in') {
            this.lineY.push(ele['countIn'])
          } else {
            this.lineY.push(ele['countOut'])
          }

      })
    }
    created(){
      this.fetchListData()
      this.setTime()
    }
  }
</script>

<style scoped>

</style>

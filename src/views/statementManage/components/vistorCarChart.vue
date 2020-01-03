<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>访客车辆统计报告</span>
      </div>
      <div class="text item">
            <el-button type="primary" @click='setTime(7)'>最近一周</el-button>
            <el-button type="primary" @click='setTime(30)'>最近一月</el-button>
            <el-button type="primary" @click='visible = true, timeRange = ["", ""], sortForm.startTime="",sortForm.endTime=""'>自定义</el-button>
            <span v-show='visible'>
            <el-date-picker
              style="width:360px"
                v-model="timeRange"
                type="datetimerange"
                range-separator="-"
                @change='timeChange'
                format='yyyy-MM-dd HH:mm:ss'
                value-format="yyyy-MM-dd HH:mm:ss"
                start-placeholder="开始日期"
                clearable
                :picker-options="pickerOptions"
                end-placeholder="结束日期">
              </el-date-picker>
            <el-button type='primary' @click='dataChange'>开始统计</el-button>
            </span>
        <el-table
          :data="data"
          border
          height="50vh"
          style="width: 100%;margin-top:10px">
          <el-table-column
            prop="carNo"
            align="center"
            label="车牌号">
          </el-table-column>
          <el-table-column
            prop="count"
            align="center"
            label="次数">
          </el-table-column>
        </el-table>
        <el-pagination
            :current-page="sortForm.page"
        @current-change='fetchListData'
        style="margin-top:10px;" background layout="prev, pager, next" :total="sortForm.total"></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getVistorCarList } from '@/api/screenApi.ts'
import { formatTimeObj } from '@/utils'
@Component({
})
  export default class VisitorCarChart extends Vue{
    sortForm: object = {
     page:1,
     limit: 10,
      startTime: '',
      endTime: '',
      total:1
    }
    visible: boolean = false // 自定义选项
    timeRange: Array<string> = []
    data: Array<Object> =  []
    pickerOptions: object = {
        disabledDate(time) {
        return time.getTime() > Date.now() - 8.64e7;
      }
    }
    setTime(day: number) {
      const today = new Date().getTime()
      const sevenDay = today - day * 24 * 60 * 60 * 1000
      this.sortForm['startTime'] = formatTimeObj(sevenDay, 'detail')
      this.sortForm['endTime'] =  formatTimeObj(today, 'detail')
      this['timeRange'] = [ formatTimeObj(sevenDay, 'detail'), formatTimeObj(today, 'detail') ]
      this.fetchListData(1)
    }
    fetchListData(page) {
      this.sortForm['page'] = page
      getVistorCarList(this.sortForm).then(res => {
        if (res.data.code === 200) {
          this.data = res.data.data.records
          this.sortForm['total'] = res.data.data.total
        } else {
          this['message']('error', `获取数据失败`)
        }
      })
    }
    // 点击确定筛选
    dataChange() {
      if (!this.timeRange) {
        return this['message']('error', `请先选择时间段查询`)
      }
      this.fetchListData(1)
    }
    // 时间变化
    timeChange(val) {
       if (val) {
        this.sortForm['startTime'] = val[0]
        this.sortForm['endTime'] =  val[1]
      }
    }
    created(){
      this.setTime(7)
      // this.fetchListData()
    }
  }
</script>

<style scoped>

</style>

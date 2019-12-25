<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>访客/被访人统计报告</span>
      </div>
      <div class="text item">
            <el-button type="primary" @click='setTime(7)'>最近一周</el-button>
            <el-button type="primary" @click='setTime(30)'>最近一月</el-button>
            <el-button type="primary" @click='visible = true'>自定义</el-button>
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
              :clearable='true'
              :picker-options="pickerOptions"
              end-placeholder="结束日期">
            </el-date-picker>
            <el-button type='primary' @click='dataChange'>开始统计</el-button>
            </span>
        <el-tabs v-model="activeName" @tab-click='clickTabs'>
          <el-tab-pane label="访客排序" name="first">
            <el-table
              :data="data"
               border
              style="width: 100%">
              <el-table-column
                prop="name"
                align="center"
                width="200"
                label="姓名">
              </el-table-column>
              <el-table-column
                prop="cardName"
                align="center"
                width="200"
                label="证件名称">
              </el-table-column>
              <el-table-column
                prop="cardNo"
                align="center"
                :show-overflow-tooltip='true'
                label="证件号">
              </el-table-column>


              <el-table-column
                prop="count"
                width="100"
                align="center"
                label="次数">
              </el-table-column>
            </el-table>
            <el-pagination
            :current-page="sortForm.page"
        @current-change='fetchListData'
        style="margin-top:10px;" background layout="prev, pager, next" :total="sortForm.total"></el-pagination>
          </el-tab-pane>
          <el-tab-pane label="被访人排序" name="second">
            <el-table
            border
              :data="data"
              style="width: 100%">
              <el-table-column
                prop="name"
                width="200"
                align="center"
                label="姓名">
              </el-table-column>
              <el-table-column
                prop="phone"
                align="center"
                width="200"
                label="电话">
              </el-table-column>
              <el-table-column
                prop="name"
                align="center"
                :show-overflow-tooltip='true'
                label="房屋编号">
                <template slot-scope="{row}">
                  <span>{{ row.houseNames[0] }}</span>
                </template>
              </el-table-column>

              <el-table-column
                prop="count"
                align="center"
                width="100"
                label="次数">
              </el-table-column>
            </el-table>
            <el-pagination
            :current-page="sortForm.page"
        @current-change='fetchvistoredData'
        style="margin-top:10px;" background layout="prev, pager, next" :total="sortForm.total"></el-pagination>
          </el-tab-pane>
        </el-tabs>

      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { vistorSort, vistoredSort } from '@/api/screenApi.ts'
import { formatTimeObj } from '@/utils'
@Component({
})
  export default class VisitorChart extends Vue{
    sortForm: object = {
      userType: 'visitor',
      startTime: '',
      endTime: '',
      page: 1,
      limit: 10,
      total: 1
    }
    visible: boolean = false // 自定义选项
    timeRange: Array<string> = []
    activeName: string = 'first'
    data: Array<object> =  []
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
      if (this.activeName === 'first') {
        this.fetchListData(1)
      } else {
        this.fetchvistoredData(1)
      }
    }
    // 访客列表
    fetchListData(page) {
      this.sortForm['page'] = page
      vistorSort(this.sortForm).then(res => {
        if (res.data.code === 200) {
          this.data = res.data.data.records
          this.sortForm['total'] = res.data.data.total
        } else {
          this.$message.error('获取数据失败')
        }
      })
    }
    // 被访者列表
    fetchvistoredData(page) {
      this.sortForm['page'] = page
      vistoredSort(this.sortForm).then(res => {
        if (res.data.code === 200) {
          this.data = res.data.data.records
          this.sortForm['total'] = res.data.data.total
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
      if (this.activeName === 'first') {
        this.fetchListData(1)
      } else {
        this.fetchvistoredData(1)
      }
    }
    // 切换tabs页
    clickTabs(Component: object) {
      this.sortForm['page'] = 1
      if (Component['name'] === 'first') {
        this.fetchListData(1)
      } else {
        this.fetchvistoredData(1)
      }
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
      this.fetchListData(1)
    }
  }
</script>

<style scoped>

</style>

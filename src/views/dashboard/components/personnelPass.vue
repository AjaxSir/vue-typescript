<template>
  <div>
    <div class="pass scene-rename">
      <div class="scene-header">
        <!-- <svg-icon icon-class="v_zanbi" class-name="scene-house" /> -->
        <i class="iconfont icon-renyuantongji1"></i>
        <span class="scene-titile">人员通行</span>
        <router-link v-if='permissionList.includes("managementLook")' :to="{name: 'management'}">
          <el-button style='float:right;padding:5px 0px 0px 0px'  type="text"  >查看更多</el-button>
        </router-link>
      </div>
      <div>
        <el-table
          :data="tableData"
          height="340px"
          style="width: 100%">
          <el-table-column
            prop="date"
            label="类型"
            align="center"
            width="80"
            >
            <template slot-scope="{row}">
              <span>{{ row.isVisitor ? '访客' : '住户' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            :show-overflow-tooltip="true"
            label="姓名"
            align="center"

            >
            <template slot-scope="{row}">
              <span>{{ row.name || '' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="phone"
            label="电话"
            :show-overflow-tooltip="true"
            align="center"
            >
          </el-table-column>
          <el-table-column
            prop="date"
            label="开门方式"
            align="center"
            :show-overflow-tooltip="true"
            >
            <template slot-scope="{row}">
              <span>{{ row.passMethod | passMethod }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="照片"
            align="center"
            >
            <template slot-scope="{row}">
              <img :src="row.photos" alt="">
            </template>
          </el-table-column>
          <el-table-column
            prop="passTime"
            label="时间"
            :show-overflow-tooltip="true"
            align="center"
            >

          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import { peoplePassList } from '@/api/screenApi.ts'
import { Getter } from 'vuex-class'
@Component({
  components: {

  },
  filters: {
    passMethod(val: string) {
      const data = {
        "1": '人脸开门',
        "2": '二维码开门',
        "3": '蓝牙开门',
        "4": '远程开门',
        "5": '密码开门',
        "6": '刷卡开门'
      }
      return data[val]
    }

  }
})
export default class openDoor extends Vue {
  @Getter('permissionList') permissionList: Array<string>
  timer: any = null
      tableData: Array<object> = []

  created() {
    this.fetchList();
    this.timer = setInterval(() => {
       this.fetchList();
    }, 30000)
  }
  beforeDestroy() {
    clearInterval(this.timer)
  }
  mounted() {
  }
  fetchList() {
    peoplePassList().then(res => {
      this.tableData = [...this.tableData, ...res.data.data]
    })
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$size: 24px;
$wa: #ffa726;
$la: #26c6da;
$lv: #66bb6a;
$block: inline-block;
ul{
  overflow: hidden;
  border-bottom: 1px solid lightgray;
}
ul li{
  float: left;
  list-style: none;
  width: 20%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  overflow: hidden;
text-overflow:ellipsis;
white-space: nowrap;
  &:first-child {
    width:10%;
  }
  &:nth-child(2), &:nth-last-child(2){
    width: 10%;
  }
  &:last-child {
    width:30%;
  }
}
.pass {
  border: solid 1px #e6e6e6;
  background: #fff;
}
.visitor {
  margin-top: 16px;
}
.scene-header {
  padding: 10px 10px 2px 10px;
  border-bottom: solid 1px #e6e6e6;
}
.iconfont {
  color: #409eff;
  font-size: 26px;
  margin-right: 4px;
}
.scene-titile {
  color: #5c5f63;
  font-size: 15px;
}

.table-margin {
  margin: 0 10px;
}
.face-img {
  width: 30px;
  height: 30px;
}
.button-list {
  margin: 6px;
  float: right;
}
</style>

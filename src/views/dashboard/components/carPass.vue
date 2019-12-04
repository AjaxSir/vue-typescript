<template>
  <div>
    <div class="pass scene-rename">
      <div class="scene-header">
        <i class="iconfont icon-daohang_taofeicheliangtongji-"></i>
        <span class="scene-titile">车辆通行</span>
      </div>
      <div>
        <ul>
          <li>类型</li>
          <li>房屋</li>
          <li>车牌号</li>
          <li>照片</li>
          <li>时间</li>
        </ul>
        <div v-show='tableData.length' id='content1' style="height: 250px;overflow:hidden">
          <div id='listOne1'>
            <ul v-for='(item, index) in tableData' :key='index'>
              <li>{{ item.type }}</li>
              <li>{{ item.house }}</li>
              <li>{{ item.phone }}</li>
              <li><img style="margin-top:10px" :src="item.img" alt=""></li>
              <li>{{ item.date }}</li>
            </ul>
          </div>
           <div id='listTwo'>
            <ul v-for='(item, index) in tableData' :key='index'>
              <li>{{ item.type }}</li>
              <li>{{ item.house }}</li>
              <li>{{ item.phone }}</li>
              <li><img style="margin-top:10px" :src="item.img" alt=""></li>
              <li>{{ item.date }}</li>
            </ul>
          </div>
        </div>
        <div style="height: 250px;text-align:center;line-height:250px" v-show='!tableData.length'>暂无车辆通行记录</div>
        <router-link :to="{name: 'carPass'}">
          <el-button class="button-list" type="primary" plain size="small">查看更多</el-button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import { carPassList } from '@/api/carApi.ts'
@Component({
  components: {
  }
})
export default class openDoor extends Vue {
  timer: any = null
  tableData: Array<object> = []

  created() {

    // this.fetchData();
  }
  beforeDestroy() {
    clearInterval(this.timer)
  }
  mounted() {
    this.roll(50)
  }
  roll(time) {
    if (this.timer) return
    const content = document.getElementById('content1') as HTMLElement
    const listOne = document.getElementById('listOne1') as HTMLElement
    content.scrollTop = 0
    this.timer = setInterval(() => {
      if (content.scrollTop >= listOne.scrollHeight) {
        content.scrollTop = 0
      } else {
        content.scrollTop ++
      }
    }, time)
  }
  // 获取车辆同行记录
  fetchCarList() {
    carPassList().then(res => {
      this.tableData = res.data.data.records
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
.pass {
  border: solid 1px #e6e6e6;
  background: #fff;
}
.visitor {
  margin-top: 16px;
}
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
  &:first-child {
    width:10%;
  }
  &:last-child {
    width:30%;
  }
}
.scene-header {
  padding: 10px 10px 2px 10px;
  border-bottom: solid 1px #e6e6e6;
}
.iconfont {
  color: #e17f5a;
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

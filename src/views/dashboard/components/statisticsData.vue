<template>
  <div>
    <div class="pass scene-rename">
      <div class="scene-header">
        <i class="iconfont icon-shuzitongjiy"></i>
        <span class="scene-titile">统计信息</span>
      </div>
      <div class="statics-data">
        <!-- <pie-chart :chartData="chartData"></pie-chart> -->
        <p>常住人员: {{ data.userCount }} 人</p>
        <p>累计访客: {{ data.visitorCount  }}人</p>
        <p>租户: {{ data.tenementCount }}户</p>
        <p>租客:{{ data.tenantCount }}人</p>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import { getSceneInfo } from '@/api/screenApi.ts'

@Component({
  components: {
  }
})
export default class openDoor extends Vue {

  data: object = {}
  created() {
    getSceneInfo().then(res => {
      this.data = Object.assign({}, res.data.data)
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
.scene-header {
  padding: 10px 10px 2px 10px;
  border-bottom: solid 1px #e6e6e6;
}
.iconfont {
  color: #bf5d76;
  font-size: 26px;
  margin-right: 4px;
}
.scene-titile {
  color: #5c5f63;
  font-size: 15px;
}
.statics-data {
  padding: 14px 0 14px 14px;
}
.statics-data p {
  font-size: 15px;
  color: #474758;
  line-height: 68px;
}
</style>

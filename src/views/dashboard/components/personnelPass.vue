<template>
  <div>
    <div class="pass">
      <div class="scene-header">
        <!-- <svg-icon icon-class="v_zanbi" class-name="scene-house" /> -->
        <i class="iconfont icon-renyuantongji1"></i>
        <span class="scene-titile">人员通行</span>
      </div>
      <div>
        <ul>
          <li>类型</li>
          <li>房屋</li>
          <li>电话</li>
          <li>照片</li>
          <li>时间</li>
        </ul>
        <div id='content' style="height: 250px;overflow:hidden">
          <div id='listOne'>
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
        <el-button class="button-list" type="primary" plain size="small">查看更多</el-button>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {
  }
})
export default class openDoor extends Vue {
  timer: any = null
      tableData: Array<object> = [
        {
          type: "业主",
          house: "1-1-1",
          phone: " 13518160000",
          img: require("../../../assets/4075389faf0c20cf430ce772c3afa47.png"),
          date: "2016-05-02"
        },
        {
          type: "业主",
          house: "1-1-1",
          phone: " 13518160000",
          img: require("../../../assets/4075389faf0c20cf430ce772c3afa47.png"),
          date: "2016-05-02"
        },
        {
          type: "业主",
          house: "1-1-1",
          phone: " 13518160000",
          img: require("../../../assets/4075389faf0c20cf430ce772c3afa47.png"),
          date: "2016-05-02"
        },
        {
          type: "业主",
          house: "1-1-1",
          phone: " 13518160000",
          img: require("../../../assets/4075389faf0c20cf430ce772c3afa47.png"),
          date: "2016-05-02"
        },
        {
          type: "业主",
          house: "1-1-1",
          phone: " 13518160000",
          img: require("../../../assets/4075389faf0c20cf430ce772c3afa47.png"),
          date: "2016-05-02"
        }
      ]

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
    const content = document.getElementById('content') as HTMLElement
    const listOne = document.getElementById('listOne') as HTMLElement
    content.scrollTop = 0
    this.timer = setInterval(() => {
      if (content.scrollTop >= listOne.scrollHeight) {
        content.scrollTop = 0
      } else {
        content.scrollTop ++
      }
    }, time)
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

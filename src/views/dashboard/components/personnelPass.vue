<template>
  <div>
    <div class="pass scene-rename">
      <div class="scene-header">
        <!-- <svg-icon icon-class="v_zanbi" class-name="scene-house" /> -->
        <i class="iconfont icon-renyuantongji1"></i>
        <span class="scene-titile">人员通行</span>
        <router-link :to="{name: 'management'}">
          <el-button style='float:right;padding:5px 0px 0px 0px'  type="text"  >查看更多</el-button>
        </router-link>
      </div>
      <div>
        <ul>
          <li>类型</li>
          <li>姓名</li>
          <li>电话</li>
          <li>开门方式</li>
          <li>照片</li>
          <li>时间</li>
        </ul>
        <div  @mouseenter="enterList" @mouseleave="leaveList" v-show='tableData.length' id='content' style="height: 250px;overflow:hidden">
          <div id='listOne'>
            <ul v-for='(item, index) in tableData' :key='index'>
              <li><el-tag
                  size="small"
                  style="border-radius: 50px;padding: 0 10px;"
                  :type="!item.isVisitCar? 'success' : 'danger'"
                >{{ item.isVisitCar? "访客" : "住户" }}</el-tag></li>
              <li>
                <el-tooltip class="item" effect="dark" :content="item.userName" placement="top">
                    <span>{{ item.userName || '--' }}</span>
                  </el-tooltip>
                </li>
              <li>
                <el-tooltip class="item" effect="dark" :content="item.phone" placement="top">
                    <span>{{ item.phone || '--' }}</span>
                  </el-tooltip>
                  </li>
              <li>
                <el-tooltip class="item" effect="dark" :content="item.passMethod | passMethod" placement="top">
                    <span>{{ item.passMethod | passMethod }}</span>
                  </el-tooltip>
                </li>
              <li><img style="margin-top:10px" :src="item.photos" alt=""></li>
              <li>
                <el-tooltip class="item" effect="dark" :content="item.passTime" placement="top">
                    <span>{{ item.passTime }}</span>
                  </el-tooltip>
               </li>
            </ul>
          </div>
           <div id='listTwo'>
           <ul v-for='(item, index) in tableData' :key='index'>
              <li><el-tag
                  size="small"
                  style="border-radius: 50px;padding: 0 10px;"
                  :type="!item.isVisitCar? 'success' : 'danger'"
                >{{ item.isVisitCar? "访客" : "住户" }}</el-tag></li>
              <li>
                <el-tooltip class="item" effect="dark" :content="item.userName" placement="top">
                    <span>{{ item.userName || '--' }}</span>
                  </el-tooltip>
                </li>
              <li>
                <el-tooltip class="item" effect="dark" :content="item.phone" placement="top">
                    <span>{{ item.phone || '--' }}</span>
                  </el-tooltip>
                  </li>
              <li>
                <el-tooltip class="item" effect="dark" :content="item.passMethod | passMethod" placement="top">
                    <span>{{ item.passMethod | passMethod }}</span>
                  </el-tooltip>
                </li>
              <li><img style="margin-top:10px" :src="item.photos" alt=""></li>
              <li>
                <el-tooltip class="item" effect="dark" :content="item.passTime" placement="top">
                    <span>{{ item.passTime }}</span>
                  </el-tooltip>
               </li>
            </ul>
          </div>
        </div>
        <div
        style="height: 250px;text-align:center;line-height:250px;font-size:15px;color:#474758"
        v-show='!tableData.length'>暂无人员通行记录</div>


      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import { peoplePassList } from '@/api/screenApi.ts'
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
  timer: any = null
      tableData: Array<object> = []

  created() {

    this.fetchList();
  }
  beforeDestroy() {
    clearInterval(this.timer)
  }
  mounted() {
    this.roll(50)
  }
  enterList() {
    clearInterval(this.timer)
  }
  leaveList() {
    this.roll(50)
  }

  roll(time) {
    // if (this.timer) return
    const content = document.getElementById('content') as HTMLElement
    const listOne = document.getElementById('listOne') as HTMLElement
    if (this.timer) {
      content.scrollTop = content.scrollTop
    } else {
      content.scrollTop =  0
    }
      this.timer = setInterval(() => {
        if (content.scrollTop >= listOne.scrollHeight) {
          content.scrollTop = 0
        } else {
          content.scrollTop ++
        }
      }, time)
    // }

  }
  fetchList() {
    peoplePassList().then(res => {
      this.tableData = res.data.data
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

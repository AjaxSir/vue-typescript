<template>
  <div class="app-container">
    <el-tabs type="border-card">
      <el-tab-pane label="统计分析">
        <div class="single" v-for="(route, index) in ArrRoute" :key='index'>
          <div class="wordTitle">{{route.meta.title}}</div>
            <div class="pass">
              <div class="fun-data">
                <div class="data-statistics" v-for="(item, index) in route.children" :key="index">
                  <div class="fun-title">
                    <router-link v-if="item.meta && item.meta.title" :to='item.path'>
                      <div class="item">
                        <div class="sing-svg" :style="{backgroundColor: item.meta.bg_color}">
                          <i v-if="item.meta && item.meta.icon" :class="['iconfont', item.meta.icon]"></i>
                        </div>
                        <p class="item-text" v-if="item.meta && item.meta.title">{{ item.meta.title }}</p>
                      </div>
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
const ActionManage = () => import('@/views/dashboard/components/actionManage.vue')
@Component
export default class InformIssue extends Vue {
  private ArrRoute: Array<object> = [{
    meta: {
      title: '车辆'
    },
    children: [
      {
        meta: {
          title: '车辆通行次数统计',
          bg_color: '#DF788D',
          icon: 'icon-zhuzhai'
        },
        path: ''
      },
      {
        meta: {
          title: '访客车辆进出次数排序统计',
          bg_color: '#e17f5a',
          icon: 'icon-zhuzhai'
        },
        path: ''
      }
    ]
  },
  {
    meta: {
      title: '人员'
    },
    children: [
      {
        meta: {
          title: '人员通行统计',
          bg_color: '#2c7fec',
          icon: 'icon-zhuzhai'
        },
        path: '/statementManage/personPassChart'
      },
      {
        meta: {
          title: '访客次数排序统计',
          bg_color: '#976041',
          icon: 'icon-zhuzhai'
        },
        path: ''
      },
      {
        meta: {
          title: '陌生人次数统计排序',
          bg_color: '#bec037',
          icon: 'icon-zhuzhai'
        },
        path: ''
      }
    ]
  },
  {
    meta: {
      title: '邮件报告'
    },
    children: [
      {
        meta: {
          title: '定时报告',
          bg_color: '#DF788D',
          icon: 'icon-zhuzhai'
        },
        path: ''
      }
    ]
  }]
}
</script>

<style lang="scss" scoped>
.single{
  width: 100%;
  height: auto;
  border: 1px solid lightgray;
  position: relative;
  margin-top: 20px;
  box-shadow: 0 12px 10px -10px lightgray;
  .wordTitle{
    position: absolute;
    width: 100px;
    height: 20px;
    text-align: center;
    top:-10px;
    left: 100px;
    line-height: 20px;
    background: white;
    z-index: 99;
  }
}
$size: 24px;
$color: #ffffff;

p {
  margin: 5px;
}

.scene-house {
  font-size: 26px;
  margin-right: 4px;
}

.scene-titile {
  color: #5c5f63;
  font-size: 15px;
}

.fun-data {
  display: flex;
  flex-wrap: wrap;
  padding: 10px 0px 0px 0px;
}

.data-statistics {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.fun-title {
  font-size: 14px;
  white-space: nowrap;
  &:hover{
    cursor: pointer;
  }
}

.item-text {
  font-size: 12px;
  margin-top:5px;
  text-align: center;
  // line-height: 68px;
  // margin-left: 20px;
}

.item {
  font-size: 14px;
  text-align:center;
  width:120px;
  // display: flex;
  // border: 1px solid #e6e6e6;
  padding: 0;
  background: #f9f9f9;
  margin: 5px 10px;
  border-radius: 6px;
  background: #fff;
}

.iconfont {
  font-size: $size;
  color: $color;
}

.sing-svg {
  width: 60px;
  text-align: center;
  line-height: 60px;
  margin: 0 auto;
  height: 60px;
  box-shadow: 0 12px 20px -10px rgba(244, 67, 54, 0.28),
    0 4px 20px 0 rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(244, 67, 54, 0.2);
  border-radius: 5px;
}
.childMenu{
  display: inline-block;
}
</style>

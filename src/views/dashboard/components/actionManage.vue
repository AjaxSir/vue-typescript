<template>
  <div class="pass">
    <div class="fun-data">
      <div class="data-statistics" v-for="(item, index) in routes" :key="index">
        <div class="fun-title" v-if="!item.hidden && item.children">
          <div @click='showChildren(item.children, item.meta.title, item.path)' v-if="item.meta && item.meta.title && !noDialog(item.name)">
            <div class="item">
              <div class="sing-svg" :style="{backgroundColor: item.meta.bg_color}">
                <i v-if="item.meta && item.meta.icon" :class="['iconfont', item.meta.icon]"></i>
              </div>
              <p class="item-text" v-if="item.meta && item.meta.title">{{ item.meta.title }}</p>
            </div>
          </div>
          <div v-else>
            <div class="item">
              <router-link :to="{name: item.name}">
                <div class="sing-svg" :style="{backgroundColor: item.meta.bg_color}">
                  <i v-if="item.meta && item.meta.icon" :class="['iconfont', item.meta.icon]"></i>
                </div>
                <p class="item-text" v-if="item.meta && item.meta.title">{{ item.meta.title }}</p>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
    center
      :title="title"
      :visible.sync="dialogVisible"
      width="500px"
      style='overflow: hidden'
      :before-close="handleClose">
      <div class="data-statistics childMenu" v-for="(item, index) in childrenRoute" :key="index">
        <div class="fun-title" v-if="!item.hidden">
          <router-link v-if="item.meta && item.meta.title" :to='{path: item.parentPath + "/" + item.path}'>
            <div class="item">
              <div class="sing-svg" :style="{backgroundColor: item.meta.bg_color}">
                <i v-if="item.meta && item.meta.icon" :class="['iconfont', item.meta.icon]"></i>
              </div>
              <p class="item-text" v-if="item.meta && item.meta.title">{{ item.meta.title }}</p>
            </div>
          </router-link>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
@Component
export default class ActionManage extends Vue {
  dialogVisible: boolean = false
  title: string = ''
  childrenRoute: Array<Object> = []
  get routes() {
      return [].concat(this.$router['options'].routes)
    }
  handleClose() {
    this.dialogVisible = false
  }
  showChildren(childRoute: Array<Object>, title: string, parentPath: string) {
    this.title = title
    childRoute.forEach(element => {
      element['parentPath'] = parentPath
    });
    this.childrenRoute = childRoute
    this.dialogVisible = true
  }
  // 大屏统计 报表管理 访客登记 不需弹框
  noDialog(routeName) {
    const noDialogList = ['screen', 'statementManage', 'vistor', 'inform', 'device']
    return noDialogList.includes(routeName)
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$size: 48px;
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
  // padding: 46px 10px 5px 10px;
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
  font-size: 16px;
  margin-top:5px;
  text-align: center;
  // line-height: 68px;
  // margin-left: 20px;
}

.item {
  font-size: 14px;
  // display: flex;
  // border: 1px solid #e6e6e6;
  padding: 0;
  background: #f9f9f9;
  margin: 5px 21px;
  border-radius: 6px;
  background: #fff;
}

.iconfont {
  font-size: $size;
  color: $color;
}

.sing-svg {
  width: 100px;
  text-align: center;
  line-height: 100px;
  height: 100px;
  box-shadow: 0 12px 20px -10px rgba(244, 67, 54, 0.28),
    0 4px 20px 0 rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(244, 67, 54, 0.2);
  border-radius: 5px;
}
.childMenu{
  display: inline-block;
}
</style>

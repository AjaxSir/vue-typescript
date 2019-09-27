<!--
  不同页面的筛选
  传入不同的slot 在ActionHeader 里面对应写入不同的筛选条件
  slot name=housenum  对应单元号筛选
-->
<template>
  <el-button
    type="text"
    @mouseenter="visibleStatus"
    @mouseleave="visibleStatus"
  >
    <i class="iconfont icon-filtration"></i>
    过滤
    <transition name="el-zoom-in-top">
      <div v-show="visible" class="filterDialog">
        <slot name="houseNum"></slot>
        <el-button>筛选</el-button>
      </div>
    </transition>
  </el-button>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
@Component
export default class DataTree extends Vue {
  private visible: boolean = false;

  visibleStatus() {
    console.log(this.visible);
    this.visible = !this.visible;
  }
}
</script>

<style lang="scss" scoped>
.filterDialog {
  width: 200px;
  height: auto;
  padding: 20px 10px;
  position: absolute;
  z-index: 11;
  left: -20px;
  top: 40px;
  border: 1px solid lightgray;
  box-shadow: 0px 10px 10px gray;
  background: white;
}
</style>

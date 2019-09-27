<!--
  不同页面的筛选
  传入不同的slot 在ActionHeader 里面对应写入不同的筛选条件
  slot name=housenum  对应单元号筛选
-->
<template>
  <div @mouseenter="visibleStatus" @mouseleave="visibleStatus" class="content">
    过滤
    <transition name="el-zoom-in-top">
      <div v-show="visible" class="filterDialog">
        <slot name="houseNum"></slot>
        <el-button>筛选</el-button>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
@Component
export default class DataTree extends Vue {
  private visible: boolean = false;
  visibleStatus() {
    this.visible = !this.visible;
  }
}
</script>

<style lang="scss" scoped>
.content {
  width: 120px;
  display: inline-block;
  color: white;
  background: teal;
  border-radius: 5px;
  height: 40px;
  text-align: center;
  position: relative;
  line-height: 40px;
  &:hover {
    cursor: pointer;
  }
  .filterDialog {
    width: 240px;
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
}
</style>

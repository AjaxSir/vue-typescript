<template>
  <div v-if="centerDialogVisible" class="big-img-box">
    <p class="big-title">{{bigTitle}}</p>
    <img class="big-image" :src="bigImg" alt="">
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
@Component
export default class BigImg extends Vue{
@Prop({ default: '图片' }) bigTitle: string;
@Prop({ default: false }) centerDialogVisible: Boolean;
@Prop() bigImg: string;
}
</script>

<style  rel="stylesheet/scss" lang="scss" scoped>
.big-img-box {
  width: 260px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  text-align: center;
  padding: 0 25px 40px 25px;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.14);
  position: fixed;
  top: 50%;
  left: 50%;
  margin-left: -130px;
  margin-top: -160px;
  background: #fff;
  z-index: 999;
}
.big-title {
  margin: 10px 0;
  font-size: 18px;
}
.big-image {
  width: 200px;
  height: 200px;;
  vertical-align: middle;
}
</style>

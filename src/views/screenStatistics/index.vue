<template>
  <div class="app-container">
    <span> 建设中...</span>
    <el-button @click='back'>返回</el-button>
    <img width='100%' class='img' src="https://run.mockplus.cn/GA13fqnYR6dHzn2K/app/0EDCD3EB-42DB-412B-9411-E5DD751EB4BA/287F3A0AA37E4E30C60D8A7BF45B1187.png" alt="">
  </div>
</template>

<script lang='ts'>
import { Vue, Component, Mixins } from 'vue-property-decorator'
@Component
export default class ScreenStatistics extends Vue {
  back() {
    this.$router.go(-1)
  }
}
</script>

<style lang="scss" scoped>
.img{
  width: 100%;
  height: 100%;
}
</style>

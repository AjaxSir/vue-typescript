<template>
  <div class="scene scene-rename">
    <div class="scene-header">
      <!-- <svg-icon icon-class="v_houses" class-name="scene-house" /> -->
      <span class="scene-titile">
        <el-tooltip class="item" effect="dark" :content="sceneForm.name" placement="top">
           <span>当前场景: {{ sceneForm.name }}</span>
        </el-tooltip>
        </span>
    </div>
    <div v-cloak class="scene-content">
      <el-carousel v-cloak v-if='sceneForm.pics && sceneForm.pics.length' height="190px">
        <el-carousel-item v-for="item in sceneForm.pics" :key="item">
         <img style='width:100%;height:190px' class="scene-image" :src="item" alt />
        </el-carousel-item>
      </el-carousel>
      <img v-cloak style='width:100%;height:190px' v-else src="../../../assets/partment.jpg" alt="">
      <p class="scene-num">楼栋数: {{ sceneForm.buildingCount }} </p>
      <!-- <p class="scene-num">区域: {{ sceneForm.buildingCount }}</p> -->
      <p class="scene-num">
         <el-tooltip class="item" effect="dark" :content="sceneForm.address" placement="top">
           <span>地址:{{ sceneForm.address }}</span>
        </el-tooltip>
        </p>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { getSceneInfo } from '@/api/screenApi.ts'
@Component
export default class SceneManage extends Vue{
  sceneForm: object = {
    pics: [1]
  }
  created(){
    getSceneInfo().then(res => {
      this.sceneForm = Object.assign({}, res.data.data)
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
.scene {
  height: 290px;
  border: solid 1px #e6e6e6;
  background: #fff;
  margin-bottom: 20px;
}
.scene-header {
  padding: 10px 10px 2px 10px;
  border-bottom: solid 1px #e6e6e6;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.scene-house {
  font-size: 26px;
  margin-right: 4px;
}
.scene-titile {
  color: #5c5f63;
  font-size: 15px;
}

.scene-content {
  padding: 10px 10px 2px 10px;
}
.scene-image {
  width: 100%;
  height: 145px;
  margin-bottom: 10px;
}
.scene-num {
  font-size: 15px;
  color: #474758;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  // line-height: 26px;
}


</style>

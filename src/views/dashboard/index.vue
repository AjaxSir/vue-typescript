<template>
  <div class="app-container">

    <el-row :gutter="20">
      <el-col :span="5">
        <scene-manage />
      </el-col>
      <el-col :span="19">
        <action-manage />
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="9">
        <personnel-pass />
      </el-col>
      <el-col :span="9">
        <car-pass />
      </el-col>
      <el-col :span="6">
        <statistics-data />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";
import actionManage from "./components/actionManage";
import sceneManage from "./components/sceneManage";
import passTime from "./components/passTime";
import openDoor from "./components/openDoor";
import PersonnelPass from "./components/personnelPass";
import CarPass from "./components/carPass";
import StatisticsData from "./components/statisticsData";

@Component({
  components: {
    actionManage,
    sceneManage,
    passTime,
    openDoor,
    PersonnelPass,
    CarPass,
    StatisticsData
  }
})
export default class dashboart extends Vue {}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-container {
  margin-bottom: 20px;
}
</style>

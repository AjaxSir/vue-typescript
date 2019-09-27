<template>
  <div class="app-container">
    <action-manage />

    <el-row :gutter="20">
      <el-col :span="5">
        <scene-manage />
      </el-col>
      <el-col :span="13">
        <pass-time />
      </el-col>
      <el-col :span="6">
        <open-door />
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

@Component({
  components: {
    actionManage,
    sceneManage,
    passTime,
    openDoor
  }
})
export default class dashboart extends Vue {}
</script>

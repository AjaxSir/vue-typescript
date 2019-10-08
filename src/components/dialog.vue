<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible">
    <el-tabs v-model="active" @tab-click="handleClick">
      <el-tab-pane label="用户管理" name="first">详细信息</el-tab-pane>
      <el-tab-pane label="配置管理" name="second">进出单元记录</el-tab-pane>
      <el-tab-pane label="角色管理" name="third">进出小区记录</el-tab-pane>
      <el-tab-pane label="定时任务补偿" name="fourth">车辆信息</el-tab-pane>
      <el-tab-pane label="房屋信息" name="fivw">房屋信息</el-tab-pane>
      <el-tab-pane label="证件信息" name="six">证件信息</el-tab-pane>
      <el-tab-pane label="人脸库信息" name="seven">人脸库信息</el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
@Component
export default class DiaLog extends Vue {
  @Prop({ default: "详情" }) private title: string;
  @Prop({ default: true }) private dialogFormVisible: boolean;
  @Prop({ default: "first" }) private activeName: string;
  private active: string = this.activeName;
  handleClick() {}
}
</script>

<style lang="scss" scoped></style>

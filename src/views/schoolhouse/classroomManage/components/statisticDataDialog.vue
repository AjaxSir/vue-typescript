<template>
  <div>
    <el-dialog
      :title="fromTitle"
      width="680px"
      :visible.sync="formShow"
      :close-on-click-modal="false"
      :before-close="formClose"
    >
      <div slot="title" class="dialog-title">{{fromTitle}}:</div>
      <div>
        <el-tabs type="border-card" @tab-click="getData">
          <el-tab-pane label="详细信息">详细信息</el-tab-pane>
          <el-tab-pane label="通行记录">通行记录</el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from "vue-property-decorator";
@Component
export default class StatisticDataDialog extends Vue {
  @Prop({ default: false }) public formShow: any;
  @Prop() private fromTitle: any;

  formClose() {
    /**@description Form 关闭处理 */
    this.$emit("update:formShow", false);
  }

  getData(tab) {
    console.log(tab.label);
  }
}
</script>

<style lang="scss" scoped>
.dialog-title {
  color: #409eff;
}
</style>

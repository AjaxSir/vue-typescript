<template>
  <div>
    <!-- class="dialog-rewrite"
      :title="officeData.name"
      width="750px"
      :visible.sync="formShowOffice"
      :close-on-click-modal="false"
    :before-close="formClose"-->
    <el-dialog title="提示" :visible.sync="dialogCreate" width="30%" :before-close="formClose">
      <span>这是门禁卡管理新增</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="formClose">取 消</el-button>
        <el-button type="primary" @click="handleBtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
export default class dialogForm extends Vue {
  @Prop() dialogCreate: Boolean;

  created() {
    console.log(this.dialogCreate);
    console.log(123);
  }

  handleBtn() {
    /** @description 确定*/
    console.log(456);
    this.$emit("update:dialogCreate", false);
  }

  formClose() {
    /** @description Form 关闭处理 */
    console.log(123);
    this.$emit("update:dialogCreate", false);
  }
}
</script>

<style lang="scss" scoped>
</style>

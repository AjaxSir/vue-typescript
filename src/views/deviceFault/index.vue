<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <action-header :total="1" />
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="24">
        设备故障
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import mixin from "@/config/minxins";

const ActionHeader = () => import("@/components/ActionHeader.vue");

@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
  }
})
export default class CardManage extends Vue {


}
</script>
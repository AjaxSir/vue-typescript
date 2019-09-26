<template>
<<<<<<< HEAD
  <div class="app-container">
    houseManage
  </div>
</template>
=======
  <div class="main">
    <div class="leftContent">
      <DataTree />
    </div>
    <div class="rightContent">
      <ActionHeader :total="1"></ActionHeader>
      <el-table :data="list_data" border>
        <el-table-column type="selection" width="50"> </el-table-column>
        <el-table-column prop="date" label="所属楼栋" width="180">
        </el-table-column>
        <el-table-column prop="name" label="所属单元" width="180">
        </el-table-column>
        <el-table-column prop="address" label="房屋编号"> </el-table-column>
        <el-table-column prop="address" label="注册人数"> </el-table-column>
        <el-table-column prop="address" label="累计访客人数"> </el-table-column>
        <el-table-column prop="address" label="累计访客次数"> </el-table-column>
        <el-table-column prop="address" label="日平均进出次数">
        </el-table-column>
        <el-table-column prop="address" label="昨日进出次数"> </el-table-column>
        <el-table-column prop="address" label="状态"> </el-table-column>
        <el-table-column prop="address" label="备注"> </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import mixin from "@/config/minxins";
const ActionHeader = () => import("@/components/ActionHeader.vue");
const DataTree = () => import("@/components/DataTree.vue");
@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    DataTree
  }
})
export default class HouseManage extends Vue {}
</script>

<style lang="scss" scoped>
.main {
  display: flex;
  .leftContent {
    flex: none;
    width: 200px;
  }
  .rightContent {
    flex: 1;
  }
}
</style>
>>>>>>> partComponent :fire:

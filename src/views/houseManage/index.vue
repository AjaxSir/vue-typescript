<template>
  <div class="main">
    <div class="leftContent">
      <DataTree />
    </div>
    <div class="rightContent">
      <ActionHeader :total="1"></ActionHeader>
      <el-table :data="list_data" border>
        <el-table-column type="selection" width="50"> </el-table-column>
        <el-table-column
          prop="date"
          align="center"
          label="所属楼栋"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          align="center"
          label="所属单元"
          width="180"
        >
        </el-table-column>
        <el-table-column prop="address" align="center" label="房屋编号">
        </el-table-column>
        <el-table-column prop="address" align="center" label="注册人数">
        </el-table-column>
        <el-table-column prop="address" align="center" label="累计访客人数">
        </el-table-column>
        <el-table-column prop="address" align="center" label="累计访客次数">
        </el-table-column>
        <el-table-column prop="address" align="center" label="日平均进出次数">
        </el-table-column>
        <el-table-column prop="address" align="center" label="昨日进出次数">
        </el-table-column>
        <el-table-column prop="address" align="center" label="状态">
        </el-table-column>
        <el-table-column prop="address" align="center" label="备注">
        </el-table-column>
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
  padding: 20px;
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

<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <ActionHeader :total="1" />
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="4">
        <DataTree />
      </el-col>
      <el-col :span="20">
        <div class="rightContent">
          <el-table :data="list_data" border>
            <el-table-column type="selection" align="center"> </el-table-column>
            <el-table-column
              type="index"
              width="60"
              align="center"
              label="编号"
            >
            </el-table-column>
            <el-table-column prop="name" align="center" label="姓名">
            </el-table-column>
            <el-table-column prop="name" align="center" label="年龄">
            </el-table-column>
            <el-table-column prop="name" align="center" label="性别">
            </el-table-column>
            <el-table-column prop="name" align="center" label="联系电话">
            </el-table-column>
            <el-table-column prop="name" align="center" label="房屋信息">
            </el-table-column>
            <el-table-column prop="name" align="center" label="过期时间">
            </el-table-column>
            <el-table-column prop="name" align="center" label="远程开门">
            </el-table-column>
            <el-table-column prop="name" align="center" label="访客车辆">
            </el-table-column>
            <el-table-column prop="name" align="center" label="是否主联系人">
            </el-table-column>
            <el-table-column prop="name" align="center" label="状态">
            </el-table-column>
            <el-table-column prop="name" align="center" label="备注">
            </el-table-column>
            <el-table-column prop="name" align="center" label="创建时间">
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
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
export default class OwnerManage extends Vue {}
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

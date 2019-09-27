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
            <el-table-column
              prop="address"
              align="center"
              label="日平均进出次数"
            >
            </el-table-column>
            <el-table-column prop="address" align="center" label="昨日进出次数">
            </el-table-column>
            <el-table-column prop="address" align="center" label="状态">
            </el-table-column>
            <el-table-column prop="address" align="center" label="备注">
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
export default class HouseManage extends Vue {
  private cardList: Array<Object> = [
    {
      name: "张三",
      houseRelative: "10",
      createDate: "2019-9-26",
      type: 2
    },
    {
      name: "张三",
      houseRelative: "10",
      createDate: "2019-9-26",
      type: 1
    },
    {
      name: "张三",
      houseRelative: "10",
      createDate: "2019-9-26",
      type: 1
    },
    {
      name: "张三",
      houseRelative: "10",
      createDate: "2019-9-26",
      type: 1
    }
  ];

  private form: Object = {
    name: "",
    region: "",
    date1: "",
    date2: "",
    delivery: false,
    type: [],
    resource: "",
    desc: ""
  };

  private dialogFormVisible: Boolean = false;
  private formLabelWidth: String = "120px";

  editType(item) {
    /**@description 修改状态 */
    console.log(item);
    // this.dialogFormVisible = true;
  }
}
</script>

<style lang="scss" scoped>
.main {
  padding: 20px;
  display: flex;
  .rightContent {
    flex: 1;
  }
}

.demo-block {
  border: 1px solid #ebebeb;
  border-radius: 3px;
}
</style>

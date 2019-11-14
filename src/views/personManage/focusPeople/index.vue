<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <ActionHeader :btnStatus="1" :total="1">
          <!-- <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>进出次数排序</el-dropdown-item>
            <el-dropdown-item>滞留时间排序</el-dropdown-item>
            <el-dropdown-item>次数统计</el-dropdown-item>
          </el-dropdown-menu> -->
          <div slot="houseNum">
            <div class="word-filter">
              <span class="filter-name">分类:</span>
              <el-select  class="input-filter" v-model="statusType" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </div>
        </ActionHeader>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="24">
        <div class="rightContent">
          <el-table :data="list_data" border>
            <el-table-column type="selection" align="center"></el-table-column>
            <el-table-column prop="name" align="center" label="姓名">
              <template slot-scope="{ row }">
                <el-button type='text' @click="showDetail(row)">{{ row.name }}</el-button>
              </template>
            </el-table-column>

            <el-table-column prop="card_number" align="center" label="房号"></el-table-column>
            <el-table-column prop="age" align="center" label="年龄"></el-table-column>
            <el-table-column prop="vistor_type" align="center" label="分类"></el-table-column>
            <el-table-column align="center" label="状态">
              <template slot-scope="scope">
                <el-tag
                  size="small"
                  style="border-radius: 50px;padding: 0 10px; cursor: pointer;"
                  :type="scope.row.type === 1 ? 'success' : 'danger'"
                  @click="editType(scope.row)"
                >{{ scope.row.type === 1 ? "正常" : "异常" }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="detail" align="center" label="备注"></el-table-column>
          </el-table>
        </div>
        <el-pagination style="margin-top:10px;" background layout="prev, pager, next" :total="2"></el-pagination>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import mixin from "@/config/minxins";
const ActionHeader = () => import("@/components/ActionHeader.vue");
@Component({
  mixins: [mixin],
  components: {
    ActionHeader
  }
})
export default class FocusPeople extends Vue {
  private list_data: Array<Object> = [
    {
      name: "张三",
      vistor_type: "111",
      card_number: "1-3-5",
      age: 20,
      type: 1,
      detail: "2019/10/1"
    }
  ];
  options: Array<Object> = [
    {
      label: '分类1',
      id: 1
    },
    {
      label: '分类2',
      id: 2
    }
  ]
  statusType:number = 1
  handleClick() {}
}
</script>

<style lang="scss" scoped>
.leftContent {
  flex: none;
  width: 200px;
}
.rightContent {
  flex: 1;
  box-shadow: 0px 6px 5px 0px lightgray;
}
</style>

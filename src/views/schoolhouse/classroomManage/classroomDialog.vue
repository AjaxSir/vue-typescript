<template>
  <div>
    <el-dialog
      class="dialog-rewrite"
      width="750px"
      :title="dialogData.name"
      :visible.sync="formShow"
      :close-on-click-modal="false"
      :before-close="formClose"
    >
      <div slot="title" class="dialog-title">教室{{dialogData.name}}:</div>
      <div>
        <el-tabs type="border-card" @tab-click="getData">
          <el-tab-pane label="详细信息">
            <div class="border-card">
              <p class="target-detail">当前状态： {{dialogData.type}}</p>
              <p class="target-detail">开放时段： {{dialogData.createDate}}</p>
              <p class="target-detail">当前人数： {{dialogData.carNum}}</p>
              <p class="target-detail">累计人数： {{dialogData.carNum}}</p>
              <p class="target-detail">备注： {{dialogData.carNum}}</p>
            </div>
          </el-tab-pane>
          <el-tab-pane label="通行记录">
            <div class="border-card">
              <el-table stripe border :data="gridData">
                <el-table-column property="name" label="姓名"></el-table-column>
                <el-table-column property="gender" label="性别" width="50px"></el-table-column>
                <el-table-column property="num" label="学号" width="50px"></el-table-column>
                <el-table-column property="address" label="所属学院"></el-table-column>
                <el-table-column property="pass" label="通行时间" width="130px"></el-table-column>
                <el-table-column property="gonum" sortable label="进出次数" width="100px"></el-table-column>
                <el-table-column property="dateTotal" sortable label="总时长" width="100px"></el-table-column>
                <el-table-column property="averagedate" sortable label="平均时长" width="100px"></el-table-column>
              </el-table>
              <div class="statistics-pagination">
                <el-pagination layout="prev, pager, next" :total="1000"></el-pagination>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from "vue-property-decorator";
@Component
export default class ClassroomDialog extends Vue {
  @Prop({ default: false }) public formShow: any;
  @Prop() public dialogData: any;

  private gridData: Array<Object> = [
    {
      name: "王2",
      gender: "男",
      num: "001",
      address: "学院2",
      gonum: 22,
      dateTotal: 9,
      averagedate: 5,
      pass: "2019-09-11 18:42"
    },
    {
      name: "li4",
      gender: "男",
      num: "001",
      address: "学院2",
      gonum: 22,
      dateTotal: 9,
      averagedate: 5,
      pass: "2019-09-11 18:42"
    },
    {
      name: "zhang3",
      gender: "男",
      num: "001",
      address: "学院2",
      gonum: 22,
      dateTotal: 9,
      averagedate: 5,
      pass: "2019-09-11 18:42"
    },
    {
      name: "王小小",
      gender: "男",
      num: "001",
      address: "学院3",
      gonum: 22,
      dateTotal: 9,
      averagedate: 5,
      pass: "2019-09-11 18:42"
    }
  ];

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

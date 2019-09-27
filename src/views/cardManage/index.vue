<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <action-header :total="1" />
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="4">
        <data-tree />
      </el-col>
      <el-col :span="20">
        <div class="rightContent">
          <el-table :data="cardList" stripe class="demo-block">
            <el-table-column type="selection" width="50">
              <template slot-scope="scope">
                <i class="iconfont icon-_shezhi-xian"></i>
              </template>
            </el-table-column>

            <el-table-column type="index" label="序号" width="50"></el-table-column>

            <el-table-column prop="name" label="编号"></el-table-column>

            <el-table-column prop="houseRelative" label="关联房屋"></el-table-column>

            <el-table-column prop="createDate" label="创建"></el-table-column>

            <el-table-column prop="createDate" label="最近刷卡时间"></el-table-column>
            <el-table-column prop="type" label="状态">
              <template slot-scope="scope">
                <el-tag
                  size="small"
                  style="border-radius: 50px;padding: 0 10px; cursor: pointer;"
                  :type="scope.row.type === 1 ? 'success' : 'danger'"
                  @click="editType(scope.row)"
                >{{ scope.row.type === 1 ? "正常" : "异常" }}</el-tag>
              </template>
            </el-table-column>

            <el-table-column prop="createDate" label="日平均刷卡次数"></el-table-column>

            <el-table-column prop="createDate" label="周平均刷卡次数"></el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>

    <!-- <el-dialog title="收货地址" :visible.sync="dialogFormVisible" width="40%">
      <el-form :model="form">
        <el-form-item label="活动名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动区域" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false"
          >确 定</el-button
        >
      </div>
    </el-dialog>-->
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
export default class CardManage extends Vue {
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

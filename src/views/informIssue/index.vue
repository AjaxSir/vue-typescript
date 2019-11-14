<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <action-header :dialogCreate.sync="dialogCreate" :total="1">
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>导出</el-dropdown-item>
          </el-dropdown-menu>
          <div slot="houseNum">
            <div class="word-filter">
              <span class="filter-name">发布对象:</span>
              <el-input class="input-filter" size="small"></el-input>
            </div>
          </div>
        </action-header>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="24" class="table-col">
        <div class="rightContent">
          <el-table
            :data="cardList"
            stripe
            class="demo-block"
            highlight-current-row
            @cell-mouse-enter="enterRowChange"
            @cell-mouse-leave="leaveRowChange"
          >
            <el-table-column type="selection" width="50"></el-table-column>

            <el-table-column type="index" label="序号" width="50"></el-table-column>

            <el-table-column prop="name" label="标题" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
                <!-- <el-button style="padding:0px;" type="text" @click="queryIdetity">{{scope.row.name}}</el-button> -->
                <div class="fun-btn">
                  <el-dropdown trigger="click" placement="bottom-start">
                    <i v-show="scope.row.showMenu" class="iconfont icon-menu"></i>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>修改</el-dropdown-item>
                      <el-dropdown-item>删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="xb" align="center" label="发布内容"></el-table-column>

            <!-- <el-table-column prop="xq" label="发布对象" align="center"></el-table-column> -->

            <el-table-column prop="xq" label="创建时间" align="center"></el-table-column>

            <el-table-column prop="tjsj" label="发布时间" align="center"></el-table-column>

            <!-- <el-table-column prop="zp" label="到达情况" align="center"></el-table-column> -->

            <el-table-column prop="type" align="center" label="状态">
              <template slot-scope="scope">
                <el-tag
                  size="small"
                  style="border-radius: 50px;padding: 0 10px; cursor: pointer;"
                  :type="scope.row.type === 1 ? 'success' : 'danger'"
                >{{ scope.row.type === 1 ? "成功" : "失败" }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-pagination style="margin-top:10px;" background layout="prev, pager, next" :total="2"></el-pagination>
      </el-col>
    </el-row>
    <!-- 通知发布 -->
    <el-dialog
      class="image-dialod"
      title="发布通知"
      :visible.sync="dialogCreate"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <el-form
        ref="dataForm"
        :model="meetingData"
        label-position="right"
        label-width="100px"
        style="width: 300px; margin-left:70px;"
      >
        <el-form-item class="phone-input" label="标题: " prop="title">
          <el-input style="width:310px" v-model="meetingData.title"></el-input>
        </el-form-item>

        <el-form-item class="phone-input" label="发送对象: " prop="limitHouse">
          <el-select
            style="width:310px;"
            v-model="meetingData.limitHouse"
            multiple
            placeholder="请选择发布对象"
          >
            <el-option
              v-for="item in meetingLoc"
              :key="item.id"
              :label="item.name + '-' + item.unit"
              :value="item.id"
            ></el-option>
            <div class="handle-btn">
              <el-button type="primary" size="mini" plain @click="allChoose">全选</el-button>
              <el-button type="warning" size="mini" plain @click="meetingData.limitHouse=[]">重选</el-button>
            </div>
          </el-select>
        </el-form-item>

        <el-form-item class="phone-input" style="width:410px" label="内容: " prop="content">
          <el-input type="textarea" :rows="9" placeholder="请输入通知内容" v-model="meetingData.content"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="info" @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleClose">发布</el-button>
      </div>
    </el-dialog>
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
export default class InformIssue extends Vue {
  private cardList: Array<Object> = [
    {
      name: "XXXXX",
      zb: "男",
      xb: "--",
      zp: "--",
      xq: "张三",
      tjsj: "2019/8/21",
      type: 1
    }
  ];
  private rowSpan: any = {
    row1: 4,
    row2: 20
  };

  private dialogLibrary: any = false;

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
  private dialogCreate: Boolean = false; // 新增或修改弹出表单
  private roleTitle: String = "0";
  private meetingData: Object = {
    limitHouse: [],
    content: "",
    title: ""
  };

  private meetingLoc: Array<Object> = [
    {
      id: "0",
      name: "北门",
      unit: "1-1-102"
    },
    {
      id: "1",
      name: "北门",
      unit: "1-1-102"
    },
    {
      id: "2",
      name: "北门",
      unit: "1-1-102"
    }
  ];

  editType(item) {
    /**@description 修改状态 */
    console.log(item);
    // this.dialogFormVisible = true;
  }

  enterRowChange(row, column, cell, event) {
    /**@description hover enter tab 行 */
    row.showMenu = true;
  }

  leaveRowChange(row) {
    /**@description hover leave tab 行 */
    row.showMenu = false;
  }
  queryIdetity() {
    this.dialogLibrary = true;
  }
  handleClose() {
    this.dialogCreate = false;
  }
  allChoose() {
    /**@description 全选 */
    this.meetingData['limitHouse'] = [];
    this.meetingLoc.map(item => {
      this.meetingData['limitHouse'].push(item['id']);
    });
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
td {
  padding: 6px 0px;
}
.demo-block {
  border: 1px solid #ebebeb;
  border-radius: 3px;
}

.serial-num {
  position: relative;
}

.fun-btn {
  position: absolute;
  left: -64px;
  top: 12px;
  .iconfont {
    font-size: 19px;
    color: #8091a5;
    cursor: pointer;
  }
}
.table-col {
  position: relative;
}
.close-menu {
  width: 10px;
  height: 48px;
  background: #acb7c1;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  position: relative;
}

// .icon-class {
//   font-size: 12px;
//   color: #e7eaeb;
//   cursor: pointer;
//   line-height: 48px;
//   position: absolute;
//   left: -1px;
// }

.capture-img {
  width: 60px;
}
.handle-btn {
  width: 100%;
  text-align: right;
  padding-right: 20px;
  margin: 10px 0;
}
</style>

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

            <el-table-column prop="name" class="serial-num" label="账号名" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
                <div class="fun-btn">
                  <el-dropdown trigger="click" placement="bottom-start" @command="commandClick">
                    <i v-show="scope.row.showMenu" class="iconfont icon-menu"></i>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="update">重置密码</el-dropdown-item>
                      <el-dropdown-item command="delete">删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="xb" align="center" label="角色"></el-table-column>

            <el-table-column prop="xq" label="备注" align="center"></el-table-column>

            <el-table-column prop="tjsj" label="操作" align="center"></el-table-column>
          </el-table>
        </div>
        <el-pagination style="margin-top:10px;" background layout="prev, pager, next" :total="2"></el-pagination>
      </el-col>
    </el-row>
    <!-- 新增或修改 -->
    <el-dialog
      :title="roleTitle==='0' ? '新增' :'重置密码'"
      :visible.sync="dialogCreate"
      width="40%"
      :before-close="handleClose"
    >
      <el-form ref="form" :model="roleForm" label-width="80px">
        <el-form-item v-if="roleTitle==='0'" label="账号名">
          <el-input v-model="roleForm.name"></el-input>
        </el-form-item>
        <el-form-item v-if="roleTitle==='0'" label="角色">
          <el-select v-model="roleForm.region" placeholder="请选择角色">
            <el-option label="管理员" value="guanliyuan"></el-option>
            <el-option label="普通用户" value="putong"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="roleTitle==='0'" label="备注">
          <el-input type="textarea" v-model="roleForm.desc"></el-input>
        </el-form-item>
        <el-form-item v-if="roleTitle==='1'" label="新密码">
          <el-input v-model="roleForm.newPassword"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleClose">确 定</el-button>
      </span>
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
      xb: "管理员",
      zp: "--",
      xq: "--",
      tjsj: "--",
      type: 1,
      showMenu: false
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
  private roleForm: Object = {
    name: null,
    region: null,
    desc: null,
    newPassword: null
  };

  editType(item) {
    /**@description 修改状态 */
    console.log(item);
    // this.dialogFormVisible = true;
  }

  queryIdetity() {
    this.dialogLibrary = true;
  }
  commandClick(val) {
    if (val === "update") {
      this.roleTitle = "1";
      this.dialogCreate = true;
    } else {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }

  handleClose() {
    this.roleTitle = "0";
    this.dialogCreate = false;
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
  top: 6px;
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
</style>

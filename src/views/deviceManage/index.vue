<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <action-header :dialogCreate.sync="dialogCreate" :total="1">
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>导入</el-dropdown-item>
            <el-dropdown-item>导出</el-dropdown-item>
          </el-dropdown-menu>
          <div slot="houseNum">
            <span class="word-filter">
              <span class="filter-name">状态:</span>
              <el-select v-model="deviceStatus" placeholder="请选择" class="input-filter" size="small">
                <el-option label="全部" value="all"></el-option>
                <el-option label="离线" value="offline"></el-option>
                <el-option label="在线" value="online"></el-option>
              </el-select>
            </span>
            <span class="word-filter">
              <span class="filter-name">位置:</span>
              <el-input class="input-filter" size="small"></el-input>
            </span>
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
            <el-table-column align="center" type="selection" width="50"></el-table-column>

            <el-table-column align="center" type="index" label="序号" width="50"></el-table-column>

            <el-table-column align="center" prop="name" label="设备编号" width="90">
              <template slot-scope="scope">
                <el-button @click="showDetails(scope.row)" type="text">{{scope.row.name}}</el-button>
                <div class="fun-btn">
                  <el-dropdown trigger="click" placement="bottom-start" @command="commandClick">
                    <i v-show="scope.row.showMenu" class="iconfont icon-menu"></i>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="update">修改</el-dropdown-item>
                      <el-dropdown-item command="delete">删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </template>
            </el-table-column>

            <el-table-column align="center" prop="houseRelative" label="单元信息"></el-table-column>

            <el-table-column align="center" prop="carNum" label="设备型号"></el-table-column>

            <el-table-column align="center" prop="createDate" label="上线时间" width="160"></el-table-column>

            <el-table-column align="center" prop="num" label="故障次数"></el-table-column>

            <el-table-column align="center" prop="type" label="状态">
              <template slot-scope="scope">
                <el-tag
                  size="small"
                  style="border-radius: 50px;padding: 0 10px; cursor: pointer;"
                  :type="scope.row.type === 1 ? 'success' : 'danger'"
                  @click="editType(scope.row)"
                >{{ scope.row.type === 1 ? "连线中" : "离线中" }}</el-tag>
              </template>
            </el-table-column>

            <el-table-column align="center" prop="createDate" label="创建时间" width="220"></el-table-column>
          </el-table>
        </div>
        <el-pagination style="margin-top:10px;" background layout="prev, pager, next" :total="2"></el-pagination>
      </el-col>
    </el-row>
    <el-dialog
      class="dialog-rewrite"
      :title="detailDialogForm.name"
      :visible.sync="detailDialogVisible"
    >
      <el-tabs type="card" v-model="activeName">
        <el-tab-pane label="详细信息" name="first">
          <el-form label-width="100px" :model="detailDialogForm">
            <el-form-item label="所属单元信息:">
              <span>{{detailDialogForm.houseRelative}}</span>
            </el-form-item>
            <el-form-item label="状态:">
              <span>{{detailDialogForm.type === 1 ? "连线中" : "离线中"}}</span>
            </el-form-item>
            <el-form-item label="门禁类型:">
              <span>{{detailDialogForm.carNum}}</span>
            </el-form-item>
            <el-form-item label="上线时间:">
              <span>{{detailDialogForm.createDate}}</span>
            </el-form-item>
            <el-form-item label="创建时间:">
              <span>{{detailDialogForm.createDate}}</span>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="门禁记录" name="second">
          <el-table :data="doorRecordTable" style="width: 100%">
            <el-table-column align="center" prop="name" label="姓名" width="150px"></el-table-column>
            <el-table-column align="center" prop="date" label="通行时间" width="150px"></el-table-column>
            <el-table-column align="center" prop="address" label="通行地址"></el-table-column>
            <el-table-column align="center" prop="address" label="抓拍图片"></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="detailDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新增或修改弹出表单 -->
    <el-dialog
      :title="roleTitle==='0' ? '新增' : '修改'"
      :visible.sync="dialogCreate"
      width="640px"
      :before-close="handleClose"
    >
      <el-form
        ref="dataForm"
        :model="deciceForm"
        label-position="right"
        label-width="100px"
        style="width: 300px; margin-left:70px;"
      >
        <el-form-item class="phone-input" label="设备名称: " prop="title">
          <el-input style="width:310px" v-model="deciceForm.title"></el-input>
        </el-form-item>

        <el-form-item class="phone-input" label="设备地址: " prop="limitHouse">
          <el-select
            style="width:310px;"
            v-model="deciceForm.limitHouse"
            multiple
            placeholder="请选择发布对象"
          >
            <el-option
              v-for="item in meetingLoc"
              :key="item.id"
              :label="item.name + '-' + item.unit"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="phone-input" label="绑定设备: " prop="title">
          <el-input style="width:310px" v-model="deciceForm.title"></el-input>
        </el-form-item>
        <el-form-item class="phone-input" label="效验码: " prop="verification">
          <el-input v-model="deciceForm.verification" placeholder="请输入效验码"></el-input>
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

@Component({
  mixins: [mixin],
  components: {
    ActionHeader
  }
})
export default class CardManage extends Vue {
  private cardList: Array<Object> = [
    {
      name: "123",
      houseRelative: "东区-1栋-1-1",
      carNum: "XX门禁",
      createDate: "2019-10-10 12:12:12",
      type: 1,
      showMenu: false,
      num: 0
    },
    {
      name: "123",
      houseRelative: "东区-1栋-1-1",
      carNum: "XX门禁",
      createDate: "2019-10-10 12:12:12",
      type: 2,
      showMenu: false,
      num: 0
    },
    {
      name: "123",
      houseRelative: "东区-1栋-1-1",
      carNum: "XX门禁",
      createDate: "2019-10-10 12:12:12",
      type: 1,
      showMenu: false,
      num: 0
    }
  ];
  deviceStatus: String = "all";
  activeName: string = "first";
  detailDialogVisible: boolean = false; // 设备详情dialog弹框状态
  private formLabelWidth: String = "120px";
  detailDialogForm: Object = {};
  doorRecordTable: Array<Object> = []; // 设备抓拍的通行记录
  private dialogCreate: Boolean = false; // 新增或修改弹出表单
  private roleTitle: String = "0";
  private deciceForm: Object = {
    name: null,
    region: null,
    desc: null,
    verification: null
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

  /**
   * 查看设备详情
   */
  showDetails(row) {
    this.detailDialogVisible = true;
    this.detailDialogForm = Object.assign({}, row);
  }

  editType(item) {
    /**@description 修改状态 */
    console.log(item);
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

.menu-control {
  position: absolute;
  top: 32vh;
  left: -5px;
}

.menu-visible {
  position: absolute;
  top: 32vh;
  left: -15px;
}

.close-menu {
  width: 10px;
  height: 48px;
  background: #acb7c1;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  position: relative;
}

.icon-class {
  font-size: 12px;
  color: #e7eaeb;
  cursor: pointer;
  line-height: 48px;
  position: absolute;
  left: -1px;
}

.capture-img {
  width: 60px;
}
</style>

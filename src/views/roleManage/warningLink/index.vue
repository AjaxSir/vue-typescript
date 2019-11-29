<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <action-header
          :filterStatus="false"
          :btnStatus="1"
          :moreStatus="false"
          :initFormHeader="initForm"
          @fetchData="fetchData"
          :filterForm="filterForm"
          :dialogCreate.sync="dialogCreate"
          :total="page.total"
        ></action-header>
      </el-col>
    </el-row>
    <el-table
      v-loading="showLoading"
      :data="list_data"
      stripe
      class="demo-block"
      highlight-current-row
      @cell-mouse-enter="enterRowChange"
      @cell-mouse-leave="leaveRowChange"
      @cell-click="cellClick"
    >
      <el-table-column type="selection" width="50"></el-table-column>

      <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
      <el-table-column prop="name" align="center" label="姓名">
        <template slot-scope="scope">
          <span class="serial-num">{{scope.row.name}}</span>
          <div class="fun-btn">
            <el-dropdown trigger="click" placement="bottom-start" @command="commandClick">
              <i v-show="scope.row.showMenu" class="iconfont icon-menu"></i>
              <el-dropdown-menu slot="dropdown">
                <div @click="editType(scope.row)">
                  <el-dropdown-item command="update">修改</el-dropdown-item>
                </div>
                <div @click="deleteBtn(scope.row)">
                  <el-dropdown-item command="dele">删除</el-dropdown-item>
                </div>
                <el-dropdown-item :command="returnCommand('delete', scope.row)">批量删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="phone" align="center" label="电话"></el-table-column>
      <el-table-column prop="email" align="center" label="邮箱"></el-table-column>
      <el-table-column prop="groupName" align="center" label="分组"></el-table-column>
    </el-table>

    <el-pagination
      @current-change="pageChange"
      style="margin-top:10px;"
      background
      layout="prev, pager, next,total"
      :page-size="page.limit"
      :total="page.total"
    ></el-pagination>

    <el-dialog
      title="新增"
      :visible.sync="dialogCreate"
      width="500px"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dataForm"
        :model="createForm"
        :rules="rules"
        label-position="right"
        label-width="80px"
        style="margin-right:40px;"
      >
        <el-form-item
          label="名字:"
          prop="name"
          :show-message="showMessage"
          :error="errorMessage.name"
        >
          <el-input v-model="createForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="电话:"
          prop="phone"
          :show-message="showMessage"
          :error="errorMessage.phone"
        >
          <el-input v-model="createForm.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="邮箱:"
          prop="email"
          :show-message="showMessage"
          :error="errorMessage.email"
        >
          <el-input v-model="createForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="分组:"
          prop="earlyGroupId"
          :show-message="showMessage"
          :error="errorMessage.earlyGroupId"
        >
          <!-- <el-input v-model="createForm.earlyGroupId" autocomplete="off"></el-input> -->
          <el-select v-model="createForm.earlyGroupId" placeholder="请选择">
            <el-option
              v-for="item in earlyGroup"
              :key="item.id"
              :label="item.groupName"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-tag
            :key="tag"
            v-for="tag in dynamicTags"
            closable
            :disable-transitions="false"
            @close="closeTag(tag)"
          >{{tag}}</el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          ></el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input v-model="createForm.note" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCreate = false">取 消</el-button>
        <el-button type="primary" @click="createwarning">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import mixin from "@/config/minxins";
import { deleteWarning, getGroup } from "@/api/systemApi.ts";
const ActionHeader = () => import("@/components/ActionHeader.vue");

@Component({
  mixins: [mixin],
  components: {
    ActionHeader
  }
})
export default class WarningLink extends Vue {
  filterForm: object = {}; //根据关键字查询

  initForm: object = {
    //获取车辆列表url
    url: "/admin/usr-early-contact",
    method: "get"
  };

  deleteForm: Object = {
    //单个或批量删除
    url: "/admin/usr-car/batch-delete/",
    method: "delete",
    data: []
  };

  dialogCreate: boolean = false;
  private earlyGroup: Array<Object> = []; //获取分组
  private createForm: Object = {
    //新增表单字段
    earlyGroupId: "", //分组id
    email: "", //邮箱
    name: "", //姓名
    note: "", //备注
    phone: "" //电话
  };

  private rules: Object = {
    // 表单验证
    phone: [
      { required: true, message: "请输入预警联系人电话", trigger: "blur" }
    ],
    name: [
      { required: true, message: "请输入预警联系人姓名", trigger: "blur" }
    ],
    email: [
      { required: true, message: "请输入预警联系人邮箱", trigger: "blur" }
    ],
    earlyGroupId: [
      { required: true, message: "请选择预警联系人分组", trigger: "blur" }
    ]
  };
  private showMessage: Boolean = true; //是否显示表单错误信息
  private errorMessage: Object = {
    // 表单错误信息
    phone: "",
    name: "",
    email: "",
    earlyGroupId: ""
  };

  created() {
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    ); // 合并参数
    this.getGroupList();
  }

  // 获取需要操作的数据列表
  handleSelectionChange(val) {
    this.deleteForm["data"] = [];
    val.forEach(ele => {
      this.deleteForm["data"].push(ele.id);
    });
  }

  cellClick(row, column, event, cell) {
    row.carNote = true;
  }

  async getGroupList() {
    /**@description 获取分组信息 */
    const { data } = await getGroup();
    this.createForm["earlyGroupId"] = data.data[0].id;
    this.earlyGroup = data.data;
  }

  createwarning() {
    /**@description 新增预警联系人 */
    console.log(this.createForm);
    this.$refs["dataForm"]["validate"](valid => {
      if (valid) {
        var form = [
          {
            ...this.createForm
            // scenceUserId: this.restaurants[0]["scenceUserId"]
          }
        ];
        // addCar(form).then(res => {
        //   this.handleClose();
        //   this["fetchData"](this.initForm);
        //   this.nameDisabled = false;
        //   this["notify"]("添加车辆名单成功");
        // });

        // .catch(err => {
        //   const { data } = err.response;
        //   console.log(err.response);
        //     this.errorMessage = data[k][0];
        // });
      }
    });
  }

  editType(item) {
    /**@description 修改状态 */
    // for (const key in this.editForm) {
    //   this.editForm[key] = item[key];
    // }
    // this.dialogEdit = true;
  }

  closeTag(tag) {
    // this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
  }

  showInput() {
    this.inputVisible = true;
    this.$nextTick(_ => {
      this.$refs.saveTagInput.$refs.input.focus();
    });
  }

  handleInputConfirm() {
    let inputValue = this.inputValue;
    if (inputValue) {
      this.dynamicTags.push(inputValue);
    }
    this.inputVisible = false;
    this.inputValue = "";
  }

  handleClose() {
    /** @description 关闭新增/修改dialog */
    this.dialogCreate = false; //车辆新增dialog
    // this.dialogEdit = false; //修改dialog
    this.$refs["dataForm"]["resetFields"]();
  }

  deleteBtn(item) {
    /**@description 修改状态 */
    this.$confirm("此操作将永久删除此预警联系人信息, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        deleteWarning(item.id).then(() => {
          this["notify"]("删除预警联系人成功");
          this["fetchData"](this.initForm);
        });
      })
      .catch(err => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
  }
}
</script>

<style lang="scss" scoped>
.fun-btn {
  position: absolute;
  left: -64px;
  top: 26%;
  .iconfont {
    font-size: 19px;
    color: #8091a5;
    cursor: pointer;
  }
}
.table-col {
  position: relative;
}
</style>

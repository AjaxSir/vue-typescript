<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <action-header
          :filterStatus="false"
          :btnStatus="1"
          :pageStatus="false"
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
      height="65vh"
      v-loading="showLoading"
      :data="list_data"
      stripe
      highlight-current-row
      @cell-mouse-enter="enterRowChange"
      @cell-mouse-leave="leaveRowChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" disabled="true"></el-table-column>

      <el-table-column type="index" align="center" label="序号" class="indexNum" width="50">
        <template slot-scope="scope">
          <span>{{scope.$index+1}}</span>
          <div class="fun-btn">
            <el-dropdown trigger="click" placement="bottom-start" @command="commandClick">
              <el-tooltip class="item" effect="dark" content="点击操作" placement="top">
                <i v-show="scope.row.showMenu" class="iconfont icon-menu"></i>
              </el-tooltip>
              <el-dropdown-menu slot="dropdown">
                <div @click="editTarget(scope.row)">
                  <el-dropdown-item command="update">修改</el-dropdown-item>
                </div>
                <el-dropdown-item
                  :command="returnCommand('delete', scope.row)"
                >{{ deleteForm.data.length ? '批量删除' : '删除' }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="name" align="center" label="车位类型" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <p
            class="rowUpdate"
            v-show="!row.nameStatus || editForm.id !== row.id"
            @click="editName(row)"
          >{{ row.name ? row.name :'--'}}</p>
          <el-input
            :ref="row.id"
            v-show="row.nameStatus&&editForm.id === row.id"
            size="small"
            clearable
            :maxlength="200"
            v-model="editForm.name"
            placeholder="输入车位类型"
            @keyup.enter.native="nameBlur(row,'2')"
            @input="constraintLength(editForm.name,'10')"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="maxCar" align="center" label="最大同时停车数量" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <p
            class="rowUpdate"
            v-show="!row.maxCarStatus || editForm.id !== row.id"
            @click="editMaxCar(row)"
          >{{ row.maxCar ? row.maxCar :'--'}}</p>
          <el-input
            :ref="row.id"
            v-show="row.maxCarStatus&&editForm.id === row.id"
            size="small"
            clearable
            :maxlength="200"
            v-model="editForm.maxCar"
            placeholder="输入最大同时停车数量"
            @keydown.native="carNumber"
            @keyup.enter.native="maxCarBlur(row)"
            @input="constraintLength(editForm.maxCar,'10')"
          ></el-input>
        </template>
      </el-table-column>

      <!-- <el-table-column prop="note" align="center" label="备注" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <p
            class="rowUpdate"
            v-show="!row.noteStatus || editForm.id !== row.id"
            @click="editNote(row)"
          >{{ row.note ? row.note :'--'}}</p>
          <el-input
            :ref="row.id"
            v-show="row.noteStatus&&editForm.id === row.id"
            size="small"
            clearable
            :maxlength="200"
            v-model="editForm.note"
            placeholder="输入备注"
            @keyup.enter.native="noteBlur(row,'2')"
            @input="constraintLength(editForm.note,'200')"
          ></el-input>
        </template>
      </el-table-column>-->
    </el-table>

    <!-- <el-pagination
      @current-change="pageChange"
      style="margin-top:10px;"
      background
      layout="prev, pager, next,total"
      :page-size="page.limit"
      :total="page.total"
    ></el-pagination>-->
    <!-- 添加预警联系人 -->
    <el-dialog
      title="添加"
      :visible.sync="dialogCreate"
      width="500px"
      :before-close="createClose"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dataForm"
        :model="createForm"
        :rules="rules"
        label-position="right"
        label-width="100px"
        style="margin-right:40px;"
      >
        <el-form-item
          label="车位类型:"
          prop="name"
          :show-message="showMessage"
          :error="errorMessage.name"
        >
          <el-input
            v-model="createForm.name"
            autocomplete="off"
            placeholder="请输入车位类型"
            :maxlength="10"
            clearable
            @input="constraintLength(createForm.name,'10')"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="停车数量:"
          prop="maxCar"
          :show-message="showMessage"
          :error="errorMessage.maxCar"
        >
          <el-input
            v-model="createForm.maxCar"
            autocomplete="off"
            placeholder="请输入最大同时停车数量"
            :maxlength="10"
            clearable
            @keyup.native="carNumber"
            @keydown.native="carNumber"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item
          label="备注:"
          prop="note"
          :show-message="showMessage"
          :error="errorMessage.note"
        >
          <el-input
            v-model="createForm.note"
            :maxlength="200"
            placeholder="输入备注信息"
            clearable
            type="textarea"
            @input="constraintLength(createForm.note,'200')"
          ></el-input>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createClose">取 消</el-button>
        <el-button type="primary" @click="createwarning">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改预警联系人 -->
    <el-dialog
      title="修改"
      :visible.sync="dialogEdit"
      width="500px"
      :before-close="editClose"
      :close-on-click-modal="false"
    >
      <el-form
        ref="updateForm"
        :model="editForm"
        label-position="right"
        label-width="100px"
        style="margin-right:40px;"
      >
        <el-form-item
          label="车位类型:"
          prop="name"
          :show-message="showMessage"
          :error="errorMessage.name"
        >
          <el-input
            v-model="editForm.name"
            autocomplete="off"
            placeholder="请输入车位类型"
            :maxlength="10"
            clearable
            @input="constraintLength(editForm.name,'10')"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="停车数量:"
          prop="maxCar"
          :show-message="showMessage"
          :error="errorMessage.maxCar"
        >
          <el-input
            v-model="editForm.maxCar"
            autocomplete="off"
            placeholder="请输入最大同时停车数量"
            :maxlength="10"
            clearable
            @keyup.native="carNumber"
            @keydown.native="carNumber"
          ></el-input>
        </el-form-item>

        <!-- <el-form-item
          label="备注:"
          prop="note"
          :show-message="showMessage"
          :error="errorMessage.note"
        >
          <el-input
            v-model="editForm.note"
            :maxlength="200"
            placeholder="输入备注信息"
            clearable
            type="textarea"
            @input="constraintLength(editForm.note,'200')"
          ></el-input>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editClose">取 消</el-button>
        <el-button type="primary" @click="updatewarning">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import mixin from "@/config/minxins";
import {
  addArgumentsStall, //添加系统参数配置车位类型
  editArgumentsStall //修改系统参数配置车位类型
} from "@/api/systemApi.ts";
const ActionHeader = () => import("@/components/ActionHeader.vue");

@Component({
  mixins: [mixin],
  components: {
    ActionHeader
  }
})
export default class WarningLink extends Vue {
  filterForm: object = { tag: "pagination" }; //根据关键字查询

  initForm: object = {
    //获取车辆列表url
    url: "/admin/car-space-type",
    method: "get"
  };

  deleteForm: Object = {
    //单个或批量删除
    url: "/admin/car-space-type/batch-delete",
    method: "delete",
    data: []
  };

  dialogCreate: boolean = false;

  private createForm: Object = {
    //添加表单字段
    name: "", //姓名
    maxCar: null //最大停车数量
    // note: "" //备注
  };

  private dialogEdit: Boolean = false; // 修改弹出表单
  private editForm: Object = {
    //修改表单字段
    name: "", //姓名
    maxCar: null, //最大停车数量
    id: "" //目标联系人id
    // note: "", //备注
  };
  updateArray: Array<string> = ["noteStatus", "nameStatus", "maxCarStatus"];
  private nameRewrite: String = ""; //保存未改变的name
  private maxCarRewrite: String = ""; //保存未改变的 maxCar

  private rules: Object = {
    // 表单验证
    name: [{ required: true, message: "请输入车位类型", trigger: "blur" }],
    maxCar: [
      { required: true, message: "请输入最大同时停车数量", trigger: "blur" }
    ]
  };
  private showMessage: Boolean = true; //是否显示表单错误信息
  private errorMessage: Object = {
    // 表单错误信息
    name: "",
    maxCar: ""
  };

  created() {
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    ); // 合并参数
  }

  createwarning() {
    /**@description 添加*/
    this.$refs["dataForm"]["validate"](valid => {
      if (valid) {
        var form = {
          ...this.createForm
        };
        addArgumentsStall(form).then(res => {
          this.createClose();
          this["fetchData"](this.initForm);
          this["notify"]("success", "成功", "添加车位类型成功");
        });
      }
    });
  }

  editName(row) {
    /**@description 点击备注*/
    this.nameRewrite = row.name;
    this.editForm["name"] = row.name;
    this.editForm["id"] = row.id;
    row.nameStatus = !row.nameStatus;
    this.$nextTick(() => {
      const input = this.$refs[row.id] as HTMLElement;
      input.focus();
    });
  }

  // 修改备注离开输入框
  nameBlur(row) {
    row.noteStatus = false;
    if (this.nameRewrite !== this.editForm["name"]) {
      this.confirmUpdateName(row);
    }
  }

  confirmUpdateName(item) {
    /**@description 修改备注 */
    const form = { name: this.editForm["name"], id: item.id };
    if (form["name"] === "") {
      delete form["name"];
    }
    editArgumentsStall(form).then(() => {
      this["notify"]("success", "成功", "修改车位类型成功");
      this["fetchData"](this.initForm);
    });
  }

  editMaxCar(row) {
    /**@description 点击备注*/
    this.maxCarRewrite = row.maxCar;
    this.editForm["maxCar"] = row.maxCar;
    this.editForm["id"] = row.id;
    row.maxCarStatus = !row.maxCarStatus;
    this.$nextTick(() => {
      const input = this.$refs[row.id] as HTMLElement;
      input.focus();
    });
  }

  // 修改备注离开输入框
  // maxCar(row) {
  //   var v = row.maxCar;
  //   if (v !== "" && !this["regPos"].test(v)) {
  //     this["message"]("最大同时停车数量必须是数值");
  //   }
  //   // row.name = v.replace(this["upNum"], "");
  // }

  maxCarBlur(row) {
    row.maxCarStatus = false;
    if (this.maxCarRewrite !== this.editForm["maxCar"]) {
      this.confirmUpdateMaxCar(row);
    }
  }

  confirmUpdateMaxCar(item) {
    /**@description 修改备注 */
    const form = { maxCar: this.editForm["maxCar"], id: item.id };
    if (form["maxCar"] === "") {
      delete form["maxCar"];
    }
    editArgumentsStall(form).then(() => {
      this["notify"]("success", "成功", "修改最大同时停车数量成功");
      this["fetchData"](this.initForm);
    });
  }

  editTarget(item) {
    /**@description 修改操作 */
    for (const key in this.editForm) {
      this.editForm[key] = item[key];
    }
    this.dialogEdit = true;
  }

  constraint(value, type) {
    if (value === "") {
      this.editForm[type] = null;
    }
  }

  updatewarning() {
    /**@description 修改 */
    for (const key in this.errorMessage) {
      this.errorMessage[key] = "";
    }
    const form = { ...this.editForm };
    for (const key in form) {
      if (form[key] === "") {
        delete form[key];
      }
    }
    this.$refs["updateForm"]["validate"](valid => {
      if (valid) {
        editArgumentsStall(form).then(() => {
          this.editClose();
          this["notify"]("success", "成功", "修改车位类型成功");
          this["fetchData"](this.initForm);
        });
      }
    });
  }

  createClose() {
    this.dialogCreate = false; //添加dialog
    for (const key in this.errorMessage) {
      this.errorMessage[key] = "";
    }
    this.$refs["dataForm"]["resetFields"]();
  }

  editClose() {
    /** @description 关闭添加/修改dialog */
    this.dialogEdit = false; //修改dialog
    for (const key in this.errorMessage) {
      this.errorMessage[key] = "";
    }
    this.$refs["updateForm"]["resetFields"]();
  }
}
</script>

<style lang="scss" scoped>
.input-new-tag {
  width: 120px;
}
</style>

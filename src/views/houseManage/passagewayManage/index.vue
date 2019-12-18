<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <action-header
          :moreStatus="false"
          :filterStatus="false"
          :pageStatus="false"
          :initFormHeader="initForm"
          @fetchData="fetchData"
          :filterForm="filterForm"
          :dialogCreate.sync="dialogCreate"
          :total="page.total"
        >
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>统计信息</el-dropdown-item>
          </el-dropdown-menu>
          <!-- <div slot="houseNum">
            <div class="word-filter">
              <span class="filter-name">发布对象:</span>
              <el-input class="input-filter" size="small"></el-input>
            </div>
          </div>-->
        </action-header>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="24">
        <div class="rightContent">
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
            <el-table-column type="selection" width="50"></el-table-column>

            <el-table-column type="index" align="center" label="序号" class="indexNum" width="50">
              <template slot-scope="scope">
                <span>{{scope.$index+1}}</span>
                <div class="fun-btn">
                  <el-dropdown trigger="click" placement="bottom-start" @command="commandClick">
                    <el-tooltip class="item" effect="dark" content="点击操作" placement="top">
                      <i v-show="scope.row.showMenu" class="iconfont icon-menu"></i>
                    </el-tooltip>
                    <el-dropdown-menu slot="dropdown">
                      <!-- <div @click="editFrom(scope.row)">
                        <el-dropdown-item :command="returnCommand('update', scope.row)">修改</el-dropdown-item>
                      </div>-->

                      <el-dropdown-item
                        :command="returnCommand('delete', scope.row)"
                      >{{ deleteForm.data.length ? '批量删除' : '删除' }}</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </template>
            </el-table-column>

            <el-table-column
              class="serial-num"
              prop="name"
              label="出入口名称"
              align="center"
              width="150px"
              :show-overflow-tooltip="true"
            ></el-table-column>

            <el-table-column prop="enterTimes" align="center" label="累计进入人数" width="130px"></el-table-column>

            <el-table-column prop="exitTimes" label="累计出人数" align="center" width="130px"></el-table-column>

            <el-table-column prop="note" align="center" label="备注" :show-overflow-tooltip="true">
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
                  :maxlength="200"
                  v-model="editForm.note"
                  placeholder="输入备注"
                  clearable
                  @keyup.enter.native="noteBlur(row,'2')"
                  @input="constraintLength(editForm.note,'200')"
                ></el-input>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <!-- 新增出入口 -->
    <el-dialog
      title="添加"
      :visible.sync="dialogCreate"
      width="500px"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form
        :model="createForm"
        :rules="rules"
        ref="dataForm"
        label-width="110px"
        style="margin-right:40px;"
      >
        <el-form-item
          label="出入口名称:"
          prop="name"
          :show-message="showMessage"
          :error="errorMessage.name"
        >
          <el-input
            v-model="createForm.name"
            placeholder="输入出入口名称"
            :maxlength="10"
            clearable
            @input="constraintLength(createForm.name,'10')"
            @keyup.enter.native="addPassageway"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="备注信息:"
          prop="note"
          :show-message="showMessage"
          :error="errorMessage.note"
        >
          <el-input
            type="textarea"
            :rows="9"
            v-model="createForm.note"
            :maxlength="200"
            placeholder="输入备注信息"
            clearable
            @input="constraintLength(createForm.note,'200')"
            @keyup.enter.native="addPassageway"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="addPassageway">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改出入口 -->
    <el-dialog
      title="修改"
      :visible.sync="dialogEdit"
      width="500px"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dataForm"
        :model="editForm"
        label-position="right"
        label-width="110px"
        style="margin-right:40px;"
      >
        <el-form-item
          label="出入口名称:"
          prop="name"
          :show-message="showMessage"
          :error="errorMessage.name"
        >
          <el-input
            v-model="editForm.name"
            :maxlength="10"
            placeholder="输入出入口名称"
            clearable
            @input="constraintLength(editForm.name,'10')"
            @keyup.enter.native="modifPassageway"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="备注信息:"
          prop="note"
          :show-message="showMessage"
          :error="errorMessage.note"
        >
          <el-input
            type="textarea"
            :rows="9"
            v-model="editForm.note"
            :maxlength="200"
            placeholder="输入备注信息"
            clearable
            @input="constraintLength(editForm.note,'200')"
            @keyup.enter.native="modifPassageway"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="modifPassageway">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import { creatPassageway, editPassageway } from "@/api/houseApi.ts";
import mixin from "@/config/minxins";

const ActionHeader = () => import("@/components/ActionHeader.vue");

@Component({
  mixins: [mixin],
  components: {
    ActionHeader
  }
})
export default class InformIssue extends Vue {
  filterForm: object = { tag: "pagination" }; //根据关键字查询
  private dialogCreate: Boolean = false; // 新增弹出表单
  // 新增dialog弹框信息
  private createForm: Object = {
    name: "",
    note: ""
  };

  private rules: Object = {
    //新增验证
    name: [{ required: true, message: "请输入出入口名称", trigger: "blur" }]
  };
  private showMessage: Boolean = true; //是否显示表单错误信息
  private errorMessage: Object = {
    // 表单错误信息
    name: "",
    note: ""
  };

  private dialogEdit: Boolean = false; // 修改弹出表单
  private editForm: Object = {
    // 修改dialog弹框信息
    name: "",
    note: "",
    id: ""
  };
  updateArray: Array<string> = ["noteStatus"];
  private noteRewrite: String = ""; //保存未改变的note

  initForm: object = {
    //获取车辆列表url
    url: "/admin/hs-enter-exit",
    method: "get"
  };

  deleteForm: Object = {
    //单个或批量删除
    url: "/admin/hs-enter-exit/batch-delete",
    method: "delete",
    data: []
  };

  created() {
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    ); // 合并参数
  }

  // 获取需要操作的数据列表
  handleSelectionChange(val) {
    this.deleteForm["data"] = [];
    val.forEach(ele => {
      this.deleteForm["data"].push(ele.id);
    });
  }

  addPassageway() {
    /**@description 新增出入口 */
    this.$refs["dataForm"]["validate"](valid => {
      if (valid) {
        var form = { ...this.createForm };
        creatPassageway(form).then(res => {
          this.handleClose();
          this["fetchData"](this.initForm);
          this["notify"]("success", "成功", "添加出入口成功");
        });
      }
    });
  }

  editFrom(item) {
    /**@description 修改状态 */
    for (const key in this.editForm) {
      this.editForm[key] = item[key];
    }
    this.dialogEdit = true;
  }

  modifPassageway() {
    console.log(123);
    const form = { ...this.editForm };
    for (let key in form) {
      if (form[key] === "") {
        delete form[key];
      }
    }
    editPassageway(form).then(() => {
      this.handleClose();
      this["fetchData"](this.initForm);
      this["notify"]("success", "成功", "修改出入口成功");
    });
  }

  editNote(row) {
    /**@description 点击备注*/
    this.noteRewrite = row.note;
    this.editForm["note"] = row.note;
    this.editForm["id"] = row.id;
    row.noteStatus = !row.noteStatus;
    this.$nextTick(() => {
      const input = this.$refs[row.id] as HTMLElement;
      input.focus();
    });
  }

  // 修改备注离开输入框
  noteBlur(row) {
    row.noteStatus = false;
    if (this.noteRewrite !== this.editForm["note"]) {
      this.confirmUpdateNote(row);
    }
  }

  confirmUpdateNote(item) {
    /**@description 修改备注 */
    const form = { note: this.editForm["note"], id: item.id };
    editPassageway(form).then(() => {
      this["notify"]("success", "成功", "修改出入口备注成功");
      this["fetchData"](this.initForm);
    });
  }

  handleClose() {
    /** @description 关闭新增/修改dialog */
    this.dialogCreate = false; //车辆新增dialog
    this.createForm = {
      name: "",
      note: ""
    };
    this.dialogEdit = false; //修改dialog
    this.$refs["dataForm"]["resetFields"]();
  }
}
</script>

<style lang="scss" scoped>
td {
  padding: 6px 0px;
}

.demo-block {
  border: 1px solid #ebebeb;
  border-radius: 3px;
}

.close-menu {
  width: 10px;
  height: 48px;
  background: #acb7c1;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  position: relative;
}

.capture-img {
  width: 60px;
}
</style>

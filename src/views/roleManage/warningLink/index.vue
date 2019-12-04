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
      height="65vh"
      v-loading="showLoading"
      :data="list_data"
      stripe
      class="demo-block"
      highlight-current-row
      @cell-mouse-enter="enterRowChange"
      @cell-mouse-leave="leaveRowChange"
    >
      <el-table-column type="selection" width="50" :selectable="isDisabled" disabled="true"></el-table-column>

      <el-table-column type="index" align="center" label="序号" class="indexNum" width="50">
        <template slot-scope="scope">
          <span>{{scope.$index+1}}</span>
          <div class="fun-btn">
            <el-dropdown trigger="click" placement="bottom-start" @command="commandClick">
              <i v-show="scope.row.showMenu" class="iconfont icon-menu"></i>
              <el-dropdown-menu slot="dropdown">
                <div @click="editTarget(scope.row)">
                  <el-dropdown-item command="update">修改</el-dropdown-item>
                </div>
                <div @click="deleteBtn(scope.row)">
                  <el-dropdown-item command="dele">删除</el-dropdown-item>
                </div>
                <!-- <el-dropdown-item
                  :command="returnCommand('delete', scope.row)"
                >{{ deleteForm.data.length ? '批量删除' : '删除' }}</el-dropdown-item>-->
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="name" align="center" label="姓名"></el-table-column>
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
    <!-- 新增预警联系人 -->
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
          label="姓名:"
          prop="name"
          :show-message="showMessage"
          :error="errorMessage.name"
        >
          <el-input
            v-model="createForm.name"
            autocomplete="off"
            placeholde="请输入预警联系人姓名"
            :maxlength="10"
            @input="constraintLength(createForm.name,'10')"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="电话:"
          prop="phone"
          :show-message="showMessage"
          :error="errorMessage.phone"
        >
          <el-input
            v-model="createForm.phone"
            autocomplete="off"
            placeholde="请输入电话"
            :maxlength="11"
            @input="constraintLength(createForm.phone,'11')"
          ></el-input>
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
              v-for="tag in earlyGroup"
              :key="tag.id"
              :label="tag.groupName"
              :value="tag.id"
            ></el-option>
          </el-select>
          <el-button @click="showUnitSetting = !showUnitSetting">添加分组</el-button>
          <div v-if="showUnitSetting">
            <el-tag
              style="margin-left:5px"
              :key="index"
              v-for="(tag, index) in earlyGroup"
              closable
              :disable-transitions="false"
              @close="deleteTag(tag, index)"
            >{{tag.groupName}}</el-tag>
            <el-input
              class="input-new-tag"
              v-if="newTag"
              v-model="newTagValue"
              ref="saveTagInput"
              size="small"
              :maxlength="10"
              placeholder="请输入新增分组名称"
              @input="constraintLength(newTagValue,'10')"
              @blur="handleInputConfirm"
            ></el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">新增分组</el-button>
          </div>
        </el-form-item>
        <el-form-item
          label="备注:"
          prop="note"
          :show-message="showMessage"
          :error="errorMessage.note"
        >
          <el-input
            v-model="createForm.note"
            :maxlength="200"
            placeholder="输入备注信息"
            @input="constraintLength(createForm.note,'200')"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="createwarning">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改预警联系人 -->
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
        label-width="80px"
        style="margin-right:40px;"
      >
        <el-form-item
          label="姓名:"
          prop="name"
          :show-message="showMessage"
          :error="errorMessage.name"
        >
          <el-input
            v-model="editForm.name"
            autocomplete="off"
            placeholde="请输入预警联系人姓名"
            :maxlength="10"
            @input="constraintLength(editForm.name,'10')"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="电话:"
          prop="phone"
          :show-message="showMessage"
          :error="errorMessage.phone"
        >
          <el-input
            v-model="editForm.phone"
            autocomplete="off"
            placeholde="请输入电话"
            :maxlength="11"
            @input="constraintLength(editForm.phone,'11')"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="邮箱:"
          prop="email"
          :show-message="showMessage"
          :error="errorMessage.email"
        >
          <el-input v-model="editForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="分组:"
          prop="earlyGroupId"
          :show-message="showMessage"
          :error="errorMessage.earlyGroupId"
        >
          <el-select v-model="editForm.earlyGroupId" placeholder="请选择">
            <el-option
              v-for="tag in earlyGroup"
              :key="tag.id"
              :label="tag.groupName"
              :value="tag.id"
            ></el-option>
          </el-select>
          <el-button @click="showUnitSetting = !showUnitSetting">添加分组</el-button>
          <div v-if="showUnitSetting">
            <el-tag
              style="margin-left:5px"
              :key="index"
              v-for="(tag, index) in earlyGroup"
              closable
              :disable-transitions="false"
              @close="deleteTag(tag, index)"
            >{{tag.groupName}}</el-tag>
            <el-input
              class="input-new-tag"
              v-if="newTag"
              v-model="newTagValue"
              ref="saveTagInput"
              size="small"
              :maxlength="10"
              placeholder="请输入新增分组名称"
              @input="constraintLength(newTagValue,'10')"
              @blur="handleInputConfirm"
            ></el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">新增分组</el-button>
          </div>
        </el-form-item>
        <el-form-item
          label="备注:"
          prop="note"
          :show-message="showMessage"
          :error="errorMessage.note"
        >
          <el-input
            v-model="editForm.note"
            :maxlength="200"
            placeholder="输入备注信息"
            @input="constraintLength(editForm.note,'200')"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
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
  addWarning, //新增预警联系人
  editWarning, //修改预警联系人
  deleteWarning, //删除预警联系人
  getGroup, //获取预警联系人分组
  addGroup, //新增预警联系人分组
  deleteGroup //删除预警联系人分组
} from "@/api/systemApi.ts";
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

  showUnitSetting: boolean = false; // 查看已有分组设置状态
  earlyGroup: Array<Object> = []; //获取分组
  newTag: boolean = false; // 新增分组框状态
  newTagValue: string = ""; // 新增分组的值

  private createForm: Object = {
    //新增表单字段
    earlyGroupId: "", //分组id
    email: "", //邮箱
    name: "", //姓名
    note: "", //备注
    phone: "" //电话
  };

  private dialogEdit: Boolean = false; // 修改弹出表单
  private editForm: Object = {
    //修改表单字段
    earlyGroupId: "", //分组id
    email: "", //邮箱
    name: "", //姓名
    note: "", //备注
    phone: "", //电话
    id: "" //目标联系人id
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

  createwarning() {
    /**@description 新增预警联系人 */
    this.$refs["dataForm"]["validate"](valid => {
      if (valid) {
        var form = {
          ...this.createForm
        };
        addWarning(form)
          .then(res => {
            this.handleClose();
            this["fetchData"](this.initForm);
            this["notify"]("添加预警联系人成功");
          })
          .catch(err => {
            if (err.response.data.data[0].key === "phone") {
              this.errorMessage["phone"] = err.response.data.data[0].value;
            }
          });
      }
    });
  }

  async getGroupList() {
    /**@description 获取分组信息 */
    const { data } = await getGroup();
    this.createForm["earlyGroupId"] = data.data[0].id;
    this.earlyGroup = data.data;
  }

  showInput() {
    /**@description 显示新增分组框*/
    this.newTag = true;
  }

  handleInputConfirm() {
    /**@description 新增分组 */
    this.newTag = false;
    if (this.newTagValue) {
      addGroup({ groupName: this.newTagValue }).then(res => {
        if (res.data.code === 200) {
          this.getGroupList();
          this.newTagValue = "";
        }
      });
    }
  }

  deleteTag(tag, index) {
    /**@description 删除分组 */
    deleteGroup(tag.id).then(res => {
      if (res.data.code === 200) {
        this.getGroupList();
      }
    });
  }

  editTarget(item) {
    /**@description 修改操作 */
    for (const key in this.editForm) {
      this.editForm[key] = item[key];
    }
    this.editForm["earlyGroupId"] = item.groupId;
    this.dialogEdit = true;
  }

  updatewarning() {
    /**@description 修改预警联系人 */
    editWarning(this.editForm).then(() => {
      this.handleClose();
      this["notify"]("修改预警联系人成功");
      this["fetchData"](this.initForm);
    });
  }

  handleClose() {
    /** @description 关闭新增/修改dialog */
    this.dialogCreate = false; //新增dialog
    this.dialogEdit = false; //修改dialog
    for (const key in this.errorMessage) {
      this.errorMessage[key] = "";
    }
    this.$refs["dataForm"]["resetFields"]();
  }

  deleteBtn(item) {
    /**@description 单个删除状态 */
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

  isDisabled(row, index) {
    /**@discription 禁用多选 */
    if (row.auditResult == 3) {
      return 0;
    }
  }
}
</script>

<style lang="scss" scoped>
.table-col {
  position: relative;
}
.input-new-tag {
  width: 120px;
}
</style>

<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <action-header
          :moreStatus="false"
          :filterStatus="false"
          :initFormHeader="initForm"
          @fetchData="fetchData"
          :filterForm="filterForm"
          :dialogCreate.sync="dialogCreate"
          :total="page.total"
        >
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="export">导出</el-dropdown-item>
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

            <el-table-column type="index" label="序号" width="50"></el-table-column>

            <el-table-column prop="title" label="标题" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{scope.row.title}}</span>
                <div class="fun-btn">
                  <el-dropdown trigger="click" placement="bottom-start" @command="commandClick">
                    <el-tooltip class="item" effect="dark" content="点击操作" placement="top">
                      <i v-show="scope.row.showMenu" class="iconfont icon-menu"></i>
                    </el-tooltip>
                    <el-dropdown-menu slot="dropdown">
                      <!-- <el-dropdown-item :command="returnCommand('delete', scope.row)">批量删除</el-dropdown-item> -->
                      <el-dropdown-item
                        :command="returnCommand('delete', scope.row)"
                      >{{ deleteForm.data.length ? '批量删除' : '删除' }}</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="content"
              align="center"
              label="发布内容"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column
              prop="createTime"
              label="发布时间"
              align="center"
              :show-overflow-tooltip="true"
            ></el-table-column>
          </el-table>
        </div>
        <el-pagination
          @current-change="pageChange"
          style="margin-top:10px;"
          background
          layout="prev, pager, next,total"
          :page-size="page.limit"
          :total="page.total"
        ></el-pagination>
      </el-col>
    </el-row>
    <!-- 通知发布 -->
    <el-dialog
      class="image-dialod"
      title="发布通知"
      width="500px"
      :visible.sync="dialogCreate"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="createForm"
        label-position="right"
        label-width="100px"
        style="margin-right:40px;"
      >
        <el-form-item
          class="phone-input"
          label="标题: "
          prop="title"
          :show-message="showMessage"
          :error="errorMessage.title"
        >
          <el-input
            style="width:310px"
            v-model="createForm.title"
            placeholder="请输入标题"
            clearable
            @input="constraintLength(createForm.title,'30')"
            :maxlength="30"
          ></el-input>
        </el-form-item>

        <!-- <el-form-item
          class="phone-input"
          label="发布类型: "
          prop="objType"
          :show-message="showMessage"
          :error="errorMessage.objType"
        >
          <el-select
            style="width:310px;"
            v-model="createForm.objType"
            placeholder="请选择发布类型"
            @change="selectType"
          >
            <el-option
              v-for="item in meetingType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>-->

        <!-- <el-form-item
          v-if="createForm.objType==='1'"
          class="phone-input"
          label="发布对象: "
          prop="objIds"
          :show-message="showMessage"
          :error="errorMessage.objIds"
        >
          <el-select
            style="width:310px"
            v-model="createForm.objIds"
            multiple
            filterable
            remote
            reserve-keyword
            placeholder="请选择发布对象"
            :remote-method="remoteMethod"
            :loading="loading"
          >
            <el-option
              v-for="item in typrlist"
              :key="item.scenceUserId"
              :label="item.value"
              :value="item.scenceUserId"
            >
              <span style="float: left">{{ item.value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>-->

        <!-- <el-form-item
          v-if="createForm.objType==='2'"
          class="phone-input"
          label="发布对象: "
          prop="objIds"
          :show-message="showMessage"
          :error="errorMessage.objIds"
        >
          <el-select
            style="width:310px"
            v-model="createForm.objIds"
            multiple
            filterable
            remote
            reserve-keyword
            placeholder="请选择发布对象"
          >
            <el-option
              v-for="item in typrlist"
              :key="item.scenceUserId"
              :label="item.name"
              :value="item.scenceUserId"
            ></el-option>
          </el-select>
        </el-form-item>-->

        <el-form-item
          class="phone-input"
          style="width:410px"
          label="内容: "
          prop="content"
          :show-message="showMessage"
          :error="errorMessage.content"
        >
          <el-input
            type="textarea"
            :rows="9"
            placeholder="请输入通知内容"
            v-model="createForm.content"
            clearable
            @input="constraintLength(createForm.content,'200')"
            :maxlength="200"
          ></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="info" @click="handleClose">取消</el-button>
        <el-button type="primary" @click="issueBtn">发布</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import mixin from "@/config/minxins";
import { postMessage } from "@/api/noticeApi.ts"; //添加
import { queryCarPhone } from "@/api/carApi.ts"; //根据手机号模糊查询用户
import { searchHouse } from "@/api/houseApi"; //根据房屋模糊查询用户

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
  filterForm: object = {}; //根据关键字查询
  initForm: object = {
    //获取访客名单列表url
    url: "/admin/hs-notice/",
    method: "get"
  };

  deleteForm: Object = {
    //单个或批量删除
    url: "/admin/hs-notice/batch-delete",
    method: "delete",
    data: []
  };

  private dialogFormVisible: Boolean = false;

  private roleTitle: String = "0"; //添加0 || 修改1
  private createForm: Object = {
    //添加/修改表单字段
    content: "", //发布内容
    objType: "3", //发布对象
    title: "", //发布名称
    objIds: [] //发布对象id
  };
  private rules: Object = {
    // 表单验证
    content: [{ required: true, message: "请输入发布内容", trigger: "blur" }],
    title: [{ required: true, message: "请输入发布名称", trigger: "blur" }],
    objType: [{ required: true, message: "请选择发布类型", trigger: "blur" }],
    objIds: [{ required: true, message: "请选择发布对象", trigger: "blur" }]
  };
  private showMessage: Boolean = true; //是否显示表单错误信息
  private errorMessage: Object = {
    // 表单错误信息
    content: "",
    objType: "",
    title: "",
    objIds: ""
  };

  private meetingType: Array<Object> = [
    //发布通知类型
    {
      label: " 指定人员",
      value: "1"
    },
    {
      label: "指定楼栋",
      value: "2"
    },
    {
      label: "全部",
      value: "3"
    }
  ];
  private typrlist: Array<Object> = []; //房屋 || 人员
  private loading: Boolean = false;

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

  issueBtn() {
    /**@description 添加车辆处理 */
    this.$refs["dataForm"]["validate"](valid => {
      if (valid) {
        const form = { ...this.createForm };
        // if (this.createForm["objType"] === "3") {
        //   delete form["objIds"];
        // }
        postMessage(form).then(res => {
          this.handleClose();
          this["fetchData"](this.initForm);
          this["notify"]("success", "成功", "发布消息成功");
        });
      }
    });
  }

  selectType(select) {
    /**@description select 发布对象类型 */
    this.typrlist = [];
    this.createForm["objIds"] = [];
    if (select === "2") {
      this.getHouse();
    }
  }

  async remoteMethod(query) {
    /**@description 根据电话模糊查询人员 */
    if (query !== "") {
      this.loading = true;
      setTimeout(() => {
        if (this.createForm["objType"] === "1") {
          if (query.length >= 7) {
            this.getPhone(query);
          }
        }
      }, 200);
    } else {
      this.typrlist = [];
    }
  }

  getPhone(query) {
    /**@description 获取人员信息 */
    queryCarPhone(query).then(res => {
      this.loading = false;
      this.typrlist = res.data.data.map(item => {
        return {
          value: item.phone,
          name: item.name,
          scenceUserId: item.id
        };
      });
    });
  }

  getHouse() {
    /**@description 获取房屋楼栋信息 */
    searchHouse().then(res => {
      console.log(res.data.data);
      this.typrlist = res.data.data.map(item => {
        return {
          name: item.name,
          scenceUserId: item.id
        };
      });
    });
  }

  editType(item) {
    /**@description 修改状态 */
    console.log(item);
    // this.dialogFormVisible = true;
  }

  handleClose() {
    this['dialogCreate'] = false
    this.$refs["dataForm"]["resetFields"]();
  }

  // allChoose() {
  //   /**@description 全选 */
  //   this.createForm["objIds"] = [];
  //   this.meetingLoc.map(item => {
  //     this.createForm["objIds"].push(item["objIds"]);
  //   });
  // }
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
  top: 18px;
  .iconfont {
    font-size: 19px;
    color: #8091a5;
    cursor: pointer;
  }
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

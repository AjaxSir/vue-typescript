<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <action-header
          :dialogCreate.sync="dialogCreate"
          :initFormHeader="initForm"
          @fetchData="fetchData"
          ref="actionHeader"
          exportUrl="/admin/hsDoorCard/export"
          exportName="门禁卡.xlsx"
          :filterForm="filterForm"
          :total="page.total"
        >
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <div @click="showExportIn">导入</div>
            </el-dropdown-item>
            <el-dropdown-item command="export">导出</el-dropdown-item>
          </el-dropdown-menu>
          <div slot="houseNum">
            <div class="word-filter">
              <span class="filter-name">关联房屋:</span>
              <el-input clearable
              @keyup.enter.native="emitFetchData"   class="input-filter" placeholder="请输入关联房屋查找" v-model='filterForm.houseName' size="small"></el-input>
            </div>
            <div class="word-filter">
              <span class="filter-name">门禁卡号:</span>
              <el-input clearable
              @keyup.enter.native="emitFetchData"  class="input-filter" placeholder="请输入卡号查找" v-model='filterForm.cardNo' size="small"></el-input>
            </div>
             <div class="word-filter">
              <span class="filter-name">状态:</span> &nbsp;&nbsp;
              <el-select multiple class="select-class" size="small" v-model="filterForm.status" placeholder="请选择">
                <!-- <el-option label="全部" value=""></el-option> -->
                <el-option label="正常" value="0"></el-option>
                <el-option label="过期" value="-1"></el-option>
                <el-option label="禁用" value="-2"></el-option>
              </el-select>
            </div>
          </div>
        </action-header>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="24" class="table-col">
        <div class="rightContent">
          <el-table
            :data="list_data"
            stripe
            border
            v-loading="showLoading"
            height="65vh"
            highlight-current-row
            @cell-mouse-enter="enterRowChange"
            @selection-change="handleSelectionChange"
            @cell-mouse-leave="leaveRowChange"
          >
            <el-table-column v-if="globalUpdateStatus" type="selection" width="50"></el-table-column>

            <el-table-column align="center" class="indexNum" type="index" label="序号" width="50">
              <template slot-scope="scope">
                <span>{{ scope.$index + 1 }}</span>
                <div v-if="globalUpdateStatus" class="fun-btn">
                  <el-dropdown trigger="click" placement="bottom-start" @command="commandClick">
                    <el-tooltip class="item" effect="dark" content="点击操作" placement="top">
                      <i v-show="scope.row.showMenu" class="iconfont icon-menu"></i>
                    </el-tooltip>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        :command="returnCommand('delete', scope.row)"
                      >{{ deleteForm.data.length ? '批量删除' : '删除' }}</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" class="serial-num" prop="cardNo" label="卡号">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="queryIdetity(scope.row)"
                >{{scope.row.cardNo}}</el-button>
              </template>
            </el-table-column>

            <el-table-column align="center" prop="houseName" label="关联房屋"></el-table-column>

            <el-table-column
              align="center"
              width="220"
              :show-overflow-tooltip="true"
              prop="createTime"
              label="创建时间"
            ></el-table-column>

            <!-- <el-table-column align="center" prop="lastUseTime" label="最近刷卡时间">
              <template slot-scope="scope">
                {{ scope.row.lastUseTime || '--' }}
              </template>
            </el-table-column>-->
            <el-table-column
              :show-overflow-tooltip="true"
              align="center"
              prop="validDate"
              label="过期时间"
            >
              <template slot-scope="scope">
                <span
                  class="rowUpdate"
                  @click="showUpdateTime(scope.row)"
                  v-show="!scope.row.validDateStatus"
                >{{ scope.row.validDate }}</span>
                <el-date-picker
                  :clearable="false"
                  v-show="scope.row.validDateStatus"
                  :ref="scope.row.id"
                  v-model="scope.row.validDate"
                  type="date"
                  format="yyyy - MM - dd"
                  value-format="yyyy-MM-dd"
                  @blur="blurDate(scope.row)"
                  :picker-options="options"
                  @change="validDateChange($event, scope.row.id)"
                  placeholder="选择日期"
                ></el-date-picker>
              </template>
            </el-table-column>
            <el-table-column align="center" width="120" prop="status" label="状态">
              <template slot-scope="{row}">
                <el-tag
                v-if='row.status === "-1"'
                      size="small"
                      style="border-radius: 50px;padding: 0 10px; "
                      type="danger"
                    >过期</el-tag>
                <el-dropdown v-else @command="cardStatusChange" trigger="click">
                  <span class="el-dropdown-link">
                    <el-tag
                      size="small"
                      style="border-radius: 50px;padding: 0 10px; cursor: pointer;"
                      :type="row.status === '0' ? 'success' : 'danger'"
                    >{{ row.status === '0' ? "正常" : (row.status === '-2' ? "禁用" : "过期" ) }}</el-tag>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :command="ComponentCommand('0', row)">正常</el-dropdown-item>
                    <el-dropdown-item :command="ComponentCommand('-2', row)">禁用</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
            <!-- <el-table-column align="center" prop="count" label="进出"></el-table-column> -->
            <el-table-column align="center" width="110" prop="count" label="累计刷卡次数"></el-table-column>
          </el-table>
          <el-pagination
            @current-change="pageChange"
            :page-size="page.limit"
            style="margin-top:10px;"
            background
            layout="prev, pager, next"
            :total="page.total"
          ></el-pagination>
        </div>
      </el-col>
    </el-row>

    <el-dialog
      :close-on-click-modal="false"
      class="dialog-rewrite"
      :title="'卡号: '+ detailDialog.cardNo"
      width="700px"
      :visible.sync="dialogFormVisible"
    >
      <el-tabs type="card" v-model="activeName">
        <el-tab-pane label="详细信息" name="详细信息">
          <el-row :gutter="20">
            <el-col :span="12">
              <p class="detai-info">
                <span class="labelTitle">门禁卡号</span>
                :&nbsp;&nbsp;&nbsp;{{detailDialog.cardNo}}
              </p>

              <p class="detai-info">
                <span class="labelTitle">关联房屋</span>
                :&nbsp;&nbsp;&nbsp;{{detailDialog.houseName}}
              </p>

              <p class="detai-info">
                <span class="labelTitle">状态</span> :&nbsp;&nbsp;&nbsp;
                <el-tag
                  size="small"
                  style="border-radius: 50px;padding: 0 10px; cursor: pointer;"
                  :type="detailDialog.status === '0' ? 'success' : 'danger'"
                >
                {{ detailDialog.status === '0' ? "正常" : (detailDialog.status === '-2' ? "禁用" : "过期" ) }}
                </el-tag>
              </p>
            </el-col>
            <el-col :span="12">
              <p class="detai-info">
                <span class="labelTitle">创建时间</span>
                :&nbsp;&nbsp;&nbsp;{{detailDialog.createTime}}
              </p>

              <p class="detai-info">
                <span class="labelTitle">过期时间</span>
                :&nbsp;&nbsp;&nbsp;{{detailDialog.validDate}}
              </p>

              <p class="detai-info">
                <span class="labelTitle">最近刷卡时间</span>
                :&nbsp;&nbsp;&nbsp;{{detailDialog.lastUseTime || ''}}
              </p>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="通行记录" name="通行记录">
          <el-table :data="dtailTable" style="width: 100%">
            <el-table-column align="center" prop="name" label="姓名" width="150px"></el-table-column>
            <el-table-column align="center" prop="date" label="通行时间" width="150px"></el-table-column>
            <el-table-column align="center" prop="address" label="通行地址"></el-table-column>
          </el-table>
          <el-pagination
            background
            @current-change="getTheCardPassList"
            layout="prev, pager, next"
            :total="theCardPassListForm.total"
          ></el-pagination>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="dialogFormVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :close-on-click-modal="false"
      title="添加门禁卡"
      :visible.sync="dialogCreate"
      width="500px"
      :before-close="handleClose"
    >
      <el-form
        :model="Form"
        :rules="rules"
        ref="Forms"
        label-position="right"
        label-width="130px"
        style="margin-right:40px;"
      >
        <el-form-item label="卡号:" prop="cardNo">
          <el-input clearable v-model="Form.cardNo" placeholder="输入卡号"></el-input>
        </el-form-item>
        <el-form-item label="过期时间:" prop="validDate">
          <el-date-picker
            style="width:100%"
            v-model="Form.validDate"
            type="date"
            placeholder="选择过期日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="需关联的房屋:" prop="houseName">
          <el-autocomplete
            style="width:100%"
            clearable
            popper-class="my-autocomplete"
            v-model="Form.houseName"
            :fetch-suggestions="querySearch"
            placeholder="请输入内容"
            :trigger-on-focus="false"
            @select="handleSelect"
          >
            <template slot-scope="{ item }">
              <div class="value">{{ item.name }}</div>
            </template>
          </el-autocomplete>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="createdCardConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <ExportIn
    :uploadUrl="env === 'production' ? 'http://47.103.184.184/admin/hsDoorCard/import' : '/v1/admin/hsDoorCard/import'"
    downTemplateUrl='/admin/hsDoorCard/model'
    @closeVisible='closeVisible'
    TmplateName='门禁卡导入模板.xlsx'
    @successUpload='fetchData(initForm)'
    :visible.sync='visible' />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import mixin from "@/config/minxins";
import {
  changeCardStstus,
  createCard,
  searchSuggestHouse,
  cardvalidDateChange,
  theCardPassList
} from "@/api/houseApi.ts";
import { formatTimeObj } from "@/utils";
const ActionHeader = () => import("@/components/ActionHeader.vue");
const ExportIn = () => import("@/components/exportIn/index.vue");

@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    ExportIn
  }
})
export default class CardManage extends Vue {
  Form: any = {
    cardNo: "",
    validDate: "",
    houseName: "",
    houseId: ""
  };
  rules: any = {
    cardNo: [{ required: true, message: "请输入卡号", trigger: "blur" }],
    validDate: [{ required: true, message: "请输入过期时间", trigger: "blur" }],
    houseName: [
      { required: true, message: "请输入需关联的房屋", trigger: "blur" }
    ]
  };
  env: string =  process.env.NODE_ENV
  private dialogFormVisible: Boolean = false;
  theCardPassListForm: object = {
    page: 1,
    id: "",
    total: 1
  };
  options: object = {
    disabledDate(time) {
      return time.getTime() < Date.now() - 8.64e7;
    }
  }
  private detailDialog: Object = {
    //查看目标详情
  };
  filterForm: Object = {
    houseName: '',
    cardNo: '',
    status: []
  }
  initForm: Object = {
    url: "admin/hsDoorCard/list",
    method: "get"
  };
  deleteForm: Object = {
    url: "/admin/hsDoorCard",
    method: "delete",
    data: []
  };
  visible: boolean = false; // 导入框状态
  updateArray: Array<string> = ["cardStatus", "validDateStatus"];
  private activeName: String = "详细信息";
  private dtailTable: Array<Object> = [];

  ComponentCommand(status: string, row: object) {
    return {
      ...row,
      status
    };
  }
  // 切换到修改时间框
  showUpdateTime(row) {
    this["list_data"].forEach(element => {
      element["validDateStatus"] = false;
    });
    row.validDateStatus = !row.validDateStatus;
    this.$nextTick(() => {
      const timeInput = this.$refs[row.id] as HTMLElement;
      timeInput.focus();
    });
  }
  // 时间修改失去焦点
  blurDate(row) {
    row.validDateStatus = false;
  }
  /// 修改门禁卡过期时间
  validDateChange(date: string, id: string) {
    console.log(date, id);
    // const date1 = formatTimeObj(date)
    cardvalidDateChange({ date, id })
      .then((res: any) => {
        if (res.data.code === 200) {
          this.$message.success("修改过期时间成功");
          this.fetchData(this.initForm);
        }
      })
      .catch(err => {
        this.fetchData(this.initForm);
      });
  }
  closeVisible(flag: boolean) {
    this.visible = flag;
  }
  showExportIn() {
    this.visible = true;
  }
  // 修改门禁卡状态
  cardStatusChange(Obj: object) {
    const id = Obj["id"];
    const status = Obj["status"];
    this.$confirm(
      `此操作将改变当前门禁卡为${
        status === "0" ? "正常" : "禁用"
      }状态, 是否继续?`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }
    )
      .then(() => {
        changeCardStstus(status, id).then(res => {
          if (res.data.code === 200) {
            this.$message.success(`${status === "0" ? "恢复" : "禁用"}成功`);
            this.fetchData(this.initForm);
          }
        });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
  }
  // 选择搜索建议列表某项 并赋值
  handleSelect(val: object) {
    this.Form.houseId = val["id"];
    this.Form.houseName = val["name"];
  }
  // 获取当前输入的值
  querySearch(string: string, cb) {
    let result = [];
    searchSuggestHouse(string).then(res => {
      if (res.data.data) {
        result = res.data.data;
        result.splice(10);
        cb(result);
      }
    });
  }
  // 创建门禁卡
  createdCardConfirm() {
    this.Form.validDate = formatTimeObj(this.Form.validDate);
    createCard(this.Form).then(res => {
      if (res.data.code === 200) {
        this.$message.success(`创建成功`);
        this.fetchData(this.initForm);
        this["dialogCreate"] = false;
      }
    });
  }
  queryIdetity(row) {
    this.detailDialog = row;
    this.dialogFormVisible = true;
    this.getTheCardPassList(1, row.id);
  }
  // 获取指定门禁卡的同行记录
  getTheCardPassList(page: number, id?: string) {
    this.theCardPassListForm["id"] = id ? id : this.theCardPassListForm["id"];
    this.theCardPassListForm["page"] = page;
    theCardPassList(this.theCardPassListForm).then((res: any) => {
      if (res.data.code === 200) {
        this.dtailTable = res.data.data.records;
        this.theCardPassListForm["total"] = res.data.data.total;
      }
    });
  }
  created() {
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    ); // 合并参数
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

.menu-control {
  position: absolute;
  top: 32vh;
  left: -5px;
}

.menu-visible {
  position: absolute;
  top: 32vh;
  left: -8px;
}

.close-menu {
  width: 10px;
  height: 48px;
  background: #acb7c1;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  position: relative;
}
.labelTitle {
  width: 85px;
  display: inline-block;
  height: 40px;
  line-height: 40px;
  text-align: right;
}
.icon-class {
  font-size: 12px;
  color: #e7eaeb;
  cursor: pointer;
  line-height: 48px;
  position: absolute;
  left: -1px;
}
.my-autocomplete {
  li {
    line-height: normal;
    padding: 7px;

    .value {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .id {
      font-size: 12px;
      color: #b4b4b4;
    }

    .highlighted .addr {
      color: #ddd;
    }
  }
}
.detai-info {
  font-size: 14px;
}
</style>

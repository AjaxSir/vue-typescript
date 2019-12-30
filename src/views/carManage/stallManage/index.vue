<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <action-header
          exportUrl="/v1/admin/car-space/export"
          exportName="车位.xls"
          ref="actionHeader"
          :initFormHeader="initForm"
          :filterStatus="false"
          :houseStatus="false"
          @fetchData="fetchData"
          :filterForm="filterForm"
          :dialogCreate.sync="dialogCreate"
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
              <span class="filter-name">车位编号:</span>
              <el-input
                class="input-filter"
                size="small"
                clearable
                v-model="filterForm.serialNumber"
                placeholder="请输入车位编号"
                @keyup.enter.native="emitFetchData"
              ></el-input>
            </div>
            <div class="word-filter">
              <span class="filter-name filter-rewrite">车位状态:</span>
              <el-select
                class="select-class"
                size="small"
                v-model="filterForm.status"
                placeholder="请选择车位状态"
              >
                <el-option
                  v-for="item in carType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
            <div class="word-filter">
              <span class="filter-name filter-rewrite">车位类型:</span>
              <el-select
                class="select-class"
                size="small"
                v-model="filterForm.carSpaceTypeId"
                placeholder="请选择车位类型"
              >
                <el-option
                  v-for="item in carStatusFilter"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </div>
        </action-header>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="rowSpan.row1">
        <data-tree
          ref="dataTree"
          @fetchData="fetchData"
          :page="page"
          :initFormHeader="initForm"
          @getHouseTreeData="getHouseTreeData"
          :TreeData="TreeData"
        />
      </el-col>

      <el-col :span="rowSpan.row2" class="table-col">
        <div class="rightContent">
          <el-table
            :data="list_data"
            stripe
            height="65vh"
            v-loading="showLoading"
            highlight-current-row
            @cell-mouse-enter="enterRowChange"
            @selection-change="handleSelectionChange"
            @cell-mouse-leave="leaveRowChange"
          >
            <el-table-column v-if="globalUpdateStatus" type="selection" align="center" width="50"></el-table-column>

            <el-table-column type="index" align="center" label="序号" class="indexNum" width="50">
              <template slot-scope="scope">
                <span>{{scope.$index + 1}}</span>
                <div v-if="globalUpdateStatus" class="fun-btn">
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

            <el-table-column
              align="center"
              prop="carSpaceGroupName"
              label="所属分组"
              :show-overflow-tooltip="true"
            ></el-table-column>

            <el-table-column
              align="center"
              prop="serialNumber"
              width="200px"
              :show-overflow-tooltip="true"
              label="编号"
            ></el-table-column>

            <el-table-column
              width="120"
              align="center"
              prop="type"
              label="状态"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="{row}">
                <span>{{ row.status}}</span>
              </template>
            </el-table-column>

            <el-table-column
              prop="ownerName"
              width="120"
              align="center"
              label="业主"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <el-button
                  @click="showHouseDetails(scope.row,'first')"
                  type="text"
                >{{ scope.row.ownerName }}</el-button>
              </template>
            </el-table-column>

            <el-table-column
              prop="carSpaceTypeName"
              width="120"
              align="center"
              label="车位类型"
              :show-overflow-tooltip="true"
            ></el-table-column>

            <el-table-column prop="carNo" align="center" label="绑定车辆" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <el-button @click="showHouseDetails(scope.row,'second')" type="text">
                  <div
                    style="width: 100px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"
                    v-if="scope.row.carSpaceVos && scope.row.carSpaceVos.length > 0"
                  >
                    <span
                      v-for="(item,index) in scope.row.carSpaceVos"
                      :key="'carSpaceVos' + index"
                    >
                      {{item.carNo}}
                      <span
                        v-if="scope.row.carSpaceVos && scope.row.carSpaceVos.length > 1"
                      >,</span>
                    </span>
                  </div>

                  <span v-else>--</span>
                </el-button>
              </template>
            </el-table-column>

            <el-table-column align="center" :show-overflow-tooltip="true" prop="note" label="备注">
              <template slot-scope="scope">
                <span
                  class="rowUpdate"
                  v-show="!scope.row.noteStatus"
                  @click="focusNoteInput(scope.row)"
                >{{ scope.row.note || '--' }}</span>
                <el-input
                  size="mini"
                  :ref="scope.row.id"
                  @keyup.enter.native="confirmUpdateNote(scope.row)"
                  @blur="noteBlur(scope.row)"
                  v-model="noteString"
                  v-show="scope.row.noteStatus"
                  :clearable="true"
                  placeholder="输入备注"
                ></el-input>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @current-change="pageChange"
            :page-size="page.limit"
            style="margin-top:10px;"
            :current-page.sync="page.page"
            background
            layout="prev, pager, next"
            :total="page.total"
          ></el-pagination>
          <div :class="rowSpan.row1===3 ? menuControl1 : menuControl2" @click="menuVisible">
            <p class="close-menu">
              <i v-if="rowSpan.row1===3" class="iconfont icon-left icon-class"></i>
              <i v-else class="iconfont icon-zuo icon-class"></i>
            </p>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 添加车位 -->
    <el-dialog
      :close-on-click-modal="false"
      title="添加车位"
      :visible.sync="dialogCreate"
      width="500px"
      :before-close="handleClose"
    >
      <el-form
        :model="createForm"
        :rules="rules"
        ref="dataForm"
        label-width="100px"
        label-position="right"
        style="margin-right:40px;"
      >
        <el-form-item
          label="选择业主:"
          prop="ownerScenceUserId"
          :show-message="showMessage"
          :error="errorMessage.ownerScenceUserId"
        >
          <el-select
            style="width:100%"
            v-model="createForm.ownerScenceUserId"
            filterable
            remote
            :remote-method="remoteMethod"
            :loading="loading"
            placeholder="请输入姓名进行模糊查询"
          >
            <el-option
              v-for="item in nameList"
              :key="item.ownerScenceUserId"
              :label="item.name"
              :value="item.ownerScenceUserId"
            >
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item. value }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属分组:" prop="carSpaceGroupId">
          <el-cascader
            style="width:100%"
            v-model="createForm.carSpaceGroupId"
            :options="TreeData"
            :show-all-levels="false"
            :props="{ label: 'name', children: 'sonCarSpaceGroups', value: 'id' }"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="车位编号:" prop="serialNumber">
          <el-input
            clearable
            v-model="createForm.serialNumber"
            placeholder="请输入车位编号"
            :maxlength="10"
            @input="constraintLength(createForm.serialNumber,'10')"
          ></el-input>
        </el-form-item>
        <el-form-item label="车位类型:" prop="carSpaceTypeId">
          <el-select style="width:100%" v-model="createForm.carSpaceTypeId" placeholder="请选择">
            <el-option v-for="item in carStatus" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车位状态:" prop="status">
          <el-select style="width:100%" v-model="createForm.status" placeholder="请选择">
            <el-option label="已售（自用）" value="已售（自用）"></el-option>
            <el-option label="已售（出租）" value="已售（出租）"></el-option>
            <el-option label="未售（出租）" value="未售（出租）"></el-option>
            <el-option label="未售（闲置）" value="未售（闲置）"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="备注信息:" prop="note">
          <el-input
            type="textarea"
            v-model="createForm.note"
            :maxlength="200"
            placeholder="输入备注信息"
            @input="constraintLength(editForm.note,'200')"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="createStall">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改车位 -->
    <el-dialog
      :close-on-click-modal="false"
      title="修改车位"
      :visible.sync="dialogEdit"
      width="500px"
      :before-close="editClose"
    >
      <el-form
        :model="editForm"
        ref="updateForm"
        label-width="100px"
        label-position="right"
        style="margin-right:40px;"
      >
        <el-form-item
          label="选择业主:"
          prop="ownerScenceUserId"
          :show-message="showMessage"
          :error="errorMessage.ownerScenceUserId"
        >
          <el-select
            style="width:100%"
            v-model="ownerName"
            filterable
            remote
            :remote-method="remoteMethod"
            :loading="loading"
            placeholder="请输入姓名进行模糊查询"
            @change="changeOwner"
          >
            <el-option
              v-for="item in nameList"
              :key="item.ownerScenceUserId"
              :label="item.name"
              :value="item.ownerScenceUserId"
            >
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item. value }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属分组:" prop="carSpaceGroupId">
          <el-cascader
            style="width:100%"
            v-model="editForm.carSpaceGroupId"
            :options="TreeData"
            :show-all-levels="false"
            :props="{ label: 'name', children: 'sonCarSpaceGroups', value: 'id' }"
            @change="handleEdit"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="车位编号:" prop="serialNumber">
          <el-input
            clearable
            v-model="editForm.serialNumber"
            placeholder="请输入车位编号"
            :maxlength="10"
            @input="constraintLength(editForm.serialNumber,'10')"
          ></el-input>
        </el-form-item>
        <el-form-item label="车位类型:" prop="carSpaceTypeId">
          <el-select style="width:100%" v-model="editForm.carSpaceTypeId" placeholder="请选择">
            <el-option v-for="item in carStatus" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车位状态:" prop="status">
          <el-select style="width:100%" v-model="editForm.status" placeholder="请选择">
            <el-option label="已售（自用）" value="已售（自用）"></el-option>
            <el-option label="已售（出租）" value="已售（出租）"></el-option>
            <el-option label="未售（出租）" value="未售（出租）"></el-option>
            <el-option label="未售（闲置）" value="未售（闲置）"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="备注信息:" prop="note">
          <el-input
            type="textarea"
            v-model="editForm.note"
            :maxlength="200"
            placeholder="输入备注信息"
            @input="constraintLength(editForm.note,'200')"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editClose">取 消</el-button>
        <el-button type="primary" @click="updateStall">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 业主详细信息 -->
    <el-dialog
      class="dialog-rewrite"
      :width=" activeName==='first' ? '650px' : '500px'"
      :title="'业主: '+ detailDialog.ownerName"
      :visible.sync="dialogFormVisible"
      :before-close="detailClose"
    >
      <el-tabs type="card" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="业主信息" name="first">
          <el-form label-width="100px" v-model="ownerDetail">
            <el-row :gutter="20">
              <el-col :span="12" class="col-line">
                <el-form-item style="margin-bottom:0" label="姓名:">
                  <span>{{ownerDetail.name}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="性别:">
                  <span>{{ownerDetail.sex==='0' ? '女' : '男'}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="年龄:">
                  <span>{{ownerDetail.age}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="电话:">
                  <span>{{ownerDetail.phone}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item style="margin-bottom:0" label="证件类型:">
                  <span>{{ownerDetail.cardName}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="证件号码:">
                  <span>{{ownerDetail.cardNo}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="备注信息:">
                  <span>{{ownerDetail.note ? ownerDetail.note : "暂无"}}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="绑定车辆" name="second">
          <el-form
            label-position="right"
            label-width="120px"
            style="margin-right:56px;"
            v-model="bindingcarnum"
          >
            <el-form-item style="margin-bottom:0" label="所属分组:" prop="carSpaceGroupName">
              <span>{{detailDialog.carSpaceGroupName}}</span>
            </el-form-item>

            <el-form-item style="margin-bottom:14px" label="已绑车辆:" prop="bindCarName">
              <el-tag
                style="margin-left:5px"
                :key="index"
                v-for="(tag, index) in detailDialog.carSpaceVos"
                closable
                :disable-transitions="false"
                @close="deleteTag(tag)"
              >{{tag.carNo}}</el-tag>
            </el-form-item>

            <el-form-item label="绑定车辆:" prop="carId">
              <el-select
                style="width:100%"
                v-model="bindingcarnum.carId"
                filterable
                remote
                :disabled="carIdDisabled"
                placeholder="请输入车牌号进行模糊查询"
                :remote-method="remoteMethodCar"
                :loading="carLoading"
              >
                <el-option
                  v-for="item in carnoList"
                  :key="item.carId"
                  :label="item.name"
                  :value="item.carId"
                >
                  <span style="float: left">{{ item.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item. value }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <span v-if="activeName==='second'" slot="footer" class="dialog-footer">
        <el-button @click="detailClose">取 消</el-button>
        <el-button type="primary" @click="bindingcarnumBtn">绑 定</el-button>
      </span>
    </el-dialog>

    <ExportIn
      uploadUrl="/v1/admin/car-space/import"
      downTemplateUrl="/v1/admin/usr-car/import"
      @closeVisible="closeVisible"
      TmplateName="车位导出模板.xlsx"
      @successUpload="fetchData(initForm)"
      :visible.sync="visible"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import mixin from "@/config/minxins";
import {
  getHouseTreeData,
  // addHouse,
  // updateStatusNote,
  getStall, // 获取车位列表
  addStall, // 新增车位
  editStall, // 修改车位
  getOwnerUser, // 查看业主详情
  querycarno, // 查询车牌号
  addcarno, // 新增绑定车牌
  deleteCarno // 删除车牌
} from "@/api/carApi.ts";
import { getUserName } from "@/api/vistorApi.ts"; //输入人名模糊查询人员
const ActionHeader = () => import("@/components/ActionHeader.vue");
const DataTree = () => import("../carTree/index.vue");
const ExportIn = () => import("@/components/exportIn/index.vue");

@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    DataTree,
    ExportIn
  },
  filters: {
    status(val: string) {
      const data = {
        "1": "业主居住",
        "2": "出租中",
        // "3": '待售中',
        // "4": '待租中',
        "3": "闲置"
        // "6": '其他'
      };
      return data[val];
    },
    type(val: string) {
      const data = {
        "1": "业主",
        "2": "租户",
        "3": "成员"
      };
      return data[val];
    },
    peopleStatus(val: string) {
      const data = {
        "0": "在住",
        "-1": "不在住",
        "-2": "过期"
      };
      return data[val];
    }
  }
})
export default class CardManage extends Vue {
  private rowSpan: any = {
    row1: 3,
    row2: 21
  };
  initForm: object = {
    url: "/admin/car-space/",
    method: "get"
  };
  filterForm: object = {
    serialNumber: null, //车位编号
    status: null, //车位状态
    carSpaceTypeId: null, //车位类型
    carSpaceGroupId: ""
  };
  deleteForm: object = {
    url: "/admin/car-space/batch-delete",
    method: "delete",
    data: []
  };

  createForm: object = {
    ownerScenceUserId: "", // 业主场景用户id
    carSpaceGroupId: "", // 车位分组id
    carSpaceTypeId: "", // 车位类型id
    serialNumber: "", // 车位编号
    status: "", // 车位状态
    note: "" // 备注
  };
  rules: any = {
    ownerScenceUserId: [
      { required: true, message: "请车位选择业主", trigger: "change" }
    ],
    carSpaceGroupId: [
      { required: true, message: "请选择车位所属分组", trigger: "change" }
    ],
    carSpaceTypeId: [
      { required: true, message: "请选择车位类型", trigger: "change" }
    ],
    serialNumber: [
      { required: true, message: "请输入车位的编号", trigger: "blur" }
    ],
    status: [{ required: true, message: "请选择车位状态", trigger: "change" }]
  };
  private showMessage: Boolean = true; //是否显示表单错误信息
  private errorMessage: Object = {
    // 表单错误信息
    ownerScenceUserId: "", // 业主场景用户id
    carSpaceGroupId: "", // 车位分组id
    carSpaceTypeId: "", // 车位类型id
    serialNumber: "", // 车位编号
    status: "" // 车位状态
  };

  private dialogEdit: Boolean = false; // 修改弹出表单
  private editForm: Object = {
    ownerScenceUserId: "", // 业主场景用户id
    carSpaceGroupId: "", // 车位分组id
    carSpaceTypeId: "", // 车位类型id
    serialNumber: "", // 车位编号
    status: "", // 车位状态
    id: "", //目标id
    note: "" // 备注
  };
  private ownerName: String = ""; //获取业主id

  TreeData: Array<Object> = []; // 树形结构数据
  private menuControl1: String = "menu-control";
  private menuControl2: String = "menu-visible";
  updateArray: Array<string> = ["noteStatus", "houseStatus"];
  noteString: string = ""; // 修改的备注
  private dialogFormVisible: Boolean = false;

  private detailDialog: Object = {
    //查看目标详情
    name: ""
  };
  private activeName: string = "first"; //目标车位详细信息 tab Title

  private nameList: Array<Object> = []; //人员
  private loading: Boolean = false; //姓名模糊查询

  private carStatus: Array<Object> = []; //获取车位类型

  private ownerDetail: Object = {}; //业主信息
  private carnoList: Array<Object> = []; //车牌号
  private carIdDisabled: Boolean = false; // 是否允许绑定车牌
  private carLoading: Boolean = false; //车牌模糊查询
  private bindingcarnum: Object = { carId: "" }; //绑定车辆

  private carStatusFilter: Array<Object> = [];

  visible: boolean = false; // 导入框状态
  private carType: Array<Object> = [
    //车辆类型筛选
    {
      label: "全部",
      value: null
    },
    {
      label: "已售（自用）",
      value: "已售（自用）"
    },
    {
      label: "已售（出租）",
      value: "已售（出租）"
    },
    {
      label: "未售（出租）",
      value: "未售（出租）"
    },
    {
      label: "未售（闲置）",
      value: "未售（闲置）"
    }
  ];
  ComponentCommand(houseStatus: string, row: object) {
    return {
      ...row,
      houseStatus
    };
  }

  created() {
    this.getHouseTreeData(); // 获取tree data
    this.getSatll(); //获取新增时的车位类型
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    ); // 合并参数
  }

  closeVisible(flag: boolean) {
    /**@description 导出状态 */
    this.visible = flag;
  }

  showExportIn() {
    /**@description 导出状态 */
    this.visible = true;
  }

  getHouseTreeData() {
    /**@description  获取tree data */
    getHouseTreeData().then((res: Object) => {
      this.TreeData = res["data"]["data"];
    });
  }

  async remoteMethod(query) {
    /**@description 根据姓名模糊查询业主 */
    if (query !== "") {
      this.loading = true;
      setTimeout(() => {
        if (query.length >= 1) {
          this.getName(query);
        }
      }, 200);
    } else {
      this.nameList = [];
    }
  }

  getName(query) {
    /**@description 获取业主信息 */
    getUserName({ name: query }).then(res => {
      this.loading = false;
      this.nameList = res.data.data.map(item => {
        return {
          value: item.phone,
          name: item.name,
          ownerScenceUserId: item.id
        };
      });
    });
  }

  async getSatll() {
    /**@description 获取新增时的车位类型 */
    const { data } = await getStall();
    this.carStatus = data.data;
    this.carStatusFilter = [
      {
        name: "全部",
        id: null
      },
      ...data.data
    ];
  }

  handleChange(arr) {
    /**@description 处理新增时选择的车位分组信息 */
    this.createForm["carSpaceGroupId"] = [
      ...this.createForm["carSpaceGroupId"]
    ].pop();
  }

  initData() {
    /**@description 初始化数据 */
    for (const key in this.filterForm) {
      this.filterForm[key] = null;
    }
    this["page"]["page"] = 1;
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    ); // 合并参数
  }

  createStall() {
    /**@description  添加车位 */
    this.$refs["dataForm"]["validate"](valid => {
      if (valid) {
        // this.createForm["carSpaceGroupId"] = [
        //   ...this.createForm["carSpaceGroupId"]
        // ].pop();
        addStall(this.createForm).then(res => {
          if (res.data.code === 200) {
            this.$message.success("添加成功");
            this.initData();
            this["fetchData"](this.initForm);
            this.handleClose();
          }
        });
      }
    });
  }

  handleClose() {
    /** @description 关闭添加dialog */
    this["dialogCreate"] = false; //添加dialog
    for (const key in this.createForm) {
      this.createForm[key] = "";
    }

    this.getSatll();
    this.getHouseTreeData();
    this.nameList = [];
    this.$refs.dataTree["highlightStatus"] = false;
    this.$nextTick(() => {
      this.$refs["dataForm"]["resetFields"]();
    });
  }

  editTarget(item) {
    /**@description 修改操作 */
    for (const key in this.editForm) {
      this.editForm[key] = item[key];
    }
    this.ownerName = item.ownerName;
    this.editForm["ownerScenceUserId"] = null;
    this.dialogEdit = true;
  }

  changeOwner() {
    /**@description 处理模糊查询的业主 */
    this.editForm["ownerScenceUserId"] = this.ownerName;
  }

  handleEdit(arr) {
    /**@description 处理修改时选择的车位分组信息 */
    this.editForm["carSpaceGroupId"] = [
      ...this.editForm["carSpaceGroupId"]
    ].pop();
  }

  updateStall() {
    /**@description 修改车位 */
    const form = { ...this.editForm };
    for (const key in form) {
      if (form[key] === "") {
        delete form[key];
      }
    }
    this.$refs["updateForm"]["validate"](valid => {
      if (valid) {
        editStall(form).then(() => {
          // this.initData();
          this.editClose();
          this["notify"]("success", "成功", "修改车位成功");
          this["fetchData"](this.initForm);
        });
      }
    });
  }

  editClose() {
    /** @description 关闭修改dialog */
    this.dialogEdit = false;
    for (const key in this.errorMessage) {
      this.errorMessage[key] = "";
    }
    this.$refs.dataTree["highlightStatus"] = true;
    this.$refs["updateForm"]["resetFields"]();
  }

  // 修改备注自动获取焦点
  focusNoteInput(row) {
    this.noteString = row.note;
    row.noteStatus = !row.noteStatus;
    this.$nextTick(() => {
      const input = this.$refs[row.id] as HTMLElement;
      input.focus();
    });
  }

  // 修改备注离开输入框
  noteBlur(row) {
    row.noteStatus = false;
    this.noteString = "";
  }

  // 修改备注
  confirmUpdateNote(row) {
    editStall({
      id: row.id,
      note: this.noteString
    }).then(res => {
      if (res.data.code === 200) {
        this.$message.success("修改成功");
        row.noteStatus = false;
        this.noteString = "";
        this.fetchData(this.initForm);
      } else {
        this.$message.error(res.data.message);
      }
    });
  }

  async handleClick(tab) {
    /**@description 绑定车辆 */
    if (tab.name === "first") {
      this.getOwnerDetail(this.detailDialog);
    } else if (tab.name === "second") {
      // 绑定车牌
    }
  }

  showHouseDetails(row, inviter) {
    /**@description 查看目标车位详情
     * @argument first 查询业主信息
     * @argument second 绑定车牌
     */
    this.activeName = inviter;
    this.dialogFormVisible = true;
    this.detailDialog = Object.assign({}, row);
    this.carIdDisabled =
      this.detailDialog["carSpaceVos"] &&
      this.detailDialog["carSpaceVos"].length === 6
        ? true
        : false;

    if (inviter === "first") {
      this.getOwnerDetail(row);
    } else if (inviter === "second") {
      // 绑定车牌
    }
  }

  async getOwnerDetail(row) {
    /**@description  查询业主信息*/
    const { data } = await getOwnerUser(row.ownerScenceUserId);
    this.ownerDetail = data.data.user;
  }

  async remoteMethodCar(query) {
    /**@description 根据车牌模糊查询车牌号 */
    if (query !== "") {
      this.loading = true;
      setTimeout(() => {
        if (query.length >= 1) {
          this.getCarno(query);
        }
      }, 200);
    } else {
      this.nameList = [];
    }
  }

  getCarno(query) {
    /**@description 获取车牌列表 */
    querycarno({ carNo: query, page: 1, limit: 10 }).then(res => {
      this.carLoading = false;
      this.carnoList = res.data.data.records.map(item => {
        return {
          value: item.ownerPhone,
          name: item.carNo,
          carId: item.id
        };
      });
    });
  }

  bindingcarnumBtn() {
    /**@description 绑定车牌 */
    const form = { ...this.bindingcarnum };
    form["id"] = this.detailDialog["id"];
    addcarno(form).then(res => {
      this["fetchData"](this.initForm);
      this.detailClose();
      this["notify"]("success", "成功", "绑定车牌成功");
    });
  }

  deleteTag(tag) {
    /**@description 删除绑定车牌 */
    const form = { id: this.detailDialog["id"], removeCarIds: [tag.carId] };
    deleteCarno(form).then(res => {
      if (res.data.code === 200) {
        this["fetchData"](this.initForm);
        this.detailClose();
        this["notify"]("success", "成功", "绑定车牌删除成功");
      }
    });
  }

  detailClose() {
    /** @description 关闭详情diolog */
    this.dialogFormVisible = false; //车辆详情dialog
    this.activeName = "first";
    this.bindingcarnum["carId"] = "";
    this.carnoList = [];
  }

  menuVisible() {
    /**@description 控制楼栋 */
    if (this.rowSpan.row1 === 3) {
      this.rowSpan = {
        row1: 0,
        row2: 24
      };
    } else {
      this.rowSpan = {
        row1: 3,
        row2: 21
      };
    }
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

.rightContent {
  flex: 1;
  box-shadow: 0px 6px 5px 0px lightgray;
  position: relative;
}

.menu-control {
  position: absolute;
  top: 32vh;
  left: -10px;
}

.menu-visible {
  position: absolute;
  top: 32vh;
  left: -11px;
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
</style>

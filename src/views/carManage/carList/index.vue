<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <action-header
          ref="actionHeader"
          exportUrl="/admin/usr-car/export/"
          exportName="车辆管理列表.xls"
          :initFormHeader="initForm"
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
              <span class="filter-name">车&nbsp;牌&nbsp;号&nbsp;:</span>
              <el-input
                class="input-filter"
                size="small"
                v-model="filterForm.carNo"
                placeholder="请输入车牌号"
                clearable
                @keyup.enter.native="emitFetchData"
              ></el-input>
            </div>
            <div class="word-filter">
              <span class="filter-name">车主姓名:</span>
              <el-input
                class="input-filter"
                size="small"
                v-model="filterForm.ownerName"
                placeholder="请输入车主姓名"
                clearable
                @keyup.enter.native="emitFetchData"
              ></el-input>
            </div>
            <div class="word-filter">
              <span class="filter-name">车主电话:</span>
              <el-input
                class="input-filter"
                size="small"
                v-model="filterForm.ownerPhone"
                placeholder="请输入车主电话"
                clearable
                @keyup.enter.native="emitFetchData"
                @keyup.native="filterNumber"
                @keydown.native="filterNumber"
              ></el-input>
              <!-- <span>{{phoneNum}}/11</span> -->
            </div>

            <div class="word-filter">
              <span class="filter-name filter-rewrite">车辆状态:</span>
              <el-select
                class="select-class"
                size="small"
                v-model="filterForm.status"
                placeholder="请选择车辆类型"
              >
                <el-option
                  v-for="item in carTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
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
            height="65vh"
            v-loading="showLoading"
            :data="list_data"
            stripe
            highlight-current-row
            @cell-mouse-enter="enterRowChange"
            @cell-mouse-leave="leaveRowChange"
            @selection-change="handleSelectionChange"
          >
            <el-table-column v-if="globalUpdateStatus" type="selection" width="50"></el-table-column>

            <el-table-column type="index" align="center" label="序号" class="indexNum" width="50">
              <template slot-scope="scope">
                <span>{{scope.$index+1}}</span>
                <div v-if="globalUpdateStatus" class="fun-btn">
                  <el-dropdown trigger="click" placement="bottom-start" @command="commandClick">
                    <el-tooltip class="item" effect="dark" content="点击操作" placement="top">
                      <i v-show="scope.row.showMenu" class="iconfont icon-menu"></i>
                    </el-tooltip>
                    <el-dropdown-menu slot="dropdown">
                      <div @click="editType(scope.row)">
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

            <el-table-column prop="carNo" label="车牌号">
              <template slot-scope="scope">
                <el-button
                  @click="showCarDetails(scope.row)"
                  type="text"
                  class="serial-num"
                >{{scope.row.carNo}}</el-button>
              </template>
            </el-table-column>

            <el-table-column prop="ownerName" label="车主" :show-overflow-tooltip="true"></el-table-column>

            <el-table-column prop="ownerPhone" label="电话" :show-overflow-tooltip="true"></el-table-column>

            <el-table-column prop="status" label="状态">
              <template slot-scope="scope">
                <el-dropdown trigger="click">
                  <span class="el-dropdown-link">
                    <el-tag
                      size="small"
                      style="border-radius: 50px;padding: 0 10px; cursor: pointer;"
                      :type="scope.row.status=='1'? 'success' : 'danger'"
                      @click="editStatus(scope.row.id)"
                    >{{ scope.row.status && scope.row.status =='1' ? "正常" : "禁用" }}</el-tag>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <div @click="handleCommand('1')">
                      <el-dropdown-item>正常</el-dropdown-item>
                    </div>
                    <div @click="handleCommand('2')">
                      <el-dropdown-item>禁用</el-dropdown-item>
                    </div>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>

            <el-table-column
              prop="lastInTime"
              label="最近一次访问"
              :show-overflow-tooltip="true"
              min-width="110px"
            ></el-table-column>

            <el-table-column prop="lastInPhoto" label="最近抓拍图片" min-width="110px">
              <template slot-scope="scope">
                <img
                  class="capture-img"
                  @mouseout="imgVisible=false"
                  @mouseover="imgVisible=true,bigImg=scope.row.lastInPhoto"
                  :src="scope.row.lastInPhoto"
                  alt
                />
              </template>
            </el-table-column>

            <el-table-column prop="modal" label="品牌" :show-overflow-tooltip="true"></el-table-column>

            <el-table-column prop="carType" label="车型" :show-overflow-tooltip="true"></el-table-column>

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
                  size="mini"
                  @keyup.enter.native="confirmUpdateNote(row)"
                  @blur="noteBlur(row)"
                  @input="constraintLength(editForm.note,'200')"
                  :maxlength="200"
                  v-model="editForm.note"
                  placeholder="输入备注"
                ></el-input>
              </template>
            </el-table-column>
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

        <!-- <div :class="rowSpan.row1===4 ? menuControl1 : menuControl2" @click="menuVisible">
          <p class="close-menu">
            <i v-if="rowSpan.row1===4" class="iconfont icon-left icon-class"></i>
            <i v-else class="iconfont icon-zuo icon-class"></i>
          </p>
        </div>-->
      </el-col>
    </el-row>
    <!-- 车辆添加 -->
    <el-dialog
      title="添加"
      :visible.sync="dialogCreate"
      width="500px"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dataForm"
        :model="createForm[0]"
        :rules="rules"
        label-position="right"
        label-width="80px"
        style="margin-right:40px;"
      >
        <el-form-item
          prop="ownerPhone"
          label="电话"
          :show-message="showMessage"
          :error="errorMessage.ownerPhone"
        >
          <el-select
            style="width:100%; position: relative;"
            v-model="createForm[0].ownerPhone"
            filterable
            remote
            :remote-method="remoteMethod"
            :loading="loading"
            @change="handleSelectWatchlist"
          >
            <el-option
              v-for="item in phoneList"
              :key="item.scenceUserId"
              :label="item.value"
              :value="item"
            >
              <span style="float: left">{{ item.value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
            </el-option>
          </el-select>
          <!-- <span class="ei-input-hint">{{phoneNum}}/11</span> -->
          <!-- <p>{{createForm[0].ownerUserName}}</p> -->
        </el-form-item>

        <el-form-item label="姓名">
          <el-input :disabled="true" v-model="createForm[0].ownerUserName" placeholder="请输入姓名"></el-input>
        </el-form-item>

        <el-form-item
          label="车牌"
          prop="carNo"
          :show-message="showMessage"
          :error="errorMessage.carNo"
        >
          <el-input v-model="createForm[0].carNo" placeholder="请输入车牌号" clearable></el-input>
        </el-form-item>

        <el-form-item
          label="品牌"
          prop="modal"
          :show-message="showMessage"
          :error="errorMessage.modal"
        >
          <el-input
            v-model="createForm[0].modal"
            placeholder="请输入品牌"
            :maxlength="10"
            clearable
            @input="constraintLength(createForm[0].modal,'10')"
          ></el-input>
        </el-form-item>

        <el-form-item label="车型">
          <el-input
            v-model="createForm[0].carType"
            placeholder="请输入车型"
            :maxlength="10"
            clearable
            @input="constraintLength(createForm[0].carType,'10')"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="备注:"
          prop="note"
          :show-message="showMessage"
          :error="errorMessage.note"
        >
          <el-input
            type="textarea"
            v-model="createForm[0].note"
            :maxlength="200"
            placeholder="输入备注信息"
            @input="constraintLength(createForm[0].note,'200')"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" :disabled="restaurants==[]" @click="createCar">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 车辆修改 -->
    <el-dialog
      :title="editForm.carNo"
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
        <!-- <el-form-item
          label="车牌"
          prop="carNo"
          :show-message="showMessage"
          :error="errorMessage.carNo"
        >
          <el-input
            v-model="editForm.carNo"
            placeholder="请输入车牌"
            :maxlength="7"
            @input="constraintLength(editForm.carNo,'7')"
          ></el-input>
        </el-form-item>-->

        <el-form-item
          label="品牌"
          prop="modal"
          :show-message="showMessage"
          :error="errorMessage.modal"
        >
          <el-input
            v-model="editForm.modal"
            placeholder="请输入品牌"
            :maxlength="10"
            @input="constraintLength(editForm.modal,'10')"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="车型">
          <el-input
            v-model="editForm.carType"
            placeholder="请输入车型"
            :maxlength="10"
            @input="constraintLength(editForm.carType,'10')"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item
          label="备注:"
          prop="note"
          :show-message="showMessage"
          :error="errorMessage.note"
        >
          <el-input
            type="textarea"
            v-model="editForm.note"
            :maxlength="200"
            placeholder="输入备注信息"
            @input="constraintLength(editForm.note,'200')"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="modifCar">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 目标详情 -->
    <el-dialog
      class="dialog-rewrite"
      :title="'车牌: ' + CarDialogForm.carNo ? CarDialogForm.carNo: '未知'"
      :visible.sync="detailDialogVisible"
      :before-close="closeBtn"
    >
      <el-tabs type="card" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="车辆详情" name="first">
          <el-form label-width="130px" :model="CarDialogForm">
            <el-row :gutter="20">
              <el-col :span="12" class="col-line">
                <el-form-item style="margin-bottom:0" label="车辆品牌:">
                  <span>{{CarDialogForm.modal ? CarDialogForm.modal : '--'}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="车辆型号:">
                  <span>{{CarDialogForm.carType ? CarDialogForm.carType :'--'}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="最后一次进时间:">
                  <span>{{CarDialogForm.lastInTime ? CarDialogForm.lastInTime :'--'}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="最后一次进照片:">
                  <img
                    class="capture-img"
                    @mouseout="imgVisible=false"
                    @mouseover="imgVisible=true,bigImg=CarDialogForm.lastInPhoto"
                    :src="CarDialogForm.lastInPhoto"
                    alt
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item style="margin-bottom:0" label="车辆状态:">
                  <span>{{CarDialogForm.status &&CarDialogForm.status=='1' ? '正常' :'禁用'}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="备注信息:">
                  <span>{{CarDialogForm.note ? CarDialogForm.note :'暂无'}}</span>
                </el-form-item>

                <el-form-item style="margin-bottom:0" label="最后一次出时间:">
                  <span>{{CarDialogForm.lastOutTime ? CarDialogForm.lastOutTime :'--'}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="最后一次出照片:">
                  <img
                    class="capture-img"
                    @mouseout="imgVisible=false"
                    @mouseover="imgVisible=true,bigImg=CarDialogForm.lastOutPhoto"
                    :src="CarDialogForm.lastOutPhoto"
                    alt
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="车主信息" name="second">
          <el-form label-width="100px" v-model="carUserDetail">
            <el-row :gutter="20">
              <el-col :span="12" class="col-line">
                <el-form-item style="margin-bottom:0" label="姓名:">
                  <span>{{carUserDetail.name}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="性别:">
                  <span>{{carUserDetail.sex==='0' ? '女' : '男'}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="年龄:">
                  <span>{{carUserDetail.age}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="备注:">
                  <span>{{carUserDetail.note ? carUserDetail.note :'暂无'}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item style="margin-bottom:0" label="电话:">
                  <span>{{carUserDetail.phone}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="身份证:">
                  <span>{{carUserDetail.cardNo}}</span>
                </el-form-item>
                <el-form-item style="margin-bottom:0" label="证件类型:">
                  <span>{{carUserDetail.cardName}}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="通行记录" name="thirdly">
          <el-table v-loading="passTarget" :data="passList" style="width: 100%" stripe>
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <el-table-column align="center" prop="carNo" label="车牌号" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column
              align="center"
              prop="passTime"
              label="通行时间"
              width="150px"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column
              align="center"
              prop="address"
              label="访客通行"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <el-tag
                  size="small"
                  style="border-radius: 50px;"
                  :type="scope.row.isVisitCar? 'success' : 'danger'"
                >{{ scope.row.isVisitCar ? '是' : '否' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="inOut" label="通行类型">
              <template slot-scope="scope">
                <el-tag
                  size="small"
                  style="border-radius: 50px;"
                  :type="scope.row.inOut==='进'? 'success' : 'danger'"
                >{{ scope.row.inOut}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="address" label="抓拍图片">
              <template slot-scope="scope">
                <img :src="scope.row.photos" alt />
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            style="margin:10px 0"
            @current-change="handleCurrentChange"
            :page-size="listQuery.limit"
            :current-page="listQuery.page"
            layout="total, prev, pager, next, slot"
            :total="listQuery.total"
          ></el-pagination>
        </el-tab-pane>
      </el-tabs>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="detailDialogVisible = false">确 定</el-button>
      </span>-->
    </el-dialog>
    <ImageMagni :centerDialogVisible="imgVisible" bigTitle="抓拍图片" :bigImg="bigImg" />
    <!-- uploadUrl="/v1/admin/usr-car/import" -->
    <ExportIn
      :uploadUrl="env === 'production' ? 'http://47.103.184.184/admin/usr-car/import' : '/v1/admin/usrUser/import'"
      downTemplateUrl="/admin/usr-car/exportModel"
      @closeVisible="closeVisible"
      TmplateName="车辆导出模板.xlsx"
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
  queryCarPhone, //根据手机号模糊查询用户
  addCar, //添加
  editCar, //修改
  getTargrtRecord, //获取目标车辆通行记录
  getOwnerUser //获取目标车辆车主信息
} from "@/api/carApi.ts";

const ActionHeader = () => import("@/components/ActionHeader.vue");
const ImageMagni = () => import("@/components/BigImg/index.vue");
const DataTree = () => import("@/components/DataTree.vue");
const ExportIn = () => import("@/components/exportIn/index.vue");

@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    ImageMagni,
    DataTree,
    ExportIn
  }
})
export default class CarList extends Vue {
  filterForm: object = {
    carNo: null,
    ownerPhone: null,
    ownerName: null,
    status: null
  }; //根据关键字查询
  private rowSpan: any = {
    row1: 4,
    row2: 20
  };
  private imgVisible: Boolean = false; // 控制放大图片的visible
  private bigImg: String = ""; // 保存放大图片的地址

  private dialogFormVisible: Boolean = false;
  private formLabelWidth: String = "120px";

  private createForm: Array<Object> = [
    //添加表单字段
    {
      ownerPhone: "", //车主电话
      ownerUserName: "", //车主
      scenceUserId: "", //车主id
      carNo: "", //车牌号
      carType: "", //车型
      // id: "string",
      modal: "", //品牌
      note: "" //备注
    }
  ];

  private rules: Object = {
    // 表单验证
    ownerPhone: [
      { required: true, message: "请输入车主电话", trigger: "blur" }
    ],
    carNo: [{ required: true, message: "请输入车牌号", trigger: "blur" }]
    // modal: [{ required: true, message: "请输入车辆品牌", trigger: "blur" }]
  };
  private showMessage: Boolean = true; //是否显示表单错误信息
  private errorMessage: Object = {
    // 表单错误信息
    ownerPhone: "",
    carNo: ""
  };
  private noteString: String = "";

  private dialogEdit: Boolean = false; // 修改弹出表单
  private editForm: Object = {
    //修改表单字段
    ownerPhone: "", //车主电话
    ownerUserName: "", //车主
    scenceUserId: "", //车主id
    carNo: "", //车牌号
    carType: "", //车型
    id: "",
    modal: "", //品牌
    note: "" //备注
  };

  // private actionUrl: String = "/v1/admin/usr-car/batch-add/";
  //  private myHeaders: Object = { Authorization: store.getters.bearerToken },
  private detailDialogVisible: boolean = false; // 详细信息dialog弹框
  private activeName: string = "first"; //目标车辆详细信息 tab Title
  private nameDisabled: Boolean = false; //模糊查询电话后姓名栏目为不可编辑
  private restaurants: Array<Object> = [];
  private passList: Array<Object> = []; // 车辆名单目标通行记录
  private passTarget: Boolean = true; //目标车辆通行记录的loadding
  private CarDialogForm: Object = {}; // 车辆详细信息
  private carUserDetail: Object = {}; //车主详细信息
  private notifyInstance: any; //防止notify重复多次出现提示
  private noteRewrite: String = ""; //保存未改变的note
  updateArray: Array<string> = ["carNote"];
  private loading: Boolean = false;
  private phoneList: Array<Object> = []; //人员

  visible: boolean = false; // 导入框状态
  dialogTableVisible: boolean = false; // 导出失败状态

  carTypeList: Array<Object> = [
    //车辆类型筛选
    {
      label: "全部",
      value: null
    },
    {
      label: "正常",
      value: "1"
    },
    {
      label: "禁用",
      value: "2"
    }
  ];

  initForm: object = {
    //获取车辆列表url
    url: "/admin/usr-car/",
    method: "get"
  };

  deleteForm: Object = {
    //单个或批量删除
    url: "/admin/usr-car/batch-delete/",
    method: "delete",
    data: []
  };

  private listQuery: Object = {
    // 车辆管理名单目标通行记录翻页
    total: 0,
    limit: 10,
    page: 1
  };

  // 获取需要操作的数据列表
  handleSelectionChange(val) {
    this.deleteForm["data"] = [];
    val.forEach(ele => {
      this.deleteForm["data"].push(ele.id);
    });
  }

  created() {
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

  verification(queryString) {
    /**@description 验证*/
    var regPos = /^\d+(\.\d+)?$/; //非负浮点数
    if (queryString === "") {
      this.errorMessage["ownerPhone"] = "电话不能为空";
    } else if (!regPos.test(queryString)) {
      this.errorMessage["ownerPhone"] = "电话必须是数值";
    } else if (queryString.length > 11) {
      this.errorMessage["ownerPhone"] = "电话号码为11位,请检查是否输入正确";
    } else {
      this.errorMessage["ownerPhone"] = "";
    }
  }
  async remoteMethod(query) {
    /**@description 根据姓名模糊查询人员 */
    console.log(query);
    if (query !== "") {
      this.loading = true;
      setTimeout(() => {
        if (query.length >= 1) {
          this.fetchWatchList(query);
        }
      }, 200);
    } else {
      this.phoneList = [];
    }
  }

  async querySearch(queryString, cb) {
    /**@description 添加时对车主电话进行迷糊查询 */
    this.verification(queryString);
    if (
      queryString === "" ||
      (this.restaurants.length === 1 &&
        queryString !== this.restaurants[0]["value"])
    ) {
      this.createForm[0]["ownerUserName"] = "";
      this.nameDisabled = false;
    }
    if (queryString.length >= 7) {
      // await this.fetchWatchList(queryString);
    }
    // 调用 callback 返回建议列表的数据
    cb(this.restaurants);
    if (this.restaurants.length === 1 && this.restaurants[0]["value"]) {
      if (queryString === this.restaurants[0]["value"]) {
        this.handleSelectWatchlist(this.restaurants[0]);
      }
    }
  }

  async fetchWatchList(name) {
    /**@description 获取 */
    const { data } = await queryCarPhone(name);
    this.loading = false;
    this.phoneList = data.data.map(item => {
      return {
        value: item.phone,
        name: item.name,
        scenceUserId: item.id
      };
    });
  }

  handleSelectWatchlist(item) {
    this.errorMessage["ownerPhone"] = "";
    this.createForm[0]["ownerPhone"] = item.value;
    this.createForm[0]["scenceUserId"] = item.scenceUserId;
    if (item.name) {
      this.createForm[0]["ownerUserName"] = item.name;
      this.nameDisabled = true;
    } else {
      this.createForm[0]["userName"] = null;
      this.nameDisabled = false;
    }
  }

  phoneNumber(e: any) {
    var v = e.target.value;
    e.target.value = v.replace(this["upNum"], "");
    this["phoneNum"] = v.length;
  }

  createCar() {
    /**@description 添加车辆处理 */
    // this.verification(this.createForm[0]["ownerPhone"]);
    // if (
    //   this.errorMessage["ownerPhone"] === "" &&
    //   this.createForm[0]["ownerPhone"].length === 11
    // ) {
    //   if (this.restaurants.length > 0) {
    this.$refs["dataForm"]["validate"](valid => {
      if (valid) {
        var form = [
          {
            ...this.createForm[0]
          }
        ];
        addCar(form).then(res => {
          this.handleClose();
          this["fetchData"](this.initForm);
          this.nameDisabled = false;
          this["notify"]("success", "成功", "添加车辆名单成功");
        });
      }
    });
    //   } else {
    //     this.errorMessage["ownerPhone"] = "电话号码不存在";
    //   }
    // } else if (
    //   this.createForm[0]["ownerPhone"].length !== 0 &&
    //   this.createForm[0]["ownerPhone"].length < 11
    // ) {
    //   this.errorMessage["ownerPhone"] = "电话号码为11位,请检查是否输入正确";
    // }
  }

  editType(item) {
    /**@description 修改状态 */
    for (const key in this.editForm) {
      this.editForm[key] = item[key];
    }
    this.dialogEdit = true;
  }

  editStatus(val) {
    this.editForm["id"] = val;
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
    editCar(form).then(() => {
      this["notify"]("success", "成功", "修改车辆备注成功");
      this["fetchData"](this.initForm);
    });
  }

  handleCommand(val) {
    const form = { status: val, id: this.editForm["id"] };
    editCar(form).then(() => {
      this["notify"]("success", "成功", "修改车辆状态成功");
      this["fetchData"](this.initForm);
    });
  }

  modifCar() {
    /**@description 修改 */
    const form = { ...this.editForm };
    for (let key in form) {
      if (form[key] === "") {
        delete form[key];
      }
    }
    delete form["carNo"];
    editCar(form).then(() => {
      this.handleClose();
      this["fetchData"](this.initForm);
      this["notify"]("success", "成功", "修改车辆成功");
    });
  }

  handleClose() {
    /** @description 关闭添加/修改dialog */
    this["dialogCreate"] = false;
    this.dialogEdit = false; //修改dialog
    this.createForm[0]["carType"] = "";
    this.$refs["dataForm"]["resetFields"]();
  }

  closeBtn() {
    this.activeName = "first";
    this.detailDialogVisible = false; //车辆详情dialog
  }

  showCarDetails(row) {
    this.detailDialogVisible = true;
    this.CarDialogForm = Object.assign({}, row);
  }

  handleCurrentChange(val) {
    /** @description 处理目标车辆通行记录翻页事件
     * @augments val: 页数
     */
    this.listQuery["page"] = val;
    this.fetchPass();
  }

  async handleClick(tab) {
    /**@description 查看车辆管理名单目标详情 */
    if (tab.name === "second") {
      this.fetchUser();
    } else if (tab.name === "thirdly") {
      this.listQuery["page"] = 1;
      this.fetchPass();
    }
  }

  async fetchPass() {
    /**@description 查看车辆管理名单目标通行记录 */
    this.passTarget = true;
    const info = { ...this.listQuery, carId: this.CarDialogForm["id"] };
    const { data } = await getTargrtRecord(info);
    this.passList = data.data.records;
    this.listQuery["total"] = data.data.total;
    this.passTarget = false;
  }

  async fetchUser() {
    /**@description 查看车辆管理名单用户详情 */
    try {
      const { data } = await getOwnerUser(this.CarDialogForm["scenceUserId"]);
      this.carUserDetail = data.data.user;
    } catch (err) {
      console.log(err.response);
    }
  }

  // successFile(response, file, fileList) {
  //   /**@description 导入Excel 成功 */
  //   this.$message({
  //     message: `导入 ${file.name} 成功`,
  //     type: "success"
  //   });
  // }

  // errorFile(err, file, fileList) {
  //   /**@description 导入Excel 失败 */
  //   let errormsg = JSON.parse(err.message);
  //   this.$message.error(`${errormsg.message}`);
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

.demo-block {
  border: 1px solid #ebebeb;
  border-radius: 3px;
}

.serial-num {
  position: relative;
}

.capture-img {
  width: 30px;
  height: 30px;
}
.inputFilter {
  width: 198px !important;
}
</style>

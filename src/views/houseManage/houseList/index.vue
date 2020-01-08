<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <action-header
          exportUrl="/admin/hsHouse/export"
          exportName="房屋.xlsx"
          ref="actionHeader"
          :initFormHeader="initForm"
          @fetchData="fetchData"
          :filterForm="filterForm"
          :dialogCreate.sync="dialogCreate"
          :houseStatus="true"
          :total="page.total"
        >
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="export">导出</el-dropdown-item>
          </el-dropdown-menu>
          <div slot="houseNum">
            <div class="word-filter">
              <span class="filter-name">姓名:</span>
              <el-input clearable
              @keyup.enter.native="emitFetchData"
              class="input-filter" v-model="filterForm.userName" placeholder='输入用户姓名' size="small"></el-input>
            </div>
            <div class="word-filter">
              <span class="filter-name">电话:</span>
              <el-input clearable
              @keyup.enter.native="emitFetchData"
               class="input-filter" v-model="filterForm.phone" placeholder='输入用户电话' size="small"></el-input>
            </div>
            <div class="word-filter">
              <span class="filter-name">证件号码:</span>
              <el-input clearable
              @keyup.enter.native="emitFetchData"
               class="input-filter" v-model="filterForm.cardNo" placeholder='输入用户证件号' size="small"></el-input>
            </div>
            <div class="word-filter">
              <span class="filter-name">房屋编号:</span>
              <el-input clearable
              @keyup.enter.native="emitFetchData"
               class="input-filter" v-model="filterForm.keys" placeholder='输入房屋编号' size="small"></el-input>
            </div>
            <div class="word-filter">
              <span class="filter-name">房屋状态:</span> &nbsp;&nbsp;
              <el-select multiple class="select-class " size="small" v-model="filterForm.status" placeholder="请选择房屋状态筛选">
                <!-- <el-option label="所有" value=""></el-option> -->
                <el-option label="自住" value="1"></el-option>
                <el-option label="出租" value="2"></el-option>
                <!-- <el-option label="待售中" value="3"></el-option>
                <el-option label="待租中" value="4"></el-option>-->
                <el-option label="闲置" value="3"></el-option>
                <!-- <el-option label="其他" value="6"></el-option> -->
              </el-select>
            </div>
          </div>
        </action-header>
      </el-col>
    </el-row>
    <el-row :gutter="10" id='rowCon'>
      <el-col id='leftCon' :span="rowSpan.row1">
        <data-tree
          @fetchData="fetchData"
          :page="page"
          :initFormHeader="initForm"
          @getHouseTreeData="getHouseTreeData"
          :TreeData="TreeData"
        />
      </el-col>

      <el-col id='rightCon' :span="rowSpan.row2" class="table-col">
        <div class="rightContent">
          <el-table
            :data="list_data"
            stripe
            border
            @sort-change="sortChange"
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
                      <el-dropdown-item
                        :command="returnCommand('delete', scope.row)"
                      >{{ deleteForm.data.length ? '批量删除' : '删除' }}</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </template>
            </el-table-column>

            <el-table-column class="serial-num" align="center" prop="name" label="所属楼栋">
              <template slot-scope="scope">
                <span>{{scope.row.groupName}}</span>
              </template>
            </el-table-column>

            <el-table-column
              prop="buildingName"
              :show-overflow-tooltip="true"
              width="120"
              align="center"
              label="所属单元"
            ></el-table-column>

            <el-table-column
              align="center"
              prop="serialNumber"
              width="200px"
              :show-overflow-tooltip="true"
              label="房屋编号"
            >
              <template slot-scope="scope">
                <el-button
                  @click="showHouseDetails(scope.row)"
                  type="text"
                >{{ scope.row.serialNumber }}</el-button>
              </template>
            </el-table-column>

            <el-table-column prop="personCnt" width="120" align="center" label="注册人数"></el-table-column>
            <el-table-column width="120" align="center" prop="type" label="状态">
              <template slot-scope="{row}">
                <span>{{ row.status | status }}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" :show-overflow-tooltip="true" prop="note" label="备注">
              <template slot-scope="scope">
                <span
                  class="rowUpdate"
                  v-show="!scope.row.noteStatus"
                  @click="focusNoteInput(scope.row)"
                >{{ scope.row.note || '--' }}</span>
                <!-- @keyup.enter.native="confirmUpdateNote(scope.row)" -->
                <el-input
                  :ref="scope.row.id"
                  size="mini"
                  @blur="confirmUpdateNote(scope.row)"
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
           <!-- @click="menuVisible" -->

        </div>
      </el-col>
      <div id='tzDiv' :class="rowSpan.row1===3 ? menuControl1 : menuControl2">
            <p class="close-menu">
              <i v-if="rowSpan.row1===3" class="iconfont icon-left icon-class"></i>
              <i v-else class="iconfont icon-zuo icon-class"></i>
            </p>
          </div>
    </el-row>
    <!-- 新建房屋 -->
    <el-dialog
      :close-on-click-modal="false"
      title="添加房屋"
      :visible.sync="dialogCreate"
      width="500px"
      :before-close="handleClose"
    >
      <el-form
        :model="Form"
        :rules="rules"
        ref="Forms"
        label-width="100px"
        label-position="right"
        style="margin-right:40px;"
      >
        <el-form-item label="所属组别:" prop="buildingId">
          <el-cascader
            style="width:100%;"
            v-model="Form.buildingIdArr"
            :options="TreeData"
            :props="{ label: 'name', children: 'sonBuildGroups', value: 'id' }"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="所属楼层:" prop="storeyNum">
          <el-input clearable v-model="Form.storeyNum" placeholder="输入楼层"></el-input>
        </el-form-item>
        <el-form-item label="房屋编号:" prop="serialNumber">
          <el-input clearable v-model="Form.serialNumber" placeholder="输入房屋编号"></el-input>
        </el-form-item>

        <!-- <el-form-item label="状态:"  prop='status'>
          <el-select   size="small" v-model="Form.status" placeholder="请选择">
                <el-option label="自住" value="1"></el-option>
                <el-option label="出租" value="2"></el-option>
                <el-option label="待售中" value="3"></el-option>
                <el-option label="待租中" value="4"></el-option>
                <el-option label="闲置" value="5"></el-option>
                <el-option label="其他" value="6"></el-option>
              </el-select>
        </el-form-item>-->
        <el-form-item label="备注信息:" prop="note">
          <el-input type="textarea" v-model="Form.note" placeholder="输入备注"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="addHouseConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 房屋信息 -->
    <el-dialog
      :close-on-click-modal="false"
      class="dialog-rewrite"
      :title="'编号: '+ detailDialog.serialNumber"
      :visible.sync="dialogFormVisible"
    >
      <el-tabs type="card" v-model="activeName">
        <el-tab-pane label="详细信息" name="详细信息">
          <el-form label-width="130px" :model="detailDialog">
            <el-row :gutter="20">
              <el-col :span="12" class="col-line">
                <el-form-item style="margin-bottom:0" label="所在单元:">
                  <span>{{detailDialog.buildingName ? detailDialog.buildingName : '0'}}</span>
                </el-form-item>

                <el-form-item style="margin-bottom:0" label="所在楼层:">
                  <span>{{detailDialog.storeyNum ? detailDialog.storeyNum : ''}}</span>
                </el-form-item>

                <el-form-item style="margin-bottom:0" label="房屋编号:">
                  <span>{{detailDialog.serialNumber ? detailDialog.serialNumber : ''}}</span>
                </el-form-item>

                <el-form-item style="margin-bottom:0" label="注册时间:">
                  <span>{{detailDialog.createTime && detailDialog.createTime.substr(0, 10)}}</span>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item style="margin-bottom:0" label="注册人数:">
                  <span>{{detailDialog.personCnt ? detailDialog.personCnt : '0'}}人</span>
                </el-form-item>

                <el-form-item style="margin-bottom:0" label="房屋状态:">
                  <span>{{detailDialog.status | status}}</span>
                </el-form-item>

                <!-- <el-form-item style="margin-bottom:0" label="业主电话:">
                  <span>{{detailDialog.phone || ''}}</span>
                </el-form-item> -->

                <el-form-item style="margin-bottom:0" label="备注信息:">
                  <span>{{ detailDialog.note || '' }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="在住人员"  name="在住人员">
          <el-table v-loading="showLoading" stripe :data="dtailTable" style="width: 100%">
            <el-table-column
              align="center"
              width="50"
              :show-overflow-tooltip="true"
              type="index"
              label="序号"
            ></el-table-column>
            <el-table-column
              align="center"
              :show-overflow-tooltip="true"
              prop="userName"
              label="姓名"
            >
            <template slot-scope="{row}">
              <el-button @click='showPersonDetails(row)' type='text'>{{ row.userName }}</el-button>
            </template>
            </el-table-column>
            <el-table-column
              align="center"
              :show-overflow-tooltip="true"
              prop="userPhone"
              label="电话"
            ></el-table-column>
            <el-table-column align="center" width="80" prop="type" label="人员类型">
              <template slot-scope="{row}">
                <span>{{ row.type | type }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column  width="80" align='center' prop="status" label="状态">
              <template slot-scope="{row}">
                <span>{{ row.status | peopleStatus }}</span>
              </template>
            </el-table-column>-->

            <el-table-column
              align="center"
              :show-overflow-tooltip="true"
              prop="createTime"
              label="注册时间"
            ></el-table-column>

            <el-table-column :show-overflow-tooltip="true" align="center" prop="note" label="备注">
              <template slot-scope="{row}">
                <span>{{ row.note ? row.note : '' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              :show-overflow-tooltip="true"
              prop="createTime"
              label="操作"
              :key="Math.random()"
               v-if="globalUpdateStatus"
            >
              <template slot-scope="scope">
                <el-button type="text" @click="deleteHousePeople(scope.row, scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="门禁卡" name="门禁卡">
          <el-table stripe :data="cardList" style="width: 100%">
            <el-table-column
              align="center"
              width="50"
              :show-overflow-tooltip="true"
              type="index"
              label="序号"
            ></el-table-column>
            <el-table-column
              align="center"
              :show-overflow-tooltip="true"
              prop="cardNo"
              label="卡号"
            >
            </el-table-column>
            <el-table-column
              align="center"
              :show-overflow-tooltip="true"
              prop="createTime"
              label="添加时间"
            ></el-table-column>

            <el-table-column
              align="center"
              :show-overflow-tooltip="true"
              prop="validDate"
              label="过期时间"
            ></el-table-column>

            <el-table-column :show-overflow-tooltip="true" align="center" prop="note" label="状态">
              <template slot-scope="{row}">
                <span>{{ row.status === '0' ? "正常" : (row.status === '-2' ? "禁用" : "过期" ) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              :show-overflow-tooltip="true"
              prop="count"
              label="累计刷卡次数"
            ></el-table-column>
            <el-table-column
              align="center"
              :show-overflow-tooltip="true"
              prop="createTime"
              label="操作"
            >
            <template slot-scope="scope">
              <el-button type='text' @click='unbindCard(scope.row, scope.$index)'>
              解绑</el-button>
            </template>

              </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="dialogFormVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 人员详情 -->
    <el-dialog
      :close-on-click-modal="false"
      class="dialog-rewrite"
      :title="PersonDetailDialog.name"
      :visible.sync="personDialogFormVisible"
    >
      <el-tabs type="card" v-model="personActiveName">
        <el-tab-pane label="详细信息" name="first">
          <el-form label-width="130px" :model="PersonDetailDialog">
            <el-row :gutter="20">
              <el-col :span="12" class="col-line">
                <el-form-item style="margin-bottom:0" label="姓名:">
                  <span>{{PersonDetailDialog.userName ? PersonDetailDialog.userName : ''}}</span>
                </el-form-item>

                <el-form-item style="margin-bottom:0" label="性别:">
                  <span>{{ PersonDetailDialog.sex === '1' ? '男' : '女' }}</span>
                </el-form-item>

                <el-form-item style="margin-bottom:0" label="手机号:">
                  <span>{{PersonDetailDialog.userPhone ? PersonDetailDialog.userPhone : ''}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item style="margin-bottom:0" label="证件类型:">
                  <span>{{PersonDetailDialog.cardName || '' }}</span>
                </el-form-item>

                <el-form-item style="margin-bottom:0" label="证件号码:">
                  <span>{{ PersonDetailDialog.cardNo || '' }}</span>
                </el-form-item>

                <el-form-item style="margin-bottom:0" label="备注信息:">
                  <el-input @blur='confirmUpdateUserNote(PersonDetailDialog)' maxlength="200" v-model="PersonDetailDialog.note" placeholder="编辑备注信息(最多输入200字)"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="通行记录" name="second">
          <el-table border stripe :data="personPassTable" style="width: 100%">
            <el-table-column prop="name" align="center" label="姓名" width="150px"></el-table-column>
            <el-table-column prop="passTime" :show-overflow-tooltip="true" align="center" label="通行时间"></el-table-column>
            <el-table-column prop="inOut" align="center" label="出入类型" width="100px"></el-table-column>
            <el-table-column prop="passMethod" align="center" width="150" label="通行方式">
              <template slot-scope="{row}">
                <span>{{ row.passMethod | passMethod  }}</span>
              </template>
            </el-table-column>
            <el-table-column width="100" align="center" label="抓拍图片">
              <template slot-scope="{row}">
                <img v-if='row.photos' :src="row.photos" alt />
                <span v-else></span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @current-change="pagePassChange"
            style="margin-top:10px;"
            background
            layout="prev, pager, next"
            :total="passList.total"
          ></el-pagination>
        </el-tab-pane>
        <el-tab-pane label="车辆信息" name="third">
          <el-table border stripe :data="carDtailTable" style="width: 100%">
            <el-table-column prop="carNo" align="center" label="车牌号"></el-table-column>
            <el-table-column prop="carType" align="center" label="车辆类型"></el-table-column>
            <el-table-column prop="modal" align="center" label="型号"></el-table-column>
            <el-table-column align="center" label="照片">
              <template slot-scope="{row}">
                <img v-if='row.photo' :src="row.photo" alt />
                <span v-else></span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="房屋信息" name="five">
          <el-table border stripe :data="houseDtailTable" style="width: 100%">
            <el-table-column
              align="center"
              :show-overflow-tooltip="true"
              prop="serialNumber"
              label="房屋编号"
            >
            <template slot-scope="{row}">
              <span>{{ row.groupName }} - {{ row.buildingName }} - {{ row. serialNumber}}</span>
              <!-- <el-button @click='showHouseDetail(row)' type='text'>{{ row.groupName }} - {{ row.buildingName }} - {{ row. serialNumber}}</el-button> -->
            </template>
            </el-table-column>

            <el-table-column align="center" label="用户类型">
              <template slot-scope="{row}">{{ row.type | typeFilter }}</template>
            </el-table-column>
            <el-table-column align="center" label="邀请车辆">
              <template slot-scope="{row}">{{ row.enableInviteCar === '1' ? '允许' : '禁止' }}</template>
            </el-table-column>
            <el-table-column align="center" label="邀请访客">
              <template slot-scope="{row}">{{ row.enableInviteVisitor === '1' ? '允许' : '禁止' }}</template>
            </el-table-column>
            <el-table-column align="center" label="远程开门">
              <template slot-scope="{row}">{{ row.enableRemoteOpen === '1' ? '允许' : '禁止' }}</template>
            </el-table-column>

            <el-table-column align="center" :show-overflow-tooltip="true" prop="note" label="备注">
              <template slot-scope="{row}">
                <span>{{row.note}}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              :show-overflow-tooltip="true"
              prop="createTime"
              label="创建时间"
            ></el-table-column>
            <el-table-column
              align="center"
              :show-overflow-tooltip="true"
              prop="createTime"
              label="操作"
              :key="Math.random()"
               v-if="globalUpdateStatus"
            >
              <template slot-scope="scope">
                <el-button type="text" @click="deleteHouse(scope.row, scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="人脸库信息" name="six">
          <el-table :data="faceList" border stripe style="width: 100%">
            <el-table-column align="center" width="50" type="index" label="编号"></el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              align="center"
              prop="devSerialNumber"
              label="设备编号"
            ></el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              align="center"
              prop="devType"
              label="设备区分"
            ></el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              align="center"
              prop="address"
              label="通行位置"
            ></el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              align="center"
              prop="createTime"
              label="注册时间"
            ></el-table-column>
            <el-table-column width="80" align="center" label="人脸图片">
              <template slot-scope="{row}">
                <img v-if='row.face' :src="row.face" alt />
                <span v-else></span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="personDialogFormVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import mixin from "@/config/minxins";
import {
  getHouseTreeData,
  addHouse,
  updateStatusNote,
  getRegisterPeople,
  deleteTheHousePeople,
  getHouseListByUserId,
  getCardListByHouseId,
  deleteDoorCard
} from "@/api/houseApi.ts";
import { getUserPropertyCar } from "@/api/carApi.ts";
import { getUserPropertyPass, getFaceList, updateUserNote } from "@/api/peopleApi.ts";

const ActionHeader = () => import("@/components/ActionHeader.vue");
const DataTree = () => import("@/components/DataTree.vue");

@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    DataTree
  },
  filters: {
    status(val: string) {
      const data = {
        "1": "自住",
        "2": "出租",
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
        "3": "家庭成员"
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
    },
    typeFilter(val: string) {
      const data = {
        "1": "业主",
        "2": "租户",
        "3": "家庭成员"
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
    url: "/admin/hsHouse/list",
    method: "get"
  };
  filterForm: object = {
    keys: '',
    status: [],
    buildingId: '',
    userName: '',
    cardNo: '',
    phone: ''
  }
  deleteForm: object = {
    url: "/admin/hsHouse",
    method: "delete",
    data: [],
    message: `此操作将永久删除选中的房屋,绑定的业主及车牌同时进行删除, 删除后房屋将不存在,请谨慎操作!`
  };
  Form: object = {
    buildingIdArr: [],
    buildingId: "",
    note: "",
    serialNumber: "",
    status: "",
    storeyNum: ""
  };
  rules: any = {
    serialNumber: [
      { required: true, message: "请输入房屋的编号", trigger: "blur" }
    ],
    buildingId: [
      { required: true, message: "请选择房屋所属组别", trigger: "change" }
    ],
    status: [
      { required: true, message: "请选择当前房屋状态", trigger: "change" }
    ],
    storeyNum: [
      {
        required: true,
        trigger: "blur",
        validator: (rule, value, callback) => {
          if (!/^\+?[1-9]\d*$/.test(value)) {
            callback(new Error("填写正确的楼栋层数"));
          } else {
            callback();
          }
        }
      }
    ],
    cardNo: [
      { required: true, message: "请选择当前房屋的组别", trigger: "change" }
    ]
  };
  TreeData: Array<Object> = []; // 树形结构数据
  private menuControl1: String = "menu-control";
  private menuControl2: String = "menu-visible";
  updateArray: Array<string> = ["noteStatus", "houseStatus"];
  noteString: string = ""; // 修改的备注
  private dialogFormVisible: Boolean = false;
  houseId: string = "";
  private detailDialog: Object = {
    //查看目标详情
    name: ""
  };

  private activeName: String = "详细信息";
  private dtailTable: Array<Object> = []; // 当前房屋下的注册人员

  // 住户详情 后期添加的
  personActiveName: string = 'first'
  personDialogFormVisible: boolean = false // 住户详情弹框状态
  PersonDetailDialog: object = {}
  personPassTable:Array<object> = [] // 人员通行记录
  carDtailTable:Array<object> = [] // 车辆信息
  houseDtailTable:Array<object> = [] // 房屋信息
  faceList:Array<object> = [] // 人脸库信息
  passList: object = {
    id: "",
    limit: 10,
    page: 1
  };
  facePage: object = {
    id: ''
  }
  cardList: Array<object> = [] // 门禁卡列表
  ComponentCommand(houseStatus: string, row: object) {
    return {
      ...row,
      houseStatus
    };
  }
  // 查看房屋下的某个住户的详细信息
  showPersonDetails(row) {
    this.personDialogFormVisible = true
    this.PersonDetailDialog = Object.assign({}, row)
    this.passList["id"] = row.userId;
    this.personActiveName = 'first'
    // 获取人员通行记录
    this.pagePassChange(1);
    // 获取物业人员的车辆信息
    getUserPropertyCar(row.userId).then(res => {
      this.carDtailTable = res.data.data;
    });
    this.facePage["userId"] = row.userId;
    // 获取人脸库信息
    this.fetchFaceList();
    // 获取房屋列表信息
    getHouseListByUserId(row.userId).then(res => {
      this.houseDtailTable = res.data.data
    })
  }
  // 获取人脸库列表
  fetchFaceList() {
    getFaceList(this.facePage).then(res => {
      this.faceList = res.data.data.records;
    });
  }
  // 确定修改 备注
  confirmUpdateUserNote() {
    if (!this.PersonDetailDialog["note"]) {
      return this["message"]("error", "请输入备注信息");
    }
    console.log(this.PersonDetailDialog)
    updateUserNote(this.PersonDetailDialog["userId"], this.PersonDetailDialog["note"]).then(
      res => {
        if (res.data.code === 200) {
          this["message"]("success", "修改成功");
          this.noteString = "";
          this.fetchData(this.initForm);
          getRegisterPeople(this.houseId).then(res => {
            this.dtailTable = res.data.data;
          });
        } else {
          this["message"]("error", res.data.message);
        }
      }
    );
  }
  // 获取特定住户的通行记录
  pagePassChange(page: number) {
    this.passList["page"] = page;
    getUserPropertyPass(this.passList).then(res => {
      this.personPassTable = res.data.data.records;
      this.passList["total"] = res.data.data.total;
    });
  }

  // 删除房屋下的某个用户
  deleteHousePeople(row, index) {
    this.$confirm(`此操作将永久删除该房屋下的住户,删除后${row.userName}将不与该房屋绑定,请谨慎操作!?`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        deleteTheHousePeople(this.houseId, row.userId, ' ').then(res => {
          if (res.data.code === 200) {
            this.dtailTable.splice(index, 1)
            this.fetchData(this.initForm)
          }
          // getRegisterPeople(this.houseId).then(res => {
          //   this.dtailTable = res.data.data;
          //   this.fetchData(this.initForm)
          // });
        });
      })
      .catch(() => {
        this['message']('error', '已取消删除')
      });
  }
  // 注册人数排序
  sortChange({ column, prop, order }) {
    this.initForm["params"]["orderColumn"] = prop;
    this.initForm["params"]["asc"] = order !== "ascending";
    this["fetchData"](this.initForm);
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
  // 查看房屋的具体信息
  showHouseDetails(row) {
    this.dialogFormVisible = true;
    this.activeName = "详细信息";
    this.detailDialog = Object.assign(this.detailDialog, row);
    this.houseId = row.id;
    // 获取在住人员
    getRegisterPeople(row.id).then(res => {
      this.dtailTable = res.data.data;
    });
    // 获取门禁卡列表
    getCardListByHouseId(row.id).then(res => {
      this.cardList = res.data.data
    })
  }
  // 解绑门禁卡
  unbindCard(row, index) {
    this.$confirm(`此操作将永久解绑该房屋下的此张门禁卡,解绑后将不与该房屋绑定,请谨慎操作!?`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        deleteDoorCard([row.id]).then(res => {
          this.cardList.splice(index, 1)
        })
      })
      .catch(() => {
        this['message']('error', '已取消删除')
      });
  }
  // 修改管理员状态
  changeStatus(Obj: object) {
    updateStatusNote({
      id: Obj["id"],
      note: Obj["note"],
      status: Obj["houseStatus"]
    }).then(res => {
      if (res.data.code === 200) {
        this['message']('success', '修改成功')
        this["fetchData"](this.initForm);
      }
    });
  }
  // 获取房屋结构
  getHouseTreeData() {
    getHouseTreeData().then((res: Object) => {
      this.TreeData = res["data"]["data"];
      this.rules["buildingId"].push({
        required: true,
        trigger: "change",
        validator: (rule, value, callback) => {
          if (!this.Form["buildingIdArr"].length) {
            callback(new Error("请先创建分组和单元楼"));
          } else {
            callback();
          }
        }
      });
    });
  }
  // 修改备注离开输入框
  noteBlur(row) {
    row.noteStatus = false;
    this.noteString = "";
  }
  // 修改备注
  confirmUpdateNote(row) {

            updateStatusNote({
                  id: row.id,
                  note: this.noteString,
                  status: row.status
                }).then(res => {
                  if (res.data.code === 200) {
                    this['message']('success', '修改成功')
                    row.noteStatus = false;
                    this.noteString = "";
                    this.fetchData(this.initForm);
                  } else {
                    row.noteStatus = false;
                    this['message']('error', res.data.message)
                  }
                });


  }
  // 添加房屋
  addHouseConfirm() {
    this.$refs["Forms"]["validate"](valid => {
      if (valid) {
        this.Form["buildingId"] = [...this.Form["buildingIdArr"]].pop();
        addHouse(this.Form).then(res => {
          if (res.data.code === 200) {
            this['message']('success', '添加成功')
            this["dialogCreate"] = false;
            this["fetchData"](this.initForm);
            this["handleClose"]();
          }
        });
      }
    });
  }
  created() {
    this.getHouseTreeData();
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    ); // 合并参数
  }
  editType(item) {
    /**@description 修改状态 */
    console.log(item);
    // this.dialogFormVisible = true;
  }

  handleChange(arr) {
    this.Form["buildingId"] = [...this.Form["buildingIdArr"]].pop();
  }
  queryIdetity(row) {
    this.detailDialog = row;
    this.dialogFormVisible = true;
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
  left: 210px;
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

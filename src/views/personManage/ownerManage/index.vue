<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <ActionHeader
        exportUrl='/v1/admin/usrUser/export'
        exportName='用户管理.xls'
        :initFormHeader="initForm"
         ref="actionHeader"
          @fetchData="fetchData"
          :filterForm="filterForm"
        :dialogCreate.sync="dialogCreate" :total="page.total">
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <div @click='showExportIn'>
                导入
              </div>
            </el-dropdown-item>
            <el-dropdown-item command='export'>导出</el-dropdown-item>
            <!-- <el-dropdown-item command='exportTemplate'>下载导入模板</el-dropdown-item> -->
            <el-dropdown-item>统计信息</el-dropdown-item>
          </el-dropdown-menu>
          <div slot="houseNum">
            <div class="word-filter">
              <span class="filter-name">房屋编号:</span>
              <el-input clearable
              placeholder="请输入需要查找的房屋编号"
              @keyup.enter.native="emitFetchData" style="width:215px" class="input-filter" v-model="filterForm.houseNo" size="small"></el-input>
            </div>
            <div class="word-filter">
              <span class="filter-name">姓&nbsp;&nbsp;&nbsp;名:</span>
              <el-input  clearable  
              placeholder="请输入需要查找的姓名"
              @keyup.enter.native="emitFetchData" style="width:215px" class="input-filter" v-model="filterForm.name" size="small"></el-input>
            </div>
            <div class="word-filter">
              <span class="filter-name">手机号:</span>
              <el-input clearable  
              placeholder="请输入需要查找的手机号"
              @keyup.enter.native="emitFetchData" style="width:215px" class="input-filter" v-model="filterForm.phone" size="small"></el-input>
            </div>
            <div class="word-filter">
              <span class="filter-name">用户类型:</span>
              <el-select class="input-filter" size="small" v-model="filterForm.type" placeholder="请选择">
                <el-option label="全部" value=""></el-option>
                <el-option label="业主" value="1"></el-option>
                <el-option label="租户" value="2"></el-option>
                <el-option label="成员" value="3"></el-option>
              </el-select>
            </div>

          </div>
        </ActionHeader>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="rightContent">
          <el-table :data="list_data" border
          highlight-current-row
          v-loading='showLoading'
          height="65vh"
          :span-method="objectSpanMethod"
          @selection-change="handleSelectionChange"
            @cell-mouse-enter="enterRowChange"
            @cell-mouse-leave="leaveRowChange">
            <el-table-column type="selection" align="center"></el-table-column>
            <el-table-column type="index" width="60" class="indexNum" align="center" label="编号">
              <template slot-scope="scope">
                <span>{{ scope.row.indexSort + 1 }}</span>
                <div class="fun-btn">
                  <el-dropdown trigger="click" placement="bottom-start" @command='commandClick'>
                    <el-tooltip class="item" effect="dark" content="点击操作" placement="top">
                      <i v-show="scope.row.showMenu" class="iconfont icon-menu"></i>
                    </el-tooltip>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item :command="returnCommand('delete', scope.row)">
                        {{ deleteForm.data.length ? '批量删除' : '删除' }}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip='true' align="center" width="100" class="serial-num" label="姓名">
              <template slot-scope="scope">
                <el-button style="padding:0px;" type="text" @click="showDetail(scope.row, scope.$index)">{{scope.row.name }}</el-button>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip='true' width="120" prop="phone" align="center" label="电话">
              <template slot-scope="{row}">
                <span class="rowUpdate" v-show='!row.phoneStatus'  @click='phoneChange(row)'>{{ row.phone }}</span>
                <el-input v-show='row.phoneStatus' @blur="phoneBlur(row)" :ref='row.id' @keyup.enter.native="confirmUpdatePhone(row)" v-model="phoneString" placeholder="输入电话"></el-input>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip='true' prop="sex" align="center" width="50" label="性别">
              <template slot-scope="{row}">
                <span>{{ row.sex === '1' ? '男' : '女' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="img" align="center" width="60" label="人脸">
              <template slot-scope="scope">
                <img
                  class="capture-img"
                  @mouseout="imgVisible=false"
                  @mouseover="imgVisible=true,bigImg=scope.row.face"
                  :src="scope.row.face"
                  alt
                />
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip='true' width="100" prop="car" align="center" label="访客车辆">
              <!-- <template slot-scope="{row}">
                <span>{{ row.house[0] && row.house[0].enableInviteCar === '1' ? '允许' : '禁止' }}</span>
              </template> -->
              <template slot-scope="{row}">
                <el-dropdown @command="changeStatus"
                trigger="click">
                  <span class="el-dropdown-link">
                    <el-tag
                    size="small"
                    :type="row.house[0] && row.house[0].enableInviteCar === '1' ? 'primary' : 'warning'"
                    style="border-radius: 50px;padding: 0 10px; cursor: pointer;"
                    >{{ row.house[0] && row.house[0].enableInviteCar === '1' ? '允许' : '禁止' }}
                    </el-tag>
                  </span>
                  <el-dropdown-menu  slot="dropdown">
                    <el-dropdown-item :command='ComponentCommand("1", "car", row)'>允许</el-dropdown-item>
                    <el-dropdown-item :command='ComponentCommand("0", "car", row)'>禁止</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip='true' prop="car" width="100" align="center" label="邀请访客">
               <!-- <template slot-scope="{row}">
                <span>{{ row.house[0] && row.house[0].enableInviteVisitor === '1' ? '允许' : '禁止' }}</span>
              </template> -->
              <template slot-scope="{row}">
                <el-dropdown @command="changeStatus"
                trigger="click">
                  <span class="el-dropdown-link">
                    <el-tag
                    size="small"
                    :type="row.house[0] && row.house[0].enableInviteVisitor === '1' ? 'primary' : 'warning'"
                    style="border-radius: 50px;padding: 0 10px; cursor: pointer;"
                    >{{ row.house[0] && row.house[0].enableInviteVisitor === '1' ? '允许' : '禁止' }}
                    </el-tag>
                  </span>
                  <el-dropdown-menu  slot="dropdown">
                    <el-dropdown-item :command='ComponentCommand("1", "vistor", row)'>允许</el-dropdown-item>
                    <el-dropdown-item :command='ComponentCommand("0", "vistor", row)'>禁止</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
            <el-table-column prop="house_info" :show-overflow-tooltip='true' align="center" label="房屋编号">
              <template slot-scope="{row}">
                <span>{{ row.house[0] && row.house[0].buildingName || '--' }}</span>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip='true'  width="100" prop="far_door" align="center" label="远程开门">
              <!-- <template slot-scope="{row}">
                <span>{{ row.house[0] && row.house[0].enableRemoteOpen === '1' ? '允许' : '禁止' }}</span>
              </template> -->
              <template slot-scope="{row}">
                <el-dropdown @command="changeStatus"
                trigger="click">
                  <span class="el-dropdown-link">
                    <el-tag
                    size="small"
                    :type="row.house[0] && row.house[0].enableRemoteOpen === '1' ? 'primary' : 'warning'"
                    style="border-radius: 50px;padding: 0 10px; cursor: pointer;"
                    >{{ row.house[0] && row.house[0].enableRemoteOpen === '1' ? '允许' : '禁止' }}
                    </el-tag>
                  </span>
                  <el-dropdown-menu  slot="dropdown">
                    <el-dropdown-item :command='ComponentCommand("1", "remoteDoor", row)'>允许</el-dropdown-item>
                    <el-dropdown-item :command='ComponentCommand("0", "remoteDoor", row)'>禁止</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip='true'  width="100" prop="far_door" align="center" label="用户类型">
              <template slot-scope="{row}">
                <span>{{ row.house[0] && row.house[0].type | typeFilter }}</span>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip='true' prop="expire_time" align="center" label="过期时间">
              <template slot-scope="{row}">
                <span>{{ row.house[0] && row.house[0].overTime }}</span>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip='true'  width="100" prop="status" align="center" label="状态">
              <template slot-scope="{row}">
                <span>{{  row.house[0] && row.house[0].status | statusFilter}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="detail" :show-overflow-tooltip='true' align="center" label="房屋备注">
              <template slot-scope="{row}">
                <span>{{ row.house[0] && row.house[0].note || '--' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="create_time" :show-overflow-tooltip='true' align="center" label="创建时间">
              <template slot-scope="{row}">
                <span>{{  row.house[0] && row.house[0].createTime }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <el-pagination
         @current-change='pageChange'
         :page-size="page.limit"
        style="margin-top:10px;" background layout="prev, pager, next" :total="page.total"></el-pagination>
      </el-col>
    </el-row>

    <el-dialog :close-on-click-modal='false' class="dialog-rewrite" width="1000px" :title="detailDialog.name" :visible.sync="dialogFormVisible">
      <el-tabs type="card" v-model="activeName">
        <el-tab-pane label="详细信息" name="first">
              <el-row style="line-height:50px;height:50px;padding:10px 30px">
                <el-col :span='8'>姓名: {{ detailDialog.name }}</el-col>
                <el-col :span='8'>性别: {{ detailDialog.sex === '1' ? '男' : '女' }}</el-col>
                <el-col :span='8'>手机号: {{ detailDialog.phone }}</el-col>
                <!-- <el-col :span='12'>注册时间:{{ detailDialog.sex === '1' ? '男' : '女' }}</el-col> -->
                <el-col :span='8'>证件类型: {{ detailDialog.cardName || '--' }}</el-col>
                <el-col :span='8'>证件号码: {{ detailDialog.cardNo || '暂无' }}</el-col>
                <el-col :span='24'>备注:
                  <el-input style="width:600px" type='textarea'></el-input>
                </el-col>
              </el-row>


        </el-tab-pane>
        <el-tab-pane label="通行记录" name="second">
          <el-table :data="dtailTable" style="width: 100%">
            <el-table-column prop="name" align='center' label="姓名" width="150px"></el-table-column>
            <el-table-column prop="passTime" align='center' label="通行时间" width="150px"></el-table-column>
            <el-table-column prop="inOut" align='center' label="进/出" width="150px"></el-table-column>
            <el-table-column prop="passMethod" align='center' label="通行方式"></el-table-column>
            <el-table-column prop="passMethod" align='center' label="抓拍图片">
              <template slot-scope="{row}">
                <img :src="row.photos" alt=""></template>
            </el-table-column>
          </el-table>
           <el-pagination
        @current-change='pagePassChange'
        style="margin-top:10px;" background layout="prev, pager, next" :total="passList.total"></el-pagination>
        </el-tab-pane>
        <el-tab-pane label="车辆信息" name="third">
          <el-table
            :data="carDtailTable"
            style="width: 100%">
            <el-table-column
              prop="carNo"
              align='center'
              label="车牌号">
            </el-table-column>
            <el-table-column
              prop="carType"
              align='center'
              label="车辆类型">
            </el-table-column>
            <el-table-column
              prop="modal"
              align='center'
              label="型号">
            </el-table-column>
            <el-table-column
              align='center'
              label="照片">
              <template slot-scope="{row}">
                <img :src="row.photo" alt="">
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="房屋信息" name="five">
          <el-table :data="houseDtailTable" style="width: 100%">
            <el-table-column align='center' :show-overflow-tooltip='true' prop="serialNumber" label="房屋编号"></el-table-column>
            <el-table-column align='center' :show-overflow-tooltip='true' prop="createTime" label="创建时间"></el-table-column>

            <el-table-column align='center' label="邀请车辆">
              <template slot-scope="{row}">
                {{ row.enableInviteCar === '1' ? '允许' : '禁止' }}
              </template>
            </el-table-column>
            <el-table-column align='center' label="邀请访客">
              <template slot-scope="{row}">
                {{ row.enableInviteVisitor === '1' ? '允许' : '禁止' }}
              </template>
            </el-table-column>
            <el-table-column align='center' label="远程开门">
              <template slot-scope="{row}">
                {{ row.enableRemoteOpen === '1' ? '允许' : '禁止' }}
              </template>
            </el-table-column>
            <el-table-column align='center' :show-overflow-tooltip='true' prop="note" label="备注"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="人脸库信息" name="six">
          <el-table :data="houseDtailTable" style="width: 100%">
            <el-table-column align='center' type='index' label="编号"></el-table-column>
            <el-table-column align='center' prop="serialNumber" label="设备编号"></el-table-column>
            <el-table-column align='center' prop="serialNumber" label="设备区分"></el-table-column>
            <el-table-column align='center' prop="serialNumber" label="通行位置"></el-table-column>
            <el-table-column align='center' prop="createTime" label="注册时间"></el-table-column>
            <el-table-column align='center' prop="note" label="备注"></el-table-column>
            <el-table-column align='center' label="人脸图片">
              <template slot-scope="{row}">
                <img :src="row.photos" alt="">
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :close-on-click-modal='false' title="创建用户" :visible.sync="dialogCreate" width="440px" :before-close="handleClose">
          <el-form :model="Form" :rules="rules" style="margin-right:40px" ref='Forms' label-width="85px">


            <el-form-item label="姓名:"  prop='name'>
              <el-input clearable v-model="Form.name" placeholder='输入姓名'></el-input>
            </el-form-item>
            <el-form-item label="性别:" prop='sex'>
              <el-select style="position: relative;left: -6px;width:275px" class="input-filter" size="small" v-model="Form.sex" placeholder="请选择">
                <el-option label="请选择" value=""></el-option>
                <el-option label="男" value="1"></el-option>
                <el-option label="女" value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item  label="电话:"  prop='phone'>
              <el-input
                class="phone-position"
                v-model="Form.phone"
                placeholder="请输入电话"
                :maxlength="11"
                clearable

                @keyup.native="UpNumber"
                @keydown.native="UpNumber"
                @change="clearableBtn"
                @input="hint"
                @focus="hintFocus"
                @blur="hintBlur"
                @mouseover.native="hint(Form.phone)"
                @mouseout.native="hint(Form.phone)"
              ></el-input>
              <span v-show="hintPhone" class="ei-input-hint">{{phoneNum}}/11</span>
              <!-- <el-input style="width: 280px" v-model.number="Form.phone" @input='constraintLength(Form.phone, "11")' placeholder='输入电话'></el-input> -->
            </el-form-item>
            <!-- <el-form-item class="floatForm" label="身份证号:"  prop='cardName'>
              <el-input v-model="Form.cardName"  placeholder='输入卡名'></el-input>
            </el-form-item> -->
            <el-form-item label="证件类型:"  label-width="85px"  prop='cardName'>
              <el-select style="position: relative;left: -6px;width:275px" class="input-filter" size="small" v-model="Form.cardName" placeholder="请选择证件类型">
                <el-option label="身份证" value="身份证"></el-option>
                <el-option label="护照" value="护照"></el-option>
                <el-option label="港澳居民来往内地通行证" value="港澳居民来往内地通行证"></el-option>
                <el-option label="其它" value="其它"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="Form.cardName === '港澳居民来往内地通行证' ? '通行证' : Form.cardName"  label-width="85px"  prop='cardNo'>
              <el-input  :maxlength="Form.cardName === '身份证' ? '18' : '100'"  clearable  v-model="Form.cardNo" :placeholder='"输入" + Form.cardName + "证件号"'></el-input>
            </el-form-item>
            <el-form-item label="房屋:" style='clear:both'  prop='houseName'>
              <el-autocomplete
               clearable
                v-model="Form.houseName"
                style='width:275px'
                :fetch-suggestions="querySearch"
                placeholder="房屋搜索查找需要关联的房屋"
                @select="handleSelect"
              >
              <template slot-scope="{ item }">
              <div class="value">{{ item.name }}</div>
            </template></el-autocomplete>
            </el-form-item>
            <el-form-item label="已选:"  prop='house'>
              <div v-if='Form.house.length'>
                <div v-for='(item, index) in Form.house' :key='index'>
                  {{item.buildingName}}
                  <el-button type='text' @click='updateAddHouse(index, item)'>编辑</el-button>
                  <el-button type='text' @click='deleteAddHouse(index)'>删除</el-button>
                </div>
              </div>
              <span v-else>通过上面房屋搜索查找需要关联的房屋</span>
            </el-form-item>
            <el-form-item label="备注:"  prop='note'>
              <el-input  type='textarea' v-model="Form.note" placeholder='输入备注'></el-input>
            </el-form-item>
          </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogCreate = false">取 消</el-button>
        <el-button type="primary" @click="addUserConfirm">确 定</el-button>
      </span>
      <!-- 增加房屋时修改房屋 -->
    </el-dialog>
    <el-dialog :close-on-click-modal='false' width="400px" title="修改房屋" :visible.sync="updateHouseVisible">
      <el-form :model="updateHouseForm" label-width="80px">
        <el-form-item label="用户类型" >
          <el-select v-model="updateHouseForm.type" placeholder="请选择">
            <el-option label="业主" value="1"></el-option>
            <el-option label="租户" value="2"></el-option>
            <el-option label="成员" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="房屋状态">
          <el-select v-model="updateHouseForm.status" placeholder="请选择活动区域">
            <el-option label="在住" value="0"></el-option>
            <el-option label="不在住" value="-1"></el-option>
            <el-option label="过期" value="-2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if='updateHouseForm.type !== "1"' label="过期时间">
          <el-date-picker
            format='yyyy-MM-dd HH:mm:ss'
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="updateHouseForm.overTime"
            type="datetime"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="邀请访客">
          <el-switch
            v-model="updateHouseForm.enableInviteVisitor"
            active-text="允许"
            active-value="1"
            active-color="#13ce66"
            inactive-color="#ff4949"
            inactive-value="0"
            inactive-text="禁止">
          </el-switch>
        </el-form-item>
        <el-form-item label="邀请车辆">
          <el-switch
            v-model="updateHouseForm.enableInviteCar"
            active-value="1"
            inactive-value="0"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="允许"
            inactive-text="禁止">
          </el-switch>
        </el-form-item>
        <el-form-item label="远程开门">
          <el-switch
            v-model="updateHouseForm.enableRemoteOpen"
            active-value="1"
            inactive-value="0"
            active-text="允许"
            active-color="#13ce66"
            inactive-color="#ff4949"
            inactive-text="禁止">
          </el-switch>
        </el-form-item>
        <el-form-item label="备注:"  prop='note'>
              <el-input type='textarea' v-model="updateHouseForm.note" placeholder='输入备注'></el-input>
            </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateHouseVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmHouse">确 定</el-button>
      </div>
    </el-dialog>
    <BigImg :centerDialogVisible="imgVisible" bigTitle="抓拍图片" :bigImg="bigImg" />
    <ExportIn
    uploadUrl='/v1/admin/usrUser/import'
    downTemplateUrl='/v1/admin/uploadFile/exportModel'
    @closeVisible='closeVisible'
    @successUpload='fetchData(initForm)'
    :visible.sync='visible' />
  </div>
</template>
<script lang="ts">
declare function require(string): string
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import { addPeople,
  updateUserPhone,
  updateUserNote,
  updateRoleHouse } from '@/api/peopleApi.ts'
import _axios from '@/plugins/axios.js'
import mixin from "@/config/minxins";
import { searchSuggestHouse } from '@/api/houseApi.ts'
import { getUserPropertyPass, getPersonFace } from '@/api/peopleApi.ts'
import { getUserPropertyCar } from '@/api/carApi.ts'
const ActionHeader = () => import("@/components/ActionHeader.vue");
const DiaLog = () => import("@/components/dialog.vue");
const BigImg = () => import("@/components/BigImg/index.vue");
const ExportIn = () => import("@/components/exportIn/index.vue");
@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    DiaLog,
    BigImg,
    ExportIn
  },
  filters: {
    statusFilter(val: string){
      const data = {
        "0": '在住',
        "-1": '不在住',
        "-2": '过期'
      }
      return data[val]
    },
    typeFilter(val: string) {
      const data = {
        "1": '业主',
        "2": '租户',
        "3": '成员'
      }
      return data[val]
    }
  }
})
export default class OwnerManage extends Vue {
  private activeName: string = "first";
  private dialogFormVisible: boolean = false;
  UserType: string = "owner";
  spanArray:Array<number> = [] // 合并单元格
  index: number = 0 // 合并单元格参数
  private detailDialog: Object = {}
  phoneString:string = '' // 需要改成的电话
  noteString: string = '' // 需要改成的备注
  houseIndex: number = 0 // 合并单元格用
  updateHouseVisible: boolean = false // 修改房屋弹框
  data: Array<object> =  [] // 未分单元格人员数据
  personImg: string = require("@/assets/defaultPerson.png") // 人员头像
  Form: any = {
    name: '',
    cardName: '身份证',
    cardNo: '',
    sex: '',
    phone: '',
    house: [],
    note: '',
    houseName: ''
  }
  updateHouseForm: object = {} // 增加用户时修改房屋的属性
  initForm: object = {
    url: '/admin/usrUser/list',
    method: 'get'
  }
  filterForm: object = {
    name: '',
    phone: '',
    houseNo: '',
    type: ''
  }
  deleteForm: object = {
    url: '/admin/usrUser',
    method: 'delete',
    data: []
  }
  visible: boolean = false // 批量导入状态
  updateArray: Array<string> = ['noteStatus', 'phoneStatus']
  rules: any = {
    name: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ],
    sex: [
            { required: true, message: '请选择性别', trigger: 'change' }
          ],
    cardName: [
      { required: true, message: '请选择证件', trigger: 'change' }
    ],
    phone: [
            { required: true, validator: (rule, value, callback) => {
                if (!this['is_Phone'](value)) {
                  callback(new Error('填写正确的手机号'))
                } else {
                  callback()
                }
              }, trigger: 'blur' }
          ],
    cardNo: [
            { required: true, trigger: 'blur', validator: (rule, value, callback) => {
                if (value.length < 15 || value.length > 15 && value.length < 18) {
                  callback(new Error('填写正确的身份证号'))
                } else {
                  callback()
                }
              } }
          ],
    house: [
      { required: true, validator: (rule, value, callback) => {
                if (!value.length) {
                  callback(new Error('请添加房屋'))
                } else {
                  callback()
                }
              }, trigger: 'change' }
    ]
  }
  private imgVisible: Boolean = false; // 控制放大图片的visible
  private bigImg: String = ""; // 保存放大图片的地址
  passList: object = {
    id: '',
    limit: 10,
    page: 1
  }
  private dtailTable: Array<Object> = [
    {
      date: "2016-05-02",
      name: "王小虎",
      address: "上海市普陀区金沙江路 1518 弄"
    }
  ];
  private carDtailTable: Array<Object> =[];
  private houseDtailTable: Array<Object> =[];
  created() {
    this.initForm['params'] = Object.assign(this.initForm['params'], this.page, this.filterForm) // 合并参数
  }
  closeVisible(flag: boolean) {
    this.visible = flag
  }
  showExportIn() {
    this.visible = true
  }
  // 修改手机号
  phoneChange(row) {
    this.phoneString = row.phone
    this['list_data'].forEach(el => {
      this.$set(el, 'phoneStatus', false)
    })
    row.phoneStatus = !row.phoneStatus
    this.$nextTick(() => {
      const input = this.$refs[row.id] as HTMLElement
      input.focus()
    })
  }
    ComponentCommand(Status: string, type:string, row: object) {
    return {
      ...row,
      type,
      Status
    }
  }
  // 修改远程开门，邀请访客，邀请车辆
  changeStatus(Obj: Object) {
    console.log(Obj)
    let data:object = {
      id: Obj['house'][0]['id']
    }
    switch (Obj['type']) {
      case 'car':
        data['enableInviteCar'] = Obj['Status']
        break
      case 'vistor':
        data['enableInviteVisitor'] = Obj['Status']
        break
      case 'remoteDoor':
        data['enableRemoteOpen'] = Obj['Status']
        break
    }
    updateRoleHouse(data).then(res => {
      if (res.data.code === 200) {
        this.$message.success('设置成功')
        this.fetchData(this.initForm)
      }
    })
  }
// 确定添加用户
  addUserConfirm() {
    this.$refs['Forms']['validate']((valid) => {
      if(valid) {
        if (!this.Form['house'].length) {
          this.$message.error('未选择房屋')
          return
        }
        addPeople(this.Form).then(res => {
          if(res.data.code === 200) {
            this.$message.success('添加成功')
            this['dialogCreate'] = false
            this.fetchData(this.initForm)
          }
        })
      }
    })

  }
  // 修改电话离开输入框
  phoneBlur(row) {
    row.phoneStatus = false
    this.phoneString = ''
  }
  // 修改备注离开输入框
  noteBlur(row) {
    row.noteStatus = false
    this.noteString = ''
  }
  // 确定修改 电话
  confirmUpdatePhone(row) {
    if(!(/^1[3456789]\d{9}$/.test(this.phoneString))){
      this.$message.error('请输入正确的手机格式');
      return
    }
    updateUserPhone(row.id, this.phoneString).then(res => {
      if (res.data.code === 200) {
        this.$message.success('修改成功')
        row.phoneStatus = false
        this.phoneString = ''
        this.fetchData(this.initForm)
      } else {
        this.$message.error(res.data.message)
      }
    })
  }
  // 确定修改 备注
  confirmUpdateNote(row) {
    updateUserNote(row.id, this.noteString).then(res => {
      if (res.data.code === 200) {
        this.$message.success('修改成功')
        row.noteStatus = false
        this.noteString = ''
        this.fetchData(this.initForm)
      } else {
        this.$message.error(res.data.message)
      }
    })
  }
  // 打开修改房屋的状态
  updateAddHouse(index, item) {
    this.houseIndex = index
    this.updateHouseVisible = true
    this.updateHouseForm = Object.assign({}, item)
  }
  // 将重新定义的数据 换到 house字段去
  confirmHouse() {
    if (this.updateHouseForm['type'] !== '1') {
      if (this.updateHouseForm['overTime'] === '' || this.updateHouseForm['overTime'] === null) {
        this.$message.error('租客和成员需要添加过期时间!')
        return
      }
    }
    this.Form['house'][this.houseIndex] = Object.assign({}, this.updateHouseForm)
    this.updateHouseVisible = false
    this.updateHouseForm = {}
  }
  // 重写fetchdata函数
  fetchData(option: object) {
    this['list_data'] = []
    for (let key in option['params']) {
      if (option['params'][key] === '') {
        option['params'][key] = null
      }
    }
    this['showLoading'] = true;
    _axios(option).then((res: any) => {
      if (res.data && res.data.data) {
        this.page['total'] = res.data.data.total
        this.data = res.data.data.records
        res.data.data.records.forEach((ele: object) => {
           let singleObj = {}
          if (ele['house'].length > 1) {
            ele['house'].forEach(item => {
              singleObj = Object.assign({}, ele)
              singleObj['house'] = []
              this.$set(singleObj, 'showMenu', false)
              singleObj['house'].push(item)
              this['list_data'].push(singleObj)
            })
          } else {
            this.$set(ele, 'showMenu', false)
             this['list_data'].push(ele)
          }
        })
        this['list_data'].forEach((ele, index) => {
          this['updateArray'].forEach((itemStatus: string) => {
            ele[itemStatus] = false
            if (index === 0) {
              ele['indexSort'] = 0
            } else {
              if (ele['id'] === this['list_data'][index - 1]['id']) {
                ele['indexSort'] = this['list_data'][index - 1]['indexSort']
              } else {
                ele['indexSort'] = this['list_data'][index - 1]['indexSort'] + 1
              }
            }
          })
        })
        console.log(this['list_data'])
        // this['list_data'] = res.data.data.records
        this['showLoading'] = false
        this.spanArray = []
        this.index = 0
        this['list_data'].forEach((item, index) => {
         item.index = index
         if(index === 0) {
          this.spanArray.push(1)
         } else {
           if (item.id === this['list_data'][index - 1].id) {
             this.spanArray[this.index] += 1
             this.spanArray.push(0)
           } else {
             this.index = index
             this.spanArray.push(1)
           }
         }
       })
      }
    })
  }
  // 添加房屋时删除房屋
  deleteAddHouse(index) {
    this.Form.house.splice(index, 1)
  }
  // 选择搜索建议列表某项 并赋值
  handleSelect(val: object) {
    let Obj = {
      buildingName: '',
      type: '1',
      status: '0',
      overTime: null,
      note: '',
      houseId: '',
      enableRemoteOpen: '1',
      enableInviteCar: "0",
      enableInviteVisitor: "0",
    }
    Obj.houseId = val['id']
    Obj.buildingName = val['name']
    this.Form.house.push(Obj)
    // console.log(Obj)
  }
  // 房屋搜索建议
  querySearch(string: string, cb) {
    let result = []
    searchSuggestHouse(string).then(res => {
      if (res.data.data) {
        result = res.data.data
        result.splice(10)
        cb(result)
      }
    })
  }
  // 合并单元格
  objectSpanMethod({row, column, rowIndex, columnIndex}) {
      if(columnIndex === 0 || columnIndex === 1
       || columnIndex === 2 || columnIndex === 3
       || columnIndex === 4 || columnIndex === 5) {
        const _row_1 = this.spanArray[rowIndex];
        const _col_1 = _row_1 > 0 ? 1 : 0; //如果被合并了_row=0则它这个列需要取消
        return {
          rowspan: _row_1,
          colspan: _col_1
        }
      }
  }
  /*** row 列表数据 查看详情*/
  showDetail(row, index) {
    this.activeName = 'first'
    this.passList['id'] = row.id
    this.dialogFormVisible = true;
    this.detailDialog = Object.assign(this.detailDialog, this['list_data'][index]);
    this.houseDtailTable = []
    this.pagePassChange(1)
    // 获取物业人员的车辆信息
    getUserPropertyCar(row.id).then(res => {
      this.carDtailTable = res.data.data
    })
    // 获取人脸库信息
    if(row.face) {
      getPersonFace(row.face).then(res => {
        this.personImg = res.data.data
      })
    } else {
      this.personImg = require("@/assets/defaultPerson.png")
    }
  }

  // 获取特定用户的通行记录
  pagePassChange(page: number) {
    this.passList['page'] = page
    getUserPropertyPass(this.passList).then(res => {
      this.dtailTable = res.data.data.records
      this.passList['total'] = res.data.data.total
    })
  }
}
</script>

<style lang="scss" scoped>
.mainAddContain{
  width: 100%;
  height: 200px;
  display: flex;
  .pic{
    width: 140px;;
    height: 140px;
    flex: none;
    overflow: hidden;
    border: 1px dotted gray;
    font-size: 48px;
    text-align: center;
    line-height: 140px;
    border-radius: 10px;
  }
  .form{
    flex: 1;
  }
}
  .floatForm{
    width: 50%;
    float: left;
    position: relative;
    z-index: 999;
  }
</style>

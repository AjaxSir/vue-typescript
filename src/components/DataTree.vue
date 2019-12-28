<!--
  数据页面对应左边的树形结构
  TreeData: 传入的数据
-->
<template>
  <div class="content tree-rename">
    <div
      @click="handleNodeClick({ type: 'building', id: '' })"
      :class="['treeHeader', highlightStatus ? '' : 'highlight']"
    >
      <i class="iconfont icon-shuji"></i>
      所有
      <el-dropdown
        v-if="type === 'house' && UpdateStatus"
        class="dropdownAll"
        @command="commandTreeClick"
        placement="bottom-start"
      >
        <i class="iconfont icon-menu"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :command="commandObj('addGroup', {})">添加子分组</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown
        v-else-if="type === 'role' && UpdateStatus"
        class="dropdownAll"
        @command="commandTreeClick"
        placement="bottom-start"
      >
        <i class="iconfont icon-menu"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :command="commandObj('addRoleGroup', {})">创建权限组</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-tree
      :data="TreeData"
      node-key="id"
      :props="dataFormate"
      accordion

      :highlight-current="highlightStatus"
      :default-expand-all="false"
      :expand-on-click-node="false"
      @node-click="handleNodeClick"
    >
      <span
        slot-scope="{ node }"
        @mouseenter="MouseNnter(node.id)"
        @mouseleave="MouseLeave(node.id)"
        :class="[ 'custom-tree-node']"
      >
        <span>
          {{ node.label }}
          <!-- <i v-show='selectId === node.data.id' class="el-icon-check"></i> -->
        </span>
        <div style="position:relative">
          <el-dropdown v-if="UpdateStatus" @command="commandTreeClick" placement="bottom-start">
            <i v-show="node.id===showMenu" class="iconfont icon-menu"></i>

            <el-dropdown-menu v-if="type === 'house'" slot="dropdown">
              <el-dropdown-item
                v-if="node.data.type === 'group'"
                :command="commandObj('addGroup', node)"
              >添加子分组</el-dropdown-item>
              <el-dropdown-item
                v-if="node.data.type === 'group'"
                :command="commandObj('addBuilding', node)"
              >添加单元楼</el-dropdown-item>
              <el-dropdown-item
                v-if="node.data.type === 'group'"
                :command="commandObj('updateGroup', node)"
              >修改分组</el-dropdown-item>
              <el-dropdown-item
                v-if="node.data.type === 'group'"
                :command="commandObj('deleteGroup', node)"
              >删除分组</el-dropdown-item>
              <el-dropdown-item
                v-if="node.data.type === 'building'"
                :command="commandObj('updateBuilding', node)"
              >修改单元楼</el-dropdown-item>
              <el-dropdown-item
                v-if="node.data.type === 'building'"
                :command="commandObj('deleteBuilding', node)"
              >删除单元楼</el-dropdown-item>
            </el-dropdown-menu>
            <el-dropdown-menu v-if="type === 'role'" slot="dropdown">
              <el-dropdown-item :command="commandObj('updateRoleGroup', node)">修改</el-dropdown-item>
              <el-dropdown-item :command="commandObj('deleteRoleGroup', node)">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </span>
    </el-tree>
    <!-- 楼栋dialog添加分组 -->
    <el-dialog
      :before-close="closeDialog"
      :close-on-click-modal="false"
      width="500px"
      class="formDialog"
      :title="HouseForm.title"
      :visible.sync="HouseVisible"
    >
      <el-tabs v-if="nodeAction !== 'updateGroup'" v-model="activeName" type="card">
        <el-tab-pane label="批量添加" name="first">
          <el-form
            ref="batchForm"
            :rules="batchRules"
            :model="batchForm"
            label-width="100px"
            label-position="right"
            style="margin:20px 40px 0 0;"
          >
            <el-form-item prop="min" label="编号:">
              <el-input
                clearable
                maxlength="4"
                @keyup.native="UpNumber"
                @keydown.native="UpNumber"
                @change="clearableBtn"
                @input="hint"
                @focus="hintFocus"
                @blur="hintBlur"
                @mouseover.native="hint(batchForm.min)"
                @mouseout.native="hint(batchForm.min)"
                style="width:140px"
                placeholder="开始编号"
                v-model="batchForm.min"
              ></el-input>&nbsp;&nbsp;至&nbsp;&nbsp;
              <el-input
                clearable
                placeholder="结束编号"
                style="width:140px"
                @keyup.native="UpNumber"
                @keydown.native="UpNumber"
                @change="clearableBtn"
                @input="hint"
                maxlength="4"
                @focus="hintFocus"
                @blur="hintBlur"
                @mouseover.native="hint(batchForm.max)"
                @mouseout.native="hint(batchForm.max)"
                v-model="batchForm.max"
              ></el-input>
            </el-form-item>
            <el-form-item label="序号单位:" prop="serialNumberUnit">
              <el-select style="width:212px" v-model="batchForm.serialNumberUnit" placeholder="请选择">
                <el-option
                  v-for="item in Tags"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
              <el-button @click="showUnitSetting = !showUnitSetting">单位设置</el-button>
              <div v-if="showUnitSetting">
                <el-tag
                  style="margin-left:5px"
                  :key="index"
                  v-for="(tag, index) in Tags"
                  closable
                  :disable-transitions="false"
                  @close="deleteTag(tag, 'group')"
                >{{tag.name}}</el-tag>
                <el-input
                  maxlength="10"
                  @input="constraintLength(newTagValue)"
                  class="input-new-tag"
                  v-if="newTag"
                  v-model="newTagValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm('group')"
                  @blur="handleInputConfirm('group')"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">添加单位</el-button>
              </div>
            </el-form-item>
            <el-form-item label="备注信息:" prop="note">
              <el-input
                maxlength="200"
                placeholder="填写分组的备注信息"
                type="textarea"
                v-model="batchForm.note"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="手动添加" name="second">
          <el-form
            ref="HouseForm"
            :rules="HouseRules"
            :model="HouseForm"
            label-width="90px"
            label-position="right"
            style="margin:20px 40px 0 0;"
          >
            <!-- <el-form-item label="序号:" prop='serialNumber' >
          <el-input clearable @input='autoName'  placeholder="填写分组的序号" style="width:240px" v-model="HouseForm.serialNumber" autocomplete="off"></el-input>
            </el-form-item>-->
            <!-- <el-form-item label="单位:" prop='serialNumberUnit' >
          <el-select @change='autoName' style="width:110px" v-model="HouseForm.serialNumberUnit" placeholder="请选择">
            <el-option
              v-for="item in Tags"
              :key="item.name"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
          <el-button @click='showUnitSetting = !showUnitSetting'>单元设置</el-button>
            <div v-if='showUnitSetting'>
              <el-tag
              style="margin-left:5px"
                :key="index"
                v-for="(tag, index) in Tags"
                closable
                :disable-transitions="false"
                @close="deleteTag(tag, 'group')">
                {{tag.name}}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="newTag"
                v-model="newTagValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm('group')"
                @blur="handleInputConfirm('group')"
              >
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">添加单位</el-button>
            </div>
            </el-form-item>-->
            <el-form-item label="别名:" prop="name">
              <el-input
                clearable
                maxlength="10"
                placeholder="填写分组的别名"
                v-model="HouseForm.name"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="备注:" prop="note" >
              <el-input
                maxlength="200"
                placeholder="填写分组的备注信息"
                type="textarea"
                v-model="HouseForm.note"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <el-form
        v-else
        ref="HouseForms"
        :rules="HouseRules"
        :model="HouseForm"
        label-width="100px"
        label-position="right"
        style="margin:20px 40px 0 0;"
      >
        <!-- <el-form-item label="序号:" prop='serialNumber' >
          <el-input clearable @input='autoName'  placeholder="填写分组的序号" style="width:240px" v-model="HouseForm.serialNumber" autocomplete="off"></el-input>
        </el-form-item>-->
        <!-- <el-form-item label="单位:" prop='serialNumberUnit' >
          <el-select @change='autoName' style="width:110px" v-model="HouseForm.serialNumberUnit" placeholder="请选择">
            <el-option
              v-for="item in Tags"
              :key="item.name"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
          <el-button @click='showUnitSetting = !showUnitSetting'>分组单元设置</el-button>
            <div v-if='showUnitSetting'>
              <el-tag
              style="margin-left:5px"
                :key="index"
                v-for="(tag, index) in Tags"
                closable
                :disable-transitions="false"
                @close="deleteTag(tag, 'group')">
                {{tag.name}}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="newTag"
                v-model="newTagValue"
                ref="saveTagInput"
                size="small"
                 clearable
                @keyup.enter.native="handleInputConfirm('group')"
                @blur="handleInputConfirm('group')"
              >
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">添加单位</el-button>
            </div>
        </el-form-item>-->
        <el-form-item label="别名:" prop="name">
          <el-input
            clearable
            maxlength="10"
            placeholder="填写分组的别名"
            v-model="HouseForm.name"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注:" prop="note">
          <el-input
            placeholder="填写分组的备注信息"
            maxlength="200"
            type="textarea"
            v-model="HouseForm.note"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="GroupAction">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 楼栋dialog添加单元楼 -->
    <el-dialog
      :before-close="closeDialog"
      :close-on-click-modal="false"
      width="500px"
      class="formDialog"
      :title="UnitForm.id ? '修改单元楼' : '添加单元楼'"
      :visible.sync="HouseUnitVisible"
    >
      <el-form
        ref="buildings"
        :rules="unitRules"
        :model="UnitForm"
        label-width="100px"
        label-position="right"
        style="margin:20px 40px 0 0;"
      >
        <el-form-item label="名称:" prop="name" >
          <el-input
            placeholder="填写单元名称"
            clearable
            v-model="UnitForm.name"
            autocomplete="off"
          ></el-input>
          <!-- <el-input style='width:50px' v-model="UnitForm.max" autocomplete="off"></el-input> -->
        </el-form-item>
        <!-- <el-form-item v-if='!this.UnitForm.id' label="序号:" prop='serialNumber' >
        <el-input clearable style="width:280px" v-model="UnitForm.serialNumber" autocomplete="off"></el-input>-->
        <!-- <el-input style='width:50px' v-model="UnitForm.max" autocomplete="off"></el-input> -->
        <!-- </el-form-item> -->
        <!-- <el-form-item v-if='!this.UnitForm.id' label="序号单位:" prop='serialNumberUnit' >
          <el-select style="width:140px" v-model="UnitForm.serialNumberUnit" placeholder="请选择">
            <el-option
              v-for="item in UnitTags"
              :key="item.name"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
          <el-button @click='showUnitSetting = !showUnitSetting'>单位设置</el-button>
            <div v-if='showUnitSetting'>
              <el-tag
              style="margin-left:5px"
                :key="index"
                v-for="(tag, index) in UnitTags"
                closable
                :disable-transitions="false"
                @close="deleteTag(tag, 'build')">
                {{tag.name}}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="newTag"
                v-model="newTagValue"
                ref="saveTagInput"
                size="small"
                 clearable
                @blur="handleInputConfirm('build')"
              >
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">添加单位</el-button>
            </div>
        </el-form-item>-->
        <el-form-item label="楼层数:" prop="storeyNum" >
          <el-input
            clearable
            @keyup.native="UpNumber"
            @keydown.native="UpNumber"
            @change="clearableBtn"
            @input="hint"
            @focus="hintFocus"
            @blur="hintBlur"
            placeholder="填写楼层数"
            @mouseover.native="hint(UnitForm.storeyNum)"
            @mouseout.native="hint(UnitForm.storeyNum)"
            v-model="UnitForm.storeyNum"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="每层户数:" prop="houseNum" >
          <el-input
            clearable
            placeholder="填写每层户数"
            @keyup.native="UpNumber"
            @keydown.native="UpNumber"
            @change="clearableBtn"
            @input="hint"
            @focus="hintFocus"
            @blur="hintBlur"
            @mouseover.native="hint(UnitForm.houseNum)"
            @mouseout.native="hint(UnitForm.houseNum)"
            v-model="UnitForm.houseNum"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="addUpdateUnitConfim">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 权限dialog -->
    <el-dialog
      :before-close="roleHandClose"
      :close-on-click-modal="false"
      width="800px"
      :title="RoleForm.id ? '修改权限组' : '新建权限组'"
      :visible.sync="RoleVisible"
    >
      <el-form :rules="RoleRules" style="overflow:hidden" ref="roleForm" :model="RoleForm">
        <el-form-item prop="name" label="权限名称:" >
          <el-input
            placeholder="填写权限名称"
            clearable
            maxlength="10"
            v-model="RoleForm.name"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="enableInviteCar"
          style="float:left;width:350px"
          label="邀请车辆:"

        >
          <el-switch
            v-model="RoleForm.enableInviteCar"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="1"
            inactive-value="0"
          ></el-switch>
        </el-form-item>
        <el-form-item
          prop="enableInviteVisitor"
          style="float:left;width:350px"
          label="邀请访客:"

        >
          <el-switch
            v-model="RoleForm.enableInviteVisitor"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="1"
            inactive-value="0"
          ></el-switch>
        </el-form-item>
      </el-form>
      <div class="bindDevice">
        <span style="float:left">设备权限</span>
        <el-button
          style="float:right"
          type="primary"
          @click="bindDeviceListVisible = true, fetchDeviceList(1)"
        >绑定设备</el-button>
      </div>
      <el-table :data="bindDeviceList" style="width: 100%">
        <el-table-column type="index" align="center" prop="date" label="序号" width="50"></el-table-column>
        <el-table-column align="center" label="位置">
          <template slot-scope="{row}">
            <span>{{row.address || row.position}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="350" label="时间">
          <template slot-scope="{row}">
            <span
              v-if="!row.timeStatus"
              class="rowUpdate"
              @click="timeUpdateStatus(row)"
            >{{row.startTime}}-{{row.endTime}}</span>
            <div v-else>
              <el-time-select
                :clearable="false"
                style="width:120px"
                v-model="startTime"
                :picker-options="{
                  start: '00:30',
                  step: '00:30',
                  end: '23:30'
                }"
                @blur="confirmEndTime(row)"
                placeholder="开始时间"
              ></el-time-select>-
              <el-time-select
                :clearable="false"
                style="width:120px"
                v-model="endTime"
                @change="confirmEndTime(row)"
                :picker-options="{
                  start: startTime,
                  step: '00:30',
                  end: '23:30'
                }"
                placeholder="结束时间"
              ></el-time-select>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="bildDeviceSplice(scope.$index)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleHandClose">取 消</el-button>
        <el-button type="primary" @click="RoleAddConfim">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 设备列表 -->
    <el-dialog
      :close-on-click-modal="false"
      width="800px"
      title="设备列表"
      :visible.sync="bindDeviceListVisible"
    >
      <el-table :data="DeviceList" ref="deviceList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
        <el-table-column property="name" align="center" label="位置">
          <template slot-scope="{row}">
            <span>{{row.address || row.position}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" property="name" label="设备名称"></el-table-column>
        <el-table-column align="center" property="serialNumber" label="设备编号"></el-table-column>
      </el-table>
      <el-pagination
        background
        @current-change="fetchDeviceList"
        layout="prev, pager, next"
        :total="devicePage.total"
      ></el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button @click="bindDeviceListVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveBindDevicelist">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins, Emit } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import {
  addHouseGroup,
  deleteHouseGroup,
  updateHouseGroup,
  getUnitList,
  addUnit,
  deleteUnit,
  addBuilding,
  updateBuilding,
  deleteBuilding
} from "@/api/houseApi.ts";
import { getDeviceList } from "@/api/deviceApi.ts";
import {
  addRoleGroup,
  getGroupInfoById,
  updateRoleGroup,
  deleteRoleGroup
} from "@/api/peopleApi.ts";
import { Message } from "element-ui";

@Component({})
export default class DataTree extends Vue {
  private showMenu: Number = 0;
  UpdateStatus: boolean = true; // 是否具有修改权限
  @Getter("permissionList") permissionList: Array<string>;
  @Prop({ default: "house" }) type: string;
  @Prop({
    default: () => {
      return []; // 必须是函数式返回
    }
  })
  TreeData: Array<Object>;
  // private data: Array<Object> =
  @Prop({
    default: () => {
      return {
        children: "sonBuildGroups",
        label: "name",
        key: "id"
      };
    }
  })
  dataFormate: Object;
  @Prop({ default: true }) needAction: any;
  @Prop({
    default: () => {
      return {};
    }
  })
  initFormHeader: object;
  @Prop({
    default: () => {
      return {};
    }
  })
  page: object;
  selectId: any = "";
  highlightStatus: boolean = false; // 高亮状态
  nodeAction: string = ""; // 记录执行的操作
  bindDeviceList: Array<object> = []; // 已选择绑定的设备列表
  bindDeviceListVisible: boolean = false; // 设备列表弹框状态
  DeviceList: Array<object> = []; // 所有设备列表
  devicePage: object = {
    page: 1,
    total: 1
  };
  batchForm: object = {
    serialNumber: "", // 序号
    serialNumberUnit: "",
    name: "",
    note: "",
    min: "",
    max: "",
    parentId: "",
    title: "添加子分组"
  }; // 批量添加表单
  activeName: string = "first";
  startTime: string = "18:00";
  endTime: string = "21:00"; // 权限修改时间
  unConfirmDeviceList: Array<object> = []; // 以勾选的设备
  // 分组校验规则
  HouseRules: Object = {
    name: [
      { required: true, message: "请输入别名", trigger: "blur" },
      { min: 1, max: 15, message: "别名长度应在1到15位" }
    ],
    serialNumber: [{ required: true, message: "请输入序号", trigger: "blur" }]
  };
  unitRules: object = {
    name: [{ required: true, message: "请输入单元楼名称", trigger: "blur" }],
    serialNumber: [{ required: true, message: "请输入序号", trigger: "blur" }],
    storeyNum: [
      {
        required: true,
        trigger: "blur",
        validator: (rule, value, callback) => {
          if (!/^\+?[1-9]\d*$/.test(value)) {
            callback(new Error("填写正确的楼层数"));
          } else {
            callback();
          }
        }
      }
    ],
    houseNum: [
      {
        required: true,
        trigger: "blur",
        validator: (rule, value, callback) => {
          if (!/^\+?[1-9]\d*$/.test(value)) {
            callback(new Error("填写正确的每层户数"));
          } else {
            callback();
          }
        }
      }
    ],
    serialNumberUnit: [
      {
        required: true,
        message: "请选择楼单位",
        trigger: "change",
        type: "string"
      }
    ]
  };
  batchRules: object = {
    min: [
      {
        required: true,
        trigger: "blur",
        validator: (rule, value, callback) => {
          if (!/^\+?[1-9]\d*$/.test(value)) {
            callback(new Error("填写正确的楼栋编号"));
          } else {
            callback();
          }
        }
      }
    ],
    max: [{ required: true, message: "请输入结束编号", trigger: "blur" }]
  };
  // 添加分组表单
  HouseForm: object = {
    serialNumber: "", // 序号
    serialNumberUnit: "",
    name: "",
    note: "",
    parentId: "",
    title: "添加子分组"
  };
  bindIndex: Array<number> = [];
  // 楼栋表单
  UnitForm: object = {
    buildingGroupId: "",
    name: "", // 名称
    serialNumber: "", // 编号
    serialNumberUnit: "", // 序号单元
    storeyNum: "", // 楼层数
    houseNum: "" // 每层户数
  };
  // 楼栋dialog添加分组状态
  HouseVisible: boolean = false;
  // 楼栋dialog添加楼栋状态
  HouseUnitVisible: boolean = false;
  // 权限表单
  RoleForm: object = {
    devAuthoritiesDevice: [],
    enableInviteCar: "1",
    enableInviteVisitor: "1",
    name: ""
  };
  RoleRules: object = {
    name: [
      { required: true, message: "请输入权限组名称", trigger: "blur" },
      { mix: 1, max: 10, message: "名称在1到10之前", trigger: "blur" }
    ]
  };
  // 查看已有单元设置状态
  showUnitSetting: boolean = false;
  // 单位序号设置 数组
  Tags: Array<object> = [];
  UnitTags: Array<object> = [];
  // 添加序号单元input框状态
  newTag: boolean = false;
  // 添加单元的值
  newTagValue: string = "";
  // 权限dialog状态
  RoleVisible: boolean = false;
  mounted() {
    this.UpdateStatus = this.permissionList.includes(
      this.$route.name + "Update"
    );
  }
  created() {
    this.fetchDeviceList(1);
    this.fetchUnitList();
    // this.fetchUnitList('build')
  }
  // 获取设备列表
  fetchDeviceList(page: number) {
    this.bindIndex = [];
    // console.log(this.bindDeviceList, '已绑定设备列表')
    getDeviceList({ page, limit: 10 }).then(res => {
      res.data.data.records.forEach((ele, index: number) => {
        this.bindDeviceList.forEach(item => {
          if (ele["serialNumber"] === item["deviceSerialNumber"]) {
            this.bindIndex.push(index);
          }
        });
      });
      this.DeviceList = res.data.data.records;
      this.devicePage["total"] = res.data.data.total;
      // console.log(this.bindIndex, 'index')
      this.$nextTick(() => {
        if (this.$refs["deviceList"]) {
          this.bindIndex.forEach(i => {
            this.$refs["deviceList"]["toggleRowSelection"](this.DeviceList[i]);
          });
        }
      });
    });
  }
  // 自动补充别名
  // autoName() {
  //   this.HouseForm['name'] = this.HouseForm['serialNumber'] + this.HouseForm['serialNumberUnit']
  // }
  // 关闭弹框
  closeDialog() {
    this.newTagValue = "";
    // 添加分组表单
    this.HouseForm = {
      serialNumber: "", // 序号
      serialNumberUnit: this.Tags.length && this.Tags[0]["name"],
      name: "",
      note: "",
      parentId: "",
      title: "添加子分组"
    };
    // 楼栋表单
    this.UnitForm = {
      buildingGroupId: "",
      name: "", // 名称
      serialNumber: "", // 编号
      storeyNum: "", // 楼层数
      houseNum: "" // 每层户数
    };
    this.batchForm = {
      serialNumber: "", // 序号
      serialNumberUnit: "",
      name: "",
      note: "",
      min: "",
      max: "",
      parentId: "",
      title: "添加子分组"
    };
    if (this.HouseUnitVisible) {
      this.$refs["buildings"]["resetFields"]();
    }
    if (this.HouseVisible) {
      this.$refs["batchForm"] && this.$refs["batchForm"]["resetFields"]();
      this.$refs["HouseForm"] && this.$refs["HouseForm"]["resetFields"]();
      this.$refs["HouseForms"] && this.$refs["HouseForms"]["resetFields"]();
    }
    this.HouseUnitVisible = false;
    this.HouseVisible = false;
  }
  // 将已选中的设备保存
  handleSelectionChange(val) {
    this.unConfirmDeviceList = val;
  }
  // 移除已选设备
  bildDeviceSplice(index) {
    this.bindDeviceList.splice(index, 1);
  }
  // 时间改变状态
  timeUpdateStatus(row) {
    row.timeStatus = !row.timeStatus;
    this.startTime = row.startTime;
    this.endTime = row.endTime;
  }
  // 确定对应设备的时间
  confirmEndTime(row) {
    row.startTime = this.startTime;
    row.endTime = this.endTime;
    this.startTime = "18:00";
    this.endTime = "21:00"; // 权限修改时间
    row.timeStatus = false;
  }
  // 确定添加权限
  RoleAddConfim() {
    this.$refs["roleForm"]["validate"](valid => {
      if (valid) {
        this.RoleForm["devAuthoritiesDevice"] = this.bindDeviceList;
        if (!this.RoleForm["devAuthoritiesDevice"].length) {
          return this.$message.error("请添加权限组的设备");
        }
        if (!this.RoleForm["id"]) {
          addRoleGroup(this.RoleForm).then(res => {
            if (res.data.code === 200) {
              this.$message.success("添加权限组成功");
              this.$emit("fetchRoleGroup");
              this["page"]["page"] = 1;
              this.$emit("fetchData", this.initFormHeader);
              this.roleHandClose();
            }
          });
        } else {
          updateRoleGroup(this.RoleForm).then(res => {
            if (res.data.code === 200) {
              this.$message.success("修改权限组成功");
              this.$emit("fetchRoleGroup");
              this["page"]["page"] = 1;
              this.$emit("fetchData", this.initFormHeader);
              this.roleHandClose();
            }
          });
        }
      }
    });
  }
  // 添加/修改权限组关闭弹框
  roleHandClose() {
    this.RoleForm["devAuthoritiesDevice"] = [];
    this.bindDeviceList = [];
    this.$refs["roleForm"]["resetFields"]();
    this.RoleVisible = false;
  }
  // 保存到绑定设备 并验证是否已经存在 已存在不加入
  saveBindDevicelist() {
    const strDevice = JSON.stringify(this.bindDeviceList);
    this.unConfirmDeviceList.forEach((ele, index) => {
      ele["startTime"] = "18:00";
      ele["endTime"] = "21:00";
      ele["deviceId"] = ele["id"];
      ele["deviceSerialNumber"] = ele["serialNumber"];
      this.$set(ele, "timeStatus", false);
    });
    this.bindDeviceList = this.unConfirmDeviceList;
    this.bindDeviceListVisible = false;
  }
  // 确定添加/修改单元楼
  addUpdateUnitConfim() {
    this.$refs["buildings"]["validate"](valid => {
      if (valid) {
        if (!this.UnitForm["id"]) {
          // console.log('confirm', this.UnitForm)
          addBuilding(this.UnitForm).then(res => {
            if (res.data.code === 200) {
              this.$message.success("添加成功");
              this.HouseUnitVisible = false;
              this.$emit("getHouseTreeData");
            }
          });
        } else {
          updateBuilding(this.UnitForm).then(res => {
            if (res.data.code === 200) {
              this.$message.success("添加成功");
              this.HouseUnitVisible = false;
              this.$emit("getHouseTreeData");
            }
          });
        }
      }
    });
  }
  // 获取单位列表
  fetchUnitList(type: string = "group") {
    getUnitList(type).then(res => {
      if (type === "build") {
        this.UnitTags = res.data.data;
      } else {
        this.Tags = res.data.data;
        this.HouseForm["serialNumberUnit"] = this.Tags[0]["name"];
        this.batchForm["serialNumberUnit"] = this.Tags[0]["name"];
      }
    });
  }
  // 查找对应的父级元素 不关闭楼栋分组
  checkParent(treeData: Array<object>, data: object) {
    let flag = false;
    let dataList: Array<object> = [];
    try {
      treeData.forEach(ele => {
        if (
          ele["id"] === data["parentId"] ||
          ele["id"] === data["buildingGroupId"]
        ) {
          flag = true;
          treeData.push(data);
          throw "find parent";
        } else {
          dataList = treeData;
        }
      });
    } catch (err) {
      console.log(err);
    }
    if (
      !flag &&
      dataList["sonBuildGroups"] &&
      dataList["sonBuildGroups"].length
    ) {
      return this.checkParent(dataList, data);
    }
  }
  /** 添加或修改分组信息 */
  async GroupAction() {
    if (this.activeName === "second") {
      if (this.nodeAction === "addGroup") {
        addHouseGroup(this.HouseForm).then(res => {
          if (res.data.code === 200) {
            this.closeDialog();
            Message({
              type: "success",
              message: "添加成功"
            });
            // this.checkParent(this.TreeData, res.data.data)
            this.$emit("getHouseTreeData");
            this.HouseVisible = false;
          }
        });
      } else if (this.nodeAction === "updateGroup") {
        updateHouseGroup(this.HouseForm).then(res => {
          if (res.data.code === 200) {
            this.closeDialog();
            Message({
              type: "success",
              message: "修改成功"
            });
            this.$emit("getHouseTreeData");
            this.HouseVisible = false;
          }
        });
      }
    } else {
      const reg = /^[0-9]+$/;
      if (
        !reg.test(this.batchForm["min"]) &&
        !reg.test(this.batchForm["max"])
      ) {
        return this.$message.error("请输入正整数!");
      } else if (
        Number(this.batchForm["min"]) > Number(this.batchForm["max"])
      ) {
        return this.$message.error("请确保序号由小到大!");
      } else {
        this.sortCreated().then(res => {
          this.$message.success(`创建${res.success}个成功,${res.error}个失败`);
          this.$refs["batchForm"]["resetFields"]();
          this.$emit("getHouseTreeData");
          this.HouseVisible = false;
        });
      }
    }
  }
  // 循环创建
  async sortCreated() {
    let success = 0;
    let error = 0;
    for (
      var i = Number(this.batchForm["min"]);
      i <= Number(this.batchForm["max"]);
      i++
    ) {
      this.batchForm["serialNumber"] = i;
      this.batchForm["name"] = i + this.batchForm["serialNumberUnit"];
      await addHouseGroup(this.batchForm).then(res => {
        if (res.data.code === 200) {
          success++;
        } else {
          error++;
        }
      });
    }
    return Promise.resolve({ success, error });
  }
  constraintLength(value: string) {
    if (value.length === 10) {
      return this.$message.warning("此项不能超过10个字符");
    }
  }
  // 关闭添加/修改单元楼
  closeBuildingAction() {
    this.$refs["buildings"]["resetFields"]();
    this.HouseUnitVisible = false;
  }
  @Emit("fetchData")
  handleNodeClick(data) {
    this.highlightStatus = !!data.id;
    /**@description 树节点点击事件 */
    if (this.type === "house") {
      if (data.type === "group") {
        this.selectId = data.id;
        this.initFormHeader["params"]["buildingId"] = "";
        this.initFormHeader["params"]["groupId"] = data.id;
        this["page"]["page"] = 1;
        this.initFormHeader["params"] = Object.assign(
          this.initFormHeader["params"],
          this.page
        );
        return this.initFormHeader;
      } else {
        this.selectId = data.id;
        this.initFormHeader["params"]["buildingId"] = data.id;
        this.initFormHeader["params"]["groupId"] = "";
        this["page"]["page"] = 1;
        this.initFormHeader["params"] = Object.assign(
          this.initFormHeader["params"],
          this.page
        );
        return this.initFormHeader;
      }
    } else {
      this["page"]["page"] = 1;
      this.initFormHeader["params"]["authId"] = data.id;
      this.initFormHeader["params"] = Object.assign(
        this.initFormHeader["params"],
        this.page
      );
      return this.initFormHeader;
    }
  }
  /*** 删除序号单元 */
  deleteTag(tag, type) {
    deleteUnit(tag.id).then(res => {
      if (res.data.code === 200) {
        this.fetchUnitList(type);
      }
    });
  }
  /**显示更多操作图标 */
  MouseNnter(val) {
    this.showMenu = val;
  }
  /*** 添加单元序号 */
  handleInputConfirm(type: string) {
    this.newTag = false;
    addUnit(this.newTagValue, type).then(res => {
      if (res.data.code === 200) {
        this.fetchUnitList(type);
        this.newTagValue = "";
      }
    });
  }
  /*** 显示添加序号单元框*/
  showInput() {
    this.newTag = true;
  }
  MouseLeave(val) {
    this.showMenu = 0;
  }
  /**
   * action 分类
   */
  commandTreeClick(treeData) {
    this.nodeAction = treeData.action;
    switch (treeData.action) {
      case "addGroup":
        this.closeDialog();
        this.HouseForm["serialNumberUnit"] = this.Tags[0]["name"];
        this.batchForm["serialNumberUnit"] = this.Tags[0]["name"];
        this.HouseForm["title"] = "添加子分组";
        this.HouseForm["parentId"] = treeData.data ? treeData.data.id : "";
        this.batchForm["parentId"] = treeData.data ? treeData.data.id : "";
        this.HouseVisible = true;
        this.activeName = "first";
        break;
      case "deleteGroup":
        this.$confirm("此操作将永久删除该目标, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            deleteHouseGroup(treeData.data.id).then((res: any) => {
              if (res.data.code === 200) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.$emit("getHouseTreeData");
                this.HouseVisible = false;
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
        break;
      case "addBuilding":
        this.closeDialog();
        this.UnitForm["buildingGroupId"] = treeData.data.id;
        this.UnitForm["id"] = "";
        this.HouseUnitVisible = true;
        break;
      case "updateGroup":
        this.activeName = "second";
        this.HouseVisible = true;
        this.HouseForm["title"] = "修改分组";
        this.HouseForm = Object.assign(this.HouseForm, treeData.data);
        break;
      case "updateBuilding":
        this.HouseUnitVisible = true;
        this.UnitForm = Object.assign(this.UnitForm, treeData.data);
        break;
      case "addRoleGroup":
        this.RoleVisible = true;
        this.RoleForm["id"] = "";
        break;
      case "updateRoleGroup":
        getGroupInfoById(treeData.data.id).then(res => {
          if (res.data.code === 200) {
            this.RoleForm = Object.assign({}, res.data.data);
            this.bindDeviceList = res.data.data.devAuthoritiesDevice;
          } else {
            this.$message.error("获取全选组信息失败");
          }
        });
        this.RoleVisible = true;
        break;
      case "deleteRoleGroup":
        this.$confirm("此操作将永久删除该权限组, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            deleteRoleGroup(treeData.data.id).then((res: any) => {
              if (res.data.code === 200) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.$emit("fetchRoleGroup");
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
        break;
      case "deleteBuilding":
        this.$confirm("此操作将永久删除该单元楼, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            deleteBuilding(treeData.data.id).then((res: any) => {
              if (res.data.code === 200) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.$emit("getHouseTreeData");
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
        break;
    }
  }
  /**
   *  返回执行的操作及id
   */
  commandObj(action, node) {
    return {
      action,
      ...node
    };
  }

  ///
  public phoneNum: any = 0;
  public regPos = /^\d+(\.\d+)?$/;
  public upNum = /[^\d]/g;
  public hintPhone: any = false;
  // phone只可输入数字
  UpNumber(e: any) {
    var v = e.target.value;

    e.target.value = v.replace(this.upNum, "");
  }

  clearableBtn(v) {
    //清除
    this.phoneNum = v ? v.length : 0;
  }

  hint(v: any) {
    this.hintPhone = v ? true : false;
  }

  hintFocus(e: any) {
    this.hintPhone = e.target.value ? true : false;
  }

  hintBlur() {
    this.hintPhone = false;
  }
}
</script>

<style>
/* .el-tree-node__content {
  position: relative;
} */
/* .el-tree-node__content:hover {
  color: #409eff;
  font-weight: bold;
} */
</style>

<style lang="scss" scoped>
.active {
  background-color: #409eff;
  color: white;
}
.content {
  width: 100%;
  height: 70vh;
  text-align: left;
  border: 1px solid #ebeef5;
  overflow-y: auto;
  overflow-x: auto;
}
.treeHeader {
  &:hover {
    cursor: pointer;
  }
  width: 100%;
  height: 40px;
  text-align: left;
  text-indent: 1em;
  line-height: 40px;
  position: relative;
  i {
    font-size: 20px;
  }
  .icon-menu {
    display: none;
  }
  .dropdownAll {
    width: 10px;
    height: 10px;
    position: absolute;
    right: 30px;
    top: 0px;
  }
  &:hover .icon-menu {
    display: block;
  }
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.formDialog {
  .input {
    width: 220px;
  }
}
.input-new-tag {
  width: 120px;
}
.bindDevice {
  height: 60px;
  line-height: 40px;
  overflow: hidden;
  padding: 10px 0px;
}
.highlight {
  background-color: #409eff;
  color: white;
}
.highlight .icon-menu {
  color: white;
}
.tree-rename{
  overflow: auto;
}

</style>

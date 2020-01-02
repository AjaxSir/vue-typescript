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
        <div>
          <el-dropdown v-if="UpdateStatus" @command="commandTreeClick" placement="bottom-start">
            <i v-show="node.id===showMenu" class="iconfont icon-menu"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="commandObj('addGroup', node)">添加子分组</el-dropdown-item>

              <el-dropdown-item :command="commandObj('updateGroup', node)">修改分组</el-dropdown-item>
              <el-dropdown-item :command="commandObj('deleteGroup', node)">删除分组</el-dropdown-item>
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
            <el-form-item prop="start" label="编号:">
              <el-input
                clearable
                placeholder="开始编号"
                style="width:140px"
                :maxlength="5"
                v-model="batchForm.start"
                @keydown.native="UpNumber"
                @keyup.native="inputHouseCheck"
                @change="hintChange"
                @input="constraintLength(batchForm.start,'5')"
              ></el-input>&nbsp;&nbsp;至&nbsp;&nbsp;
              <el-input
                clearable
                placeholder="结束编号"
                style="width:140px"
                :maxlength="5"
                v-model="batchForm.end"
                @keydown.native="UpNumber"
                @keyup.native="inputHouseCheck"
                @change="hintChange"
                @input="constraintLength(batchForm.end,'5')"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="序号单位:"
              prop="unitId"
              :show-message="showMessage"
              :error="errorMessage.unitId"
            >
              <el-select
                style="width:212px"
                v-model="batchForm.unitId"
                placeholder="请选择"
                @change="changeSelect"
              >
                <el-option v-for="item in Tags" :key="item.id" :label="item.name" :value="item.id"></el-option>
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
                  maxlength="8"
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
            <el-form-item label="生成示例:" prop="note" label-width="85px">
              <p
                style="height:16px;"
                v-for="(item,index) in sample.slice(0,2)"
                :key="'unit'+index"
              >{{item}}</p>
              <p style="height:16px;" v-if="sample.length>2">...</p>
              <div v-if="sample.length>2">
                <p
                  style="height:16px;"
                  v-for="(item,index) in sample.slice(sample.length-1)"
                  :key="'unitend'+index"
                >{{item}}</p>
              </div>
            </el-form-item>
            <!-- <el-form-item label="备注:" prop="note" label-width="85px">
              <el-input
                style="width:260px"
                maxlength="200"
                placeholder="填写分组的备注信息"
                type="textarea"
                v-model="batchForm.note"
                autocomplete="off"
              ></el-input>
            </el-form-item>-->
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
            <el-form-item label="名称:" prop="name">
              <el-input
                clearable
                maxlength="10"
                placeholder="填写分组的名称"
                v-model="HouseForm.name"
                autocomplete="off"
                @input="constraintLength(HouseForm.name,'10')"
              ></el-input>
            </el-form-item>
            <!-- <el-form-item label="备注:" prop="note">
              <el-input
                maxlength="200"
                placeholder="填写分组的备注信息"
                type="textarea"
                v-model="HouseForm.note"
                autocomplete="off"
              ></el-input>
            </el-form-item>-->
          </el-form>
        </el-tab-pane>
      </el-tabs>

      <el-form
        v-else
        ref="HouseForms"
        :rules="HouseRules"
        :model="HouseForm"
        label-width="90px"
        label-position="right"
        style="margin:20px 40px 0 0;"
      >
        <el-form-item label="名称:" prop="name" label-width="85px">
          <el-input
            clearable
            maxlength="15"
            placeholder="填写分组的名称"
            v-model="HouseForm.name"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="备注:" prop="note" label-width="85px">
          <el-input
            style="width:240px"
            placeholder="填写分组的备注信息"
            maxlength="200"
            type="textarea"
            v-model="HouseForm.note"
            autocomplete="off"
          ></el-input>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="GroupAction">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins, Emit } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import { getUnitList, addUnit, deleteUnit } from "@/api/houseApi.ts";
import Cookie from "js-cookie";
import {
  addHouseGroup,
  addHouseGroups,
  deleteHouseGroup,
  updateHouseGroup
} from "@/api/carApi.ts";
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
        children: "sonCarSpaceGroups",
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
  // bindDeviceList: Array<object> = []; // 已选择绑定的设备列表
  // bindDeviceListVisible: boolean = false; // 设备列表弹框状态
  // DeviceList: Array<object> = []; // 所有设备列表
  // devicePage: object = {
  //   page: 1,
  //   total: 1
  // };
  batchForm: object = {
    end: "",
    parentId: "",
    start: "",
    unitId: "",
    title: "添加子分组"
  }; // 批量添加表单
  activeName: string = "first";
  // startTime: string = "18:00";
  // endTime: string = "21:00"; // 权限修改时间
  // unConfirmDeviceList: Array<object> = []; // 以勾选的设备
  // 分组校验规则
  HouseRules: Object = {
    name: [
      { required: true, message: "请输入名称", trigger: "blur" },
      { min: 1, max: 15, message: "名称长度应在1到15位" }
    ]
  };

  batchRules: object = {
    start: [{ required: true, message: "请输入开始编号", trigger: "blur" }],
    end: [{ required: true, message: "请输入结束编号", trigger: "blur" }],
    unitId: [{ required: true, message: "请选择楼单位", trigger: "blur" }]
  };
  private showMessage: Boolean = true; //是否显示表单错误信息
  private errorMessage: Object = {
    unitId: ""
  };
  // 添加分组表单
  HouseForm: object = {
    // serialNumber: "", // 序号
    // serialNumberUnit: "",
    name: "",
    // note: "",
    parentId: "",
    title: "添加子分组"
  };
  // bindIndex: Array<number> = [];

  // 楼栋dialog添加分组状态
  HouseVisible: boolean = false;
  // 楼栋dialog添加楼栋状态
  // HouseUnitVisible: boolean = false;

  // 查看已有单元设置状态
  showUnitSetting: boolean = false;
  // 单位序号设置 数组
  Tags: Array<object> = [];
  // UnitTags: Array<object> = [];
  // 添加序号单元input框状态
  newTag: boolean = false;
  // 添加单元的值
  newTagValue: string = "";
  // 权限dialog状态
  // RoleVisible: boolean = false;
  private sample: Array<Object> = []; //生成示例
  mounted() {
    this.UpdateStatus = this.permissionList.includes(
      this.$route.name + "Update"
    );
  }

  created() {
    // this.fetchDeviceList(1);
    this.fetchUnitList();
    this.fetchUnitList("build");
  }
  // 获取设备列表
  // fetchDeviceList(page: number) {
  //   this.bindIndex = [];
  //   // console.log(this.bindDeviceList, '已绑定设备列表')
  //   getDeviceList({ page, limit: 10 }).then(res => {
  //     res.data.data.records.forEach((ele, index: number) => {
  //       this.bindDeviceList.forEach(item => {
  //         if (ele["serialNumber"] === item["deviceSerialNumber"]) {
  //           this.bindIndex.push(index);
  //         }
  //       });
  //     });
  //     this.DeviceList = res.data.data.records;
  //     this.devicePage["total"] = res.data.data.total;
  //     // console.log(this.bindIndex, 'index')
  //     this.$nextTick(() => {
  //       if (this.$refs["deviceList"]) {
  //         this.bindIndex.forEach(i => {
  //           this.$refs["deviceList"]["toggleRowSelection"](this.DeviceList[i]);
  //         });
  //       }
  //     });
  //   });
  // }
  // 自动补充名称
  // autoName() {
  //   this.HouseForm['name'] = this.HouseForm['serialNumber'] + this.HouseForm['serialNumberUnit']
  // }
  // 关闭弹框
  closeDialog() {
    // 添加分组表单
    this.HouseForm = {
      serialNumber: "", // 序号
      serialNumberUnit: this.Tags[0]["name"],
      name: "",
      note: "",
      parentId: "",
      title: "添加子分组"
    };
    this.batchForm = {
      end: "",
      parentId: "",
      start: "",
      unitId: "",
      title: "添加子分组"
    }; // 批量添加表单

    // if (this.HouseUnitVisible) {
    //   this.$refs["buildings"]["resetFields"]();
    // }
    if (this.HouseVisible) {
      this.$refs["batchForm"] && this.$refs["batchForm"]["resetFields"]();
      this.$refs["HouseForm"] && this.$refs["HouseForm"]["resetFields"]();
      this.$refs["HouseForms"] && this.$refs["HouseForms"]["resetFields"]();
    }
    // this.HouseUnitVisible = false;
    this.HouseVisible = false;
    this.sample = [];
  }

  fetchUnitList(type: string = "group") {
    /**@description 获取单位列表*/

    getUnitList(type).then(res => {
      this.Tags = res.data.data;
      this.HouseForm["serialNumberUnit"] = this.Tags[0]["name"];
      this.batchForm["serialNumberUnit"] = this.Tags[0]["name"];
    });
  }

  checkParent(treeData: Array<object>, data: object) {
    /**@description 查找对应的父级元素 不关闭楼栋分组*/

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

  checkHouseInput() {
    /**@description 检测子分组开始和结束规则 */
    if (/^[1-9]\d*$/.test(this.batchForm["start"])) {
      if (!/^\d+$/.test(this.batchForm["end"])) {
        this.$message.error("开始和结束的序号类型不一致");
        this.batchForm["unitId"] = "";
        return false;
      }
      if (Number(this.batchForm["start"]) > Number(this.batchForm["end"])) {
        this.$message.error("请确保序号由小到大");
        this.batchForm["unitId"] = "";
        return false;
      }

      return true;
    } else if (/^[A-Z]$/.test(this.batchForm["start"])) {
      if (!/^[A-Z]$/.test(this.batchForm["end"])) {
        this.$message.error("开始和结束的序号类型不一致");
        this.batchForm["unitId"] = "";
        return false;
      }
      if (
        this.batchForm["start"].charCodeAt() >
        this.batchForm["end"].charCodeAt()
      ) {
        this.$message.error("请确保序号由小到大");
        this.batchForm["unitId"] = "";
        return false;
      }

      return true;
    } else {
      return false;
    }
  }

  changeSelect() {
    /**@description 生成示例 */
    this.sample = [];
    if (!this.checkHouseInput()) {
      return;
    }

    let unitName = "";
    for (const item of this.Tags) {
      if (item["id"] === this.batchForm["unitId"]) {
        unitName = item["name"];
      }
    }

    if (/^\d+$/.test(this.batchForm["start"])) {
      for (let i = this.batchForm["start"]; i <= this.batchForm["end"]; i++) {
        this.sample.push(i + unitName);
      }
    } else if (/^[A-Z]$/.test(this.batchForm["start"])) {
      for (
        let i = this.batchForm["start"].charCodeAt();
        i <= this.batchForm["end"].charCodeAt();
        i++
      ) {
        this.sample.push(String.fromCharCode(i) + unitName);
      }
    }
  }

  async GroupAction() {
    /**@description 添加或修改分组信息*/
    if (this.activeName === "second") {
      if (this.nodeAction === "addGroup") {
        addHouseGroup(this.HouseForm).then(res => {
          /**@description 单个增加分组 */
          if (res.data.code === 200) {
            this.closeDialog();
            Message({
              type: "success",
              message: "添加成功"
            });
            this.$emit("getHouseTreeData");
            this.HouseVisible = false;
          }
        });
      } else if (this.nodeAction === "updateGroup") {
        /**@description 修改分组 */
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
      /**@description 批量增加分组 */
      if (this.sample.length == 0) {
        this.$message.error("请输入正确的楼栋编号");
        return;
      }
      this.sortCreated().then(res => {
        this.$message.success("添加成功");
        this.$refs["batchForm"]["resetFields"]();
        this.$emit("getHouseTreeData");
        this.HouseVisible = false;
      });
    }
  }

  // 循环创建
  async sortCreated() {
    let success = 0;
    let error = 0;
    await addHouseGroups(this.batchForm).then(res => {
      if (res.data.code === 200) {
        success++;
      } else {
        error++;
      }
    });
    return Promise.resolve({ success, error });
  }

  // 关闭添加/修改单元楼
  closeBuildingAction() {
    this.$refs["buildings"]["resetFields"]();
    // this.HouseUnitVisible = false;
  }
  @Emit("fetchData")
  handleNodeClick(data) {
    this.highlightStatus = !!data.id;
    /**@description 树节点点击事件 */
    if (this.type === "house") {
      if (data.type === "group") {
        this.selectId = data.id;
        this.initFormHeader["params"]["carSpaceGroupId"] = "";
        this.initFormHeader["params"]["groupId"] = data.id;
        this["page"]["page"] = 1;
        this.initFormHeader["params"] = Object.assign(
          this.initFormHeader["params"],
          this.page
        );
        return this.initFormHeader;
      } else {
        this.selectId = data.id;
        this.initFormHeader["params"]["carSpaceGroupId"] = data.id;
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

        this.HouseForm["title"] = "添加子分组";
        this.HouseForm["parentId"] = treeData.data ? treeData.data.id : "";
        this.batchForm["parentId"] = treeData.data ? treeData.data.id : "";
        this.HouseVisible = true;
        this.activeName = "first";
        break;
      case "updateGroup":
        this.activeName = "second";
        this.HouseVisible = true;
        this.HouseForm["title"] = "修改分组";
        this.HouseForm = Object.assign(this.HouseForm, treeData.data);
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

  public phoneNum: any = 0;
  public regPos = /^\d+(\.\d+)?$/;
  public upNum = /[^\d]/g;
  public hintPhone: any = false;
  // phone只可输入数字
  UpNumber(e: any) {
    var v = e.target.value;
    e.target.value = v.replace(this.upNum, "");
  }

  // 楼栋编号输入检测
  private housePartern = /^([1-9]\d*|[A-Z])$/;
  inputHouseCheck(e: any) {
    let v = e.target.value;

    if (!this.housePartern.test(e.target.value)) {
      e.target.value = "";
    }
    this.batchForm["start"] = this.batchForm["start"].toUpperCase();
    this.batchForm["end"] = this.batchForm["end"].toUpperCase();
  }

  clearableBtn(v) {
    //清除
    this.phoneNum = v ? v.length : 0;
  }

  hint(v: any) {}
  hintChange(v: any) {
    if (this.batchForm["unitId"]) {
      this.changeSelect();
    }

    this.hintPhone = v ? true : false;
  }

  hintFocus(e: any) {
    this.hintPhone = e.target.value ? true : false;
  }

  hintBlur() {
    this.hintPhone = false;
  }

  constraintLength(value: string, note: string) {
    switch (note) {
      case "10":
        if (value.length === 10) {
          this.message("此项不能超过10个字符");
        }
        break;
      case "5":
        if (value.length === 5) {
          this.message("此项不能超过5个字符");
        }
        break;
    }
  }

  message(val: string) {
    if (!Cookie.get("error")) {
      Cookie.set("error", Date.now(), {
        expires: new Date(new Date().getTime() + 3 * 1000)
      }); // 五秒钟内不会重复出现提示框
      this.$message({
        message: val,
        type: "warning"
      });
    }
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
.tree-rename {
  overflow: auto;
}
</style>

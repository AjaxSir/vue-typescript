<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="rowSpan.row1">
        <div class="content tree-rename">
          <div class="treeHeader">
            <i class="iconfont icon-shuji"></i>
            所有
          </div>
          <el-tree
            :data="TreeData"
            node-key="id"
            :props="dataFormate"
            default-expand-all
            :highlight-current="true"
            :expand-on-click-node="false"
            @node-click="handleNodeClick"
          >
            <span class="custom-tree-node" slot-scope="{ node }">
              <span>{{ node.label }}</span>
              <p v-if="node.label === deviceName" class="choose-target"></p>
            </span>
          </el-tree>
        </div>
      </el-col>
      <el-col :span="rowSpan.row2" class="table-col">
        <div class="rightContent">
          <div class="imgInfo">
            <div class="singleImg">
              <h4>证件信息</h4>
              <img v-if="vistorForm.photo" class="headImg" :src="vistorForm.photo" alt />
              <img v-else class="headImg" :src="defaultHead" />
            </div>
          </div>
          <div class="imgInfo">
            <div class="singleImg">
              <h4>来访者照片</h4>
              <img v-if="vistorForm.photo" class="headImg" :src="vistorForm.photo" alt />
              <img v-else class="headImg" :src="defaultHead" />
            </div>
          </div>
          <div class="write">
            <el-button>手动输入</el-button>
          </div>
          <div class="imgInfo" style="margin-left:80px;width:680px;height:auto;display:block">
            <el-form
              style="overflow:hidden"
              :line="true"
              :model="vistorForm"
              label-width="80px"
              class="demo-form-inline"
            >
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item class="vistorItemForm" label="姓名:">
                    <span>{{ vistorForm.name }}</span>
                  </el-form-item>

                  <el-form-item class="vistorItemForm" label="性别:">
                    <span>{{ vistorForm.sex }}</span>
                  </el-form-item>

                  <el-form-item class="vistorItemForm" label="民族:">
                    <span>{{ vistorForm.nation }}</span>
                  </el-form-item>

                  <el-form-item class="vistorItemForm" label="出生日期:">
                    <span>{{ vistorForm.birthday }}</span>
                  </el-form-item>

                  <el-form-item class="vistorItemForm" label="身份证号:">
                    <span>{{ vistorForm.cardNo }}</span>
                  </el-form-item>

                  <el-form-item class="vistorItemForm clearBotn" label="户籍地址:">
                    <span>{{ vistorForm.address }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item class="vistorItemForm" label="被访人员:">
                    <el-select
                      style="width:210px"
                      size="small"
                      v-model="writeVisitor.scenceUserId"
                      filterable
                      remote
                      :remote-method="remoteMethod"
                      :loading="loading"
                      @change="selectType"
                    >
                      <el-option
                        v-for="item in nameList"
                        :key="item.scenceUserId"
                        :label="item.value"
                        :value="item.scenceUserId"
                      >
                        <span style="float: left">{{ item.name }}</span>
                        <span
                          style="float: right; color: #8492a6; font-size: 13px"
                        >{{ item. value }}</span>
                      </el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item class="vistorItemForm" label="被访房屋:">
                    <el-select
                      style="width:210px"
                      v-model="writeVisitor.buildingId"
                      placeholder="请选择"
                      size="small"
                    >
                      <el-option
                        v-for="item in houseType"
                        :key="item.buildingId"
                        :label="item.name"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                    <!-- <el-input style="width:210px" size="small" v-model="writeVisitor.buildingId"></el-input> -->
                  </el-form-item>

                  <el-form-item class="vistorItemForm" label="被访事由:">
                    <el-select
                      style="width:210px"
                      v-model="writeVisitor.reasons"
                      placeholder="请选择"
                      size="small"
                    >
                      <el-option
                        v-for="item in reasonsType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                        <!-- <span style="float: left">{{ item.value }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>-->
                      </el-option>
                    </el-select>
                    <el-input v-if="writeVisitor.reasons === 'qt'" placeholder="填写事由"></el-input>
                  </el-form-item>

                  <el-form-item class="vistorItemForm" label="同行人数:">
                    <el-input style="width:210px" size="small" v-model="writeVisitor.numPeople"></el-input>
                  </el-form-item>

                  <el-form-item class="vistorItemForm" label="手机号:">
                    <el-input style="width:210px" size="small" v-model="writeVisitor.phone"></el-input>
                  </el-form-item>

                  <el-form-item class="vistorItemForm" label="有效期:">
                    <el-date-picker
                      size="small"
                      style="width:210px"
                      :picker-options="pickOptionStart"
                      v-model="writeVisitor.invalidDate"
                      type="datetime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期"
                    ></el-date-picker>
                  </el-form-item>

                  <!-- <el-form-item class="vistorItemForm clearBotn" label="其他证件:">
                    <el-select
                      style="width:210px"
                      v-model="vistorForm.otherSredentials"
                      placeholder="请选择"
                      size="small"
                    >
                      <el-option label="护照" value="hz"></el-option>
                      <el-option label="驾驶证" value="jsz"></el-option>
                      <el-option label="其他" value="qt"></el-option>
                    </el-select>
                    <el-input
                      style="width:210px"
                      v-if="vistorForm.otherSredentials === 'qt'"
                      placeholder="填写其他证件"
                    ></el-input>
                  </el-form-item>

                  <el-form-item class="vistorItemForm clearBotn" label="证件号:">
                    <el-input
                      size="small"
                      style="width:210px"
                      v-model="vistorForm.sredentialsNumber"
                    ></el-input>
                  </el-form-item>-->
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div class="imgInfo" style="margin-left:80px;">
            <el-button :disabled="deviceId ===''" type="warning" size="small" @click="cancelBtn">取消</el-button>
            <el-button :disabled="deviceId ===''" type="primary" size="small" @click="createVisitor">确定</el-button>
            <el-button :disabled="deviceId ===''" type="success" size="small" @click="handleLink">查看登记记录</el-button>
          </div>
        </div>
        <div :class="rowSpan.row1===4 ? menuControl1 : menuControl2" @click="menuVisible">
          <p class="close-menu">
            <i v-if="rowSpan.row1===4" class="iconfont icon-left icon-class"></i>
            <i v-else class="iconfont icon-zuo icon-class"></i>
          </p>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
declare function require(string): string;

import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { MessageBox, Form } from "element-ui";
import { Getter, Action, Mutation } from "vuex-class";
import mixin from "@/config/minxins";
import {
  regDevice, // 获取注册机
  getRegData, //获取刷身份证信息
  getUserName, //输入人名模糊查询人员
  getTargetHouse, // 获取指定房屋
  addVisitor, //确认注册访客
  cancelVisitor //取消访客注册
} from "@/api/vistorApi.ts";
const DataTree = () => import("@/components/DataTree.vue");

@Component({
  mixins: [mixin],
  components: {
    DataTree
  }
})
export default class VistorRegister extends Vue {
  TreeData: Array<Object> = []; // 树形结构数据
  private nameList: Array<Object> = []; //人员
  private houseType: Array<Object> = [{ value: "", name: "", buildingId: "" }]; //指定房屋
  private loading: Boolean = false;

  private rowSpan: any = {
    row1: 4,
    row2: 20
  };
  private menuControl1: String = "menu-control";
  private menuControl2: String = "menu-visible";
  private startFetch: Boolean = false;
  private deviceId: String = "";
  private deviceName: String = "";
  defaultHead: string = require("@/assets/defaultHead.jpg");

  vistorForm: object = {}; //访客刷身份证信息

  writeVisitor: Object = {
    // 访客填写信息
    buildingId: "", //被访房屋
    id: "", //身份证信息id
    numPeople: 0, // 同行人数
    phone: "", // 电话
    reasons: "", // 被访事由
    scenceUserId: "", // 被访人员
    invalidDate: null //时间段开始时间
  };

  pickOptionStart: object = {}; //按照时间段查询的开始时间
  pickOptionEnd: object = {}; //按照时间段查询的结束时间

  private reasonsType: Array<Object> = [
    //发布通知类型
    {
      label: " 外卖",
      value: "1"
    },
    {
      label: "访客",
      value: "2"
    },
    {
      label: "维修",
      value: "3"
    },
    {
      label: "医疗",
      value: "4"
    },
    {
      label: "其他",
      value: "5"
    }
  ];

  dataFormate: Object = {
    children: "sonBuildGroups",
    label: "name"
  };

  menuVisible() {
    /**@description 控制楼栋 */
    if (this.rowSpan.row1 === 4) {
      this.rowSpan = {
        row1: 0,
        row2: 24
      };
    } else {
      this.rowSpan = {
        row1: 4,
        row2: 20
      };
    }
  }

  created() {
    this.getDevice();
  }

  destroyed() {
    this.startFetch = false;
  }

  async getDevice() {
    const { data } = await regDevice();
    this.TreeData = data.data;
    this.deviceId = data.data[0].id;
    this.deviceName = data.data[0].name;
    this.getIdentity();
  }

  async handleNodeClick(val) {
    /**@description 树节点点击事件 */
    this.deviceId = val.id;
    this.deviceName = val.name;
    this.startFetch = true;
    this.getVisitorData();
  }

  getIdentity() {
    /**@description 长轮询获取身份信息 */
    if (this.startFetch) {
      this.startFetch = false;
    } else {
      this.startFetch = true;
      this.getVisitorData();
    }
  }

  async getVisitorData() {
    /**@description 获取最新访客人员信息 */
    if (this.deviceId) {
      let fetch = true;
      while (this.startFetch) {
        try {
          this.vistorForm = {};
          const { data } = await getRegData(this.deviceId);

          if (data.data !== null) {
            this.startFetch = false;
            this.vistorForm = data.data;
          }
        } catch (error) {
          if (error.response.status === 401) {
            this.startFetch = false;
            MessageBox.confirm("你已被登出，请重新登录", "警告", {
              confirmButtonText: "重新登录",
              showClose: false,
              showCancelButton: false,
              center: true,
              type: "warning"
            }).then(() => {
              // clearCookie();
              location.reload();
            });
          }
        }
      }
    }
  }

  async remoteMethod(query) {
    /**@description 根据姓名模糊查询人员 */
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
    /**@description 获取人员信息 */
    getUserName({ name: query }).then(res => {
      this.loading = false;
      this.nameList = res.data.data.map(item => {
        return {
          value: item.phone,
          name: item.name,
          scenceUserId: item.id
        };
      });
    });
  }

  async selectType(select) {
    /**@description select 获取指定房屋 */
    const { data } = await getTargetHouse({ id: select });
    this.houseType = data.data.map(item => {
      return {
        value: item.houseDetail.buildingId,
        name: item.houseDetail.locationName,
        buildingId: item.houseDetail.buildingId
      };
    });
  }

  async createVisitor() {
    /**@description 注册访客 */
    this.writeVisitor["id"] = this.vistorForm["id"];
    try {
      const { data } = await addVisitor(this.writeVisitor, this.deviceId);
      this.vistorForm = {};
      this.writeVisitor = {};
      this["notify"]("注册访客成功");
      this.startFetch = true;
      this.getVisitorData();
    } catch (err) {
      console.log(err);
    }
  }

  cancelBtn() {
    /**@description 取消注册 */
    cancelVisitor(this.deviceId).then(() => {
      this.vistorForm = {};
      this["notify"]("取消注册成功");
      this.startFetch = true;
      this.getVisitorData();
    });
  }

  handleLink() {
    this.$router.push({
      name: "record",
      query: { id: this.deviceId, name: this.deviceName }
    });
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
.table-col {
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
  left: -15px;
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
.imgInfo {
  width: 360px;
  height: 200px;
  display: inline-block;
  // margin-left: 30px;
  // flex-direction: column;
  // justify-content: center;
  .singleImg {
    width: 200px;
    height: 200px;
    margin: 0 auto;
  }
}
.headImg {
  width: 180px;
  height: 180px;
}
.write {
  width: 720px;
  height: 30px;
  text-align: center;
  line-height: 30px;
}
.vistorItemForm {
  // width: 300px !important;
  margin-bottom: 0 !important;
}
.clearBotn {
  clear: both;
}
.content {
  width: 100%;
  height: 70vh;
  text-align: left;
  border: 1px solid #ebeef5;
}
.treeHeader {
  width: 100%;
  height: 40px;
  text-align: left;
  text-indent: 1em;
  line-height: 40px;
  position: relative;
  i {
    font-size: 20px;
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
.choose-target {
  width: 5px;
  height: 5px;
  background-color: #f56c6c;
  border-radius: 50%;
}
</style>

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
              <p v-if="node.label === deviceName" class="choose-target">
                <i class="el-icon-success"></i>
              </p>
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
            <el-button size="small" @click="manualInput()">{{inputStatus ? '刷卡注册' : '手动输入'}}</el-button>
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
                <el-col :span="24">
                  <div class="basic-info">
                    <p class="basic-text">基本信息</p>
                    <el-row :gutter="10">
                      <el-col :span="8">
                        <el-form-item class="vistorItemForm" label="姓名:">
                          <span v-if="!inputStatus">{{ vistorForm.name }}</span>
                          <el-input
                            v-else
                            size="small"
                            style="width:130px"
                            placeholder="请输入姓名"
                            v-model="vistorForm.name"
                            @input="constraintLength(vistorForm.name,'10')"
                            :maxlength="10"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item class="vistorItemForm" label="性别:">
                          <span v-if="!inputStatus">{{ vistorForm.sex }}</span>
                          <el-select
                            v-else
                            v-model="vistorForm.sex"
                            placeholder="请输入性别"
                            size="small"
                            style="width:130px"
                          >
                            <el-option
                              v-for="item in sexType"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item class="vistorItemForm" label="民族:">
                          <span v-if="!inputStatus">{{ vistorForm.nation }}</span>
                          <el-input
                            v-else
                            size="small"
                            v-model="vistorForm.nation"
                            placeholder="请输入民族"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <el-row :gutter="10">
                      <el-col :span="8">
                        <el-form-item class="vistorItemForm" label="出生日期:">
                          <span v-if="!inputStatus">{{ vistorForm.birthday }}</span>
                          <el-date-picker
                            v-else
                            v-model="vistorForm.birthday"
                            style="width:130px"
                            size="small"
                            type="date"
                            placeholder="请选择日期"
                            value-format="yyyy-MM-dd"
                          ></el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item class="vistorItemForm clearBotn" label="证件类型:">
                          <span v-if="!inputStatus">身份证</span>
                          <el-select
                            v-else
                            v-model="writeVisitor.cardName"
                            placeholder="请选择"
                            size="small"
                            style="width:130px"
                          >
                            <el-option
                              v-for="item in identityType"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item
                          v-if="writeVisitor.cardName==='其他'"
                          class="vistorItemForm"
                          label="其他证件:"
                        >
                          <el-input
                            size="small"
                            v-model="elseInfo.cardName"
                            placeholder="请输入其他证件"
                            @input="constraintLength(elseInfo.cardName,'10')"
                            :maxlength="18"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="10">
                      <el-col :span="12">
                        <el-form-item class="vistorItemForm" label="证件号码:">
                          <span v-if="!inputStatus">{{ vistorForm.cardNo }}</span>
                          <el-input
                            v-else
                            style="width:240px"
                            size="small"
                            placeholder="请输入证件号码"
                            v-model="vistorForm.cardNo"
                            @input="constraintLength(vistorForm.cardNo,'18')"
                            :maxlength="18"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item class="vistorItemForm clearBotn" label="户籍地址:">
                          <span v-if="!inputStatus">{{ vistorForm.address }}</span>
                          <el-input
                            v-else
                            style="width:240px"
                            size="small"
                            placeholder="请输入户籍地址"
                            v-model="vistorForm.address"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="24">
                  <div class="basic-info">
                    <p class="basic-text">访问信息</p>
                    <el-row :gutter="10">
                      <el-col :span="8">
                        <el-form-item class="vistorItemForm" label="被访人员:">
                          <el-select
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
                      </el-col>
                      <el-col :span="8">
                        <el-form-item class="vistorItemForm" label="被访房屋:">
                          <el-select v-model="writeVisitor.houseId" placeholder="请选择" size="small">
                            <el-option
                              v-for="item in houseType"
                              :key="item.houseId"
                              :label="item.name"
                              :value="item.value"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item class="vistorItemForm" label="同行人数:">
                          <el-input size="small" v-model="writeVisitor.numPeople"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <el-row :gutter="10">
                      <el-col :span="12">
                        <el-form-item class="vistorItemForm" label="手机号:">
                          <el-input
                            style="width:240px"
                            size="small"
                            v-model="writeVisitor.phone"
                            @input="constraintLength(writeVisitor.phone,'11')"
                            :maxlength="11"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item class="vistorItemForm" label="有效期:">
                          <el-date-picker
                            style="width:240px"
                            size="small"
                            :picker-options="pickOptionStart"
                            v-model="writeVisitor.invalidDate"
                            type="datetime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择日期"
                          ></el-date-picker>
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <el-row>
                      <el-col :span="12">
                        <el-form-item class="vistorItemForm" label="被访事由:">
                          <el-select
                            style="width:240px"
                            v-model="writeVisitor.reasons"
                            placeholder="请选择"
                            size="small"
                          >
                            <el-option
                              v-for="item in reasonsType"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item
                          v-if="writeVisitor.reasons==='其他'"
                          class="vistorItemForm"
                          label="其他事由:"
                        >
                          <el-input
                            size="small"
                            style="width:240px"
                            v-model="elseInfo.reasons"
                            placeholder="请输入其他事由"
                            @input="constraintLength(elseInfo.reasons,'10')"
                            :maxlength="10"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div class="imgInfo" style="margin-left:80px;">
            <el-button
              v-if="!inputStatus"
              :disabled="deviceId ===''"
              type="warning"
              size="small"
              @click="cancelBtn"
            >取消刷卡信息</el-button>
            <el-button
              v-if="inputStatus"
              :disabled="deviceId ===''"
              type="warning"
              size="small"
              @click="clearBtn"
            >清除</el-button>
            <el-button
              :disabled="deviceId ===''"
              type="primary"
              size="small"
              @click="createVisitor"
            >确定</el-button>
            <el-button
              :disabled="deviceId ===''"
              type="success"
              size="small"
              @click="handleLink"
            >查看登记记录</el-button>
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
  addVisitor, //刷卡确认注册访客
  addVisitorManual, //手动访客注册
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
  filterForm: object = {
    tag: "no"
  }; //根据关键字查询
  TreeData: Array<Object> = []; // 树形结构数据
  private nameList: Array<Object> = []; //人员
  private houseType: Array<Object> = [{ value: "", name: "", houseId: "" }]; //指定房屋
  private loading: Boolean = false;

  private rowSpan: any = {
    row1: 4,
    row2: 20
  };
  private menuControl1: String = "menu-control";
  private menuControl2: String = "menu-visible";
  private startFetch: Boolean = false;
  private deviceId: any = "";
  private deviceName: any = "";
  defaultHead: string = require("@/assets/defaultHead.jpg");

  vistorForm: object = {}; //访客刷身份证信息

  writeVisitor: Object = {
    // 访客填写信息
    houseId: "", //被访房屋
    id: "", //身份证信息id
    numPeople: 0, // 同行人数
    phone: "", // 电话
    reasons: "", // 被访事由
    scenceUserId: "", // 被访人员
    invalidDate: null, //时间段开始时间
    cardName: ""
  };

  pickOptionStart: object = {}; //按照时间段查询的开始时间
  pickOptionEnd: object = {}; //按照时间段查询的结束时间
  private inputStatus: Boolean = false; //是否手动输入
  private elseInfo: Object = {
    //其他信息
    cardName: "", //其他证件
    reasons: "" //其他被访事由
  };

  private sexType: Array<Object> = [
    {
      label: " 男",
      value: "男"
    },
    {
      label: "女",
      value: "女"
    }
  ];

  private identityType: Array<Object> = [
    {
      label: "身份证",
      value: "身份证"
    },
    {
      label: "护照",
      value: "护照"
    },
    {
      label: "学生证",
      value: "学生证"
    },
    {
      label: "军官证",
      value: "军官证"
    },
    {
      label: "其他",
      value: "其他"
    }
  ];

  private reasonsType: Array<Object> = [
    //发布通知类型
    {
      label: "外卖",
      value: "外卖"
    },
    {
      label: "访客",
      value: "访客"
    },
    {
      label: "维修",
      value: "维修"
    },
    {
      label: "医疗",
      value: "医疗"
    },
    {
      label: "其他",
      value: "其他"
    }
  ]; // 获取注册设备

  initForm: object = {
    //获取车辆列表url
    url: "/admin/dev-manage/get-reg-dev/",
    method: "get"
  };

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
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    ); // 合并参数
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

  manualInput() {
    this.inputStatus = !this.inputStatus;
    if (this.inputStatus) {
      for (const key in this.vistorForm) {
        this.vistorForm[key] = "";
      }
      for (const key in this.writeVisitor) {
        this.writeVisitor[key] = "";
      }
      this.writeVisitor["numPeople"] = 0;
      this.startFetch = false;
      this.getVisitorData();
    } else {
      this.startFetch = true;
      this.getVisitorData();
    }
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
    if (this.deviceId && this.inputStatus === false) {
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
        value: item.houseId,
        name: item.houseDetail.locationName,
        houseId: item.houseId
      };
    });
  }

  async createVisitor() {
    /**@description 注册访客
     * @argument inputStatus:false 刷卡注册 :true 手动注册
     */
    if (!this.inputStatus) {
      const form = { ...this.writeVisitor };
      form["reasons"] = this.elseInfo["reasons"];
      form["id"] = this.vistorForm["id"];
      try {
        const { data } = await addVisitor(form, this.deviceId);
        this.vistorForm = {};
        this.writeVisitor = {};
        this["notify"]("注册访客成功");
        this.startFetch = true;
        this.getVisitorData();
      } catch (err) {
        console.log(err);
      }
    } else {
      const form = { ...this.vistorForm, ...this.writeVisitor };
      form["cardName"] = this.elseInfo["cardName"];
      form["reasons"] = this.elseInfo["reasons"];
      try {
        const { data } = await addVisitorManual(form, this.deviceId);
        this.vistorForm = {};
        this.writeVisitor = {};
        this["notify"]("注册访客成功");
      } catch (err) {
        console.log(err);
      }
    }
  }

  cancelBtn() {
    /**@description 取消注册 */
    cancelVisitor(this.deviceId).then(() => {
      this.vistorForm = {};
      this.writeVisitor = {};
      this["notify"]("取消注册成功");
      this.startFetch = true;
      this.getVisitorData();
    });
  }

  clearBtn() {
    /**@description 清空input */
    for (const key in this.vistorForm) {
      this.vistorForm[key] = "";
    }
    for (const key in this.writeVisitor) {
      this.writeVisitor[key] = "";
    }
    this.writeVisitor["numPeople"] = 0;
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
  // line-height: 30px;
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
  color: #20a0ff;
}

.basic-info {
  border: 1px solid #c0c4cc;
  margin: 20px 5px;
  padding: 20px;
  position: relative;
}

.basic-text {
  position: absolute;
  top: -11px;
  font-size: 14px;
  color: #409eff;
  width: 70px;
  background: #f8f8f8;
  text-align: center;
}
</style>

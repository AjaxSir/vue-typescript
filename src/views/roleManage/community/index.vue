<template>
  <div class="app-container">
    <!-- <el-row>
      <el-col :span="24">
        <action-header :total="1">
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
    </el-row>-->
    <el-row :gutter="10" class="community-height">
      <el-col :span="24" class="table-col">
        <div class="rightContent">
          <el-form ref="formInfo" :rules="userRules" :model="communityForm" label-width="80px">
            <el-form-item label="小区名称" prop="name">
              <el-input v-model="communityForm.name" placeholder="填写小区名称" auto-complete="off"></el-input>
            </el-form-item>

            <el-form-item label="小区地址" prop="address">
              <el-input
                @input="getlocLat"
                v-model="communityForm.address"
                placeholder="填写小区地址"
                auto-complete="off"
              ></el-input>
            </el-form-item>

            <span
              style="margin-left:40px"
            >当前经纬度(经度:{{ communityForm.longitude}}, 纬度: {{ communityForm.latitude }})</span>
            <BaiduMap
              :backStatus="true"
              :markerStatus="false"
              @pointClick="getPoint"
              :keyword="communityForm.address"
            ></BaiduMap>

            <el-form-item label="图片展示" style="margin-top:22px">
              <div class="uplolad-img">
                <!-- v-if="showPic" -->
                <span class="shade-position" v-for="(item,index) in picList" :key="index">
                  <img class="show-img" :src="item" alt />
                  <p class="show-img shade" @click="changeImg(item,index)">
                    <i class="el-icon-delete"></i>
                  </p>
                </span>
                <el-upload
                  class="avatar-uploader"
                  :action="upPathPerson"
                  ref="personForm"
                  :list-type="picList.length < 7 ? 'picture-card' : ''"
                  accept="image/jpeg, image/jpg, image/png"
                  name="picture"
                  :headers="myHeaders"
                  :show-file-list="false"
                  :auto-upload="true"
                  :before-upload="beforeAvatarUpload"
                  :on-success="succUpdatePerson"
                  :on-error="errorUpdatePerson"
                >
                  <i v-if="picList.length < 7" class="el-icon-plus"></i>
                  <!-- <el-button slot="trigger" size="small" type="primary">选取文件</el-button> -->
                </el-upload>
                <!-- <el-dialog :visible.sync="dialogVisible" size="tiny">
                  <img width="100px" :src="imageUrl" alt />
                </el-dialog>-->
                <!-- <el-button class="upload-btn" size="small">上&nbsp;&nbsp;传</el-button> -->
              </div>
            </el-form-item>

            <el-form-item label="小区概况">
              <el-input
                type="textarea"
                :rows="5"
                v-model="communityForm.note"
                placeholder="输入小区概况"
                @input="constraintLength(communityForm.note,'200')"
                :maxlength="200"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit" style="float:right;">立即修改</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import mixin from "@/config/minxins";
import {
  editCommunity,
  getSceneInfo,
  getScene,
  deleteImg
} from "@/api/screenApi.ts";
import { serverURL } from "../../../plugins/axios";
import { baiduDebounce } from "@/utils";
import _axios from "axios";
import { getToken } from "@/utils/auth";

const ActionHeader = () => import("@/components/ActionHeader.vue");
const DataTree = () => import("@/components/DataTree.vue");
const BaiduMap = () => import("@/components/baiduMap/index.vue");
var _token = getToken(); // 要保证取到

@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    DataTree,
    BaiduMap
  }
})
export default class InformIssue extends Vue {
  filterForm: object = {
    tag: "no"
  }; //根据关键字查询
  initForm: object = {}; //获取数据的url

  // private header: Object = {
  //   "Content-Type": "multipart/form-data"
  // };

  private communityForm: Object = {
    address: "",
    latitude: "", //纬度
    longitude: "", //经度
    name: "", //名称
    note: "" //备注
    // picList: [] //图片
  };
  private selectPic: Object = {};
  private userRules: Object = {
    name: [{ required: true, message: "请输入小区名称", trigger: "blur" }],
    address: [{ required: true, message: "请输入具体位置", trigger: "blur" }]
  };
  private upPathPerson: any = `${serverURL}/admin/hs-scence/picture/`;
  private myHeaders: object = { token: _token };

  private imageUrl: any = "";
  private dialogVisible: Boolean = false;
  private fileList: Array<Object> = [];
  private picList: Array<Object> = [];
  private showPic: Boolean = true;

  created() {
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    ); // 合并参数
    this.getSceneData();
  }

  async getSceneData() {
    const { data } = await getScene();
    for (const key in this.communityForm) {
      this.communityForm[key] = data.data[key];
    }
    this.picList = data.data.picList;
  }

  beyondFile(files, fileList) {
    this.$message({ message: "只能上传7张", type: "error" });
  }

  // changefile(file, fileList) {
  //   this.showPic = false;
  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     const imgBase64: any = reader.result;
  //     this.selectPic[`${file.uid}`] = imgBase64.split(",")[1];
  //   };
  //   reader.readAsDataURL(file.raw);
  // }

  removefile(file, fileList) {
    delete this.selectPic[`${file.uid}`];
  }

  async onSubmit() {
    // this.communityForm["picList"] = [];
    this.$refs["formInfo"]["validate"](valid => {
      if (valid) {
        // for (const key in this.selectPic) {
        //   this.communityForm["picList"].push(this.selectPic[key]);
        // }
        editCommunity(this.communityForm).then(res => {
          this["notify"]("success", "成功", "修改小区成功");
          // this.fileList = [];
          this.showPic = true;
          this.getSceneData();
        });
      }
    });
  }

  succUpdatePerson() {
    this.getSceneData();
    this["notify"]("success", "成功", "新增图片成功");
  }

  errorUpdatePerson() {
    this["notify"]("error", "失败", "新增图片失败");
  }

  beforeAvatarUpload(file) {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      this.$message.error("上传头像图片大小不能超过 2MB!");
    }
    return isLt2M;
  }

  changeImg(v, i) {
    deleteImg(i).then(() => {
      this["notify"]("success", "成功", "删除图片成功");
      this.getSceneData();
    });
  }

  /** 获取经纬度 */
  getPoint(add) {
    this.communityForm["address"] =
      add.province + add.city + add.district + add.street + add.streetNumber;
    this.communityForm["latitude"] = add.lat;
    this.communityForm["longitude"] = add.lng;
  }

  getlocLat() {
    _axios({
      url: `/map-api/v2/`,
      params: {
        address: this.communityForm["address"],
        ak: "vCZU88Guz4BmAODWTm8k9BP0WlwId1V0",
        output: "json"
      },
      method: "get"
    }).then(res => {
      if (!res.data.status) {
        this.communityForm["longitude"] = res.data.result.location.lng;
        this.communityForm["latitude"] = res.data.result.location.lat;
      } else {
        this["notify"]("warning", "警告", "没有找到对应的位置信息");
        this.communityForm["longitude"] = "";
        this.communityForm["latitude"] = "";
      }
    });
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  width: 80%;
  margin: 10px auto;
  padding-top: 20px;
}
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
  top: 12px;
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

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
  background: #ffffff;
  border: 1px solid #409eff;
}
.avatar {
  width: 80px;
  height: 80px;
  display: block;
}
.shade-position {
  position: relative;
}
.shade-position:hover .shade {
  display: block;
}
.show-img {
  width: 100px;
  height: 100px;
  border-radius: 5px;
  margin-right: 5px;
}
.shade {
  display: none;
  background-color: rgba(0, 0, 0, 0.6);
  position: absolute;
  top: 0px;
  text-align: center;
}
.el-icon-delete {
  font-size: 20px;
  color: #ffffff;
  line-height: 100px;
}
.uplolad-img {
  display: flex;
  position: relative;
  height: 100px !important;
}
.upload-btn {
  position: absolute;
  bottom: -38px;
  left: 0;
  padding: 9px 38px;
}
</style>

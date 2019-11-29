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
    <el-row :gutter="10">
      <el-col :span="24" class="table-col">
        <div class="rightContent">
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="名称">
              <el-input v-model="form.name"></el-input>
            </el-form-item>

            <el-form-item label="省">
              <el-select v-model="form.region" placeholder="请选择省">
                <el-option label="四川" value="shanghai"></el-option>
                <el-option label="浙江" value="beijing"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="市">
              <el-select v-model="form.region" placeholder="请选择市">
                <el-option label="成都" value="shanghai"></el-option>
                <el-option label="宁波" value="beijing"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="区县">
              <el-select v-model="form.region" placeholder="请选择区">
                <el-option label="金牛区" value="shanghai"></el-option>
                <el-option label="鄞州区" value="beijing"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="地址">
              <el-input v-model="form.name"></el-input>
            </el-form-item>

            <el-form-item label="图片展示">
              <el-upload
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>

            <el-form-item label="备注">
              <el-input type="textarea" v-model="form.desc"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit" style="float:right;">立即创建</el-button>
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

const ActionHeader = () => import("@/components/ActionHeader.vue");
const DataTree = () => import("@/components/DataTree.vue");

@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    DataTree
  }
})
export default class InformIssue extends Vue {
  private form: any = {
    name: "",
    region: "",
    date1: "",
    date2: "",
    delivery: false,
    type: [],
    resource: "",
    desc: ""
  };

  private imageUrl: any = "";

  private rowSpan: any = {
    row1: 4,
    row2: 20
  };

  private dialogLibrary: any = false;

  private dialogFormVisible: Boolean = false;
  private formLabelWidth: String = "120px";

  editType(item) {
    /**@description 修改状态 */
    console.log(item);
    // this.dialogFormVisible = true;
  }

  enterRowChange(row, column, cell, event) {
    /**@description hover enter tab 行 */
    row.showMenu = true;
  }

  leaveRowChange(row) {
    /**@description hover leave tab 行 */
    row.showMenu = false;
  }
  queryIdetity() {
    this.dialogLibrary = true;
  }
  onSubmit() {
    console.log("submit!");
  }

  handleAvatarSuccess(res, file) {
    this.imageUrl = URL.createObjectURL(file.raw);
  }
  beforeAvatarUpload(file) {
    const isJPG = file.type === "image/jpeg";
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isJPG) {
      this.$message.error("上传头像图片只能是 JPG 格式!");
    }
    if (!isLt2M) {
      this.$message.error("上传头像图片大小不能超过 2MB!");
    }
    return isJPG && isLt2M;
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  width: 70%;
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
.table-col {
  position: relative;
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
</style>

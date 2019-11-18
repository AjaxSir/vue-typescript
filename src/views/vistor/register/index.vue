<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="rowSpan.row1">
        <data-tree />
      </el-col>
      <el-col :span="rowSpan.row2" class="table-col">
        <div class="rightContent">
          <div class="imgInfo">
            <div class="singleImg">
              <h4>证件信息</h4>
              <img class='headImg' :src='defaultHead'>
            </div>
          </div>
          <div class="imgInfo">
            <div class="singleImg">
              <h4>来访者照片</h4>
              <img class='headImg' :src='defaultHead'>
            </div>
          </div>
          <div class='write'>
            <el-button>手动输入</el-button>
          </div>
          <div class='imgInfo' style='margin-left:80px;width:680px;height:auto;display:block'>
            <el-form style='overflow:hidden' :line='true' :model="vistorForm" label-width="80px" class="demo-form-inline">
              <el-form-item class='vistorItemForm' label="姓名:">
                <span>{{ vistorForm.name }}</span>
              </el-form-item>
              <el-form-item class='vistorItemForm' label="被访房屋:">
                <el-input style='width:200px' v-model='vistorForm.interviewedHouse'></el-input>
              </el-form-item>
              <el-form-item class='vistorItemForm' label="性别:">
                <span>{{ vistorForm.sex }}</span>
              </el-form-item>
              <el-form-item class='vistorItemForm' label="被访人员:">
                <el-input style='width:200px' v-model='vistorForm.interviewedPeople'></el-input>
              </el-form-item>
              <el-form-item class='vistorItemForm' label="民族:">
                <span>{{ vistorForm.nation }}</span>
              </el-form-item>
              <el-form-item class='vistorItemForm' label="被访事由:">
                <el-select v-model="vistorForm.matter" placeholder="请选择">
                  <el-option label="快递" value="kd"></el-option>
                  <el-option label="外卖" value="wm"></el-option>
                  <el-option label="其他" value="qt"></el-option>
                </el-select>
                <el-input v-if='vistorForm.matter === "qt"'  placeholder='填写事由'></el-input>
              </el-form-item>
              <el-form-item class='vistorItemForm' label="出生日期:">
                <span>{{ vistorForm.birthday }}</span>
              </el-form-item>
               <el-form-item class='vistorItemForm' label="同行人数:">
                <el-input style='width:200px' v-model='vistorForm.peopleNumber'></el-input>
              </el-form-item>
              <el-form-item class='vistorItemForm' label="身份证号:">
                <span>{{ vistorForm.idNumber }}</span>
              </el-form-item>
              <el-form-item class='vistorItemForm' label="手机号:">
                <el-input style='width:200px' v-model='vistorForm.peopleNumber'></el-input>
              </el-form-item>
              <el-form-item class='vistorItemForm clearBotn' label="户籍地址:">
                <span>{{ vistorForm.censusRegister }}</span>
              </el-form-item>
              <el-form-item class='vistorItemForm clearBotn' label="其他证件:">
                <el-select v-model="vistorForm.otherSredentials" placeholder="请选择">
                  <el-option label="护照" value="hz"></el-option>
                  <el-option label="驾驶证" value="jsz"></el-option>
                  <el-option label="其他" value="qt"></el-option>
                </el-select>
                <el-input v-if='vistorForm.otherSredentials === "qt"' placeholder='填写其他证件'></el-input>
              </el-form-item>
              <el-form-item class='vistorItemForm clearBotn' label="证件号:">
                <el-input style='width:200px' v-model='vistorForm.sredentialsNumber'></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class='imgInfo'  style='margin-left:80px;'>
            <el-button type='primary'>确定</el-button>
          </div>
          <div class='imgInfo'  style='margin-left:80px;'>
            <router-link :to="{path: '/vistor/record'}">
              <el-button type='primary'>查看登记记录</el-button>
            </router-link>
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
declare function require(string) :string

import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import mixin from "@/config/minxins";

const DataTree = () => import("@/components/DataTree.vue");

@Component({
  mixins: [mixin],
  components: {
    DataTree
  }
})
export default class VistorRegister extends Vue {
  private rowSpan: any = {
    row1: 4,
    row2: 20
  };
  private menuControl1: String = "menu-control";
  private menuControl2: String = "menu-visible";
  defaultHead: string = require('@/assets/defaultHead.jpg');
  vistorForm: object = {
    name: '',
    sex: '',
    nation: '',
    birthday: '',
    idNumber: '',
    censusRegister: '', // 户籍
    otherSredentials: '', // 其他证件
    sredentialsNumber: '', // 证件号
    interviewedHouse: '', // 被访房屋
    interviewedPeople: '', // 被访人员
    matter: '', // 被访事由
    peopleNumber: '', // 同行人数
    phone: '' // 电话
  }
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
.imgInfo{
  width: 360px;
  height: 200px;
  display: inline-block;
  // margin-left: 30px;
  // flex-direction: column;
  // justify-content: center;
  .singleImg{
    width: 200px;
    height: 200px;
    margin: 0 auto;
  }
}
.headImg{
  width:180px;
  height:180px;
}
.write{
  width:720px;
  height:30px;
  text-align:center;
  line-height: 30px;
}
.vistorItemForm{
  width:300px !important;
  float: left;
}
.clearBotn{
  clear: both;
}
</style>

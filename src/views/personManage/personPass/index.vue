<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <action-header
        :initFormHeader='initForm'
        @fetchData='fetchData'
        :filterForm='filterForm'
        :btnStatus='2'
        :total="page.total">
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>统计信息</el-dropdown-item>
          </el-dropdown-menu>
          <div slot="houseNum">
            <div class="word-filter">
              <span class="filter-name">单元楼:</span>
              <el-input class="input-filter" v-model='filterForm.unitHouse' size="small"></el-input>
            </div>
             <div class="word-filter">
              <span class="filter-name">姓名:</span>
              <el-input class="input-filter" v-model='filterForm.userName' size="small"></el-input>
            </div>
             <div class="word-filter">
              <span class="filter-name">时间段:</span>
              <el-date-picker
                style='width:140px'
                :picker-options='pickOptionStart'
                v-model="filterForm.startTime"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
              &nbsp;&nbsp;&nbsp; -- &nbsp;&nbsp;&nbsp;
              <el-date-picker
              style='width:140px'
                v-model="filterForm.endTime"
                :picker-options='pickOptionEnd'
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </div>
            <div class="word-filter">
              <span class="filter-name">通行方式:</span>
              <el-select class="input-filter" size="small" v-model="filterForm.passMethod" placeholder="请选择">
                <el-option label="全部" value="all"></el-option>
                <el-option label="蓝牙" value="blueTeeth"></el-option>
                <el-option label="刷脸" value="face"></el-option>
              </el-select>
            </div>
            <div class="word-filter">
              <span class="filter-name">类型:</span>
              <el-select class="input-filter" size="small" v-model="filterForm.userType" placeholder="请选择">
                <el-option label="全部" value="all"></el-option>
                <el-option label="住户" value="house"></el-option>
                <el-option label="租客" value="rent"></el-option>
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
            :data="list_data"
            stripe
            class="demo-block"
            highlight-current-row
            @cell-mouse-enter="enterRowChange"
            @cell-mouse-leave="leaveRowChange"
          >

            <el-table-column type="index" align='center' label="序号" width="50"></el-table-column>

            <el-table-column  align='center' prop="devId" label="设备编号">
              <template slot-scope="scope">
                <span class="serial-num">{{scope.row.devId}}</span>
              </template>
            </el-table-column>

            <el-table-column  align='center' prop="devId" label="单元信息"></el-table-column>

            <el-table-column align='center' prop="devType" label="设备型号">

            </el-table-column>

            <el-table-column align='center' prop="passTime" label="通行时间"></el-table-column>

            <el-table-column align='center' prop="passMethod" label="通行方式"></el-table-column>

            <el-table-column align='center' prop="userName" label="姓名"></el-table-column>

            <el-table-column align='center' prop="img" label="人脸">
              <template slot-scope="scope">
                <img
                  class="capture-img"
                  @mouseout="imgVisible=false"
                  @mouseover="imgVisible=true,bigImg=scope.row.photos"
                  :src="scope.row.photos"
                  alt
                />
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
          @current-change='pageChange'
          style="margin-top:10px;" background layout="prev, pager, next" :total="page.total"></el-pagination>
        </div>
      </el-col>
    </el-row>

    <ImageMagni :centerDialogVisible="imgVisible" bigTitle="抓拍图片" :bigImg="bigImg" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import mixin from "@/config/minxins";
const ActionHeader = () => import("@/components/ActionHeader.vue");
const ImageMagni = () => import("@/components/BigImg/index.vue");

@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    ImageMagni
  }
})
export default class PersonPass extends Vue {
  private imgVisible: Boolean = false; // 控制放大图片的visible
  private bigImg: String = ""; // 保存放大图片的地址
  filterForm: object = {
    unitHouse: '',
    userName: '',
    startTime: '',
    endTime: '',
    passMethod: 'all',
    userType: 'all'
  }
  initForm: object = {
    url: 'admin/people-pass/',
    method: 'get'
  }
  pickOptionStart:object = {}
  pickOptionEnd:object = {}
  mounted() {
    const _this = this
    this.pickOptionStart = {
        disabledDate(time){
        if (_this.filterForm['endTime'] !== "") {
            return time.getTime() > Date.now() || time.getTime() > _this.filterForm['endTime'];
          } else {
            return time.getTime() > Date.now();
        }
      }
    }
    this.pickOptionEnd = {
        disabledDate(time){
          return time.getTime() < _this.filterForm['startTime'] || time.getTime() > Date.now()
      }
    }
  }

  created() {
    this.initForm['params'] = Object.assign(this.initForm['params'], this.page, this.filterForm) // 合并参数
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

.fun-btn {
  position: absolute;
  left: -64px;
  top: 38%;
  .iconfont {
    font-size: 19px;
    color: #8091a5;
    cursor: pointer;
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

.capture-img {
  width: 30px;
  height: 30px;
}
</style>

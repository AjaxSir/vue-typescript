<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <action-header
        exportUrl='/admin/people-pass/export'
        exportName='人员通行.xls'
        ref="actionHeader"
        :initFormHeader='initForm'
        @fetchData='fetchData'
        :filterForm='filterForm'
        :btnStatus='2'
        linkUrl='/statementManage/personPassChart'
        :total="page.total">
          <el-dropdown-menu slot="dropdown" v-if='permissionList.includes("personPassChartLook")'>
            <el-dropdown-item command='link'>统计信息</el-dropdown-item>
          </el-dropdown-menu>
          <div slot="houseNum">
            <div class="word-filter">
              <span class="filter-name">用户姓名:</span>
              <el-input style='width:250px' clearable
              @keyup.enter.native="emitFetchData" placeholder="请输入需查找的姓名" class="input-filter" v-model='filterForm.userName' size="small"></el-input>
            </div>
            <div class="word-filter">
              <span class="filter-name">通行位置:</span>&nbsp;&nbsp;
              <el-autocomplete
              style="width:250px;height:32px"
                class="autoInput"
                 clearable
                @keyup.enter.native="emitFetchData"
                v-model="filterForm.bindName"
                @input='changeLoc'
                :fetch-suggestions="querySearch"
                placeholder="请输入通行位置查找"
                @select="handleSelect"
              >
              <template slot-scope="{ item }">
              <div class="value">{{ item.locationName }}</div>
            </template>
            </el-autocomplete>
            </div>
            <div class="word-filter">
              <span class="filter-name">设备区分:</span>&nbsp;
              <el-select  style="width:250px" class="input-filter" size="small" v-model="filterForm.bindType" placeholder="请选择">
                <el-option label="全部" value=""></el-option>
                <el-option label="单元楼" value="1"></el-option>
                <el-option label="进出口" value="2"></el-option>
              </el-select>
            </div>

             <div class="word-filter">
              <span class="filter-name">通行时间:</span> &nbsp;&nbsp;
              <el-date-picker
                style="width:300px;"
                  v-model="timeRange"
                  type="datetimerange"
                  range-separator="-"
                  size="small"
                  @change='timeRangeChange'
                  format='yyyy - MM - dd HH:mm:ss'
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  :clearable='true'
                  :picker-options="pickerOptions"
                  end-placeholder="结束日期">
                </el-date-picker>
            </div>
            <div class="word-filter">
              <span class="filter-name">通行方式:</span>&nbsp;
              <el-select multiple style="width:250px" class="input-filter" size="small" v-model="filterForm.passMethod" placeholder="请选择">
                <el-option label="蓝牙" value="3"></el-option>
                <el-option label="人脸" value="1"></el-option>
                <el-option label="二维码" value="2"></el-option>
                <el-option label="远程" value="4"></el-option>
                <el-option label="密码" value="5"></el-option>
                <el-option label="刷卡" value="6"></el-option>
              </el-select>
            </div>
            <div class="word-filter">
              <span class="filter-name">用户类型:</span>&nbsp;
              <el-select  style="width:250px" class="input-filter" size="small" v-model="filterForm.userType" placeholder="请选择">
                <el-option label="全部" value=""></el-option>
                <el-option label="住户" value="house"></el-option>
                <el-option label="访客" value="rent"></el-option>
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
            v-loading='showLoading'
            height='65vh'
            border
            highlight-current-row
            @cell-mouse-enter="enterRowChange"
            @cell-mouse-leave="leaveRowChange"
          >
            <el-table-column type="index" align='center' label="序号" width="50"></el-table-column>
            <el-table-column  :show-overflow-tooltip='true' align='center' prop="userName" label="姓名">
              <template slot-scope="scope">
                <span class="serial-num">{{scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column  :show-overflow-tooltip='true' align='center' prop="passMethod" label="通行方式">
              <template slot-scope="{row}">
                <span>{{ row.passMethod | passMethod }}</span>
              </template>
            </el-table-column>
            <el-table-column  :show-overflow-tooltip='true' align='center' prop="inOut" label="出入类型">
            </el-table-column>
            <el-table-column  :show-overflow-tooltip='true' width="120" align='center' prop="devId" label="设备编号">
              <template slot-scope="scope">
                <span class="serial-num">{{scope.row.serialNumber }}</span>
              </template>
            </el-table-column>
             <!-- <el-table-column align='center' prop="devPartition" label="设备区分">
               <template slot-scope="{row}">
                 <span>{{ row.devPartition }}</span>
               </template>
             </el-table-column> -->
             <el-table-column align='center' prop="devType" label="通行位置">
               <template slot-scope="scope">
                <span class="serial-num">{{scope.row.devAddress}}{{ scope.row.devSubAddress }}</span>
              </template>
             </el-table-column>
            <el-table-column  :show-overflow-tooltip='true' width="120" align='center' prop="devType" label="设备型号">
              <template slot-scope="{row}">
                <span>{{ row.devType | devType }}</span>
              </template>
            </el-table-column>
            <el-table-column  :show-overflow-tooltip='true' width="100" align='center' prop="devType" label="是否访客">
              <template slot-scope="{row}">
                <span>{{ row.isVisitor ? '是' : '否' }}</span>
              </template>
            </el-table-column>
             <el-table-column width="100" align='center' prop="img" label="抓拍人脸">
              <template slot-scope="scope">
                <img
                v-if='scope.row.photos'
                style="margin-top: 3px"
                  class="capture-img"
                  @mouseout="imgVisible=false"
                  @mouseover="imgVisible=true,bigImg=scope.row.photos,imgTitle='抓拍人脸'"
                  :src="scope.row.photos"
                  alt
                />
                <span v-else></span>
              </template>
            </el-table-column>
             <el-table-column width="100" align='center' prop="img" label="注册人脸">
              <template slot-scope="scope">
                <img
                v-if='scope.row.facePhone'
                style="margin-top: 3px"
                  class="capture-img"
                  @mouseout="imgVisible=false"
                  @mouseover="imgVisible=true,bigImg=scope.row.facePhone,imgTitle='注册人脸'"
                  :src="scope.row.facePhone"
                  alt
                />
                <span v-else></span>
              </template>
            </el-table-column>
            <el-table-column align='center' prop="passTime" label="通行时间" :show-overflow-tooltip="true"> </el-table-column>
          </el-table>
          <el-pagination
          @current-change='pageChange'
          :page-size="page.limit"
          style="margin-top:10px;" background layout="prev, pager, next" :total="page.total"></el-pagination>
        </div>
      </el-col>
    </el-row>

    <ImageMagni :centerDialogVisible="imgVisible" :bigTitle="imgTitle"  :bigImg="bigImg" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins, Watch } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import { getPassAddress } from '@/api/peopleApi.ts'
import { formatTimeObj } from '@/utils'
import mixin from "@/config/minxins";
const ActionHeader = () => import("@/components/ActionHeader.vue");
const ImageMagni = () => import("@/components/BigImg/index.vue");

@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    ImageMagni
  },
  filters: {
    passMethod(val: string) {
      const data = {
        "1": '人脸开门',
        "2": '二维码开门',
        "3": '蓝牙开门',
        "4": '远程开门',
        "5": '密码开门',
        "6": '刷卡开门'
      }
      return data[val]
    },
    devType(val:string) {
      const data = {
        "1": '门禁',
        "2": '车禁',
        "3": '注册机',
        "4": '访客机',
      }
      return data[val]
    }

  }
})
export default class PersonPass extends Vue {
  private imgVisible: Boolean = false; // 控制放大图片的visible
  private bigImg: String = ""; // 保存放大图片的地址
  imgTitle: string = '人脸'
  filterForm: object = {
    bindName:'',
    bindId: '',
    bindType: '',
    userName: '',
    startPassTime: '',
    endPassTime: '',
    passMethod: [],
    userType: '',
    isVisitor: false
  }
  timeRange: Array<string> = []
  pickerOptions: object = {
        disabledDate(time) {
        return time.getTime() > Date.now() - 8.64e7;
      }
    }
  initForm: object = {
    url: '/admin/people-pass/',
    method: 'get'
  }
  pickOptionStart:any = []
  pickOptionEnd:any = []
  @Watch('filterForm.userType')
  isVistorChange() {
    const type = this.filterForm['userType']
    this.filterForm['isVisitor'] = type === '' ? null : (type === 'house' ? false : true)
  }
  // 时间变化
    timeRangeChange(val) {
      if (val && val.length) {
        this.filterForm['startPassTime'] = val[0]
        this.filterForm['endPassTime'] =  val[1]
      } else {
        this.filterForm['startPassTime'] = ''
        this.filterForm['endPassTime'] =  ''
      }
    }
    setTime() {
      const today = new Date().getTime()
      const sevenDay = today - 30 * 24 * 60 * 60 * 1000
      this.filterForm['startPassTime'] = formatTimeObj(sevenDay, 'detail')
      this.filterForm['endPassTime'] =  formatTimeObj(today, 'detail')
      this.timeRange = [ formatTimeObj(sevenDay, 'detail'), formatTimeObj(today, 'detail') ]
    }

  created() {
    this.setTime()
    this.initForm['params'] = Object.assign(this.initForm['params'], this.page, this.filterForm) // 合并参数
  }
  // 通行位置搜索建议
  querySearch(string: string, cb) {
    let result = []
    getPassAddress(string).then(res => {
      if (res.data.data) {
        result = res.data.data
        result.splice(10)
        cb(result)
      }
    })
  }
  // 改变通行位置时 清空id
  changeLoc() {
    console.log(this.filterForm)
    this.filterForm['bindId'] = ''
  }
  // 选择搜索建议列表某项 并赋值
  handleSelect(val: object) {
    this.filterForm['bindName'] = val['locationName']
    this.filterForm['bindId'] = val['id']
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


.menu-control {
  position: absolute;
  top: 32vh;
  left: -5px;
}

.menu-visible {
  position: absolute;
  top: 32vh;
  left: -8px;
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
.floatForm{
  height: 32px;;
}
</style>

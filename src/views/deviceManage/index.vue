<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <action-header
        :initFormHeader='initForm'
        exportUrl='/v1/admin/dev-manage/export'
        exportName='设备导出.xls'
        @fetchData='fetchData'
        :filterForm='filterForm'
        :filterStatus='false'
        :dialogCreate.sync="dialogCreate"
        :total="page.total">
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="export">导出</el-dropdown-item>
          </el-dropdown-menu>
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
            style="max-height: 75vh;overflow:auto"
            highlight-current-row
            @selection-change="handleSelectionChange"
            @cell-mouse-enter="enterRowChange"
            @cell-mouse-leave="leaveRowChange"
          >
            <el-table-column align="center" type="selection" width="50"></el-table-column>

            <el-table-column align="center" class="indexNum" type="index" label="序号" width="50">
              <template slot-scope="scope">
               <span>{{scope.$index +1}}</span>
                <div class="fun-btn">
                  <el-dropdown trigger="click" placement="bottom-start" @command="commandClick">
                    <i v-show="scope.row.showMenu" class="iconfont icon-menu"></i>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item :command="returnCommand('rebind', scope.row)">重新绑定</el-dropdown-item>
                      <el-dropdown-item :command="returnCommand('delete', scope.row)">
                        {{ deleteForm.data.length ? '批量删除' : '删除' }}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </template>
            </el-table-column>

            <el-table-column align="center" prop="name" label="设备名字" width="90">
              <template slot-scope="scope">
                <el-button @click="showDetails(scope.row)" type="text">{{scope.row.name}}</el-button>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="serialNumber" label="设备编号" width="90">
            </el-table-column>
            <el-table-column align="center" prop="address" label="单元信息"></el-table-column>

            <el-table-column align="center" prop="bindingType" label="设备类型">
              <template slot-scope="{row}">
                <span>{{ row.type | devType }}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" :show-overflow-tooltip='true' prop="upTime" label="上线时间" width="160"></el-table-column>
            <el-table-column align="center" :show-overflow-tooltip='true' prop="downTime" label="离线时间" width="160"></el-table-column>

            <el-table-column align="center" prop="note" label="设备说明">
              <template slot-scope="{row}">
                <span>{{ row.note || '--' }}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" prop="type" label="状态">
              <template slot-scope="scope">
                <el-tag
                  size="small"
                  style="border-radius: 50px;padding: 0 10px; cursor: pointer;"
                  :type="scope.row.type === '1' ? 'success' : 'danger'"
                >{{ scope.row.type === '1' ? "连线中" : "离线中" }}</el-tag>
              </template>
            </el-table-column>

            <el-table-column align="center" prop="bindTime" label="绑定时间" width="220">
              <template slot-scope="{row}">
                <span>{{ row.bindTime || '--' }}</span>
                </template>
            </el-table-column>
          </el-table>
        </div>
        <el-pagination
         @current-change='pageChange' :page-size="page.limit" style="margin-top:10px;" background layout="prev, pager, next" :total="page.total"></el-pagination>
      </el-col>
    </el-row>
    <el-dialog
      class="dialog-rewrite"
      :title="detailDialogForm.name"
      :visible.sync="detailDialogVisible"
      :close-on-click-modal='false'
    >
      <el-tabs type="card" v-model="activeName">
        <el-tab-pane label="详细信息" name="first">
          <el-form label-width="100px" :model="detailDialogForm">
            <el-form-item class="marginForm" label="所属单元信息:">
              <span>{{detailDialogForm.address}}</span>
            </el-form-item>
            <el-form-item class="marginForm" label="状态:">
              <span>{{detailDialogForm.type === '1' ? "连线中" : "离线中"}}</span>
            </el-form-item>
            <el-form-item class="marginForm" label="门禁类型:">
              <span>{{detailDialogForm.type | devType}}</span>
            </el-form-item>
            <el-form-item class="marginForm" label="绑定时间:">
              <span>{{detailDialogForm.bindTime || '--'}}</span>
            </el-form-item>
            <el-form-item class="marginForm" label="设备绑定时间:">
              <span>{{detailDialogForm.bindingTime || '--'}}</span>
            </el-form-item>
            <el-form-item class="marginForm" label="创建时间:">
              <span>{{detailDialogForm.createDate || '--'}}</span>
            </el-form-item>
            <el-form-item class="marginForm" label="最后离线时间:">
              <span>{{detailDialogForm.downTime || '--'}}</span>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="门禁记录" name="second">
          <el-table :data="doorRecordTable" style="width: 100%">
            <el-table-column align="center" prop="name" label="姓名" width="150px"></el-table-column>
            <el-table-column align="passTime" prop="date" label="通行时间" width="150px"></el-table-column>
            <el-table-column align="center" prop="devAddress" label="通行地址"></el-table-column>
            <el-table-column prop="passMethod" align='center' label="抓拍图片">
              <template slot-scope="{row}">
                <img :src="row.photos" alt=""></template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="detailDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新增或修改弹出表单 -->
    <el-dialog
    :close-on-click-modal='false'
      :title="roleTitle==='0' ? '新增' : '修改'"
      :visible.sync="dialogCreate"
      width="640px"
      :before-close="handleClose"
    >
      <el-form
        ref="Forms"
        :rules="rules"
        :model="Form"
        label-position="right"
        label-width="100px"

      >
        <el-form-item class="phone-input" label="设备编号: " prop="serialNumber">
          <el-input style="width:310px" placeholder="请输入设备编号" v-model="Form.serialNumber"></el-input>
        </el-form-item>
        <el-form-item class="phone-input" label="设备进出: " prop="inOut">
          <el-switch
            v-model="Form.inOut"
            active-text="进"
            inactive-text="出"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="进"
            inactive-value="出">
          </el-switch>
        </el-form-item>
        <el-form-item class="phone-input" label="设备地址: " prop="address">
          <el-input @change="getlocLat" placeholder="输入设备所在地址" style="width:310px" v-model="Form.address"></el-input>
          <el-button @click='mapVisible = true' type='text'>地图选点</el-button>
        </el-form-item>

        <el-form-item class="phone-input" label="绑定位置: " prop="bindingAddress">
          <el-input style="width:310px" placeholder="点击右方设备绑定选择对应设备" v-model="Form.bindingAddress"></el-input>
          <el-button type='text' @click='deviceBindingVisible = true'>设备绑定</el-button>
        </el-form-item>
         <el-form-item class="phone-input" label="具体位置: " prop="subAddress">
          <el-input style="width:310px" placeholder="例如:楼上/楼下" v-model="Form.subAddress"></el-input>
        </el-form-item>
        <el-form-item class="phone-input" label="设备备注: " prop="note">
          <el-input type='textarea' placeholder="请输入设备备注" style="width:310px" v-model="Form.note"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="confirmBind">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 设备绑定 -->
    <el-dialog :close-on-click-modal='false' width='600px' title="设备绑定" :visible.sync="deviceBindingVisible">
      <el-form :model="Form">
        <el-form-item label="设备区分:" :label-width="formLabelWidth">
          <el-select
            @change='bindingTypeChange'
            style="width:310px;"
            v-model="Form.bindingType"
            placeholder="请选择设备区分"
          >
            <el-option label="单元楼" value="1"></el-option>
            <el-option label="出入口" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-table
        :data="deviceBindingData"
        style="width: 100%">
        <el-table-column
          type='index'
          label="序号"
          align='center'
          width="50">
        </el-table-column>
        <el-table-column
          prop="name"
          align='center'
          label="设备名">
        </el-table-column>
        <el-table-column
          prop="locationName"
          align='center'
          label="地址">
          <template slot-scope="{row}">
            <span>{{ row.locationName || '暂无' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="note"
          align='center'
          label="备注">
           <template slot-scope="{row}">
          <span>{{ row.note || '暂无' }}</span>
        </template>
        </el-table-column>

        <el-table-column
          prop="address"
          align='center'
          label="操作">
          <template slot-scope="{row}">
            <el-button :style="{ 'color': row.bindStatus ? 'red' : '#409EFF' }" type='text' @click='bindDevice(row)'>{{ row.bindStatus ? '当前绑定' : '点击绑定' }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deviceBindingVisible = false">取 消</el-button>
        <el-button type="primary" @click="deviceBindingVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 设备地址选择 -->
    <el-dialog :close-on-click-modal='false' title="选取设备地址" :visible.sync="mapVisible">
      <el-input v-model="Form.address" placeholder="输入设备地址"></el-input>
      <BaiduMap @pointClick='pointClick' :keyword='Form.address' />
      <div slot="footer" class="dialog-footer">
        <el-button @click="mapVisible = false">取 消</el-button>
        <el-button type="primary" @click="mapVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import mixin from "@/config/minxins";
import { createDevice } from '@/api/deviceApi.ts'
import { debounce } from '@/utils'
import axios from 'axios'
import { searchHouse, getInoutList } from '@/api/houseApi.ts'
import { getUserPass } from '@/api/peopleApi.ts'
const ActionHeader = () => import("@/components/ActionHeader.vue");
const BaiduMap = () => import('@/components/baiduMap/index.vue')
@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    BaiduMap
  },
  filters: {
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
export default class DeviceManage extends Vue {
  filterForm: object = {
    loc: '',
    deviceStatus: ''
  } // 筛选条件
  initForm:object = {
    url: '/admin/dev-manage/page-query',
    method: 'get'
  }
  deleteForm: object = {
    url: '/admin/dev-manage/batch-delete',
    method: 'delete',
    data: []
  }
  mapVisible: boolean = false // 地图显示框状态
  activeName: string = "first";
  detailDialogVisible: boolean = false; // 设备详情dialog弹框状态
  private formLabelWidth: String = "120px";
  detailDialogForm: Object = {}; // 设备详情
  doorRecordTable: Array<Object> = []; // 设备抓拍的通行记录
  private roleTitle: String = "0";
  private Form: Object = { // 创建设备表单
    address: '',
    bindingId:'',
    bindingAddress: '',
    bindingType: '1',
    inOut: '出',
    latitude: '',
    longitude:'',
    note: '',
    serialNumber: '',
    subAddress: ''
  };
  deviceBindingVisible: boolean = false // 设备绑定dialog状态
  deviceBindingData: Array<Object> = [
  ]
  rules: object =
    {
      serialNumber: [
            { required: true, message: '请输入设备编号', trigger: 'blur' }
          ],
      address: [
            { required: true, message: '请输入设备所在位置', trigger: 'blur' }
          ],
      bindingAddress: [
            { required: true, message: '请选择设备绑定位置', trigger: 'blur' }
          ],
      subAddress: [
            { required: true, message: '请选择设备具体绑定位置(楼上/楼下)', trigger: 'blur' }
          ]
    }
  deviceId: string = ''
  created() {
    this.fetchBuilding()
    this.initForm['params'] = Object.assign(this.initForm['params'], this.page, this.filterForm) // 合并参数
  }
    /** 获取经纬度 */
    getlocLat() {
      axios({
        url: `/map-api/v2/`,
        params: {
          address: this.Form['address'],
          ak: 'vCZU88Guz4BmAODWTm8k9BP0WlwId1V0',
          output: 'json'
        },
        method: 'get'
      }).then(res => {
        if (!res.data.status) {
          this.Form['longitude'] = res.data.result.location.lng
          this.Form['latitude'] = res.data.result.location.lat
        } else {
          this.$message({
            message: '没有找到对应的位置信息',
            type: 'error'
          })
          this.Form['longitude'] = ''
          this.Form['latitude'] = ''
        }
      })
    }
  // 点击地图选取地址
  pointClick(Object: object) {
    this.Form['address'] = Object['province'] + Object['city'] + Object['district'] + Object['street']
    this.Form['latitude'] = Object['lat']
    this.Form['longitude'] = Object['lng']
    console.log(1)
  }
  // 获取单元楼列表
  fetchBuilding() {
    searchHouse().then(res => {
      res.data.data.forEach(element => {
        this.$set(element, 'bindStatus', false)
      });
      this.deviceBindingData = res.data.data
    })
  }
  // 绑定设备
  bindDevice(row) {
    if (row.bindStatus) {
      return row.bindStatus = false
    }
    this.deviceBindingData.forEach(ele => {
      ele['bindStatus'] = false
    })
    row.bindStatus = true
    this.Form['bindingId'] = row.id
    this.Form['bindingAddress'] = row.locationName || '暂无'
  }
  // 获取出入口列表
  fetchInputList() {
    getInoutList().then(res => {
      res.data.data.forEach(element => {
        this.$set(element, 'bindStatus', false)
      });
      this.deviceBindingData = res.data.data
    })
  }
  // 切换单元楼/出入口
  bindingTypeChange(val: string) {
    return val === '1' ? this.fetchBuilding() : this.fetchInputList()
  }
  // 确定绑定设备
  confirmBind() {
    this.$refs['Forms']["validate"](valid => {
      if(valid) {
        console.log(this.Form)
        if (this.Form['longitude'] === '' || this.Form['latitude'] === '') {
          return this.$message.error('请输入正确的设备地址')
        } else {
          createDevice(this.Form).then(res => {
            if(res.data.code === 200) {
              this['handleClose']()
              this['fetchData'](this.initForm)
            }
          })
        }
      }
    })
  }
  /*** 查看设备详情*/
  showDetails(row) {
    this.detailDialogVisible = true;
    this.deviceId = row.id
    this.detailDialogForm = Object.assign({}, row);
    this.deviceRecord(1)
  }
  // 查看该设备的抓拍记录
  deviceRecord(page: number) {
    getUserPass({ devId: this.deviceId, page, limit: 10  }).then(res => {
      console.log(res)
    })
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
  width: 60px;
}
.marginForm{
  margin-bottom: 0px;
}
</style>

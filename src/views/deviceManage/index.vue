<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <action-header
        :initFormHeader='initForm'
        @fetchData='fetchData'
        :filterForm='filterForm'
        :dialogCreate.sync="dialogCreate"
        :total="1">
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>导出</el-dropdown-item>
          </el-dropdown-menu>
          <div slot="houseNum">
            <span class="word-filter">
              <span class="filter-name">状态:</span>
              <el-select v-model="filterForm.deviceStatus" placeholder="请选择" class="input-filter" size="small">
                <el-option label="全部" value="all"></el-option>
                <el-option label="离线" value="offline"></el-option>
                <el-option label="在线" value="online"></el-option>
              </el-select>
            </span>
            <span class="word-filter">
              <span class="filter-name">位置:</span>
              <el-input class="input-filter" v-model='filterForm.loc' size="small"></el-input>
            </span>
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
            <el-table-column align="center" type="selection" width="50"></el-table-column>

            <el-table-column align="center" type="index" label="序号" width="50"></el-table-column>

            <el-table-column align="center" prop="name" label="设备编号" width="90">
              <template slot-scope="scope">
                <el-button @click="showDetails(scope.row)" type="text">{{scope.row.name}}</el-button>
                <div class="fun-btn">
                  <el-dropdown trigger="click" placement="bottom-start" @command="commandClick">
                    <i v-show="scope.row.showMenu" class="iconfont icon-menu"></i>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item :command="returnCommand('rebind', scope.row)">重新绑定</el-dropdown-item>
                      <el-dropdown-item :command="returnCommand('delete', scope.row)">删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </template>
            </el-table-column>

            <el-table-column align="center" prop="houseRelative" label="单元信息"></el-table-column>

            <el-table-column align="center" prop="carNum" label="设备型号"></el-table-column>

            <el-table-column align="center" prop="createDate" label="上线时间" width="160"></el-table-column>
            <el-table-column align="center" prop="createDate" label="离线时间" width="160"></el-table-column>

            <el-table-column align="center" prop="num" label="设备说明"></el-table-column>

            <el-table-column align="center" prop="type" label="状态">
              <template slot-scope="scope">
                <el-tag
                  size="small"
                  style="border-radius: 50px;padding: 0 10px; cursor: pointer;"
                  :type="scope.row.type === 1 ? 'success' : 'danger'"
                >{{ scope.row.type === 1 ? "连线中" : "离线中" }}</el-tag>
              </template>
            </el-table-column>

            <el-table-column align="center" prop="createDate" label="绑定时间" width="220"></el-table-column>
          </el-table>
        </div>
        <el-pagination style="margin-top:10px;" background layout="prev, pager, next" :total="2"></el-pagination>
      </el-col>
    </el-row>
    <el-dialog
      class="dialog-rewrite"
      :title="detailDialogForm.name"
      :visible.sync="detailDialogVisible"
    >
      <el-tabs type="card" v-model="activeName">
        <el-tab-pane label="详细信息" name="first">
          <el-form label-width="100px" :model="detailDialogForm">
            <el-form-item label="所属单元信息:">
              <span>{{detailDialogForm.houseRelative}}</span>
            </el-form-item>
            <el-form-item label="状态:">
              <span>{{detailDialogForm.type === 1 ? "连线中" : "离线中"}}</span>
            </el-form-item>
            <el-form-item label="门禁类型:">
              <span>{{detailDialogForm.carNum}}</span>
            </el-form-item>
            <el-form-item label="上线时间:">
              <span>{{detailDialogForm.createDate}}</span>
            </el-form-item>
            <el-form-item label="创建时间:">
              <span>{{detailDialogForm.createDate}}</span>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="门禁记录" name="second">
          <el-table :data="doorRecordTable" style="width: 100%">
            <el-table-column align="center" prop="name" label="姓名" width="150px"></el-table-column>
            <el-table-column align="center" prop="date" label="通行时间" width="150px"></el-table-column>
            <el-table-column align="center" prop="address" label="通行地址"></el-table-column>
            <el-table-column align="center" prop="address" label="抓拍图片"></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="detailDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新增或修改弹出表单 -->
    <el-dialog
      :title="roleTitle==='0' ? '新增' : '修改'"
      :visible.sync="dialogCreate"
      width="640px"
      :before-close="handleClose"
    >
      <el-form
        ref="dataForm"
        :model="deciceForm"
        label-position="right"
        label-width="100px"

      >
        <el-form-item class="phone-input" label="设备名称: " prop="title">
          <el-input style="width:310px" v-model="deciceForm.title"></el-input>
        </el-form-item>
        <el-form-item class="phone-input" label="设备进出: " prop="title">
          <el-input style="width:310px" v-model="deciceForm.inOut"></el-input>
        </el-form-item>
        <el-form-item class="phone-input" label="设备地址: " prop="limitHouse">
          <el-select
            style="width:310px;"
            v-model="deciceForm.limitHouse"
            multiple
            placeholder="请选择发布对象"
          >
            <el-option
              v-for="item in meetingLoc"
              :key="item.id"
              :label="item.name + '-' + item.unit"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-button type='text'>地图选点</el-button>
        </el-form-item>

        <el-form-item class="phone-input" label="绑定设备: " prop="title">
          <el-input style="width:310px" v-model="deciceForm.title"></el-input>
          <el-button type='text' @click='deviceBindingVisible = true'>设备绑定</el-button>
        </el-form-item>
        <el-form-item class="phone-input" label="设备说明: " prop="title">
          <el-input style="width:310px" v-model="deciceForm.info"></el-input>
        </el-form-item>
        <el-form-item class="phone-input" label="效验码: " prop="verification">
          <el-input v-model="deciceForm.verification" placeholder="请输入效验码"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleClose">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 设备绑定 -->
    <el-dialog width='600px' title="设备绑定" :visible.sync="deviceBindingVisible">
      <el-form :model="deciceForm">
        <el-form-item label="选择设备:" :label-width="formLabelWidth">
          <el-select
            style="width:310px;"
            v-model="deciceForm.limitHouse"
            multiple
            placeholder="请选择发布对象"
          >
            <el-option
              v-for="item in meetingLoc"
              :key="item.id"
              :label="item.name + '-' + item.unit"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备区分:" :label-width="formLabelWidth">
         住宅
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
          label="名称">
        </el-table-column>
        <el-table-column
          prop="status"
          align='center'
          label="状态">
        </el-table-column>
        <el-table-column
          prop="address"
          align='center'
          label="操作">
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deviceBindingVisible = false">取 消</el-button>
        <el-button type="primary" @click="deviceBindingVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import mixin from "@/config/minxins";

const ActionHeader = () => import("@/components/ActionHeader.vue");

@Component({
  mixins: [mixin],
  components: {
    ActionHeader
  }
})
export default class DeviceManage extends Vue {
  filterForm: object = {
    loc: '',
    deviceStatus: 'all'
  } // 筛选条件
  initForm:object = {
    url: '/admin/dev-manage',
    method: 'get'
  }
  deleteForm: object = {
    url: '/admin/dev-manage',
    method: 'delete',
    params: {
      id: '111'
    }
  }
  activeName: string = "first";
  detailDialogVisible: boolean = false; // 设备详情dialog弹框状态
  private formLabelWidth: String = "120px";
  detailDialogForm: Object = {}; // 设备详情
  doorRecordTable: Array<Object> = []; // 设备抓拍的通行记录
  private roleTitle: String = "0";
  private deciceForm: Object = { // 创建设备表单
    name: null,
    region: null,
    desc: null,
    verification: null,
    info: '',
    inOut: ''
  };
  private meetingLoc: Array<Object> = [
    {
      id: "0",
      name: "北门",
      unit: "1-1-102"
    },
    {
      id: "1",
      name: "北门",
      unit: "1-1-102"
    },
    {
      id: "2",
      name: "北门",
      unit: "1-1-102"
    }
  ];
  deviceBindingVisible: boolean = false // 设备绑定dialog状态
  deviceBindingData: Array<Object> = [
    {
      name: '1期-1栋-2单元',
      status: '在线'
    },
    {
      name: '1期-2栋-2单元',
      status: '离线'
    }
  ]
  created() {
    this.initForm['params'] = Object.assign(this.initForm['params'], this.page, this.filterForm) // 合并参数
  }
  /**
   * 查看设备详情
   */
  showDetails(row) {
    this.detailDialogVisible = true;
    this.detailDialogForm = Object.assign({}, row);
  }
  handleClose() {
    this.roleTitle = "0";
    this['dialogCreate'] = false
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
</style>

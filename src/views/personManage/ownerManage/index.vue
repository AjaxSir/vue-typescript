<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <ActionHeader
        exportUrl='/v1/admin/usrUser/export'
        exportName='用户管理.xls'
        :initFormHeader="initForm"
          @fetchData="fetchData"
          :filterForm="filterForm"
        :dialogCreate.sync="dialogCreate" :total="1">
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>导入</el-dropdown-item>
            <el-dropdown-item command='export'>导出</el-dropdown-item>
            <el-dropdown-item>统计信息</el-dropdown-item>
          </el-dropdown-menu>
          <div slot="houseNum">
            <div class="word-filter">
              <span class="filter-name">姓&nbsp;&nbsp;&nbsp;名:</span>
              <el-input class="input-filter" v-model="filterForm.name" size="small"></el-input>
            </div>
            <div class="word-filter">
              <span class="filter-name">手机号:</span>
              <el-input class="input-filter" v-model="filterForm.phone" size="small"></el-input>
            </div>
            <div class="word-filter">
              <span class="filter-name">用户类型:</span>
              <el-select class="input-filter" size="small" v-model="filterForm.type" placeholder="请选择">
                <el-option label="租客" value="all"></el-option>
                <el-option label="业主" value="owner"></el-option>
              </el-select>
            </div>
            <div class="word-filter">
              <span class="filter-name">房号:</span>
              <el-input class="input-filter" v-model="filterForm.houseNo" size="small"></el-input>
            </div>
          </div>
        </ActionHeader>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="24">
        <div class="rightContent">
          <el-table :data="list_data" border
          highlight-current-row
          v-loading='showLoading'
          :span-method="objectSpanMethod"
          @selection-change="handleSelectionChange"
            @cell-mouse-enter="enterRowChange"
            @cell-mouse-leave="leaveRowChange">
            <el-table-column type="selection" align="center"></el-table-column>
            <el-table-column type="index" width="60" align="center" label="编号"></el-table-column>
            <el-table-column align="center" class="serial-num" label="姓名">
              <template slot-scope="{row}">
                <el-button style="padding:0px;" type="text" @click="showDetail(row)">{{row.name }}</el-button>
                <div class="fun-btn">
                  <el-dropdown trigger="click" placement="bottom-start" @command='commandClick'>
                    <i v-show="row.showMenu" class="iconfont icon-menu"></i>
                    <el-dropdown-menu slot="dropdown">
                      <!-- <el-dropdown-item :command='returnCommand("update", row)'>修改</el-dropdown-item> -->
                      <el-dropdown-item :command='returnCommand("delete", row)'>删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="phone" align="center" label="电话">
              <template slot-scope="{row}">
                <span class="rowUpdate" v-if='!row.phoneStatus'  @click='row.phoneStatus = !row.phoneStatus'>{{ row.phone }}</span>
                <el-input v-else @blur="phoneBlur(row)" @keyup.enter.native="confirmUpdatePhone(row)" v-model="phoneString" placeholder="输入电话"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="sex" align="center" label="性别"></el-table-column>
            <el-table-column prop="img" align="center" label="人脸">
              <template slot-scope="scope">
                <img
                  class="capture-img"
                  @mouseout="imgVisible=false"
                  @mouseover="imgVisible=true,bigImg=scope.row.face"
                  :src="scope.row.face"
                  alt
                />
              </template>
            </el-table-column>
            <el-table-column prop="note" align="center" label="用户备注">
              <template slot-scope="{row}">
                <span class="rowUpdate" v-if='!row.noteStatus' @click='row.noteStatus = !row.noteStatus'>{{ row.note }}</span>
                <el-input type='textarea'  @keyup.enter.native="confirmUpdateNote(row)" @blur="noteBlur(row)" v-model="noteString" v-else placeholder="输入备注"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="car" align="center" label="访客车辆">
              <template slot-scope="{row}">
                <span>{{ row.house[0] && row.house[0].enableInviteCar === '1' ? '允许' : '禁止' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="car" align="center" label="邀请访客">
               <template slot-scope="{row}">
                <span>{{ row.house[0] && row.house[0].enableInviteVisitor === '1' ? '允许' : '禁止' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="house_info" align="center" label="房屋信息">
              <template slot-scope="{row}">
                <span>{{ row.house[0] && row.house[0].buildingName || '--' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="far_door" align="center" label="远程开门">
              <template slot-scope="{row}">
                <span>{{ row.house[0] && row.house[0].enableRemoteOpen === '1' ? '允许' : '禁止' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="far_door" align="center" label="用户类型">
              <template slot-scope="{row}">
                <span>{{ row.house[0] && row.house[0].type | typeFilter }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="expire_time" align="center" label="过期时间">
              <template slot-scope="{row}">
                <span>{{ row.house[0] && row.house[0].overTime }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="status" align="center" label="状态">
              <template slot-scope="{row}">
                <span>{{  row.house[0] && row.house[0].status | statusFilter}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="detail" align="center" label="房屋备注">
              <template slot-scope="{row}">
                <span>{{ row.house[0] && row.house[0].note || '--' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="create_time" align="center" label="创建时间">
              <template slot-scope="{row}">
                <span>{{  row.house[0] && row.house[0].createTime }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <el-pagination
         @current-change='pageChange'
        style="margin-top:10px;" background layout="prev, pager, next" :total="page.total"></el-pagination>
      </el-col>
    </el-row>

    <el-dialog :close-on-click-modal='false' class="dialog-rewrite" :title="detailDialog.name" :visible.sync="dialogFormVisible">
      <el-tabs type="card" v-model="activeName">
        <el-tab-pane label="详细信息" name="first">
          <p class="detai-info">关联房屋:{{detailDialog.houseRelative}}</p>
          <p class="detai-info">最近刷卡时间:{{detailDialog.createDate}}</p>
        </el-tab-pane>
        <el-tab-pane label="通行记录" name="second">
          <el-table :data="dtailTable" style="width: 100%">
            <el-table-column prop="name" label="姓名" width="150px"></el-table-column>
            <el-table-column prop="date" label="通行时间" width="150px"></el-table-column>
            <el-table-column prop="address" label="通行地址"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="车辆信息" name="third">
          <el-table :data="carDtailTable" style="width: 100%">
            <el-table-column prop="date" label="车牌号"></el-table-column>
            <el-table-column prop="name" label="所属房屋"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="房屋信息" name="fivw">
          <el-table :data="houseDtailTable" style="width: 100%">
            <el-table-column prop="name" label="房屋"></el-table-column>
            <el-table-column prop="date" label="类型"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="人脸库信息" name="seven">
          <el-table :data="faceDtailTable" style="width: 100%">
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="date" label="性别"></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :close-on-click-modal='false' title="提示" :visible.sync="dialogCreate" width="30%" :before-close="handleClose">
          <el-form :model="Form" :rules="rules" ref='Forms' label-width="55px">


            <el-form-item class="floatForm" label="姓名:"  prop='name'>
              <el-input v-model="Form.name" placeholder='输入姓名'></el-input>
            </el-form-item>
            <el-form-item label="性别:" prop='sex'>
              <el-switch
                v-model="Form.sex"
                 active-value="1"
                inactive-value="0"
                active-text="男"
                inactive-text="女">
              </el-switch>
            </el-form-item>
            <el-form-item class="floatForm" label="电话:"  prop='phone'>
              <el-input v-model="Form.phone" placeholder='输入电话'></el-input>
            </el-form-item>
          <!-- </el-form> -->
      <!-- <el-form :model="Form" style="overflow:hidden" :rules="rules" ref='Forms' label-width="50px"> -->
            <el-form-item class="floatForm" label="卡名:"  prop='cardName'>
              <el-input v-model="Form.cardName"  placeholder='输入卡名'></el-input>
            </el-form-item>
            <el-form-item class="floatForm" label="卡号:"  prop='cardNo'>
              <el-input v-model="Form.cardNo" placeholder='输入卡号'></el-input>
            </el-form-item>
            <el-form-item label="房屋:" style='clear:both'  prop='houseName'>
              <el-autocomplete
                class="floatForm"
                v-model="Form.houseName"

                :fetch-suggestions="querySearch"
                placeholder="房屋搜索查找需要关联的房屋"
                @select="handleSelect"
              >
              <template slot-scope="{ item }">
              <div class="value">{{ item.name }}</div>
            </template></el-autocomplete>
            </el-form-item>
            <el-form-item label="已选:"  prop='house'>
              <div v-if='Form.house.length'>
                <div v-for='(item, index) in Form.house' :key='index'>
                  {{item.buildingName}}
                  <el-button type='text' @click='updateAddHouse(index, item)'>编辑</el-button>
                  <el-button type='text' @click='deleteAddHouse(index)'>删除</el-button>
                </div>
              </div>
              <span v-else>通过上面房屋搜索查找需要关联的房屋</span>
            </el-form-item>
            <el-form-item label="备注:"  prop='note'>
              <el-input type='textarea' v-model="Form.note" placeholder='输入备注'></el-input>
            </el-form-item>
          </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogCreate = false">取 消</el-button>
        <el-button type="primary" @click="addUserConfirm">确 定</el-button>
      </span>
      <!-- 增加房屋时修改房屋 -->
    </el-dialog>
    <el-dialog :close-on-click-modal='false' width="600px" title="修改房屋" :visible.sync="updateHouseVisible">
      <el-form :model="updateHouseForm" label-width="80px">
        <el-form-item label="用户类型" >
          <el-select v-model="updateHouseForm.type" placeholder="请选择">
            <el-option label="业主" value="1"></el-option>
            <el-option label="租户" value="2"></el-option>
            <el-option label="成员" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="房屋状态">
          <el-select v-model="updateHouseForm.status" placeholder="请选择活动区域">
            <el-option label="在住" value="0"></el-option>
            <el-option label="不在住" value="-1"></el-option>
            <el-option label="过期" value="-2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if='updateHouseForm.type !== "1"' label="过期时间">
          <el-date-picker
            format='yyyy-MM-dd HH:mm:ss'
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="updateHouseForm.overTime"
            type="datetime"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="邀请访客">
          <el-switch
            v-model="updateHouseForm.enableInviteVisitor"
            active-text="允许"
            active-value="1"
            inactive-value="0"
            inactive-text="禁止">
          </el-switch>
        </el-form-item>
        <el-form-item label="邀请车辆">
          <el-switch
            v-model="updateHouseForm.enableInviteCar"
            active-value="1"
            inactive-value="0"
            active-text="允许"
            inactive-text="禁止">
          </el-switch>
        </el-form-item>
        <el-form-item label="远程开门">
          <el-switch
            v-model="updateHouseForm.enableRemoteOpen"
            active-value="1"
            inactive-value="0"
            active-text="允许"
            inactive-text="禁止">
          </el-switch>
        </el-form-item>
        <el-form-item label="备注:"  prop='note'>
              <el-input type='textarea' v-model="updateHouseForm.note" placeholder='输入备注'></el-input>
            </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateHouseVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmHouse">确 定</el-button>
      </div>
    </el-dialog>
    <BigImg :centerDialogVisible="imgVisible" bigTitle="抓拍图片" :bigImg="bigImg" />
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import { addPeople,
  updateUserPhone,
  updateUserNote } from '@/api/peopleApi.ts'
import _axios from '@/plugins/axios.js'
import mixin from "@/config/minxins";
import { searchSuggestHouse } from '@/api/houseApi.ts'
const ActionHeader = () => import("@/components/ActionHeader.vue");
const DiaLog = () => import("@/components/dialog.vue");
const BigImg = () => import("@/components/BigImg/index.vue");
@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    DiaLog,
    BigImg
  },
  filters: {
    statusFilter(val: string){
      const data = {
        "0": '在住',
        "-1": '不在住',
        "-2": '过期'
      }
      return data[val]
    },
    typeFilter(val: string) {
      const data = {
        "1": '业主',
        "2": '租户',
        "3": '成员'
      }
      return data[val]
    }
  }
})
export default class OwnerManage extends Vue {
  private activeName: string = "first";
  private dialogFormVisible: boolean = false;
  UserType: string = "owner";
  spanArray:Array<number> = [] // 合并单元格
  index: number = 0 // 合并单元格参数
  private detailDialog: Object = {
    name: ""
  }
  phoneString:string = '' // 需要改成的电话
  noteString: string = '' // 需要改成的备注
  houseIndex: number = 0
  updateHouseVisible: boolean = false // 修改房屋弹框
  Form: any = {
    name: '',
    cardName: '',
    cardNo: '',
    sex: '1',
    phone: '',
    house: [],
    note: '',
    houseName: ''
  }
  updateHouseForm: object = {} // 增加用户时修改房屋的属性
  initForm: object = {
    url: '/admin/usrUser/list',
    method: 'get'
  }
  filterForm: object = {
    name: '',
    phone: '',
    houseNo: '',
    type: ''
  }
  deleteForm: object = {
    url: '/admin/usrUser',
    method: 'delete',
    data: []
  }
  updateArray: Array<string> = ['noteStatus', 'phoneStatus']
  rules: any = {
    name: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ],
    phone: [
            { required: true, message: '请输入电话', trigger: 'blur' }
          ]
  }
  private imgVisible: Boolean = false; // 控制放大图片的visible
  private bigImg: String = ""; // 保存放大图片的地址

  private dtailTable: Array<Object> = [
    {
      date: "2016-05-02",
      name: "王小虎",
      address: "上海市普陀区金沙江路 1518 弄"
    }
  ];
  private carDtailTable: Array<Object> =[
    {
      date: "川AXXXX",
      name: "XXXXX"
    }
  ];
  private houseDtailTable: Array<Object> =[
    {
      date: "业主",
      name: "1-1-101"
    }
  ];
  private faceDtailTable: Array<Object> =[
    {
      date: "男",
      name: "zhangsan"
    }
  ];
  created() {
    this.initForm['params'] = Object.assign(this.initForm['params'], this.page, this.filterForm) // 合并参数
  }
  // 确定添加用户
  addUserConfirm() {
    this.$refs['Forms']['validate']((valid) => {
      if(valid) {
        if (!this.Form['house'].length) {
          this.$message.error('未选择房屋')
          return
        }
        addPeople(this.Form).then(res => {
          if(res.data.code === 200) {
            this.$message.success('添加成功')
            this['dialogCreate'] = false
            this.fetchData(this.initForm)
          }
        })
      }
    })

  }
  // 修改电话离开输入框
  phoneBlur(row) {
    row.phoneStatus = false
    this.phoneString = ''
  }
  // 修改备注离开输入框
  noteBlur(row) {
    row.noteStatus = false
    this.noteString = ''
  }
  // 确定修改 电话
  confirmUpdatePhone(row) {
    if(!(/^1[3456789]\d{9}$/.test(this.phoneString))){
      this.$message.error('请输入正确的手机格式');
      return
    }
    updateUserPhone(row.id, this.phoneString).then(res => {
      if (res.data.code === 200) {
        this.$message.success('修改成功')
        row.phoneStatus = false
        this.phoneString = ''
        this.fetchData(this.initForm)
      } else {
        this.$message.error(res.data.message)
      }
    })
  }
  // 确定修改 备注
  confirmUpdateNote(row) {
    updateUserNote(row.id, this.noteString).then(res => {
      if (res.data.code === 200) {
        this.$message.success('修改成功')
        row.noteStatus = false
        this.noteString = ''
        this.fetchData(this.initForm)
      } else {
        this.$message.error(res.data.message)
      }
    })
  }
  // 打开修改房屋的状态
  updateAddHouse(index, item) {
    this.houseIndex = index
    this.updateHouseVisible = true
    this.updateHouseForm = Object.assign({}, item)
    console.log(this.updateHouseForm)
  }
  // 将重新定义的数据 换到 house字段去
  confirmHouse() {
    if (this.updateHouseForm['type'] !== '1') {
      if (this.updateHouseForm['overTime'] === '' || this.updateHouseForm['overTime'] === null) {
        this.$message.error('租客和成员需要添加过期时间!')
        return
      }
    }
    this.Form['house'][this.houseIndex] = Object.assign({}, this.updateHouseForm)
    this.updateHouseVisible = false
    this.updateHouseForm = {}
  }
  // 重写fetchdata函数
  fetchData(option: object) {
    this['list_data'] = []
    for (let key in option['params']) {
      if (option['params'][key] === '') {
        option['params'][key] = null
      }
    }
    this['showLoading'] = true;
    _axios(option).then((res: any) => {
      if (res.data && res.data.data) {
        this.page['total'] = res.data.data.total

        res.data.data.records.forEach((ele: object) => {
           let singleObj = {}
          if (ele['house'].length > 1) {
            ele['house'].forEach(item => {
              singleObj = Object.assign({}, ele)
              singleObj['house'] = []
              singleObj['showMenu'] = false
              singleObj['house'].push(item)
              this['list_data'].push(singleObj)
            })
          } else {
            ele['showMenu'] = false
             this['list_data'].push(ele)
          }

          // ele['showMenu'] = false
        })
        this['list_data'].forEach(ele => {
          this['updateArray'].forEach((itemStatus: string) => {
            ele[itemStatus] = false
          })
        })
        // this['list_data'] = res.data.data.records
        this['showLoading'] = false
        this.spanArray = []
        this.index = 0
        this['list_data'].forEach((item, index) => {
         item.index = index
         if(index === 0) {
          this.spanArray.push(1)
         } else {
           if (item.id === this['list_data'][index - 1].id) {
             this.spanArray[this.index] += 1
             this.spanArray.push(0)
           } else {
             this.index = index
             this.spanArray.push(1)
           }
         }
       })
      }
    })
  }
  // 添加房屋时删除房屋
  deleteAddHouse(index) {
    this.Form.house.splice(index, 1)
  }
  // 选择搜索建议列表某项 并赋值
  handleSelect(val: object) {
    let Obj = {
      buildingName: '',
      type: '1',
      status: '0',
      overTime: null,
      note: '',
      houseId: '',
      enableRemoteOpen: '1',
      enableInviteCar: "0",
      enableInviteVisitor: "0",
    }
    Obj.houseId = val['id']
    Obj.buildingName = val['name']
    this.Form.house.push(Obj)
    // console.log(Obj)
  }
  // 房屋搜索建议
  querySearch(string: string, cb) {
    let result = []
    searchSuggestHouse(string).then(res => {
      if (res.data.data) {
        result = res.data.data
        result.splice(10)
        console.log(result)
        cb(result)
      }
    })
  }
  // 合并单元格
  objectSpanMethod({row, column, rowIndex, columnIndex}) {
      if(columnIndex === 0 || columnIndex === 1
       || columnIndex === 2 || columnIndex === 3
       || columnIndex === 4 || columnIndex === 5
       || columnIndex === 6) {
        const _row_1 = this.spanArray[rowIndex];
        const _col_1 = _row_1 > 0 ? 1 : 0; //如果被合并了_row=0则它这个列需要取消
        return {
          rowspan: _row_1,
          colspan: _col_1
        }
      }
  }
  /**
   * row 列表数据
   */
  showDetail(row) {
    this.dialogFormVisible = true;
    this.detailDialog = Object.assign(this.detailDialog, row);
  }
}
</script>

<style lang="scss" scoped>
.mainAddContain{
  width: 100%;
  height: 200px;
  display: flex;
  .pic{
    width: 140px;;
    height: 140px;
    flex: none;
    overflow: hidden;
    border: 1px dotted gray;
    font-size: 48px;
    text-align: center;
    line-height: 140px;
    border-radius: 10px;
  }
  .form{
    flex: 1;
  }

}
  .floatForm{
    width: 50%;
    float: left;
    position: relative;
    z-index: 999;
  }
.leftContent {
  flex: none;
  width: 200px;
}
.rightContent {
  flex: 1;
  box-shadow: 0px 6px 5px 0px lightgray;
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
</style>

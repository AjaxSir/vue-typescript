<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <ActionHeader :dialogCreate.sync="dialogCreate" :total="1">
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>导入</el-dropdown-item>
            <el-dropdown-item>导出</el-dropdown-item>
            <el-dropdown-item>统计信息</el-dropdown-item>
          </el-dropdown-menu>
          <div slot="houseNum">
            <div class="word-filter">
              <span class="filter-name">姓&nbsp;&nbsp;&nbsp;名:</span>
              <el-input class="input-filter" size="small"></el-input>
            </div>
            <div class="word-filter">
              <span class="filter-name">手机号:</span>
              <el-input class="input-filter" size="small"></el-input>
            </div>
            <div class="word-filter">
              <span class="filter-name">用户类型:</span>
              <el-select class="input-filter" size="small" v-model="UserType" placeholder="请选择">
                <el-option label="租客" value="all"></el-option>
                <el-option label="业主" value="owner"></el-option>
              </el-select>
            </div>
            <div class="word-filter">
              <span class="filter-name">房号:</span>
              <el-input class="input-filter" size="small"></el-input>
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
                      <el-dropdown-item :command='returnCommand("update", row)'>修改</el-dropdown-item>
                      <el-dropdown-item :command='returnCommand("delete", row)'>删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="phone" align="center" label="电话"></el-table-column>
            <el-table-column prop="sex" align="center" label="性别"></el-table-column>
            <el-table-column prop="img" label="人脸">
              <template slot-scope="scope">
                <img
                  class="capture-img"
                  @mouseout="imgVisible=false"
                  @mouseover="imgVisible=true,bigImg=scope.row.img"
                  :src="scope.row.img"
                  alt
                />
              </template>
            </el-table-column>
            <el-table-column prop="car" align="center" label="访客车辆"></el-table-column>
            <el-table-column prop="car" align="center" label="邀请访客"></el-table-column>
            <el-table-column prop="house_info" align="center" label="房屋信息"></el-table-column>
            <el-table-column prop="far_door" align="center" label="远程开门"></el-table-column>
            <el-table-column prop="far_door" align="center" label="用户类型"></el-table-column>
            <el-table-column prop="expire_time" align="center" label="过期时间"></el-table-column>
            <el-table-column prop="status" align="center" label="状态"></el-table-column>
            <el-table-column prop="detail" align="center" label="备注"></el-table-column>
            <el-table-column prop="create_time" align="center" label="创建时间"></el-table-column>
          </el-table>
        </div>

        <el-pagination style="margin-top:10px;" background layout="prev, pager, next" :total="2"></el-pagination>
      </el-col>
    </el-row>

    <el-dialog class="dialog-rewrite" :title="detailDialog.name" :visible.sync="dialogFormVisible">
      <el-tabs type="card" v-model="activeName" @tab-click="handleClick">
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

    <el-dialog title="提示" :visible.sync="dialogCreate" width="30%" :before-close="handleClose">
      <el-form :model="Form" :rules="rules" ref='Forms' label-width="90px">
        <el-form-item label="姓名:"  prop='name'>
          <el-input v-model="Form.name" placeholder='输入姓名'></el-input>
        </el-form-item>
        <el-form-item label="电话:"  prop='phone'>
          <el-input v-model="Form.phone" placeholder='输入电话'></el-input>
        </el-form-item>
        <el-form-item label="房屋信息:"  prop='house_info'>
          <el-input v-model="Form.house_info" placeholder='输入房屋信息'></el-input>
        </el-form-item>
        <el-form-item label="备注:"  prop='detail'>
          <el-input v-model="Form.detail" placeholder='输入备注'></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogCreate = false">取 消</el-button>
        <el-button type="primary" @click="dialogCreate = false">确 定</el-button>
      </span>
    </el-dialog>

    <BigImg :centerDialogVisible="imgVisible" bigTitle="抓拍图片" :bigImg="bigImg" />
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import mixin from "@/config/minxins";
const ActionHeader = () => import("@/components/ActionHeader.vue");
const DiaLog = () => import("@/components/dialog.vue");
const BigImg = () => import("@/components/BigImg/index.vue");
@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    DiaLog,
    BigImg
  }
})
export default class OwnerManage extends Vue {
  private activeName: string = "first";
  private dialogFormVisible: boolean = false;
  private title: string = "详情";
  private list_data: Array<Object> = [
    {
      name: "张三",
      age: 18,
      sex: "男",
      phone: "13518160000",
      house_info: "一栋一单元",
      expire_time: "2019/10/1",
      far_door: "是",
      car: "川A 12345",
      main_linker: "是",
      status: "已住",
      detail: "租户",
      create_time: "2019/10/1",
      img: require("@/assets/4075389faf0c20cf430ce772c3afa47.png"),
      showMenu: false
    }
  ];
  UserType: string = "owner";
  private detailDialog: Object = {
    name: ""
  };
  Form: any = {
    name: '',
    phone: '',
    house_info: '',
    detail: ''
  }
  rules: any = {
    name: [
            { required: true, message: '请输入需关联的房屋', trigger: 'blur' }
          ]
  }
  private imgVisible: Boolean = false; // 控制放大图片的visible
  private bigImg: String = ""; // 保存放大图片的地址

  private dtailTable: Array<Object> = [
    {
      date: "2016-05-02",
      name: "王小虎",
      address: "上海市普陀区金沙江路 1518 弄"
    },
    {
      date: "2016-05-04",
      name: "王小虎",
      address: "上海市普陀区金沙江路 1517 弄"
    },
    {
      date: "2016-05-02",
      name: "王小虎",
      address: "上海市普陀区金沙江路 1518 弄"
    },
    {
      date: "2016-05-04",
      name: "王小虎",
      address: "上海市普陀区金沙江路 1517 弄"
    }
  ];

  private carDtailTable: Array<Object> =[
    {
      date: "川AXXXX",
      name: "XXXXX"
    },
    {
      date: "川AXXXX",
      name: "XXXXX"
    },
    {
      date: "川AXXXX",
      name: "XXXXX"
    },
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

  handleClick() {}
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

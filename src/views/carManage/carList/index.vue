<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <action-header :dialogCreate.sync="dialogCreate" :total="1">
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>导出</el-dropdown-item>
            <el-dropdown-item>导入</el-dropdown-item>
          </el-dropdown-menu>
          <div slot="houseNum">
            <div class="word-filter">
              <span class="filter-name">车&nbsp;牌&nbsp;号&nbsp;:</span>
              <el-input class="input-filter" size="small"></el-input>
            </div>
            <div class="word-filter">
              <span class="filter-name">车主姓名:</span>
              <el-input class="input-filter" size="small"></el-input>
            </div>
            <div class="word-filter">
              <span class="filter-name">联系电话:</span>
              <el-input class="input-filter" size="small"></el-input>
            </div>
          </div>
        </action-header>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="24" class="table-col">
        <div class="rightContent">
          <el-table
            :data="cardList"
            stripe
            class="demo-block"
            highlight-current-row
            @cell-mouse-enter="enterRowChange"
            @cell-mouse-leave="leaveRowChange"
          >
            <el-table-column type="selection" width="50"></el-table-column>

            <el-table-column type="index" label="序号" width="50"></el-table-column>

            <!-- <el-table-column prop="name" label="所属房屋">
              <template slot-scope="scope">
                <span class="serial-num">{{scope.row.name}}</span>
                <div class="fun-btn">
                  <el-dropdown trigger="click" placement="bottom-start" @command='commandClick'>
                    <i v-show="scope.row.showMenu" class="iconfont icon-menu"></i>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command='update'>修改</el-dropdown-item>
                      <el-dropdown-item command='delete'>删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </template>
            </el-table-column>-->

            <el-table-column prop="ownerUserName" label="车主"></el-table-column>

            <el-table-column prop="carNo" label="车牌号">
              <template slot-scope="scope">
                <el-button
                  @click="showCarDetails(scope.row)"
                  type="text"
                  class="serial-num"
                >{{scope.row.carNo}}</el-button>
              </template>
            </el-table-column>

            <el-table-column prop="lastInTime" label="最近一次访问"></el-table-column>

            <el-table-column prop="lastInPhoto" label="最近抓拍图片">
              <template slot-scope="scope">
                <img
                  class="capture-img"
                  @mouseout="imgVisible=false"
                  @mouseover="imgVisible=true,bigImg=scope.row.lastInPhoto"
                  :src="scope.row.lastInPhoto"
                  alt
                />
              </template>
            </el-table-column>

            <el-table-column prop="status" label="状态">
              <template slot-scope="scope">
                <el-tag
                  size="small"
                  style="border-radius: 50px;padding: 0 10px; cursor: pointer;"
                  :type="scope.row.status? 'success' : 'danger'"
                  @click="editType(scope.row)"
                >{{ scope.row.status ? "正常" : "异常" }}</el-tag>
              </template>
            </el-table-column>

            <el-table-column prop="note" label="备注"></el-table-column>
          </el-table>
        </div>
        <el-pagination
          background
          style="margin-top:10px;"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-size="listQuery.limit"
          :current-page="listShow.page"
          layout="total, prev, pager, next, slot"
          :total="listShow.total"
        ></el-pagination>

        <!-- <div :class="rowSpan.row1===4 ? menuControl1 : menuControl2" @click="menuVisible">
          <p class="close-menu">
            <i v-if="rowSpan.row1===4" class="iconfont icon-left icon-class"></i>
            <i v-else class="iconfont icon-zuo icon-class"></i>
          </p>
        </div>-->
      </el-col>
    </el-row>
    <!-- 车辆新增或修改 -->
    <el-dialog
      :title="roleTitle==='0' ? '新增' :'修改'"
      :visible.sync="dialogCreate"
      width="500px"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dataForm"
        :model="createForm[0]"
        :rules="rules"
        label-position="right"
        label-width="80px"
        style="margin-right:40px;"
      >
        <el-form-item
          prop="ownerPhone"
          :show-message="showMessage"
          :error="errorMessage.ownerPhone"
          label="电话"
        >
          <el-autocomplete
            style="width:340px"
            v-model="createForm[0].ownerPhone"
            :disabled="nameDisabled"
            placeholder="请输入用户电话"
            popper-class="my-autocomplete"
            :fetch-suggestions="querySearch"
            @select="handleSelectWatchlist"
          >
            <template slot-scope="{ item }">
              <div class="name">{{ item.value }}</div>
              <span class="addr">姓名:{{ item.name ? item.name : '未知'}}</span>
            </template>
          </el-autocomplete>
        </el-form-item>

        <el-form-item label="姓名">
          <el-input :disabled="true" v-model="createForm[0].ownerUserName"></el-input>
        </el-form-item>

        <el-form-item
          label="车牌"
          prop="carNo"
          :show-message="showMessage"
          :error="errorMessage.carNo"
        >
          <el-input v-model="createForm[0].carNo"></el-input>
        </el-form-item>

        <el-form-item
          label="品牌"
          prop="modal"
          :show-message="showMessage"
          :error="errorMessage.modal"
        >
          <el-input v-model="createForm[0].modal"></el-input>
        </el-form-item>

        <el-form-item label="车型">
          <el-input v-model="createForm[0].carType"></el-input>
        </el-form-item>

        <el-form-item label="备注">
          <el-input type="textarea" v-model="createForm[0].note"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="createCar">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 目标详情 -->
    <el-dialog
      class="dialog-rewrite"
      :title="CarDialogForm.name"
      :visible.sync="detailDialogVisible"
    >
      <el-tabs type="card" v-model="activeName">
        <el-tab-pane label="车辆详情" name="first">
          <el-form label-width="100px" :model="CarDialogForm">
            <el-form-item label="车牌:">
              <span>{{CarDialogForm.carNum}}</span>
            </el-form-item>
            <el-form-item label="车辆品牌:">
              <span>--</span>
            </el-form-item>
            <el-form-item label="车辆颜色:">
              <span>--</span>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="车主信息" name="second">
          <el-form label-width="100px" :model="CarDialogForm">
            <el-form-item label="车主:">
              <span>{{CarDialogForm.name}}</span>
            </el-form-item>
            <el-form-item label="电话:">
              <span>--</span>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="通行记录" name="thirdly">
          <el-table :data="carDetailsTable" style="width: 100%">
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
    <ImageMagni :centerDialogVisible="imgVisible" bigTitle="抓拍图片" :bigImg="bigImg" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import mixin from "@/config/minxins";
import { carList, queryCarPhone, addCar } from "@/api/carApi.ts";

const ActionHeader = () => import("@/components/ActionHeader.vue");
const ImageMagni = () => import("@/components/BigImg/index.vue");
const DataTree = () => import("@/components/DataTree.vue");

@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    ImageMagni,
    DataTree
  }
})
export default class CardManage extends Vue {
  private listQuery: Object = {
    //获取车辆名单列表及根据条件进行查询
    page: 1,
    limit: 10
  };
  private listShow: Object = {
    //获取车辆名单列表及根据条件进行查询
    total: 0
  };

  private cardList: Array<Object> = [];

  private rowSpan: any = {
    row1: 4,
    row2: 20
  };

  private imgVisible: Boolean = false; // 控制放大图片的visible
  private bigImg: String = ""; // 保存放大图片的地址

  private form: Object = {
    name: "",
    region: "",
    date1: "",
    date2: "",
    delivery: false,
    type: [],
    resource: "",
    desc: ""
  };

  private dialogFormVisible: Boolean = false;
  private formLabelWidth: String = "120px";

  private CarDialogForm: Object = {}; // 车主详细信息
  private detailDialogVisible: boolean = false; // 详细信息dialog弹框
  private activeName: string = "first";
  private carDetailsTable: Array<Object> = [];
  private dialogCreate: Boolean = false; // 新增或修改弹出表单
  private roleTitle: String = "0";

  private createForm: Array<Object> = [
    {
      ownerPhone: "", //车主电话
      ownerUserName: "", //车主
      scenceUserId: "", //车主id
      carNo: "", //车牌号
      carType: "", //车型
      // id: "string",
      modal: "", //品牌
      note: "" //备注
    }
  ];
  private rules: Object = {
    // 表单验证
    ownerPhone: [
      { required: true, message: "请输入车主电话", trigger: "blur" }
    ],
    carNo: [{ required: true, message: "请输入车牌号", trigger: "blur" }],
    modal: [{ required: true, message: "请输入车辆品牌", trigger: "blur" }]
  };
  private showMessage: Boolean = true; //是否显示表单错误信息
  private errorMessage: Object = {
    // 表单错误信息
    ownerPhone: "",
    carNo: ""
  };
  private nameDisabled: Boolean = false;
  private restaurants: Array<Object> = [];

  created() {
    this.fetchData();
  }

  async fetchData() {
    /** @description 获取车辆名单列表
     * @augments listQuery: 参数
     */
    const { data } = await carList(this.listQuery);
    this.cardList = data.data.records;
    this.listShow.total = data.data.total;
  }

  handleSizeChange(val) {
    /** @description 修改每页显示条数
     * @augments val: 每页显示条数
     */
    this.listQuery.limit = val;
    this.fetchData();
  }

  handleCurrentChange(val) {
    /** @description 处理翻页事件
     * @augments val: 页数
     */
    this.listQuery.page = val;
    this.fetchData();
  }

  async querySearch(queryString, cb) {
    if (
      queryString === "" ||
      (this.restaurants.length === 1 &&
        queryString !== this.restaurants[0].value)
    ) {
      this.createForm[0].ownerUserName = "";
      this.nameDisabled = false;
    }
    if (queryString.length >= 7) {
      await this.fetchWatchList(queryString);
    }
    // 调用 callback 返回建议列表的数据
    cb(this.restaurants);
    if (this.restaurants.length === 1 && this.restaurants[0].value) {
      if (queryString === this.restaurants[0].value) {
        this.handleSelectWatchlist(this.restaurants[0]);
      }
    }
  }

  async fetchWatchList(name) {
    const { data } = await queryCarPhone(name);
    this.restaurants = data.data.map(item => {
      return {
        value: item.phone,
        name: item.name,
        scenceUserId: item.id
      };
    });
  }

  handleSelectWatchlist(item) {
    this.createForm[0].ownerPhone = item.value;
    if (item.name) {
      this.createForm[0].ownerUserName = item.name;
      this.nameDisabled = true;
    } else {
      this.createForm[0].userName = null;
      this.nameDisabled = false;
    }
  }

  createCar() {
    /**@description 新增车辆处理 */
    this.$refs["dataForm"].validate(valid => {
      if (valid) {
        var form = [
          {
            ...this.createForm[0],
            scenceUserId: this.restaurants[0].scenceUserId
          }
        ];
        addCar(form)
          .then(res => {
            this.handleClose();
            this.fetchData();
            this.nameDisabled = false;
            this.$notify({
              type: "success",
              title: "成功",
              message: "添加车辆成功"
            });
          })
          .catch(err => {
            console.log(err.response);
            // const { data } = err.response;
            // for (const k in data) {
            //   this.errorMessage[k] = data[k][0];
            // }
          });
      }
    });
  }

  handleClose() {
    /** @description 关闭新增/修改diolog */
    this.dialogCreate = false;
    this.$refs["dataForm"].resetFields();
  }

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

  showCarDetails(row) {
    this.detailDialogVisible = true;
    this.CarDialogForm = Object.assign({}, row);
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
  top: 30%;
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

.capture-img {
  width: 30px;
}
.inputFilter {
  width: 198px !important;
}
</style>

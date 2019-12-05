<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <action-header
          :btnStatus="0"
          :filterStatus="false"
          :moreStatus="false"
          :initFormHeader="initForm"
          @fetchData="fetchData"
          :filterForm="filterForm"
          :dialogCreate.sync="dialogCreate"
          :total="page.total"
        ></action-header>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="24" class="table-col">
        <div class="rightContent">
          <el-table
            height="61vh"
            v-loading="showLoading"
            :data="list_data"
            stripe

            highlight-current-row
            @cell-mouse-enter="enterRowChange"
            @cell-mouse-leave="leaveRowChange"
          >
            <el-table-column type="selection" width="50" :selectable="isDisabled" disabled="true"></el-table-column>

            <el-table-column type="index" label="序号" width="50"></el-table-column>

            <el-table-column prop="address" label="位置" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.address}}</span>
                <!-- <el-button
                  style="padding:0px;"
                  type="text"
                  @click="queryIdetity"
                >{{scope.row.address}}</el-button>-->
                <!-- <div class="fun-btn">
                    <el-dropdown @command="commandClick" trigger="click" placement="bottom-start">
                      <i v-show="row.showMenu" class="iconfont icon-menu"></i>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item :command="returnCommand('whiteList', row)">加入白名单</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                </div>-->
              </template>
            </el-table-column>

            <el-table-column prop="createdTime" label="时间" align="center"></el-table-column>

            <el-table-column prop="pic" label="头像" align="center">
              <template slot-scope="{row}">
                <div>
                  <img
                    @mouseover="imgVisible = true,bigImg = row.pic"
                    @mouseout="imgVisible = false"
                    :src="row.pic"
                    width="30px"
                    alt
                  />
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-pagination
          @current-change="pageChange"
          style="margin-top:10px;"
          background
          layout="prev, pager, next,total"
          :page-size="page.limit"
          :total="page.total"
        ></el-pagination>
      </el-col>
    </el-row>
    <el-dialog title="提示" :visible.sync="dialogCreate" width="30%" :before-close="handleClose">
      <span>这是重点人员新增</span>
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
const DataTree = () => import("@/components/DataTree.vue");
const BigImg = () => import("@/components/BigImg/index.vue");

@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    DataTree,
    BigImg
  }
})
export default class CardManage extends Vue {
  filterForm: object = { name: "", emergencyPhone: "", earlyGroupId: "" }; //根据关键字查询
  initForm: object = {
    //获取车辆列表url
    url: "/admin/strangerRecord/",
    method: "get"
  };
  dialogCreate: boolean = false; //新增
  private cardList: Array<Object> = [
    {
      name: "张三",
      zb: "男",
      zp:
        "http://192.168.3.19:8089/gcxuYFkPVzC2GLb2JGppLR/ea74acb14304ec41369f44ed18219dc.jpg",
      xq: "详情",
      tjsj: "2019/8/21",
      showMenu: false
    }
  ];
  private imgVisible: Boolean = false;
  bigImg: String = "";

  private dialogLibrary: any = false;

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

  created() {
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    ); // 合并参数
  }

  editType(item) {
    /**@description 修改状态 */
    console.log(item);
    // this.dialogFormVisible = true;
  }

  queryIdetity() {
    this.dialogLibrary = true;
  }

  isDisabled(row, index) {
    /**@discription 禁用多选 */
    if (row.auditResult == 3) {
      return 0;
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
</style>

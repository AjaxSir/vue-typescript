<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <!--
          houseStatus: 住宅管理是否显示
          initFormHeader: 初始化的地址 方式
          fetchData: 筛选后重新init
          filterForm: 关键字查询条件
          dialogCreate:新增弹出框
          btnStatus:2为显示导出按钮 1为显示新增按钮
          moreStatus:是否显示 更多菜单 按钮
          exportUrl:导出路径
          exportName:导出文件名
          total:总条数
        -->
        <action-header
          :houseStatus="false"
          :initFormHeader="initForm"
          @fetchData="fetchData"
          :filterForm="filterForm"
          :btnStatus="2"
          :moreStatus="false"
          :exportUrl="'/v1/admin/usr-visit-car/export/'"
          :exportName="'访客车辆记录'"
          :total="page.total"
        >
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>导入</el-dropdown-item>
          </el-dropdown-menu>
          <div slot="houseNum">
            <div class="word-filter">
              <span class="filter-name">车&nbsp;牌&nbsp;号&nbsp;:</span>
              <el-input class="input-filter" size="small" v-model="filterForm.carNo"></el-input>
            </div>
            <div class="word-filter">
              <span class="filter-name">车主姓名:</span>
              <el-input class="input-filter" size="small" v-model="filterForm.ownerUserName"></el-input>
            </div>
            <div class="word-filter">
              <span class="filter-name">邀请人:</span>
              <el-input class="input-filter" size="small" v-model="filterForm.visitName"></el-input>
            </div>
            <div class="word-filter">
              <span class="filter-name">联系电话:</span>
              <el-input class="input-filter" size="small" v-model="filterForm.ownerPhone"></el-input>
            </div>
            <div class="word-filter">
              <span class="filter-name">有效时间:</span>
              <el-date-picker
                size="small"
                style="width:165px"
                :picker-options="pickOptionStart"
                v-model="filterForm.startInvalidDate"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期"
              ></el-date-picker>&nbsp;&nbsp;-&nbsp;&nbsp;
              <el-date-picker
                size="small"
                style="width:165px"
                :picker-options="pickOptionEnd"
                v-model="filterForm.endInvalidDate"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期"
              ></el-date-picker>
            </div>
            <div class="word-filter">
              <span class="filter-name">创建时间:</span>
              <el-date-picker
                size="small"
                style="width:165px"
                :picker-options="pickOptionStart"
                v-model="filterForm.startCreateTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期"
              ></el-date-picker>&nbsp;&nbsp;-&nbsp;&nbsp;
              <el-date-picker
                size="small"
                style="width:165px"
                :picker-options="pickOptionEnd"
                v-model="filterForm.endCreateTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期"
              ></el-date-picker>
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
            <el-table-column type="selection" width="50"></el-table-column>

            <el-table-column type="index" label="序号" width="50"></el-table-column>

            <el-table-column prop="visitName" label="邀请人">
              <template slot-scope="scope">
                <span class="serial-num">{{scope.row.visitName}}</span>
                <div class="fun-btn">
                  <el-dropdown trigger="click" placement="bottom-start" @command="commandClick">
                    <i v-show="scope.row.showMenu" class="iconfont icon-menu"></i>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="update">修改</el-dropdown-item>
                      <el-dropdown-item command="delete">删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="carNo" align="center" label="车牌号"></el-table-column>
            <el-table-column prop="ownerPhone" align="center" label="联系电话"></el-table-column>
            <el-table-column prop="ownerUserName" align="center" label="车主姓名"></el-table-column>
            <el-table-column prop="status" align="center" label="状态">
              <template slot-scope="scope">
                <el-tag
                  size="small"
                  style="border-radius: 50px;padding: 0 10px; cursor: pointer;"
                  :type="scope.row.status==='1' ? 'success' : 'warning'"
                  @click="editType(scope.row)"
                >{{ scope.row.status && scope.row.status =='1' ? "未到访" : "已到访" }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="invalidDate" align="center" label="有效期" min-width="100px"></el-table-column>
            <el-table-column prop="numPeople" align="center" label="随行人数"></el-table-column>
            <el-table-column prop="createTime" min-width="130px" align="center" label="创建时间"></el-table-column>
            <el-table-column prop="note" align="center" label="备注"></el-table-column>
          </el-table>
          <el-pagination
            @current-change="pageChange"
            style="margin-top:10px;"
            background
            layout="prev, pager, next,total"
            :page-size="page.limit"
            :total="page.total"
          ></el-pagination>
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

@Component({
  mixins: [mixin],
  components: {
    ActionHeader
  }
})
export default class CardManage extends Vue {
  filterForm: object = {
    carNo: null, //车牌
    ownerPhone: null, //车主电话
    ownerUserName: null, //车主姓名
    visitName: null, //邀请人
    startCreateTime: null, //创建开始时间
    endCreateTime: null, //创建结束时间
    startInvalidDate: null, //开始过期时间
    endInvalidDate: null // 结束过期时间
  }; //根据关键字查询
  initForm: object = {
    //获取访客车辆列表url
    url: "/admin/usr-visit-car/",
    method: "get"
  };

  pickOptionStart: object = {}; //按照时间段查询的开始时间
  pickOptionEnd: object = {}; //按照时间段查询的结束时间
  mounted() {
    const _this = this;
    this.pickOptionStart = {
      disabledDate(time) {
        if (_this.filterForm["endCreateTime"] !== "") {
          return (
            time.getTime() > Date.now() ||
            time.getTime() > _this.filterForm["endCreateTime"]
          );
        } else {
          return time.getTime() > Date.now();
        }
      }
    };
    this.pickOptionEnd = {
      disabledDate(time) {
        return (
          time.getTime() < _this.filterForm["startCreateTime"] ||
          time.getTime() > Date.now()
        );
      }
    };
  }

  created() {
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    ); // 合并参数
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
  top: 26%;
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

<!--
  对表格的操作组件
  total 传入的数据总条数
  pageSize 每页的数据条数
  btnStatus: 0 表示没有创建 导出按钮 1 创建按钮 2 导出按钮
 -->
<template>
  <el-row type="flex" class="row-bg">
    <el-col :span="12">
      <div class="leftAction">
        <el-button
          v-if="btnStatus === 1 && addUpdateStatus"
          class="createBtn"
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="handleHouse"
          :disabled="addDisabled"
        >添加</el-button>
        <el-button
          v-else-if="btnStatus === 2"
          class="createBtn"
          type="primary"
          size="small"
          @click="handleClick('export')"
        >导出</el-button>
        <el-dropdown v-if="moreStatus" size="small" @command="handleClick">
          <el-button size="small" style="border-color: #409EFF; color: #409EFF;">
            更多菜单
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <slot name="dropdown"></slot>
        </el-dropdown>
      </div>
    </el-col>

    <el-col :span="12" justify="end">
      <div class="rightAction">
        <!-- <el-dropdown v-if="houseStatus" trigger="click">
          <span class="el-dropdown-link">
            <i style="font-size:16px;" class="iconfont icon-appstore-o"></i>
          </span>
          <el-dropdown-menu>
            <el-dropdown-item command="a">
              <router-link to="/house/chart">楼控视图</router-link>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>-->

        <div v-if="filterStatus" class="content">
          <span :class="[hasProty ? 'activeFilter' : '']" @click.stop="visibleFilter = !visibleFilter,visible = false">
            <i :style="{ color: hasProty ? '#409eff' : '' }" class="iconfont icon-filtration"></i>
            过滤
          </span>
          <transition name="el-zoom-in-top">
            <div v-show="visibleFilter" class="filterDialog">
              <slot name="houseNum"></slot>
              <el-button
                @click="emitFetchData"
                class="fliterBtn"
                type="primary"
                plain
                size="small"
              >筛选</el-button>
              <el-button
              style="margin-right:10px"
                @click="clearFilterForm"
                class="fliterBtn"
                type="warning"
                plain
                size="small"
              >清空条件</el-button>
            </div>
          </transition>
        </div>
        <el-tag v-if='hasProty' closable @close='clearFilterFormfresh'>
          查询 <span style="color:red"> {{ total }} </span>条结果
          </el-tag>
        <span class="total">总共:{{ allTotal }}条</span>

        <i
          v-if="pageStatus"
          @click.stop="visible = !visible,visibleFilter = false"
          style="font-size:18px; margin-right: 20px;"
          class="iconfont icon-_shezhi-xian"
        ></i>

        <transition v-if="pageStatus" name="el-zoom-in-top">
          <div v-show="visible" class="setting">
            <span>每页显示:</span>
            <el-select
              @change="sizeChange"
              style="width:100px;margin-left:10px"
              v-model="size"
              placeholder="请选择"
            >
              <el-option
                v-for="item in pageSize"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </transition>
      </div>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import {
  Component,
  Prop,
  Vue,
  Mixins,
  Watch,
  Emit,
  Provide
} from "vue-property-decorator";
import mixin from "@/config/minxins";
import { Getter } from "vuex-class";
import qs from "qs";
import { exportList } from "@/api/user.ts";
@Component({
  mixins: [mixin],
  components: {}
})
export default class ActionManage extends Vue {
  @Prop() private total: any; // 显示筛选多少条记录
  @Prop({ default: 1 }) btnStatus: Number; //  btnStatus: 0 表示没有创建导出按钮 1 创建按钮 2 导出按钮
  @Prop({ default: false }) addDisabled: Boolean;
  @Prop({ default: false }) houseStatus: boolean; // 住宅管理才显示
  @Prop({ default: true }) filterStatus: boolean; // 是否需要显示过滤条件
  @Prop({ default: true }) moreStatus: boolean; // 是否显示更多菜单
  @Prop({ default: true }) pageStatus: boolean; //是否显示分页
  @Prop() private exportUrl: any; // 导出路径
  @Prop() private exportName: any; //导出文件名
  @Prop({
    default: () => {
      return {};
    }
  })
  initFormHeader: object; // 初始化的地址 方式
  addUpdateStatus: boolean = true; // 是否具有修改权限
  @Getter("permissionList") permissionList: Array<string>;
  @Getter("total") allTotal: Array<string>;
  @Prop({
    default: () => {
      return {};
    }
  })
  filterForm: object; // 筛选条件
  @Prop({ default: "" }) linkUrl: string;
  hasProty: boolean = false // 有无筛选条件
  private visible: boolean = false; // 数据显示条数dialog状态
  private size: string = "10"; // 默认每页显示10条
  private levelList: Object = {}; // 当前路由的子路由
  private matched: Array<Object> = []; // 获取当前路由
  visibleFilter: Boolean = false; // 筛选dialog状态狂
  dialogCreate: Boolean = false;
  private pageSize: Array<Object> = [
    // 数据显示条数数组
    {
      label: "10",
      value: "10"
    },
    {
      label: "30",
      value: "30"
    },
    {
      label: "50",
      value: "50"
    }
  ];

  private filterData: object = {
    dateRange: ""
  };

  created() {
    this.getRouter();
  }

  fetchData() {
    return Promise.resolve({});
  }
  mounted() {
    document.body.addEventListener('click', (e) => {
      if (this.$el.contains(e['target'] as HTMLElement)) {
        return
      } else {
        this.visibleFilter = false
        this.visible = false
      }

    })
    this.addUpdateStatus = this.permissionList.includes(
      this.$route.name + "Update"
    );
    this.fetchData();
  }
  handleHouse() {
    /** @description 创建楼栋 */
    this.visibleFilter = false;
    this.$emit("update:dialogCreate", true);
    this["phoneNum"] = 0;
  }
  // 导出
  exportTable() {
    const filterUrl = qs.stringify(this.initFormHeader["params"]);
    if (process.env.NODE_ENV === "production") {
      this.exportUrl = this.exportUrl.replace("/v1", "http://47.103.184.184");
    }
    exportList(this.exportUrl + "/?" + filterUrl).then(res => {
      const fileName = this.exportName;
      var blob = new Blob([res.data], {
        type: "application/vnd.ms-excel;charset=UTF-8"
      });
      if ("download" in document.createElement("a")) {
        // 非IE下载
        const elink = document.createElement("a");
        elink.download = fileName;
        elink.style.display = "none";
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
      } else {
        // IE10+下载
        navigator.msSaveBlob(blob, fileName);
      }
    });
  }
  /**
   * 筛选按钮
   */
  @Emit("fetchData")
  emitFetchData() {
    this.hasProty = false
    this.visibleFilter = false;
    this.page["page"] = 1;
    for(let key in this.filterForm) {
      if (typeof this.filterForm[key] === 'string' || this.filterForm[key] === null) {
        if (this.filterForm[key]) {
          this.hasProty = true
        }
      } else {
         if (this.filterForm[key].length) {
          this.hasProty = true
        }
      }
    }
    this.initFormHeader["params"] = Object.assign(
      this.initFormHeader["params"],
      this.filterForm,
      this.page
    );
    this["phoneNum"] = 0;
    return this.initFormHeader;
  }
  /**
   * 清空筛选条件 并且刷新列表
   */
  @Emit("fetchData")
  clearFilterFormfresh() {
    this.hasProty = false
    this.visibleFilter = false;
    this.page["page"] = 1;
    for(let key in this.filterForm) {
        if (typeof this.filterForm[key] === 'string') {
          this.filterForm[key] = ''
        } else if(this.filterForm[key] === null) {
          this.filterForm[key] = null
        } else if (typeof this.filterForm[key] === 'boolean')  {
          this.filterForm[key] = false
        } else {
          this.filterForm[key] = []
        }
    }
    this["phoneNum"] = 0;
    this.initFormHeader["params"] = Object.assign(
      this.initFormHeader["params"],
      this.filterForm,
      this.page
    );
    return this.initFormHeader;
  }
  // 清空筛选条件 不刷新列表
  clearFilterForm() {
    // this.hasProty = false
    this.visibleFilter = false;
    this.page["page"] = 1;
    for(let key in this.filterForm) {
        if (typeof this.filterForm[key] === 'string') {
          this.filterForm[key] = ''
        } else if(this.filterForm[key] === null) {
          this.filterForm[key] = null
        } else if (typeof this.filterForm[key] === 'boolean')  {
          this.filterForm[key] = false
        } else {
          this.filterForm[key] = []
        }
    }
  }
  /**
   *
   * @param size 每页数据条数
   */
  @Emit("fetchData")
  sizeChange(size: number) {
    this.page["limit"] = size;
    this.page["page"] = 1;
    this.initFormHeader["params"] = Object.assign(
      this.initFormHeader["params"],
      this.page
    );
    this.visible = false;
    return this.initFormHeader;
  }
  getRouter() {
    this.matched = this.$route.matched.filter(item => item.name);
    const first = this.matched[0];
    for (const item of this.$router["options"].routes) {
      if (first && first["name"] === item.name) {
        this.levelList = item;
      }
    }
  }
  // 更多菜单下的操作
  handleClick(val) {
    switch (val) {
      case "export":
        for (let key in this.initFormHeader["params"]) {
          if (
            this.initFormHeader["params"][key] === "" ||
            this.initFormHeader["params"][key] === null
          ) {
            delete this.initFormHeader["params"][key];
          }
        }
        const filterUrl = qs.stringify(this.initFormHeader["params"]);
        if (process.env.NODE_ENV === "production") {
          this.exportUrl = this.exportUrl.replace(
            "/v1",
            "http://47.103.184.184"
          );
        }
        exportList(this.exportUrl + "/?" + filterUrl).then(res => {
          const fileName = this.exportName;
          var blob = new Blob([res.data], {
            type: "application/vnd.ms-excel;charset=UTF-8"
          });
          if ("download" in document.createElement("a")) {
            // 非IE下载
            const elink = document.createElement("a");
            elink.download = fileName;
            elink.style.display = "none";
            elink.href = URL.createObjectURL(blob);
            document.body.appendChild(elink);
            elink.click();
            URL.revokeObjectURL(elink.href); // 释放URL 对象
            document.body.removeChild(elink);
          } else {
            // IE10+下载
            navigator.msSaveBlob(blob, fileName);
          }
        });
        break;
      case "link":
        this.$router.push({ path: this.linkUrl });
        break;
    }
  }
}
</script>

<style lang="scss" scoped>
a {
  display: inline-block;
  width: 100%;
  height: 36px;
  padding: 0 20px;
}

.row-bg {
  margin: 10px 0;
  height: 32px;
  .leftAction {
    text-align: left;
    .createBtn {
      margin-right: 10px;
    }
  }
  .rightAction {
    .setting {
      text-align: left;
      padding: 10px;
      width: 200px;
      height: 80px;
      position: absolute;
      top: 40px;
      right: 0px;
      border: 1px solid lightgray;
      box-shadow: 0px 10px 10px gray;
      background: white;
      z-index: 9;
    }
    text-align: right;
    font-size: 14px;
    position: relative;
    .icon-appstore-o {
      border-right: 1px solid #dfe6ee;
      padding: 0 10px;
      margin: 0 10px;
      cursor: pointer;
    }
    .total {
      padding: 0 10px;
      margin: 0 10px;
      font-size: 14px;
      color: #8494a7;
      border-left: 1px solid #dfe6ee;
      border-right: 1px solid #dfe6ee;
    }
    .iconfont {
      color: #8494a7;
    }
    .houseNum {
      height: 100px;
      color: #8494a7;
      text-align: left;
      .input {
        display: flex;
        align-items: center;
        margin-bottom: 5px;
        .input-title {
          display: inline-block;
          white-space: nowrap;
        }
      }
      span {
        margin-right: 10px;
      }
    }
    .icon-chilun {
      font-size: 30px;
      vertical-align: middle;
      &:hover {
        cursor: pointer;
      }
    }
  }
}
.content {
  display: inline-block;
  position: relative;
  color: #8494a7;
  &:hover {
    cursor: pointer;
  }
  .filterDialog {
    text-align: left;
    width: 340px;
    height: auto;
    padding: 20px 10px;
    position: absolute;
    z-index: 11;
    left: -170px;
    top: 40px;
    border: 1px solid lightgray;
    box-shadow: 0px 10px 10px gray;
    background: white;
    .fliterBtn {
      float: right;
    }
  }
}
.icon-_shezhi-xian:hover {
  cursor: pointer;
}
.activeFilter{
  color: #409eff
}
</style>

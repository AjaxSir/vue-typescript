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
          v-if="btnStatus === 1"
          class="createBtn"
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="handleHouse"
        >创建</el-button>
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
        <el-dropdown v-if="houseStatus" trigger="click">
          <span class="el-dropdown-link">
            <i style="font-size:16px;" class="iconfont icon-appstore-o"></i>
          </span>
          <el-dropdown-menu>
            <el-dropdown-item command="a">
              <router-link to="/house/chart">楼控视图</router-link>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <div v-if="filterStatus" class="content">
          <span @click="visibleFilter = !visibleFilter,visible = false">
            <i class="iconfont icon-filtration"></i>
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
            </div>
          </transition>
        </div>

        <span class="total">总共:{{ total }}条</span>

        <i
          v-if="pageStatus"
          @click="visible = !visible,visibleFilter = false"
          style="font-size:18px;"
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
  Emit
} from "vue-property-decorator";
import mixin from "@/config/minxins";
import qs from "qs";

@Component({
  mixins: [mixin],
  components: {}
})
export default class ActionManage extends Vue {
  @Prop() private total: any; // 显示总共多少条记录
  @Prop({ default: 1 }) btnStatus: Number; //  btnStatus: 0 表示没有创建导出按钮 1 创建按钮 2 导出按钮
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
  @Prop({
    default: () => {
      return {};
    }
  })
  @Prop({ default: '' }) linkUrl: string
  filterForm: object; // 筛选条件
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
    this["exportFunc"](this.exportName, this.exportUrl, this.filterForm);
  }
  /**
   * 筛选按钮
   */
  @Emit("fetchData")
  emitFetchData() {
    this.visibleFilter = false;
    this.page["page"] = 1;
    this.initFormHeader["params"] = Object.assign(
      this.initFormHeader["params"],
      this.filterForm,
      this.page
    );
    this.visible = false;

    for (const key in this.filterForm) {
      this.filterForm[key] = null;
    }
    this["phoneNum"] = 0;
    return this.initFormHeader;
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
    this.visibleFilter = false;
    // this.$emit('fetchData', this.initFormHeader)
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
        this["exportFunc"](this.exportName, this.exportUrl + "/?" + filterUrl);
        break;
      case 'link':
        this.$router.push({path: this.linkUrl})
      // case 'exportTemplate':
      //    this["exportFunc"]('用户导入模板.xls', '/v1/admin/uploadFile/exportModel');
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
      padding: 10px 10px;
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
</style>

<!--
  对表格的操作组件
  total 传入的数据总条数
  pageSize 每页的数据条数
 -->
<template>
  <el-row type="flex" class="row-bg">
    <el-col :span="12">
      <div class="leftAction">
        <el-button
          v-if='btnStatus'
          class="createBtn"
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="handleHouse"
        >创建</el-button>
        <el-button
          v-else
          class="createBtn"
          type="primary"
          size="small"
          icon="el-icon-download"
          @click="exportTable"
        >导出</el-button>
        <el-dropdown size="small" @click="handleClick">
          <el-button size="small" style="border-color: #409EFF; color: #409EFF;">
            更多菜单
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <slot name='dropdown'></slot>
        </el-dropdown>
      </div>
    </el-col>

    <el-col :span="12" justify="end">
      <div class="rightAction">
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            <i style="font-size:16px;" class="iconfont icon-appstore-o"></i>
          </span>
          <el-dropdown-menu>
            <el-dropdown-item
              command="a"
              v-for="item in levelList.children"
              :key="item.path"
              :disabled="matched[1] && matched[1].name === item.name"
            >
              <router-link :to="levelList.path + '/' + item.path">{{item.meta.title}}</router-link>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <div class="content">
          <span @click="visibleFilter = !visibleFilter">
            <i class="iconfont icon-filtration"></i>
            过滤
          </span>
          <transition name="el-zoom-in-top">
            <div v-show="visibleFilter" class="filterDialog">
              <slot name="houseNum"></slot>
              <el-button class="fliterBtn">筛选</el-button>
            </div>
          </transition>
        </div>

        <span class="total">总共:{{ total }}条</span>

        <i @click="visible = !visible" style="font-size:18px;" class="iconfont icon-_shezhi-xian"></i>

        <transition name="el-zoom-in-top">
          <div v-show="visible" class="setting">
            <span>每页显示:</span>
            <el-select style="width:100px;margin-left:10px" v-model="size" placeholder="请选择">
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
import { Component, Prop, Vue, Mixins, Watch } from "vue-property-decorator";
@Component({
  components: {
  }
})
export default class ActionManage extends Vue {
  @Prop() private total: any; // 显示总共多少条记录
  @Prop() dialogCreate: Boolean; // 创建弹框状态 公用
  @Prop({ default: true }) btnStatus:Boolean; // true 表示新增框 false 表示导出
  private visible: boolean = false; // 数据显示条数dialog状态
  private size: string = "10"; // 默认每页显示10条
  private levelList: Object = {}; // 当前路由的子路由
  private matched: Array<Object> = []; // 获取当前路由
  visibleFilter: Boolean = false; // 筛选dialog状态狂
  private pageSize: Array<Object> = [ // 数据显示条数数组
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

  handleHouse() {
    /** @description 创建楼栋 */
    // this.dialogCreate = true;
    this.$emit('update:dialogCreate', true)
  }
  // 导出
  exportTable() {}
  fetchData(t) {
  }

  getRouter() {
    this.matched = this.$route.matched.filter(item => item.name);
    const first = this.matched[0];
    for (const item of this.$router['options'].routes) {
      if (first && first['name'] === item.name) {
        this.levelList = item;
      }
    }
  }

  handleClick() {}
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
    width: 300px;
    height: auto;
    padding: 20px 10px;
    position: absolute;
    z-index: 11;
    left: -120px;
    top: 40px;
    border: 1px solid lightgray;
    box-shadow: 0px 10px 10px gray;
    background: white;
    .fliterBtn{
      float: right;
    }
  }
}
</style>

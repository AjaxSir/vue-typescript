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
          class="createBtn"
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="handleHouse"
        >创建</el-button>
        <el-dropdown size="small" @click="handleClick">
          <el-button size="small" style="border-color: #409EFF; color: #409EFF;">
            更多菜单
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown" v-if="type!=='classroom'">
            <el-dropdown-item>导入</el-dropdown-item>
            <el-dropdown-item>导出</el-dropdown-item>
            <el-dropdown-item>统计信息</el-dropdown-item>
            <el-dropdown-item>远程开门</el-dropdown-item>
          </el-dropdown-menu>

          <el-dropdown-menu slot="dropdown" v-if="type==='classroom'">
            <el-dropdown-item>
              <span @click="fetchData('统计')">统计</span>
            </el-dropdown-item>
            <el-dropdown-item>
              <span @click="fetchData('进出次数')">进出次数</span>
            </el-dropdown-item>
            <el-dropdown-item>
              <span @click="fetchData('人均时长')">人均时长</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-col>

    <el-col :span="12" justify="end">
      <div class="rightAction">
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            <i style="font-size:16px;" class="iconfont icon-appstore-o"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
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

        <ActionFilter>
          <div v-if="type==='house'" class="houseNum" slot="houseNum">
            <div class="input">
              <span class="input-title">单元号:</span>
              <el-input class="input" size="small" placeholder="输入单元号"></el-input>
            </div>
          </div>

          <div v-if="type==='owner'" class="houseNum" slot="ownerFilter">
            <div class="input">
              <span class="input-title">姓名:</span>
              <el-input class="input" size="small" placeholder="输入姓名"></el-input>
            </div>

            <div class="input">
              <span class="input-title">电话:</span>
              <el-input class="input" size="small" placeholder="输入姓名"></el-input>
            </div>

            <div class="input">
              <span class="input-title">创建时间:</span>
              <el-date-picker
                v-model="filterData.dateRange"
                size="small"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </div>
          </div>
        </ActionFilter>

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
    <div v-if="type==='classroom'">
      <house-from :formShow.sync="dialogCreateHouse" :formData="modifyData" />
    </div>
  </el-row>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins, Watch } from "vue-property-decorator";
const ActionFilter = () => import("./ActionFilters.vue");
const HouseFrom = () => import("./houseFrom.vue");

@Component({
  components: {
    ActionFilter,
    HouseFrom,
  }
})
export default class ActionManage extends Vue {
  @Prop() private type: any;
  @Prop() private total: any;

  private visible: boolean = false;
  private size: string = "10";
  private levelList: Object = {};
  private matched: Array<Object> = [];
  private dialogCreateHouse: boolean = false;
  private dialogStatisticData: boolean = false;
  private fromTitle: string = "统计";
  private pageSize: Array<Object> = [
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

  private modifyData: Object = {
    // 编辑设备信息
    name: null,
    type: null,
    id: null,
    unit: "1",
    copyUnit: ""
  };

  private filterData: object = {
    dateRange: ""
  };

  created() {
    this.getRouter();
  }

  handleHouse() {
    /** @description 创建楼栋 */
    this.dialogCreateHouse = true;
  }

  fetchData(t) {
    this.fromTitle = t;
    this.dialogStatisticData = true;
  }

  getRouter() {
    this.matched = this.$route.matched.filter(item => item.name);
    const first = this.matched[0];
    for (const item of this.$router.options.routes) {
      if (first && first.name === item.name) {
        this.levelList = item;
      }
    }
  }

  handleClick() {}
}
</script>

<style lang="scss" scoped>
li {
  padding: 0;
}
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
</style>

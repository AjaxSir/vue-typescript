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
          >创建</el-button
        >
        <el-dropdown split-button size="small" @click="handleClick">
          更多菜单
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>导入</el-dropdown-item>
            <el-dropdown-item>导出</el-dropdown-item>
            <el-dropdown-item>统计信息</el-dropdown-item>
            <el-dropdown-item>远程开门</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-col>

    <el-col :span="12" justify="end">
      <div class="rightAction">
        <ActionFilter>
          <div class="houseNum" slot="houseNum">
            <span>单元号:</span>
            <el-input
              class="input"
              size="small"
              placeholder="输入单元号"
            ></el-input>
          </div>
        </ActionFilter>

        <span class="total">总共:{{ total }}条</span>

        <i
          @click="visible = !visible"
          style="font-size:20px;"
          class="iconfont icon-_shezhi-xian"
        ></i>

        <transition name="el-zoom-in-top">
          <div v-show="visible" class="setting">
            <span>每页显示:</span>
            <el-select
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
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
const ActionFilter = () => import("./ActionFilters.vue");
@Component({
  components: {
    ActionFilter
  }
})
export default class ActionManage extends Vue {
  @Prop() private total: any;
  private visible: boolean = false;
  private size: string = "10";
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
  handleClick() {}
}
</script>

<style lang="scss" scoped>
.row-bg {
  margin-bottom: 10px;
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
        display: inline-block;
        width: 200px;
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

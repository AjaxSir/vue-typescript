<template>
  <div class="content">
    <div class="leftAction">
      <el-button class="createBtn" type="primary">创建</el-button>
      <el-dropdown split-button type="primary" @click="handleClick">
        更多菜单
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>导入</el-dropdown-item>
          <el-dropdown-item>导出</el-dropdown-item>
          <el-dropdown-item>统计信息</el-dropdown-item>
          <el-dropdown-item>远程开门</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="rightAction">
      <ActionFilter>
        <div class="houseNum" slot="houseNum">
          <span>单元号:</span>
          <el-input class="input" placeholder="输入单元号"></el-input>
        </div>
      </ActionFilter>
      <span class="total">总共:{{ total }}条</span>
      <i class="iconfont icon-chilun"></i>
    </div>
  </div>
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
  handleClick() {}
}
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  height: 40px;
  display: flex;
  margin-bottom: 10px;
  div {
    flex: 1;
  }
  .leftAction {
    text-align: left;
    .createBtn {
      margin-right: 20px;
    }
  }
  .rightAction {
    text-align: right;
    font-size: 14px;
    position: relative;
    .total {
      margin: 0 20px;
      font-size: 14px;
    }
    .houseNum {
      height: 100px;
      color: black;
      text-align: left;
      .input {
        display: inline-block;
        width: 130px;
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

<!--
  数据页面对应左边的树形结构
  data: 传入的数据
-->
<template>
  <div class="content">
    <div class="treeHeader">
      <i class="iconfont icon-shuji"></i>
      所有
    </div>
    <el-tree
      :data="data"
      node-key="id"
      default-expand-all
      :expand-on-click-node="false"
      @node-click="handleNodeClick"
    >
      <span
        class="custom-tree-node"
        slot-scope="{ node, data }"
        @mouseenter="MouseNnter(node.id)"
        @mouseleave="MouseLeave(node.id)"
      >
        <span>{{ node.label }}</span>
        <div class="fun-btn">
          <el-dropdown trigger="click" placement="bottom-start">
            <i v-show="node.id===showMenu" class="iconfont icon-menu"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>创建</el-dropdown-item>
              <el-dropdown-item>修改</el-dropdown-item>
              <el-dropdown-item>删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </span>
    </el-tree>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
@Component
export default class DataTree extends Vue {
  private showMenu: Number = 0;
  private data: Array<Object> = [
    {
      id: 1,
      label: "一级 1",
      children: [
        {
          id: 4,
          label: "二级 1-1",
          children: [
            {
              id: 9,
              label: "三级 1-1-1"
            },
            {
              id: 10,
              label: "三级 1-1-2"
            }
          ]
        }
      ]
    },
    {
      id: 2,
      label: "一级 2",
      children: [
        {
          id: 5,
          label: "二级 2-1"
        },
        {
          id: 6,
          label: "二级 2-2"
        }
      ]
    },
    {
      id: 3,
      label: "一级 3",
      children: [
        {
          id: 7,
          label: "二级 3-1"
        },
        {
          id: 8,
          label: "二级 3-2"
        }
      ]
    }
  ];

  @Prop({ default: true }) needAction: any;

  handleNodeClick(data) {
    /**@description */
    // console.log(data);
    // data.showMenu = !data.showMenu;
  }

  MouseNnter(val) {
    this.showMenu = val;
  }

  MouseLeave(val) {
    this.showMenu = 0;
  }
}
</script>

<style>
/* .el-tree-node__content {
  position: relative;
} */
/* .el-tree-node__content:hover {
  color: #409eff;
  font-weight: bold;
} */
</style>

<style lang="scss" scoped>
.content {
  width: 100%;
  height: 70vh;
  text-align: center;
  border: 1px solid #ebeef5;
  box-shadow: 0px 0px 8px 0px lightgrey;
}
.treeHeader {
  width: 100%;
  height: 40px;
  text-align: left;
  text-indent: 1em;
  line-height: 40px;
  i {
    font-size: 20px;
  }
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.fun-btn {
  // position: absolute;
  // right: 1px;
  // top: 4px;
  .iconfont {
    font-size: 19px;
    color: #8091a5;
    cursor: pointer;
  }
}
</style>

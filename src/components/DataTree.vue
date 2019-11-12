<!--
  数据页面对应左边的树形结构
  TreeData: 传入的数据
-->
<template>
  <div class="content tree-rename">
    <div class="treeHeader">
      <i class="iconfont icon-shuji"></i>
      所有
    </div>
    <el-tree
      :data="TreeData"
      node-key="id"
      default-expand-all
      :expand-on-click-node="false"
      @node-click="handleNodeClick"
    >
      <span
        class="custom-tree-node"
        slot-scope="{ node }"
        @mouseenter="MouseNnter(node.id)"
        @mouseleave="MouseLeave(node.id)"
      >
        <span>{{ node.label }}</span>
        <div class="fun-btn">
          <el-dropdown @command='commandTreeClick' trigger="click" placement="bottom-start">
            <i v-show="node.id===showMenu" class="iconfont icon-menu"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command='commandObj("create", node)'>创建</el-dropdown-item>
              <el-dropdown-item :command='commandObj("update", node)'>修改</el-dropdown-item>
              <el-dropdown-item :command='commandObj("delete", node)'>删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </span>
    </el-tree>
    <!-- 楼栋dialog -->
    <el-dialog width="500px" :title="HouseForm.title" :visible.sync="HouseVisible">
      <el-form :model="HouseForm">
        <el-form-item label="楼栋名称:" label-width="80px">
          <el-input v-model="HouseForm.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="HouseVisible = false">取 消</el-button>
        <el-button type="primary" @click="HouseVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 权限dialog -->
    <el-dialog width="500px" title="收货地址" :visible.sync="RoleVisible">
      <el-form :model="RoleForm">
        <el-form-item label="楼栋名称:" label-width="80px">
          <el-input v-model="RoleForm.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="RoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="RoleVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
@Component
export default class DataTree extends Vue {
  private showMenu: Number = 0;
  @Prop({default: () => {
    return [
    {
      id: 1,
      label: "东区",
      children: [
        {
          id: 4,
          label: "1栋",
          children: [
            {
              id: 9,
              label: "1-1 单元"
            },
            {
              id: 10,
              label: "1-2 单元"
            }
          ]
        },
        {
          id: 5,
          label: "2栋",
          children: [
            {
              id: 9,
              label: "2-1 单元"
            },
            {
              id: 10,
              label: "2-2 单元"
            }
          ]
        }
      ]
    },
    {
      id: 2,
      label: "西区",
      children: [
        {
          id: 5,
          label: "4栋"
        },
        {
          id: 6,
          label: "5栋"
        }
      ]
    }] // 必须是函数式返回
  } }) TreeData: Array<Object>
  // private data: Array<Object> =

  @Prop({ default: true }) needAction: any;
  // 楼栋表单
  HouseForm: object = {
    name: '',
    title: '创建楼栋'
  }
  // 楼栋dialog状态
  HouseVisible:boolean = false
  // 权限表单
  RoleForm: object = {
    name: '',
    title: '创建权限'
  }
  // 权限dialog状态
  RoleVisible:boolean = false
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
  /**
   *
   */
  commandTreeClick(treeData) {
    switch (treeData.action) {
      case 'update' :
        this.HouseVisible = true
        this.HouseForm['title'] = '修改楼栋'
        this.HouseForm['name'] = treeData.node.label
        break
      case 'delete' :
        this.$confirm('此操作将永久删除该目标, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
        break
      case 'create' :
        this.HouseForm['title'] = '创建楼栋'
        this.HouseVisible = true
        break
    }
  }
  /**
   *  返回执行的操作及id
   */
  commandObj(action, node) {
    return {
      action,
      node
    }
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

<!--
  数据页面对应左边的树形结构
  TreeData: 传入的数据
-->
<template>
  <div class="content tree-rename">
    <div class="treeHeader">
      <i class="iconfont icon-shuji"></i>
      所有
      <el-dropdown class='dropdownAll' @command='commandTreeClick' trigger="click" placement="bottom-start">
        <i class="iconfont icon-menu"></i>
        <el-dropdown-menu v-if='type === "house"' slot="dropdown">
          <el-dropdown-item :command='commandObj("addGroup", {})'>添加子分组</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
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
            <el-dropdown-menu v-if='type === "house"' slot="dropdown">
              <el-dropdown-item :command='commandObj("addGroup", node)'>添加子分组</el-dropdown-item>
              <el-dropdown-item :command='commandObj("addUnit", node)'>添加单元楼</el-dropdown-item>
              <el-dropdown-item :command='commandObj("updateGroup", node)'>修改分组</el-dropdown-item>
              <el-dropdown-item :command='commandObj("delete", node)'>删除分组</el-dropdown-item>
            </el-dropdown-menu>
            <el-dropdown-menu v-if='type === "role"' slot="dropdown">
              <el-dropdown-item :command='commandObj("addRoleGroup", node)'>创建权限组</el-dropdown-item>
              <el-dropdown-item :command='commandObj("updateRole", node)'>修改</el-dropdown-item>
              <el-dropdown-item :command='commandObj("delete", node)'>删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </span>
    </el-tree>
    <!-- 楼栋dialog添加分组 -->
    <el-dialog width="500px" class='formDialog' title="添加分组" :visible.sync="HouseVisible">
      <el-form :model="HouseForm">
        <el-form-item label="序号:" label-width="80px">
          <el-input v-model="HouseForm.number" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="序号单位:" label-width="80px">
          <el-select v-model="HouseForm.orderUnit" placeholder="请选择">
            <el-option
              v-for="item in orderUnitList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="别名:" label-width="80px">
          <el-input v-model="HouseForm.otherName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注:" label-width="80px">
          <el-input v-model="HouseForm.detail" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="HouseVisible = false">确 定</el-button>
        <el-button type="warning" @click="HouseVisible = false">批量添加</el-button>
        <el-button @click="HouseVisible = false">取 消</el-button>

      </div>
    </el-dialog>
    <!-- 楼栋dialog添加单元楼 -->
    <el-dialog width="500px"  class='formDialog' title="添加单元楼" :visible.sync="HouseUnitVisible">
      <el-form :model="UnitForm">
        <el-form-item label="所属分组:" label-width="80px">
          <el-select v-model="UnitForm.orderGroup" placeholder="请选择">
            <el-option
              v-for="item in groupUnitList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="序号:" label-width="80px">
          <el-input style='width:50px' v-model="UnitForm.min" autocomplete="off"></el-input> -
          <el-input style='width:50px' v-model="UnitForm.max" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="序号单元:" label-width="80px">
          <el-input class='input' v-model="UnitForm.orderUnit" autocomplete="off"></el-input> <el-button @click='showUnitSetting = !showUnitSetting' type='text'>序号单元设置</el-button>
          <div v-if='showUnitSetting'>
             <el-tag
              :key="index"
              v-for="(tag, index) in Tags"
              closable
              :disable-transitions="false"
              @close="deleteTag(tag, index)">
              {{tag.label}}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="newTag"
              v-model="newTagValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
            >
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">新增单元</el-button>
          </div>

        </el-form-item>
        <el-form-item label="楼层数:" label-width="80px">
          <el-input v-model="HouseForm.floors" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="每层户数:" label-width="80px">
          <el-input v-model="HouseForm.households" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="HouseUnitVisible = false">确 定</el-button>
        <el-button @click="HouseUnitVisible = false">取 消</el-button>
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
  @Prop({ default: 'house' }) type: string;
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
  // 单位表单
  HouseForm: object = {
    number: '', // 序号
    orderUnit: '1',
    otherName: '',
    detail: ''
  }
  // 楼栋表单
  UnitForm: object = {
    orderGroup: '', // 所属分组
    min: '', // 最小序号
    max: '', // 最大序号
    orderUnit: '', // 序号单元
    floors: '', // 楼层数
    households: '' // 每层户数
  }
  // 序号单位数组
  orderUnitList: Array<object> = [
    {
      value: '1',
      label: '期'
    },
    {
      value: '2',
      label: '栋'
    },
    {
      value: '3',
      label: '区'
    }
  ]
  // 单元分组
  groupUnitList: Array<object> = [
    {
      value: '1',
      label: '#1'
    },
    {
      value: '2',
      label: '#2'
    },
    {
      value: '3',
      label: '#3'
    }
  ]
  // 楼栋dialog添加分组状态
  HouseVisible:boolean = false
   // 楼栋dialog添加楼栋状态
  HouseUnitVisible:boolean = false
  // 权限表单
  RoleForm: object = {
    name: '',
    title: '创建权限'
  }
  // 查看已有单元设置状态
  showUnitSetting: boolean = false
    // 单位序号设置 数组
  Tags: Array<object> = [
    {
      label: '期',
      value: '1'
    },
    {
      label: '栋',
      value: '2'
    }
  ]
  // 新增序号单元input框状态
  newTag: boolean = false
  // 新增单元的值
  newTagValue: string = ''
  // 权限dialog状态
  RoleVisible:boolean = false
  handleNodeClick(data) {
    /**@description */
    // console.log(data);
    // data.showMenu = !data.showMenu;
  }
  /**
   * 删除序号单元
   */
  deleteTag(tag, index) {
    this.Tags.splice(index, 1)
  }
  MouseNnter(val) {
    this.showMenu = val;
  }
  /**
   * 新增单元序号
   */
  handleInputConfirm() {
    this.newTag = false
    this.Tags.push({
      label: this.newTagValue,
      value: this.newTagValue
    })
  }
  /**
   * 显示新增序号单元框
   */
  showInput() {
    this.newTag = true
  }
  MouseLeave(val) {
    this.showMenu = 0;
  }
  /**
   *
   */
  commandTreeClick(treeData) {
    switch (treeData.action) {
      case 'addGroup' :
        this.HouseVisible = true
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
      case 'addUnit' :
        this.HouseUnitVisible = true
        break
      case 'updateGroup':
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
  text-align: left;
  border: 1px solid #ebeef5;
}
.treeHeader {
  width: 100%;
  height: 40px;
  text-align: left;
  text-indent: 1em;
  line-height: 40px;
  position:relative;
  i {
    font-size: 20px;
  }
  .icon-menu{
    display: none;

  }
  .dropdownAll{
    width:10px;
    height: 10px;
    position:absolute;
    right: 30px;
    top: 0px;
  }
  &:hover .icon-menu{
    display:block;
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
.formDialog{
  .input{
    width:220px;
  }
}
.input-new-tag{
  width:120px;
}
</style>

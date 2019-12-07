<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <action-header
        :filterStatus='false'
        :moreStatus='false'
        :dialogCreate.sync="dialogCreate" :total="page.total">
        </action-header>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="24" class="table-col">
        <div class="rightContent">
          <el-table
            :data="list_data"
            stripe
            v-loading='showLoading'

            style="max-height: 75vh;overflow:auto"
            highlight-current-row
            @selection-change="handleSelectionChange"
            @cell-mouse-enter="enterRowChange"
            @cell-mouse-leave="leaveRowChange"
          >
            <el-table-column type="selection" width="50"></el-table-column>

            <el-table-column type="index" label="序号" class="indexNum" align="center" width="50">
              <template slot-scope="scope">
                <span>{{scope.$index + 1}}</span>
                <div class="fun-btn">
                  <el-dropdown trigger="click" placement="bottom-start" @command="commandClick">
                    <i v-show="scope.row.showMenu" class="iconfont icon-menu"></i>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item :command='returnCommand("update", scope.row)'>修改</el-dropdown-item>
                      <!-- <el-dropdown-item :command='returnCommand("delete", scope.row)'>删除</el-dropdown-item> -->
                      <el-dropdown-item :command="returnCommand('delete', scope.row)">
                        {{ deleteForm.data.length ? '批量删除' : '删除' }}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="name" class="serial-num" label="角色" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="权限">
              <template slot-scope="{row}">
                 <el-button @click='updateRoleAction(row)' type='text'>修改权限</el-button>
              </template>
            </el-table-column>

            <el-table-column prop="note" label="备注" align="center">
              <template slot-scope="{row}">
                <span>{{ row.note || '--' }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
          </el-table>
        </div>
        <el-pagination
        @current-change='pageChange'
        :page-size="page.limit"
        style="margin-top:10px;" background layout="prev, pager, next" :total="page.total"></el-pagination>
      </el-col>
    </el-row>
    <!-- 权限弹框 -->
    <el-dialog :close-on-click-modal='false' class="dialog-rewrite" title="权限修改" :visible.sync="dialogTableVisible">
      <el-table :data="roleData">
        <el-table-column align="center" label="权限名称" width="200">
          <template slot-scope="{row}">{{ row.meta && row.meta.title }}</template>
        </el-table-column>
        <el-table-column align="center" label="修改">
          <template slot-scope="{row}">
            <el-checkbox @change="changeStatus(row)" v-model="row.Update"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column align="center" label="查看">
          <template slot-scope="{row}">
            <el-checkbox :disabled="row.lookDisabled" v-model="row.Look"></el-checkbox>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRole">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 新增或修改 -->
    <el-dialog
      title="新增"
      :close-on-click-modal='false'
      :visible.sync="dialogCreate"
      width="500px"
      :before-close="handleClose"
    >
      <el-form ref="Forms" :rules='rules' :model="Form" label-width="80px">
        <el-form-item label="角色名" prop='name'>
          <el-input placeholder="输入角色名字" maxlength="10" @input="constraintLength(Form.name,'10')" v-model="Form.name"></el-input>
        </el-form-item>
        <el-form-item label="备注" maxlength="200"  placeholder="输入角色备注说明(最多200字)" prop='note'>
          <el-input @input="constraintLength(Form.note,'200')" type="textarea" v-model="Form.note"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="addRoleConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import mixin from "@/config/minxins";
import { addRole, updateRole } from '@/api/systemApi.ts'
const ActionHeader = () => import("@/components/ActionHeader.vue");

@Component({
  mixins: [mixin],
  components: {
    ActionHeader
  }
})
export default class InformIssue extends Vue {
  private roleData: Array<Object> = [];
  private dialogLibrary: any = false;
  mounted() {
    const Route = [].concat(this.$router["options"].routes);
    Route.shift();
    Route.forEach((ele: any) => {
      ele.Update = false;
      ele.Look = false;
      ele.lookDisabled = false; // 当有其他权限存在时 查看权限必须有
    });
    this.roleData = Route.splice(1);
  }
  updateRoleForm: object = {
    id: '',
    name: '',
    note: '',
    permission: []
  }
  private dialogTableVisible: boolean = false;
  private Form: Object = {
    name: null,
    note: null,
    permission: []
  };
  initForm: object = {
    url: '/admin/usrRole/page',
    method: 'get'
  }
  deleteForm: object = {
    url: '/admin/usrRole',
    method: 'delete',
    data: []
  }
  rules: object = {
   name: [
            { required: true, message: '请输入角色名', trigger: 'blur' },
            { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
          ],
  }
  changeStatus(row) {
    row.Look = row.Update
    row.lookDisabled = row.Update
  }
  // 打开权限修改框
  updateRoleAction(row) {
    this.dialogTableVisible = true
    this.updateRoleForm = Object.assign(this.updateRoleForm, row)
  }
  // 保存修改权限
  saveRole() {
    let role: Array<string> = []
    this.roleData.forEach(ele => {
      if (ele['Update']) {
        role.push(ele['name'] + 'Update')
      }
      if (ele['Look']) {
        role.push(ele['name'] + 'Look')
      }
    })
    this.updateRoleForm['permission'] = role
    updateRole(this.updateRoleForm).then(res => {
      if (res.data.code === 200) {
        this.$message.success('修改权限成功')
        this.fetchData(this.initForm)
        this.dialogTableVisible = false
      }
    })
  }
  // 新增角色
  addRoleConfirm() {
    this.$refs['Forms']['validate']((valid) => {
      if(valid) {
        if(!this.Form['id']) {
          addRole(this.Form).then(res => {
            if (res.data.code === 200) {
              this['fetchData'](this.initForm)
              this.$message.success('新增角色成功')
            }
            this['handleClose']()
          })
        } else {
          updateRole(this.Form).then(res => {
            if (res.data.code === 200) {
              this['fetchData'](this.initForm)
              this.$message.success('修改角色成功')
            }
             this['handleClose']()
          })
        }
      }
    })

  }

  created() {
    this.initForm['params'] = Object.assign(this.initForm['params'], this.page) // 合并参数
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
td {
  padding: 6px 0px;
}
.demo-block {
  border: 1px solid #ebebeb;
  border-radius: 3px;
}

.serial-num {
  position: relative;
}


.close-menu {
  width: 10px;
  height: 48px;
  background: #acb7c1;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  position: relative;
}
.capture-img {
  width: 60px;
}
</style>

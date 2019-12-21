<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <action-header
        :moreStatus='false'
        :filterStatus='false'
        :initFormHeader="initForm"
          @fetchData="fetchData"
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

            highlight-current-row
            @selection-change="handleSelectionChange"
            @cell-mouse-enter="enterRowChange"
            @cell-mouse-leave="leaveRowChange"
          >
            <el-table-column type="selection" width="50"></el-table-column>

            <el-table-column type="index" align='center' class="indexNum" label="序号" width="50">
              <template slot-scope="scope">
                <span>{{scope.$index + 1}}</span>
                <div class="fun-btn">
                  <el-dropdown trigger="click" placement="bottom-start" @command="commandClick">
                    <el-tooltip class="item" effect="dark" content="点击操作" placement="top">
                      <i v-show="scope.row.showMenu" class="iconfont icon-menu"></i>
                    </el-tooltip>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item :command="returnCommand('update', scope.row)">修改</el-dropdown-item>
                      <el-dropdown-item :command="returnCommand('resetPassword', scope.row)">重置密码</el-dropdown-item>
                      <el-dropdown-item :command="returnCommand('delete', scope.row)">
                        {{ deleteForm.data.length ? '批量删除' : '删除' }}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="name"  :show-overflow-tooltip='true' width="200" class="serial-num" label="账号名" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
              </template>
            </el-table-column>

            <el-table-column prop="roleName" align="center" label="角色"></el-table-column>

            <el-table-column :show-overflow-tooltip='true' prop="note" label="备注" align="center">
              <template slot-scope="{row}">
                <span>{{ row.note || '--' }}</span>
              </template>
            </el-table-column>

            <el-table-column  :show-overflow-tooltip='true' width="180" label="操作" align="center">
              <template slot-scope="{row}">
                <el-dropdown @command="changeStatus"
                trigger="click">
                  <span class="el-dropdown-link">
                    <el-tag
                    size="small"
                    style="border-radius: 50px;padding: 0 10px; cursor: pointer;"
                    :type='row.status === "0" ? "error" : "danger" '
                    >{{ row.status === '0' ? '使用' : '禁用' }}
                    </el-tag>
                  </span>
                  <el-dropdown-menu  slot="dropdown">
                    <el-dropdown-item :command='ComponentCommand("0", row)'>使用</el-dropdown-item>
                    <el-dropdown-item :command='ComponentCommand("-1", row)'>禁用</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-pagination
        :page-size='page.limit'
        @current-change='pageChange' style="margin-top:10px;" background layout="prev, pager, next" :total="page.total"></el-pagination>
      </el-col>
    </el-row>
    <!-- 添加或修改 -->
    <el-dialog
      :title="Form.id ? '修改管理员' : '添加管理员'"
      :visible.sync="dialogCreate"
      width="460px"
      :close-on-click-modal='false'
      :before-close="handleClose"
    >
      <el-form :rules='rules' ref="Forms" :model="Form" label-width="80px">
        <el-form-item prop='name' label="账号">
          <el-input clearable style='position:fixed;bottom:-999999px' type='password' ></el-input>
          <el-input
          style="width:300px"
          auto-complete="off"
          maxlength="10"
          type='text'
           clearable
          placeholder="请输入账号"
          @input="constraintLength(Form.name, '10')"
          v-model="Form.name"></el-input>
        </el-form-item>
        <el-form-item prop='password' v-if='!Form.id' label="密码">
          <el-input clearable style='position:fixed;bottom:-999999px' type='password'></el-input>
          <el-input clearable style="width:300px"
          auto-complete="off"
          maxlength="10"
          placeholder="请输入密码"
          @input="constraintLength(Form.name, '10')"
          type='password'
          v-model="Form.password"></el-input>
        </el-form-item>
        <el-form-item prop='roleName' label="角色">
          <el-select style="width:300px" v-model="Form.roleName" placeholder="请选择角色">
            <el-option v-for='(item, index) in roleList' :label="item.name" :key='index' :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input style="width:300px" maxlength="200" placeholder="请输入备注" @input="constraintLength(Form.name, '200')" type="textarea" v-model="Form.note"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="addManagerConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 重置密码 -->
    <el-dialog
      title="重置密码"
      :visible.sync="resetVisible"
      width="460px"
      :close-on-click-modal='false'
      :before-close="handleCloseReset"
    >
      <el-form :rules='resetRules' ref="resetForms" :model="resetForms" label-width="80px">
        <el-form-item label="账号">
          <span>{{ resetForms.name }}</span>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input maxlength="10" clearable style="width:300px" type='password' placeholder="请输入修改后的密码" v-model="resetForms.newPassword "></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop='reNewPassword'>
          <el-input maxlength="10" clearable style="width:300px" type='password' placeholder="请再次确认密码" v-model="resetForms.reNewPassword "></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseReset">取 消</el-button>
        <el-button type="primary" @click="resetPasswordConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import mixin from "@/config/minxins";
import { addManager,
getRoleList,
manageStatus,
resetPassword } from '@/api/systemApi.ts'
const ActionHeader = () => import("@/components/ActionHeader.vue");
const DataTree = () => import("@/components/DataTree.vue");

@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    DataTree
  }
})
export default class InformIssue extends Vue {
  private dialogLibrary: any = false;
  private dialogFormVisible: Boolean = false;
  private roleTitle: String = "0";
  roleList: Array<object> = [] // 角色列表
  resetVisible: boolean = false // 重置密码框状态
  resetForms: object = {
    newPassword: '',
    reNewPassword: '',
    name: ''
  }
  private Form: Object = {
    name: null,
    roleId: null,
    note: null,
    password: '',
    roleName: ''
  };
  rules: object = {
    name: [
            { required: true, message: '请输入管理员名称', trigger: 'blur' },
            { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
          ],
    roleId: [
            { required: true, message: '请选择管理员的角色', trigger: 'blur' }
          ],
    roleName: [
            { required: true, message: '请选择管理员的角色', trigger: 'blur' }
          ],
    password: [
            { required: true, message: '请输入管理员的密码', trigger: 'blur' },
            { min: 6, max: 10, message: '长度在 8 到 16 个字符', trigger: 'blur' },
            {
             trigger: 'blur', validator: (rule, value, callback) => {
                if (this.passwordDiff(value) !== 2) {
                  callback(new Error('必须包含数字及英文'))
                } else {
                  callback()
                }
            }
          }
        ]
  }
  resetRules: object = {
    newPassword: [
            { required: true, message: '请输入管理员的密码', trigger: 'blur' },
            { min: 6, max: 10, message: '长度在 8 到 16 个字符', trigger: 'blur' },
            {
             trigger: 'blur', validator: (rule, value, callback) => {
                if (this.passwordDiff(value) !== 2) {
                  callback(new Error('必须包含数字及英文'))
                } else {
                  callback()
                }
            }
          }
          ],
    reNewPassword: [
            { required: true, message: '请确认管理员的密码', trigger: 'blur' },
            { min: 6, max: 10, message: '长度在 8 到 16 个字符', trigger: 'blur' },
            {
             trigger: 'blur', validator: (rule, value, callback) => {
                if (this.passwordDiff(value) !== 2) {
                  callback(new Error('必须包含数字及英文'))
                } else {
                  callback()
                }
            }
          }
          ]
  }
  initForm: object = {
    url: '/admin/usrUser/admin/list',
    method: 'get'
  }
  filterForm: object = {
    name: ''
  }
  updateArray: Array<string> = ['statusEdit'] //需要行内修改的
  deleteForm: object = {
    url: '/admin/usrUser/admin',
    method: 'delete',
    data: []
  }
  created() {
    this.initForm['params'] = Object.assign(this.initForm['params'], this.page, this.filterForm) // 合并参数
    this.fetchRoleList()
  }
  // 密码复杂度
  passwordDiff(str: string) {
    let diffcult: number = 0
    if((/[0-9]/).test(str)) {
      diffcult++
    }
    if((/[a-z]/i).test(str)) {
      diffcult++
    }
    return diffcult
  }
  // 确定添加/修改管理员
  addManagerConfirm() {
    this.$refs['Forms']['validate']((valid) => {
        if (valid) {
          this.roleList.forEach(ele => {
            if (ele['name'] === this.Form['roleName']) {
              this.Form['roleId'] = ele['id']
            }
          })
            addManager(this.Form).then(res => {
              if(res.data.code === 200) {
                this['fetchData'](this.initForm)
                this.$message.success(`${this.Form['id'] ? '修改成功' : '添加成功'}`)
              } else {
                this.$message.error(`${this.Form['id'] ? '修改失败' : '添加失败'}`)
              }
              this['handleClose']()
            })
        }
      })
  }
  ComponentCommand(status: string, row:object) {
    return {
      ...row,
      status
    }
  }
  // 修改管理员状态
  changeStatus(Obj: object) {
    manageStatus(Obj['status'], Obj['id']).then(res => {
      if(res.data.code === 200) {
        this.$message.success('修改成功')
        this['fetchData'](this.initForm)
      }
    })
  }
  // 确认重置密码
  resetPasswordConfirm() {
    this.$refs['resetForms']['validate']((valid) => {
      if (valid) {
        if (this.resetForms['newPassword'] !== this.resetForms['reNewPassword']) {
          this.$message.error('两次密码不一致!')
          return
        }
        const Obj = {
          id: this.resetForms['id'],
          newPassword: this.resetForms['newPassword']
        }
        resetPassword(Obj).then(res => {
          if(res.data.code === 200) {
            this.$message.success('修改密码成功!')
          } else {
            this.$message.error('修改密码失败!')
          }
          this.resetVisible = false
        })
      }
    })

  }
  // 关闭重置密码框
  handleCloseReset() {
    this.resetVisible = false
    this.resetForms['newPassword'] = ''
  }
  // 获取角色列表
  fetchRoleList() {
    getRoleList(null).then(res => {
      this.roleList = res.data.data
    })
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

// .icon-class {
//   font-size: 12px;
//   color: #e7eaeb;
//   cursor: pointer;
//   line-height: 48px;
//   position: absolute;
//   left: -1px;
// }

.capture-img {
  width: 60px;
}

</style>

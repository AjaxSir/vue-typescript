<template>
  <div  class="app-container">
        <el-row>
      <el-col :span="24">
        <action-header
        :filterStatus='false'
        :dialogCreate.sync="dialogCreate"
        :btnStatus='1'
        :moreStatus='false'
        :total="1">
        </action-header>
      </el-col>
    </el-row>
    <el-table
      :data="warningData"
      style="width: 100%">
      <el-table-column
        prop="name"
        align='center'
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="phone"
        align='center'
        label="电话">
      </el-table-column>
      <el-table-column
        prop="phone"
        align='center'
        label="邮箱">
      </el-table-column>
      <el-table-column
        prop="group"
        align='center'
        label="分组">
      </el-table-column>
    </el-table>
    <el-dialog width='600px' title="创建联系人" :visible.sync="dialogCreate">
      <el-form :model="linkForm" label-width="100px">
        <el-form-item label="名字:">
          <el-input v-model="linkForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话:">
          <el-input v-model="linkForm.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱:">
          <el-input v-model="linkForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分组:">
          <el-input v-model="linkForm.group" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCreate = false">取 消</el-button>
        <el-button type="primary" @click="dialogCreate = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
const ActionHeader = () => import("@/components/ActionHeader.vue");

@Component({
  components: {
    ActionHeader
  }
})
export default class WarningLink extends Vue{
    warningData: Array<object> = [
      {
        name: '张三',
        phone: '13518160000',
        email: 'asdewr@163.com',
        group: '门卫'
      }
    ]
    linkForm: object = {
      name: '',
      phone: '',
      email: '',
      group: ''
    }
    dialogCreate: boolean = false
}
</script>

<style scoped>

</style>

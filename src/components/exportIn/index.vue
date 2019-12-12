<template>
  <el-dialog
  title="批量导入"
  :visible.sync="visible"
  width="550px"
  :before-close="handleClose">
   <h3 class='margin'>导入说明</h3>
    <h4>1) 下载导入模板</h4>
    <h4>2) 所有允许导入的字段参考模板</h4>
    <h4>3) 所有数据必须按模板要求填写，否则系统将无法正常导入数据</h4>
    <h4>4) 目前仅支持xls、xlsx格式的文件导入</h4>
    <h4>5) 由于兼容性的问题，如果WPS文件导入失败，建议更换为office后再次导入</h4>
    <div @click='exportFunc("用户导入模板.xls", downTemplateUrl)' class='margin'>
      <i class="el-icon-download color"></i> <span class="color" style='padding:0px'>下载导入模板</span>
    </div>

    <h3 class='margin'>上传数据文件</h3>
    <el-upload
                class="upload-demo color"
                style="display:inline-block;margin-right:5px"
                :show-file-list='false'
                :on-error='errorUpload'
                :on-success='successUpload'
                :action="uploadUrl"
                ref='upload'
                :auto-upload='false'
                >
               <i class="el-icon-plus"></i>
                添加文件
              </el-upload><span>目前仅支持*.xlsx</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="confirmUpload">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'
@Component({})
export default class ExportIn extends Vue{
  @Prop({ default: '' }) downTemplateUrl : string
  @Prop({ default: '' }) uploadUrl: string
  @Prop({ default: false }) visible: boolean
  errorUpload() {
    this.$message.error('导入失败')
  }
  @Emit('successUpload')
  successUpload() {
    this.$message.success('导入成功')
    this.handleClose()
    return true
  }
  @Emit('closeVisible')
  handleClose() {
    return false
  }
    // 导出excel函数 处理数据
  exportFunc(fileName: string, url: string): void {
    // var blob = new Blob([data])
    if ('download' in document.createElement('a')) {
      // 非IE下载
      const elink = document.createElement('a')
      elink.download = fileName
      elink.style.display = 'none'
      elink.href = url
      // elink.href =URL.createObjectURL(blob)
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href) // 释放URL 对象
      document.body.removeChild(elink)
    } else {
      // IE10+下载
      navigator.msSaveBlob(Blob, fileName)
    }
  }
  // 确定上传
  confirmUpload() {
    this.$refs['upload']['submit']()
  }
}
</script>

<style scoped lang='scss'>
h4{
  color: gray;
  padding: 0px 0px 0px 20px;
  margin: 10px 0px;
}
.color{
  color: rgb(65, 199, 219);
   padding: 0px 0px 0px 20px;
}
.margin{
  margin: 10px 0px;
  &:hover{
    cursor: pointer;
  }
}
</style>

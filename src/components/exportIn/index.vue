<template>
  <div>
    <el-dialog title="批量导入" :visible.sync="visible" width="550px" :before-close="handleClose">
      <h3 class="margin">导入说明</h3>
      <h4>1) 下载导入模板</h4>
      <h4>2) 所有允许导入的字段参考模板</h4>
      <h4>3) 所有数据必须按模板要求填写，否则系统将无法正常导入数据</h4>
      <h4>4) 目前仅支持xlsx格式的文件导入</h4>
      <h4>5) 由于兼容性的问题，如果WPS文件导入失败，建议更换为office后再次导入</h4>
      <div @click="exportFunc(TmplateName, downTemplateUrl)" class="margin">
        <i class="el-icon-download color"></i>
        <span class="color" style="padding:0px">下载导入模板</span>
      </div>

      <h3 class="margin">上传数据文件</h3>
      <el-upload
        class="upload-demo color"
        style="display:inline-block;margin-right:5px;text-align:left"
        :show-file-list="false"
        :on-error="errorUpload"
        :on-success="successUpload"
        :multiple="false"
        :action="uploadUrl"
        accept=".xlsx"
        :on-change="changeFile"
        ref="upload"
        :auto-upload="false"
      >

        <i class="el-icon-plus"></i>

        添加文件 <br>
        <span style="color:black">{{ fileName }}</span>
      </el-upload>
      <h4>目前仅支持*.xlsx</h4>
      <!-- <h4>已选文件:{{fileName}}</h4> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="confirmUpload">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="失败详情" width="1000px" :visible.sync="dialogTableVisible">
      <el-table height="300px" border :data="errData">
        <el-table-column
          v-if="TmplateName==='用户导入模板.xlsx'"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          property="name"
          label="姓名"
          width="150"
        ></el-table-column>
        <el-table-column
          v-if="TmplateName==='用户导入模板.xlsx'"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          property="phone"
          label="电话"
          width="150"
        ></el-table-column>
        <el-table-column
          v-if="TmplateName==='用户导入模板.xlsx'"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          property="sex"
          label="性别"
          width="50"
        >
        </el-table-column>
        <el-table-column
          v-if="TmplateName==='用户导入模板.xlsx'"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          property="carNo"
          label="车牌"
          width="150"
        ></el-table-column>
        <el-table-column
          v-if="TmplateName==='用户导入模板.xlsx'"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          property="note"
          label="备注"
          width="150"
        ></el-table-column>
        <el-table-column
          v-if="TmplateName==='门禁卡导入模板.xlsx'"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          property="buildingName"
          label="单元名称"
          width="150"
        ></el-table-column>
        <el-table-column
          v-if="TmplateName==='门禁卡导入模板.xlsx'"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          property="groupName"
          label="所属楼栋"
          width="120"
        ></el-table-column>
        <el-table-column
          v-if="TmplateName==='门禁卡导入模板.xlsx'"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          width="120"
          property="validDate"
          label="有效时间"
        ></el-table-column>
        <el-table-column
          v-if="TmplateName==='门禁卡导入模板.xlsx'"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          width="120"
          property="houseNo"
          label="房屋编号"
        ></el-table-column>
        <el-table-column
          v-if="TmplateName==='门禁卡导入模板.xlsx'"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          width="160"
          property="cardNo"
          label="卡号"
        ></el-table-column>

        <el-table-column
          v-if="TmplateName==='车辆导出模板.xlsx'"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          property="carNo"
          label="车牌"
        ></el-table-column>
        <el-table-column
          v-if="TmplateName==='车辆导出模板.xlsx'"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          property="name"
          label="车主姓名"
        ></el-table-column>
        <el-table-column
          v-if="TmplateName==='车辆导出模板.xlsx'"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          property="phone"
          label="车主电话"
        ></el-table-column>
        <el-table-column
          v-if="TmplateName==='车辆导出模板.xlsx'"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          property="status"
          label="状态"
        ></el-table-column>
        <el-table-column
          v-if="TmplateName==='车辆导出模板.xlsx'"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          property="carModel"
          label="车辆品牌"
        ></el-table-column>
        <el-table-column
          v-if="TmplateName==='车辆导出模板.xlsx'"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          property="carType"
          label="车辆型号"
        ></el-table-column>
        <el-table-column
          v-if="TmplateName==='车辆导出模板.xlsx'"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          property="note"
          label="备注"
        ></el-table-column>
        <el-table-column
          v-if="TmplateName!=='车位导出模板.xlsx'"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          property="caseFail"
          label="失败原因"
        >
         <template slot-scope="{row}">
            <span v-for="(item,index) in row.caseFail" :key="'caseFail' + index">{{item}}</span>
          </template></el-table-column>
        <el-table-column
          v-if="TmplateName!=='车位导出模板.xlsx'"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          property="caseFail"
          label="错误定位"
        >
          <template slot-scope="{row}">
            <span>第 {{row.index}} 行</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="TmplateName==='车位导出模板.xlsx'"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          property="note"
          label="绑定车辆"
        >
          <template slot-scope="{row}">
            <span v-for="item in row.carSpaceCarVos" :key="item.carId">{{item.carNo}}</span>
          </template>
        </el-table-column>

        <el-table-column
          v-if="TmplateName==='车位导出模板.xlsx'"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          property="status"
          label="状态"
        ></el-table-column>

        <el-table-column
          v-if="TmplateName==='车位导出模板.xlsx'"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          property="ownerName"
          label="业主姓名"
        ></el-table-column>
        <el-table-column
          v-if="TmplateName==='车位导出模板.xlsx'"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          property="caseFail"
          label="失败原因"
        >
          <template slot-scope="{row}">
            <span v-for="(item,index) in row.errMsg" :key="'caseFail' + index">{{item}}</span>
          </template>
        </el-table-column>

        <el-table-column
          v-if="TmplateName==='车位导出模板.xlsx'"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          property="caseFail"
          label="错误定位"
        >
          <template slot-scope="{row}">
            <span>第 {{row.rowIndex}} 行</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { exportList } from '@/api/user.ts'
import { Component, Vue, Prop, Emit } from "vue-property-decorator";
@Component({})
export default class ExportIn extends Vue {
  @Prop({ default: "" }) downTemplateUrl: string;
  @Prop({ default: "" }) uploadUrl: string;
  @Prop({ default: false }) visible: boolean;
  @Prop({ default: "用户导入模板.xlsx" }) TmplateName: string;
  @Emit("errorUpload")
  errorUpload(err, file, list) {
    this.errData = JSON.parse(err.message);
    this.dialogTableVisible = true;
    this.$refs.upload["clearFiles"]();
    this.$message.error("导入失败");
    this.fileName = ''
  }
  errData: Array<object> = []; // 失败路径
  fileName: string = ""; // 文件名字
  dialogTableVisible: boolean = false; // 导出失败状态
  @Emit("successUpload")
  successUpload(file) {
    this.$message.success("导入成功");
    this.$refs.upload["clearFiles"]();
    this.handleClose();
    this.fileName = ''
    return true;
  }

  changeFile(file) {
    this.fileName = file.name;
  }

  mounted() {
    console.log(this.uploadUrl)
    if (process.env.NODE_ENV === 'production') {
          this.uploadUrl = this.uploadUrl.replace('/v1', 'http://47.103.184.184')
        }
  }

  @Emit("closeVisible")
  handleClose() {
    this.fileName = ''
    return false;
  }
  // 导出excel函数 处理数据
  exportFunc(fileNames: string, url: string): void {
    if (process.env.NODE_ENV === 'production') {
          url = url.replace('/v1', 'http://47.103.184.184')
        }
        exportList(url).then(res => {
            const fileName = fileNames
            var blob = new Blob([res.data], {
              type: 'application/vnd.ms-excel;charset=UTF-8'
            })
            if ('download' in document.createElement('a')) {
              // 非IE下载
              const elink = document.createElement('a')
              elink.download = fileName
              elink.style.display = 'none'
              elink.href = URL.createObjectURL(blob)
              document.body.appendChild(elink)
              elink.click()
              URL.revokeObjectURL(elink.href) // 释放URL 对象
              document.body.removeChild(elink)
            } else {
              // IE10+下载
              navigator.msSaveBlob(blob, fileName)
            }
          })
  }
  // 确定上传
  confirmUpload() {
    this.$refs["upload"]["submit"]();
  }
}
</script>

<style scoped lang='scss'>
h4 {
  color: gray;
  padding: 0px 0px 0px 20px;
  margin: 10px 0px;
}
.color {
  color: rgb(65, 199, 219);
  padding: 0px 0px 0px 20px;
}
.margin {
  margin: 10px 0px;
  &:hover {
    cursor: pointer;
  }
}
</style>

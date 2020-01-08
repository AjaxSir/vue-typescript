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
        :headers="header"
        :action="uploadUrl"
        accept=".xlsx"
        :on-change="changeFile"
        ref="upload"
        :auto-upload="false"
      >
        <i class="el-icon-plus"></i>
        添加文件
        <br />
        <span style="color:black">{{ fileName }}</span>
      </el-upload>
      <h4>目前仅支持*.xlsx</h4>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="confirmUpload">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="失败详情" width="1000px" :visible.sync="dialogTableVisible">
      <el-table height="300px" stripe border :data="errData">
        <el-table-column
          v-if="uploadUrl.indexOf('/admin/usrUser/import') !== -1 || uploadUrl.indexOf('/admin/usrUser/PropertyManager/import') !== -1"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          property="name"
          label="姓名"
          width="150"
        ></el-table-column>
        <el-table-column
          v-if="uploadUrl.indexOf('/admin/usrUser/import') !== -1 || uploadUrl.indexOf('/admin/usrUser/PropertyManager/import') !== -1"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          property="phone"
          label="电话"
          width="150"
        ></el-table-column>
        <el-table-column
          v-if="uploadUrl.indexOf('/admin/usrUser/import') !== -1 || uploadUrl.indexOf('/admin/usrUser/PropertyManager/import') !== -1"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          property="sex"
          label="性别"
          width="50"
        ></el-table-column>
        <el-table-column
          v-if="uploadUrl.indexOf('/admin/usrUser/import') !== -1"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          property="userType"
          label="住户类型"
          width="150"
        ></el-table-column>
        <el-table-column
          v-if="uploadUrl.indexOf('/admin/usrUser/import') !== -1"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          property="carNo"
          label="车牌"
          width="150"
        ></el-table-column>
        <el-table-column
          v-if="uploadUrl.indexOf('/admin/usrUser/PropertyManager/import') !== -1"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          property="note"
          label="备注"
          width="150"
        ></el-table-column>
        <el-table-column
          v-if="uploadUrl.indexOf('/admin/hsDoorCard/import') !== -1"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          property="buildingName"
          label="单元名称"
          width="150"
        ></el-table-column>
        <el-table-column
          v-if="uploadUrl.indexOf('/admin/hsDoorCard/import') !== -1"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          property="groupName"
          label="所属楼栋"
          width="120"
        ></el-table-column>
        <el-table-column
          v-if="uploadUrl.indexOf('/admin/hsDoorCard/import') !== -1"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          width="120"
          property="validDate"
          label="有效时间"
        ></el-table-column>
        <el-table-column
          v-if="uploadUrl.indexOf('/admin/hsDoorCard/import') !== -1"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          width="120"
          property="houseNo"
          label="房屋编号"
        ></el-table-column>
        <el-table-column
          v-if="uploadUrl.indexOf('/admin/hsDoorCard/import') !== -1"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          width="160"
          property="cardNo"
          label="卡号"
        ></el-table-column>

        <el-table-column
          v-if="uploadUrl.indexOf('/admin/usrUser/import') !== -1 || uploadUrl.indexOf('/admin/usrUser/PropertyManager/import') !== -1 || uploadUrl.indexOf('/admin/hsDoorCard/import') !== -1"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          property="caseFail"
          label="失败原因"
        >
          <template slot-scope="{row}">
            <span v-for="(item,index) in row.caseFail" :key="'caseFail' + index">{{item}},</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="uploadUrl.indexOf('/admin/usrUser/import') !== -1 || uploadUrl.indexOf('/admin/usrUser/PropertyManager/import') !== -1 || uploadUrl.indexOf('/admin/hsDoorCard/import') !== -1"
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

        <!-- 车辆 -->

        <el-table-column
          v-if="uploadUrl.indexOf('/admin/usr-car/import') !== -1"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          property="carNo"
          label="车牌"
        ></el-table-column>
        <el-table-column
          v-if="uploadUrl.indexOf('/admin/usr-car/import') !== -1"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          property="name"
          label="车主姓名"
        ></el-table-column>
        <el-table-column
          v-if="uploadUrl.indexOf('/admin/usr-car/import') !== -1"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          property="phone"
          label="车主电话"
        ></el-table-column>
        <el-table-column
          v-if="uploadUrl.indexOf('/admin/usr-car/import') !== -1"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          property="status"
          label="状态"
        ></el-table-column>
        <el-table-column
          v-if="uploadUrl.indexOf('/admin/usr-car/import') !== -1"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          property="carModel"
          label="车辆品牌"
        ></el-table-column>
        <el-table-column
          v-if="uploadUrl.indexOf('/admin/usr-car/import') !== -1"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          property="carType"
          label="车辆型号"
        ></el-table-column>
        <el-table-column
          v-if="uploadUrl.indexOf('/admin/usr-car/import') !== -1"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          property="note"
          label="备注"
        ></el-table-column>

        <el-table-column
          v-if="uploadUrl.indexOf('/admin/usr-car/import') !== -1"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          property="status"
          label="状态"
        ></el-table-column>

        <el-table-column
          v-if="uploadUrl.indexOf('/admin/usr-car/import') !== -1"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          property="ownerName"
          label="业主姓名"
        ></el-table-column>

        <el-table-column
          v-if="uploadUrl.indexOf('/admin/usr-car/import') !== -1"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          property="caseFail"
          label="失败原因"
        >
          <template slot-scope="{row}">
            <span v-for="(item,index) in row.caseFail" :key="'caseFail' + index">{{item}},</span>
          </template>
        </el-table-column>

        <el-table-column
          v-if="uploadUrl.indexOf('/admin/usr-car/import') !== -1"
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

        <!-- 车位 -->

        <el-table-column
          v-if="uploadUrl.indexOf('/admin/car-space/import') !== -1"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          property="groupName"
          label="所属分组"
        ></el-table-column>

        <el-table-column
          v-if="uploadUrl.indexOf('/admin/car-space/import') !== -1"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          property="serialNumber"
          label="编号"
        ></el-table-column>

        <el-table-column
          v-if="uploadUrl.indexOf('/admin/car-space/import') !== -1"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          property="status"
          label="状态"
        ></el-table-column>

        <el-table-column
          v-if="uploadUrl.indexOf('/admin/car-space/import') !== -1"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          property="carOwnerName"
          label="业主"
        ></el-table-column>

        <el-table-column
          v-if="uploadUrl.indexOf('/admin/car-space/import') !== -1"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          property="carOwnerPhone"
          label="业主电话"
        ></el-table-column>

        <el-table-column
          v-if="uploadUrl.indexOf('/admin/car-space/import') !== -1"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          property="carSpaceTypeName"
          label="车位类型"
        ></el-table-column>

        <el-table-column
          v-if="uploadUrl.indexOf('/admin/car-space/import') !== -1"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          property="bindCarName"
          label="绑定车辆"
        ></el-table-column>

        <el-table-column
          v-if="uploadUrl.indexOf('/admin/car-space/import') !== -1"
          :show-overflow-tooltip="true"
          :key="Math.random()"
          align="center"
          property="caseFail"
          label="失败原因"
        >
          <template slot-scope="{row}">
            <span v-for="(item,index) in row.errMsg" :key="'errMsg' + index">{{item}},</span>
          </template>
        </el-table-column>

        <el-table-column
          v-if="uploadUrl.indexOf('/admin/car-space/import') !== -1"
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
import { exportList } from "@/api/user.ts";
import { Component, Vue, Prop, Emit } from "vue-property-decorator";
import { Getter } from "vuex-class";
import { message } from "@/utils";
import qs from "qs";
@Component({})
export default class ExportIn extends Vue {
  @Prop({ default: "" }) downTemplateUrl: string;
  @Prop({ default: "" }) uploadUrl: string;
  @Prop({ default: false }) visible: boolean;
  @Getter("token") token: string;
  @Prop({ default: "用户导入模板.xlsx" }) TmplateName: string;
  header: object = {};
  errData: Array<object> = []; // 失败路径
  fileName: string = ""; // 文件名字
  dialogTableVisible: boolean = false; // 导出失败状态
  @Emit("errorUpload")
  errorUpload(err, file, list) {
    this.$nextTick(() => {
      this.fileName = "";
    });
    this.errData = [];
    if (JSON.parse(err.message).code === 400) {
      message("error", JSON.parse(err.message).message);
    } else {
      this.errData = JSON.parse(err.message);
      this.dialogTableVisible = true;
      this.$refs.upload["clearFiles"]();
    }
    this.handleClose();
  }
  @Emit("successUpload")
  successUpload(file) {
    this.$nextTick(() => {
      this.fileName = "";
    });
    message("success", `导入成功`);
    this.$refs.upload["clearFiles"]();
    this.handleClose();
  }
  changeFile(file) {
    this.fileName = file.name;
  }
  mounted() {
    this.header = {
      token: this.token
    };
  }

  @Emit("closeVisible")
  handleClose() {
    this.fileName = "";
    return false;
  }

  exportFunc(fileNames: string, exportUrl: string): void {
    const filterUrl = qs.stringify({ isData: false });
    if (process.env.NODE_ENV === "production") {
      exportUrl = exportUrl.replace("/v1", "http://47.103.184.184");
    }

    exportList(exportUrl + "/?" + filterUrl).then(res => {
      const fileName = fileNames;
      var blob = new Blob([res.data], {
        type: "application/vnd.ms-excel;charset=UTF-8"
      });
      if ("download" in document.createElement("a")) {
        // 非IE下载
        const elink = document.createElement("a");
        elink.download = fileName;
        elink.style.display = "none";
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
      } else {
        // IE10+下载
        navigator.msSaveBlob(blob, fileName);
      }
    });
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

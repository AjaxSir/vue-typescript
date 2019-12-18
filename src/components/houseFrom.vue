<template>
  <div>
    <el-dialog
      class="image-dialod"
      title="创建楼栋"
      :visible="formShow"
      :close-on-click-modal="false"
      :before-close="formClose"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="formData"
        label-position="right"
        label-width="100px"
        style="width: 410px; margin-left:80px;"
      >
        <el-form-item
          class="phone-input"
          label="楼栋"
          prop="name"
          :show-message="showMessage"
          :error="errorMessage.name"
        >
          <el-input v-model="formData.name" placeholder="请输入楼栋名称"></el-input>
        </el-form-item>

        <el-form-item
          class="phone-input"
          label="单元"
          prop="unit"
          :show-message="showMessage"
          :error="errorMessage.unit"
        >
          <el-input v-model="formData.unit" placeholder="请输入单元号"></el-input>
        </el-form-item>

        <el-form-item
          class="phone-input"
          label="单元"
          prop="unit"
          :show-message="showMessage"
          :error="errorMessage.unit"
        >
          <el-input v-model="formData.unit" placeholder="请输入单元号"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="formClose">取消</el-button>
        <el-button type="primary" :disabled="addDisabled" @click="createHouse">创建</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { createHouseInfo, editHouse } from "@/api/houseList";
// import { getCookie } from "@/utils/cookie";

export default {
  name: "addUser",
  props: {
    formShow: {
      // 弹出框显示标志
      type: Boolean,
      default() {
        return false;
      }
    },
    formData: {
      type: Object // 楼栋弹出框信息
    }
  },

  data() {
    return {
      errorMessage: {
        // 表单错误信息
        name: "",
        unit: ""
      },
      showMessage: true,
      startFetch: false,
      disabled: true,
      addDisabled: false,
      creatRole: [],
      icNumber: null,
      icNumberType: false,
      apartmentType: [],
      community: ""
    };
  },

  computed: {
    rules() {
      // 房屋信息验证
      return {
        name: [{ required: true, message: "请输入楼栋名称", trigger: "blur" }],
        unit: [{ required: true, message: "请输入单元号", trigger: "blur" }]
      };
    }

    // role() {
    //   if (getCookie("role") == 4) {
    //     return {
    //       // roleNameA: "工区名称: ",
    //       // roleNameB: "创建工区",
    //       // roleNameC: "修改工区",
    //       // roleNameD: "请输入工区名称",
    //       // roleNameE: "编号: ",
    //       // roleNameF: "请输入编号"
    //       roleNameA: "楼栋名称: ",
    //       roleNameB: "创建楼栋",
    //       roleNameC: "修改楼栋",
    //       roleNameD: "请输入房屋名称",
    //       roleNameE: "单元: ",
    //       roleNameF: "请输入房屋单元"
    //     };
    //   } else {
    //     return {
    //       roleNameA: "楼栋名称: ",
    //       roleNameB: "创建楼栋",
    //       roleNameC: "修改楼栋",
    //       roleNameD: "请输入房屋名称",
    //       roleNameE: "单元: ",
    //       roleNameF: "请输入房屋单元"
    //     };
    //   }
    // }
  },

  methods: {
    createHouse() {
      /**@description 添加楼栋处理 */
      // this.house();
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          //     for (const key in this.errorMessage) {
          //       this.errorMessage[key] = "";
          //     }
          //     createHouseInfo(this.formData)
          //       .then(res => {
          this.formClose();
          //         this.$emit("fetchFrom");
          //         this.$emit("gethouseListData");
          this.$notify({
            type: "success",
            title: "成功",
            message: "创建楼栋成功"
          });
          //       })
          //       .catch(err => {
          //         const { data } = err.response;
          //         this.formData.unit = this.formData.unit.replace(
          //           /(000|00|0)/i,
          //           ""
          //         );
          //         for (const k in data) {
          //           this.errorMessage[k] = data[k][0];
          //         }
          //       });
        }
      });
    },

    async editHouseInfo() {
      /**@description 修改楼栋 */
      // this.house();
      // for (const key in this.errorMessage) {
      //   this.errorMessage[key] = "";
      // }
      // try {
      //   const { data } = await editHouse(this.formData);
      //   this.formClose();
      //   this.$emit("fetchFrom");
      //   this.$emit("gethouseListData");
      //   this.$notify({
      //     type: "success",
      //     title: "成功",
      //     message: "修改楼栋成功"
      //   });
      // } catch (err) {
      //   const { data } = err.response;
      //   this.formData.unit = this.formData.unit.replace(/(000|00|0)/i, "");
      //   for (const k in data) {
      //     this.errorMessage[k] = data[k][0];
      //   }
      // }
    },

    // house() {
    //   this.formData.unit = this.formData.copyUnit;
    //   if (this.formData.unit.length === 0) {
    //     this.formData.unit = "000";
    //   } else if (this.formData.unit.length === 1) {
    //     this.formData.unit = "00" + this.formData.unit;
    //   } else if (this.formData.unit.length === 2) {
    //     this.formData.unit = "0" + this.formData.unit;
    //   } else if (this.formData.unit.length > 3) {
    //     this.formData.unit = this.formData.unit.substr(-3);
    //   }
    // },

    formClose() {
      /**@description Form 关闭处理 */
      // this.disabled = true;
      // this.icNumberType = false;
      this.$emit("update:formShow", false);
      // this.resetValue();
    }

    // resetValue() {
    //   /**@description  关闭表单时初始化数据 */
    //   this.startFetch = false;
    //   this.$refs["dataForm"].resetFields();
    // }
  }
};
</script>
<style>
.el-dialog__body {
  padding: 0;
}
.el-dialog__wrapper {
  position: fixed;
  top: -46px;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
}
</style>

<style scoped>
.image-dialod {
  width: 1200px;
  /* height: 600px; */
  margin: 0 auto;
  /* overflow-y: hidden; */
}
.el-dialog {
  width: 600px;
}
.item {
  display: flex;
  align-content: flex-end;
  margin-top: 5px;
}
.loading {
  width: 65px;
  height: 65px;
  text-align: center;
  line-height: 65px;
  border: 1px solid #dcdfe6;
  margin: 0 5px 10px 0;
  font-size: 30px;
  color: #409eff;
}
.face-image {
  height: 95px;
  position: relative;
}
.face-imgs {
  width: 360px;
  display: flex;
  justify-content: space-around;
  position: absolute;
  top: -6px;
  left: -6px;
}
.images {
  width: 65px;
  height: 65px;
  margin-right: 5px;
}
.info {
  margin: 0;
  padding: 0 0 0 8px;
  height: 32px;
  width: 250px;
  border: 1px solid #dcdfe6;
  line-height: 33px;
  font-size: 12px;
}
.primarybtn {
  height: 30px;
  margin-left: 10px;
}
.phone-input {
  position: relative;
}
.err-phone {
  font-size: 12px;
  color: #f56c6c;
  position: absolute;
  bottom: -29px;
  left: 0;
}
.card-num {
  position: absolute;
  top: 18px;
  font-size: 12px;
  color: #f56c6c;
}
</style>


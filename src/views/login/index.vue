<template>
  <div class="login-container">
    <el-form
      auto-complete="on"
      :model="loginForm"
      ref="loginForm"
      :rules="loginRules"
      label-position="left"
      label-width="0px"
      class="card-box login-form"
    >
      <div class="title">
        <span>1</span>
        <span class="logo">stone</span>
        <span class="slogan">一石智能识别门禁系统</span>
      </div>
      <el-form-item prop="scenceCode">
        <span class="svg-container svg-container_login">
          <i class="iconfont icon-fangzicopy"></i>
        </span>
        <el-input
          name="scenceCode"
          type="text"
          v-model="loginForm.scenceCode"
          auto-complete="on"
          placeholder="小区名称"
          @keyup.enter.native="handleLogin"
        />
      </el-form-item>
      <el-form-item prop="account">
        <span class="svg-container svg-container_login">
          <i class="iconfont icon-user"></i>
        </span>
        <el-input
          name="account"
          type="text"
          v-model="loginForm.account"
          auto-complete="on"
          placeholder="username"
          @keyup.enter.native="handleLogin"
        />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <i class="iconfont icon-mima"></i>
        </span>
        <el-input
          name="password"
          type="password"
          @keyup.enter.native="handleLogin"
          v-model="loginForm.password"
          auto-complete="on"
          placeholder="password"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          class="login-btn"
          style="width:100%;"
          :loading="loading"
          @click.native.prevent="handleLogin"
          @keyup.enter.native="handleLogin"
        >登录</el-button>
      </el-form-item>
      <div class="login-info">{{ loginInfo }}</div>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins, Provide } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import mixin from "../../config/minxins";
import { login } from "../../api/user";
import { getName, setCode, getCode } from "@/utils/auth";
@Component({
  mixins: [mixin]
})
export default class Login extends Vue {
  filterForm: object = {
    tag: "no"
  }; //根据关键字查询
  initForm: object = {
    //获取车辆列表url
    url: "/open/admin/login/",
    method: "post"
  };

  @Getter("name") name: any;
  @Action("SET_NAME") set_name: any;
  @Action("SET_TOKEN") set_token: any;

  private loginForm: Object = {
    account: "",
    password: "123456",
    scenceCode: ""
  };

  private loginRules: Object = {
    password: [
      { required: true, trigger: "blur", validator: "密码不能小于6位" }
    ]
  };

  private loginInfo: String = "";
  private loading: Boolean = false;

  created() {
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    ); // 合并参数

    if (getName()) {
      this.loginForm["account"] = getName();
    }
    if (getCode()) {
      this.loginForm["scenceCode"] = getCode();
    }
  }

  mounted() {
    this.checkUserInfo();
  }

  // 检查是否已登录, 错误不做处理
  checkUserInfo() {
    // this.$store.dispatch('GetInfo').then(() => {
    // this.$router.push({ path: '/' })
    // }).catch(() => {})
  }

  handleLogin() {
    this.$refs.loginForm["validate"](valid => {
      if (valid) {
        this.loading = true;
        login(this.loginForm)
          .then(response => {
            this.loading = false;
            setCode(this.loginForm["scenceCode"]);
            this.set_name(response.data.data.name);
            this.set_token(response.data.data.token);
            this.$router.push({ path: "/" });
          })
          .catch(err => {
            this.loading = false;
            console.log(err);
            this.loginInfo = err.response.data.message;
          });
      } else {
        console.log("error submit!!");
        return false;
      }
    });
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" >
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
$FFDeg: -45deg;
$transFF: $FFDeg, rgba(0, 160, 140, 0.85), rgba(30, 40, 129, 0.85);
$transSS: $FFDeg, rgba(0, 160, 140, 0.75), rgba(30, 40, 129, 0.75);
$primary_btn: #1eb464;

.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background: -webkit-linear-gradient($transSS); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient($transSS); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient($transSS); /* Firefox 3.6 - 15 */
  background: linear-gradient($transSS); /* 标准的语法（必须放在最后） */
  input:-webkit-autofill {
    -webkit-text-fill-color: #fff !important;
    transition: background-color 5000s ease-in-out 0s;
  }
  .title {
    color: #fff;
    margin: 0 auto 30px;
    font-size: 36px;
    font-style: italic;
    font-weight: bold;
    text-align: center;
    .logo {
      color: yellow;
      font-size: 30px;
    }
    .slogan {
      color: #fff;
      font-size: 20px;
      text-align: center;
    }
  }
  input {
    background: transparent;
    border: 0px;
    -webkit-appearance: none;
    border-radius: 0px;
    padding: 12px 5px 12px 15px;
    color: $light_gray;
    height: 47px;
  }
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
  }
  .login-info {
    font-size: 14px;
    text-align: center;
    color: #ff4949;
    margin-bottom: 10px;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .login-form {
    position: absolute;
    width: 500px;
    top: 50%;
    left: 50%;
    margin-left: -250px;
    margin-top: -170px;
    padding: 35px 60px 15px 60px;
    box-sizing: border-box;
    border-radius: 5px;
    background: -webkit-linear-gradient($transFF); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient($transFF); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient($transFF); /* Firefox 3.6 - 15 */
    background: linear-gradient($transFF); /* 标准的语法（必须放在最后） */
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
  .login-btn {
    background-color: $primary_btn;
    border-color: $primary_btn;
    height: 40px;
    font-size: 14px;
    color: #fff;
  }
}
</style>

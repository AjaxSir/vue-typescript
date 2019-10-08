<template>
  <div class="header">
    <div class="yishi-header">
      <div class="header-left">
        <img class="logo" src="../../../assets/logo.png" alt />
        <p class="header-title">一石智能识别门禁系统</p>
      </div>
      <div class="header-left header-right">
        <svg-icon icon-class="username" class-name="admin-svg" />
        <p>admin</p>
        <p class="logout" @click="logout">退出</p>
      </div>
    </div>
    <p class="line"></p>
    <el-menu class="navbar" mode="horizontal">
      <p class="style-line"></p>
      <p class="style-line style-lineA"></p>
      <p class="style-line style-lineB"></p>
      <p class="style-line style-lineC"></p>
      <breadcrumb></breadcrumb>
    </el-menu>
  </div>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";
import Breadcrumb from "@/components/Breadcrumb";

@Component({
  components: {
    Breadcrumb
  }
})
export default class Navbar extends Vue {
  created() {}
  logout() {
    console.log("退出");
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$FFDeg: -45deg;
$transSS: $FFDeg, rgba(0, 160, 140, 0.75), rgba(30, 40, 129, 0.75);

p {
  margin: 0;
  padding: 0;
}
.yishi-header {
  height: 80px;
  padding: 6px 30px 0;
  display: flex;
  justify-content: space-between;
}
.line {
  height: 1px;
  border-bottom: 1px solid rgba(71, 71, 88, 0.15);
  margin: 10px 0;
}
.header-left {
  display: flex;
  align-items: center;
}
.logo {
  height: 54px;
}
.header-title {
  font-size: 24px;
  font-weight: bold;
  margin-top: 32px;
}

.header-right {
  margin-top: 40px;
}
.admin-svg {
  padding: 5px;
  font-size: 30px;
  color: #fff;
  background: rgb(235, 137, 27);
  border-radius: 50%;
  margin-right: 5px;
  margin-left: 15px;
}
.logout {
  margin-left: 10px;
  text-align: center;
}
.logout:hover {
  font-weight: bold;
  color: rgb(235, 137, 27);
  cursor: pointer;
}
.navbar {
  height: 40px;
  line-height: 40px;
  margin: 0 20px;
  border-radius: 0px !important;
  display: flex;
  align-items: flex-end;
  .style-line {
    height: 40px;
    width: 2px;
    margin-right: 2px;
    background: RGB(86, 97, 161);
  }
  .style-lineA {
    height: 33px;
    background: RGB(78, 128, 164);
  }
  .style-lineB {
    height: 26px;
    background: RGB(71, 154, 166);
  }
  .style-lineC {
    height: 20px;
    background: RGB(64, 182, 168);
  }
}
</style>

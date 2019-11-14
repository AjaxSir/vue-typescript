<template>
  <div class="header">
    <div class="yishi-header">
      <div class="header-left">
        <img class="logo" src="../../../assets/logo.png" alt />
        <p class="header-title">一石智能识别门禁系统</p>
      </div>
      <div class="header-left header-right">
        <div>
          <i class="iconfont icon-icon-user"></i>
        </div>
        <p>admin</p>
        <p class="logout" @click="logout">退出</p>
      </div>
    </div>
    <p class="line"></p>
    <el-menu class="navbar" mode="horizontal" style="border:none;">
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
.header {
  box-shadow: 0px 0px 15px lightgrey;
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
.iconfont {
  padding: 5px;
  font-size: 20px;
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
  line-height: 30px;
  margin: 0 20px;
  border-radius: 0px !important;
  display: flex;
  align-items: flex-end;
  .style-line {
    height: 30px;
    width: 2px;
    margin-bottom: 8px;
    margin-right: 2px;
    background: RGB(86, 97, 161);
  }
  .style-lineA {
    height: 23px;
    background: RGB(78, 128, 164);
  }
  .style-lineB {
    height: 16px;
    background: RGB(71, 154, 166);
  }
  .style-lineC {
    height: 10px;
    background: RGB(64, 182, 168);
  }
}
</style>

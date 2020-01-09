<template>
  <div class="header">
    <div class="yishi-header">
      <div class="header-left">
        <img class="logo" src="../../../assets/logo.png" alt />
        <p class="header-title">一石智能识别门禁系统</p>
      </div>
      <div class="header-left header-right">
        <div class="menu-item">
          未读警报
          <!-- "/watchlist/black-record" -->
          <router-link to>
            <el-badge :value="warningCount" :max="9999">
              <i class="iconfont icon-jingbao"></i>
            </el-badge>
          </router-link>
        </div>
        <div>
          <i class="iconfont icon-icon-user"></i>
        </div>
        <p>{{ name }}</p>
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

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import { clearCookie } from "@/utils/cookie";
import { Getter } from "vuex-class";
import Breadcrumb from "@/components/Breadcrumb/index.vue";

@Component({
  components: {
    Breadcrumb
  }
})
export default class Navbar extends Vue {
  @Getter("name") name: string;
  private warningCount: any = 0;
  created() {}
  logout() {
    this.$router.push({ path: "/login" });
    clearCookie();
    location.reload(); // 为了重新实例化vue-router对象 避免bug
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

.menu-item{
  // color: #909399;
}

.iconfont.icon-jingbao {
  font-size: 26px;
}

.iconfont.icon-icon-user {
  padding: 5px;
  font-size: 20px;
  color: #fff;
  background: rgb(235, 137, 27);
  border-radius: 50%;
  margin-right: 5px;
  margin-left: 20px;
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

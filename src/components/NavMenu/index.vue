<template>
  <!-- :collapse="isCollapse" -->
  <el-menu
    :default-active="active"
    :unique-opened="true"
    key="menu"
    class="el-menu-vertical-demo"
    @open="handleOpen"
    @close="handleClose"
    :collapse="!isCollapse"
  >
    <el-submenu v-for="(routes, index) in Routes" :key="index + 1" :index="String(index)">
      <template v-if="routes.alwaysShow" slot="title">
        <i :class="['iconfont', routes.meta.icon]"></i>
        <span v-if="isCollapse" slot="title">{{ routes.meta.title }}</span>
      </template>
      <el-menu-item-group v-if="routes.children">
        <router-link
          v-for="(children, indexChildren) in routes.children"
          :key="indexChildren"
          :to="routes.path + '/' + children.path"
        >
          <el-menu-item
            :index="routes.path + '/' + children.path"
            v-if="!children.meta.hidden"
            :class="[locRoute.indexOf(children.path) !== -1 ? 'activeLink': '']"
          >{{ children.meta.title }}</el-menu-item>
        </router-link>
      </el-menu-item-group>
    </el-submenu>

    <!-- <el-menu-item
      @click="todevice"
      :class="[locRoute.indexOf('device') !== -1 ? 'activeLink': '']"
      index="41"
    >
      <i
        class="iconfont icon-shexiangtou1"
        :style="[locRoute.indexOf('device') !== -1 ? styleObject: '']"
      ></i>
      <span slot="title">设备管理</span>
    </el-menu-item>

    <el-menu-item
      @click="toinform"
      :class="[locRoute.indexOf('inform') !== -1 ? 'activeLink': '']"
      index="11"
    >
      <i
        class="iconfont icon-tongzhi"
        :style="[locRoute.indexOf('inform') !== -1 ? styleObject: '']"
      ></i>
      <span slot="title">通知管理</span>
    </el-menu-item> -->

    <!-- <el-menu-item
      @click="toVistorRegister"
      :class="[locRoute.indexOf('vistor') !== -1 ? 'activeLink': '']"
      index="10"
    >
      <i
        class="iconfont icon-fangkeshuxing"
        :style="[locRoute.indexOf('vistor') !== -1 ? styleObject: '']"
      ></i>
      <span slot="title">访客登记</span>
    </el-menu-item> -->

    <!-- <el-menu-item
      @click="tostatementManage"
      :class="[locRoute.indexOf('statementManage') !== -1 ? 'activeLink': '']"
      index="74"
    >
      <i
        class="iconfont icon-chart"
        :style="[locRoute.indexOf('statementManage') !== -1 ? styleObject: '']"
      ></i>
      <span slot="title">报表管理</span>
    </el-menu-item> -->

    <!-- <el-menu-item @click="toBigScreen" index="0">
      <i class="iconfont icon-tongji"></i>
      <span slot="title">大屏统计</span>
    </el-menu-item> -->

    <el-menu-item class="showHidden" @click="toggleMenu" index="4">
      <i v-if="!isCollapse" class="el-icon-arrow-right"></i>
      <i v-else class="el-icon-arrow-left"></i>
      <span slot="title">{{ !isCollapse ? '展开' : '收起' }}</span>
    </el-menu-item>
  </el-menu>
</template>


<script lang="ts">
import { Component, Vue, Emit, Watch } from "vue-property-decorator";
import { Getter } from 'vuex-class'

@Component
export default class NavMenu extends Vue {
  @Getter('router') router:Array<object>
  isCollapse: boolean = true;
  @Emit("MenuStatus")
  toggleMenu() {
    this.isCollapse = !this.isCollapse;
    return this.isCollapse;
  }
  active: string = ""; // 默认打开的导航菜单
  locRoute: string = "";
  styleObject: Object = {
    color: "#ffffff"
  };
  get Routes() {
    const route = [].concat(this.$router["options"].routes); // [ ...route ] = this.$router['options'].routes
    route.splice(0, 2) &&
      route.splice(4, 1) &&
      route.splice(3, 1)
       &&
      route.splice(4, 1)

    return this.router;
  }
  @Watch("$route", { immediate: true })
  routeChange(n, o){
    this.locRoute = n.path;
    this.active = this.locRoute;
  }
  handleOpen() {}
  handleClose() {}
  toBigScreen() {
    this.$router.replace({
      path: "/screen/statistics"
    });
  }
  toVistorRegister() {
    this.$router.replace({
      path: "/vistor/register"
    });
  }
  tostatementManage() {
    this.$router.replace({
      path: "/statementManage/info"
    });
  }
  toinform() {
    this.$router.replace({
      path: "/inform/issue"
    });
  }
  todevice() {
    this.$router.replace({
      path: "/device/_manage"
    });
  }
}
</script>

<style lang="scss" scoped>
i {
  font-size: 20px;
  margin-right: 15px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 160px;
}
.activeLink {
  background-color: #409eff !important;
  color: white !important;
}
</style>

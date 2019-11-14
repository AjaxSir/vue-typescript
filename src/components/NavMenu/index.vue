<template>
<!-- :collapse="isCollapse" -->
  <el-menu :unique-opened='true' key='menu' class="el-menu-vertical-demo"
  @open="handleOpen" @close="handleClose"
  :collapse="!isCollapse"
  >

    <el-submenu v-for='(routes, index) in Routes' :key='index' :index="String(index)">
        <template v-if='routes.alwaysShow' slot="title">
          <i :class="['iconfont', routes.meta.icon]"></i>
          <span v-if='isCollapse' slot="title">{{ routes.meta.title }}</span>
        </template>
        <el-menu-item-group v-if='routes.children && routes.alwaysShow'>
          <router-link v-for='(children, indexChildren) in routes.children' :key='indexChildren' :to='routes.path + "/" + children.path'>
            <el-menu-item :class='[locRoute.indexOf(children.path) !== -1 ? "activeLink": ""]'>{{ children.meta.title }}</el-menu-item>
          </router-link>
        </el-menu-item-group>
    </el-submenu>
    <el-menu-item @click='toggleMenu' index="4">
      <i v-if='!isCollapse' class="el-icon-arrow-right"></i>
      <i v-else class="el-icon-arrow-left"></i>
      <span slot="title">{{ !isCollapse ? '展开' : '收起' }}</span>
    </el-menu-item>
  </el-menu>
</template>


<script lang="ts">
import { Component, Vue, Emit, Watch } from 'vue-property-decorator';
@Component
export default class NavMenu extends Vue{
  isCollapse: boolean = true
  @Emit('MenuStatus')
  toggleMenu() {
    this.isCollapse = !this.isCollapse
    return this.isCollapse
  }
  locRoute: string = ''
  get Routes() {
    const route = [].concat(this.$router['options'].routes) // [ ...route ] = this.$router['options'].routes
    route.splice(0, 1)
    return route
  }
  @Watch('$route', { immediate: true })
  routeChange(n, o) {
    this.locRoute = n.path
  }
  handleOpen() {}
  handleClose() {}

}
</script>

<style lang="scss" scoped>
i{
  font-size: 20px;
  margin-right: 15px;
}
.el-menu-vertical-demo:not(.el-menu--collapse){
  width: 240px;
}
.activeLink{
  background-color: #409EFF !important;
  color: white;
}
</style>

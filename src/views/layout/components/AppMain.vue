<template>
  <div class="contentOut">
        <div class="navMenu" id='navMenu' v-if='status'>
          <NavMenu @MenuStatus='changeStatus' />
        </div>
        <div class="routerView">
          <router-view />
        </div>

  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import NavMenu from '@/components/NavMenu/index.vue';
@Component({
  components: {
    NavMenu
  }
})
export default class AppMain extends Vue{
  get status () {
    return this.$route.name !== 'dashboard'
  }
  changeStatus(status) {
    if (!status) {
      const dom = document.getElementById('navMenu') as HTMLElement
      dom.style.width = '64px'
    } else {
      const dom = document.getElementById('navMenu') as HTMLElement
      dom.style.width = '240px'
    }
  }
}
</script>>
<style lang="scss">
.contentOut {
  width: 100%;
  padding-top: 10px;
  display: flex;
  // box-shadow: inset 0px 15px 10px -15px lightgray;
}
.navMenu{
  overflow-x: hidden;
  height: calc(100vh - 151px);
  overflow: auto;
  flex: none;
  width: 240px;
  // box-shadow: 2px 0px 10px 2px lightgray;
}
.routerView{
  flex: 1;
}
</style>

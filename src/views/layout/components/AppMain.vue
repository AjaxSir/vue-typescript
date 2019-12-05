<template>
  <div class="contentOut">
        <div class="navMenu" id='navMenu' v-if='status'>
          <NavMenu @MenuStatus='changeStatus' />
        </div>
        <div class="routerView">
          <transition  name='fade' mode="out-in">
            <router-view />
          </transition>
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
  get status (): boolean {
    const whiteList = ['dashboard', 'statistics']
    return !whiteList.includes(this.$route.name as string)
  }
  changeStatus(status) {
    if (!status) {
      const dom = document.getElementById('navMenu') as HTMLElement
      dom.style.width = '64px'
    } else {
      const dom = document.getElementById('navMenu') as HTMLElement
      dom.style.width = '177px'
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
  width: 177px;
  // box-shadow: 2px 0px 10px 2px lightgray;
}
.routerView{
  // flex: 1;
  // margin-left: 15px;
  width: calc(100% - 188px);
  // padding-right: 20px;
  box-sizing: border-box;
}

 .fade-enter{
        opacity: 0;
    }
    .fade-enter-active{
        transition: opacity .5s;
    }
    .fade-leave{
        opacity: 1;
    }
    .fade-leave-active{
        opacity: 0;
        transition: opacity .5s;}
</style>

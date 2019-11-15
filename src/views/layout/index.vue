<template>
  <div>
    <navbar v-if='status'></navbar>
    <app-main></app-main>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import { Navbar, AppMain } from "@/views/layout/components";

@Component({
  components: {
    Navbar,
    AppMain
  }
})
export default class Layout extends Vue {
  get status (): boolean {
    const whiteList = ['statistics']
    return !whiteList.includes(this.$route.name as string)
  }
}
</script>

<style scoped></style>

<template>
  <div>
    <navbar></navbar>
    <app-main></app-main>
  </div>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";
import { Navbar, AppMain } from "@/views/layout/components";

@Component({
  components: {
    Navbar,
    AppMain
  }
})
export default class Layout extends Vue {}
</script>

<style scoped></style>

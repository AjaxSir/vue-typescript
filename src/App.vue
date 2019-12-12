<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>
<style lang="scss">
* {
  margin: 0px;
  padding: 0px;
}
#app{
  background-color: #F8F8F8
}
// #nprogress .bar {
//   background: #4e80a4 !important; //nprogress自定义颜色
// }
</style>

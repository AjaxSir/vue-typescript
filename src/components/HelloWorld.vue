<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="date" label="日期" width="180"> </el-table-column>
      <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
      <el-table-column prop="address" label="地址"> </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import mixin from "./../config/minxins";
import { login } from "./../api/user";
@Component({
  mixins: [mixin]
})
export default class HelloWorld extends Vue {
  constructor() {
    super();
  }
  public tableData: Array<Object> = [];
  @Prop({ default: "默认值" }) private msg!: string;
  @Getter("name") name: any;
  @Action("SET_NAME") set_name: any;
  created() {
    this.set_name("科技");
    login({
      username: "root",
      password: "root!2345"
    }).then((res: any) => {
      console.log(res);
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

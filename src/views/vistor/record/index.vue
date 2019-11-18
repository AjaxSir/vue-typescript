<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <ActionHeader
        :moreStatus='false'
        :btnStatus='2'
        :total="1">
        </ActionHeader>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="rowSpan.row1">
        <data-tree />
      </el-col>
      <el-col :span="rowSpan.row2" class="table-col">
        <div class="rightContent">
          <el-table
            :data="recordData"
            style="width: 100%">
            <el-table-column
              type='selection'
              align='center'
              width="50">
            </el-table-column>
             <el-table-column
              type='index'
              label='编号'
              align='center'
              width="50">
            </el-table-column>
            <el-table-column
              prop="name"
              align='center'
              label="姓名"
              width="180">
            </el-table-column>
            <el-table-column
              prop="phone"
              label="电话"
              align='center'
             >
            </el-table-column>
            <el-table-column
              prop="phone"
              label="受访人姓名"
              align='center'
             >
            </el-table-column>
            <el-table-column
              prop="phone"
              label="访客类型"
              align='center'
             >
            </el-table-column>
            <el-table-column
              prop="phone"
              label="身份证号"
              align='center'
             >
            </el-table-column>
            <el-table-column
              prop="phone"
              label="注册时间"
              align='center'
             >
            </el-table-column>
            <el-table-column
              prop="phone"
              label="状态"
              align='center'
             >
            </el-table-column>
            <el-table-column
              prop="phone"
              label="实际通行时间"
              align='center'
             >
            </el-table-column>
            <el-table-column
              prop="phone"
              label="人脸信息"
              align='center'
             >
            </el-table-column>
            <el-table-column
              prop="phone"
              label="创建时间"
              align='center'
             >
            </el-table-column>
          </el-table>
        </div>
        <div :class="rowSpan.row1===4 ? menuControl1 : menuControl2" @click="menuVisible">
          <p class="close-menu">
            <i v-if="rowSpan.row1===4" class="iconfont icon-left icon-class"></i>
            <i v-else class="iconfont icon-zuo icon-class"></i>
          </p>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import mixin from "@/config/minxins";
const ActionHeader = () => import("@/components/ActionHeader.vue");

const DataTree = () => import("@/components/DataTree.vue");

@Component({
  mixins: [mixin],
  components: {
    DataTree,
    ActionHeader
  }
})
export default class VistorRegister extends Vue {
  private rowSpan: any = {
    row1: 4,
    row2: 20
  };
  private menuControl1: String = "menu-control";
  private menuControl2: String = "menu-visible";
  recordData: Array<object> = [
    {
      phone: '13518160000',
      name: 'zhansgan'
    }
  ]
    menuVisible() {
    /**@description 控制楼栋 */
    if (this.rowSpan.row1 === 4) {
      this.rowSpan = {
        row1: 0,
        row2: 24
      };
    } else {
      this.rowSpan = {
        row1: 4,
        row2: 20
      };
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  display: flex;
  .rightContent {
    flex: 1;
  }
}

.table-col {
  position: relative;
}

.menu-control {
  position: absolute;
  top: 32vh;
  left: -5px;
}

.menu-visible {
  position: absolute;
  top: 32vh;
  left: -15px;
}

.close-menu {
  width: 10px;
  height: 48px;
  background: #acb7c1;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  position: relative;
}

.icon-class {
  font-size: 12px;
  color: #e7eaeb;
  cursor: pointer;
  line-height: 48px;
  position: absolute;
  left: -1px;
}
</style>

<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <ActionHeader :dialogCreate.sync="dialogCreate" :total="1">
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>房屋导入</el-dropdown-item>
            <el-dropdown-item>房屋导出</el-dropdown-item>
            <el-dropdown-item>统计信息</el-dropdown-item>
            <el-dropdown-item>远程开门</el-dropdown-item>
          </el-dropdown-menu>
          <div slot="houseNum">
            <div class="word-filter">
              <span class="filter-name">房屋号:</span>
              <el-input class="input-filter" size="small"></el-input>
            </div>
          </div>
          <!-- <span slot='houseNum'></span> -->
        </ActionHeader>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="4">
        <DataTree />
      </el-col>
      <el-col :span="20">
        <div style="margin-bottom:15px">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>出入口</span>
            </div>
            <el-button type="primary" plain>
              东门
              <i class="iconfont icon-shexiangtou"></i>
            </el-button>
          </el-card>
        </div>
        <div class="col-20">
          <div class="singleTable" :style="{ width: '602px' }">
            <el-table class="singleClass" border :data="list_data">
              <el-table-column label="1" align="center" width="50">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.first.status">
                    {{
                    scope.row.first.num
                    }}
                  </el-tag>
                  <el-tag v-else type="danger">标签一</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="2" align="center" width="50">
                <template slot-scope="scope">
                  <el-tooltip
                    v-if="scope.row.first.status"
                    class="item"
                    effect="dark"
                    content="132"
                    placement="top"
                  >
                    <el-tag>{{ scope.row.first.num }}</el-tag>
                  </el-tooltip>
                  <el-tag v-else type="danger">标签一</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="3" align="center" width="50">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.first.status">
                    {{
                    scope.row.first.num
                    }}
                  </el-tag>
                  <el-tag v-else type="danger">标签一</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="4" align="center" width="50">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.first.status">
                    {{
                    scope.row.first.num
                    }}
                  </el-tag>
                  <el-tag v-else type="danger">标签一</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="5" align="center" width="50">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.first.status">
                    {{
                    scope.row.first.num
                    }}
                  </el-tag>
                  <el-tag v-else type="danger">标签一</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="6" align="center" width="50">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.first.status">
                    {{
                    scope.row.first.num
                    }}
                  </el-tag>
                  <el-tag v-else type="danger">标签一</el-tag>
                </template>
              </el-table-column>
            </el-table>
            <el-table class="singleClass" border :data="list_data">
              <el-table-column label="1" align="center" width="50">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.first.status">
                    {{
                    scope.row.first.num
                    }}
                  </el-tag>
                  <el-tag v-else type="danger">标签一</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="2" align="center" width="50">
                <template slot-scope="scope">
                  <el-tooltip
                    v-if="scope.row.first.status"
                    class="item"
                    effect="dark"
                    content="132"
                    placement="top"
                  >
                    <el-tag>{{ scope.row.first.num }}</el-tag>
                  </el-tooltip>
                  <el-tag v-else type="danger">标签一</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="3" align="center" width="50">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.first.status">
                    {{
                    scope.row.first.num
                    }}
                  </el-tag>
                  <el-tag v-else type="danger">标签一</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="4" align="center" width="50">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.first.status">
                    {{
                    scope.row.first.num
                    }}
                  </el-tag>
                  <el-tag v-else type="danger">标签一</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="5" align="center" width="50">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.first.status">
                    {{
                    scope.row.first.num
                    }}
                  </el-tag>
                  <el-tag v-else type="danger">标签一</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="6" align="center" width="50">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.first.status">
                    {{
                    scope.row.first.num
                    }}
                  </el-tag>
                  <el-tag v-else type="danger">标签一</el-tag>
                </template>
              </el-table-column>
            </el-table>
            <div class="houseInfo">
              一单元
              <i class="iconfont icon-shexiangtou"></i>
            </div>
            <div class="houseInfo">
              二单元
              <i class="iconfont icon-shexiangtou"></i>
            </div>
            <div class="partHouse">西区-1栋</div>
          </div>
          <div class="singleTable" :style="{ width: '602px' }">
            <el-table class="singleClass" border :data="list_data">
              <el-table-column label="1" align="center" width="50">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.first.status">
                    {{
                    scope.row.first.num
                    }}
                  </el-tag>
                  <el-tag v-else type="danger">标签一</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="2" align="center" width="50">
                <template slot-scope="scope">
                  <el-tooltip
                    v-if="scope.row.first.status"
                    class="item"
                    effect="dark"
                    content="132"
                    placement="top"
                  >
                    <el-tag>{{ scope.row.first.num }}</el-tag>
                  </el-tooltip>
                  <el-tag v-else type="danger">标签一</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="3" align="center" width="50">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.first.status">
                    {{
                    scope.row.first.num
                    }}
                  </el-tag>
                  <el-tag v-else type="danger">标签一</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="4" align="center" width="50">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.first.status">
                    {{
                    scope.row.first.num
                    }}
                  </el-tag>
                  <el-tag v-else type="danger">标签一</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="5" align="center" width="50">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.first.status">
                    {{
                    scope.row.first.num
                    }}
                  </el-tag>
                  <el-tag v-else type="danger">标签一</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="6" align="center" width="50">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.first.status">
                    {{
                    scope.row.first.num
                    }}
                  </el-tag>
                  <el-tag v-else type="danger">标签一</el-tag>
                </template>
              </el-table-column>
            </el-table>
            <el-table class="singleClass" border :data="list_data">
              <el-table-column label="1" align="center" width="50">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.first.status">
                    {{
                    scope.row.first.num
                    }}
                  </el-tag>
                  <el-tag v-else type="danger">标签一</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="2" align="center" width="50">
                <template slot-scope="scope">
                  <el-tooltip
                    v-if="scope.row.first.status"
                    class="item"
                    effect="dark"
                    content="132"
                    placement="top"
                  >
                    <el-tag>{{ scope.row.first.num }}</el-tag>
                  </el-tooltip>
                  <el-tag v-else type="danger">标签一</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="3" align="center" width="50">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.first.status">
                    {{
                    scope.row.first.num
                    }}
                  </el-tag>
                  <el-tag v-else type="danger">标签一</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="4" align="center" width="50">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.first.status">
                    {{
                    scope.row.first.num
                    }}
                  </el-tag>
                  <el-tag v-else type="danger">标签一</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="5" align="center" width="50">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.first.status">
                    {{
                    scope.row.first.num
                    }}
                  </el-tag>
                  <el-tag v-else type="danger">标签一</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="6" align="center" width="50">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.first.status">
                    {{
                    scope.row.first.num
                    }}
                  </el-tag>
                  <el-tag v-else type="danger">标签一</el-tag>
                </template>
              </el-table-column>
            </el-table>
            <div class="houseInfo">
              一单元
              <i class="iconfont icon-shexiangtou"></i>
            </div>
            <div class="houseInfo">
              二单元
              <i class="iconfont icon-shexiangtou"></i>
            </div>
            <div class="partHouse">西区-1栋</div>
          </div>
          <div class="singleTable" :style="{ width: '602px' }">
            <el-table class="singleClass" border :data="list_data">
              <el-table-column label="1" align="center" width="50">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.first.status">
                    {{
                    scope.row.first.num
                    }}
                  </el-tag>
                  <el-tag v-else type="danger">标签一</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="2" align="center" width="50">
                <template slot-scope="scope">
                  <el-tooltip
                    v-if="scope.row.first.status"
                    class="item"
                    effect="dark"
                    content="132"
                    placement="top"
                  >
                    <el-tag>{{ scope.row.first.num }}</el-tag>
                  </el-tooltip>
                  <el-tag v-else type="danger">标签一</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="3" align="center" width="50">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.first.status">
                    {{
                    scope.row.first.num
                    }}
                  </el-tag>
                  <el-tag v-else type="danger">标签一</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="4" align="center" width="50">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.first.status">
                    {{
                    scope.row.first.num
                    }}
                  </el-tag>
                  <el-tag v-else type="danger">标签一</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="5" align="center" width="50">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.first.status">
                    {{
                    scope.row.first.num
                    }}
                  </el-tag>
                  <el-tag v-else type="danger">标签一</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="6" align="center" width="50">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.first.status">
                    {{
                    scope.row.first.num
                    }}
                  </el-tag>
                  <el-tag v-else type="danger">标签一</el-tag>
                </template>
              </el-table-column>
            </el-table>
            <el-table class="singleClass" border :data="list_data">
              <el-table-column label="1" align="center" width="50">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.first.status">
                    {{
                    scope.row.first.num
                    }}
                  </el-tag>
                  <el-tag v-else type="danger">标签一</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="2" align="center" width="50">
                <template slot-scope="scope">
                  <el-tooltip
                    v-if="scope.row.first.status"
                    class="item"
                    effect="dark"
                    content="132"
                    placement="top"
                  >
                    <el-tag>{{ scope.row.first.num }}</el-tag>
                  </el-tooltip>
                  <el-tag v-else type="danger">标签一</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="3" align="center" width="50">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.first.status">
                    {{
                    scope.row.first.num
                    }}
                  </el-tag>
                  <el-tag v-else type="danger">标签一</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="4" align="center" width="50">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.first.status">
                    {{
                    scope.row.first.num
                    }}
                  </el-tag>
                  <el-tag v-else type="danger">标签一</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="5" align="center" width="50">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.first.status">
                    {{
                    scope.row.first.num
                    }}
                  </el-tag>
                  <el-tag v-else type="danger">标签一</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="6" align="center" width="50">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.first.status">
                    {{
                    scope.row.first.num
                    }}
                  </el-tag>
                  <el-tag v-else type="danger">标签一</el-tag>
                </template>
              </el-table-column>
            </el-table>
            <div class="houseInfo">
              一单元
              <i class="iconfont icon-shexiangtou"></i>
            </div>
            <div class="houseInfo">
              二单元
              <i class="iconfont icon-shexiangtou"></i>
            </div>
            <div class="partHouse">西区-1栋</div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      title="提示"
      :visible.sync="dialogCreate"
      width="30%"
      :before-close="handleClose">
      <span>这是房屋管理新增</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogCreate = false">取 消</el-button>
        <el-button type="primary" @click="dialogCreate = false">确 定</el-button>
      </span>
    </el-dialog>
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
    ActionHeader,
    DataTree
  }
})
export default class HouseManage extends Vue {
  private list_data: Array<any> = [
    {
      first: {
        num: "1",
        status: true
      },
      second: {
        num: "2",
        status: false
      },
      third: {
        num: "3",
        status: true
      },
      four: {
        num: "4",
        status: false
      },
      five: {
        num: "5",
        status: true
      },
      six: {
        num: "6",
        status: true
      }
    }
  ];
}
</script>

<style lang="scss" scoped>
.col-20 {
  overflow-y: auto;
  white-space: nowrap;
  padding-bottom: 10px;
  min-height: 240px;
}
.singleTable {
  display: inline-block;
  height: 100%;
  width: auto;
  box-shadow: 0px 6px 5px 0px lightgray;
  margin-left: 20px;
  &:first-child {
    margin-left: 0px;
  }
  .singleClass {
    width: 301px;
    float: left;
  }
  .houseInfo {
    width: 301px;
    // display: inline-block;
    height: 40px;
    line-height: 40px;
    text-align: center;
    float: left;
    border-bottom: 1px solid #ebeef5;
    &:nth-last-child(2) {
      border-left: 1px solid #ebeef5;
      box-sizing: border-box;
    }
  }
  .partHouse {
    width: 100%;
    height: 40px;
    float: left;
    text-align: center;
    line-height: 40px;
  }
}
.iconfont {
  margin-left: 5px;
  font-size: 16px;
}
</style>

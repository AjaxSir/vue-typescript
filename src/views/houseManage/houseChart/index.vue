<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <!-- <ActionHeader :btnStatus='0' :total="1">
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
        </ActionHeader> -->
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
        <div class="col-201">
          <div class="singleTable" :style="{ width: '301px' }">
            <el-table class="singleClass" border :data="list_data">
              <el-table-column label="1" align="center" width="50">
                <template slot-scope="scope">
                  <el-tooltip
                    v-if="scope.row.first.status"
                    class="item"
                    effect="dark"
                    content="132"
                    placement="top"
                  >
                    <el-button @click='showHouseRecord(scope.row)' type='text'>{{ scope.row.first.num }}</el-button>
                  </el-tooltip>
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
                    <el-button type='text'>{{ scope.row.first.num }}</el-button>
                  </el-tooltip>
                  <el-tag v-else type="danger">标签一</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="3" align="center" width="50">
                <template slot-scope="scope">
                  <el-tooltip
                    v-if="scope.row.first.status"
                    class="item"
                    effect="dark"
                    content="132"
                    placement="top"
                  >
                    <el-button type='text'>{{ scope.row.first.num }}</el-button>
                  </el-tooltip>
                  <el-tag v-else type="danger">标签一</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="4" align="center" width="50">
                <template slot-scope="scope">
                  <el-tooltip
                    v-if="scope.row.first.status"
                    class="item"
                    effect="dark"
                    content="132"
                    placement="top"
                  >
                    <el-button type='text'>{{ scope.row.first.num }}</el-button>
                  </el-tooltip>
                  <el-tag v-else type="danger">标签一</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="5" align="center" width="50">
                <template slot-scope="scope">
                  <el-tooltip
                    v-if="scope.row.first.status"
                    class="item"
                    effect="dark"
                    content="132"
                    placement="top"
                  >
                    <el-button type='text'>{{ scope.row.first.num }}</el-button>
                  </el-tooltip>
                  <el-tag v-else type="danger">标签一</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="6" align="center" width="50">
                <template slot-scope="scope">
                  <el-tooltip
                    v-if="scope.row.first.status"
                    class="item"
                    effect="dark"
                    content="132"
                    placement="top"
                  >
                    <el-button type='text'>{{ scope.row.first.num }}</el-button>
                  </el-tooltip>
                  <el-tag v-else type="danger">标签一</el-tag>
                </template>
              </el-table-column>
            </el-table>
            <div class="houseInfo">
              一单元
              <i class="iconfont icon-shexiangtou"></i>
            </div>
            <!-- <div class="houseInfo">
              二单元
              <i class="iconfont icon-shexiangtou"></i>
            </div> -->
            <div class="partHouse">西区-1栋</div>
          </div>
          <div class="singleTable" :style="{ width: '602px' }">
            <el-table class="singleClass" border :data="list_data">
              <el-table-column label="1" align="center" width="50">
               <template slot-scope="scope">
                  <el-tooltip
                    v-if="scope.row.first.status"
                    class="item"
                    effect="dark"
                    content="132"
                    placement="top"
                  >
                    <el-button type='text'>{{ scope.row.first.num }}</el-button>
                  </el-tooltip>
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
                    <el-button type='text'>{{ scope.row.first.num }}</el-button>
                  </el-tooltip>
                  <el-tag v-else type="danger">标签一</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="3" align="center" width="50">
               <template slot-scope="scope">
                  <el-tooltip
                    v-if="scope.row.first.status"
                    class="item"
                    effect="dark"
                    content="132"
                    placement="top"
                  >
                    <el-button type='text'>{{ scope.row.first.num }}</el-button>
                  </el-tooltip>
                  <el-tag v-else type="danger">标签一</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="4" align="center" width="50">
                <template slot-scope="scope">
                  <el-tooltip
                    v-if="scope.row.first.status"
                    class="item"
                    effect="dark"
                    content="132"
                    placement="top"
                  >
                    <el-button type='text'>{{ scope.row.first.num }}</el-button>
                  </el-tooltip>
                  <el-tag v-else type="danger">标签一</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="5" align="center" width="50">
               <template slot-scope="scope">
                  <el-tooltip
                    v-if="scope.row.first.status"
                    class="item"
                    effect="dark"
                    content="132"
                    placement="top"
                  >
                    <el-button type='text'>{{ scope.row.first.num }}</el-button>
                  </el-tooltip>
                  <el-tag v-else type="danger">标签一</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="6" align="center" width="50">
                <template slot-scope="scope">
                  <el-tooltip
                    v-if="scope.row.first.status"
                    class="item"
                    effect="dark"
                    content="132"
                    placement="top"
                  >
                    <el-button type='text'>{{ scope.row.first.num }}</el-button>
                  </el-tooltip>
                  <el-tag v-else type="danger">标签一</el-tag>
                </template>
              </el-table-column>
            </el-table>
            <el-table class="singleClass" border :data="list_data">
              <el-table-column label="1" align="center" width="50">
                <template slot-scope="scope">
                  <el-tooltip
                    v-if="scope.row.first.status"
                    class="item"
                    effect="dark"
                    content="132"
                    placement="top"
                  >
                    <el-button type='text'>{{ scope.row.first.num }}</el-button>
                  </el-tooltip>
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
                    <el-button type='text'>{{ scope.row.first.num }}</el-button>
                  </el-tooltip>
                  <el-tag v-else type="danger">标签一</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="3" align="center" width="50">
               <template slot-scope="scope">
                  <el-tooltip
                    v-if="scope.row.first.status"
                    class="item"
                    effect="dark"
                    content="132"
                    placement="top"
                  >
                    <el-button type='text'>{{ scope.row.first.num }}</el-button>
                  </el-tooltip>
                  <el-tag v-else type="danger">标签一</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="4" align="center" width="50">
                <template slot-scope="scope">
                  <el-tooltip
                    v-if="scope.row.first.status"
                    class="item"
                    effect="dark"
                    content="132"
                    placement="top"
                  >
                    <el-button type='text'>{{ scope.row.first.num }}</el-button>
                  </el-tooltip>
                  <el-tag v-else type="danger">标签一</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="5" align="center" width="50">
                <template slot-scope="scope">
                  <el-tooltip
                    v-if="scope.row.first.status"
                    class="item"
                    effect="dark"
                    content="132"
                    placement="top"
                  >
                    <el-button type='text'>{{ scope.row.first.num }}</el-button>
                  </el-tooltip>
                  <el-tag v-else type="danger">标签一</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="6" align="center" width="50">
               <template slot-scope="scope">
                  <el-tooltip
                    v-if="scope.row.first.status"
                    class="item"
                    effect="dark"
                    content="132"
                    placement="top"
                  >
                    <el-button type='text'>{{ scope.row.first.num }}</el-button>
                  </el-tooltip>
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
                  <el-tooltip
                    v-if="scope.row.first.status"
                    class="item"
                    effect="dark"
                    content="132"
                    placement="top"
                  >
                    <el-button type='text'>{{ scope.row.first.num }}</el-button>
                  </el-tooltip>
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
                    <el-button type='text'>{{ scope.row.first.num }}</el-button>
                  </el-tooltip>
                  <el-tag v-else type="danger">标签一</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="3" align="center" width="50">
               <template slot-scope="scope">
                  <el-tooltip
                    v-if="scope.row.first.status"
                    class="item"
                    effect="dark"
                    content="132"
                    placement="top"
                  >
                    <el-button type='text'>{{ scope.row.first.num }}</el-button>
                  </el-tooltip>
                  <el-tag v-else type="danger">标签一</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="4" align="center" width="50">
                <template slot-scope="scope">
                  <el-tooltip
                    v-if="scope.row.first.status"
                    class="item"
                    effect="dark"
                    content="132"
                    placement="top"
                  >
                    <el-button type='text'>{{ scope.row.first.num }}</el-button>
                  </el-tooltip>
                  <el-tag v-else type="danger">标签一</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="5" align="center" width="50">
               <template slot-scope="scope">
                  <el-tooltip
                    v-if="scope.row.first.status"
                    class="item"
                    effect="dark"
                    content="132"
                    placement="top"
                  >
                    <el-button type='text'>{{ scope.row.first.num }}</el-button>
                  </el-tooltip>
                  <el-tag v-else type="danger">标签一</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="6" align="center" width="50">
                <template slot-scope="scope">
                  <el-tooltip
                    v-if="scope.row.first.status"
                    class="item"
                    effect="dark"
                    content="132"
                    placement="top"
                  >
                    <el-button type='text'>{{ scope.row.first.num }}</el-button>
                  </el-tooltip>
                  <el-tag v-else type="danger">标签一</el-tag>
                </template>
              </el-table-column>
            </el-table>
            <el-table class="singleClass" border :data="list_data">
              <el-table-column label="1" align="center" width="50">
                <template slot-scope="scope">
                  <el-tooltip
                    v-if="scope.row.first.status"
                    class="item"
                    effect="dark"
                    content="132"
                    placement="top"
                  >
                    <el-button type='text'>{{ scope.row.first.num }}</el-button>
                  </el-tooltip>
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
                    <el-button type='text'>{{ scope.row.first.num }}</el-button>
                  </el-tooltip>
                  <el-tag v-else type="danger">标签一</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="3" align="center" width="50">
               <template slot-scope="scope">
                  <el-tooltip
                    v-if="scope.row.first.status"
                    class="item"
                    effect="dark"
                    content="132"
                    placement="top"
                  >
                    <el-button type='text'>{{ scope.row.first.num }}</el-button>
                  </el-tooltip>
                  <el-tag v-else type="danger">标签一</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="4" align="center" width="50">
                <template slot-scope="scope">
                  <el-tooltip
                    v-if="scope.row.first.status"
                    class="item"
                    effect="dark"
                    content="132"
                    placement="top"
                  >
                    <el-button type='text'>{{ scope.row.first.num }}</el-button>
                  </el-tooltip>
                  <el-tag v-else type="danger">标签一</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="5" align="center" width="50">
                <template slot-scope="scope">
                  <el-tooltip
                    v-if="scope.row.first.status"
                    class="item"
                    effect="dark"
                    content="132"
                    placement="top"
                  >
                    <el-button type='text'>{{ scope.row.first.num }}</el-button>
                  </el-tooltip>
                  <el-tag v-else type="danger">标签一</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="6" align="center" width="50">
               <template slot-scope="scope">
                  <el-tooltip
                    v-if="scope.row.first.status"
                    class="item"
                    effect="dark"
                    content="132"
                    placement="top"
                  >
                    <el-button type='text'>{{ scope.row.first.num }}</el-button>
                  </el-tooltip>
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
    <!-- 添加dialog -->
    <!-- <el-dialog
      title="提示"
      :visible.sync="dialogCreate"
      width="30%"
      :before-close="handleClose">
      <el-form :model="form">
        <el-form-item label="活动名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动区域" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form> -->
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="dialogCreate = false">取 消</el-button>
        <el-button type="primary" @click="dialogCreate = false">确 定</el-button>
      </span>
    </el-dialog> -->

    <el-dialog
      title="房号: 1-1-1301"
      :visible.sync="HouseRecordStatus"
      width="30%"
      :before-close="HouseRecordClose">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="详细信息" name="first">
          <el-form :model="HouseRecordForm" label-width="80px">
            <el-form-item label="房号:" >
              <span>{{ HouseRecordForm.HouseNum }}</span>
            </el-form-item>
            <el-form-item label="业主:" >
              <span>{{ HouseRecordForm.HouseBelong }}</span>
            </el-form-item>
            <el-form-item label="房屋人数:" >
              <span>{{ HouseRecordForm.HousePeopleNum }}</span>
            </el-form-item>
            <el-form-item label="车牌号:" >
              <span>{{ HouseRecordForm.HouseCarNum }}</span>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="人员信息" name="second">
          <el-table :data="HousePeople">
            <el-table-column property="name" align="center" label="姓名"></el-table-column>
            <el-table-column property="age" align="center" label="年龄"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="门禁卡信息" name="third">
          <el-table :data="HouseDoorCard">
            <el-table-column property="linkHouse" align="center" label="关联房屋"></el-table-column>
            <el-table-column property="createTime" align="center" label="创建时间"></el-table-column>
            <el-table-column align="center" label="状态">
              <template slot-scope="scope">
                <el-tag
                  size="small"
                  style="border-radius: 50px;padding: 0 10px; cursor: pointer;"
                  :type="scope.row.status === 1 ? 'success' : 'danger'"
                >{{ scope.row.status === 1 ? "正常" : "异常" }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column property="count" align="center" label="累计刷卡次数"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="通行记录" name="fourth">
           <el-table :data="HousePeopleRecordList">
            <el-table-column property="name" align="center" label="姓名"></el-table-column>
            <el-table-column property="passTime" align="center" label="通过时间"></el-table-column>
            <el-table-column align="center" label="状态">
              <template slot-scope="scope">
                <img :src="scope.row.takePhoto" alt="">
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="HouseRecordStatus = false">取 消</el-button>
        <el-button type="primary" @click="HouseRecordStatus = false">确 定</el-button>
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
  activeName: string = 'first'
  // 房屋详细信息
  HouseRecordForm: Object = {
    HouseNum: '1-1-1101',
    HouseBelong: '张三',
    HousePeopleNum: '3',
    HouseCarNum: '川A 12345'
  }
  // 房屋人员信息
  HousePeople: Array<object> = [
    {
      name: '张三',
      age: 24
    },
    {
      name: '李四',
      age: 25
    }
  ]
  // 房屋的门禁卡信息
  HouseDoorCard: Array<Object> = [
    {
      linkHouse: '1-1-203',
      createTime: '2019-9-26',
      status: 0,
      count: 1
    },
    {
      linkHouse: '1-1-203',
      createTime: '2019-9-26',
      status: 0,
      count: 1
    }
  ]
  // 房屋人员通行记录
  HousePeopleRecordList: Array<Object> = [
    {
      name: '张三',
      passTime: '2019/10/10 12:00:00',
      takePhoto: 'http://192.168.3.19:8089/MAFJUuA4uVCQir9JAvsgTB/face-3.19.2.jpg'
    },
    {
      name: '张三',
      passTime: '2019/10/10 12:00:00',
      takePhoto: 'http://192.168.3.19:8089/MAFJUuA4uVCQir9JAvsgTB/face-3.19.2.jpg'
    }
  ]
  HouseRecordStatus: boolean = false // 房屋详情dialog状态
  // 显示楼栋下某房间的具体详情
  showHouseRecord(row) {
    this.HouseRecordStatus = true
  }
  // 关闭房屋相亲dialog
  HouseRecordClose(){
    this.HouseRecordStatus = false
  }
}
</script>

<style lang="scss" scoped>
.col-201 {
  overflow: auto;
  // overflow-y: auto;
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

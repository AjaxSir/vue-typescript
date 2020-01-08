<template>
  <div>
    <el-dialog
      width="800px"
      :title="fromTitle"
      :visible.sync="formShowStatistic"
      :close-on-click-modal="false"
      :before-close="formClose"
    >
      <div slot="title" class="dialog-title">{{fromTitle}}:</div>
      <div class="person-manage">
        <!-- <el-dropdown
          class="block"
          split-button
          type="primary"
          size="small"
          trigger="click"
          @command="handleCommand"
        >
          {{commandType}}
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="全 部">
              <span class="statistics">全部</span>
            </el-dropdown-item>
            <el-dropdown-item command="图书馆1">
              <span class="statistics">图书馆1</span>
            </el-dropdown-item>
            <el-dropdown-item command="图书馆2">
              <span class="statistics">图书馆2</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown> -->

        <span class="block">统计粒度：日</span>

        <div class="block">
          <span class="demonstration">时间段:</span>
          <el-date-picker
            size="small"
            :picker-options="pickerOptions"
            v-model="dateRange"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="chooseDate"
          ></el-date-picker>
        </div>

        <div>
          <el-button type="primary" plain size="small">统计</el-button>
          <el-button type="success" plain size="small">订阅</el-button>
        </div>
      </div>

      <div>
        <line-chart :chartData="chartData" :dateRange="dateRange"></line-chart>
        <!-- <div class="statistics-footer">
          <el-button size="small">关闭</el-button>
          统计粒度：
          <el-select
            style="width:60px;"
            v-model="granularity"
            size="mini"
            placeholder="请选择"
            @change="handleGroup"
          >
            <el-option
              v-for="item in granularityGroup"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>-->
      </div>
      <div v-if="fromTitle === '排序统计'">
        <el-table stripe border :data="gridData">
          <el-table-column property="name" label="姓名"></el-table-column>
          <el-table-column property="gender" label="性别"></el-table-column>
          <el-table-column property="num" label="学号"></el-table-column>
          <el-table-column property="address" label="所属学院"></el-table-column>
          <el-table-column property="gonum" label="进出次数"></el-table-column>
          <el-table-column property="dateTotal" label="总时长"></el-table-column>
          <el-table-column property="averagedate" label="平均时长"></el-table-column>
        </el-table>
        <div class="statistics-pagination">
          <el-pagination layout="prev, pager, next" :total="1000"></el-pagination>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import LineChart from "@/components/chart/LineChart.vue";
import { weekDate } from "@/utils";

export default {
  name: "statisticDataDialog",
  components: {
    LineChart
  },
  props: {
    formShowStatistic: {
      // 弹出框显示标志
      type: Boolean,
      default() {
        return false;
      }
    },
    // formData: {
    //   type: Object // 楼栋弹出框信息
    // },
    fromTitle: {
      // 表单标题
      type: String
    }
  },
  data() {
    return {
      dateRange: [weekDate()[0].split(" ")[0], weekDate()[1].split(" ")[0]],
      pickerOptions: {
        // 处理可选的时间范围
        disabledDate(time) {
          const now = new Date();
          const nowTime = now.getTime(); // 当前毫秒数
          // 禁止当前时间小于本月第一天
          if (time.getTime() < nowTime - now.getDate() * 24 * 3600 * 1000) {
            return true;
          }
          // 禁止当前时间大于当前时间
          if (time.getTime() > nowTime) {
            return true;
          }
          return false;
        }
      },
      commandType: "全部",
      chartData: {
        label: [],
        visData: [],
        resData: []
      },
      gridData: [
        {
          name: "王小虎",
          gender: "男",
          num: "001",
          address: "学院1",
          gonum: 22,
          dateTotal: 9,
          averagedate: 5
        },
        {
          name: "王小小",
          gender: "男",
          num: "001",
          address: "学院1",
          gonum: 22,
          dateTotal: 9,
          averagedate: 5
        },
        {
          name: "王小虎",
          gender: "男",
          num: "001",
          address: "学院1",
          gonum: 22,
          dateTotal: 9,
          averagedate: 5
        },
        {
          name: "王小小",
          gender: "男",
          num: "001",
          address: "学院1",
          gonum: 22,
          dateTotal: 9,
          averagedate: 5
        }
      ],
      granularity: "时",
      granularityGroup: [
        {
          value: "时",
          label: "时"
        },
        {
          value: "日",
          label: "日"
        },
        {
          value: "周",
          label: "周"
        }
      ]
    };
  },
  methods: {
    formClose() {
      /** @description Form 关闭处理 */
      this.$emit("update:formShowStatistic", false);
    },
    handleCommand(command) {
      this.commandType = command;
    },
    handleGroup() {
      /** @description 选择line图表展示 */
      // console.log(this.granularity)
    },
    chooseDate() {
      console.log(this.dateRange);
    }
  }
};
</script>

<style lang="scss" scoped>
.person-manage {
  display: flex;
  align-items: center;
}

.block {
  margin-right: 20px;
}
.statistics-footer {
  margin: 0 auto;
  width: 600px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.statistics-pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>

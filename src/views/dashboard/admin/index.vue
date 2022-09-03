<template>
  <div class="dashboard-editor-container">
    <panel-group @handleSetLineChartData="handleSetLineChartData" />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <chart height="500px" width="100%" />
    </el-row>

    <el-row v-permission="['developer']" :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup' // panel
import BarChart from '@/components/Charts/BarChart'
import PieChart from '@/components/Charts/PieChart'
import Chart from '@/components/Charts/MixChart'
import permission from '@/directive/permission/index.js' // 权限判断指令

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    BarChart,
    PieChart,
    Chart
  },
  directives: { permission },
  data() {
    return {
    }
  },
  methods: {
    handleSetLineChartData(type) {
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>

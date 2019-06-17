<template>
<div class="app-container calendar-list-container " >
    <div >
        <el-row>
          <el-collapse style="position: relative;" value='condition' >
            <el-collapse-item title='查询条件' name='condition'>
              <el-form :inline='true' class='demo-form-inline' label-width='100px' ref='queryForm'>
                <el-form-item label='年' prop='customerName'>
                    <el-date-picker
                    :clearable='false'
                     @change="clickAlarmYearMonth"
                      v-model="queryDateYear"
                      align="right"
                      type="year"
                      placeholder="选择年">
                    </el-date-picker>
                </el-form-item>
              </el-form>
            </el-collapse-item>
          </el-collapse>
        </el-row>
      </div>
    <div>
      <energyReportBar :option="option"  height="400px" ></energyReportBar>
    </div>

    <alarmTable :listQuery="listQuery" ref="alarmTable"></alarmTable>

</div>
</template>
<script>
import { getAlarmYearMonth } from 'api/things/faultReport/index';
import { mapGetters } from 'vuex';
import energyReportBar from 'components/Charts/energyReportBar.vue';
import alarmTable from '../alarm/alarmTable/index.vue';
export default {
  name: 'energyReport',
  data() {
    return {
      queryDateYear: new Date(), // 时间控件选择值
      listQuery: {
        page: 1,
        limit: 10,
        dateYear: null // 查询所属年
      },
      // ------------ echarts 图片数据 ---------------------
      option: {
        title: {
            //  text: '便器能耗分析报表'
            //  subtext: '纯属虚构'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['报警数量(个)', '报警数量变化曲线']
        },
        grid: {
          height: '300px'
        },
        toolbox: {
          show: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: true,
            data: []
          },
          {
            type: 'category',
            boundaryGap: true,
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value',
            scale: true,
            name: '报警数量(个)',
            min: 0,
            boundaryGap: false
          },
          {
            type: 'value',
            scale: true,
            name: '报警数量变化曲线',
            min: 0,
            boundaryGap: false
          }
        ],
        dataZoom: {
          show: false,
          start: 0,
          end: 100
        },
        series: [
          {
            name: '报警数量(个)',
            type: 'bar',
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: []
          },
          {
            name: '报警数量变化曲线',
            type: 'line',
            data: []
          }
        ] }
    }
  },
  created() {
    this.clickAlarmYearMonth(this.queryDateYear.getFullYear());
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  components: {
    energyReportBar,
    alarmTable
  },
  methods: {
    // 获取年报警统计数据方法
    clickAlarmYearMonth(val) {
      this.listQuery.dateYear = val;
      getAlarmYearMonth({ alarmTimeYear: val }).then(response => {
        console.log(response);
        this.option.xAxis[0].data = response.dateList.map((item, index) => item + '月')
        this.option.xAxis[1].data = this.option.xAxis[0].data;
        this.option.series[0].data = response.totilNumList;
        this.option.series[1].data = response.totilNumList;
      });
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

</style>

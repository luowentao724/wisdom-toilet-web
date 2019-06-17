<template>
<div  class="app-container calendar-list-container ">
        <el-row :gutter="2"   >
          <!-- DTU属性 -->
          <el-col :span="4">
            <el-row style="margin-bottom: 50px;" type="flex" justify="center">
              <div>当前DTU状态 {{ ignoreAlarm == 0 ? '报警未屏蔽' : '报警已屏蔽'}}
                  <i v-if="ignoreAlarm == 0" style="color:#13ce66" class="el-icon-circle-check el-icon--left"></i>
                  <i v-else  style="color:#ff4949" class="el-icon-circle-close el-icon--left"></i>
              </div>
            </el-row>
            <el-row style="margin-bottom: 50px;" type="flex" justify="center" >
              <el-switch
                :width="125"
                v-model="ignoreAlarm"
                @change="changeIgnoreAlarm"
                on-value="1"
                off-value="0"
                on-text="启用报警"
                off-text="屏蔽报警"
                on-color="#13ce66"
                off-color="#ff4949">
              </el-switch>
            </el-row>
            <el-row style="margin-bottom: 20px;"  type="flex" justify="center" >
              <el-button type="primary" size="large" @click="clickAlarmYearMonth" ><i class="el-icon-time el-icon--left"></i>数据刷新</el-button>
            </el-row>
          </el-col>
          <el-col :span="20" >
              <energyReportBar :option="option" height="300px" className="chartThree" id="chartThree" ></energyReportBar>
          </el-col>
        </el-row>

        <el-row :gutter="4" style="margin-top: 5px;">
          <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="未处理报警" name="first" style="margin: 1px;" >
              <alarmTable :listQuery="listQuery" ></alarmTable>
            </el-tab-pane>
            <el-tab-pane label="已处理报警" name="second">
              <alarmTable :listQuery="listQueryTwo" ></alarmTable>
            </el-tab-pane>
          </el-tabs>
        </el-row>

</div>
</template>

<script>
import echarts from 'echarts';
import { getObjId } from 'api/pubThings';
import { putObj, getObj } from 'api/things/stations/index';
import util from 'utils/util.js';
import { getAlarmYearMonth } from 'api/things/faultReport/index';
import energyReportBar from 'components/Charts/energyReportBar.vue';
import alarmTable from '../../alarm/alarmTable/index.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'user',
  props: {
    dtuId: {
      type: String,
      default: 0
    }
  },
  data() {
    return {
      ignoreAlarm: 0,
      activeName: 'first',
      dataTime: new Date(),
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        status: 0,
        dtuId: this.dtuId,
        dateYear: new Date().getFullYear()
      },
      listQueryTwo: {
        page: 1,
        limit: 10,
        status: 1,
        dtuId: this.dtuId,
        dateYear: new Date().getFullYear()
      },
      dialogRealDataInfoHistoryVisible: false, // 真空度历史数据dialog 控制
      dialogBumpHistoryVisible: false, // 变频器历史数据dialog 控制
      dialogBumpCurveVisible: false, // 变频器历史曲线dialog 控制
      dialogFormVisible: false,
      tableKey: 0,
      excelData: [], // Excel 表格数据
      // ------------  报警echarts option
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
          // left: '3%',
          // right: '4%',
          // top: '10%',
          height: '230px',
          // width: '1004px',
          containLabel: true
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
  watch: {
    // dtuId
    dtuId(newVal, oldVal) {
      this.listQuery.dtuId = this.dtuId;
      this.getStations();
      this.clickAlarmYearMonth();
    }
  },
  created() {
    this.listQuery.dtuId = this.dtuId;
    this.getStations();
    this.clickAlarmYearMonth();
  },
  computed: {
    ...mapGetters([
      'elements',
      'username',
      'userId'
    ])
  },
  components: {
    energyReportBar,
    alarmTable
  },
  methods: {
    getStations() {
      getObj(this.listQuery.dtuId).then(response => {
        this.ignoreAlarm = response.ignoreAlarm;
      });
    },
    // 是否屏蔽报警
    changeIgnoreAlarm(val) {
      if (val == 1) {
        this.$confirm('确认屏蔽报警吗？屏蔽报警后系统不采集数据,需手动恢复采集, 是否继续？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          putObj(this.listQuery.dtuId, { id: this.listQuery.dtuId, ignoreAlarm: val }).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            });
          })
        }).catch(() => {
          this.ignoreAlarm = 0;
        });
      } else {
        putObj(this.dtuId, { ignoreAlarm: val }).then(() => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          });
        });
      }
    },
    // 获取当前子站年报警统计数据方法
    clickAlarmYearMonth() {
      getAlarmYearMonth({ alarmTimeYear: util.formatDateValue(new Date(), 'yyyy'), dtuId: this.dtuId }).then(response => {
        console.log(response);
        this.option.xAxis[0].data = response.dateList.map((item, index) => item + '月')
        this.option.xAxis[1].data = this.option.xAxis[0].data;
        this.option.series[0].data = response.totilNumList;
        this.option.series[1].data = response.totilNumList;
      });
    },
    handleFilter() {
      this.getbumpHistoryDataList();
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getbumpHistoryDataList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getbumpHistoryDataList();
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

</style>

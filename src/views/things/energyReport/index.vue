<template>
<div class="app-container calendar-list-container " >

    <el-row :gutter="20" >
        <el-col :span="2">
          <div id="nav" class="tab_border">
              <el-button :type="buttonType1" @click="chooseButton(1)" style="margin-left:10px">冲洗次数</el-button>
              <el-button :type="buttonType2" @click="chooseButton(2)">排污总量</el-button>
              <el-button :type="buttonType3" @click="chooseButton(3)">耗水量</el-button>
              <el-button :type="buttonType4" @click="chooseButton(4)">耗电量</el-button>
              <el-button :type="buttonType5" @click="chooseButton(5)">节水量</el-button>
              <el-button :type="buttonType6" @click="chooseButton(6)">减排量</el-button>
          </div>
        </el-col>
        <el-col :span="21">  
          <div id="section" class="tab_border">
            <el-tabs v-model="activeName" tab-position="left"  @tab-click="handleClick">
              <el-tab-pane label="每月统计报表" name="first">
                <el-row>
                  <div style="float:right">
                      <span  class="demonstration">月
                        <el-date-picker
                          :clearable='false'
                          @change="clickYearMonthDay"
                          v-model="first.date"
                          type="month"
                          placeholder="选择日期">
                        </el-date-picker>
                      </span>
                    </div>
                </el-row>
                <el-row>
                      <energyReportBar :option="option" className="chartOne" id="chartOne" ></energyReportBar>
                </el-row>
              </el-tab-pane>
              <el-tab-pane label="每年统计报表" name="second">
                  <div style="float:right">
                    <span class="demonstration">年</span>
                    <el-date-picker
                      :clearable='false'
                      @change="clickYearMonth"
                      v-model="second.year"
                      align="right"
                      type="year"
                      placeholder="选择年">
                    </el-date-picker>
                  </div>
                  <div >
                    <!--  -->
                    <energyReportBar :option="optionTwo" className="chartTwo" id="chartTwo" width="1004px" height="700px"  ></energyReportBar>
                  </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-col>
      </el-row>
      
</div>
</template>
<script>
import {
  getTotilWashYearMonthDay
} from 'api/things/energyReport/index';

import {
  getListAll
} from 'api/things/dtuConfigInfo/index';

import { mapGetters } from 'vuex';
import energyReportBar from 'components/Charts/energyReportBar.vue';
export default {
  name: 'energyReport',
  data() {
    return {
      activeName: 'first', // tabs 组件选中tab值
      buttonType1: 'primary',
      buttonType2: '',
      buttonType3: '',
      buttonType4: '',
      buttonType5: '',
      buttonType6: '',
      checkboxButtonIndex: 1, // 当前选中的按钮下标
      dtuConfigData: [], // DTU 参数,用于接受系统配置
      first: {
        date: new Date()
      },
      second: {
        year: new Date()
      },
      costWater: {
        id: 1,
        code: 'cost_water',
        name: '耗水量',
        value: ''
      }, // 耗水量参数配置
      costPower: {
        id: 2,
        code: 'cost_power',
        name: '耗电量',
        value: ''
      }, // 耗电量参数配置
      emitPollu: {
        id: 3,
        code: 'emit_pollu',
        name: '排污',
        value: ''
      }, // 排污量参数配置
      econWater: {
        id: 4,
        code: 'econ_water',
        name: '节约用水',
        value: ''
      }, // 节约用水量参数配置
      limitBlowoff: {
        id: 5,
        code: 'limit_blowoff',
        name: '减少排放',
        value: ''
      }, // 减少排放参数配置
      dateList: [], // 月报表存放日期对象
      totilNumList: [], // 月存放数量对象
      dateYearList: [], // 年报表存放日期对象
      totilNumYearList: [], // 年报表存放数量对象
      legendData: ['冲洗次数', '冲洗次数变化曲线'], // 报表x和y 轴 title
      // ----------- 查询当月每日数据option ------------
      option: {
        title: {
            //  text: '便器能耗分析报表'
            //  subtext: '纯属虚构'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: this.legendData
        },
        grid: {
          height: '500px'
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
            name: '冲洗次数',
            min: 0,
            boundaryGap: [0.2, 0.2]
          },
          {
            type: 'value',
            scale: true,
            name: '冲洗次数变化曲线',
            min: 0,
            boundaryGap: [0.2, 0.2]
          }
        ],
        dataZoom: {
          show: false,
          start: 0,
          end: 100
        },
        series: [
          {
            name: '冲洗次数',
            type: 'bar',
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: []
          },
          {
            name: '冲洗次数变化曲线',
            type: 'line',
            data: []
          }
        ] },
        // ----------- 查询当年每月数据option ------------
      optionTwo: {
        title: {
            //  text: '便器能耗分析报表'
            //  subtext: '纯属虚构'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: this.legendData
        },
        grid: {
          height: '500px'
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
            name: '冲洗次数',
            min: 0,
            boundaryGap: [0.2, 0.2]
          },
          {
            type: 'value',
            scale: true,
            name: '冲洗次数变化曲线',
            min: 0,
            boundaryGap: [0.2, 0.2]
          }
        ],
        dataZoom: {
          show: false,
          start: 0,
          end: 100
        },
        series: [
          {
            name: '冲洗次数',
            type: 'bar',
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: []
          },
          {
            name: '冲洗次数变化曲线',
            type: 'line',
            data: []
          }
        ] }
    }
  },
  created() {
    this.handleClick();
    this.getDtuConfigData();
    let timeDate = new Date(),
      y = timeDate.getFullYear(),
      m = timeDate.getMonth() + 1,
      d = timeDate.getDate();
    this.clickYearMonthDay(y + '-' + (m < 10 ? '0' + m : m));
    this.clickYearMonth(y);
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  components: {
    energyReportBar
  },
  methods: {
    // 点击 tabs 标签栏方法
    handleClick() {
      // console.log(this.first.date);
    },
    // 获取DTU参数
    getDtuConfigData() {
      getListAll().then(response => {
        this.dtuConfigData = response;
        console.log(response);
        this.dtuConfigData.forEach(element => {
          if (element.code == 'cost_water') {
            this.costWater = element;
          }
          if (element.code == 'cost_power') {
            this.costPower = element;
          }
          if (element.code == 'emit_pollu') {
            this.emitPollu = element;
          }
          if (element.code == 'econ_water') {
            this.econWater = element;
          }
          if (element.code == 'limit_blowoff') {
            this.limitBlowoff = element;
          }
        });
      })
    },
    // 获取当月每日数据
    clickYearMonthDay(val) {
      getTotilWashYearMonthDay({ yearMonth: val }).then(response => {
        this.dateList = response.dateList;
        this.totilNumList = response.totilNumList;
        this.option.xAxis[0].data = response.dateList;
        this.option.xAxis[1].data = response.dateList;
        if (this.checkboxButtonIndex == 1) {
          this.setSeriesDataOne(response.totilNumList)
        } else {
          this.chooseButton(this.checkboxButtonIndex);
        }
      });
    },
    // 获取年统计数据方法
    clickYearMonth(val) {
      getTotilWashYearMonthDay({ year: val }).then(response => {
        this.dateYearList = response.dateList;
        this.totilNumYearList = response.totilNumList;
        this.optionTwo.xAxis[0].data = response.dateList;
        this.optionTwo.xAxis[1].data = response.dateList;
        if (this.checkboxButtonIndex == 1) {
          this.setSeriesDataTwo(response.totilNumList)
        } else {
          this.chooseButton(this.checkboxButtonIndex);
        }
      });
    },
    // 设置统计数量数据
    setSeriesDataTwo(val) {
      this.optionTwo.series[0].data = val;
      this.optionTwo.series[1].data = val;
      this.optionTwo.yAxis[0].name = this.legendData[0];
      this.optionTwo.series[0].name = this.legendData[0];
      this.optionTwo.yAxis[1].name = this.legendData[1];
      this.optionTwo.series[1].name = this.legendData[1];
    },
    setSeriesDataOne(val) {
      this.option.series[0].data = val;
      this.option.series[1].data = val;
      this.option.yAxis[0].name = this.legendData[0];
      this.option.series[0].name = this.legendData[0];
      this.option.yAxis[1].name = this.legendData[1];
      this.option.series[1].name = this.legendData[1];
    },
    // 计算排污总量报表
    computeData(val) {
      // 由于js 计算特殊缘故,*100 只为去掉数据溢出
      val = val * 100;

      // 计算月报表数据
      const resMonth = this.totilNumList.map(num => {
        num = num * 100;
        num = num * val / 10000;
        return num;
      });
      this.setSeriesDataOne(resMonth);

      // 计算年报表数据
      const resYear = this.totilNumYearList.map(num => {
        num = num * 100;
        num = num * val / 10000;
        return num;
      });
      this.setSeriesDataTwo(resYear);
    },
    chooseButton(val) {
      this.checkboxButtonIndex = val;
      switch (val) {
        case 1:
          this.buttonType1 = 'primary';
          this.buttonType2 = '';
          this.buttonType3 = '';
          this.buttonType4 = '';
          this.buttonType5 = '';
          this.buttonType6 = '';
          this.legendData = ['冲洗次数', '冲洗次数变化曲线'];
          this.setSeriesDataOne(this.totilNumList);
          this.setSeriesDataTwo(this.totilNumYearList);
          break;
        case 2: // 排污总量
          this.buttonType1 = '';
          this.buttonType2 = 'primary';
          this.buttonType3 = '';
          this.buttonType4 = '';
          this.buttonType5 = '';
          this.buttonType6 = '';
          this.legendData = ['排污总量', '排污总量变化曲线'];
          this.computeData(this.emitPollu.value);
          break;
        case 3: // 耗水量
          this.buttonType1 = '';
          this.buttonType2 = '';
          this.buttonType3 = 'primary';
          this.buttonType4 = '';
          this.buttonType5 = '';
          this.buttonType6 = '';
          this.legendData = ['耗水量T', '耗水量T变化曲线'];
          this.computeData(this.costWater.value);
          break;
        case 4: // 耗电量
          this.buttonType1 = '';
          this.buttonType2 = '';
          this.buttonType3 = '';
          this.buttonType4 = 'primary';
          this.buttonType5 = '';
          this.buttonType6 = '';
          this.legendData = ['耗电量KWH', '耗电量变化曲线'];
          this.computeData(this.costPower.value);
          break;
        case 5: // 节水量
          this.buttonType1 = '';
          this.buttonType2 = '';
          this.buttonType3 = '';
          this.buttonType4 = '';
          this.buttonType5 = 'primary';
          this.buttonType6 = '';
          this.legendData = ['节水量', '节水量变化曲线'];
          this.computeData(this.econWater.value);
          break;
        case 6: // 减排量
          this.buttonType1 = '';
          this.buttonType2 = '';
          this.buttonType3 = '';
          this.buttonType4 = '';
          this.buttonType5 = '';
          this.buttonType6 = 'primary';
          this.legendData = ['减排量', '减排量变化曲线'];
          this.computeData(this.limitBlowoff.value);
          break;
        default:
      }
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
 #header {
    background-color: #e4e6f1;
    color: #20a0ff;
    /* text-align: center; */
    padding: 0px;
}
#nav {
    line-height: 55px;
    background-color: #eeeeee;
    height: 900px;
    width: 150px;
    float: left;
    padding: 5px;      
}
#section {
    width:95%;
    height: 900px;
    float:left;
    padding:10px;
    margin-left: 25px;
}
#footer {
    background-color:black;
    color:white;
    clear:both;
    text-align:center;
   padding:5px;	 	 
}

.tab_border {
    margin-bottom: 10px;
    padding: 10px 10px;
    border: 1px solid #ccc;
    background-color: white;
}

</style>

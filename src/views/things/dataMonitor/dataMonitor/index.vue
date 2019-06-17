<template>
  <div >
        <el-row :gutter="2"  type="flex" >
          <!-- DTU属性 -->
          <el-col :span="24">
            <el-collapse style="position: relative;" value='condition' >
              <el-collapse-item title='DTU属性' name='condition'>
                <el-form :model='stations' :inline='true' class='demo-form-inline' label-width='100px' ref='queryForm'>
                  <el-form-item label='DTU名称' >
                    <span>{{stations.totilName}}</span>
                  </el-form-item>
                  <el-form-item label='设备标识码' >
                    <span>{{stations.totilId}}</span>
                  </el-form-item>
                  <el-form-item label='联系人' >
                    <span>{{(!stations.relName ? "无" : stations.relName)  +"-"+(!stations.relPhone ? "无" : stations.relPhone) + "-"+ (!stations.relEmail ? "无" : stations.relEmail)}}</span>
                  </el-form-item>
                  <el-form-item  label='SIM号' >
                    <span>{{stations.sim}}</span>
                  </el-form-item>
                  <el-form-item  label='便器数量' >
                    <span>{{stations.totilNums}}</span>
                  </el-form-item>
                  <el-form-item  label='报警数量' >
                    <span>{{concentAlarmList.length}}</span>
                  </el-form-item>
                  <el-form-item  label='泵站数量' >
                    <span>{{stations.bumpNums}}</span>
                  </el-form-item>
                  <el-form-item  label='DTU厂商' >
                    <span>{{stations.factoryName}}</span>
                  </el-form-item>
                  <el-form-item  label='位置信息' >
                    <span>{{stations.areaInfo}}</span>
                  </el-form-item>
                  <el-form-item  label='客户' >
                    <span>{{customer.customerName}}</span>
                  </el-form-item>
                  <el-form-item  label='客户联系人' >
                    <span>{{customer.contractName + "-"+customer.contractPhone + "-" +customer.contractEmail }}</span>
                  </el-form-item>
                </el-form>
              </el-collapse-item>
            </el-collapse>
          </el-col>
        </el-row>

        <el-row :gutter="2"  type="flex" >
          <el-col :span="24" >
            <el-collapse style="position: relative;margin-top: 5px;" value='condition' >
              <el-collapse-item title='运行状态' name='condition'>
                <el-form :inline='true' class='demo-form-inline' label-width='100px' ref='queryForm'>
                  <el-form-item label='泵1运行状态' >
                    <span :style=" alarm100024 ? 'background-color: green;color: green' : 'background-color: red;color: red'" v-html=" alarm100024 ? '正常' : '停止'"></span>
                  </el-form-item>
                  <el-form-item label='泵2运行状态' >
                    <span :style=" alarm100025 ? 'background-color: green;;color: green' : 'background-color: red;color: red'" v-html=" alarm100025 ? '正常' : '停止'"></span>
                  </el-form-item>
                  <el-form-item label='传感器状态' >
                    <span :style=" alarm100090 ? 'background-color: green;;color: green' : 'background-color: red;color: red'" v-html=" alarm100090 ? '正常' : '停止'"></span>
                  </el-form-item>
                  <el-form-item  label='系统状态' >
                    <span :style=" alarm100041 ? 'background-color: green;;color: green' : 'background-color: red;color: red'" v-html=" alarm100041 ? '正常' : '停止'"></span>
                  </el-form-item>
                  <el-form-item  label='水箱低液位' >
                    <span :style=" alarm100100 ? 'background-color: green;;color: green' : 'background-color: red;color: red'" v-html=" alarm100100 ? '正常' : '停止'"></span>
                  </el-form-item>
                  <el-form-item  label='水箱高液位' >
                    <span :style=" alarm100101 ? 'background-color: green;;color: green' : 'background-color: red;color: red'" v-html=" alarm100101 ? '正常' : '停止'"></span>
                  </el-form-item>
                  <el-form-item  label='污箱低液位' >
                    <span :style=" alarm100029 ? 'background-color: green;;color: green' : 'background-color: red;color: red'" v-html=" alarm100029 ? '正常' : '停止'"></span>
                  </el-form-item>
                  <el-form-item  label='污箱高液位' >
                    <span :style=" alarm100028 ? 'background-color: green;;color: green' : 'background-color: red;color: red'" v-html=" alarm100028 ? '正常' : '停止'"></span>
                  </el-form-item>
                </el-form>
              </el-collapse-item>
            </el-collapse>
          </el-col>
        </el-row>

        <el-row :gutter="4" style="margin-top: 5px;">
          <!-- DTU属性 -->
          <el-col :span="24">
            <el-collapse style="position: relative;" value='condition' >
              <el-collapse-item title='泵站监控' name='condition'>
                <el-tabs v-model="activeName2" type="card">
                  <el-tab-pane label="真空度" name="first">
                    <el-form ref="form" :model="stations" label-width="80px">
                      <el-form-item label="真空度">
                        <span v-html="stations.currentPumpStationData" ></span>
                      </el-form-item>
                      <el-form-item width="150" min-width="250" fixed='right' fit='false' >
                        <el-button type='primary' @click='refreshStations' >刷新</el-button>
                        <el-button type='primary' @click='historyStationData'>历史数据</el-button>
                        <el-button type='primary' @click='clickReadCurve'>变化曲线</el-button>
                      </el-form-item>
                    </el-form>
                  </el-tab-pane>
                  <el-tab-pane label="运行时间" name="second">
                    <el-table  :key='tableKey' :data="pumpStationDataList" border fit highlight-current-row >
                      <el-table-column label='泵站编号' prop='id' min-width='100'></el-table-column>
                      <el-table-column label='当天运行时间(h)' prop='todayRunTime' min-width='100'></el-table-column>
                      <el-table-column label='累积运行时间(h)' prop='cumulativeRunTime' min-width='100'></el-table-column>
                      <el-table-column label='剩余运行时间(h)' prop='' min-width='100'>
                        <template scope="scope">
                          <div v-html="scope.row.totalRunTime - scope.row.cumulativeRunTime "></div>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-tab-pane>
                </el-tabs>
              </el-collapse-item>
            </el-collapse>
          </el-col>
        </el-row>
        <el-row style="margin-top: 5px;">  
          <el-col  v-for="(item,index) in bumpVfRuninfoList" v-bind:key="item.id"  :span="24" >
            <el-collapse style="position: relative;" value='condition' >
              <el-collapse-item :title='"变频器"+(index+1)+"信息"' name='condition'>
                <el-button type='primary' @click="bumpHistoryData(item.dtuId,item.vfDeviceCode)" >变频器历史数据</el-button>
                <el-button type='primary' @click="bumpHistoryCurve(item.dtuId,item.vfDeviceCode)">变频器历史曲线</el-button>
                <el-form :inline='true' class='demo-form-inline' label-width='100px' ref='queryForm'>
                  <el-form-item label='运行速度(HZ)' >
                    <span v-html="item.runSpeed"></span>
                  </el-form-item>
                  <el-form-item label='设定速度(HZ)' >
                    <span v-html="item.settingSpeed"></span>
                  </el-form-item>
                  <el-form-item label='母线电压(V)' >
                    <span v-html="item.busVoltage"></span>
                  </el-form-item>
                  <el-form-item  label='输出电压(V)' >
                    <span v-html="item.outputVoltage"></span>
                  </el-form-item>
                  <el-form-item  label='输出电流(A)' >
                    <span v-html="item.outputElectric"></span>
                  </el-form-item>
                  <el-form-item  label='运行转速(r/min)' >
                    <span v-html="item.runRev"></span>
                  </el-form-item>
                  <el-form-item  label='输出功率(w)' >
                    <span v-html="item.outputPower"></span>
                  </el-form-item>
                  <el-form-item  label='输出转矩(N/M)' >
                    <span v-html="item.outputTorque"></span>
                  </el-form-item>
                  <el-form-item  label='运行时间(h)' >
                    <span v-html="item.todayRuntime"></span>
                  </el-form-item>
                  <el-form-item  label='逆变器温度(℃)' >
                    <span v-html="item.vfTemperature "></span>
                  </el-form-item>
                  <el-form-item  label='整流器温度(℃)' >
                    <span v-html="item.vfHumidity"></span>
                  </el-form-item>
                </el-form>
              </el-collapse-item>
            </el-collapse>
          </el-col>
        </el-row>

        <el-row :gutter="4" style="margin-top: 5px;">
          <el-tabs v-model="activeName3" type="card">
            <el-tab-pane label="冲洗次数监控" name="first">
              <el-table  :key='tableKey' :data="totilWashInfoList"  border fit highlight-current-row >
                <el-table-column label="便器序号" type='index' width='100'></el-table-column>
                <el-table-column label='当日冲洗次数' prop='todayWashTimes' min-width='100'></el-table-column>
                <el-table-column label='累积冲洗次数' prop='accumulateTimes' min-width='100'></el-table-column>
                <el-table-column label='剩余冲洗次数' prop='lastNum' min-width='100'></el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="今日冲洗次数" name="second">
              <energyReportBar :option="optionOne" className="chartOne" id="chartOne" width="1004px" height="420px"  ></energyReportBar>
            </el-tab-pane>
          </el-tabs>
        </el-row>

    <el-dialog :title="stations.totilName+':真空度'" :visible.sync="dialogRealDataInfoHistoryVisible">
        <el-table  :key='tableKey' :data="realDataInfoHistoryList" border fit highlight-current-row >
          <el-table-column label='设备标识码' prop='' min-width='100'>
            <template scope="scope">
              <div v-html="stations.totilId"></div>
            </template>
          </el-table-column>
          <el-table-column label='真空度' prop='realDataValue' min-width='100'></el-table-column>
          <el-table-column label='数据采集时间' prop='gatherTime' min-width='100'></el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogRealDataInfoHistoryVisible = false">取 消</el-button>
        </div>
    </el-dialog>

    <el-dialog :title="bumpDialogTitle" :visible.sync="dialogBumpHistoryVisible">
        <el-table  :key='tableKey' :data="list" border fit highlight-current-row >
          <el-table-column label='运行速度(HZ)' prop='runSpeed' min-width='100'></el-table-column>
          <el-table-column label='设定速度(HZ)' prop='settingSpeed' min-width='100'></el-table-column>
          <el-table-column label='母线电压(V)' prop='busVoltage' min-width='100'></el-table-column>
          <el-table-column label='输出电压(V)' prop='outputVoltage' min-width='100'></el-table-column>
          <el-table-column label='输出电流(A)' prop='outputElectric' min-width='100'></el-table-column>
          <el-table-column label='运行转速(r/min)' prop='runRev' min-width='100'></el-table-column>
          <el-table-column label='输出功率(w)' prop='outputPower' min-width='100'></el-table-column>
          <el-table-column label='输出转矩(N/M)' prop='outputTorque' min-width='100'></el-table-column>
          <el-table-column label='逆变器温度(℃)' prop='vfTemperature' min-width='150'></el-table-column>
          <el-table-column label='整流器湿度(℃)' prop='vfHumidity' min-width='150'></el-table-column>
          <el-table-column label='运行时间(h)' prop='todayRuntime' min-width='100'></el-table-column>
        </el-table>
        <el-row type='flex' justify='end' class="pagination-container">
          <el-pagination :page-sizes='[10, 20, 50, 100]' :page-size='listQuery.limit' layout='prev,pager,next,jumper,total,sizes' :total='total' :current-page.sync='listQuery.page' @current-change='handleCurrentChange' @size-change='handleSizeChange'>
          </el-pagination>
      </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogBumpHistoryVisible = false">取 消</el-button>
        </div>
    </el-dialog>

    <el-dialog :title="bumpDialogCurveTitle" :visible.sync="dialogBumpCurveVisible">  
        <el-row :gutter="20" style="margin-bottom: 20px;" >
          <el-date-picker
            @change="clickBumpDateTime"
            v-model="dataTime"
            type="date"
            placeholder="选择日期"
            >
          </el-date-picker>
        </el-row>
        <energyReportBar :option="optionTwo" className="chartTwo" id="chartTwo" width="100%" height="600px" ></energyReportBar>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogBumpCurveVisible = false">取 消</el-button>
        </div>
    </el-dialog>


   <!--  泵站真空度曲线 -->
    <el-dialog :title="readDialogCurveTitle" :visible.sync="dialogReadCurveVisible">  
        <el-row :gutter="20" style="margin-bottom: 20px;" >
          <el-date-picker
            @change="clickReadDateTime"
            v-model="dataTime"
            type="date"
            placeholder="选择日期"
            >
          </el-date-picker>
        </el-row>
        <energyReportBar :option="optionThree" className="chartThree" id="chartThree" width="100%" height="600px" ></energyReportBar>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogReadCurveVisible = false">取 消</el-button>
        </div>
    </el-dialog>

      
</div>
</template>
<script>
import {
  getDataMonitor, getObj
} from 'api/things/stations/index';
import {
  getHistoryData, getHistoryCurveData, getStationsRealDataInfo
} from 'api/things/dataMonitor/index';
import echarts from 'echarts';
import { getObjId, getSystemDictType } from 'api/pubThings';
import util from 'utils/util.js';
import exportButton from 'components/Excel/export.vue';
import energyReportBar from 'components/Charts/energyReportBar.vue';
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
      dataTime: new Date(),
      bumpDialogTitle: '变频器历史数据',
      bumpDialogCurveTitle: '变频器历史曲线',
      readDialogCurveTitle: '真空度历史曲线',
      activeName2: 'first',
      activeName3: 'first',
      alarm100024: null, // 泵1 运行状态
      alarm100025: null, // 泵2 运行状态
      alarm100090: null, // 传感器 运行状态
      alarm100041: null, // 系统 运行状态
      alarm100100: null, // 水箱低液位 运行状态
      alarm100101: null, // 水箱高液位 运行状态
      alarm100029: null, // 污箱低液位 运行状态
      alarm100028: null, // 污箱高液位 运行状态
      pumpStationDataList: [], // 泵站运行时间数据
      totilWashInfoList: [], // 便器冲洗监控
      // ----------- 今日冲洗次数 ------------
      toiletNameList: [],
      toiletWashNumList: [],
      optionOne: {
        title: {
            //  text: '便器能耗分析报表'
            //  subtext: '纯属虚构'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['11']
        },
        grid: {
          height: '380px',
          left: '10%',
          right: '4%',
          bottom: '1%',
          containLabel: true
        },
        yAxis: [
          {
            type: 'value'
            // min: 0,
            // max: 0.2,
            // interval: 0.05
          }
        ],
        xAxis: [
          {
            type: 'category',
            axisTick: { show: false },
            data: ['便器一', '便器二', '便器三', '便器四', '便器五']
          }
        ],
        series: [
          {
            name: 'test',
            type: 'bar',
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            data: [0.042265747, 0.000053615, 0.11846974, 0.114327185, 0.000626929]
          }
        ]

      },
      optionTwo: {
        title: {
          // text: '折线图堆叠'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: []
        },
        grid: {
          left: '3%',
          right: '4%',
          top: '10%',
          height: '500px',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: [{
          type: 'category',
          axisTick: {
            show: false
            // 删除超出正坐标线段
          },
          boundaryGap: false,
          data: []
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
            // 删除超出正坐标线段
          },
          splitLine: { // 坐标轴以外的横线颜色
            lineStyle: {
              type: 'dashed', // 虚线
              color: 'black'
            }
          }
        }],
// var endPercent = (7 / time.length) * 100;
        dataZoom: [ // 给x轴设置滚动条
          {
            start: 0, // 默认为0
            end: 50, // 这两个用来调整显示多少数据
            type: 'slider',
            show: true,
            xAxisIndex: [0],
            handleSize: 0, // 滑动条的 左右2个滑动条的大小
            height: 8, // 组件高度
            left: '21%',
            right: '3%',
            top: '25',
            handleColor: '#ddd', // h滑动图标的颜色
            handleStyle: {
              borderColor: '#cacaca',
              borderWidth: '1',
              shadowBlur: 2,
              background: '#ddd',
              shadowColor: '#ddd'
            },
            fillerColor: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                // 给颜色设置渐变色 前面4个参数，给第一个设置1，第四个设置0 ，就是水平渐变
                // 给第一个设置0，第四个设置1，就是垂直渐变
              offset: 0,
              color: '#1eb5e5'
            }, {
              offset: 1,
              color: '#5ccbb1'
            }]),
            backgroundColor: '#ddd', // 两边未选中的滑动条区域的颜色
            showDataShadow: false, // 是否显示数据阴影 默认auto
            showDetail: false, // 即拖拽时候是否显示详细数值信息 默认true
            handleIcon: 'M-292,322.2c-3.2,0-6.4-0.6-9.3-1.9c-2.9-1.2-5.4-2.9-7.6-5.1s-3.9-4.8-5.1-7.6c-1.3-3-1.9-6.1-1.9-9.3c0-3.2,0.6-6.4,1.9-9.3c1.2-2.9,2.9-5.4,5.1-7.6s4.8-3.9,7.6-5.1c3-1.3,6.1-1.9,9.3-1.9c3.2,0,6.4,0.6,9.3,1.9c2.9,1.2,5.4,2.9,7.6,5.1s3.9,4.8,5.1,7.6c1.3,3,1.9,6.1,1.9,9.3c0,3.2-0.6,6.4-1.9,9.3c-1.2,2.9-2.9,5.4-5.1,7.6s-4.8,3.9-7.6,5.1C-285.6,321.5-288.8,322.2-292,322.2z',
            filterMode: 'filter'
          },
        // 下面这个属性是里面拖到
          {
            type: 'inside',
            show: true,
            xAxisIndex: [0],
            start: 0, // 默认为1
            end: 50
          }
        ],
        // ['母线电压', '输出电压', '逆变器温度', '整流器温度', '输出功率', '输出电流'];
        series: [
          {
            name: '母线电压',
            type: 'line',
            data: []
          },
          {
            name: '输出电压',
            type: 'line',
            data: []
          },
          {
            name: '逆变器温度',
            type: 'line',
            data: []
          },
          {
            name: '整流器温度',
            type: 'line',
            data: []
          },
          {
            name: '输出功率',
            type: 'line',
            data: []
          },
          {
            name: '输出电流',
            type: 'line',
            data: []
          }
        ]
      },
      // ----------------- 真空度曲线 所需数据 ------------------
      optionThree: {
        title: {
          // text: '折线图堆叠'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: []
        },
        grid: {
          left: '3%',
          right: '4%',
          top: '10%',
          height: '500px',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: [{
          type: 'category',
          axisTick: {
            show: false
            // 删除超出正坐标线段
          },
          boundaryGap: false,
          data: []
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
            // 删除超出正坐标线段
          },
          splitLine: { // 坐标轴以外的横线颜色
            lineStyle: {
              type: 'dashed', // 虚线
              color: 'black'
            }
          }
        }],
// var endPercent = (7 / time.length) * 100;
        dataZoom: [ // 给x轴设置滚动条
          {
            start: 0, // 默认为0
            end: 50, // 这两个用来调整显示多少数据
            type: 'slider',
            show: true,
            xAxisIndex: [0],
            handleSize: 0, // 滑动条的 左右2个滑动条的大小
            height: 8, // 组件高度
            left: '21%',
            right: '3%',
            top: '25',
            handleColor: '#ddd', // h滑动图标的颜色
            handleStyle: {
              borderColor: '#cacaca',
              borderWidth: '1',
              shadowBlur: 2,
              background: '#ddd',
              shadowColor: '#ddd'
            },
            fillerColor: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                // 给颜色设置渐变色 前面4个参数，给第一个设置1，第四个设置0 ，就是水平渐变
                // 给第一个设置0，第四个设置1，就是垂直渐变
              offset: 0,
              color: '#1eb5e5'
            }, {
              offset: 1,
              color: '#5ccbb1'
            }]),
            backgroundColor: '#ddd', // 两边未选中的滑动条区域的颜色
            showDataShadow: false, // 是否显示数据阴影 默认auto
            showDetail: false, // 即拖拽时候是否显示详细数值信息 默认true
            handleIcon: 'M-292,322.2c-3.2,0-6.4-0.6-9.3-1.9c-2.9-1.2-5.4-2.9-7.6-5.1s-3.9-4.8-5.1-7.6c-1.3-3-1.9-6.1-1.9-9.3c0-3.2,0.6-6.4,1.9-9.3c1.2-2.9,2.9-5.4,5.1-7.6s4.8-3.9,7.6-5.1c3-1.3,6.1-1.9,9.3-1.9c3.2,0,6.4,0.6,9.3,1.9c2.9,1.2,5.4,2.9,7.6,5.1s3.9,4.8,5.1,7.6c1.3,3,1.9,6.1,1.9,9.3c0,3.2-0.6,6.4-1.9,9.3c-1.2,2.9-2.9,5.4-5.1,7.6s-4.8,3.9-7.6,5.1C-285.6,321.5-288.8,322.2-292,322.2z',
            filterMode: 'filter'
          },
        // 下面这个属性是里面拖到
          {
            type: 'inside',
            show: true,
            xAxisIndex: [0],
            start: 0, // 默认为1
            end: 50
          }
        ],
        series: [
          {
            name: '真空度',
            type: 'line',
            data: []
          }
        ]
      },
      // --------------
      stations: {
        id: 0,
        sim: '56456',
        areaInfo: 'ewrwww324',
        codeSn: '111',
        totilName: 'adas',
        totilId: '2331',
        areaId: 312,
        totilNums: 2,
        bumpNums: 13,
        customerId: 1,
        remark: '123',
        createTime: '2019-05-02 18:46:27',
        totilPic: '231123',
        currentPumpStationData: '',
        totilTypeId: 11,
        totilState: 1
      },
      concentAlarmList: [
        {
          alarmId: 161,
          dtuId: 0,
          alarmType: 1,
          alarmTime: '2013-09-24 01:34:26',
          createTime: '2013-09-24 01:34:26',
          descn: '',
          fixType: 1,
          fixTime: '2013-09-24 04:35:00',
          fixDescn: '系统自动忽略',
          fixUserId: 0,
          fixUserName: '系统自动处理',
          smsCount: 0,
          sms: 0,
          email: 0,
          status: 0,
          alarmTypeName: '水位报警',
          fixTypeName: '维修人员维修'
        }
      ],
      bumpVfRuninfoList: [{
        id: null, // 变频器id
        dtuId: null, // 子站id
        vfDeviceCode: null, // vf变频的缩写
        runSpeed: 1000, // 运行速度
        settingSpeed: 1000, // 设定速度
        busVoltage: 1000, // 母线电压
        outputVoltage: 1000, // 输出电压
        runRev: 1000, // 运行转速
        outputPower: 1000, // 输出功率
        outputElectric: 1000, // 输出电流
        outputTorque: 1000, // 输出转矩
        vfTemperature: 1000, // 逆变器温度
        vfHumidity: 1000, // 整流器温度
        todayRuntime: 20, // 当天运行时间
        accuRuntime: 1000, // 累积运行时间
        gatherTime: null, // 采集时间
        createTime: null // 创建时间
      }], // 变频器数据
      customer: {
        id: 1,
        customerName: '真创环保科技有限公司',
        systemName: '真空集便器远程监控云服务平台',
        systemLogo: 'logo/1369245103547.png',
        contractName: '杨桂华',
        contractPhone: '15115323207',
        contractEmail: '27613271@qq.com',
        remark: '超级客户'
      },
      realDataInfoHistoryList: [], // 实时真空度历史数据
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        vfDeviceCode: 1000,
        dtuId: this.dtuId,
        gatherTime: '2019-05-22'
      },
      dialogRealDataInfoHistoryVisible: false, // 真空度历史数据dialog 控制
      dialogBumpHistoryVisible: false, // 变频器历史数据dialog 控制
      dialogBumpCurveVisible: false, // 变频器历史曲线dialog 控制
      dialogReadCurveVisible: false, // 真空度历史曲线dialog 控制
      dialogFormVisible: false,
      tableKey: 0,
      excelData: [] // Excel 表格数据
    }
  },
  watch: {
    // dtuId
    dtuId(newVal, oldVal) {
      this.getList();
    }
  },
  created() {
    this.getList();
  },
  computed: {
    ...mapGetters([
      'elements',
      'username',
      'userId'
    ])
  },
  components: {
    exportButton,
    energyReportBar
  },
  methods: {
    // 变频器历史数据
    bumpHistoryData(dtuId, vfDeviceCode) {
      this.listQuery.dtuId = dtuId;
      this.listQuery.vfDeviceCode = vfDeviceCode;
      this.getbumpHistoryDataList();
    },
    getbumpHistoryDataList() {
      this.dialogBumpHistoryVisible = true;
      this.listLoading = true;
      getHistoryData(this.listQuery).then(response => {
        this.list = response.data.rows;
        this.total = response.data.total;
        this.listLoading = false;
      })
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
    },
    // 变频器历史曲线
    bumpHistoryCurve(dtuId, vfDeviceCode) {
      this.listQuery.dtuId = dtuId;
      this.listQuery.vfDeviceCode = vfDeviceCode;
      this.dialogBumpCurveVisible = true;
      this.clickBumpDateTime(util.formatDateValue(this.dataTime, 'yyyy-MM-dd'));
    },
    // 变频器历史曲线
    clickBumpDateTime(val) {
      getHistoryCurveData({
        vfDeviceCode: this.listQuery.vfDeviceCode,
        dtuId: this.listQuery.dtuId,
        gatherTime: val
      }).then(response => {
        this.optionTwo.legend.data = ['母线电压', '输出电压', '逆变器温度', '整流器温度', '输出功率', '输出电流'];
        this.optionTwo.xAxis[0].data = response.timeList;
        this.optionTwo.series[0].data = response.busVoltageList;
        this.optionTwo.series[1].data = response.outputPowerList;
        this.optionTwo.series[2].data = response.vfTemperatureList;
        this.optionTwo.series[3].data = response.vfHumidityList;
        this.optionTwo.series[4].data = response.outputVoltageList;
        this.optionTwo.series[5].data = response.outputElectricList;
      });
    },
    // 获取真空度历史曲线
    clickReadCurve(dtuId, vfDeviceCode) {
      // this.listQuery.dtuId = dtuId;
      // this.listQuery.vfDeviceCode = vfDeviceCode;
      this.dialogReadCurveVisible = true;
      this.clickReadDateTime(util.formatDateValue(this.dataTime, 'yyyy-MM-dd'));
    },
    // 获取真空度历史曲线
    clickReadDateTime(val) {
      getStationsRealDataInfo({
        realtimeDataType: '100001',
        dtuId: this.listQuery.dtuId,
        gatherTime: val
      }).then(response => {
        this.optionThree.legend.data = ['泵1真空度'];
        this.optionThree.xAxis[0].data = response.dateList;
        this.optionThree.series[0].data = response.numList;
        // this.optionTwo.series[1].data = response.outputPowerList;
        // this.optionTwo.series[2].data = response.vfTemperatureList;
        // this.optionTwo.series[3].data = response.vfHumidityList;
        // this.optionTwo.series[4].data = response.outputVoltageList;
        // this.optionTwo.series[5].data = response.outputElectricList;
      });
    },
    // 刷新实时真空度方法
    refreshStations() {
      getObj(this.stations.id).then(response => {
        this.stations.currentPumpStationData = response.data.currentPumpStationData;
      });
    },
    // 真空度历史数据
    historyStationData() {
      this.dialogRealDataInfoHistoryVisible = true;
    },
    // 真空度变化曲线
    changeCurve(tab, event) {
      console.log(tab, event);
    },
    getList() {
      this.listLoading = true;
      this.listQuery.dtuId = this.dtuId;
      getDataMonitor(this.listQuery).then(response => {
        this.alarm100029 = response.alarm100029;
        this.alarm100028 = response.alarm100028;
        this.alarm100025 = response.alarm100025;
        this.alarm100024 = response.alarm100024;
        this.alarm100101 = response.alarm100101;
        this.alarm100100 = response.alarm100100;
        this.alarm100090 = response.alarm100090;
        this.alarm100041 = response.alarm100041;
        this.stations = response.stations;
        this.totilWashInfoList = response.totilWashInfoList;
        this.realDataInfoHistoryList = response.realDataInfoHistoryList;
        this.concentAlarmList = response.concentAlarmList;
        this.bumpVfRuninfoList = response.bumpVfRuninfoList;
        this.toiletWashNumList = response.toiletWashNumList;
        this.toiletNameList = response.toiletNameList;
        this.pumpStationDataList = response.pumpStationDataList;
        this.customer = response.customer;

        this.optionOne.xAxis[0].data = this.toiletNameList;
        this.optionOne.series[0].data = this.toiletWashNumList;

        this.listLoading = false;
      })
    }
  }
}
</script>
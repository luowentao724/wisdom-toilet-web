<template>
<div class="app-container calendar-list-container " >
          <div id="section" class="tab_border">
                <el-row :gutter="2" >
                  <el-col :span="12" v-for="(data,index) in dataList" v-bind:key="index" style="padding:10px">
                    <el-card :body-style="{ padding: '0px' }">
                      <div class="pull-left signal-image">
                        <!-- data.picAddr -->
                            <img src="http://cdn.lfemcp.com/userimg/designer/04/042746ba-a548-4317-b298-3dbe2b1267d4.png" class="img-responsive">
                        </div>
                        <div class="pull-left signal-info">
                            <div class="signal-name">	<span data-toggle="tooltip" data-placement="top" title="" data-original-title="">{{data.dictName}}</span> 
                            </div>
                            <div v-if="!!data.realDataInfo" class="signal-value not-exceeding" :title="data.realDataInfo.realDataValue+data.realDataInfo.dataUnit">{{data.realDataInfo.realDataValue}} <span>{{data.realDataInfo.dataUnit}}</span>
                            </div>
                            <div v-else class="signal-value not-exceeding" title="数据未采集到">
                              <span>数据未采集到</span>
                            </div>
                        </div>
                        <div class="pull-right signal-info">
                            <div class="signal-time">{{data.realDataInfo ? data.realDataInfo.gatherTime : ''}}</div>
                            <div class="signal-btn">
                              <el-button type='primary'  @click="initSignalChart(data)">趋势图</el-button>
                            </div>
                        </div> 
                    </el-card>
                  </el-col>
                </el-row>
          </div>


 <!--  实时数据趋势图曲线 -->
    <el-dialog :title="realDataTitle" :visible.sync="dialogRealDataVisible">  
        <el-row :gutter="20" style="margin-bottom: 20px;" >
          <el-form :model='listQuery' :inline='true' class='demo-form-inline' label-width='100px' ref='queryForm'>
            <el-form-item label='开始时间' prop='startDate'>
              <el-date-picker
                  :clearable='true'
                  @change="clickStartDate"
                  v-model="startDate"
                  type="date"
                  placeholder="选择日期"
                 >
                </el-date-picker>
            </el-form-item>
            <el-form-item label='结束时间' prop='endDate'>
              <el-date-picker
                  :clearable='true'
                  @change="clickEndDate"
                  v-model="endDate"
                  type="date"
                  placeholder="选择日期"
                 >
                </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type='primary' @click='handleFilter' >查询</el-button>
              <!-- <el-button @click='cancel("queryForm")'>重置</el-button> -->
            </el-form-item>
          </el-form>
        </el-row>
        <energyReportBar :option="option" className="chartThree" id="chartThree" width="100%" height="600px" ></energyReportBar>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogRealDataVisible = false">取 消</el-button>
        </div>
    </el-dialog>

</div>
</template>
<script>
import { queryDtuIdDataRuleRealtime } from 'api/things/dataRuleRealtime/index';
import energyReportBar from 'components/Charts/energyReportBar.vue';
import echarts from 'echarts';
import { mapGetters } from 'vuex';
export default {
  name: 'params',
  props: {
    dtuId: {
      type: String,
      default: 0
    }
  },
  components: {
    energyReportBar
  },
  data() {
    return {
      isShow: false,
      dataList: [],
      realDataTitle: '实时真空度',
      dialogRealDataVisible: false,
      startDate: null, // 开始时间
      endDate: null, // 结束时间
      totilName: null,
      listQuery: {
        page: 1,
        limit: 20,
        totilName: undefined, // DTU名称
        startDate: undefined,  // 报警开始时间
        endDate: undefined,  // 报警开始时间
        status: 1  // 处理状态 0 未处理 1已处理
      },
      // ----------------- 真空度曲线 所需数据 ------------------
      option: {
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
            name: '真空度曲线',
            type: 'line',
            data: []
          }
        ]
      }
    }
  },
  watch: {
    // dtuId
    dtuId(newVal, oldVal) {
      this.initDataList();
    }
  },
  created() {
    this.initDataList();
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  methods: {
    // 获取实时数据值,
    initDataList() {
      queryDtuIdDataRuleRealtime({ dtuId: this.dtuId }).then(response => {
        this.dataList = response.data;
        this.isShow = true; // 数据处理完再显示页面
      });
    },
    // 趋势图
    initSignalChart(data) {
      this.dialogRealDataVisible = true;
    },
    // 设置开始时间
    clickStartDate(val) {
      this.listQuery.startDate = val;
    },
    // 设置开始时间
    clickEndDate(val) {
      this.listQuery.endDate = val;
    },
    handleFilter() {
      this.listQuery.totilName = this.totilName;
      this.$refs.alarmTable.getList();
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

.pull-left {
    float: left !important;
}
.panel-default {
    border-color: #ddd;
}
.panel {
    margin-bottom: 20px;
    background-color: #fff;
    border: 1px solid transparent;
    border-radius: 4px;
    -webkit-box-shadow: 0 1px 1px rgba(0,0,0,0.05);
    box-shadow: 0 1px 1px rgba(0,0,0,0.05);
}
.panel {
    overflow: hidden;
    text-align: left;
    margin: 0;
    border: 0;
    -moz-border-radius: 0 0 0 0;
    -webkit-border-radius: 0 0 0 0;
    border-radius: 0 0 0 0;
}

.signal-image img {
    width: 80px;
    height: 80px;
    margin: 7px;
    display: block;
    max-width: 100%;
    height: auto;
    vertical-align: middle;
    border: 0;
}

.signal-info {
    padding-left: 5px;
}
.signal-info .signal-name {
    line-height: 45px;
    font-size: 14px;
    font-weight: bolder;
    max-width: 120px;
    min-width: 120px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

 .signal-info .signal-value {
    font-family: SimHei;
    font-size: 20px;
    line-height: 50px;
    color: #09c;
    max-width: 120px;
    min-width: 120px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.not-exceeding {
    word-break: keep-all;
    white-space: nowrap;
    text-overflow: ellipsis;
}
 .signal-info .signal-time {
    height: 45px;
    padding: 10px 10px 10px 60px;
}

.pull-right {
    float: left !important;
}

.signal-btn{
  padding: 5px 5px 5px 60px;
}

</style>

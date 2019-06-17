<template>
<div class="app-container calendar-list-container " >

    <el-row :gutter="20" >
        <el-col :span="2">
          <div id="nav" class="tab_border">
              <el-button :type="buttonType1" @click="chooseButton(1)" style="margin-left:10px">便器统计</el-button>
              <el-button :type="buttonType2" @click="chooseButton(2)" >泵站统计</el-button>
              <el-button :type="buttonType3" @click="chooseButton(3)" >DTU统计</el-button>
          </div>
        </el-col>
        <el-col :span="21">  
          <div id="section" class="tab_border">
            <el-tabs v-model="activeName" tab-position="left"  @tab-click="handleClick">
              <el-tab-pane label="具状图" name="first">
                <div >
                  <energyReportBar :option="option"  className="chartOne" id="chartOne" ></energyReportBar>
                </div>
              </el-tab-pane>
              <el-tab-pane label="饼图" name="second">
                  <div >
                    <assetsPie :option="optionPie" className="chartTwo" id="chartTwo" width="1004px" height="700px" ></assetsPie>
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
  getAssetsReport
} from 'api/things/stations/index';
import { mapGetters } from 'vuex';
import energyReportBar from 'components/Charts/energyReportBar.vue';
import assetsPie from 'components/Charts/assetsPie.vue';
export default {
  name: 'assetsReport',
  data() {
    return {
      activeName: 'first', // tabs 组件选中tab值
      legendData: ['数量', '数量变化曲线'],
      buttonType1: 'primary',
      buttonType2: '',
      buttonType3: '',
      customerNameList: [], // 客户名称
      totilNumsList: [], // 便器数量
      bumpNumsList: [],  // 泵器数量
      numsList: [], // 子站数量
      // ------------ echarts 图片数据Bar ---------------------
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
            name: '数量',
            min: 0,
            boundaryGap: [0.2, 0.2]
          },
          {
            type: 'value',
            scale: true,
            name: '数量变化曲线',
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
            name: '数量',
            type: 'bar',
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: []
          },
          {
            name: '数量变化曲线',
            type: 'line',
            data: []
          }
        ] },
        // ------------ echarts 图片数据Pie ---------------------
      optionPie: {
        title: {
          // text: '某站点用户访问来源',
          // subtext: '纯属虚构',
          // x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: []
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
                // { value: 335, name: '直接访问' },
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ] }
    }
  },
  created() {
    this.getData();
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  components: {
    energyReportBar,
    assetsPie
  },
  methods: {
    // 点击 tabs 标签栏方法
    handleClick() {

    },
    // 获取显示的统计数据
    getData() {
      getAssetsReport().then(response => {
        this.customerNameList = response.customerNameList; // 客户名称
        this.totilNumsList = response.totilNumsList; // 便器数量
        this.bumpNumsList = response.bumpNumsList;  // 泵器数量
        this.numsList = response.numsList; // 子站数量
        this.setSeriesData(this.customerNameList, this.totilNumsList);
      });
    },
    // 设置统计数量数据
    setSeriesData(nameList, numList) {
      this.option.xAxis[0].data = nameList;
      this.option.xAxis[1].data = nameList;
      this.option.series[0].data = numList;
      this.option.xAxis[1].data = numList;
      this.optionPie.legend.data = nameList;
      this.optionPie.series[0].data = [];
      for (const i in nameList) {
        this.optionPie.series[0].data.push({ value: numList[i], name: nameList[i] })
      }
    },
    chooseButton(val) {
      switch (val) {
        case 1: // 便器统计
          this.buttonType1 = 'primary';
          this.buttonType2 = '';
          this.buttonType3 = '';
          this.setSeriesData(this.customerNameList, this.totilNumsList);
          break;
        case 2: // 泵器统计
          this.buttonType1 = '';
          this.buttonType2 = 'primary';
          this.buttonType3 = '';
          this.setSeriesData(this.customerNameList, this.bumpNumsList);
          break;
        case 3: // DTU统计
          this.buttonType1 = '';
          this.buttonType2 = '';
          this.buttonType3 = 'primary';
          this.setSeriesData(this.customerNameList, this.numsList);
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

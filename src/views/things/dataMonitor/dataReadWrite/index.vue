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
                            <div v-if="data.dataType != 'bit'" class="signal-value not-exceeding">
                              <el-input style="width:60px;height: 28px;" v-model="data.dataValue" ></el-input>
                              <span style="width:10px;height: 28px;">{{data.dataUnit}}</span>
                            </div>
                            <div v-else class="signal-value not-exceeding" >
                              <el-radio v-model="data.dataValue" label="1">按下</el-radio>
                              <el-radio style="margin-left: 0px;" v-model="data.dataValue" label="2">抬起</el-radio>
                            </div>
                        </div>
                        <div class="pull-right signal-info">
                            <div class="signal-time">
                              <el-button type='primary'  @click="readData(data)">读取</el-button>
                            </div>
                            <div class="signal-btn">
                              <el-button type='primary'  @click="writeData(data)">写入</el-button>
                            </div>
                        </div> 
                    </el-card>
                  </el-col>
                </el-row>
          </div>
</div>
</template>
<script>
import { queryDtuIdDataRuleRead } from 'api/things/dataRuleRead/index';
import { mapGetters } from 'vuex';
export default {
  name: 'params',
  props: {
    dtuId: {
      type: String,
      default: 0
    }
  },
  data() {
    return {
      isShow: false,
      dataList: []
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
      queryDtuIdDataRuleRead({ dtuId: this.dtuId }).then(response => {
        this.dataList = response.data;
        this.isShow = true; // 数据处理完再显示页面
      });
    },
    // 读取数据
    readData(data) {

    },
    // 写入数据
    writeData(data) {

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
    line-height: 40px;
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
    line-height: 40px;
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

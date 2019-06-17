<template>
  <div class="app-container calendar-list-container">
    <el-tabs type="border-card" v-model="activeName">
      <el-tab-pane name="first">
        <span slot="label"><i class="el-icon-date"></i>数据监控</span>
        <dataMonitor :dtuId="stationId" ></dataMonitor>
      </el-tab-pane>
      <el-tab-pane name="sixth">
        <span slot="label"><i class="el-icon-date"></i> 实时数据</span>
        <dataRealTime v-if="activeName == 'sixth'" :dtuId="stationId"></dataRealTime>
      </el-tab-pane>
      <el-tab-pane name="seventh">
        <span slot="label"><i class="el-icon-date"></i> 数据读写</span>
        <dataReadWrite v-if="activeName == 'seventh'" :dtuId="stationId"></dataReadWrite>
      </el-tab-pane>
      <el-tab-pane name="second">
        <span slot="label"><i class="el-icon-date"></i> 故障报警</span>
        <errorAlarm v-if="activeName == 'second'" :dtuId="stationId" ></errorAlarm>
      </el-tab-pane>
      <el-tab-pane name="third">
        <span slot="label"><i class="el-icon-date"></i> 数据报表</span>
        <dataReport v-if="activeName == 'third'" :dtuId="stationId" ></dataReport>
      </el-tab-pane>
      <el-tab-pane name="fourth">
        <span slot="label"><i class="el-icon-date"></i> 消息配置</span>
        <messageConfig v-if="activeName == 'fourth'" :dtuId="stationId" ></messageConfig>
      </el-tab-pane>
      <el-tab-pane name="fifth">
        <span slot="label"><i class="el-icon-date"></i> 参数配置</span>
        <paramsConfig v-if="activeName == 'fifth'" :dtuId="stationId"></paramsConfig>
      </el-tab-pane>
  </el-tabs>
</div>
</template>
<script>
import util from 'utils/util.js';
import dataMonitor from './dataMonitor/index.vue';
import dataRealTime from './dataRealTime/index.vue';
import dataReadWrite from './dataReadWrite/index.vue';
import errorAlarm from './errorAlarm/index.vue';
import dataReport from './dataReport/index.vue';
import messageConfig from './messageConfig/index.vue';
import paramsConfig from './paramsConfig/index.vue';
import { mapGetters } from 'vuex';
export default {
  name: 'user',
  props: {
    // 子站Id
    stationId: [Number, String]
  },
  data() {
    return {
      startDate: null, // 报警开始时间
      endDate: null, // 报警结束时间
      activeName: 'first',
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        dtuId: 0,
        gatherTime: '2019-05-19'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0,
      excelData: [] // Excel 表格数据
    }
  },
  created() {
    this.listQuery.dtuId = this.stationId;
  },
  computed: {
    ...mapGetters([
      'elements',
      'username',
      'userId'
    ])
  },
  components: {
    dataMonitor,
    dataRealTime,
    dataReadWrite,
    errorAlarm,
    dataReport,
    messageConfig,
    paramsConfig
  },
  methods: {
    // 刷新实时真空度方法
    cancel(formName) {
      this.dialogFormVisible = false;
      this.$refs[formName].resetFields();
      if (formName === 'queryForm') {
        this.startDate = null;
        this.endDate = null;
        this.getList();
      }
    }
  }
}
</script>

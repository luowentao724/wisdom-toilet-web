<template>

<div class="app-container calendar-list-container">
  <div >
    <el-row>
      <el-collapse style="position: relative;" value='condition' >
        <el-collapse-item title='查询条件' name='condition'>
          <el-form :model='listQuery' :inline='true' class='demo-form-inline' label-width='100px' ref='queryForm'>
            <el-form-item label='DTU名称' prop='totilName'>
              <el-input placeholder="模糊查询" v-model='totilName' @keyup.enter.native="handleFilter"></el-input>
            </el-form-item>
            <el-form-item label='报警开始时间' prop='startDate'>
              <el-date-picker
                  :clearable='true'
                  @change="clickStartDate"
                  v-model="startDate"
                  type="date"
                  placeholder="选择日期"
                 >
                </el-date-picker>
            </el-form-item>
            <el-form-item label='报警结束时间' prop='endDate'>
              <el-date-picker
                  :clearable='true'
                  @change="clickEndDate"
                  v-model="endDate"
                  type="date"
                  placeholder="选择日期"
                 >
                </el-date-picker>
            </el-form-item>
            <div style='text-align:center'>
              <el-form-item>
                <el-button type='primary' @click='handleFilter' >查询</el-button>
                <el-button @click='cancel("queryForm")'>重置</el-button>
              </el-form-item>
            </div>
          </el-form>
        </el-collapse-item>
      </el-collapse>
    </el-row>
  </div>

  <alarmTable :listQuery="listQuery" ref="alarmTable"></alarmTable>


</div>
</template>
<script>
import alarmTable from './alarmTable/index.vue'
import { mapGetters } from 'vuex';
export default {
  name: 'user',
  data() {
    return {
      totilName: null,
      startDate: null, // 报警开始时间
      endDate: null, // 报警结束时间
      listQuery: {
        page: 1,
        limit: 20,
        totilName: undefined, // DTU名称
        startDate: undefined,  // 报警开始时间
        endDate: undefined,  // 报警开始时间
        status: 0  // 处理状态 0 未处理 1已处理
      }
    }
  },
  created() {
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  components: {
    alarmTable
  },
  methods: {
    // 设置报警开始时间
    clickStartDate(val) {
      this.listQuery.startDate = val;
    },
    // 设置报警结束时间
    clickEndDate(val) {
      this.listQuery.endDate = val;
    },
    handleFilter() {
      this.listQuery.totilName = this.totilName;
      this.$refs.alarmTable.getList();
    },
    cancel(formName) {
      this.$refs[formName].resetFields();
      if (formName === 'queryForm') {
        this.startDate = null;
        this.endDate = null;
        this.totilName = null;
        this.listQuery.startDate = null;
        this.listQuery.endDate = null;
        this.listQuery.totilName = null;
        this.handleFilter();
      }
    }

  }
}
</script>

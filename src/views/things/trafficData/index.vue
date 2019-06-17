<template>

<div class="app-container calendar-list-container">
  <div >
    <el-row>
      <el-collapse style="position: relative;" value='condition' >
        <el-collapse-item title='查询条件' name='condition'>
          <el-form :model='listQuery' :inline='true' class='demo-form-inline' label-width='100px' ref='queryForm'>
            <el-form-item label='查询日期' prop='openTime'>
                <el-date-picker
                  :clearable='false'
                   @change="clickYearMonthDay"
                  v-model="listQuery.openTime"
                  type="month"
                  placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>
    </el-row>
  </div>

<div class='tab_border'>
  <div class="search_title">列表查询结果</div>
  <div class="button_position">
    <!-- <el-checkbox v-model="checked">详情</el-checkbox> -->
  </div>
  <el-table :key='tableKey' :data="list" v-loading.body="listLoading"  border fit highlight-current-row >

    <el-table-column label="#" type='index' min-width='30'></el-table-column>
    <!-- <el-table-column label="#" type="selection" min-width="30"></el-table-column> -->
    <el-table-column label='DTU名称' prop='totilName' min-width='150'></el-table-column>
    <el-table-column label='设备标识UID' prop='totilId' min-width='100'></el-table-column>
    <el-table-column label='SIM卡号' prop='simCard' min-width='100'></el-table-column>
    <el-table-column label='本月在线时长(h)' prop='onlineTimeMonth' min-width='100'></el-table-column>
    <el-table-column label='本月累积流量(m)' prop='cumulativeTrafficMonth' min-width='100'></el-table-column>
    <el-table-column label='上行流量(m)' prop='readBytes' min-width='100'></el-table-column>
    <el-table-column label='下行流量(m)' prop='writtenBytes' min-width='100'></el-table-column>
    <el-table-column label='上行数据包' prop='readMessages' min-width='100'></el-table-column>
    <el-table-column label='下行数据包' prop='writtenMessages' min-width='100'></el-table-column>
  </el-table>
  <el-row type='flex' justify='end' class="pagination-container">
      <el-pagination :page-sizes='[10, 20, 50, 100]' :page-size='listQuery.limit' layout='prev,pager,next,jumper,total,sizes' :total='total' :current-page.sync='listQuery.page' @current-change='handleCurrentChange' @size-change='handleSizeChange'>
      </el-pagination>
  </el-row>
</div>

</div>
</template>
<script>
import {
  trafficPage
} from 'api/things/trafficData/index';
import util from 'utils/util';
import { mapGetters } from 'vuex';
export default {
  name: 'user',
  data() {
    return {
      checked: true, // 是否自动刷新
      timeRun: null,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        openTime: new Date() // 查询日期
      },
      dialogFormVisible: false,
      dialogStatus: '',
      tableKey: 0
    }
  },
  created() {
    let timeDate = new Date(),
      y = timeDate.getFullYear(),
      m = timeDate.getMonth() + 1,
      d = timeDate.getDate();
    this.getList(y + '-' + (m < 10 ? '0' + m : m));
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  methods: {
    clickYearMonthDay(val) {
      this.getList(val);
    },
    getList(val) {
      this.listQuery.openTime = val;
      this.listLoading = true;
      trafficPage(this.listQuery)
        .then(response => {
          this.list = response.data.rows;
          this.total = response.data.total;
          this.listLoading = false;
        })
    },
    handleFilter() {
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    cancel(formName) {
      this.dialogFormVisible = false;
      this.$refs[formName].resetFields();
      if (formName === 'queryForm') {
        this.getList();
      }
    }
  }
}
</script>

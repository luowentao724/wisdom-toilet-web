<template>

<div class="app-container calendar-list-container">
  <div >
    <el-row>
      <el-collapse style="position: relative;" value='condition' >
        <el-collapse-item title='查询条件' name='condition'>
          <el-form :model='listQuery' :inline='true' class='demo-form-inline' label-width='100px' ref='queryForm'>
            <el-form-item label='DTU名称' prop='totilName'>
              <el-input placeholder="模糊查询" v-model='listQuery.totilName' @keyup.enter.native="handleFilter"></el-input>
            </el-form-item>
            <el-form-item label='设备标识' prop='totilId'>
              <el-input placeholder="模糊查询" v-model='listQuery.totilId' @keyup.enter.native="handleFilter"></el-input>
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

<div class='tab_border'>
  <div class="search_title">列表查询结果</div>
  <div class="button_position">
    <el-checkbox v-model="checked">自动刷新</el-checkbox>
  </div>
  <el-table :key='tableKey' :data="list" v-loading.body="listLoading"  border fit highlight-current-row >

    <el-table-column label="#" type='index' min-width='30'></el-table-column>
    <!-- <el-table-column label="#" type="selection" min-width="30"></el-table-column> -->
    <el-table-column label='DTU名称' prop='totilName' min-width='150'></el-table-column>
    <el-table-column label='设备标识UID' prop='totilId' min-width='100'></el-table-column>
    <el-table-column label='客户名称' prop='customerName' min-width='100'></el-table-column>
    <el-table-column label='联系方式' prop='relPhone' min-width='100'></el-table-column>
    <el-table-column label='实时真空度' prop='currentPumpStationData' min-width='100'></el-table-column>
    <el-table-column label='系统状态' min-width='100'>
      <template scope="scope" >
          <div v-html="'正常'"></div>
      </template>
    </el-table-column>
    <el-table-column label='在线状态' prop='totilState' min-width='100'>
      <template scope="scope">
          <div :style="scope.row.totilState != 1 ? 'color: red' : ''" v-html="scope.row.totilState == 1 ? '在线' : '离线'"></div>
      </template>
    </el-table-column>
    <el-table-column label='便器数量' prop='totilNums' min-width='100'></el-table-column>
    <el-table-column label='累积冲洗次数' prop='accumulateTimes' min-width='100'></el-table-column>
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
  statusMonitorPage
} from 'api/things/stations/index';
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
        totilName: undefined, // DTU名称
        totilId: undefined  // DTU编号
      },
      dialogFormVisible: false,
      dialogStatus: '',
      tableKey: 0
    }
  },
  created() {
    this.getList();
    this.timer()
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  watch: {
    checked(newVal, oldVal) {
      console.log(newVal, oldVal)
      if (newVal) {
        this.timer()
      } else {
        clearInterval(this.timeRun)
      }
    }
  },
  destroyed() {
    clearInterval(this.timeRun)
  },
  methods: {
    timer() {
      this.timeRun = setInterval(() => {
        this.getList()
      }, 5000)
    },
    getList() {
      this.listLoading = true;
      statusMonitorPage(this.listQuery)
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

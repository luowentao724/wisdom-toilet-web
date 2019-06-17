<template>

<div class="app-container calendar-list-container">
  <div >
    <el-row>
      <el-collapse style="position: relative;" value='condition' >
        <el-collapse-item title='查询条件' name='condition'>
          <el-form :model='listQuery' :inline='true' class='demo-form-inline' label-width='100px' ref='queryForm'>
            <el-form-item label='员工工号' prop='nemberId'>
              <el-input placeholder="模糊查询" v-model='listQuery.nemberId' @keyup.enter.native="handleFilter"></el-input>
            </el-form-item>
            <el-form-item label='员工名称' prop='nemName'>
              <el-input placeholder="模糊查询" v-model='listQuery.nemName' @keyup.enter.native="handleFilter"></el-input>
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
  <el-table :key='tableKey' :data="list" v-loading.body="listLoading"  border fit highlight-current-row >

    <el-table-column label="#" type='index' min-width='30'></el-table-column>
    <!-- <el-table-column label="#" type="selection" min-width="30"></el-table-column> -->
    <el-table-column label='员工工号' prop='nemberId' min-width='150'></el-table-column>
    <el-table-column label='员工名称' prop='nemName' min-width='100'></el-table-column>
    <el-table-column label='子站编号' prop='stationId' min-width='100'></el-table-column>
    <el-table-column label='子站名称' prop='stationName' min-width='100'></el-table-column>
    <el-table-column label='子站位置' prop='stationPlace' min-width='100'></el-table-column>
    <el-table-column label='考勤时间' prop='createTime' min-width='100'></el-table-column>
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
  page
} from 'api/things/attendance/index';
import util from 'utils/util';
import { mapGetters } from 'vuex';
export default {
  name: 'user',
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        nemberId: undefined, // 员工工号
        nemName: undefined  // 员工名称
      },
      dialogFormVisible: false,
      dialogStatus: '',
      tableKey: 0
    }
  },
  created() {
    this.getList();
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  methods: {
    // 日期转换
    getList() {
      this.listLoading = true;
      page(this.listQuery)
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
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = 'create';
      this.dialogFormVisible = true;
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

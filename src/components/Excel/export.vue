<template>
	<el-button type='primary' class="filter-item" @click="outExe" ><i class="iconfont">&#xe608;</i>导出</el-button>
	<!-- <el-button type='primary' class="filter-item" @click="outExe" icon="plus" >导入</el-button> -->
</template>

<script>
import util from 'utils/util.js';
export default {
  props: {
    excelData: { // 导出数据
      type: Array,
      default: []
    },
    tHeader: { // 导出的表头名
      type: Array,
      default: []
    },
    filterVal: {// 导出的表头字段名
      type: Array,
      default: []
    },
    excelName: {
      type: String,
      default: '设备报警记录'
    }
  },
  data() {
    return {
    };
  },
  methods: {
       // 导出
    outExe() {
      this.$confirm('此操作将导出excel文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.export2Excel()
      }).catch(err => {
        // alert(err)
      });
    },
    export2Excel() {
      const that = this;
      require.ensure([], () => {
        const { export_json_to_excel } = require('excel/Export2Excel'); // 这里必须使用绝对路径
        const tHeader = this.tHeader; // 导出的表头名
        const filterVal = this.filterVal; // 导出的表头字段名
        const list = that.excelData;
        const data = that.formatJson(filterVal, list);
        const nowDateTime = util.formatTimestampValue(new Date());
        export_json_to_excel(tHeader, data, `${nowDateTime}` + this.excelName);// 导出的表格名称，根据需要自己命名
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  }
}
</script>
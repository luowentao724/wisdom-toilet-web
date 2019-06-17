<template>
<!-- <i class="iconfont">&#xe608;</i> -->
	<el-button type='primary' size="small" class="filter-item" @click="outJson" >导出</el-button>
</template>

<script>
import FileSaver from 'file-saver'
import util from 'utils/util.js';
export default {
  props: {
    jsonData: { // 导出数据
      type: Object,
      default: []
    },
    jsonName: {
      type: String,
      default: '数据规则'
    }
  },
  data() {
    return {
    };
  },
  methods: {
       // 导出
    outJson() {
      this.$confirm('此操作将导出' + this.jsonName + 'json文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const nowDateTime = util.formatTimestampValue(new Date());
        const data = JSON.stringify(this.jsonData)
        const blob = new Blob([data], { type: '' })
        FileSaver.saveAs(blob, nowDateTime + this.jsonName + '.json')
      }).catch(err => {
        // alert(err)
      });
    }
  }
}
</script>
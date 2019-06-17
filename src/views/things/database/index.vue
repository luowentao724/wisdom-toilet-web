<template>
<div class="app-container calendar-list-container">
  
  <el-row >
    <el-col style="margin-bottom: 10px;">
      <el-card class="box-card">
        <div class="clearfix">
          <span style="line-height: 36px;">请选择数据库</span>
          <el-button style="float: right;" @click="clickExport"
          v-loading.fullscreen.lock="fullscreenLoading"
          element-loading-text="拼命导出中"
           type="primary">导出</el-button>
        </div>
      </el-card>

    </el-col>
    <el-col >
      <el-card class="box-card">
        <div class="clearfix">
          <span style="line-height: 36px;">请选择数据库</span>
          <el-button style="float: right;" type="primary">导入</el-button>
        </div>
      </el-card>
    </el-col>
  </el-row>


</div>
</template>

<script>
import {
  exportDatabase, downloadFile
} from 'api/things/database/index';
import { mapGetters } from 'vuex';
export default {
  name: 'user',
  data() {
    return {
      fullscreenLoading: false, // 页面加载控制
      exportBox: {
        ag_admin_v1: false,
        ag_auth_v1: false,
        ag_things: false
      },
      importData: '1',
      importBox: {
        ag_admin_v1: false,
        ag_auth_v1: false,
        ag_things: false
      },
      ag_things: 'jdbc.exportDatabaseNameThings', // 对应数据库
      ag_admin_v1: 'jdbc.exportDatabaseNameAdmin', // 对应数据库
      ag_auth_v1: 'jdbc.exportDatabaseNameAuth'// 对应数据库
    }
  },
  created() {
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  methods: {
    clickExport() {
      this.fullscreenLoading = true;
      exportDatabase({ databaseName: this.ag_things }).then(data => {
        setTimeout(() => {
          this.downloadAttachment(data);
        }, 1000);
      });
    },
    // 下载附件
    downloadAttachment(file) {
        // 由于是ajax调用下载方法，下载数据不会直接下载到本地，所以再创建一个a标签，给它一个 download 属性（HTML5新属性）
      downloadFile({ filePath: file }).then(data => {
        if (!data) {
          return
        }
        const url = window.URL.createObjectURL(new Blob([data]))
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
          // 获取文件名
        let fileName = null
        if (file.indexOf('/') !== -1) {
          fileName = file.substring(file.lastIndexOf('/') + 1)
        } else {
          fileName = file
        }
          // download 属性定义了下载链接的地址而不是跳转路径
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        this.fullscreenLoading = false;
      })
    },
    handleUpdate(row) {
      console.log(row);
      const reg = /^(0|[1-9]\d*)(\s|$|\.\d{1,2}\b)/;
      if (reg.test(row.value)) {
        putObj(row.id, row).then(() => {
          this.getList();
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          });
        });
      } else {
        this.$notify({
          title: '警告',
          message: '只能输入两位小数以内的数字',
          type: 'warning',
          duration: 2000
        });
      }
    },
    update(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          putObj(this.form.id, this.form).then(() => {
            this.dialogFormVisible = false;
            this.getList();
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            });
          });
        } else {
          return false;
        }
      });
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

 .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  .clearfix:after {
      clear: both
  }

  .box-card {
    width: 480px;
  }


</style>


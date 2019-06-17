<template>
	<!-- <el-button type='primary' class="filter-item" @click="outExe" icon="plus" >导出</el-button> -->
<div>
  <el-button style="margin-left: 10px;margin-right: 10px;height: 38px;"  type="primary" class="filter-item" @click="dialogVisible = true" ><i class="iconfont">&#xe609;</i>{{btnText}}</el-button>

  <el-dialog :title="'选择文件'" :visible.sync="dialogVisible" :modal="false" size="tiny">

     <el-upload
      class="upload-demo"
      ref="upload"
      accept=".json"
      :action="importUrl"
      :on-change="onChange"
      :on-preview="handlePreview"
      :on-success="onSuccess"
      :on-error="onError"
      :before-upload="beforeUpload"
      :headers="{'Authorization':token,'isUpdate':(isUpdate ? '1' : '0')}"
      :on-remove="onRemove"
      :auto-upload="false">
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
    </el-upload> 
     
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="importLoading" :disabled="!enabledUploadBtn" @click="submitUpload">上传到服务器</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import FileSaver from 'file-saver'
import util from 'utils/util.js';
import { getToken } from 'utils/auth';

export default {
  props: {
    // dataRuleId: { // 数据规则id
    //   type: String
    // },
    importUrl: {
      type: String
    },
    getList: {
      type: Function
    }
    // tHeader: { // 导出的表头名
    //   type: Array,
    //   default: []
    // },
    // filterVal: {// 导出的表头字段名
    //   type: Array,
    //   default: []
    // }
  },
  data() {
    return {
      token: null,
      isUpdate: false,
      fileList: [],
      importLoading: false,
      enabledUploadBtn: true,
      dialogVisible: false,
      btnText: '导入'
    };
  },
  created() {
    this.token = getToken();
  },
  methods: {
    importJSON() {
      const file = document.getElementById('file').files[0]
      const reader = new FileReader()
      reader.readAsText(file)
      const _this = this
      reader.onload = function() {
          // this.result为读取到的json字符串，需转成json对象
        _this.ImportJSON = JSON.parse(this.result)
          // 检测是否导入成功
        console.log(_this.ImportJSON)
      }
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    handlePreview(file) {
      console.log(file);
    },
    onSuccess(response, file, fileList) {
      console.log(response.data)
      this.fileList = [];
      this.importLoading = false;
      this.enabledUploadBtn = true;
      this.uploadBtnIcon = 'upload';
      this.btnText = '导入';
      if (response.status == 500) {
        this.$message.error(response.message + ':上传文件 json 格式!');
        return;
      } else {
        this.$message.success('导入成功!');
      }
      this.getList();
      this.$message.success('数据导入成功！');
    },
    onError(err, file, fileList) {
      console.log('err' + err)
      this.fileList = [];
      this.importLoading = false;
      this.enabledUploadBtn = true;
      this.uploadBtnIcon = 'upload';
      this.btnText = '导入';
      this.$message.error('数据导入失败！请检查是否有重复数据,和网络连接状况！');
    },
    beforeUpload(file) {
      this.importLoading = true;
      this.enabledUploadBtn = false;
      this.uploadBtnIcon = 'el-icon-loading';
      this.btnText = '导入';
    },
    onRemove(file, fileList) {
    },
    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    onChange(file, fileList) {
    },
    // 文件上传时的钩子
    onProgress(file, fileList) {
      console.log(file);
      console.log(fileList);
    }
  }
}
</script>
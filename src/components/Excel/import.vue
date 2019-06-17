<template>
	<!-- <el-button type='primary' class="filter-item" @click="outExe" icon="plus" >导出</el-button> -->
<div>
  <el-button style="margin-left: 10px;margin-right: 10px;height: 38px;"  type="primary" class="filter-item" @click="dialogVisible = true" ><i class="iconfont">&#xe609;</i>{{btnText}}</el-button>

  <el-dialog :title="'选择文件'" :visible.sync="dialogVisible" :modal="false" size="tiny">

     <el-upload
      class="upload-demo"
      ref="upload"
      accept=".xls,.xlsx"
      :action="importUrl"
      :on-change="onChange"
      :on-preview="handlePreview"
      :on-success="onSuccess"
      :on-error="onError"
      :before-upload="beforeUpload"
      :headers="{'Authorization':token,'isUpdate':(isUpdate ? '1' : '0'),'dataRuleId':dataRuleId}"
      :on-remove="onRemove"
      :auto-upload="false">
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
    </el-upload> 
      <!-- :file-list="fileList" -->

    <!-- <el-row>
      <el-upload
        ref="upload"
         class="upload-demo"
        :auto-upload="false"
        :file-list="fileList"
        :headers="{'Authorization':token,'isUpdate':(isUpdate ? '1' : '0'),'dataRuleId':dataRuleId}"
        :on-success="onSuccess"
        :on-preview="handlePreview"
        :on-remove="onRemove"
        :on-error="onError"
        :on-change="onChange"
        :on-progress="onProgress"
        :before-upload="beforeUpload"
        accept=".xls,.xlsx"
        :action="importUrl">
        <el-button slot="trigger" size="small" type="primary" >选取文件</el-button>
        <el-button type="primary" :loading="importLoading" :disabled="!enabledUploadBtn" @click="submitUpload">上传到服务器</el-button>
         <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> 
      </el-upload>

    </el-row> -->
    <el-row style="margin-top: 10px;">
      <el-checkbox v-model="isUpdate" >是否覆盖原数据</el-checkbox>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="importLoading" :disabled="!enabledUploadBtn" @click="submitUpload">上传到服务器</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import util from 'utils/util.js';
import { getToken } from 'utils/auth';
import { excelExport } from 'api/pubThings';

export default {
  props: {
    dataRuleId: { // 数据规则id
      type: String
    },
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
        this.$message.error(response.message + ':上传文件 xls,xlsx 格式!');
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
      alert('数据导入失败！请检查是否有重复数据,和网络连接状况！');
    },
    beforeUpload(file) {
      console.log(file.type);
      if (this.fileList.length > 1) {
        this.$message.error('一次只能导入一个Excel文件');
        return;
      }
      this.importLoading = true;
      this.enabledUploadBtn = false;
      this.uploadBtnIcon = 'el-icon-loading';
      this.btnText = '导入';
    },
    onRemove(file, fileList) {
      console.log('onRemove');
      console.log(file);
      console.log(fileList);
    },
    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    onChange(file, fileList) {
      console.log('onChange');
      console.log(file);
      console.log(this.fileList);
    },
    // 文件上传时的钩子
    onProgress(file, fileList) {
      console.log(file);
      console.log(fileList);
    },
    handleBeforeUploadBgImg(file) { // 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
      const isOne = true;
      const isJPG = file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/gif';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('上传图片只能是 PNG,JPG,GIF 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }
      if (!isOne) { // 只能上传一张图片
        this.$message.error('只能上传一张图片');
      }
      return isOne && isJPG && isLt2M;
    },
    initJls() {
      // this.getRequest('/api/things/excel/import').then(resp => {
      //   if (resp) {
      //     this.jls = resp;
      //   }
      // })
    },
    // 导入数据规则
    importData() {
      // 1.查找到存放文件的元素
      const myfile = this.$refs.myfile;
      // 2.钙元素内部有一个file数组，里面存放了所有选择的file。
      // 由于上传文件时，文件可以多选，因此这里拿到的files对象是一个数组
      const files = myfile.files;
      // 3.从files对象中，获取自己要上传的文件（即数组中的第一项）
      const file = files[0];
      // 4.构造一个FormData，用来存放上传的数据，注意FormData不可以使用链式配置
      const formData = new FormData();
      formData.append('file', file);
      formData.append('username', 'Kyokkk');
      // 5.构造好FormData后，就可以直接上传数据了，FormData就是要上传的数据
      // 6.文件上传注意两点，①请求方法为POST，②设置Content-Type为multipart/form-data
      this.uploadFileRequest('/api/things/excel/import', formData).then(resp => {
        if (resp) {
          alert(resp);
        }
      })
    }
  }
}
</script>
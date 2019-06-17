<template>
<div class="app-container calendar-list-container">
  
  <!-- <el-button  size="small" type="success" @click="handleUpdate(scope.row)">更新</el-button> -->
    
    <el-form  :model="form" ref="form" label-width="100px">
      <p  style="color: rgb(45, 140, 240);padding: 0px 0px 15px 45px;">
        <i class="ivu-icon ivu-icon-information-circled"></i> 
        <span >DTU节能参数（便器每冲洗一次）</span>
      </p> 
      <template v-for="item in list">
        <el-row :gutter="10" v-bind:key="item.id">
          <el-col :span="8">
            <el-form-item :label="item.name" >
              <el-input  v-model="item.value" :placeholder="'请输入'+item.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item >
            <el-button v-if="dtuConfigInfoManager_btn_edit" type="primary" @click="handleUpdate(item)" >更新</el-button>
          </el-form-item>
          </el-col>
        </el-row>
      </template>
    </el-form>
    
</div>
</template>

<script>
import {
  getListAll,
  addObj,
  getObj,
  delObj,
  putObj
} from 'api/things/dtuConfigInfo/index';
import { mapGetters } from 'vuex';
export default {
  name: 'user',
  data() {
    return {
      form: {
      },
      rules: {

      },
      list: [],
      dtuConfigInfoManager_btn_edit: false
    }
  },
  created() {
    this.getList();
    this.dtuConfigInfoManager_btn_edit = this.elements['dtuConfigInfoManager:btn_edit'];
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  methods: {
    getList() {
      getListAll().then(response => {
        this.list = response;
      });
    },
    handleFilter() {
      this.getList();
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

.ivu-icon {
    display: inline-block;
    font-family: Ionicons;
    speak: none;
    font-style: normal;
    font-weight: 400;
    font-variant: normal;
    text-transform: none;
    text-rendering: auto;
    line-height: 1;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
.ivu-card {
    background: #fff;
    border-radius: 4px;
    font-size: 14px;
    position: relative;
    transition: all .2s ease-in-out;
}


</style>


<template>

<div class="app-container calendar-list-container">
  <div >
    <el-row>
      <el-collapse style="position: relative;" value='condition' >
        <el-collapse-item title='查询条件' name='condition'>
          <el-form :model='listQuery' :inline='true' class='demo-form-inline' label-width='100px' ref='queryForm'>
            <el-form-item label='客户名称' prop='customerName'>
              <el-input placeholder="模糊查询" v-model='listQuery.customerName' @keyup.enter.native="handleFilter"></el-input>
            </el-form-item>
            <el-form-item label='联系人' prop='contractName'>
              <el-input placeholder="模糊查询" v-model='listQuery.contractName' @keyup.enter.native="handleFilter"></el-input>
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
      <el-button type='primary' v-if="customerManager_btn_add" class="filter-item" @click="handleCreate" icon="plus" >添加</el-button>
  </div>
  <el-table :key='tableKey' :data="list" v-loading.body="listLoading"  border fit highlight-current-row >

    <el-table-column label="#" type='index' min-width='30'></el-table-column>
    <!-- <el-table-column label="#" type="selection" min-width="30"></el-table-column> -->
    <el-table-column label='客户名称' prop='customerName' min-width='150'></el-table-column>
    <el-table-column label='系统名称' prop='systemName' min-width='100'></el-table-column>
    <el-table-column label='系统logo' prop='systemLogo' min-width='100'></el-table-column>
    <el-table-column label='联系人名称' prop='contractName' min-width='100'></el-table-column>
    <el-table-column label='联系电话' prop='contractPhone' min-width='100'></el-table-column>
    <el-table-column label='联系邮件' prop='contractEmail' min-width='100'></el-table-column>
    <el-table-column label='备注' prop='remark' min-width='100'></el-table-column>

    <el-table-column label="操作" width="150" min-width="250" fixed='right' fit='false' > 
      <template scope="scope">
        <el-button v-if="customerManager_btn_edit" size="small" type="primary" @click="handleUpdate(scope.row)">编辑
        </el-button>
        <el-button v-if="customerManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
        </el-button>
      </template> 
    </el-table-column>
  </el-table>
  <el-row type='flex' justify='end' class="pagination-container">
      <el-pagination :page-sizes='[10, 20, 50, 100]' :page-size='listQuery.limit' layout='prev,pager,next,jumper,total,sizes' :total='total' :current-page.sync='listQuery.page' @current-change='handleCurrentChange' @size-change='handleSizeChange'>
      </el-pagination>
  </el-row>
</div>

  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
      <el-form-item label="客户名称" prop="customerName">
        <el-input v-model="form.customerName" placeholder="请输入客户名称"></el-input>
      </el-form-item>
      <el-form-item label="系统名称" prop="systemName">
        <el-input v-model="form.systemName" placeholder="请输入系统名称"></el-input>
      </el-form-item>
      <el-form-item label="系统logo" prop="systemLogo">
        <!-- <el-upload
          class="avatar-uploader"
          :action="this.file.uploadFileUrl"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="form.systemLogo" :src="form.systemLogo" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload> -->
        <el-input v-model="form.systemLogo" placeholder="请输入系统logo"></el-input>
      </el-form-item>
      <el-form-item label="联系人" prop="contractName">
        <el-input v-model="form.contractName" placeholder="请输入联系人"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="contractPhone">
        <el-input v-model="form.contractPhone" placeholder="请输入联系人"></el-input>
      </el-form-item>
      <el-form-item label="联系邮箱" prop="contractEmail">
        <el-input v-model="form.contractEmail" placeholder="请输入联系邮箱"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}" placeholder="请输入内容" v-model="form.remark"> </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel('form')">取 消</el-button>
      <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
      <el-button v-else type="primary" @click="update('form')">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>
<script>
import {
  page,
  addObj,
  getObj,
  delObj,
  putObj
} from 'api/things/customer/index';
import { getObjId } from 'api/pubThings';
import { mapGetters } from 'vuex';
export default {
  name: 'user',
  data() {
    return {
      form: {
        customerId: undefined, // 客户编号
        customerName: undefined, // 客户姓名
        systemName: undefined, // 系统名称
        systemLogo: undefined, // 系统标识
        contractName: undefined, // 联系人
        contractPhone: undefined, // 联系电话
        contractEmail: undefined, // 联系邮箱
        remark: undefined // 备注
      },
      rules: {
        customerName: [
          {
            required: true,
            message: '请输入客户姓名',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          }
        ],
        systemName: [
          {
            required: true,
            message: '请输入系统名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          }
        ],
        systemLogo: [
          {
            required: false,
            message: '请上传系统logo',
            trigger: 'blur'
          }
        ],
        contractName: [
          {
            required: true,
            message: '请输入联系人名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          }
        ],
        contractPhone: [
          {
            required: true,
            message: '请输入联系电话',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          }
        ],
        contractEmail: [
          {
            required: true,
            message: '请输入联系邮箱',
            trigger: 'blur'
          },
          {
            min: 5,
            max: 30,
            message: '长度在 5 到 30 个字符',
            trigger: 'blur'
          }
        ]
      },
      file: {
        uploadFileUrl: '',
        imageList: [],
        fileList: [],
        token: {
          // accessToken: getAccessToken()
        }
      },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        customerName: undefined, // 客户名称
        contractName: undefined  // 联系人
      },
      dialogFormVisible: false,
      dialogStatus: '',
      customerManager_btn_edit: false,
      customerManager_btn_del: false,
      customerManager_btn_add: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0
    }
  },
  created() {
    this.getList();
    this.customerManager_btn_edit = this.elements['customerManager:btn_edit'];
    this.customerManager_btn_del = this.elements['customerManager:btn_del'];
    this.customerManager_btn_add = this.elements['customerManager:btn_add'];
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  methods: {
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
      getObjId().then(response => {
        this.form.id = response.data;
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
      }).catch(err => {
        throw err;
      });
    },
    resetTemp() {
      this.form.id = undefined; // 客户编号
      this.form.customerName = undefined; // 客户姓名
      this.form.systemName = undefined; // 系统名称
      this.form.systemLogo = undefined; // 系统标识
      this.form.contractName = undefined; // 联系人
      this.form.contractPhone = undefined; // 联系电话
      this.form.contractEmail = undefined; // 联系邮箱
      this.form.remark = undefined; // 备注
    },
    handleUpdate(row) {
      getObj(row.id)
        .then(response => {
          this.form = response.data;
          this.dialogFormVisible = true;
          this.dialogStatus = 'update';
        });
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      console.log(JSON.stringify(file.type));
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG,PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delObj(row.id)
            .then(() => {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              });
              const index = this.list.indexOf(row);
              this.list.splice(index, 1);
            });
        });
    },
    create(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          addObj(this.form)
            .then(() => {
              this.dialogFormVisible = false;
              this.getList();
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              });
            })
        } else {
          return false;
        }
      });
    },
    cancel(formName) {
      this.dialogFormVisible = false;
      this.$refs[formName].resetFields();
      if (formName === 'queryForm') {
        this.getList();
      }
    },
    update(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          this.form.password = undefined;
          putObj(this.form.id, this.form).then(() => {
            this.dialogFormVisible = false;
            this.getList();
            this.$notify({
              title: '成功',
              message: '创建成功',
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
    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }

</style>

<template>

<div class="app-container calendar-list-container">

<div class='tab_border'>
  <div class="search_title">用户</div>
  <div class="button_position">
      <el-button type='primary' v-if="messageConfig_btn_add" class="filter-item" @click="handleCreate" icon="plus" >添加</el-button>
  </div>
  <el-table :key='tableKey' :data="list" v-loading.body="listLoading"  border fit highlight-current-row >
    <el-table-column label="#" type='index' min-width='30'></el-table-column>
    <!-- <el-table-column label="#" type="selection" min-width="30"></el-table-column> -->
    <el-table-column label='用户名称' prop='username' min-width='150'></el-table-column>
    <el-table-column label='真实姓名' prop='name' min-width='100'></el-table-column>
    <el-table-column label='手机号码' prop='telPhone' min-width='100'></el-table-column>
    <el-table-column label='邮箱' prop='email' min-width='100'></el-table-column>
    <el-table-column label='发送短信'  min-width='100' >
      <template scope="scope" >
        <i v-if="scope.row.simFlag == 1" style="color:#13ce66" class="el-icon-circle-check el-icon--left"></i>
        <i v-else  style="color:#ff4949" class="el-icon-circle-close el-icon--left"></i>
      </template>
    </el-table-column>
    <el-table-column label='发送邮件'  min-width='100' >
      <template scope="scope">
        <i v-if="scope.row.emailFlag == 1" style="color:#13ce66" class="el-icon-circle-check el-icon--left"></i>
        <i v-else  style="color:#ff4949" class="el-icon-circle-close el-icon--left"></i>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="150" min-width="250" fixed='right' fit='false' > 
      <template scope="scope">
        <el-button v-if="messageConfig_btn_edit" size="small" type="primary" @click="handleUpdate(scope.row)">编辑
        </el-button>
        <el-button v-if="messageConfig_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
        </el-button>
      </template> 
    </el-table-column>
  </el-table>
  
</div>

  <el-dialog :title="'用户选择'" :visible.sync="dialogFormVisible">
    <div class="button_position">
      <el-form :model='listQueryUser' :inline='true' class='demo-form-inline' label-width='100px' ref='queryForm'>
        <el-form-item label='用户名' prop='usernameOrName'>
          <el-input placeholder="请输入用户名或真实姓名" v-model='listQueryUser.usernameOrName' @keyup.enter.native="handleFilterUser"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type='primary' @click='handleFilterUser' >查询</el-button>
          <el-button @click='cancel("queryForm")'>重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :key='tableKey' :data="listUser" v-loading.body="listLoadingUser"  border fit highlight-current-row >
      <!-- <el-table-column label="#" type="selection" min-width="30"></el-table-column> -->
      <el-table-column label='用户名称' prop='username' min-width='150'></el-table-column>
      <el-table-column label='真实姓名' prop='name' min-width='100'></el-table-column>
      <el-table-column label='手机号码' prop='tel_phone' min-width='100'></el-table-column>
      <el-table-column label='邮箱' prop='email' min-width='100'></el-table-column>
      <el-table-column label="操作" width="150" min-width="250" fixed='right' fit='false' > 
        <template scope="scope">
          <el-button size="small" type="primary" @click="handleCreateUser(scope.row)">添加
          </el-button>
        </template> 
      </el-table-column>
    </el-table>
    <el-row type='flex' justify='end' class="pagination-container">
      <el-pagination :page-sizes='[10, 20, 50, 100]' :page-size='listQueryUser.limit' layout='prev,pager,next,jumper,total,sizes' :total='totalUser' :current-page.sync='listQueryUser.page' @current-change='handleCurrentChangeUser' @size-change='handleSizeChangeUser'>
      </el-pagination>
  </el-row>
  </el-dialog>

  <el-dialog :title="'短信,邮件发送'" :visible.sync="dialogFormUserVisible" size="tiny">
    <el-form :model="form" :rules="rules" ref="formUser" label-width="100px">
      <el-form-item label="发送短信" >
        <el-radio-group v-model="form.simFlag">
          <el-radio :label="1" >是</el-radio>
          <el-radio :label="0" >否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="发送邮件" >
        <el-radio-group v-model="form.emailFlag">
          <el-radio :label="1" >是</el-radio>
          <el-radio :label="0" >否</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormUserVisible = false">取 消</el-button>
       <el-button v-if="dialogStatus=='create'" type="primary" @click="create('formUser')">确 定</el-button>
      <el-button v-else type="primary" @click="update('formUser')">确 定</el-button>
    </div>
  </el-dialog>

</div>
</template>
<script>
import {
  getMessageList,
  addObj,
  delObj,
  putObj
} from 'api/things/messageConfig/index';
import {
  getObj,
  getObjList,
  messageConfigPage
} from 'api/admin/user/index';
import { getObjId } from 'api/pubThings';
import { mapGetters } from 'vuex';
export default {
  name: 'user',
  props: {
    dtuId: {
      type: String,
      default: 0
    }
  },
  data() {
    return {
      form: {
        id: null,
        dtuId: null,
        userId: null,
        simFlag: 1,
        emailFlag: 1
      },
      rules: {
        simFlag: [
          {
            required: true,
            message: '请输入客户姓名',
            trigger: 'blur'
          }
        ]
      },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        dtuId: this.dtuId
      },
      listUser: null,
      totalUser: null,
      listLoadingUser: true,
      listQueryUser: {
        page: 1,
        limit: 20,
        usernameOrName: null,
        username: null,
        name: null
      },
      dialogFormVisible: false,
      dialogFormUserVisible: false,
      messageConfig_btn_edit: false,
      messageConfig_btn_del: false,
      messageConfig_btn_add: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0,
      result: {},
      userIds: '',
      userInfoList: new Array(),
      messageList: new Array(),
      isBarek: false
    }
  },
  watch: {
    // dtuId
    dtuId(newVal, oldVal) {
      this.getList();
    }
  },
  created() {
    this.getList();
    this.messageConfig_btn_edit = this.elements['messageConfig:btn_edit'];
    this.messageConfig_btn_del = this.elements['messageConfig:btn_del'];
    this.messageConfig_btn_add = this.elements['messageConfig:btn_add'];
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  methods: {
    getList() {
      this.listLoading = true;
      getMessageList(this.listQuery).then(response => {
        response.data.map((item, index) => {
          this.userIds += item.userId + ',';
        });
        this.messageList = response.data;
        this.userIds = this.userIds.substring(0, this.userIds.length - 1);
        if (this.userIds) {
          console.log(this.userIds);
          getObjList({ ids: this.userIds }).then(userData => {
            userData.map((item, index) => {
              this.messageList[index].username = item.username;
              this.messageList[index].name = item.name;
              this.messageList[index].telPhone = item.telPhone;
              this.messageList[index].email = item.email;
            });
            this.list = this.messageList;
          });
        }

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
    // --------------- 用户选择列表 方法 ------------------
    getListUser() {
      this.listLoadingUser = true;
      this.listQueryUser.username = this.listQueryUser.usernameOrName;
      this.listQueryUser.name = this.listQueryUser.usernameOrName;
      messageConfigPage(this.listQueryUser).then(response => {
        this.listUser = response.data.rows;
        this.totalUser = response.data.total;
        this.listLoadingUser = false;
      })
    },
    handleFilterUser() {
      this.getListUser();
    },
    handleSizeChangeUser(val) {
      this.listLoadingUser.limit = val;
      this.getListUser();
    },
    handleCurrentChangeUser(val) {
      this.listLoadingUser.page = val;
      this.getListUser();
    },
    handleCreate() {
      this.getListUser();
      this.dialogFormVisible = true;
    },
    handleCreateUser(row) {
      this.isBarek = false;
      this.userIds.split(',').map((item, index) => {
        if (item == row.id) {
          this.isBarek = true;
        }
      });
      if (this.isBarek) {
        this.$message({
          message: '警告此用户已添加过了',
          type: 'warning',
          duration: 2000
        });
        return;
      }
      this.dialogStatus = 'create';
      getObjId().then(response => {
        this.form.id = response.data;
        this.form.userId = row.id;
        this.dialogFormUserVisible = true;
      }).catch(err => {
        throw err;
      });
    },
    handleUpdate(row) {
      this.dialogStatus = 'update';
      this.form = row;
      this.dialogFormUserVisible = true;
    },
    create(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          this.form.dtuId = this.dtuId;
          addObj(this.form)
            .then(() => {
              this.dialogFormUserVisible = false;
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
    update(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          this.form.password = undefined;
          putObj(this.form.id, this.form).then(() => {
            this.dialogFormUserVisible = false;
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
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
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
    cancel(formName) {
      this.dialogFormVisible = false;
      // this.dialogFormUserVisible = false;
      this.$refs[formName].resetFields();
      if (formName === 'queryForm') {
        this.getList();
      }
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

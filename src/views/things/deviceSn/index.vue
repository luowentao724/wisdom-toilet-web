<template>

<div class="app-container calendar-list-container">
  <div >
    <el-row>
      <el-collapse style="position: relative;" value='condition' >
        <el-collapse-item title='查询条件' name='condition'>
          <el-form :model='listQuery' :inline='true' class='demo-form-inline' label-width='100px' ref='queryForm'>
            <el-form-item label='SN编号' prop='sn'>
              <el-input placeholder="模糊查询" v-model='listQuery.sn' @keyup.enter.native="handleFilter"></el-input>
            </el-form-item>
            <el-form-item label='所属账号' prop='creater'>
              <el-input placeholder="模糊查询" v-model='listQuery.creater' @keyup.enter.native="handleFilter"></el-input>
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
      <el-button type='primary' v-if="deviceSnManager_btn_add" class="filter-item" @click="handleCreate" icon="plus" >添加</el-button>
  </div>
  <el-table :key='tableKey' :data="list" v-loading.body="listLoading"  border fit highlight-current-row >
    <el-table-column label="#" type='index' min-width='30'></el-table-column>
    <el-table-column label='SN编号' prop='sn' min-width='150'></el-table-column>
    <el-table-column label='关联子站' prop='stationName' min-width='100'></el-table-column>
    <el-table-column label='所属账号' prop='creater' min-width='100'></el-table-column>
    <el-table-column label='创建时间' prop='createTime' min-width='150'></el-table-column>
    <el-table-column label='更新时间' prop='updateTime' min-width='150'></el-table-column>
    <el-table-column label='备注' prop='remark' min-width='100'></el-table-column>
    <el-table-column label="操作" width="150" min-width="250" fixed='right' fit='false' > 
      <template scope="scope">
        <el-button v-if="deviceSnManager_btn_edit" size="small" type="primary" @click="handleUpdate(scope.row)">编辑
        </el-button>
        <el-button v-if="deviceSnManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
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
      <el-form-item label="SN编号" prop="sn">
        <el-input v-model="form.sn" placeholder="请输入SN编号"></el-input>
      </el-form-item>
      <el-form-item label="绑定子站" prop="station">
        <el-select class="filter-item" v-model="form.station" placeholder="请选择">
          <el-option v-for="item in stationOptions" :key="item.id+''" :label="item.totilName" :value="item.id+''"> </el-option>
        </el-select>
        <!-- <el-input v-model="form.station" placeholder="请选择子站"></el-input> -->
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
} from 'api/things/deviceSn/index';
import {
  getStationList
} from 'api/things/stations/index';
import { getObjId } from 'api/pubThings';
import { mapGetters } from 'vuex';
export default {
  name: 'user',
  data() {
    return {
      form: {
        id: undefined, // sn码id
        sn: undefined, // sn码
        remark: undefined, // 备注
        creater: undefined, // 创建账户
        station: undefined // 关联子站
      },
      stationOptions: [], // 子站列表
      rules: {
        sn: [
          {
            required: true,
            message: '请输入SN码',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 50,
            message: '长度在 1 到 50 个字符',
            trigger: 'blur'
          }
        ],
        station: [
          {
            required: true,
            message: '请选择SN码',
            trigger: 'blur'
          }
        ],
        remark: [
          {
            required: false,
            message: '请输入备注',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 255,
            message: '长度在 1 到 255 个字符',
            trigger: 'blur'
          }
        ]
      },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        sn: undefined, // 客户名称
        creater: undefined  // 创建账户
      },
      dialogFormVisible: false,
      dialogStatus: '',
      deviceSnManager_btn_edit: false,
      deviceSnManager_btn_del: false,
      deviceSnManager_btn_add: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0
    }
  },
  created() {
    this.getList();
    this.setStationOption();
    this.deviceSnManager_btn_edit = this.elements['deviceSnManager:btn_edit'];
    this.deviceSnManager_btn_del = this.elements['deviceSnManager:btn_del'];
    this.deviceSnManager_btn_add = this.elements['deviceSnManager:btn_add'];
    console.log(this.username);
  },
  computed: {
    ...mapGetters([
      'elements',
      'username'
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
        this.form.station = this.stationOptions[0].id + '';
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
      }).catch(err => {
        throw err;
      });
    },
    // 初始化子站列表
    setStationOption() {
      getStationList().then(response => {
        this.stationOptions = response;
      });
    },
    resetTemp() {
      this.form.id = undefined; // sn码id
      this.form.sn = undefined; // sn码
      this.form.creater = this.username; // 创建账户
      this.form.station = undefined; // 关联子站
      this.form.remark = undefined; // 备注
    },
    handleUpdate(row) {
      getObj(row.id)
        .then(response => {
          // this.form = response.data;
          this.form.id = response.data.id; // sn码id
          this.form.sn = response.data.sn; // sn码
          this.form.creater = response.data.creater; // 创建账户
          this.form.station = response.data.station; // 关联子站
          this.form.remark = response.data.remark; // 备注
          this.dialogFormVisible = true;
          this.dialogStatus = 'update';
        });
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
      // console.log(JSON.stringify(this.form))
      const set = this.$refs;
      this.form.creater = this.username;
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

<template>

<div class="app-container calendar-list-container">
  <div >
    <el-row>
      <el-collapse style="position: relative;" value='condition' >
        <el-collapse-item title='查询条件' name='condition'>
          <el-form :model='listQuery' :inline='true' class='demo-form-inline' label-width='100px' ref='queryForm'>
            <el-form-item label='员工名称' prop='nemName'>
              <el-input placeholder="模糊查询" v-model='listQuery.nemName' @keyup.enter.native="handleFilter"></el-input>
            </el-form-item>
            <el-form-item label='员工工号' prop='nemberId'>
              <el-input placeholder="模糊查询" v-model='listQuery.nemberId' @keyup.enter.native="handleFilter"></el-input>
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
      <el-button type='primary' v-if="dtuMemberManager_btn_add" class="filter-item" @click="handleCreate" icon="plus" >添加</el-button>
  </div>
  <el-table :key='tableKey' :data="list" v-loading.body="listLoading"  border fit highlight-current-row >
    <el-table-column label="#" type='index' min-width='30'></el-table-column>
    <el-table-column label='员工名称' prop='nemName' min-width='150'></el-table-column>
    <el-table-column label='性别' prop='sex' min-width='100'>
      <template scope="scope">
          <div :style="scope.row.sex != 1 ? 'color: red' : ''" v-html="scope.row.sex == 1 ? '男' : '女'"></div>
      </template>
    </el-table-column>
    <el-table-column label='岗位' prop='jobTypeId' min-width='100'>
      <template scope="scope">
        <template v-for="item in jobTypeOptions" >
            <div v-if="scope.row.jobTypeId == item.id" v-html="item.jobTypeName" v-bind:key="item.id"></div>
        </template>
      </template>
    </el-table-column>
    <el-table-column label='员工工号' prop='nemberId' min-width='100'></el-table-column>
    <el-table-column label='状态' prop='state' min-width='100'>
      <template scope="scope">
          <div :style="scope.row.state != 1 ? 'color: red' : ''" v-html="scope.row.state == 1 ? '有效' : '无效'"></div>
      </template>
    </el-table-column>
    <el-table-column label='所属子站' prop='stationId' min-width='100'>
      <template scope="scope">
        <template v-for="item in stationOptions" >
            <div v-if="scope.row.stationId == item.id" v-html="item.totilName" v-bind:key="item.id"></div>
        </template>
      </template>
    </el-table-column>
    <el-table-column label='创建时间' prop='createTime' min-width='150'></el-table-column>
    <el-table-column label='备注' prop='remark' min-width='100'></el-table-column>
    <el-table-column label="操作" width="150" min-width="250" fixed='right' fit='false' > 
      <template scope="scope">
        <el-button v-if="dtuMemberManager_btn_edit" size="small" type="primary" @click="handleUpdate(scope.row)">编辑
        </el-button>
        <el-button v-if="dtuMemberManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
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
      <el-form-item label="员工名称" prop="nemName">
        <el-input v-model="form.nemName" placeholder="请输入员工名称"></el-input>
      </el-form-item>
      <el-form-item label="员工工号" prop="nemberId">
        <el-input v-model="form.nemberId" placeholder="请输入系统名称"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select class="filter-item" v-model="form.sex" placeholder="请选择">
          <el-option v-for="item in  sexOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="岗位" prop="jobTypeId">
        <el-select class="filter-item" v-model="form.jobTypeId" placeholder="请选择">
          <el-option v-for="item in  jobTypeOptions" :key="item.id" :label="item.jobTypeName" :value="item.id"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="联系电话" prop="mobile">
        <el-input v-model="form.mobile" placeholder="请输入联系电话"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-switch v-model="form.state" on-color="#13ce66" off-color="#ff4949" :on-value="1" :off-value="0" on-text="是" off-text="否">
				</el-switch>
        <!-- <el-input v-model="" placeholder="请选择状态"></el-input> -->
      </el-form-item>
      <el-form-item label="所属子站" prop="stationId">
        <el-select class="filter-item" v-model="form.stationId" placeholder="请选择">
          <el-option v-for="item in  stationOptions" :key="item.id+''" :label="item.totilName" :value="item.id+''"> </el-option>
        </el-select>
        <!-- <el-input v-model="form." placeholder="请选择子站"></el-input> -->
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
  putObj,
  getJobTypeList
} from 'api/things/dtuMember/index';
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
        id: undefined, //
        nemName: undefined, // 姓名
        sex: undefined, // 性别[1男0女]
        jobTypeId: 1, // 岗位类型
        nemberId: undefined, // 工号
        mobile: undefined, // 联系电话
        state: undefined, // 状态[1启用0禁用]
        createTime: undefined, // 创建时间
        remark: undefined, // 备注
        stationId: undefined // 子站
      },
      sexOptions: [{
        value: 1,
        label: '男'
      }, {
        value: 0,
        label: '女'
      }],
      jobTypeOptions: [], // 岗位类型
      stationOptions: [], // 所属子站
      rules: {
        nemName: [
          {
            required: true,
            message: '请输入员工姓名',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          }
        ],
        nemberId: [
          {
            required: true,
            message: '请输入员工工号',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: false,
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
        stationId: [
          {
            required: true,
            message: '请选择子站',
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
            max: 200,
            message: '长度在 1 到 200 个字符',
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
        nemName: undefined, // 员工名称
        nemberId: undefined  // 员工工号
      },
      dialogFormVisible: false,
      dialogStatus: '',
      dtuMemberManager_btn_edit: false,
      dtuMemberManager_btn_del: false,
      dtuMemberManager_btn_add: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0
    }
  },
  created() {
    this.getList();
    this.getJobTypeListAll();
    this.getStationListAll();
    this.dtuMemberManager_btn_edit = this.elements['dtuMemberManager:btn_edit'];
    this.dtuMemberManager_btn_del = this.elements['dtuMemberManager:btn_del'];
    this.dtuMemberManager_btn_add = this.elements['dtuMemberManager:btn_add'];
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
    // 获取岗位类型数据
    getJobTypeListAll() {
      getJobTypeList().then(response => {
        this.jobTypeOptions = response;
      });
    },
    // 获取子站列表
    getStationListAll() {
      getStationList().then(response => {
        this.stationOptions = response;
      });
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
    handleUpdate(row) {
      getObj(row.id)
        .then(response => {
          console.log(JSON.stringify(response));
          this.form = response.data;
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
      console.log(JSON.stringify(this.form));
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
    },
    resetTemp() {
      this.form.id = undefined;//
      this.form.nemName = undefined;// 姓名
      this.form.sex = 1; // 性别[1男0女]
      this.form.jobTypeId = 1; // 岗位
      this.form.nemberId = undefined; // 工号
      this.form.mobile = undefined; // 联系电话
      this.form.state = 1; // 状态[1启用0禁用]
      this.form.createTime = undefined; // 创建时间
      this.form.remark = undefined; // 备注
      this.form.stationId = undefined // 子站
    }
  }
}
</script>

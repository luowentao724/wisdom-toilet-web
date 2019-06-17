<template>

<div class="app-container calendar-list-container">
  <div >
    <el-row>
      <el-collapse style="position: relative;" value='condition' >
        <el-collapse-item title='查询条件' name='condition'>
          <el-form :model='listQuery' :inline='true' class='demo-form-inline' label-width='100px' ref='queryForm'>
            <el-form-item label='规则名称' prop='ruleName'>
              <el-input placeholder="模糊查询" v-model='listQuery.ruleName' @keyup.enter.native="handleFilter"></el-input>
            </el-form-item>
            <el-form-item label='规则说明' prop='remark'>
              <el-input placeholder="模糊查询" v-model='listQuery.remark' @keyup.enter.native="handleFilter"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type='primary' @click='handleFilter' >查询</el-button>
              <el-button @click='cancel("queryForm")'>重置</el-button>
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>
    </el-row>
  </div>

<div class='tab_border'>
  <div class="search_title">列表查询结果</div>
  <div class="button_position">
    <el-button type='primary' v-if="dataRuleManager_btn_clone" class="filter-item" @click="handleClone()" >
      <i class="iconfont">&#xe800;</i> 复制</el-button>

    <importJsonButton :getList="getList" :importUrl="'/api/things/json/importDataRule'"></importJsonButton>

    <el-button type='primary' v-if="dataRuleManager_btn_del" class="filter-item" @click="handleDelete()" icon="delete" >删除</el-button>
    <el-button type='primary' v-if="dataRuleManager_btn_add" class="filter-item" @click="handleCreate('form')" icon="plus" >添加</el-button>

  </div>
  <el-table :key='tableKey' :data="list" v-loading.body="listLoading" @selection-change="handleSelectionChange"   border fit highlight-current-row >
    <el-table-column label="#" type="selection" prop="id"  min-width="30"></el-table-column>
    <el-table-column label='规则名称' prop='ruleName' min-width='100'></el-table-column>
    <el-table-column label='数据展示' min-width='100'>
      <template scope="scope" >
        <div v-html="scope.row.type == 'list' ? '列表展示' : '组态展示'"></div>
      </template>
    </el-table-column>
    <el-table-column label='规则说明' prop='remark' min-width='100'></el-table-column>
    <el-table-column label="操作" min-width="150" fixed='right' fit='false' > 
      <template scope="scope">
        <el-button v-if="dataRuleManager_btn_edit" size="small" type="primary" @click="handleUpdate(scope.row)">编辑
        </el-button>
        <el-button v-if="dataRuleManager_btn_realData" size="small" type="primary" @click="handleRealData(scope.row)">实时数据
        </el-button>
        <el-button v-if="dataRuleManager_btn_readData" size="small" type="primary" @click="handleReadData(scope.row)">读写数据
        </el-button>
        <el-button v-if="dataRuleManager_btn_configuration" size="small" type="primary" @click="handleConfiguration(scope.row)">画面组态
        </el-button>
        <exportJsonButton v-if="dataRuleManager_btn_report" :jsonData="scope.row" :jsonName="'数据规则('+ scope.row.ruleName+')'"></exportJsonButton>
      </template>
    </el-table-column>
  </el-table>
  <el-row type='flex' justify='end' class="pagination-container">
      <el-pagination :page-sizes='[10, 20, 50, 100]' :page-size='listQuery.limit' layout='prev,pager,next,jumper,total,sizes' :total='total' :current-page.sync='listQuery.page' @current-change='handleCurrentChange' @size-change='handleSizeChange'>
      </el-pagination>
  </el-row>
</div>

  <!--  新增和编辑数据规则模态框  -->
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false" size="small">
    <el-form :model="form" :rules="rules" ref="form" label-width="150px">
      <el-form-item label="规则名称" prop="ruleName">
        <el-input v-model="form.ruleName" placeholder="请输入规则名称"></el-input>
      </el-form-item>
      <el-form-item label="数据展示" prop="type">
        
        <el-radio-group v-model="form.type">
          <el-radio :label="'list'">列表展示</el-radio>
          <el-radio :label="'group'">组态展示</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="规则说明" prop="remark">
        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}" placeholder="请输入规则说明" v-model="form.remark"> </el-input>
      </el-form-item>
      <el-form-item label="显示功能" >
        <el-checkbox :true-label="'show'"	:false-label="'hide'" v-model="form.realtime">实时数据</el-checkbox>
        <el-checkbox :true-label="'show'"	:false-label="'hide'" v-model="form.readBtn">数据读写</el-checkbox>
        <el-checkbox :true-label="'show'"	:false-label="'hide'" v-model="form.history">历史数据</el-checkbox>
        <el-checkbox :true-label="'show'"	:false-label="'hide'" v-model="form.alarm">报警记录</el-checkbox>
      </el-form-item>
      <el-form-item label="消息推送" prop="factory">
        <el-checkbox :true-label="1"	:false-label="0" v-model="form.managePush">推送管理账号</el-checkbox>
        <el-checkbox :true-label="1"	:false-label="0" v-model="form.ordinaryPush">推送普通账号</el-checkbox>
      </el-form-item>
      <el-form-item label="通讯故障检测" prop="fault">
        <el-radio v-model="form.fault" label="open">开启</el-radio>
        <el-radio v-model="form.fault" label="close">关闭</el-radio>
      </el-form-item>
      <el-form-item label="通讯故障滤波(次)" prop="times">
        <el-input-number v-model="form.times" :min="1" :max="300"></el-input-number>
      </el-form-item>
      <el-form-item label="实时数据" prop="ordinaryRealtime">
        <el-radio v-model="form.ordinaryRealtime" :label="1">普通账号显示</el-radio>
        <el-radio v-model="form.ordinaryRealtime" :label="0">普通账号隐藏</el-radio>
      </el-form-item>
      <el-form-item label="数据读写" prop="ordinaryReadBtn">
        <el-radio v-model="form.ordinaryReadBtn" :label="1">普通账号显示</el-radio>
        <el-radio v-model="form.ordinaryReadBtn" :label="0">普通账号隐藏</el-radio>
      </el-form-item>
      <el-form-item label="历史数据" prop="ordinaryHistory">
        <el-radio v-model="form.ordinaryHistory" :label="1">普通账号显示</el-radio>
        <el-radio v-model="form.ordinaryHistory" :label="0">普通账号隐藏</el-radio>
      </el-form-item>
      <el-form-item label="报警记录" prop="ordinaryAlarm">
        <el-radio v-model="form.ordinaryAlarm" :label="1">普通账号显示</el-radio>
        <el-radio v-model="form.ordinaryAlarm" :label="0">普通账号隐藏</el-radio>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel('form')">取 消</el-button>
      <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
      <el-button v-else type="primary" @click="update('form')">确 定</el-button>
    </div>
  </el-dialog>

  <el-dialog  :title="'实时数据列表('+form.ruleName+')'" :visible.sync="dialogFormVisibleRealtime" :close-on-click-modal="false" size="small">
    <dataRuleRealtime :dataRuleId="dataRuleId"   ></dataRuleRealtime>
  </el-dialog>

  <el-dialog  :title="'读写数据列表('+form.ruleName+')'" :visible.sync="dialogFormVisibleRead" :close-on-click-modal="false" size="small">
    <dataRuleRead :dataRuleId="dataRuleId"   ></dataRuleRead>
  </el-dialog>

</div>
</template>
<script>
import {
  page,
  addObj,
  getObj,
  delObj,
  deleteIds,
  putObj,
  cloneDataRuleIds
} from 'api/things/dataRule/index';
import { getObjId, getSystemDictType } from 'api/pubThings';
import dataRuleRealtime from './dataRuleRealtime.vue'
import dataRuleRead from './dataRuleRead.vue'
import exportJsonButton from 'components/Json/export.vue';
import importJsonButton from 'components/Json/import.vue';
import { mapGetters } from 'vuex';
export default {
  name: 'user',
  components: {
    dataRuleRealtime,
    dataRuleRead,
    exportJsonButton,
    importJsonButton
  },
  data() {
    return {
      dataRuleId: null, // 当前数据规则id
      exportDataRuleJson: {},
      form: {
        id: null, // int(11) NOT NULL
        ruleName: null, // varchar(255) NOT NULL规则名称
        type: 'list', // varchar(20) NULL数据展示[list列表group组态]
        remark: null, // varchar(255) NULL规则说明
        realtime: 'show', // varchar(20) NOT NULL实时数据[show显示hide隐藏]
        readBtn: 'show', // varchar(20) NOT NULL数据读写[show显示hide隐藏]
        history: 'show', // varchar(20) NOT NULL历史数据[show显示hide隐藏]
        alarm: 'show', // varchar(20) NOT NULL报警记录[show显示hide隐藏]
        push: null, // varchar(20) NOT NULL消息推送
        managePush: 1, // NULL消息推送管理账号(0:不推送 1推送)
        ordinaryPush: 1, // tinyint(3) NULL消息推送普通账号(0:不推送 1推送)
        fault: 'close', // varchar(20) NOT NULL通讯故障检测[close关闭open开启]
        createTime: null, // datetime(11) NOT NULL创建时间
        times: 3, // int(11) NOT NULL通讯故障滤波(次)
        ordinaryRealtime: 1, // 实时数据普通账号 (0隐藏数据 1显示数据)
        ordinaryReadBtn: 1, // 数据读写普通账号 (0隐藏数据 1显示数据)
        ordinaryHistory: 1, // 历史数据普通账号 (0隐藏数据 1显示数据)
        ordinaryAlarm: 1 // 报警记录普通账号 (0隐藏数据 1显示数据)
      },
      rules: {
        ruleName: [
          {
            required: true,
            message: '请输入规则名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 225,
            message: '长度在 1 到 225 个字符',
            trigger: 'blur'
          }
        ]
      },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        ruleName: undefined, // 规则名称
        remark: undefined // 规则描述
      },
      dialogFormVisible: false,
      dialogFormVisibleRealtime: false, // 实时数据dialog
      dialogFormVisibleRead: false, // 读写数据dialog
      dialogStatus: '',
      selectionData: [], // 当前选中的 表格数据
      dataRuleManager_btn_view: false,
      dataRuleManager_btn_add: false,
      dataRuleManager_btn_edit: false,
      dataRuleManager_btn_del: false,
      dataRuleManager_btn_clone: false,
      dataRuleManager_btn_realData: false,
      dataRuleManager_btn_readData: false,
      dataRuleManager_btn_configuration: false,
      dataRuleManager_btn_report: false,
      dataRuleManager_btn_import: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0
    }
  },
  created() {
    this.setSystemDictType();
    this.getList();
    this.dataRuleManager_btn_view = this.elements['dataRuleManager:btn_view'];
    this.dataRuleManager_btn_add = this.elements['dataRuleManager:btn_add'];
    this.dataRuleManager_btn_edit = this.elements['dataRuleManager:btn_edit'];
    this.dataRuleManager_btn_del = this.elements['dataRuleManager:btn_del'];
    this.dataRuleManager_btn_clone = this.elements['dataRuleManager:btn_clone'];
    this.dataRuleManager_btn_realData = this.elements['dataRuleManager:btn_realData'];
    this.dataRuleManager_btn_readData = this.elements['dataRuleManager:btn_readData'];
    this.dataRuleManager_btn_configuration = this.elements['dataRuleManager:btn_configuration'];
    this.dataRuleManager_btn_report = this.elements['dataRuleManager:btn_report'];
    this.dataRuleManager_btn_import = this.elements['dataRuleManager:btn_import'];
  },
  computed: {
    ...mapGetters([
      'elements',
      'username',
      'userId'
    ])
  },
  methods: {
    // 获取厂商
    setSystemDictType() {
      getSystemDictType({ typeName: 'FACTORY_OWNER' }).then(response => {
        this.factoryOptions = response;
      });
    },
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
    // 表格多选框
    handleSelectionChange(val) {
      this.selectionData = val;
      console.log(val);
    },
    handleCreate() {
      getObjId().then(response => {
        console.log(response);
        this.form = {
          id: response.data, // int(11) NOT NULL
          ruleName: null, // varchar(255) NOT NULL规则名称
          type: 'list', // varchar(20) NULL数据展示[list列表group组态]
          remark: null, // varchar(255) NULL规则说明
          realtime: 'show', // varchar(20) NOT NULL实时数据[show显示hide隐藏]
          readBtn: 'show', // varchar(20) NOT NULL数据读写[show显示hide隐藏]
          history: 'show', // varchar(20) NOT NULL历史数据[show显示hide隐藏]
          alarm: 'show', // varchar(20) NOT NULL报警记录[show显示hide隐藏]
          managePush: 1, // NULL消息推送管理账号(0:不推送 1推送)
          ordinaryPush: 1, // tinyint(3) NULL消息推送普通账号(0:不推送 1推送)
          fault: 'close', // varchar(20) NOT NULL通讯故障检测[close关闭open开启]
          createTime: null, // datetime(11) NOT NULL创建时间
          times: 3, // int(11) NOT NULL通讯故障滤波(次)
          ordinaryRealtime: 1, // 实时数据普通账号 (0隐藏数据 1显示数据)
          ordinaryReadBtn: 1, // 数据读写普通账号 (0隐藏数据 1显示数据)
          ordinaryHistory: 1, // 历史数据普通账号 (0隐藏数据 1显示数据)
          ordinaryAlarm: 1 // 报警记录普通账号 (0隐藏数据 1显示数据)
        }
        console.log(this.form)
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
      }).catch(err => {
        throw err;
      });
    },
    handleUpdate(row) {
      this.form = Object.assign({}, row);
      this.dialogFormVisible = true;
      this.dialogStatus = 'update';
    },
    create(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          // this.form.createMan = this.userId;
          // console.log(JSON.stringify(this.form))
          addObj(this.form).then(() => {
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
    update(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
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
    handleDelete(row) {
      if (!this.selectionData || this.selectionData.length == 0) {
        this.$notify({
          title: '提示',
          message: '请选择数据规则',
          type: 'warning',
          duration: 2000
        });
        return;
      }
      this.$confirm('请谨慎删除, 如存在子站绑定该规则,可能造成设备的数据无法正常显示?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let dataRuleIds = '';
        this.selectionData.map((item, index) => {
          dataRuleIds += item.id + ',';
        });
        dataRuleIds = dataRuleIds.substring(0, dataRuleIds.length - 1);
        deleteIds({ ids: dataRuleIds }).then(response => {
          if (response.status == 500) {
            this.$notify({
              title: '失败',
              message: response.message,
              type: 'error',
              duration: 2000
            });
          } else {
            // this.getList();
            this.selectionData.map(item => {
              const index = this.list.indexOf(item);
              this.list.splice(index, 1);
            });
            this.selectionData = [];
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            });
          }
        });
      });
    },
    cancel(formName) {
      this.dialogFormVisible = false;
      this.$refs[formName].resetFields();
      if (formName === 'queryForm') {
        this.getList();
      }
    },
    // -------------- 实时数据相关方法区 ----------------
    // 实时数据
    handleRealData(row) {
      this.form = Object.assign({}, row);
      this.dataRuleId = row.id;
      this.dialogFormVisibleRealtime = true;
    },
    // -------------- 读写数据相关方法区 ----------------
    // 读写数据
    handleReadData(row) {
      this.form = Object.assign({}, row);
      this.dataRuleId = row.id;
      this.dialogFormVisibleRead = true;
    },
    // 复制数据规则
    handleClone() {
      if (!this.selectionData || this.selectionData.length == 0) {
        this.$notify({
          title: '提示',
          message: '请选择数据规则',
          type: 'warning',
          duration: 2000
        });
        return;
      }
      this.$confirm('规则中存在1.0版本的组态控件，是否继续复制？如果继续，1.0版本的组态控件将无法复制到新规则中。如果取消，您可以将规则改为组态展示，然后升级页面版本。?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let dataRuleIds = '';
        this.selectionData.map((item, index) => {
          dataRuleIds += item.id + ',';
        });
        dataRuleIds = dataRuleIds.substring(0, dataRuleIds.length - 1);
        cloneDataRuleIds({ ids: dataRuleIds }).then(response => {
          if (response.status == 500) {
            this.$notify({
              title: '失败',
              message: response.message,
              type: 'error',
              duration: 2000
            });
          } else {
            this.getList();
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            });
          }
        });
      });
    },
    // -------------- 画面组态相关方法区 ----------------
    // 画面组态
    handleConfiguration() {

    },

    // 导出数据规则
    handleReport(row) {
      const excelArr = [
        {
          title: '数据规则',
          header: [
            { key: 'id', label: '主键' },
            { key: 'ruleName', label: '规则名称' },
            { key: 'type', label: '数据展示[list列表group组态]' },
            { key: 'remark', label: '规则说明' },
            { key: 'realtime', label: '实时数据[show显示hide隐藏]' },
            { key: 'readBtn', label: '数据读写[show显示hide隐藏]' },
            { key: 'history', label: '历史数据[show显示hide隐藏]' },
            { key: 'alarm', label: '报警记录[show显示hide隐藏]' },
            { key: 'managePush', label: '消息推送管理账号(0:不推送 1推送)' },
            { key: 'ordinaryPush', label: '消息推送管理账号(0:不推送 1推送)' },
            { key: 'managePush', label: '消息推送普通账号(0:不推送 1推送)' },
            { key: 'fault', label: '通讯故障检测[close关闭open开启]' },
            { key: 'createTime', label: '创建时间' },
            { key: 'times', label: '通讯故障滤波(次)' },
            { key: 'ordinaryRealtime', label: '实时数据普通账号 (0隐藏数据 1显示数据)' },
            { key: 'ordinaryReadBtn', label: '数据读写普通账号 (0隐藏数据 1显示数据)' },
            { key: 'ordinaryHistory', label: '历史数据普通账号 (0隐藏数据 1显示数据)' },
            { key: 'ordinaryAlarm', label: '报警记录普通账号 (0隐藏数据 1显示数据)' }
            // '主键', '规则名称', '数据展示[list列表group组态]', '实时数据[show显示hide隐藏]', '数据读写[show显示hide隐藏]', '历史数据[show显示hide隐藏]', '报警记录[show显示hide隐藏]', '消息推送管理账号(0:不推送 1推送)', '消息推送普通账号(0:不推送 1推送)', '通讯故障检测[close关闭open开启]', '创建时间', '通讯故障滤波(次)', '实时数据普通账号 (0隐藏数据 1显示数据)', '数据读写普通账号 (0隐藏数据 1显示数据)', '历史数据普通账号 (0隐藏数据 1显示数据)', '报警记录普通账号 (0隐藏数据 1显示数据)'
          ],
          rows: this.list
        }
      ];
      excelExport(excelArr).then(response => {
        console.log(response);
      }).catch(e => {
        debugger;
        console.log(e)
      })
    },

    handleImport() {
      this.dataRuleListLoading = true;
    }

  }

}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>

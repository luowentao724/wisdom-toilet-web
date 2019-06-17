<template>
    <div class='tab_border'>
      <div class="search_title">列表查询结果</div>
      <div class="button_position">
        <el-button type="primary" size="large" @click="handleCreate" ><i class="el-icon-warning el-icon--left"></i>添加故障</el-button>
        <exportButton
          :excelData="list" 
          :tHeader="['报警id', '报警类型', 'DTU名称', 'DTU标识码', '报警时间', '短信通知0未通知1已通知', '邮件通知0未通知1已通知']" 
          :filterVal="['alarmId', 'alarmTypeName', 'totilName', 'totilId', 'alarmTime', 'sms', 'email']" 
        ></exportButton>
      </div>
      <el-table :key='tableKey' :data="list" v-loading.body="listLoading"  border fit highlight-current-row >
      <el-table-column label="#" type='index' width='70'></el-table-column>
      <!-- <el-table-column label="#" type="selection" min-width="30"></el-table-column> -->
      <el-table-column label='报警类型' prop='alarmTypeName' min-width='150'></el-table-column>
      <el-table-column label='DTU名称' prop='totilName' min-width='100'></el-table-column>
      <el-table-column label='DTU标识码' prop='totilId' min-width='100'></el-table-column>
      <el-table-column label='报警时间' prop='alarmTime' min-width='100'></el-table-column>
      <el-table-column label='短信通知' prop='sms' min-width='100'>
      <template scope="scope">
        <div :style="scope.row.sms != 1 ? 'color: red' : ''" v-html="scope.row.sms == 1 ? scope.row.smsPhone : '未发送'"></div>
      </template>
    </el-table-column>
    <el-table-column label='邮件通知' prop='email' min-width='100'>
      <template scope="scope">
        <div :style="scope.row.email != 1 ? 'color: red' : ''" v-html="scope.row.email == 1 ? scope.row.emailAddress : '未发送'"></div>
      </template>
    </el-table-column>
    <el-table-column v-if="!!listQuery.status" label='处理时间' prop='fixTime' min-width='100'></el-table-column>
    <el-table-column v-if="!!listQuery.status" label='处理人' prop='fixUserName' min-width='100'></el-table-column>
    <el-table-column v-if="!!listQuery.status" label='处理方式' prop='fixTypeName' min-width='100'></el-table-column>
    <el-table-column label="操作" width="150" fixed="right"  > 
      <template scope="scope">
        <el-button v-if="alarmManager_btn_edit && !listQuery.status" size="small" type="primary" @click="handleUpdate(scope.row)">处理
        </el-button>
        <el-button v-else size="small" type="primary" @click="handleDetail(scope.row)">详情
        </el-button>
      </template> 
    </el-table-column>
  </el-table>
  <el-row type='flex' justify='end' class="pagination-container">
      <el-pagination :page-sizes='[10, 20, 50, 100]' :page-size='listQuery.limit' layout='prev,pager,next,jumper,total,sizes' :total='total' :current-page.sync='listQuery.page' @current-change='handleCurrentChange' @size-change='handleSizeChange'>
      </el-pagination>
  </el-row>

  <el-dialog :title="'处理报警'" :visible.sync="dialogFormVisible">
    <el-form :model="fixForm" :rules="fixRules" ref="form" label-width="100px">
      <el-form-item label="处理方式" prop="fixType">
        <el-select class="filter-item" v-model="fixForm.fixType" placeholder="请选择">
          <el-option v-for="item in fixTypeOption" :key="item.dictId" :label="item.dictName" :value="item.dictId"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述信息" prop="fixDescn">
        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}" placeholder="请输入描述信息" v-model="fixForm.fixDescn"> </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel('form')">取 消</el-button>
      <el-button type="primary" @click="update('form')">确 定</el-button>
    </div>
  </el-dialog>

  <el-dialog title="新增报警" :visible.sync="dialogEditFormVisible">
    <el-form :model="editForm" :rules="editFormRules"  label-width="150px" ref="editForm">
      <el-form-item label="故障类型" >
        <span >其他故障类型</span>
      </el-form-item>
      <el-form-item label="处理人" prop="fixUserName">
        <el-input v-model="editForm.fixUserName"></el-input>
      </el-form-item>
      <el-form-item label="处理时间" prop="fixTime">
         <el-date-picker
          v-model="editForm.fixTime"
          @change="clickFixDateTime"
          type="datetime"
          placeholder="选择日期"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="备注(故障现象,原因分析,解决方法,结果)" prop="descn">
        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}" v-model="editForm.descn"> </el-input>
      </el-form-item>
      <el-form-item label="发送短信" >
        <el-radio-group v-model="editForm.sms">
          <el-radio :label="1" >是</el-radio>
          <el-radio :label="0" >否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="发送邮件" >
        <el-radio-group v-model="editForm.email">
          <el-radio :label="1" >是</el-radio>
          <el-radio :label="0" >否</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel('editForm')">取 消</el-button>
      <el-button type="primary" @click="create('editForm')">确 定</el-button>
    </div>
  </el-dialog>

  <el-dialog title="报警详情信息" :visible.sync="dialogDetailFormVisible">
    <el-form :model="form"  label-width="150px">
      <el-form-item label="故障类型" prop="alarmType">
        <el-input v-model="form.alarmType" disabled ></el-input>
      </el-form-item>
      <el-form-item label="报警时间" prop="alarmTime">
        <el-input v-model="form.alarmTime" disabled ></el-input>
      </el-form-item>
      <el-form-item label="短信" prop="sms">
        <div :style="form.sms != 1 ? 'color: red' : ''" v-html="form.sms == 1 ? form.smsPhone : '未发送'"></div>
      </el-form-item>
      <el-form-item label="邮件" prop="email">
         <div :style="form.email != 1 ? 'color: red' : ''" v-html="form.email == 1 ? form.emailAddress : '未发送'"></div>
      </el-form-item>
      <el-form-item label="处理人" prop="fixUserName">
        <el-input v-model="form.fixUserName" disabled></el-input>
      </el-form-item>
      <el-form-item label="处理方式" prop="fixType">
        <el-input v-model="form.fixType" disabled></el-input>
      </el-form-item>
      <el-form-item label="处理时间" prop="stationId">
        <el-input v-model="form.fixTime" disabled></el-input>
      </el-form-item>
      <el-form-item label="备注(故障现象,原因分析,解决方法,结果)">
        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}" v-model="form.remarkValue"> </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogDetailFormVisible = false">关闭</el-button>
    </div>
  </el-dialog>


</div>
</template>
<script>
import { searchPage, putObj, addObj } from 'api/things/alarm/index';
import { getObjId, getSystemDictType } from 'api/pubThings';
import util from 'utils/util.js';
import exportButton from 'components/Excel/export.vue';
import { mapGetters } from 'vuex';
export default {
  name: 'alarm',
  props: {
    // 子站Id
    listQuery: {
      type: Object
    }
  },
  watch: {
        // 观察option的变化
    listQuery: {
      handler(newVal, oldVal) {
        this.getList();
      },
      deep: true // 对象内部属性的监听，关键。
    }
  },
  data() {
    return {
      // --------------- 处理报警所需数据 -------------
      fixTypeOption: [], // 处理方式数组
      fixForm: {
        alarmId: undefined,
        fixType: undefined, // 处理方式
        fixDescn: undefined // 处理描述
      },
      fixRules: {
        fixDescn: [
          {
            required: true,
            message: '请输入处理描述',
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
      // ------------ 新增报警所需数据 ------------------------
      dialogEditFormVisible: false, // 新增模态框显示状态
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      editForm: {
        alarmId: null, // 报警id
        dtuId: null, // 子站(公厕)id
        alarmType: 1, // 报警类型
        alarmContent: null, // 用于发生邮件等的报警内容
        alarmTime: null, // 报警时间
        createTime: null, // 创建时间
        descn: null, // 详细信息
        fixType: null, // 处理方式
        fixTime: null, // 处理时间
        fixTescn: null, // 描述信息
        fixUserId: null, // 处理人id
        fixUserName: null, // 处理人姓名
        smsCount: null, // NOT NULL
        sms: 1, // 短信通知标识
        smsPhone: null, // 手机号
        email: 1, // 邮件通知标识
        emailAddress: null, // 邮件地址
        alarmPacket: null, // NULL
        status: 0 // NOT NULL状态[1竣工0未竣工]
      },
      editFormRules: {
        alarmType: [
          {
            required: true,
            message: '请选择报警类型',
            trigger: 'blur'
          }
        ],
        fixUserName: [
          {
            required: true,
            message: '请输入处理人',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 64,
            message: '长度在 1 到 64个字符',
            trigger: 'blur'
          }
        ],
        fixTime: [
          {
            required: true,
            message: '请选择处理时间',
            trigger: 'blur'
          }
        ],
        descn: [
          {
            required: true,
            message: '请输入备注',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 256,
            message: '长度在 256 到 256 个字符',
            trigger: 'blur'
          }
        ]
      },
      // ------------------------------------------------------
      list: null,
      total: null,
      listLoading: false,
      tableKey: 0,
      dialogDetailFormVisible: false, // 控制详情模态框是否显示
      dialogFormVisible: false, // 控制处理模态框是否显示
      form: {}, // 显示详情信息
      excelData: [], // Excel 表格数据
      // ------- 权限控制数据 -----------
      alarmManager_btn_edit: false,
      alarmManager_btn_add: false
    }
  },
  created() {
    this.alarmManager_btn_edit = this.elements['alarmManager:btn_edit'];
    this.alarmManager_btn_add = this.elements['alarmManager:btn_add'];
    console.log(this.alarmManager_btn_edit);
    this.getList();
    this.setSystemDictType();
  },
  computed: {
    ...mapGetters([
      'elements',
      'username',
      'userId'
    ])
  },
  components: {
    exportButton
  },
  methods: {
    // 获取处理方式
    setSystemDictType() {
      getSystemDictType({ typeName: 'FIX_TYPE' }).then(response => {
        this.fixTypeOption = response;
        console.log(response)
      })
    },
    getList() {
      this.listLoading = true;
      searchPage(this.listQuery)
        .then(response => {
          // console.log(JSON.stringify(response.data.rows));
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
    // 显示报警详情信息
    handleDetail(row) {
      this.dialogDetailFormVisible = true;
      this.form = row;
      this.form.remarkValue = (row.descn ? row.descn + ',' : '') + (row.remark ? row.remark + ',' : '') + (row.fixDescn ? row.fixDescn : '');
    },
    resetTemp() {
      this.fixForm.id = undefined; // id
      this.fixForm.fixType = undefined; // 处理方式
      this.fixForm.fixDescn = undefined; // 处理描述
    },
    // 设置报警处理时间
    clickFixDateTime(val) {
      this.editForm.fixTime = val;
    },
    handleCreate() {
      this.dialogEditFormVisible = true;
      getObjId().then(response => {
        this.editForm.alarmId = response.data;
        this.editForm.dtuId = this.listQuery.dtuId;
      }).catch(err => {
        throw err;
      });
    },
    create(formName) {
      console.log(JSON.stringify(this.editForm))
      addObj(this.editForm).then(() => {
        this.getList();
        this.cancel(formName);
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        });
      });
    },
    handleUpdate(row) {
      this.fixForm.alarmId = row.alarmId;
      this.fixForm.fixType = '1';
      this.fixForm.fixDescn = '';
      this.dialogFormVisible = true;
    },
    update(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          this.fixForm.status = '1';
          this.fixForm.fixUserId = this.userId; // 处理人id
          this.fixForm.fixUserName = this.username; // 处理人姓名
          this.fixForm.fixTime = util.formatTimestampValue(new Date());
          putObj(this.fixForm.alarmId, this.fixForm).then(() => {
            this.dialogFormVisible = false;
            this.resetTemp();
            this.getList();
            this.$notify({
              title: '成功',
              message: '处理成功',
              type: 'success',
              duration: 2000
            });
          });
        } else {
          return false;
        }
      });
    },
    cancel(formName) {
      this.dialogFormVisible = false;
      this.dialogEditFormVisible = false;
      this.$refs[formName].resetFields();
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

</style>

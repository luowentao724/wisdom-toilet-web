<template>
<div class="app-container calendar-list-container">
  <div >
    <el-row>
          <el-form :model='listQuery' :inline='true' class='demo-form-inline' ref='queryForm'>
            <el-form-item label='数据名称' prop='systemDictId'>
              <el-select v-model="listQuery.systemDictId" filterable clearable @change="handleFilter" placeholder="请选择">
                <el-option
                  v-for="item in systemDictOptions"
                  :key="item.id"
                  :label="item.dictName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type='primary' @click='handleFilter' >查询</el-button>
            </el-form-item>
          </el-form>
    </el-row>
  </div>

<div class='tab_border'>
  <div class="search_title">列表查询结果</div>
  <div class="button_position">
    <el-button type='primary' class="filter-item" icon="arrow-up" @click="handleUpMove()" >上移</el-button>
      <el-button type='primary' class="filter-item" icon="arrow-down" @click="handleDownMove()" >下移</el-button>
    <el-button type='primary' class="filter-item" @click="handleDelete()" icon="delete" >删除</el-button>
    <exportButton
          :excelName="'数据规则读写数据'"
          :excelData="list"
          :tHeader="['主键','数据规则id','实时数据类型(关联系统字典表的 id 字段)','从站地址','功能码(5,6,16. 5.写单个线圈 6单个寄存器 16多个寄存器)'
    ,'寄存器地址','数据类型(short:16位整型(有符号),unshort:16位整型(无符号),int:32位整型(有符号),unint:32位整型(无符号),float:浮点型,bit:开关量)','解码顺序','数据单位','换算系数','输入上限','输入下限','0 对应的内容 开关量对应','1 对应的内容 开关量对应','图片地址','创建时间','排序字段','数据名称']" 
          :filterVal="['id','dataRuleId','systemDictId','subStationAddr','functionCode','registerAddr','dataType','decodeFlag','dataUnit','ratioExchange','inputTopLimit','inputLowLimit','contentZero','contentOne','picAddr','createTime','dataOrderby','dictName']" 
        ></exportButton>

    <importButton :getList="getList" :dataRuleId="dataRuleId" :importUrl="'/api/things/excel/importDataRuleRead'" ></importButton>

    <el-button type='primary' class="filter-item" @click="handleCreate('form')" icon="plus" >添加</el-button>
  </div>
  <el-table :key='tableKey' :data="list" v-loading.body="listLoading" @selection-change="handleSelectionChange"   border fit highlight-current-row >
    <el-table-column label="#" type="selection" prop="id"  min-width="30"></el-table-column>
    <el-table-column label='数据名称' prop='dictName' min-width='100'></el-table-column>
    <el-table-column label='从站地址' prop='subStationAddr' min-width='100'></el-table-column>
    <el-table-column label='功能码' prop='functionCode' min-width='100'>
      <template scope="scope">
        <template v-for="item in functionCodeOptions" >
            <div v-if="scope.row.functionCode == item.id" v-html="item.value" v-bind:key="item.id"></div>
        </template>
      </template>
    </el-table-column>
    <el-table-column label='寄存器地址' prop='registerAddr' min-width='100'></el-table-column>
    <el-table-column label='数据类型' prop='dataType' min-width='100'>
      <template scope="scope">
        <template v-for="item in tableDataTypeOptions" >
            <div v-if="scope.row.dataType == item.id" v-html="item.value" v-bind:key="item.id"></div>
        </template>
      </template>
    </el-table-column>
    <el-table-column label="操作" min-width="70" fixed='right' fit='false' > 
      <template scope="scope">
        <el-button size="small" type="primary" @click="handleUpdate(scope.row)">编辑
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-row type='flex' justify='end' class="pagination-container">
      <el-pagination :page-sizes='[10, 20, 50, 100]' :page-size='listQuery.limit' layout='prev,pager,next,jumper,total,sizes' :total='total' :current-page.sync='listQuery.page' @current-change='handleCurrentChange' @size-change='handleSizeChange'>
      </el-pagination>
  </el-row>
</div>

  <!--  新增和编辑数据规则实时数据模态框  -->
  <el-dialog :title="'读写数据属性'" :visible.sync="dialogFormVisibleRealData" :modal="false" size="small">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
      <el-row :gutter="2">
        <el-col :span="12">
          <el-form-item label="选择图片" prop="picAddr">
            <!-- <el-upload
            class="avatar-uploader"
            :action="this.file.uploadFileUrl"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="form.systemLogo" :src="form.systemLogo" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload> -->
            <el-input v-model="form.picAddr" placeholder="请输入图片地址"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="2">
        <el-col :span="12">
          <el-form-item label="数据名称" prop="systemDictId">
            <el-select v-model="form.systemDictId" filterable placeholder="请选择">
              <el-option
                v-for="item in systemDictOptions"
                :key="item.id"
                :label="item.dictName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="从站地址" prop="subStationAddr">
            <el-input v-model="form.subStationAddr"  placeholder="Modbus从站"></el-input>
          </el-form-item>
        </el-col>
      </el-row >

      <el-row :gutter="2">
        <el-col :span="12">
          <el-form-item label="功能码" prop="functionCode">
            <el-select v-model="form.functionCode" @change="changeFunctionCode" clearable placeholder="请选择">
              <el-option
                v-for="item in functionCodeOptions"
                :key="item.id"
                :label="item.value"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="数据类型" prop="dataType">
              <el-select v-model="form.dataType" @change="changeDataType"  clearable placeholder="请选择">
                <el-option
                  v-for="item in dataTypeOptions"
                  :key="item.id"
                  :label="item.value"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
        </el-col>
      </el-row>
      
      <template   >
        <el-row :gutter="2">
          <el-col :span="12" v-if="form.functionCode == '6' || form.functionCode == '16' " >
            <el-form-item label="解码顺序" prop="decodeFlag">
              <el-select v-model="form.decodeFlag" @change="changeDecodeFlag" clearable placeholder="请选择">
                <el-option
                  v-for="item in decodeFlagOptions"
                  :key="item.id"
                  :label="item.value"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="寄存器地址" prop="registerAddr">
              <el-input v-model="form.registerAddr"  placeholder="请输入寄存器地址"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="2"  v-if="form.functionCode == '5'" >
          <el-col :span="12">
            <el-form-item label="0对应的内容" prop="contentZero" >
              <el-input v-model="form.contentZero" placeholder="当数据为0时对应显示内容,如开,关......"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="1对应的内容" prop="contentOne">
              <el-input v-model="form.contentOne" placeholder="当数据为1时对应显示内容,如开,关......"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="form.functionCode == '6' || form.functionCode == '16' " :gutter="2">
          <el-col :span="12">
            <el-form-item label="换算系数" prop="ratioExchange">
              <el-input v-model="form.ratioExchange" placeholder="请输入换算系数"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位" prop="dataUnit">
              <el-input v-model="form.dataUnit" placeholder="请输入单位"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="2" v-if="form.functionCode == '6' || form.functionCode == '16' " >
          <el-col :span="12">
            <el-form-item label="输入上限" prop="inputTopLimit">
              <el-input v-model="form.inputTopLimit" placeholder="输入上限"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="输入下限" prop="inputLowLimit">
              <el-input v-model="form.inputLowLimit" placeholder="输入下限"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
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
  deleteIds,
  putObj,
  updateHandleUpMove,
  updateHandleDownMove
} from 'api/things/dataRuleRead/index';
import { getObjId, getSystemDictType } from 'api/pubThings';
import exportButton from 'components/Excel/export.vue';
import importButton from 'components/Excel/import.vue';
import { mapGetters } from 'vuex';
export default {
  name: 'user',
  props: {
    dataRuleId: {
      type: String
    }
  },
  components: {
    exportButton,
    importButton
  },
  data() {
    return {
      systemDictOptions: [], // 数据名称
      functionCodeOptions: [
        {
          id: '5',
          value: '05:写单个线圈'
        },
        {
          id: '6',
          value: '06:写单个寄存器'
        },
        {
          id: '16',
          value: '16:写多个寄存器'
        }
      ], // 数据leix
      dataTypeOptions: [
      ], // 数据类型
      tableDataTypeOptions: [
        {
          id: 'bit',
          value: '开关量'
        },
        {
          id: 'short',
          value: '16位整型(有符号)'
        },
        {
          id: 'unshort',
          value: '16位整型(无符号)'
        },
        {
          id: 'int',
          value: '32位整型(有符号)'
        },
        {
          id: 'unint',
          value: '32位整型(无符号)'
        },
        {
          id: 'float',
          value: '浮点型'
        }
      ], // table 表格数据类型所需option
      dataTypeOneOptions: [
        {
          id: 'bit',
          value: '开关量'
        }
      ],
      dataTypeTwoOptions: [
        {
          id: 'short',
          value: '16位整型(有符号)'
        },
        {
          id: 'unshort',
          value: '16位整型(无符号)'
        }
      ],
      dataTypeThreeOptions: [
        {
          id: 'int',
          value: '32位整型(有符号)'
        },
        {
          id: 'unint',
          value: '32位整型(无符号)'
        },
        {
          id: 'float',
          value: '浮点型'
        }
      ], // 解码顺序
      decodeFlagOptions: [], // 解码顺序
      decodeFlagOneOptions: [
        {
          id: '12',
          value: '12'
        },
        {
          id: '21',
          value: '21'
        }
      ],
      decodeFlagTwoOptions: [
        {
          id: '1234',
          value: '1234'
        },
        {
          id: '2143',
          value: '2143'
        },
        {
          id: '3412',
          value: '3412'
        },
        {
          id: '4321',
          value: '4321'
        }
      ],
      form: {
        id: null, // bigint(25) NOT NULL
        dataRuleId: null, // bigint(25) NOT NULL数据规则id
        systemDictId: null, // bigint(255) NOT NULL实时数据类型(关联系统字典表的 id 字段)
        subStationAdd: null, // rvarchar(255) NOT NULL从站地址
        functionCode: null, // varchar(255) NULL功能码(1,2,3. 1.写单个线圈 2单个寄存器 3多个寄存器
        registerAddr: null, // varchar(255) NULL寄存器地址
        dataType: null, // varchar(11) NULL数据类型
        decodeFlag: null, // varchar(11) NULL解码顺序
        dataUnit: null, // varchar(20) NULL单位
        ratioExchange: null, // int(11) NULL换算系数
        inputTopLimit: null, // int(11) NULL输入上限
        inputLowLimit: null, // int(11) NULL输入下限
        contentZero: null, // varchar(255) NULL0 对应的内容 开关量对应
        contentOne: null, // varchar(255) NULL1 对应的内容 开关量对应
        picAddr: null, // varchar(255) NULL图片地址
        createTime: null, // datetime NOT NULL创建时间
        dataOrderby: null // bigint(25) NULL排序字段
      },
      rules: {
        systemDictId: [
          {
            required: true,
            message: '请输入选择名称',
            trigger: 'blur'
          }
        ],
        subStationAddr: [
          {
            required: true,
            message: '请输入从站地址',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 225,
            message: '长度在 1 到 225 个字符',
            trigger: 'blur'
          }
        ],
        registerAddr: [
          {
            required: true,
            message: '请输入寄存器地址',
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
        dataRuleId: this.dataRuleId,
        systemDictId: undefined // 数据名称
      },
      dataRuleTimeAlarmDialogVisible: false, // 报警属性设置dialog
      dialogFormVisibleRealData: false,
      dialogStatus: '',
      selectionData: [], // 当前选中的 表格数据
      // dataRuleRealtimeManager_btn_view: false,
      // dataRuleRealtime_btn_add: false,
      // dataRuleRealtime_btn_edit: false,
      // dataRuleRealtime_btn_del: false,
      // dataRuleRealtime_btn_clone: false,
      // dataRuleRealtime_btn_realData: false,
      // dataRuleRealtime_btn_readData: false,
      // dataRuleRealtime_btn_configuration: false,
      // dataRuleRealtime_btn_report: false,
      // dataRuleRealtime_btn_import: false,
      tableKey: 0
    }
  },
  watch: {
    dataRuleId(newVal, oldVal) {
      this.getList();
    }
  },
  created() {
    this.setSystemDictType();
    this.getList();
    // this.dataRuleRealtime_btn_view = this.elements['dataRuleRealtimeManager:btn_view'];
    // this.dataRuleRealtime_btn_add = this.elements['dataRuleRealtimeManager:btn_add'];
    // this.dataRuleRealtime_btn_edit = this.elements['dataRuleRealtimeManager:btn_edit'];
    // this.dataRuleRealtime_btn_del = this.elements['dataRuleRealtimeManager:btn_del'];
    // this.dataRuleRealtime_btn_clone = this.elements['dataRuleRealtimeManager:btn_clone'];
    // this.dataRuleRealtime_btn_realData = this.elements['dataRuleRealtimeManager:btn_realData'];
    // this.dataRuleRealtime_btn_readData = this.elements['dataRuleRealtimeManager:btn_readData'];
    // this.dataRuleRealtime_btn_configuration = this.elements['dataRuleRealtimeManager:btn_configuration'];
    // this.dataRuleRealtime_btn_report = this.elements['dataRuleRealtimeManager:btn_report'];
    // this.dataRuleRealtime_btn_import = this.elements['dataRuleRealtimeManager:btn_import'];
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
      getSystemDictType({ typeName: 'DATA_NAME' }).then(response => {
        this.systemDictOptions = response;
      });
    },
    getList() {
      this.listLoading = true;
      this.listQuery.dataRuleId = this.dataRuleId;
      page(this.listQuery).then(response => {
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
    },
    // 上移
    handleUpMove() {
      if (!this.checkSelectionData()) {
        return;
      }
      let dataRuleRealtimeIds = '';
      this.selectionData.map((item, index) => {
        dataRuleRealtimeIds += item.id + ',';
      });
      dataRuleRealtimeIds = dataRuleRealtimeIds.substring(0, dataRuleRealtimeIds.length - 1);
      updateHandleUpMove({ ids: dataRuleRealtimeIds }).then(response => {
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
    },
    // 下移
    handleDownMove() {
      if (!this.checkSelectionData()) {
        return;
      }
      let dataRuleRealtimeIds = '';
      this.selectionData.reverse().map((item, index) => {
        dataRuleRealtimeIds += item.id + ',';
      });
      dataRuleRealtimeIds = dataRuleRealtimeIds.substring(0, dataRuleRealtimeIds.length - 1);
      updateHandleDownMove({ ids: dataRuleRealtimeIds }).then(response => {
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
    },
    // 导入数据
    handleImport() {

    },
    // 导出数据
    handleReport() {

    },
    // 更改功能码方法
    changeFunctionCode(val) {
      if (val == '5') {
        this.dataTypeOptions = this.dataTypeOneOptions;
        this.form.dataType = 'bit';
      } else if (val == '6') {
        this.dataTypeOptions = this.dataTypeTwoOptions;
        this.decodeFlagOptions = this.decodeFlagOneOptions;
        this.form.dataType = 'short';
      } else if (val == '16') {
        this.dataTypeOptions = this.dataTypeThreeOptions;
        this.decodeFlagOptions = this.decodeFlagTwoOptions;
        this.form.dataType = 'int';
      }
    },
    // 更改数据类型方法
    changeDataType(val) {
      switch (val) {
        case 'short': // 16位整型(有符号)32767 -32768
          this.form.inputTopLimit = 32767;
          this.form.inputLowLimit = -32768;
          break;
        case 'unshort':// 16位整型(无符号) 65535  0
          this.form.inputTopLimit = 65535;
          this.form.inputLowLimit = 0;
          break;
        case 'int': // 32位整型(有符号) 2147483647 -2147483648
          this.form.inputTopLimit = 2147483647;
          this.form.inputLowLimit = -2147483648;
          break;
        case 'unint': // 32位整型(无符号) 4294967295 0
          this.form.inputTopLimit = 4294967295;
          this.form.inputLowLimit = 0;
          break;
        case 'float': // 浮点型 1000000000000 -1000000000000
          this.form.inputTopLimit = 1000000000000;
          this.form.inputLowLimit = -1000000000000;
          break;
        default:
          break;
      }
    },
    // 更改解码顺序方法
    changeDecodeFlag() {

    },
    handleCreate() {
      getObjId().then(response => {
        this.form = {
          id: response.data, // bigint(25) NOT NULL
          dataRuleId: this.dataRuleId, // bigint(25) NOT NULL数据规则id
          systemDictId: null, // bigint(255) NOT NULL实时数据类型(关联系统字典表的 id 字段)
          subStationAdd: null, // rvarchar(255) NOT NULL从站地址
          functionCode: '6', // varchar(255) NULL功能码(5,6,16. 5.写单个线圈 6单个寄存器 16多个寄存器
          registerAddr: null, // varchar(255) NULL寄存器地址
          dataType: 'short', // varchar(11) NULL数据类型
          decodeFlag: '12', // varchar(11) NULL解码顺序
          dataUnit: null, // varchar(20) NULL单位
          ratioExchange: null, // int(11) NULL换算系数
          inputTopLimit: null, // int(11) NULL输入上限
          inputLowLimit: null, // int(11) NULL输入下限
          contentZero: null, // varchar(255) NULL0 对应的内容 开关量对应
          contentOne: null, // varchar(255) NULL1 对应的内容 开关量对应
          picAddr: null, // varchar(255) NULL图片地址
          createTime: null, // datetime NOT NULL创建时间
          dataOrderby: response.data // bigint(25) NULL排序字段
        }
        this.changeDataType(this.form.dataType);
        this.changeFunctionCode(this.form.functionCode);
        this.dialogStatus = 'create';
        this.dialogFormVisibleRealData = true;
      }).catch(err => {
        throw err;
      });
    },
    handleUpdate(row) {
      this.form = Object.assign({}, row);
      this.dialogFormVisibleRealData = true;
      this.dialogStatus = 'update';
    },
    create(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          console.log(JSON.stringify(this.form));
          addObj(this.form).then(() => {
            this.dialogFormVisibleRealData = false;
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
          putObj(this.form.id, this.form).then(() => {
            this.dialogFormVisibleRealData = false;
            this.dataRuleTimeAlarmDialogVisible = false;
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
    },
    // 删除,移动前检查是否选中了实时数据
    checkSelectionData() {
      if (!this.selectionData || this.selectionData.length == 0) {
        this.$notify({
          title: '提示',
          message: '请选择实时数据',
          type: 'warning',
          duration: 2000
        });
        return false;
      }
      return true;
    },
    handleDelete(row) {
      if (!this.checkSelectionData()) {
        return;
      }
      this.$confirm('请谨慎删除, 如存在子站绑定该规则,可能造成设备的数据无法正常显示?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let dataRuleRealtimeIds = '';
        this.selectionData.map((item, index) => {
          dataRuleRealtimeIds += item.id + ',';
        });
        dataRuleRealtimeIds = dataRuleRealtimeIds.substring(0, dataRuleRealtimeIds.length - 1);
        deleteIds({ ids: dataRuleRealtimeIds }).then(response => {
          if (response.status == 500) {
            this.$notify({
              title: '失败',
              message: response.message,
              type: 'error',
              duration: 2000
            });
          } else {
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
      this.dialogFormVisibleRealData = false;
      this.$refs[formName].resetFields();
      if (formName === 'queryForm') {
        this.getList();
      }
    }

  }
}
</script>
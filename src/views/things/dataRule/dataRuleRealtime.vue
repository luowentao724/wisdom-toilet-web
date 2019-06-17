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
    <!-- <el-button type='primary' class="filter-item" @click="handleImport()" icon="plus" >导入</el-button> -->
    <!-- <el-button type='primary' class="filter-item" @click="handleReport()" icon="plus" >导出</el-button> -->

    <exportButton
          :excelName="'数据规则实时数据'"
          :excelData="list"
          :tHeader="['主键','数据规则id','实时数据类型(关联系统字典表的 id 字段)','从站地址','功能码(1:01:读线圈,2:02:读离散量输入,3:03:读保持寄存器,4:04:读输入寄存器)'
    ,'寄存器地址','数据类型(1:16位整型(有符号),2:16位整型(无符号),3:32位整型(有符号),4:32位整型(无符号),5:浮点型,6:开关量)','解码顺序','数据单位','bit位','0 对应的内容 开关量对应','1 对应的内容 开关量对应','小数位','换算系数','数据处理公式','映射','寄存器起始地址','是否在历史数据中显示 0否 1是','图片地址','排序字段','是否启用报警 0否 1是','报警上限/报警值 (如果是开关量,文件描述为报警值)','上限报警内容/报警内容','报警下限','下限报警内容','报警滤波次数','创建时间','数据名称']" 
          :filterVal="['id','dataRuleId','systemDictId','subStationAddr','functionCode','registerAddr','dataType','decodeFlag','dataUnit','dataBit','contentZero','contentOne','dataDigit','ratioExchange','dataDealFun','dataMapping','registerStart','historyShowFlag','picAddr','dataOrderby','alarmFlag','alarmTopLimit','alarmContentUp','alarmLowLimit','alarmContentDown','alarmWaveFilter','createTime','dictName']" 
        ></exportButton>

        <importButton :getList="getList" :dataRuleId="dataRuleId" :importUrl="'/api/things/excel/importDataRuleRealtime'" ></importButton>

    

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
        <template v-for="item in dataTypeOptions" >
            <div v-if="scope.row.dataType == item.id" v-html="item.value" v-bind:key="item.id"></div>
        </template>
      </template>
    </el-table-column>
    <el-table-column label="操作" min-width="150" fixed='right' fit='false' > 
      <template scope="scope">
        <el-button size="small" type="primary" @click="handleUpdate(scope.row)">编辑
        </el-button>
        <el-button size="small" type="primary" @click="handleUpdateAlarm(scope.row)">报警
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
  <el-dialog :title="'实时数据属性'" :visible.sync="dialogFormVisibleRealData" :modal="false" size="small">
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
            <el-input v-model="form.subStationAddr"  placeholder="请输入从站地址"></el-input>
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
          <el-form-item label="寄存器地址" prop="registerAddr">
            <el-input v-model="form.registerAddr"  placeholder="请输入寄存器地址"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      
      <template  v-if="form.functionCode == '3' || form.functionCode == '4' "   >
        <el-row :gutter="2">
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
          <el-col :span="12">
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
        </el-row>

        <el-row v-if="form.dataType != '6'" :gutter="2">
          <el-col :span="12">
            <el-form-item label="单位" prop="dataUnit">
              <el-input v-model="form.dataUnit" placeholder="请输入单位"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="小位数" prop="dataDigit">
              <el-input v-model="form.dataDigit" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="2" v-if="form.dataType != '6'" >
          <el-col :span="12">
            <el-form-item label="换算系数" prop="ratioExchange">
              <el-input v-model="form.ratioExchange" placeholder="请输入换算系数"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据处理公式" prop="dataDealFun">
              <el-input v-model="form.dataDealFun" placeholder="请输入数据处理公式"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </template>

      <el-row :gutter="2"  v-if="form.functionCode == '1' || form.functionCode == '2' || form.dataType =='6' " >
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

      <el-row :gutter="2">
        <el-col :span="12" v-if="form.functionCode != '1' && form.functionCode != '2' && form.dataType != '6'" >
          <el-form-item label="状态映射列表" prop="dataMapping">
            <el-input v-model="form.dataMapping" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.dataType == '6'" >
          <el-form-item label="bit位" prop="dataBit">
            <el-input v-model="form.dataBit" placeholder="请输入bit位"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="历史记录" prop="historyShowFlag">
            <el-radio v-model="form.historyShowFlag" :label="1">展示</el-radio>
            <el-radio v-model="form.historyShowFlag" :label="0">隐藏</el-radio>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="2">
        <el-col :span="12">
          <el-form-item label="寄存器起始地址" prop="registerStart">
            <el-input v-model="form.registerStart" placeholder="读取设备寄存器起始地址,如1,2......"></el-input>
          </el-form-item>
        </el-col>
      </el-row >
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel('form')">取 消</el-button>
      <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
      <el-button v-else type="primary" @click="update('form')">确 定</el-button>
    </div>
  </el-dialog>

  <!--  实时数据规则 报警模态框  -->
  <el-dialog :title="'报警属性'" :visible.sync="dataRuleTimeAlarmDialogVisible" :modal="false" size="tiny" >
    <el-form :model='form' :inline='true' class='demo-form-inline' label-width='100px' ref='queryDataForm'>
      <el-row >
        <el-form-item label='是否启用' prop='alarmFlag'>
          <el-radio v-model="form.alarmFlag" :label="1">展示</el-radio>
          <el-radio v-model="form.alarmFlag" :label="0">隐藏</el-radio>
        </el-form-item>
      </el-row>
      <el-row :gutter="2" >
          <el-form-item label='报警上限' prop='alarmTopLimit'>
            <el-input placeholder="模糊查询" v-model='form.alarmTopLimit' ></el-input>
          </el-form-item>
      </el-row>
      <el-row>
          <el-form-item label="上限报警内容" prop="alarmContentUp">
            <el-input  placeholder="填写数据名称,如:压力,温度......" v-model="form.alarmContentUp"> </el-input>
          </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label='报警下限' prop='alarmLowLimit'>
          <el-input placeholder="模糊查询" v-model='form.alarmLowLimit'></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="上限报警内容" prop="alarmContentDown">
          <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}" placeholder="填写数据名称,如:压力,温度......" v-model="form.alarmContentDown"> </el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="报警滤波(次)" prop="alarmWaveFilter">
          <el-input-number v-model="form.alarmWaveFilter" :min="1" :max="10000"></el-input-number>
        </el-form-item>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelDataRuleTimeAlarm()">取 消</el-button>
      <el-button type="primary" @click="update('queryDataForm')">确 定</el-button>
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
} from 'api/things/dataRuleRealtime/index';
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
      systemDictOptions: [
      ], // 数据名称
      functionCodeOptions: [

        {
          id: '1',
          value: '01:读线圈'
        },
        {
          id: '2',
          value: '02:读离散量输入'
        },
        {
          id: '3',
          value: '03:读保持寄存器'
        },
        {
          id: '4',
          value: '04:读输入寄存器'
        }
      ], // 数据leix
      dataTypeOptions: [

        {
          id: '1',
          value: '16位整型(有符号)'
        },
        {
          id: '2',
          value: '16位整型(无符号)'
        },
        {
          id: '3',
          value: '32位整型(有符号)'
        },
        {
          id: '4',
          value: '32位整型(无符号)'
        },
        {
          id: '5',
          value: '浮点型'
        },
        {
          id: '6',
          value: '开关量'
        }
      ], // 数据类型
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
        systemDictId: null, // bigint(25) NULL实时数据类型(关联系统字典表的 id 字段)
        subStationAddr: null, // rvarchar(255) NOT NULL从站地址
        functionCode: '1', // varchar(255) NULL功能码(1,2,3,4.1，2，3，4.如果选择1和2，则数据类型为开关量。如果为3，4，为其他数据类型
        registerAddr: null, // varchar(255) NULL寄存器地址
        dataType: null, // varchar(11) NULL数据类型
        decodeFlag: null, // varchar(11) NULL解码顺序
        dataUnit: null, // varchar(20) NULL数据单位
        dataBit: '1', // varchar(11) NULLbit位
        contentZero: null, // varchar(255) NULL0 对应的内容 开关量对应
        contentOne: null, // varchar(255) NULL1 对应的内容 开关量对应
        dataDigit: null, // int(11) NULL小数位
        ratioExchange: null, // int(11) NULL换算系数
        dataDealFun: null, // varchar(255) NULL数据处理公式
        dataMapping: null, // varchar(255) NULL映射
        registerStart: null, // varchar(255) NULL寄存器起始地址
        historyShowFlag: null, // tinyint(3) NULL是否在历史数据中显示 0否 1是
        picAddr: null, // varchar(255) NULL图片地址
        dataOrderby: null, // bigint(25) NULL排序字段
        alarmFlag: null, // tinyint(3) NULL是否启用报警
        alarmTopLimit: null, // decimal(10,2) NULL报警上限/报警值 (如果是开关量,文件描述为报警值)
        alarmContentUp: null, // varchar(255) NULL上限报警内容/报警内容
        alarmLowLimit: null, // decimal(10,2) NULL报警下限
        alarmContentDown: null, // varchar(255) NULL下限报警内容
        alarmWaveFilter: null, // int(11) NOT NULL报警滤波次数
        createTime: null // datetime NOT NULL创建时间
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
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0
    }
  },
  watch: {
    // 观察option的变化
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
      console.log(val);
    },
    // 更新报警信息
    handleUpdateAlarm(row) {
      this.form = Object.assign({}, row);
      this.dataRuleTimeAlarmDialogVisible = true;
    },
    // 上移
    handleUpMove() {
      // ,
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
      //
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
      if (val == '1' || val == '2') {
        this.form.dataType = '6';
      }
    },
    // 更改数据类型方法
    changeDataType(val) {
      console.log(val);
      if (val == '1' || val == '2' || val == '6') {
        this.decodeFlagOptions = this.decodeFlagOneOptions;
        if (val == '6') {
          this.form.dataBit = '1';
        }
      } else {
        this.decodeFlagOptions = this.decodeFlagTwoOptions;
      }
      console.log(val)
    },
    // 更改解码顺序方法
    changeDecodeFlag() {

    },
    handleCreate() {
      getObjId().then(response => {
        this.form = {
          id: response.data,
          dataRuleId: this.dataRuleId, // bigint(25) NOT NULL数据规则id
          systemDictId: null, // bigint(25) NULL实时数据类型(关联系统字典表的 id 字段)
          subStationAddr: null, // rvarchar(255) NOT NULL从站地址
          functionCode: '3', // varchar(255) NULL功能码(1,2,3,4.1，2，3，4.如果选择1和2，则数据类型为开关量。如果为3，4，为其他数据类型
          registerAddr: null, // varchar(255) NULL寄存器地址
          dataType: '2', // varchar(11) NULL数据类型
          decodeFlag: '1', // varchar(11) NULL解码顺序
          dataUnit: null, // varchar(20) NULL数据单位
          dataBit: '1', // varchar(11) NULLbit位
          contentZero: null, // varchar(255) NULL0 对应的内容 开关量对应
          contentOne: null, // varchar(255) NULL1 对应的内容 开关量对应
          dataDigit: null, // int(11) NULL小数位
          ratioExchange: null, // int(11) NULL换算系数
          dataDealFun: null, // varchar(255) NULL数据处理公式
          dataMapping: null, // varchar(255) NULL映射
          registerStart: null, // varchar(255) NULL寄存器起始地址
          historyShowFlag: 1, // tinyint(3) NULL是否在历史数据中显示 0否 1是
          picAddr: null, // varchar(255) NULL图片地址
          dataOrderby: response.data // bigint(25) NULL排序字段
        }
        this.changeDataType(this.form.dataType);
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
          // this.form.createMan = this.userId;
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
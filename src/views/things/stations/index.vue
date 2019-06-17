<template>

<div class="app-container calendar-list-container">
  <div >
    <el-row>
      <el-collapse style="position: relative;" value='condition' >
        <el-collapse-item title='查询条件' name='condition'>
          <el-form :model='listQuery' :inline='true' class='demo-form-inline' label-width='100px' ref='queryForm'>
            <el-form-item label='设备名称' prop='totilName'>
              <el-input placeholder="模糊查询" v-model='listQuery.totilName' @keyup.enter.native="handleFilter"></el-input>
            </el-form-item>
            <el-form-item label='SN码' prop='codeSn'>
              <el-input placeholder="模糊查询" v-model='listQuery.codeSn' @keyup.enter.native="handleFilter"></el-input>
            </el-form-item>
            <el-form-item label='状态' prop='totilState'>
              <el-select class="filter-item" clearable @clear="clearTotilState" v-model="listQuery.totilState" placeholder="请选择">
                <el-option v-for="item in stateOptions" :key="item.id" :label="item.name" :value="item.id"> </el-option>
              </el-select>
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
      <el-button type='primary' v-if="stationsManager_btn_add" class="filter-item" @click="handleCreate('form')" icon="plus" >添加</el-button>
  </div>
  <el-table :key='tableKey' :data="list" v-loading.body="listLoading"  border fit highlight-current-row >

    <el-table-column label="#" type='index' min-width='30'></el-table-column>
    <el-table-column label='设备名称' prop='totilName' min-width='150'></el-table-column>
    <el-table-column label='模块sn码' prop='codeSn' min-width='100'></el-table-column>
    <el-table-column label='SIM码' prop='sim' min-width='100'></el-table-column>
    <el-table-column label='数据规则' prop='dataRuleName' min-width='100'></el-table-column>
    <el-table-column label='状态' prop='totilState' min-width='100'>
      <template scope="scope">
        <div :style="scope.row.totilState != 1 ? 'color: red' : ''" v-html="scope.row.totilState == 1 ? '在线' : '离线'"></div>
      </template>
    </el-table-column>
    <el-table-column label='联系人' prop='relName' min-width='100'></el-table-column>
    <el-table-column label='联系号码' prop='relPhone' min-width='100'></el-table-column>
    <el-table-column label='所在地' prop='areaInfo' min-width='100'></el-table-column>
    <el-table-column label="操作" width="150" min-width="250" fixed='right' fit='false' > 
      <template scope="scope">
        <el-button v-if="stationsManager_btn_edit" size="small" type="primary" @click="handleUpdate(scope.row)">编辑
        </el-button>
        <el-button v-if="stationsManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
        </el-button>
      </template> 
    </el-table-column>
  </el-table>
  <el-row type='flex' justify='end' class="pagination-container">
      <el-pagination :page-sizes='[10, 20, 50, 100]' :page-size='listQuery.limit' layout='prev,pager,next,jumper,total,sizes' :total='total' :current-page.sync='listQuery.page' @current-change='handleCurrentChange' @size-change='handleSizeChange'>
      </el-pagination>
  </el-row>
</div>

  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false" size="small">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
      <el-form-item label="设备图片" prop="totilPic">
        <!-- <el-upload
          class="avatar-uploader"
          :action="this.file.uploadFileUrl"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="form.systemLogo" :src="form.systemLogo" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload> -->
        <el-input v-model="form.totilPic" placeholder="请输入设备图片"></el-input>
      </el-form-item>

      <el-form-item label="设备名称" prop="totilName">
        <el-input v-model="form.totilName" placeholder="请输入设备名称"></el-input>
      </el-form-item>
      <el-form-item label="设备编号" prop="totilId">
        <el-input v-model="form.totilId" placeholder="请输入设备编号"></el-input>
      </el-form-item>
      <el-form-item label="模块SN码" prop="codeSn">
        <el-input v-model="form.codeSn" placeholder="请输入模块SN码"></el-input>
      </el-form-item>
      <el-form-item label="厂商" prop="factory">
        <el-select class="filter-item" v-model="form.factory" placeholder="请选择">
          <el-option v-for="item in factoryOptions" :key="item.dictId" :label="item.dictName" :value="item.dictId"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属客户" prop="customerId">
        <el-select class="filter-item" v-model="form.customerId" placeholder="请选择">
          <el-option v-for="item in customerOptions" :key="item.id+''" :label="item.customerName" :value="item.id+''"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="便器数量" prop="totilNums">
        <el-input-number v-model="form.totilNums" :min="1" :max="30"></el-input-number>
      </el-form-item>
      <el-form-item label="泵站数量" prop="bumpNums">
        <el-input-number v-model="form.bumpNums" :min="1" :max="30"></el-input-number>
      </el-form-item>
      <el-form-item label="数据规则" prop="dataRuleId">
        <el-input style="width:80%" disabled v-model="form.dataRuleName" placeholder="请选择数据规则"></el-input>
        <el-button type="primary" @click.prevent="chooseDataRule()">选择</el-button>
      </el-form-item>
      <el-form-item label="SIM号" prop="sim">
        <el-input v-model="form.sim" placeholder="请输入SIM号"></el-input>
      </el-form-item>
      <el-form-item label="联系人" prop="relName">
        <el-input v-model="form.relName" placeholder="请输入联系人"></el-input>
      </el-form-item>
      <el-form-item label="联系号码" prop="relPhone">
        <el-input v-model="form.relPhone" placeholder="请输入联系号码"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="relEmail">
        <el-input v-model="form.relEmail" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}" placeholder="请输入备注" v-model="form.remark"> </el-input>
      </el-form-item>
      <el-form-item label="是否公开" prop="isPublic" >
        <el-radio v-model="form.isPublic" label="1">是</el-radio>
        <el-radio v-model="form.isPublic" label="0">否</el-radio>
      </el-form-item>
      <el-form-item label="所在区域" prop="areaId">
        <el-cascader style="width:300px"
          v-model="selectedAreaOptions"
          :options="areaTreeData"
          :props="areaProp"
          :clearable="true"
          :change-on-select="true"
          @change="selectArea">
        </el-cascader>
      </el-form-item>
      <el-form-item label="所在地" prop="areaInfo" >
        <el-input style="width:80%" v-model="form.areaInfo"> </el-input>
        <el-button type="primary" @click.prevent="chooseLocation()">地图</el-button>
      </el-form-item>
      <el-form-item label="经纬度">
        <el-input style="width:45%"  placeholder="经度" disabled v-model="form.lng"> </el-input>
        <el-input style="width:45%" placeholder="纬度" disabled v-model="form.lat"> </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel('form')">取 消</el-button>
      <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
      <el-button v-else type="primary" @click="update('form')">确 定</el-button>
    </div>
  </el-dialog>


  <!---------------------   数据规则选择dialog框 ----------------------->
  <el-dialog :title="'选择数据规则'" :visible.sync="dataRuleDialogVisible" >
    <el-form :model='dataRuleListQuery' :inline='true' class='demo-form-inline' label-width='100px' ref='queryDataForm'>
      <el-form-item label='规则名称' prop='ruleName'>
        <el-input placeholder="模糊查询" v-model='dataRuleListQuery.ruleName' @keyup.enter.native="dataRuleHandleFilter"></el-input>
      </el-form-item>
      <el-form-item label='规则说明' prop='remark'>
        <el-input placeholder="模糊查询" v-model='dataRuleListQuery.remark' @keyup.enter.native="dataRuleHandleFilter"></el-input>
      </el-form-item>
      <div style='text-align:center'>
        <el-form-item>
          <el-button type='primary' @click='dataRuleHandleFilter' >查询</el-button>
          <el-button @click='cancelDataRule()'>重置</el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-table :key='tableKey' :data="dataRulelist" v-loading.body="dataRuleListLoading" border fit highlight-current-row >
      <!--  type="selection" -->
      <el-table-column  label="#"  width="55">
          <template scope="scope">
              <el-radio class="radio" v-model="dataRuleId" :label="scope.row.id"  @change.native="getDataRuleRow(scope.$index,scope.row)" >
              </el-radio>
          </template>
      </el-table-column>
      <el-table-column label='规则名称' prop='ruleName' min-width='150'></el-table-column>
      <el-table-column label='规则说明' prop='remark' min-width='100'></el-table-column>
    </el-table> 
    <el-row type='flex' justify='end' class="pagination-container">
      <el-pagination :page-sizes='[10, 20, 50, 100]' :page-size='dataRuleListQuery.limit' layout='prev,pager,next,jumper,total,sizes' :total='dataRuleTotal' :current-page.sync='dataRuleListQuery.page' @current-change='dataRuleHandleCurrentChange' @size-change='dataRuleHandleSizeChange'>
      </el-pagination>
  </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelDataRule()">取 消</el-button>
      <el-button type="primary" @click="confirmDataRule()">确 定</el-button>
    </div>
  </el-dialog>

  <!---------------------   地图经纬度地址选择dialog框 ----------------------->
  <el-dialog :title="'选择地址'" :visible.sync="dataLocationDialogVisible" >
    <el-row>
      <el-form :inline='true' class='demo-form-inline' label-width='100px' ref='queryDataForm'>
        <el-form-item label='规则名称' prop='ruleName'>
          <el-input style="width:400px"
            placeholder="地址位置信息查询"
            icon="search"
            v-model="bmap.localSearch.keyword"
            :on-icon-click="handleIconClick">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type='primary' @click='handleIconClick' >查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <baidu-map style="height: 550px;"
        :ak="bmap.ak" 
        :center="bmap.center" 
        :zoom="bmap.zoom" 
        @ready="bmapReady"
        :scroll-wheel-zoom="bmap.enableScrollWheelZoom"
        >
        <!-- 缩放控件 -->
        <bm-navigation :anchor="bmap.nav.anchor"></bm-navigation>
        <!-- 地图类型切换 -->
        <bm-map-type :map-types="bmap.mapType.types" :anchor="bmap.mapType.anchor"></bm-map-type>
        <!-- 地图上点位 -->
        <template v-for="(point,index) in bmap.points">
          <bm-marker 
          :key="point.animation" 
          :position="point.position" 
          :dragging="point.dragging" 
          :animation="point.animation" 
          :icon="bmap.pointIcon"
          @click="clickPointHandle(index)" 
          @dblclick="dbClickPointHandle(index)">
            <!-- <bm-label :content="我爱北京天安门" :labelStyle="{color: 'red', fontSize : '24px'}" :offset="{width: -35, height: 30}"/> -->
          </bm-marker>
        </template>
        <!-- <bm-point-collection :points="bmap.points.list" :shape="bmap.points.shape" color="bmap.points.color" size="bmap.points.size"  @click="clickPointHandle"></bm-point-collection> -->
        <!-- 信息窗 -->
        <!-- <bm-info-window :position="bmap.infoWindow.position" :title="bmap.infoWindow.title" :show="bmap.infoWindow.show" @close="infoWindowClose" @open="infoWindowOpen">
          <p v-text="bmap.infoWindow.contents"></p>
          <!-- <button @click="clear">Clear</button>
        </bm-info-window> -->
        <!-- 区域搜索 -->
        <bm-local-search :keyword="bmap.localSearch.keyword" :auto-viewport="true"></bm-local-search>
      </baidu-map>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dataLocationDialogVisible = false">取 消</el-button>
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
} from 'api/things/stations/index';
import { getAll } from 'api/things/customer/index';
import { page as dataRulePage } from 'api/things/dataRule/index';
import { getObjId, getSystemDictType } from 'api/pubThings';
import { fetchTree } from 'api/things/area/index';
import CustomerNav from '../gis/bmap/components/CustomerNav.vue'
import { mapGetters } from 'vuex';
import {
  BaiduMap,
  BmNavigation,
  BmMapType,
  BmMarker,
  BmLabel,
  BmPointCollection,
  BmInfoWindow,
  BmLocalSearch
}
from 'vue-baidu-map'
export default {
  name: 'user',
  components: {
    CustomerNav,
    BaiduMap,
    BmNavigation,
    BmMapType,
    BmMarker,
    BmLabel,
    BmPointCollection,
    BmInfoWindow,
    BmLocalSearch
  },
  data() {
    return {
      // 百度地图配置
      bmap: {
        ak: 'gnLfRsEGqXzdG3huMaq9yGWTw7xpZ0nf',
        BMap: undefined,
        map: undefined,
        center: '',
        zoom: 16,
        enableScrollWheelZoom: true,
        // 缩放导航控件
        nav: {
          // 位置左上
          anchor: 'BMAP_ANCHOR_TOP_LEFT'
        },
        // 地图类型控件
        mapType: {
          // 平面图和卫星图
          types: ['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP'],
          // 位置右上
          anchor: 'BMAP_ANCHOR_TOP_RIGHT'
        },
        // 地图上少量点使用，并需要对单个点操作
        points: [
          // {
          //   position: { lng: 116.404, lat: 39.915 },
          //   dragging: false,
          //   animation: '' // BMAP_ANIMATION_BOUNCE  跳跃的点类型
          // }
        ],
        // TODO 自定义点图标
        // pointIcon:{
        //   url: 'http://developer.baidu.com/map/jsdemo/img/fox.gif',
        //   size: {width: 300, height: 157}
        // },
        infoWindow: {
          show: false,
          contents: 'fadsfasd',
          position: { lat: '', lng: '' },
          title: '设备'
        },
        // 本地关键词搜索
        localSearch: {
          keyword: ''
        }
      },
      factoryOptions: [], // 厂商
      customerOptions: [], // 客户
      // 区域树数据
      selectedAreaOptions: [], // 默认选中的区域地址
      areaTreeData: [],
        // 区域自定义级联选项
      areaProp: {
        label: 'areaName',
        value: 'id',
        children: 'children'
      },
      form: {
        id: undefined, // 子站(公厕)id
        dataRuleId: undefined, // 对应数据规则id
        dataRuleName: '', // 选择的数据规则名称
        sim: undefined, // sim号
        isPublic: '1', // 是否公开(1公开 0不公开)
        areaInfo: undefined, // 所在地址
        codeSn: undefined, // sn码
        totilName: undefined, // 公厕名称
        totilId: undefined, // 公厕编号
        areaId: undefined, // 区域位置id
        customerId: undefined, // 所属客户id
        factory: undefined, // 所属厂商code
        remark: undefined, // 备注
        createTime: undefined, // 创建时间
        totilNums: 1, // 便器数量
        bumpNums: 1, // 泵站数量
        createMan: undefined, // 创建人id
        totilPic: undefined, // 照片地址
        totilTypeId: undefined, // 公厕类型编号
        totilState: '0', // NULL公厕状态 1在线 0 离线
        relName: undefined, // NULL联系人姓名
        relPhone: undefined, // NULL联系人电话
        relEmail: undefined, // NULL联系人邮箱
        lng: undefined, // 经度
        lat: undefined // 维度
      },
      stateOptions: [
        {
          id: '1',
          name: '在线'
        },
        {
          id: '0',
          name: '离线'
        }
      ],
      rules: {
        totilName: [
          {
            required: true,
            message: '请输入子站名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 225,
            message: '长度在 1 到 225 个字符',
            trigger: 'blur'
          }
        ],
        areaId: [
          {
            required: true,
            message: '请选择位置区域',
            trigger: 'blur'
          }
        ],
        areaInfo: [
          {
            required: true,
            message: '请输入详细地址',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 200,
            message: '长度在 1 到 200 个字符',
            trigger: 'blur'
          }
        ],
        lng: [
          {
            required: true,
            message: '请打开地图点击获取经度',
            trigger: 'blur'
          }
        ],
        lat: [
          {
            required: true,
            message: '请打开地图点击获取纬度',
            trigger: 'blur'
          }
        ],
        totilId: [
          {
            required: true,
            message: '请输入子站编号',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 50,
            message: '长度在 1 到 50 个字符',
            trigger: 'blur'
          }
        ],
        relName: [
          {
            required: true,
            message: '请输入联系人名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 50,
            message: '长度在 1 到 50 个字符',
            trigger: 'blur'
          }
        ],
        relPhone: [
          {
            required: true,
            message: '请输入联系人电话',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 50,
            message: '长度在 1 到 50 个字符',
            trigger: 'blur'
          }
        ],
        relEmail: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 50,
            message: '长度在 1 到 50 个字符',
            trigger: 'blur'
          }
        ],
        codeSn: [
          {
            required: true,
            message: '请输入sn码',
            trigger: 'blur'
          }
        ],
        factory: [
          {
            required: true,
            message: '请选择厂商',
            trigger: 'blur'
          }
        ],
        customerId: [
          {
            required: true,
            message: '请选择所属客户',
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
        totilName: undefined, // 子站名称
        codeSn: undefined, // sn码
        totilState: undefined // 状态
      },
      dialogFormVisible: false,
      dialogStatus: '',
      stationsManager_btn_edit: false,
      stationsManager_btn_del: false,
      stationsManager_btn_add: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0,
      // ------  数据规则使用数据 -----------
      dataRuleId: null, // 选择的数据规则id
      dataRuleName: null, // 选择的数据规则名称
      dataRuleDialogVisible: false, // 控制数据规则模态框是否显示
      dataRuleTotal: null, // 总记录数
      dataRuleListQuery: {
        page: 1,
        limit: 20,
        ruleName: undefined, // 规则名称
        remark: undefined  // 规则
      }, // 数据规则查询条件说明
      dataRulelist: [], // 数据规则data
      dataRuleListLoading: true, // 数据规则loading
      // -------------------- 位置地图使用数据 -----------
      dataLocationDialogVisible: false // 控制地图模态框
    }
  },
  created() {
    this.setSystemDictType();
    this.setCustomerOptions();
    // 获取区域树数据
    this.getAreaTreeData();
    this.getList();
    this.stationsManager_btn_edit = this.elements['stationsManager:btn_edit'];
    this.stationsManager_btn_del = this.elements['stationsManager:btn_del'];
    this.stationsManager_btn_add = this.elements['stationsManager:btn_add'];
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
    // 获取客户列表数据
    setCustomerOptions() {
      getAll().then(response => {
        this.customerOptions = response;
      });
    },
    /**
     * 选择区域
     */
    selectArea(val) {
      // console.log("级联选择值：",val)
      this.form.areaId = undefined;
      if (val && val.length) {
        this.form.areaId = val[val.length - 1] + '';
        this.bmap.center = '';
        this.getAreaName(this.areaTreeData, val);
        // this.bmap.center = this.bmap.localSearch.keyword;
      }
    },
    getAreaName(childArr, val) {
      childArr.map(item => {
        for (let i = 0; i < val.length; i++) {
          if (item.id == val[i]) {
            this.bmap.center += item.areaName;
            console.log(this.bmap.center);
            if (i == (val.length - 1)) {
              break;
            } else {
              this.getAreaName(item.children, val);
            }
          }
        }
      });
    },
    /**
     * 获取区域数据所有数据
     * 用于级联
     */
    getAreaTreeData() {
      fetchTree().then(data => {
        this.areaTreeData = data;
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
    // 清除totilState 查询条件
    clearTotilState() {
      this.listQuery.totilState = undefined;
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
      this.selectedAreaOptions = [];
      this.form.id = undefined;// 子站(公厕)id
      this.form.dataRuleId = 0; // 对应数据规则id
      this.form.sim = undefined; // sim号
      this.form.isPublic = '1'; // 是否公开(1公开 0不公开)
      this.form.factory = undefined;
      this.form.totilNums = 1;
      this.form.bumpNums = 1;
      this.form.areaInfo = undefined; // 所在地址
      this.form.codeSn = undefined; // sn码
      this.form.totilName = undefined; // 公厕名称
      this.form.totilId = undefined; // 公厕编号
      this.form.areaId = undefined; // 区域位置id
      this.form.customerId = undefined; // 所属客户id
      this.form.remark = undefined; // 备注
      this.form.createTime = undefined; // 创建时间
      this.form.createMan = undefined; // 创建人id
      this.form.totilPic = undefined; // 照片地址
      this.form.totilTypeId = undefined; // 公厕类型编号
      this.form.totilState = '1'; // NULL公厕状态
      this.form.relName = undefined; // NULL联系人姓名
      this.form.relPhone = undefined; // NULL联系人电话
      this.form.relEmail = undefined; // NULL联系人邮箱
      this.form.lng = undefined; // 经度
      this.form.lat = undefined; // 维度
    },
    handleUpdate(row) {
      this.form = Object.assign({}, row);
      this.form.isPublic = this.form.isPublic + '';
      this.form.customerId = this.form.customerId + '';
      this.form.areaId = this.form.areaId + '';
      this.bmap.center = this.form.areaInfo;
      // this.selectedAreaOptions = [1, 2, 28]
      this.selectedAreaOptions = [];
      this.getSelectedAreaOptions(this.areaTreeData, this.form.areaId);
      console.log(this.selectedAreaOptions.reverse());
      this.dialogFormVisible = true;
      this.dialogStatus = 'update';
    },
    // 编辑时获取默认选中的 区域地址
    getSelectedAreaOptions(areaArr, areaId) {
      areaArr.map(item => {
        if (item.id == areaId) {
          this.selectedAreaOptions.push(item.id);
          if (item.parentId == -1) {
            return -1;
          }
          this.getSelectedAreaOptions(this.areaTreeData, item.parentId);
        } else {
          this.getSelectedAreaOptions(item.children, areaId);
        }
      });
    },
    /**
     * 百度地图初始化完成
     */
    bmapReady({ BMap, map }) {
      this.bmap.BMap = BMap;
      this.bmap.map = map;
      console.log(111)
      this.eventListener();
    },
    infoWindowClose(e) {
      this.bmap.infoWindow.show = false
    },
    infoWindowOpen(e) {
      // this.bmap.infoWindow.show = true
    },
    /**
     * 点击搜索图标处理方法
     */
    handleIconClick() {

    },
    eventListener() {
      const BMap = this.bmap.BMap;
      const map = this.bmap.map;
      let marker;
      map.addEventListener('click', e => {
        if (!this.dataLocationDialogVisible) { return }
        // this.$message('坐标点：'+e.point.lng + "," + e.point.lat);
        if (marker) {
          map.removeOverlay(marker);
          marker = undefined;
        }
        // 创建标注
        marker = new BMap.Marker(e.point);
        console.log(JSON.stringify(e.point));

        // 用所定位的经纬度查找所在地省市街道等信息
        const point = new BMap.Point(e.point.lng, e.point.lat);
        const gc = new BMap.Geocoder();
        gc.getLocation(point, rs => {
          const addComp = rs.addressComponents;
            // console.log(rs.address);//地址信息
          this.form.areaInfo = rs.address;
          const address = new BMap.Label(rs.address, { offset: new BMap.Size(-80, -25) });
          marker.setLabel(address); // 添加地址标注
        });
        // 将标注添加到地图中
        map.addOverlay(marker);
        // 跳动的动画
        marker.setAnimation(BMAP_ANIMATION_BOUNCE);
        // 打开编辑页面
        this.dataLocationDialogVisible = true;
        this.form.lng = e.point.lng;
        this.form.lat = e.point.lat;
      });
    },
    // 显示地图模态框
    chooseLocation() {
      this.dataLocationDialogVisible = true;
    },
    // 地图模态框取消方法
    cancelLocation() {

    },
    // 地图模态框确认方法
    confirmLocation() {

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
      }).then(() => {
        delObj(row.id).then(() => {
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
          this.form.createMan = this.userId;
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
    // -------------- 选择数据规则方法 ----------------
    chooseDataRule() {
      this.dataRuleDialogVisible = true;
      this.dataRuleId = null; // 选择的数据规则id
      this.dataRuleName = null; // 选择的数据规则名称
      this.dataRuleHandleFilter();
    },
    getDataRuleRow(index, row) {
      console.log(index, row);
      console.log(row)
      this.dataRuleName = row.ruleName;
      this.dataRuleId = row.id;
    },
    // 查询数据规则方法
    dataRuleHandleFilter() {
      this.dataRuleListLoading = true;
      dataRulePage(this.dataRuleListQuery)
        .then(response => {
          this.dataRulelist = response.data.rows;
          this.dataRuleTotal = response.data.total;
          this.dataRuleListLoading = false;
        })
    },
    // 选择每页显示条数
    dataRuleHandleSizeChange(val) {
      this.dataRuleListQuery.limit = val;
      this.dataRuleHandleFilter();
    },
    // 跳转指定页码
    dataRuleHandleCurrentChange(val) {
      this.dataRuleListQuery.page = val;
      this.dataRuleHandleFilter();
    },
      // 确定选择数据规则
    confirmDataRule() {
      this.form.dataRuleName = this.dataRuleName;
      this.form.dataRuleId = this.dataRuleId;
      this.cancelDataRule();
    },
    // 取消或确定选择数据规则
    cancelDataRule() {
      this.dataRuleDialogVisible = false;
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

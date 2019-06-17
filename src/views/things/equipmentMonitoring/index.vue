<template>

<div class="app-container calendar-list-container">
  <div >
    <el-row>
      <el-collapse style="position: relative;" value='condition' >
        <el-collapse-item title='查询条件' name='condition'>
          <el-form :model='listQuery' :inline='true' class='demo-form-inline' label-width='100px' ref='queryForm'>
            <el-form-item label='DTU名称' prop='totilName'>
              <el-input placeholder="模糊查询" v-model='listQuery.totilName' @keyup.enter.native="handleFilter"></el-input>
            </el-form-item>
            <el-form-item label='标识UID' prop='totilId'>
              <el-input placeholder="模糊查询" v-model='listQuery.totilId' @keyup.enter.native="handleFilter"></el-input>
            </el-form-item>
            <el-form-item label='' prop='status'>
               <el-radio class="radio" v-model="status" label="1">全部({{list.length}})</el-radio>
               <el-radio class="radio" v-model="status" label="2">在线({{onlineList.length}})</el-radio>
               <el-radio class="radio" v-model="status" label="3">离线({{offlineList.length}})</el-radio>
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

  <el-tabs style="margin-top: 10px;" v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane label="列表展示" name="first">
      <el-table  :key='tableKey' :data="currentList" v-loading.body="listLoading"  border fit highlight-current-row >
        <el-table-column label='DTU名称' prop='totilName' min-width='100'></el-table-column>
        <el-table-column label='设备标识UID' prop='totilId' min-width='100'></el-table-column>
        <el-table-column label='SIM号' prop='sim' min-width='100'></el-table-column>
        <!-- <el-table-column label='最后登录时间' prop='createTime' min-width='100'></el-table-column> -->
        <el-table-column label='位置' prop='areaInfo' min-width='100'></el-table-column>
        <el-table-column label='DTU属性' prop='nemberId' min-width='50'>
          <template scope="scope">
            <el-button size="small" type="primary" @click="handleUpdate(scope.row)">详情
            </el-button>
          </template> 
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="小图标" name="second">
      <el-row>
        <el-col :span="2" style="margin: 5px;" v-for="(o, index) in currentList" :key="index" >
          <el-card :body-style="{ padding: '0px' }">
            <img  src="../../../assets/images/logo.jpg" class="image">
            <div style="padding: 14px;">
              <span style="font-size: 5px;">{{ o.totilName }}</span>
              <div class="bottom clearfix">
                <!-- <time class="time">{{ o.totilId }}</time> -->
                <el-button type="text" class="button" style="font-size: 5px;">详情</el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-tab-pane>
    <el-tab-pane label="大图标" name="third">
      <el-row>
        <el-col :span="3" style="margin: 5px;" v-for="(o, index) in currentList" :key="index" >
          <el-card :body-style="{ padding: '0px' }">
            <img  src="../../../assets/images/logo.jpg" class="image">
            <div style="padding: 14px;">
              <span style="font-size: 8px;">{{ o.totilName }}</span>
              <div class="bottom clearfix">
                <!-- <time class="time">{{ o.totilId }}</time> -->
                <el-button type="text" class="button" style="font-size: 8px;">详情</el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-tab-pane>
  </el-tabs>
</div>
</template>
<script>
import {
  page
} from 'api/things/stations/index';
import util from 'utils/util';
import { mapGetters } from 'vuex';
export default {
  name: 'user',
  data() {
    return {
      activeName: 'first',
      selectOption: [
        {
          value: '3',
          label: '大图标'
        },
        {
          value: '2',
          label: '小图标'
        },
        {
          value: '1',
          label: '列表显示'
        }
      ],
      selectValue: '1', // 当前选中的显示列表
      currentList: [], // 当前选择显示设备
      list: [], // 全部设备
      onlineList: [], // 在线设备
      offlineList: [], // 离线设备
      total: null,
      listLoading: true,
      status: '1',
      listQuery: {
        page: 1,
        limit: 100000,
        totilName: undefined, // DTU名称
        totilId: undefined  // DTU  ID
      },
      dialogFormVisible: false,
      dialogStatus: '',
      tableKey: 0
    }
  },
  created() {
    this.getList();
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  watch: {
    status(newVal, oldVal) {
      if (newVal == '1') {
        this.currentList = this.list;
      } else if (newVal == '2') {
        this.currentList = this.onlineList;
      } else if (newVal == '3') {
        this.currentList = this.offlineList;
      }
    }
  },
  methods: {
    // 日期转换
    getList() {
      this.listLoading = true;
      page(this.listQuery)
        .then(response => {
          this.status = '1';
          this.currentList = response.data.rows;
          this.list = response.data.rows;
          this.onlineList = [];
          this.offlineList = [];
          this.list.map((item, index, input) => {
            if (item.totilState === 1) {
              this.onlineList.push(item);
            } else {
              this.offlineList.push(item);
            }
          });
          this.listLoading = false;
        })
    },
    handleFilter() {
      this.getList();
    },
    handleClick() {
      console.log(this.status)
    },
    cancel(formName) {
      this.dialogFormVisible = false;
      this.$refs[formName].resetFields();
      if (formName === 'queryForm') {
        this.status = '1';
        this.getList();
      }
    }
  }
}
</script>

<style scoped>
 .time {
    font-size: 13px;
    color: #999;
  }
  
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    height: 70px;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }
</style>


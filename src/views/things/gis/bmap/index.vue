<template>
<div>
<el-row>
  <el-col :span="6" >
    <!-- 导航区 -->
    <el-tabs style="margin: 5px;" v-model="nav.activeName" @tab-click="navClick" :type="tabType">
      <el-tab-pane  :name="nav.customerNav.name">
        <span slot="label"><i :class="nav.customerNav.icon">&nbsp;</i>{{nav.customerNav.label}}</span>
        <customer-nav @click="changeCenter" @double-click="showDataMonitor"></customer-nav>
      </el-tab-pane>
      <el-tab-pane :name="nav.areaNav.name">
        <span slot="label"><i :class="nav.areaNav.icon">&nbsp;</i>{{nav.areaNav.label}}</span>
        <area-nav v-if="nav.activeName == 'areaNav'" @click="changeCenter" @double-click="showDataMonitor"></area-nav>
      </el-tab-pane>
    </el-tabs>
  </el-col>
  <el-col :span="18" >
    <!-- 视图区 -->
    <el-tabs style="margin: 5px;" v-model="view.activeName" @tab-click="navClick" :type="tabType">
      <el-tab-pane  :name="view.mapView.name">
        <span slot="label"><i :class="view.mapView.icon">&nbsp;</i>{{view.mapView.label}}</span>
        <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="">
              <el-select 
              v-model="nameOrSn" 
              :filterable="true" 
              :clearable ="true"
              :filter-method="filterQuery"
              @change="handleSelect"
              placeholder="请输入DTU名称、标识UID">
                <el-option
                  v-for="item in f_stations"
                  :key="item.id"
                  :label="item.totilName"
                  :value="item">
                  <span style="float: left">{{ item.totilName }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.totilId }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-input
                placeholder="地址位置信息查询"
                icon="search"
                v-model="bmap.localSearch.keyword"
                :on-icon-click="handleIconClick">
              </el-input>
            </el-form-item>
            <el-form-item>
              <!-- 找到home图标后换图标 -->
              <!-- <el-button type="primary" icon="edit"  @click="toHome"></el-button> -->
              <el-button type="primary" @click="toHome">Home</el-button>
              <el-button type="primary" icon="search" :disabled="addDTUDisabled" @click="addDTU">新增DTU</el-button>
              <el-button type="primary" icon="search" @click="enableChangeLation">设备定位</el-button>
            </el-form-item>
          </el-form>
        <baidu-map ref="mapDom" :style="bmap.containerStyle"
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
          <bm-info-window :position="bmap.infoWindow.position" :title="bmap.infoWindow.title" :show="bmap.infoWindow.show" @close="infoWindowClose" @open="infoWindowOpen">
            <p v-text="bmap.infoWindow.contents"></p>
            <!-- <button @click="clear">Clear</button> -->
          </bm-info-window>
          <!-- 区域搜索 -->
          <bm-local-search :keyword="bmap.localSearch.keyword" :auto-viewport="true"></bm-local-search>
        </baidu-map>
        
      </el-tab-pane>
      <el-tab-pane :name="view.listView.name">
        <span slot="label"><i :class="view.listView.icon">&nbsp;</i>{{view.listView.label}}</span>
        <equipment-monitoring></equipment-monitoring>
      </el-tab-pane>
      <el-tab-pane :name="view.dataView.name" v-if="view.dataView.stationId == 0 || !!view.dataView.stationId">
        <span slot="label"><i :class="view.dataView.icon">&nbsp;</i>{{view.dataView.label}}</span>
        <data-monitor :stationId="view.dataView.stationId"></data-monitor>
      </el-tab-pane>
      
    </el-tabs>
     
  </el-col>
</el-row>
<!-- 新增DTU弹框 -->
<add-dtu 
:show="addDTUDialog.show" 
:lat="addDTUDialog.lat" 
:lng="addDTUDialog.lng" 
@fail="addDTUFail" 
@success="addDTUSuccess"></add-dtu>
</div>
</template>

<script>
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
import CustomerNav from './components/CustomerNav.vue'
import AreaNav from './components/AreaNav.vue'
import AddDtu from './components/AddDTU.vue'
import EquipmentMonitoring from '../../equipmentMonitoring/index.vue'
import DataMonitor from '../../dataMonitor/index.vue'

import { putObj, getAll } from 'api/things/stations/index';
import { mapGetters } from 'vuex';
export default {
  name: 'menu',
  components: {
    BaiduMap,
    BmNavigation,
    BmMapType,
    BmMarker,
    BmLabel,
    BmPointCollection,
    BmInfoWindow,
    BmLocalSearch,
    CustomerNav,
    AreaNav,
    AddDtu,
    EquipmentMonitoring,
    DataMonitor
  },
  data() {
    return {
      // 带阴影边框类型的tab
      tabType: 'border-card',
      // 导航tab栏
      nav: {
        activeName: 'customerNav',
        customerNav: {
          icon: 'el-icon-date',
          label: '客户导航',
          name: 'customerNav'
        },
        areaNav: {
          icon: 'el-icon-date',
          label: '区域导航',
          name: 'areaNav'
        }
      },

      // 视图tab栏
      view: {
        activeName: 'mapView',
        mapView: {
          icon: 'el-icon-date',
          label: '设备地图',
          name: 'mapView'
        },
        listView: {
          icon: 'el-icon-date',
          label: '设备列表',
          name: 'listView'
        },
        dataView: {
          icon: 'el-icon-date',
          label: '数据监控',
          name: 'dataView',
          stationId: undefined
        }
      },

      // 百度地图配置
      bmap: {
        containerStyle: {
          height: '750px'
        },
        ak: 'gnLfRsEGqXzdG3huMaq9yGWTw7xpZ0nf',
        BMap: undefined,
        map: undefined,
        center: { lng: 116.404, lat: 39.915 },
        zoom: 15,
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
          //   position:{lng: 116.404, lat: 39.915},
          //   dragging:false,
          //   animation:"",//BMAP_ANIMATION_BOUNCE  跳跃的点类型
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

        // 地图上大量点时使用
        // points:{
        //   list:[],
        //   shape:"",
        //   color:"red",
        //   size:"BMAP_POINT_SIZE_SMALL"
        // },

      },
      // 运行修改地图上坐标位置状态
      enableChangeLationStatus: false,

      /**
       * 新增DTU弹框
       */
      notifyInstance: undefined,
      addDTUDisabled: false,
      addDTUDialog: {
        show: false,
        lng: '',
        lat: ''
      },

      // 子站列表数据
      stations: [],
      // 过滤后的子站数据
      f_stations: [],
      // 名称或编号
      nameOrSn: '',

      currentId: -1,
      areaManager_btn_add: false,
      areaManager_btn_edit: false,
      areaManager_btn_del: false
    }
  },
  watch: {
    filterText(val) {
      this.$refs.menuTree.filter(val);
    }
  },
  created() {
    this.example();
    this.areaManager_btn_add = this.elements['areaManager:btn_add'];
    this.areaManager_btn_del = this.elements['areaManager:btn_del'];
    this.areaManager_btn_edit = this.elements['areaManager:btn_edit'];
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  methods: {
    example() {
      this.$nextTick(() => {
        this.doSomethingElse();
      })
      $(window).on('resize', this.doSomethingElse);
    },
    doSomethingElse() {
      const $mapDom = $(this.$refs.mapDom.$el);
      const height = $(window).height() - $mapDom.offset().top - ($mapDom.outerHeight() - $mapDom.height());
      this.bmap.containerStyle.height = height + 'px';
      console.log('height' + height);
    },
    /**
     * 导航tab栏点击
     */
    navClick(tab, event) {
      console.log(tab, event);
    },

    /**
     * 自定义过滤查询方法
     */
    filterQuery(key) {
      const list = [];
      for (const item of this.stations) {
        if (item.totilName.search(key) > -1 || item.totilId.search(key) > -1) {
          list.push(item);
        }
      }
      this.f_stations = list;
    },

    /**
     * 选择搜索后的选项处理
     */
    handleSelect(station) {
      if (station && station.lng && station.lat) {
        this.panTo(station.lng, station.lat);
      }
    },

    /**
     * 点击搜索图标处理方法
     */
    handleIconClick() {

    },
    /**
     * 返回到默认位置
     */
    toHome() {
      this.panTo(116.413230, 39.918929);
    },

    /**
     * 添加DTU设备，打开新增弹出框
     */
    addDTU() {
      this.addDTUDisabled = true;
      this.notifyInstance = this.$notify({
        title: '进入新增DTU操作状态',
        message: '请点击地图选取坐标点！请关闭该窗口或保存后退出新增DTU操作状态！',
        duration: 0,
        onClose: () => {
          this.notifyInstance = undefined;
          this.exitAddOpt();
        }
      });
      const BMap = this.bmap.BMap;
      const map = this.bmap.map;
      let marker;
      map.addEventListener('click', e => {
        if (!this.addDTUDisabled) { return }
        // this.$message('坐标点：'+e.point.lng + "," + e.point.lat);
        if (marker) {
          map.removeOverlay(marker);
          marker = undefined;
        }
        // 创建标注
        marker = new BMap.Marker(e.point);
        // 将标注添加到地图中
        map.addOverlay(marker);
        // 跳动的动画
        marker.setAnimation(BMAP_ANIMATION_BOUNCE);

        // 打开编辑页面
        this.addDTUDialog.show = true;
        this.addDTUDialog.lng = e.point.lng;
        this.addDTUDialog.lat = e.point.lat;
      });
    },
    /**
     * 退出添加DTU操作
     * 关闭提示框或者保存后触发
     */
    exitAddOpt() {
      this.addDTUDisabled = false;
      const map = this.bmap.map;
      map.removeEventListener('click', () => {
        console.log('已移除事件');
      });
      this.addDTUDialog.show = false;
      this.notifyInstance && this.notifyInstance.close();
    },
    /**
     * 添加DTU成功后回调
     */
    addDTUSuccess(form) {
      this.addDTUDialog.show = false;
      // 退出添加操作
      this.exitAddOpt();
    },
    /**
     * 添加DTU失败或取消后回调
     */
    addDTUFail(status) {
      this.addDTUDialog.show = false;
      if (status == 1) {
        // 失败
        this.$message.error('添加DTU失败');
      }
    },

    /**
     * 百度地图初始化完成
     */
    bmapReady({ BMap, map }) {
      this.bmap.BMap = BMap;
      this.bmap.map = map;
      this.addPoints();
    },
    /**
     * 移动地图到指定子站位置
     * 即修改地图中心点
     *
     */
    changeCenter(station) {
      if (station && station.lat && station.lng) {
        this.panTo(station.lng, station.lat);
      }
    },
    /**
     * 地图中心移动到该点
     *
     */
    panTo(lng, lat) {
      const BMap = this.bmap.BMap;
      this.bmap.map.panTo(new BMap.Point(lng, lat));
    },
    /**
     * 显示数据监测点
     */
    showDataMonitor(station) {
      this.view.dataView.stationId = station.id;
      this.view.activeName = this.view.dataView.name;
    },

    /**
     * 支持修改地图上DTU设置位置
     */
    enableChangeLation() {
      if (this.enableChangeLationStatus) {
        this.bmap.points.forEach(element => {
          element.dragging = false;
        });
      } else {
        this.bmap.points.forEach(element => {
          element.dragging = true;
        });
      }
      this.enableChangeLationStatus = !this.enableChangeLationStatus;
    },
    /**
     * 点击地图上点处理方法
     */
    clickPointHandle(index) {
      // this.bmap.infoWindow.show = true;
    },
    dbClickPointHandle(index) {
      const point = this.bmap.points[index];
      this.showDataMonitor(point._data);
    },

    addPoints() {
      getAll().then(data => {
        this.stations = data;
        const points = [];
        for (const item of data) {
          if (item.lat && item.lng) {
            points.push({
              _data: item,
              position: { lng: item.lng, lat: item.lat },
              dragging: false,
              animation: ''
            });
          }
        }

        this.bmap.points = points;
      });
      // const points = [];
      // for (var i = 0; i < 1000; i++) {
      //   const position = {lng: Math.random() * 40 + 85, lat: Math.random() * 30 + 21}
      //   points.push(position)
      // }
      // this.bmap.points.list = points
    },

    infoWindowClose(e) {
      this.bmap.infoWindow.show = false
    },
    infoWindowOpen(e) {
      // this.bmap.infoWindow.show = true
    }
  },
  mounted() {

  }
}
</script>

<style scoped>
.bmap-view{
  
}
</style>



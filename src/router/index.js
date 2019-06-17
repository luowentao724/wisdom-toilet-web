import Vue from 'vue';
import Router from 'vue-router';
const _import = require('./_import_' + process.env.NODE_ENV);
// in development env not use Lazy Loading,because Lazy Loading large page will cause webpack hot update too slow.so only in production use Lazy Loading

Vue.use(Router);

/* layout */
import Layout from '../views/layout/Layout';

/**
 * icon : the icon show in the sidebar
 * hidden : if `hidden:true` will not show in the sidebar
 * redirect : if `redirect:noredirect` will no redirct in the levelbar
 * noDropdown : if `noDropdown:true` will has no submenu
 * meta : { role: ['admin'] }  will control the page role
 **/
export const constantRouterMap = [{
  path: '/login',
  component: _import('login/index'),
  hidden: true
},
{
  path: '/authredirect',
  component: _import('login/authredirect'),
  hidden: true
},
{
  path: '/404',
  component: _import('error/404'),
  hidden: true
},
{
  path: '/401',
  component: _import('error/401'),
  hidden: true
},
{
  path: '/',
  component: Layout,
  redirect: '/dashboard',
  name: '首页',
  hidden: true,
  children: [
  //   {
  //   path: 'dashboard',
  //   component: _import('dashboard/index')
  // },
    {
      path: 'dashboard',
      component: _import('things/gis/bmap/index'),
      name: '地图视图',
      icon: 'setting',
      authority: 'gis'
    }
  ]
},
{
  path: '/introduction',
  component: Layout,
  redirect: '/introduction/index',
  icon: 'form',
  noDropdown: true,
  children: [{
    path: 'index',
    component: _import('introduction/index'),
    name: '简述'
  }]
}
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
});

export const asyncRouterMap = [{
  path: '/baseManager',
  component: Layout,
  name: '基础配置管理',
  icon: 'setting',
  authority: 'baseManager',
  children: [{
    path: 'userManager',
    icon: 'fa-user',
    component: _import('admin/user/index'),
    name: '用户管理',
    authority: 'userManager'
  }, {
    path: 'menuManager',
    icon: 'category',
    component: _import('admin/menu/index'),
    name: '菜单管理',
    authority: 'menuManager'
  }, {
    path: 'groupManager',
    icon: 'group_fill',
    component: _import('admin/group/index'),
    name: '角色权限管理',
    authority: 'groupManager'
  }, {
    path: 'groupTypeManager',
    icon: 'fa-users',
    component: _import('admin/groupType/index'),
    name: '角色类型管理',
    authority: 'groupTypeManager'
  }, {
    path: 'gateLogManager',
    icon: 'viewlist',
    component: _import('admin/gateLog/index'),
    name: '操作日志管理',
    authority: 'gateLogManager'
  }]
},
{
  path: '/authManager',
  component: Layout,
  name: '服务权限管理',
  icon: 'setting',
  authority: 'authManager',
  children: [{
    path: 'serviceManager',
    component: _import('auth/service/index'),
    name: '服务管理',
    authority: 'serviceManager'
  }]
},
{
  path: '/monitorManager',
  component: Layout,
  name: '监控模块管理',
  icon: 'setting',
  authority: 'monitorManager',
  children: [{
    path: 'serviceEurekaManager',
    component: _import('monitor/eureka/index'),
    name: 'Eureka注册中心',
    authority: 'serviceEurekaManager'
  }, {
    path: 'serviceMonitorManager',
    component: _import('monitor/service/index'),
    name: '服务状态监控',
    authority: 'serviceMonitorManager'
  }, {
    path: 'serviceZipkinManager',
    component: _import('monitor/zipkin/index'),
    name: '服务状态监控',
    authority: 'serviceZipkinManager'
  }]
}, {
  path: '/sysManager',
  component: Layout,
  name: '系统管理',
  icon: 'setting',
  authority: 'sysManager',
  children: [
    {
      path: 'customerManager',
      component: _import('things/customer/index'),
      name: '客户管理',
      authority: 'customerManager'
    },
    {
      path: 'areaManager',
      component: _import('things/area/index'),
      name: '区域管理',
      authority: 'areaManager'
    },
    {
      path: 'attendanceManager',
      component: _import('things/attendance/index'),
      name: '考勤管理',
      authority: 'attendanceManager'
    },
    {
      path: 'dtuMemberManager',
      component: _import('things/dtuMember/index'),
      name: '员工管理',
      authority: 'dtuMemberManager'
    },
    {
      path: 'databaseManager',
      component: _import('things/database/index'),
      name: '数据库管理',
      authority: 'databaseManager'
    }
  ]
},
{
  path: '/deviceManager',
  component: Layout,
  name: '设备管理',
  icon: 'setting',
  authority: 'deviceManager',
  children: [
    {
      path: 'dataRuleManager',
      component: _import('things/dataRule/index'),
      name: '数据规则',
      authority: 'dataRuleManager'
    },
    {
      path: 'stationsManager',
      component: _import('things/stations/index'),
      name: '子站管理',
      authority: 'stationsManager'
    },
    {
      path: 'deviceSnManager',
      component: _import('things/deviceSn/index'),
      name: 'SN管理',
      authority: 'deviceSnManager'
    },
    {
      path: 'dtuConfigInfoManager',
      component: _import('things/dtuConfigInfo/index'),
      name: '系统参数配置',
      authority: 'dtuConfigInfoManager'
    },
    {
      path: 'statusMonitorManager',
      component: _import('things/statusMonitor/index'),
      name: '状态监控',
      authority: 'statusMonitorManager'
    },
    {
      path: 'trafficDataManager',
      component: _import('things/trafficData/index'),
      name: '流量统计',
      authority: 'trafficDataManager'
    },
    {
      path: 'alarmManager',
      component: _import('things/alarm/index'),
      name: '设备报警',
      authority: 'alarmManager'
    },
    {
      path: 'alarmHistoryManager',
      component: _import('things/alarmHistory/index'),
      name: '设备报警历史',
      authority: 'alarmHistoryManager'
    },
    { // 设备监控
      path: 'equipmentMonitoringManager',
      component: _import('things/equipmentMonitoring/index'),
      name: '设备监控',
      authority: 'equipmentMonitoringManager'
    },
    { // DTU数据监控
      path: 'dataMonitorManager',
      component: _import('things/dataMonitor/index'),
      name: 'DTU数据监控',
      authority: 'dataMonitorManager'
    },
    {
      path: 'gis',
      component: _import('things/gis/bmap/index'),
      name: '地图视图',
      icon: 'setting',
      authority: 'gis'
    }
  ]
},
{
  path: '/reportManager',
  component: Layout,
  name: '报表管理',
  icon: 'setting',
  authority: 'reportManager',
  children: [
    {
      path: 'energyReportManager',
      component: _import('things/energyReport/index'),
      name: '能耗分析报表',
      authority: 'energyReportManager'
    },
    {
      path: 'faultReportManager',
      component: _import('things/faultReport/index'),
      name: '故障分析报表',
      authority: 'faultReportManager'
    },
    {
      path: 'assetsReportManager',
      component: _import('things/assetsReport/index'),
      name: '资产分析报表',
      authority: 'assetsReportManager'
    }
  ]
}
];

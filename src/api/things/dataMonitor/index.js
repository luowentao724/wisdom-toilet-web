import fetch from 'utils/fetch';

// 获取变频器历史数据
export function getHistoryData(query) {
  return fetch({
    url: '/api/things/bumpVfRuninfoHistory/getHistoryData',
    method: 'get',
    params: query
  });
}

// 获取变频器历史曲线数据
export function getHistoryCurveData(query) {
  return fetch({
    url: '/api/things/bumpVfRuninfoHistory/getHistoryCurveData',
    method: 'get',
    params: query
  });
}

// 获取真空度变化曲线
export function getStationsRealDataInfo(query) {
  return fetch({
    url: '/api/things/realDataInfoHistory/getStationsRealDataInfo',
    method: 'get',
    params: query
  });
}

// 状态监控数据查询
export function statusMonitorPage(query) {
  return fetch({
    url: '/api/things/bumpVfRuninfoHistory/statusMonitorPage',
    method: 'get',
    params: query
  });
}

export function page(query) {
  return fetch({
    url: '/api/things/bumpVfRuninfoHistory/page',
    method: 'get',
    params: query
  });
}

export function getList(query) {
  return fetch({
    url: '/api/things/bumpVfRuninfoHistory/all',
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return fetch({
    url: '/api/things/bumpVfRuninfoHistory',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: '/api/things/bumpVfRuninfoHistory/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return fetch({
    url: '/api/things/bumpVfRuninfoHistory/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/api/things/bumpVfRuninfoHistory/' + id,
    method: 'put',
    data: obj
  })
}

export function getAll(query) {
  return fetch({
    url: '/api/things/bumpVfRuninfoHistory/all',
    method: 'get'
  });
}

export function getId(query) {
  return fetch({
    url: '/api/things/bumpVfRuninfoHistory/getId',
    method: 'get'
  });
}
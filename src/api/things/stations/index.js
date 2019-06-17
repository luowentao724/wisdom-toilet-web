import fetch from 'utils/fetch';

// 资产分析报表数据查询
export function getAssetsReport(query) {
  return fetch({
    url: '/api/things/stations/getAssetsReport',
    method: 'get',
    params: query
  });
}

// 子站数据监控查询
export function getDataMonitor(query) {
  return fetch({
    url: '/api/things/stations/getDataMonitor',
    method: 'get',
    params: query
  });
}


// 状态监控数据查询
export function statusMonitorPage(query) {
  return fetch({
    url: '/api/things/stations/statusMonitorPage',
    method: 'get',
    params: query
  });
}

export function page(query) {
  return fetch({
    url: '/api/things/stations/page',
    method: 'get',
    params: query
  });
}

export function getStationList(query) {
  return fetch({
    url: '/api/things/stations/all',
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return fetch({
    url: '/api/things/stations/add',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: '/api/things/stations/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return fetch({
    url: '/api/things/stations/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/api/things/stations/' + id,
    method: 'put',
    data: obj
  })
}

export function getAll(query) {
  return fetch({
    url: '/api/things/stations/all',
    method: 'get'
  });
}

export function getId(query) {
  return fetch({
    url: '/api/things/stations/getId',
    method: 'get'
  });
}
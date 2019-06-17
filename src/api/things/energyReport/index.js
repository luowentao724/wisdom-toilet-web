import fetch from 'utils/fetch';

// 能耗分析报表,查询当月每日数据
export function getTotilWashYearMonthDay(query) {
  return fetch({
    url: '/api/things/totilWashInfo/getTotilWashYearMonthDay',
    method: 'get',
    params: query
  });
}

// 数据报表,查询子站便器每日冲洗数据
export function getStationsTotilWashDay(query) {
  return fetch({
    url: '/api/things/totilWashInfo/getStationsTotilWashDay',
    method: 'get',
    params: query
  });
}



// 更新子站便器总冲洗次数
export function updateListTotil(query) {
  return fetch({
    url: '/api/things/toilet/updateList',
    method: 'post',
    data: query
  });
}

// 更新子站便器总冲洗次数
export function updateListPump(query) {
  return fetch({
    url: '/api/things/pumpStationData/updateList',
    method: 'post',
    data: query
  });
}

// 查询子站便器数量
export function getTotilNumPage(query) {
  return fetch({
    url: '/api/things/toilet/list',
    method: 'get',
    params: query
  });
}

// 查询泵站便器数量
export function getPumpStationDataList(query) {
  return fetch({
    url: '/api/things/pumpStationData/list',
    method: 'get',
    params: query
  });
}

export function page(query) {
  return fetch({
    url: '/api/things/totilWashInfo/page',
    method: 'get',
    params: query
  });
}

export function getStationList(query) {
  return fetch({
    url: '/api/things/totilWashInfo/all',
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return fetch({
    url: '/api/things/totilWashInfo',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: '/api/things/totilWashInfo/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return fetch({
    url: '/api/things/totilWashInfo/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/api/things/totilWashInfo/' + id,
    method: 'put',
    data: obj
  })
}

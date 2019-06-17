import fetch from 'utils/fetch';

// 流量统计分页数据查询
export function trafficPage(query) {
  return fetch({
    url: '/api/things/dataTraffic/trafficPage',
    method: 'get',
    params: query
  });
}

export function page(query) {
  return fetch({
    url: '/api/things/dataTraffic/page',
    method: 'get',
    params: query
  });
}

export function getStationList(query) {
  return fetch({
    url: '/api/things/dataTraffic/all',
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return fetch({
    url: '/api/things/dataTraffic',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: '/api/things/dataTraffic/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return fetch({
    url: '/api/things/dataTraffic/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/api/things/dataTraffic/' + id,
    method: 'put',
    data: obj
  })
}

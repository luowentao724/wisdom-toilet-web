import fetch from 'utils/fetch';


// 故障分析报表,查询当年每月数据
export function getAlarmYearMonth(query) {
  return fetch({
    url: '/api/things/concentAlarm/getAlarmYearMonth',
    method: 'get',
    params: query
  });
}

// 条件查询报警信息
export function faultReportPage(query) {
  return fetch({
    url: '/api/things/concentAlarm/faultReportPage',
    method: 'get',
    params: query
  });
}

export function page(query) {
  return fetch({
    url: '/api/things/concentAlarm/page',
    method: 'get',
    params: query
  });
}

export function getStationList(query) {
  return fetch({
    url: '/api/things/concentAlarm/all',
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return fetch({
    url: '/api/things/concentAlarm',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: '/api/things/concentAlarm/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return fetch({
    url: '/api/things/concentAlarm/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/api/things/concentAlarm/' + id,
    method: 'put',
    data: obj
  })
}

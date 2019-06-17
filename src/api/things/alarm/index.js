import fetch from 'utils/fetch';

export function searchPage(query) {
  return fetch({
    url: '/api/things/concentAlarm/searchPage',
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

import fetch from 'utils/fetch';

export function fetchTree(query) {
  return fetch({
    url: '/api/things/attendance/tree',
    method: 'get',
    params: query
  });
}

export function page(query) {
  return fetch({
    url: '/api/things/attendance/page',
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return fetch({
    url: '/api/things/attendance',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: '/api/things/attendance/' + id,
    method: 'get'
  });
}

export function delObj(id) {
  return fetch({
    url: '/api/things/attendance/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/api/things/attendance/' + id,
    method: 'put',
    data: obj
  })
}

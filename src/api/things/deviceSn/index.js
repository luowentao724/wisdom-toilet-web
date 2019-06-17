import fetch from 'utils/fetch';

export function fetchTree(query) {
  return fetch({
    url: '/api/things/deviceSn/tree',
    method: 'get',
    params: query
  });
}

export function page(query) {
  return fetch({
    url: '/api/things/deviceSn/page',
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return fetch({
    url: '/api/things/deviceSn',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: '/api/things/deviceSn/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return fetch({
    url: '/api/things/deviceSn/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/api/things/deviceSn/' + id,
    method: 'put',
    data: obj
  })
}

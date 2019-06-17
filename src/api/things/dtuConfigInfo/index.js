import fetch from 'utils/fetch';

export function getListAll() {
  return fetch({
    url: '/api/things/dtuConfigInfo/all',
    method: 'get'
  });
}

export function addObj(obj) {
  return fetch({
    url: '/api/things/dtuConfigInfo',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: '/api/things/dtuConfigInfo/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return fetch({
    url: '/api/things/dtuConfigInfo/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/api/things/dtuConfigInfo/' + id,
    method: 'put',
    data: obj
  })
}

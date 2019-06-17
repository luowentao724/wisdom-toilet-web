import fetch from 'utils/fetch';

export function fetchTree(query) {
  return fetch({
    url: '/api/things/area/tree',
    method: 'get',
    params: query
  });
}

export function page(query) {
  return fetch({
    url: '/api/things/area/page',
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return fetch({
    url: '/api/things/area',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: '/api/things/area/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return fetch({
    url: '/api/things/area/removeArea/' + id,
    method: 'delete',
    data: id
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/api/things/area/' + id,
    method: 'put',
    data: obj
  })
}

export function getAll(query) {
  return fetch({
    url: '/api/things/area/all',
    method: 'get'
  });
}
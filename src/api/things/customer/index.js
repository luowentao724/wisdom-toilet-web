import fetch from 'utils/fetch';

export function fetchTree(query) {
  return fetch({
    url: '/api/things/customer/tree',
    method: 'get',
    params: query
  });
}

export function page(query) {
  return fetch({
    url: '/api/things/customer/page',
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return fetch({
    url: '/api/things/customer',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: '/api/things/customer/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return fetch({
    url: '/api/things/customer/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/api/things/customer/' + id,
    method: 'put',
    data: obj
  })
}

export function getAll(query) {
  return fetch({
    url: '/api/things/customer/all',
    method: 'get'
  });
}
import fetch from 'utils/fetch';

export function page(query) {
  return fetch({
    url: '/api/things/smsDtuConfig/page',
    method: 'get',
    params: query
  });
}

export function getMessageList(query) {
  return fetch({
    url: '/api/things/smsDtuConfig/getList',
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return fetch({
    url: '/api/things/smsDtuConfig',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: '/api/things/smsDtuConfig/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return fetch({
    url: '/api/things/smsDtuConfig/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/api/things/smsDtuConfig/' + id,
    method: 'put',
    data: obj
  })
}

export function getAll(query) {
  return fetch({
    url: '/api/things/smsDtuConfig/all',
    method: 'get'
  });
}
import fetch from 'utils/fetch';

export function exportDatabase(query) {
  return fetch({
    url: '/api/things/database/export',
    method: 'get',
    params: query
  });
}
export function downloadFile(query) {
  return fetch({
    url: '/api/things/download/databaseFile',
    method: 'get',
    params: query
  });
}

export function page(query) {
  return fetch({
    url: '/api/things/database/page',
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return fetch({
    url: '/api/things/database',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: '/api/things/database/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return fetch({
    url: '/api/things/database/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/api/things/database/' + id,
    method: 'put',
    data: obj
  })
}

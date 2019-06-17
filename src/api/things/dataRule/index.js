import fetch from 'utils/fetch';

export function page(query) {
  return fetch({
    url: '/api/things/dataRule/page',
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return fetch({
    url: '/api/things/dataRule',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: '/api/things/dataRule/' + id,
    method: 'get'
  })
}

// 批量复制数据规则
export function cloneDataRuleIds(ids) {
  return fetch({
    url: '/api/things/dataRule/cloneDataRuleIds',
    method: 'get',
    params: ids
  })
}

// 批量删除数据规则
export function deleteIds(ids) {
  return fetch({
    url: '/api/things/dataRule/deleteIds',
    method: 'delete',
    params: ids
  })
}

export function delObj(id) {
  return fetch({
    url: '/api/things/dataRule/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/api/things/dataRule/' + id,
    method: 'put',
    data: obj
  })
}

export function getAll(query) {
  return fetch({
    url: '/api/things/dataRule/all',
    method: 'get'
  });
}
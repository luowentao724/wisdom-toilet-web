import fetch from 'utils/fetch';

// 向上移动方法
export function updateHandleUpMove(query) {
  return fetch({
    url: '/api/things/dataRuleRead/handleUpMove',
    method: 'get',
    params: query
  });
}

// 向下移动方法
export function updateHandleDownMove(query) {
  return fetch({
    url: '/api/things/dataRuleRead/handleDownMove',
    method: 'get',
    params: query
  });
}

export function queryDtuIdDataRuleRead(query) {
  return fetch({
    url: '/api/things/dataRuleRead/queryDtuIdDataRuleRead',
    method: 'get',
    params: query
  });
}

export function page(query) {
  return fetch({
    url: '/api/things/dataRuleRead/page',
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return fetch({
    url: '/api/things/dataRuleRead',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: '/api/things/dataRuleRead/' + id,
    method: 'get'
  })
}

// 批量删除读写数据
export function deleteIds(ids) {
  return fetch({
    url: '/api/things/dataRuleRead/deleteIds',
    method: 'delete',
    params: ids
  })
}

export function delObj(id) {
  return fetch({
    url: '/api/things/dataRuleRead/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/api/things/dataRuleRead/' + id,
    method: 'put',
    data: obj
  })
}

export function getAll(query) {
  return fetch({
    url: '/api/things/dataRuleRead/all',
    method: 'get'
  });
}
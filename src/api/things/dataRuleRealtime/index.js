import fetch from 'utils/fetch';

// 向上移动方法
export function updateHandleUpMove(query) {
  return fetch({
    url: '/api/things/dataRuleRealtime/handleUpMove',
    method: 'get',
    params: query
  });
}

// 向下移动方法
export function updateHandleDownMove(query) {
  return fetch({
    url: '/api/things/dataRuleRealtime/handleDownMove',
    method: 'get',
    params: query
  });
}

export function queryDtuIdDataRuleRealtime(query) {
  return fetch({
    url: '/api/things/dataRuleRealtime/queryDtuIdDataRuleRealtime',
    method: 'get',
    params: query
  });
}


export function page(query) {
  return fetch({
    url: '/api/things/dataRuleRealtime/page',
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return fetch({
    url: '/api/things/dataRuleRealtime',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: '/api/things/dataRuleRealtime/' + id,
    method: 'get'
  })
}

// 批量删除数据规则
export function deleteIds(ids) {
  return fetch({
    url: '/api/things/dataRuleRealtime/deleteIds',
    method: 'delete',
    params: ids
  })
}

export function delObj(id) {
  return fetch({
    url: '/api/things/dataRuleRealtime/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/api/things/dataRuleRealtime/' + id,
    method: 'put',
    data: obj
  })
}

export function getAll(query) {
  return fetch({
    url: '/api/things/dataRuleRealtime/all',
    method: 'get'
  });
}
import fetch from 'utils/fetch';

// 新增数据前过去id
export function getObjId() {
  return fetch({
    url: '/api/things/area/getId',
    method: 'get'
  })
}
// 根据type 字段获取 数据字典
export function getSystemDictType(query) {
  return fetch({
    url: '/api/things/systemDict/getSystemDictType',
    // responseType: 'blob',
    method: 'get',
    params: query
  })
}

// excel 导出
export function excelExport(obj) {
  return fetch({
    url: '/api/things/excel/export',
    responseType: 'blob',
    method: 'post',
    data: obj
  });
}
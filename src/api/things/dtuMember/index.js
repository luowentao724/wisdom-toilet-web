import fetch from 'utils/fetch';

export function page(query) {
  return fetch({
    url: '/api/things/dtuMember/page',
    method: 'get',
    params: query
  });
}

export function getJobTypeList() {
  return fetch({
    url: '/api/things/jobTypeInfo/all',
    method: 'get'
  });
}

export function addObj(obj) {
  return fetch({
    url: '/api/things/dtuMember',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: '/api/things/dtuMember/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return fetch({
    url: '/api/things/dtuMember/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/api/things/dtuMember/' + id,
    method: 'put',
    data: obj
  })
}

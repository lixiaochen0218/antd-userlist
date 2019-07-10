import request from '@/utils/request';

export  function fetch({page}) {
  return request(`/api/userlist/${page}`, { method: 'GET'});
}

export function remove(id) {
  return request(`/api/users/${id}`, {
    method: 'DELETE',
  });
}

export function add(data) {
  return request(`/api/users`, { method: 'POST'});
}

export function patch(id, values) {
  return request(`/api/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(values),
  });
}
import request from '@/utils/request';

export  function fetch({page}) {
  return request(`/api/userlist/${page}`, { method: 'GET'});
}

// export function remove(id) {
//   return request(`/api/users/${id}`, {
//     method: 'DELETE',
//   });
// }
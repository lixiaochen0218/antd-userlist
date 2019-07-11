import request from '@/utils/request';

export  function fetch({page}) {
  return request(`/api/userlist/${page}`, { method: 'GET'});
}

export function remove(id) {
  let ls = localStorage.getItem('userlist');
  let userlist = JSON.parse(ls);
  userlist = userlist.filter(user => user.id !== id);
//   console.log(userlist);
  if (userlist.length == 0) {
    localStorage.removeItem('userlist');
  } else {
    localStorage.setItem('userlist', JSON.stringify(userlist));
  }
  return true;
}

export function add(data) {
  let ls = localStorage.getItem('userlist');
  let userlist = JSON.parse(ls);
  if( !userlist ){
    userlist = [];
  } 
  data.id = Math.random() * 1000 
  userlist.push(data);
//   console.log(userlist)
  localStorage.setItem('userlist', JSON.stringify(userlist));
  return true;
}

export function patch(id, values) {
    let ls = localStorage.getItem('userlist');
    let userlist = JSON.parse(ls);
    userlist = userlist.filter(user => user.id !== id);
    values.id = id;
    userlist.push(values);
    localStorage.setItem('userlist', JSON.stringify(userlist));
  return true;
}
// import * as userListServices from '../services/userlist';
import * as userListServices from '../services/userlist2';

export default {
  namespace: 'userlist',
  state: {
    list: [],
    total: null,
    page: null,
  },
  reducers: {
    get(state, { payload: { data: list, total, page, query } }) {
      console.log(list);
      let lsuserlist = JSON.parse(localStorage.getItem("userlist"));
      if (lsuserlist) {
        list = list.concat(lsuserlist);
      }
      // const query = '.org';
      if (query) {
        list = list.filter(user => {
          if (user.name.includes(query)||user.email.includes(query)||user.website.includes(query)){
            return true;
          } else {
            return false;
          }
        })
      }
      return { ...state, list, total, page };
    },
  },
  effects: {
    *fetch({ payload: { page = 1 , query } }, { call, put }) {
      const data = yield call(userListServices.fetch, { page, query });
      yield put({
        type: 'get',
        payload: {
          data,
          total: 10,
          page: parseInt(page, 1),
          query,
        },
      });
    },
    *add({ payload: data }, { call, put, select }) {
      yield call(userListServices.add, data);
      const page = yield select(state => state.userlist.page);
      yield put({ type: 'fetch', payload: 1 });
    },
    *remove({ payload: id }, { call, put, select }) {
      yield call(userListServices.remove, id);
      const page = yield select(state => state.userlist.page);
      yield put({ type: 'fetch', payload: 1 });
    },
    *patch({ payload: { id, values } }, { call, put, select }) {
      yield call(userListServices.patch, id, values);
      const page = yield select(state => state.userlist.page);
      yield put({ type: 'fetch', payload: 1 });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/userlist') {
          dispatch({ type: 'fetch', payload: query });
        }
      });
    },
  },
};
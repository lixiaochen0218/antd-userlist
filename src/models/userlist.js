import * as userListService from '../services/userlist';

export default {
  namespace: 'userlist',
  state: {
    list: [],
    total: null,
    page: null,
  },
  reducers: {
    save(state, { payload: { data: list, total, page } }) {
      return { ...state, list, total, page };
    },
  },
  effects: {
    *fetch({ payload: { page = 1 } }, { call, put }) {
      const data = yield call(userListService.fetch, { page });
      yield put({
        type: 'save',
        payload: {
          data,
          total: 10,
          page: parseInt(page, 10),
        },
      });
    },
    *add({ payload: data }, { call, put }) {
      console.log("addd");
      console.log(data);
      yield call(userListServices.add, data);
      const page = yield select(state => state.userlist.page);
      yield put({ type: 'fetch', payload: { page } });
    },
    *remove({ payload: id }, { call, put, select }) {
      yield call(userListServices.remove, id);
      const page = yield select(state => state.userlist.page);
      yield put({ type: 'fetch', payload: { page } });
    },
    *patch({ payload: { id, values } }, { call, put, select }) {
      yield call(usersService.patch, id, values);
      const page = yield select(state => state.users.page);
      yield put({ type: 'fetch', payload: { page } });
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
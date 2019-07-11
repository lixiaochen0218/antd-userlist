import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Pagination,Divider, Popconfirm, Modal, Button } from 'antd';
import { routerRedux } from 'dva/router';
import styles from './UserList.css';
// import { PAGE_SIZE } from '../../constants';
import UserListEdit from './UserListEdit';

const PAGE_SIZE = 4;
const Modalvisible = false;

function UserList({ dispatch, list: dataSource, loading, total, page: current }) {
  console.log(dataSource);
  
  function deleteHandler(id) {
    dispatch({
      type: 'userlist/remove',
      payload: id,
    });
  }

  function pageChangeHandler(page) {
    dispatch(routerRedux.push({
      pathname: '/userlist',
      query: { page },
    }));
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Website',
      dataIndex: 'website',
      key: 'website',
      render: text => <a href={text}>{text}</a>,
    },
    {
      title: 'Operation',
      key: 'operation',
      render: (text, user) => (
        <span className={styles.operation}>
          <UserListEdit data={user}/>
          <Divider type="vertical" />
          <Popconfirm title="Confirm to delete?" onConfirm={deleteHandler.bind(null, user.id)}>
            <Button type="primary" disabled={user.id <= 10}>Delete</Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <div className={styles.normal}>
      <UserListEdit data={{}}/>
      <div>
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          rowKey={record => record.id}
          pagination={false}
        />
        <Pagination
          className="ant-table-pagination"
          total={total}
          current={current}
          pageSize={PAGE_SIZE}
          onChange={pageChangeHandler}
        />
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  const { list, total, page } = state.userlist;
  return {
    loading: state.loading.models.userlist,
    list,
    total,
    page,
  };
}

export default connect(mapStateToProps)(UserList);
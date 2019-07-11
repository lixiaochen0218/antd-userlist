import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Pagination,Divider, Popconfirm, Modal, Button, AutoComplete, Input, Icon, Badge, Tag } from 'antd';
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

  function handleSearch(query) {
    if (query.length >=3 || query.length == 0) {
      let page = 1;
      dispatch({
        type: 'userlist/fetch',
        payload: { page , query },
      });
    }
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      defaultSortOrder: 'descend',
      sortDirections: ['descend', 'ascend'],
      sorter: (a, b) => a.name.length - b.name.length,
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

  function expandedRowRender(row){
    if (row.id > 10) return false
    const columns = [
      { title: 'Username', dataIndex: 'username', key: 'username' },
      { title: 'Phone', dataIndex: 'phone', key: 'phone' },
      {
        title: 'Status',
        key: 'state',
        render: () => (
          <span>
            <Badge status="success" />
            Finished
          </span>
        ),
      },
      { title: 'Address', dataIndex: 'address', key: 'address' },
    ];

    const data = [];
    data.push({
      username : row.username,
      phone: row.phone,
      key: row.id,
      address: `${row.address.suite}  ${row.address.street} ${row.address.city}`
    })
    return <Table columns={columns} dataSource={data} pagination={false} />;
  };

  return (
    <div className={styles.normal}>
      <div style={{ display: '-webkit-inline-box' }}>
        <UserListEdit data={{}}/>
        <AutoComplete
          style={{ width: 200, 'marginLeft': '50px'}}
          onSearch={handleSearch}
          placeholder="Search here"
        >
            <Input suffix={<Icon type="search" className="certain-category-icon" />} />
        </ AutoComplete>
      </div>
      <div>
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          rowKey={record => record.id}
          pagination={false}
          expandedRowRender={expandedRowRender}
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
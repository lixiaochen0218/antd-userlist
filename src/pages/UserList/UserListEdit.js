import { Modal, Button, Form, Input, Tooltip, Icon,Divider, AutoComplete } from 'antd';
import { connect } from 'dva';

const AutoCompleteOption = AutoComplete.Option;
const { createFormField } = Form;

class UserListEdit extends React.Component {
  state = {
    visible: false,
    loading: false,
    confirmDirty: false,
    autoCompleteResult: [],
  };

  constructor(props) {
    super(props);
  }

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  handleSubmit = e => {
    const { dispatch } = this.props;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        let id = this.props.data.id;
        if (this.props.data.name) {
          dispatch({
            type: 'userlist/patch',
            payload: { id, values},
          });
        } else {
          dispatch({
            type: 'userlist/add',
            payload: values,
          });
        }
        this.handleCancel();
      }
    });
  };

  handleWebsiteChange = value => {
    let autoCompleteResult;
    if (!value) {
      autoCompleteResult = [];
    } else {
      autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
    }
    this.setState({ autoCompleteResult });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { autoCompleteResult } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };

    const websiteOptions = autoCompleteResult.map(website => (
      <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
    ));

    return (
      <div>
        <Button type="primary" onClick={this.showModal} style={{ marginBottom: 16 }}>
          {this.props.data.name ? "Edit" : "New User"}
        </Button>
        <Modal
          title={this.props.data.name ? `Edit User ID: ${this.props.data.id}` : `New User`}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={null}
        >
          <Form {...formItemLayout} onSubmit={this.handleSubmit}>
            <Form.Item
              label={
                <span>
                  UserName&nbsp;
              <Tooltip title="What do you want others to call you?">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('name',  { initialValue: this.props.data.name,
                rules: [{ required: true, message: 'Please input your User Name!', whitespace: true }],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="E-mail">
              {getFieldDecorator('email', { initialValue: this.props.data.email,
                rules: [
                  {
                    type: 'email',
                    message: 'The input is not valid E-mail!',
                  },
                  {
                    required: true,
                    message: 'Please input your E-mail!',
                  },
                ],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="Website">
              {getFieldDecorator('website', { initialValue: this.props.data.website,
                rules: [{ required: true, message: 'Please input website!' }],
              })(
                <AutoComplete
                  dataSource={websiteOptions}
                  onChange={this.handleWebsiteChange}
                  placeholder="website"
                >
                  <Input />
                </AutoComplete>,
              )}
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
              <Button key="back" onClick={this.handleCancel}>
                Cancel
              </Button>
              <Divider type="vertical" />
              <Button type="primary" htmlType="submit" disabled={this.props.data.id <= 10}>
                {this.props.data.name ? "Save" : "Create"}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div >
    );
  }
}

const WrappedUserListEditForm = Form.create({ name: 'useredit'})(UserListEdit);

export default connect()(WrappedUserListEditForm);
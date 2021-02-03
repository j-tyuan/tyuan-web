import React from 'react';
import {Button, Drawer, Form, Input, Space} from 'antd';
import Settings from "../../../../../config/defaultSettings";
import {FormInstance} from "antd/es/form";
import TextArea from "antd/es/input/TextArea";
import KBPassword from "@/pages/auth/userManage/components/KBPassword";
import {useIntl} from "umi";
import {TableListItem} from "../data";

interface UpdateFormProps {
  modalVisible: boolean;
  onClose: () => void;
  values: Object;
  onSubmit: (values: TableListItem) => Promise<void>;
}

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const {modalVisible, onClose} = props;
  const formRef = React.createRef<FormInstance>();

  return (
    <Drawer
      destroyOnClose
      title="编辑"
      width={Settings.form.drawer.width}
      visible={modalVisible}
      onClose={() => onClose()}
      footer={null}
    >
      <Form ref={formRef}
            {...Settings.form.formItemLayout}
            name="control-ref"
            labelAlign="right"
            initialValues={
              props.values
            }
            onFinish={props.onSubmit}
            layout="horizontal"
      >
        <Form.Item
          hidden
          name="id">
          <Input/>
        </Form.Item>
        <Form.Item
          name="account" label="登陆账号" rules={[{required: true}]}>
          <Input/>
        </Form.Item>
        <Form.Item name="password" label="密码">
          <KBPassword onChange={(e) => {
            // @ts-ignore
            formRef.current.setFieldsValue({password: e})
          }}/>
        </Form.Item>
        <Form.Item
          name="name" label="用户名称" rules={[{required: true}]}>
          <Input/>
        </Form.Item>
        <Form.Item
          name="phone" label="手机号" rules={[{required: true}]}>
          <Input/>
        </Form.Item>
        <Form.Item
          name="email" label="电子邮箱">
          <Input/>
        </Form.Item>
        <Form.Item
          name="remarks" label="备注">
          <TextArea/>
        </Form.Item>
        <Form.Item>
          <Space>
            <Button htmlType="button" onClick={() => onClose()}>
              {useIntl().formatMessage({id: 'app.form.cancel'})}
            </Button>
            <Button type="primary" htmlType="submit">
              {useIntl().formatMessage({id: 'app.form.submit'})}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default UpdateForm;

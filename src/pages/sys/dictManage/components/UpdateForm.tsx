import React from 'react';
import {Button, Drawer, Form, Input, Select, Space} from 'antd';
import {TableListItem} from '../data';
import {FormInstance} from "antd/es/form";
import Settings from "../../../../../config/defaultSettings";
import {useIntl} from "umi";
import {Option} from "antd/es/mentions";


export interface UpdateFormProps {
  onClose: (flag?: boolean, formVals?: TableListItem) => void;
  onSubmit: (values: TableListItem) => Promise<void>;
  modalVisible: boolean;
  types: Object;
  values: Partial<TableListItem>;
}

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const {modalVisible, onClose} = props;
  const formRef = React.createRef<FormInstance>();

  return (
    <Drawer
      title="字典配置"
      width={Settings.form.drawer.width}
      visible={modalVisible}
      onClose={() => onClose()}
      destroyOnClose
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
          name="label" label="字典标签" rules={[{required: true}]}>
          <Input/>
        </Form.Item>
        <Form.Item name="value" label="字典值" rules={[{required: true}]}>
          <Input.TextArea/>
        </Form.Item>
        <Form.Item name="type" label="字典类型">
          <Select>
            {
              Object.keys(props.types).map(item => (
                <Option value={item}>{props.types[item]}</Option>
              ))
            }
          </Select>
        </Form.Item>
        <Form.Item name="description" label="描述">
          <Input.TextArea/>
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
  )
};

export default UpdateForm;

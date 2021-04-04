import React, {useState} from 'react';
import {Button, Drawer, Form, Input, message, Select, Space} from 'antd';
import {TableListItem} from '../data';
import {FormInstance} from "antd/es/form";
import Settings from "../../../../../config/defaultSettings";
import {useIntl} from "umi";
import {Option} from "antd/es/mentions";
import {update} from "@/pages/sys/dictManage/service";

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: TableListItem) => {
  const hide = message.loading('正在配置');
  try {
    const v = await update({...fields});
    hide();
    if (v.errorCode === -1) {
      message.success('配置成功');
      return true;
    }
    return false;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};

export interface UpdateFormProps {
  onClose: (flag?: boolean, formVals?: TableListItem) => void;

  onFinish: (success: boolean) => void;
  modalVisible: boolean;
  types: Object;
  values: Partial<TableListItem>;
}

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const {modalVisible, onClose, onFinish} = props;
  const formRef = React.createRef<FormInstance>();
  const [loading, setLoading] = useState<boolean>(false);

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
            onFinish={(e) => {
              setLoading(true)
              const promise = handleUpdate(e);
              promise.then(result => {
                if (result) {
                  onClose();
                }
                onFinish(result)
                setLoading(false)
              })
            }}
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
                <Select.Option key={item} value={item}>{props.types[item]}</Select.Option>
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
            <Button type="primary" htmlType="submit" loading={loading}>
              {useIntl().formatMessage({id: 'app.form.submit'})}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Drawer>
  )
};

export default UpdateForm;

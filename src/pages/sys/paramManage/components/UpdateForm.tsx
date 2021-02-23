import React, {useState} from 'react';
import {Button, Drawer, Form, Input, message, Radio, Space} from 'antd';
import {TableListItem} from '../data';
import {FormInstance} from "antd/es/form";
import Settings from "../../../../../config/defaultSettings";
import {useIntl} from "umi";
import {update} from "@/pages/sys/paramManage/service";


export interface UpdateFormProps {
  onClose: (flag?: boolean, formVals?: TableListItem) => void;
  onFinish: (success: boolean) => void;
  modalVisible: boolean;
  values: Partial<TableListItem>;
}

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

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const {modalVisible, onClose,onFinish} = props;
  const [loading, setLoading] = useState<boolean>(false);
  const formRef = React.createRef<FormInstance>();

  return (
    <Drawer
      title="参数配置"
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
          name="paramName" label="参数名称" rules={[{required: true}]}>
          <Input/>
        </Form.Item>
        <Form.Item name="paramKey" label="参数健">
          <span className="ant-form-text">{props.values.paramKey}</span>
        </Form.Item>
        <Form.Item name="isSys" label="是否系统参数" rules={[{required: true}]}>
          <Radio.Group>
            <Radio value>是</Radio>
            <Radio value={false}>否</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="paramVal" label="参数值" rules={[{required: true}]}>
          <Input.TextArea/>
        </Form.Item>
        <Form.Item name="remarks" label="描述">
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

import React, {Key, useState} from 'react';
import {Button, Drawer, Form, Input, message, Radio, Space, Tree} from 'antd';
import Settings from "../../../../../config/defaultSettings";
import TextArea from "antd/es/input/TextArea";
import {useIntl} from "umi";
import {FormInstance} from "antd/es/form";
import {TableListItem} from "../data";
import {add} from "@/pages/auth/roleManage/service";

interface CreateFormProps {
  modalVisible: boolean;
  onClose: () => void;
  permission: any[];
  oneLevelIds: Key[];
  onFinish: (success: boolean) => void;
}

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: TableListItem) => {
  const hide = message.loading('正在添加');
  try {
    const v = await add({...fields});
    hide();
    if (v.errorCode === -1) {
      message.success('添加成功');
      return true;
    }
    return false;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const {modalVisible, onClose, permission, oneLevelIds,onFinish} = props;
  const formRef = React.createRef<FormInstance>();
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <Drawer
      destroyOnClose
      title="添加角色"
      width={Settings.form.drawer.width}
      visible={modalVisible}
      onClose={() => onClose()}
      footer={null}
    >
      <Form ref={formRef}
            {...Settings.form.formItemLayout}
            name="control-ref"
            labelAlign="right"
            onFinish={(e) => {
              setLoading(true)
              const promise = handleAdd(e);
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
          name="code" label="角色编码" rules={[{required: true}]}>
          <Input/>
        </Form.Item>
        <Form.Item name="name" label="角色名称" rules={[{required: true}]}>
          <Input/>
        </Form.Item>

        <Form.Item
          name="useable" label="是否启用" rules={[{required: true}]}>
          <Radio.Group>
            <Radio value>是</Radio>
            <Radio value={false}>否</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="permissionIds" label="选择权限">
          <Tree defaultExpandedKeys={oneLevelIds} checkable treeData={permission} onCheck={(e) => {
            // @ts-ignore
            formRef.current.setFieldsValue({permissionIds: e})
          }}/>
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
            <Button type="primary" htmlType="submit" loading={loading}>
              {useIntl().formatMessage({id: 'app.form.submit'})}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default CreateForm;

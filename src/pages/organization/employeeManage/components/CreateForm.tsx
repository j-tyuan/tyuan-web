import React, {useEffect, useState} from 'react';
import {Button, Cascader, Drawer, Form, Input, message, Space} from 'antd';
import Settings from "../../../../../config/defaultSettings";
import {FormInstance} from "antd/es/form";
import TextArea from "antd/es/input/TextArea";
import {useIntl} from "umi";
import {TableListItem} from "@/pages/organization/employeeManage/data";
import {add} from "@/pages/organization/employeeManage/service";

interface CreateFormProps {
  modalVisible: boolean;
  onClose: () => void;
  institutions: any[]
  onFinish: (result: any) => void;
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

    return null;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');

    return false;
  }
};

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const {modalVisible, onClose, onFinish, institutions} = props;
  const [loading, setLoading] = useState<boolean>(false);
  const formRef = React.createRef<FormInstance>();

  useEffect(() => {

  }, [])

  return (
    <Drawer
      destroyOnClose
      title="编辑员工信息"
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
          hidden
          name="id">
          <Input/>
        </Form.Item>
        <Form.Item name="instId" rules={[{required: true}]} hidden><Input/></Form.Item>
        <Form.Item name="empNameEn" label="员工名称" rules={[{required: true}]}><Input/></Form.Item>
        <Form.Item name="empName" label="英文名称"><Input/></Form.Item>
        <Form.Item name="temporaryInstId" label="所属机构" rules={[{required: true}]}>
          <Cascader changeOnSelect options={institutions} onChange={(value,a) => {
            if (formRef.current) {
              formRef.current.setFieldsValue({instId: value[value.length - 1]})
            }
          }} fieldNames={{label: "instName", value: "id"}}/>
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

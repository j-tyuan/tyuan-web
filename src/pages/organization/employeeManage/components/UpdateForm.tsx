import React, {useEffect, useState} from 'react';
import {Button, Cascader, Drawer, Form, Input, message, Space} from 'antd';
import Settings from "../../../../../config/defaultSettings";
import {FormInstance} from "antd/es/form";
import TextArea from "antd/es/input/TextArea";
import {useIntl} from "umi";
import {TableListItem} from "../data";
import {update} from "@/pages/auth/userManage/service";
import {findParentPath, findParentPathIds} from "@/utils/utils";

interface UpdateFormProps {
  modalVisible: boolean;
  onClose: () => void;
  values: TableListItem;
  onFinish: (success: boolean) => void;
  institutions: any[];
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
      message.success('修改成功');
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
  const {modalVisible, onClose, onFinish, values, institutions} = props;
  const [loading, setLoading] = useState<boolean>(false);
  const formRef = React.createRef<FormInstance>();

  useEffect(() => {
    const paths = findParentPathIds(values.instId, [...institutions]);
    // 反显
    if (formRef.current) {
      // temporaryParentId 临时变量，为了反显，不保存
      formRef.current.setFieldsValue({temporaryInstId: [...paths]})
      formRef.current.setFieldsValue({instId: paths[paths.length - 1]})
    }
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
        <Form.Item name="instId" rules={[{required: true}]} hidden>
          <Input/>
        </Form.Item>

        <Form.Item name="empNo" label="员工编号">{values.empNo}</Form.Item>
        <Form.Item name="empName" label="员工名称"><Input/></Form.Item>
        <Form.Item name="temporaryInstId" label="所属机构">
          <Cascader changeOnSelect options={institutions} onChange={(value) => {
            if (formRef.current) {
              formRef.current.setFieldsValue({parentId: value[value.length - 1]})
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

export default UpdateForm;

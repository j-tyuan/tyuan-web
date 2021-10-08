import React, {useEffect, useState} from 'react';
import {Button, Cascader, Drawer, Form, Input, message, Radio, Space} from 'antd';
import {TableListItem} from '../data';
import {FormInstance} from "antd/es/form";
import Settings from "../../../../../config/defaultSettings";
import {useIntl} from "umi";
import {update} from "../service";
import {InputNumber} from "antd/es";
import {findParentPathIds, recursionTree} from "@/utils/utils";
import UserSelect from "@/components/UserSelect";


export interface UpdateFormProps {
  onClose: (flag?: boolean, formVals?: TableListItem) => void;
  onFinish: (success: boolean) => void;
  modalVisible: boolean;
  values: Partial<TableListItem>;
  institutions?: any[]
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
  const {modalVisible, onClose, onFinish, values, institutions} = props;
  const {parentId, id} = values;

  const [loading, setLoading] = useState<boolean>(false);
  const formRef = React.createRef<FormInstance>();

  useEffect(() => {
    let item = {disabled: false};
    if (institutions) {
      recursionTree(institutions, (val: any) => {
        if (val.id === id) {
          item = val;
        }
      })
      item.disabled = true;
    }
    return () => {
      // 还原显示
      item.disabled = false;
    }
  }, [id])
  return (
    <Drawer
      destroyOnClose
      title="修改机构"
      width={Settings.form.drawer.width}
      visible={modalVisible}
      afterVisibleChange={(visible) => {
        if (institutions && visible) {
          const paths = findParentPathIds(parentId, institutions);
          // 反显
          if (formRef.current) {
            // temporaryParentId 临时变量，为了反显，不保存
            formRef.current.setFieldsValue({temporaryParentId: [...paths]})
            formRef.current.setFieldsValue({parentId: paths[paths.length - 1]})
          }
        }
      }}
      onClose={() => onClose()}
      footer={null}
    >
      <Form ref={formRef}
            {...Settings.form.formItemLayout}
            name="control-ref"
            labelAlign="right"
            initialValues={values}
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
        <Form.Item name="id" rules={[{required: true}]} hidden>
          <Input/>
        </Form.Item>
        <Form.Item name="parentId" rules={[{required: true}]} hidden>
          <Input/>
        </Form.Item>

        <Form.Item
          name="instCode" label="机构编码" rules={[{required: true}]}>
          <Input/>
        </Form.Item>
        <Form.Item
          name="instName" label="机构名称" rules={[{required: true}]}>
          <Input/>
        </Form.Item>
        <Form.Item name="temporaryParentId" label="上级部门" rules={[{required: true}]}>
          <Cascader changeOnSelect options={institutions} onChange={(value) => {
            if (formRef.current) {
              formRef.current.setFieldsValue({parentId: value[value.length - 1]})
            }
          }} fieldNames={{label: "instName", value: "id"}}/>
        </Form.Item>
        <Form.Item name="ownerUserId" label="负责人" rules={[{required: true}]}>
          <UserSelect uid={values.ownerUserId} onChange={(data) => {
            if (formRef.current) {
              formRef.current.setFieldsValue({ownerUserId: data})
            }
          }}/>
        </Form.Item>
        <Form.Item name="instType" label="机构类型" rules={[{required: true}]}>
          <Radio.Group>
            <Radio value={0}>公司</Radio>
            <Radio value={1}>部门</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="instStatus" label="机构状态" rules={[{required: true}]}>
          <Radio.Group>
            <Radio value={0}>启用</Radio>
            <Radio value={1}>禁用</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="instSort" label="排序" rules={[{required: true}]}>
          <InputNumber/>
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
  );
};
export default UpdateForm;

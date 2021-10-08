import React, {useState} from 'react';
import {Button, Cascader, Drawer, Form, Input, InputNumber, message, Radio, Space} from 'antd';
import Settings from "../../../../../config/defaultSettings";
import {FormInstance} from "antd/es/form";
import PermissionTreeSelect from "@/components/PermissionTreeSelect";
import TextArea from "antd/es/input/TextArea";
import {TableListItem} from "../data";
import {useIntl} from "umi";
import {updateSource} from "../service";
import {findParentPathIds} from "@/utils/utils";

interface CreateFormProps {
  permission: Object;
  modalVisible: boolean;
  onFinish: (success: boolean) => void;
  onClose: () => void;
  values: Partial<TableListItem>;
  dataSources?: any[];
}

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: TableListItem) => {
  const hide = message.loading('正在配置');
  try {
    const v = await updateSource({...fields});
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

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const {modalVisible, onClose, onFinish, dataSources, values} = props;
  const formRef = React.createRef<FormInstance>();
  const [permissionId, setPermissionId] = useState()
  const [loading, setLoading] = useState<boolean>(false);
  const [newSources, setNewSources] = useState<any[]>()

  return (
    <Drawer
      destroyOnClose
      title="添加资源"
      width={Settings.form.drawer.width}
      visible={modalVisible}
      onClose={() => onClose()}
      footer={null}
      afterVisibleChange={() => {
        if (dataSources) {
          const var1 = [{
            sourceName: "跟节点",
            id: 0,
            children: [...dataSources]
          }]
          setNewSources([...var1]);
          const paths = findParentPathIds(values.parentId, [...var1]);
          // 反显
          if (formRef.current) {
            // temporaryParentId 临时变量，为了反显，不保存
            formRef.current.setFieldsValue({temporaryParentId: [...paths]})
            formRef.current.setFieldsValue({parentId: paths[paths.length - 1]})
          }
        }
      }}
    >
      <Form ref={formRef}
            initialValues={values}
            {...Settings.form.formItemLayout}
            name="control-ref"
            labelAlign="right"
            layout="horizontal"
            onFinish={(e) => {
              setLoading(true)
              e["permissionId "] = permissionId;
              const promise = handleUpdate(e);
              promise.then(result => {
                if (result) {
                  onClose();
                }
                onFinish(result)
                setLoading(false)
              })
            }}
      >
        <Form.Item name="parentId" hidden rules={[{required: true}]}>
          <Input/>
        </Form.Item>
        <Form.Item name="id" hidden/>
        <Form.Item name="sourceName" label="资源名称" rules={[{required: true}]}>
          <Input/>
        </Form.Item>
        <Form.Item name="isLeaf" label="子节点">
          <Radio.Group>
            <Radio value>是</Radio>
            <Radio value={false}>否</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="isShow" label="显示">
          <Radio.Group>
            <Radio value>是</Radio>
            <Radio value={false}>否</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="sourceHref" label="href">
          <Input/>
        </Form.Item>
        <Form.Item name="sourceTarget" label="target">
          <Input/>
        </Form.Item>
        <Form.Item name="sourceSort" label="排序" rules={[{required: true}]}>
          <InputNumber/>
        </Form.Item>
        <Form.Item name="temporaryParentId" label="上级节点" rules={[{required: true}]}>
          <Cascader changeOnSelect options={newSources} onChange={(value) => {
            if (formRef.current) {
              formRef.current.setFieldsValue({temporaryParentId: value})
              formRef.current.setFieldsValue({parentId: value[value.length - 1]})
            }
          }} fieldNames={{label: "sourceName", value: "id"}}/>
        </Form.Item>
        <Form.Item name="permissionId" label="权限配置" rules={[{required: true}]}>
          <PermissionTreeSelect
            initialIds={props.values.permissionId}
            permission={props.permission}
            onChange={(permissions: any) => {
              setPermissionId(permissions[0])
            }}/>
        </Form.Item>
        <Form.Item name="sourceIcon" label="图标">
          <Input/>
        </Form.Item>
        <Form.Item name="remarks" label="备注">
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

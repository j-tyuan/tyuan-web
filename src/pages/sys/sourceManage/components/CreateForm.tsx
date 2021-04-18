import React, {useState} from 'react';
import {Button, Cascader, Drawer, Form, Input, InputNumber, message, Radio, Space} from 'antd';
import Settings from "../../../../../config/defaultSettings";
import {FormInstance} from "antd/es/form";
import PermissionTreeSelect from "@/components/PermissionTreeSelect";
import TextArea from "antd/es/input/TextArea";
import {TableListItem} from "../data";
import {useIntl} from "umi";
import {findParentPathIds} from "@/utils/utils";
import {addSouce} from "../service";

interface CreateFormProps {
  permission: Object;
  modalVisible: boolean;
  onFinish: (success: boolean) => void;
  onClose: () => void;
  dataSource?: any[];
  parentId?: any;
}

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: TableListItem) => {
  const hide = message.loading('正在添加');
  try {
    const v = await addSouce({...fields});
    hide();
    if (v.errorCode === -1) {
      message.success('添加成功');
      return true;
    }
    return false;
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};


const CreateForm: React.FC<CreateFormProps> = (props) => {
  const {modalVisible, onClose, onFinish, dataSource, parentId} = props;
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
        if (dataSource) {
          const var1 = [{
            name: "跟节点",
            id: 0,
            children: [...dataSource]
          }]
          setNewSources([...var1]);
          if (parentId !== undefined || parentId !== null) {
            const paths = findParentPathIds(parentId, [...var1]);
            // 反显
            if (formRef.current) {
              // temporaryParentId 临时变量，为了反显，不保存
              formRef.current.setFieldsValue({temporaryParentId: [...paths]})
              formRef.current.setFieldsValue({parentId: paths[paths.length - 1]})
            }
          }
        }
      }}
    >
      <Form ref={formRef}
            {...Settings.form.formItemLayout}
            name="control-ref"
            labelAlign="right"
            layout="horizontal"
            onFinish={(e) => {
              setLoading(true)
              e["permissionId "] = permissionId;
              const promise = handleAdd(e);
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

        <Form.Item name="sourceName" label="资源名称" rules={[{required: true}]}>
          <Input/>
        </Form.Item>
        <Form.Item name="isLeaf" label="子节点" initialValue={1}>
          <Radio.Group value={1}>
            <Radio value={1}>是</Radio>
            <Radio value={0}>否</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="isShow" label="显示" initialValue={1}>
          <Radio.Group value={1}>
            <Radio value={1}>是</Radio>
            <Radio value={0}>否</Radio>
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
          <PermissionTreeSelect permission={props.permission} onChange={(permissions: any) => {
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

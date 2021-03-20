import React, {useEffect, useState} from 'react';
import {Button, Cascader, Drawer, Form, Input, message, Space} from 'antd';
import Settings from "../../../../../config/defaultSettings";
import {FormInstance} from "antd/es/form";
import TextArea from "antd/es/input/TextArea";
import KBPassword from "@/pages/auth/userManage/components/KBPassword";
import {useIntl} from "umi";
import {TableListItem} from "../data";
import {update, uploadUserAvatarAction} from "@/pages/auth/userManage/service";
import {findParentPathIds} from "@/utils/utils";
import UploadAvatar from "@/pages/auth/userManage/components/UploadAvatar";
import RoleSelect from "@/pages/auth/userManage/components/RoleSelect";

interface UpdateFormProps {
  modalVisible: boolean;
  onClose: () => void;
  values: TableListItem;
  onFinish: (success: boolean) => void;
  institutions: any[];
  roles?: any[];
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
  const {modalVisible, onClose, onFinish, institutions, values, roles} = props;
  const [loading, setLoading] = useState<boolean>(false);
  const formRef = React.createRef<FormInstance>();
  useEffect(() => {
    const paths = findParentPathIds(values.instId, [...institutions]);
    // 反显
    if (formRef.current) {
      // temporaryParentId 临时变量，为了反显，不保存
      formRef.current.setFieldsValue({temporaryInstId: [...paths]})
    }
  }, [])

  return (
    <Drawer
      destroyOnClose
      title="编辑管理员"
      width={800}
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
        <Form.Item hidden name="id"><Input/></Form.Item>
        <Form.Item name="instId" hidden><Input/></Form.Item>
        <Form.Item name="account" label="登陆账号" rules={[{required: true}]}><Input/></Form.Item>
        <Form.Item name="password" label="密码">
          <KBPassword onChange={(e) => {
            // @ts-ignore
            formRef.current.setFieldsValue({password: e})
          }}/>
        </Form.Item>
        <Form.Item name="temporaryInstId" label="所属机构" rules={[{required: true}]}>
          <Cascader changeOnSelect options={institutions} onChange={(value) => {
            if (formRef.current) {
              formRef.current.setFieldsValue({instId: value[value.length - 1]})
            }
          }} fieldNames={{label: "instName", value: "id"}}/>
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
        <Form.Item name="avatarId" label="头像">
          <UploadAvatar avatarUrl={values.avatar} action={uploadUserAvatarAction} onUploadBack={(request) => {
            if (formRef.current && request.errorCode === -1) {
              formRef.current.setFieldsValue({
                avatarId: request.data
              })
            }
          }}/>
        </Form.Item>
        <Form.Item name="roleIds" label="选择角色">
          <RoleSelect roles={roles} uid={values.id} onChange={(ids) => {
            if (formRef.current) {
              formRef.current.setFieldsValue({
                roleIds: ids
              })
            }
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

export default UpdateForm;

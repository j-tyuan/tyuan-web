import { UserOutlined } from '@ant-design/icons';
import { Avatar, Divider, message, Modal, Tooltip } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { ActionType, ProColumns } from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { TableListItem } from './data';
import { disable, remove } from './service';
import KBPassword from './components/KBPassword';
import Authorized from '@/utils/Authorized';
import { getInstAll } from '@/pages/organization/institutionManage/service';
import { findParentPath } from '@/utils/utils';
import { loadRoles } from '../roleManage/service';
import ProUserTable from '@/components/ProUserTable';

const handleDisable = async (row: TableListItem) => {
  const hide = message.loading('正在操作');
  try {
    const v = await disable(row.id, row.disabled ? 0 : 1);
    hide();
    if (v.errorCode === -1) {
      message.success('操作成功');

      return true;
    }

    return null;
  } catch (error) {
    hide();
    message.error('操作失败，请重试');

    return false;
  }
};

/**
 *  删除节点
 * @param selectedRows
 * @param actionRef
 */
const handleRemove = async (selectedRows: TableListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    const v = await remove({
      id: selectedRows.map((row) => row.id),
    });
    hide();
    if (v.errorCode === -1) {
      message.success('删除成功');
      return true;
    }
    return null;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const TableList: React.FC<{}> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [updateFormValues, setUpdateFormValues] = useState<any>({});
  const actionRef = useRef<ActionType>();
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>();
  const loadInstitutions = () => {
    const promise = getInstAll();
    promise.then((e) => {
      const { errorCode, data } = e;
      if (errorCode === -1 && data) {
        setInstitutions([...data]);
      }
    });
  };

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '员工编号',
      dataIndex: 'userNo',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '必填项',
          },
        ],
      },
    },
    {
      title: '登陆账号',
      dataIndex: 'account',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '必填项',
          },
        ],
      },
    },
    {
      title: '密码',
      dataIndex: 'password',
      search: false,
      hideInTable: true,
      valueType: 'password',
      renderFormItem(item, config, form) {
        return (
          <KBPassword
            onChange={(e) => {
              form.setFieldsValue({
                password: e,
              });
            }}
          />
        );
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: '必填项',
          },
        ],
      },
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      search: false,
      hideInForm: true,
      render(_) {
        return <Avatar shape="circle" size={32} icon={<UserOutlined />} src={_} />;
      },
    },
    {
      title: '用户名称',
      dataIndex: 'name',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '必填项',
          },
        ],
      },
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '必填项',
          },
          {
            pattern: new RegExp('^1(3|4|5|7|8)\\d{9}$'),
            message: '格式不正确',
          },
        ],
      },
    },
    {
      title: '电子邮箱',
      search: false,
      dataIndex: 'email',
      formItemProps: {
        rules: [
          {
            pattern: new RegExp(
              '^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)*\\.[a-zA-Z0-9]{2,6}$',
            ),
            message: '格式不正确',
          },
        ],
      },
    },
    {
      title: '所属机构',
      dataIndex: 'instName',
      render(_, item) {
        const insts = findParentPath(item.instId, [...institutions]);
        const names: any[] = [];
        insts.forEach((e) => {
          names.push(e.instName);
        });
        return (
          <Tooltip placement="left" title={`${names.join('/')}`}>
            <a type="link">{_}</a>
          </Tooltip>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'disabled',
      valueType: 'switch',
      hideInForm: true,
      search: false,
      render: (_, record) => <>{record.disabled ? '禁用' : '启用'}</>,
    },
    {
      title: '最后登陆时间',
      dataIndex: 'loginDate',
      valueType: 'dateTime',
      hideInForm: true,
    },
    {
      title: '描述',
      dataIndex: 'remarks',
      valueType: 'textarea',
      search: false,
    },
    {
      title: '编辑时间',
      dataIndex: 'updateDate',
      hideInForm: true,
      search: false,
      valueType: 'dateTime',
    },
    {
      dataIndex: 'userType',
      hideInForm: true,
      hideInTable: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <Authorized key="1" authority="sys:user:del" noMatch={null}>
            <a
              disabled={record.userType === 1}
              onClick={() => {
                Modal.confirm({
                  title: '您确定删除？',
                  okText: '确定',
                  cancelText: '取消',
                  onOk() {
                    const state = handleRemove([record]);
                    state.then(() => {
                      actionRef.current?.reload();
                    });
                  },
                });
              }}
            >
              删除
            </a>
            <Divider type="vertical" />
          </Authorized>
          <Authorized key="2" authority="sys:user:edit" noMatch={null}>
            <a
              disabled={record.userType === 1}
              onClick={() => {
                setUpdateFormValues(record);
                handleUpdateModalVisible(true);
              }}
            >
              编辑
            </a>
            <Divider type="vertical" />
          </Authorized>
          <Authorized key="3" authority="sys:user:disable" noMatch={null}>
            <a
              type="link"
              disabled={record.userType === 1}
              onClick={async () => {
                const success = await handleDisable(record);
                if (success) {
                  actionRef.current?.reload();
                }
              }}
            >
              {record.disabled ? '启用' : '停用'}
            </a>
          </Authorized>
        </>
      ),
    },
  ];

  useEffect(() => {
    const promise = loadRoles();
    promise.then((arr) => {
      setRoles([...arr]);
    });
    loadInstitutions();
  }, []);

  return (
    <PageContainer>
      <ProUserTable
        ProUserTableProps={{ institutions }}
        ProUserTableOptions={{ columns, headerTitle: '用户列表' }}
      />
      <CreateForm
        institutions={institutions}
        roles={roles}
        onFinish={(success) => {
          if (success) {
            actionRef.current?.reload();
          }
        }}
        onClose={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
      />

      <UpdateForm
        roles={roles}
        institutions={institutions}
        modalVisible={updateModalVisible}
        onFinish={(success) => {
          if (success) {
            actionRef.current?.reload();
          }
        }}
        onClose={() => {
          handleUpdateModalVisible(false);
          setTimeout(() => {
            setUpdateFormValues({});
          }, 300);
        }}
        values={updateFormValues}
      />
    </PageContainer>
  );
};

export default TableList;

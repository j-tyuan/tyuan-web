import {PlusOutlined} from '@ant-design/icons';
import {Button, Divider, message, Modal} from 'antd';
import React, {useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import ProTable, {ActionType, ProColumns} from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import {TableListItem} from './data';
import {add, disable, query, remove} from './service';
import Settings from "../../../../config/defaultSettings";
import KBPassword from "./components/KBPassword";
import Authorized from "@/utils/Authorized";

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


const handleDisable = async (row: TableListItem) => {
  const hide = message.loading('正在操作')
  try {
    const v = await disable(row.id, row.disabled ? 0 : 1);
    hide();
    if (v.errorCode === -1) {
      message.success('操作成功');

      return true;
    }

    return null;
  } catch (error) {
    hide()
    message.error("操作失败，请重试")

    return false;
  }
}

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

  const columns: ProColumns<TableListItem>[] = [
    {
      title: "员工编号",
      dataIndex: "no",
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
      title: "登陆账号",
      dataIndex: "account",
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
      title: "密码",
      dataIndex: "password",
      search: false,
      hideInTable: true,
      valueType: "password",
      renderFormItem(item, config, form) {
        return (
          <KBPassword onChange={
            (e) => {
              form.setFieldsValue({
                password: e
              })
            }
          }/>
        )
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: '必填项',
          },
        ],
      }
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
      }
    },
    {
      title: "手机号",
      dataIndex: "phone",
      formItemProps: {
        rules: [
          {
            required: true,
            message: '必填项',
          },
          {
            pattern: new RegExp("^1(3|4|5|7|8)\\d{9}$"),
            message: "格式不正确"
          }
        ],
      }
    },
    {
      title: "电子邮箱",
      search: false,
      dataIndex: "email",
      formItemProps: {
        rules: [
          {
            pattern: new RegExp("^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)*\\.[a-zA-Z0-9]{2,6}$"),
            message: "格式不正确"
          }
        ],
      }
    },
    {
      title: "状态",
      dataIndex: "disabled",
      valueType: 'switch',
      hideInForm: true,
      search: false,
      render: (_, record) => (
        <>
          {
            record.disabled ? '禁用' : '启用'
          }
        </>
      )
    },
    {
      title: "最后登陆时间",
      dataIndex: "loginDate",
      valueType: 'dateTime',
      hideInForm: true
    },
    {
      title: "描述",
      dataIndex: "remarks",
      valueType: "textarea",
      search: false
    },
    {
      title: "编辑时间",
      dataIndex: "updateDate",
      hideInForm: true,
      search: false,
      valueType: 'dateTime',
    },
    {
      dataIndex: "userType",
      hideInForm: true,
      hideInTable: true
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <Authorized authority="sys:user:del" noMatch={null}>
            <a disabled={record.userType === 1}
              onClick={() => {
                Modal.confirm({
                  title: "您确定删除？",
                  okText: "确定",
                  cancelText: "取消",
                  onOk() {
                    const state = handleRemove([record]);
                    state.then(() => {
                      if (actionRef.current) {
                        actionRef.current.reload();
                      }
                    })
                  }
                })
              }
              }
            >
              删除
            </a>
            <Divider type="vertical"/>
          </Authorized>
          <Authorized authority="sys:user:edit" noMatch={null}>
            <a
              disabled={record.userType === 1}
              onClick={() => {
                setUpdateFormValues(record);
                handleUpdateModalVisible(true);
              }}>
              编辑
            </a>
            <Divider type="vertical"/>
          </Authorized>
          <Authorized authority="sys:user:disable" noMatch={null}>
            <a type="link" disabled={record.userType === 1} onClick={async () => {
              const success = await handleDisable(record)
              if (success && actionRef.current) {
                actionRef.current.reload();
              }
            }}>
              {record.disabled ? '启用' : '停用'}
            </a>
          </Authorized>
        </>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<TableListItem>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Authorized authority="sys:user:add" noMatch={null}>
            <Button key="1" type="primary" onClick={() => handleModalVisible(true)}>
              <PlusOutlined/> 新建
            </Button>
          </Authorized>
        ]}
        request={(params, sorter, filter) => query({...params, sorter, filter})}
        columns={columns}
      />
      <CreateForm onClose={() => handleModalVisible(false)} modalVisible={createModalVisible}>
        <ProTable<TableListItem, TableListItem>
          onSubmit={async (value) => {
            const success = await handleAdd(value);
            if (success) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          rowKey="id"
          type="form"
          form={{...Settings.form.formItemLayout, layout: 'horizontal'}}
          columns={columns}
        />
      </CreateForm>

      {updateFormValues && Object.keys(updateFormValues).length ? (
        <UpdateForm
          modalVisible={updateModalVisible}
          onFinish={(success) => {
            if (success && actionRef.current) {
              actionRef.current.reload();
            }
          }}
          onClose={() => {
            handleUpdateModalVisible(false);
            setTimeout(() => {
              setUpdateFormValues({});
            }, 300)
          }}
          values={updateFormValues}
        />
      ) : null}
    </PageContainer>
  );
};

export default TableList;

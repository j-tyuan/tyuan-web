import {PlusOutlined} from '@ant-design/icons';
import {Button, Divider, message, Modal} from 'antd';
import React, {Key, useEffect, useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import ProTable, {ActionType, ProColumns} from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import {TableListItem} from './data';
import {add, getAuthByUid, getByPermission, query, remove, update} from './service';
import ConfigUser from "./components/ConfigUser";

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
    return false;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const handlePermission = async () => {
  const permission = await getByPermission();
  return permission.data;
}

const loop = (treeData: { [x: string]: any; }, pid: any) => {
  // @ts-ignore
  const arr = []
  // eslint-disable-next-line guard-for-in,no-restricted-syntax
  for (const i in treeData) {
    const val = treeData[i];
    if (val.parentId === pid) {
      const item: { title?: string, key?: any, children?: any[], isLeaf?: boolean } = {};
      item.children = loop(treeData, val.id)
      item.isLeaf = item.children.length === 0;
      arr.push(item)
    }
  }
  return arr;
}
const getOneLevelId = (treeData: any[]) => {
  const arr = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const i in treeData) {
    if (treeData[i].parentId === 0) {
      arr.push(treeData[i].id)
    }
  }
  return arr;
}


const TableList: React.FC<{}> = () => {
  const [configUserModalVisible, handleConfigUserModalVisible] = useState<boolean>(false);
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [updateFormValue, setUpdateFormValue] = useState<TableListItem>();
  const actionRef = useRef<ActionType>();
  const [permission, setPermission] = useState<any[]>([]);
  const [oneLevelIds, setOneLevelIds] = useState<Key[]>([]);
  const [initSelectAuth, setInitSelectAuth] = useState<Key[]>()

  useEffect(() => {
    const p = handlePermission();
    p.then(e => {
      const l = loop(e, 0)
      setPermission(l)
      const ids = getOneLevelId(e);
      setOneLevelIds(ids)
    })
  }, [])

  const columns: ProColumns<TableListItem>[] = [
    {
      title: "角色编码",
      dataIndex: "code",
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
      title: '角色名称',
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
      title: "描述",
      dataIndex: "remarks",
      valueType: "textarea",
      search: false,
      width: "40%"
    },
    {
      title: "编辑时间",
      dataIndex: "updateDate",
      hideInForm: true,
      search: false,
      valueType: 'dateTime',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
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
          <a onClick={() => {
            setUpdateFormValue(record);
            const promise = getAuthByUid(record.id)
            promise.then(e => {
              setInitSelectAuth(e.data)
              handleUpdateModalVisible(true);
            })
          }}>
            编辑
          </a>
          <Divider type="vertical"/>
          <a onClick={() => {
            setUpdateFormValue(record);
            handleConfigUserModalVisible(true);
          }}>
            用户管理
          </a>
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
          <Button key="1" type="primary" onClick={() => handleModalVisible(true)}>
            <PlusOutlined/> 新建
          </Button>,
        ]}
        request={(params, sorter, filter) => query({...params, sorter, filter})}
        columns={columns}
      />

      {updateFormValue && Object.keys(updateFormValue).length ? (
        <ConfigUser
          onClose={() => handleConfigUserModalVisible(false)}
          roleId={updateFormValue.id}
          modalVisible={configUserModalVisible}/>) : null}

      {updateFormValue && Object.keys(updateFormValue).length ? (
        <UpdateForm
          initSelectAuth={initSelectAuth}
          permission={permission}
          oneLevelIds={oneLevelIds}
          modalVisible={updateModalVisible}
          onSubmit={async (value) => {
            const success = await handleUpdate(value);
            if (success) {
              handleUpdateModalVisible(false);
              setUpdateFormValue(undefined);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onClose={() => {
            handleUpdateModalVisible(false);
            setTimeout(() => {
              setUpdateFormValue(undefined);
            }, 300)
          }}
          values={updateFormValue}
        />
      ) : null}

      {permission && permission.length ? (<CreateForm
        onClose={() => handleModalVisible(false)}
        permission={permission}
        oneLevelIds={oneLevelIds}
        onSubmit={async (value) => {
          const success = await handleAdd(value);
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        modalVisible={createModalVisible}/>) : null}
    </PageContainer>
  );
};

export default TableList;

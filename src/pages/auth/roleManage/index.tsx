import {PlusOutlined} from '@ant-design/icons';
import {Button, Divider, message, Modal} from 'antd';
import React, {Key, useEffect, useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import ProTable, {ActionType, ProColumns} from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import {TableListItem} from './data';
import {getAuthByRoleId, getByPermission, query, remove} from './service';
import Authorized from "@/utils/Authorized";
import {Link} from 'umi';


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
  const {errorCode, data} = permission;
  if (errorCode === -1) {
    return data;
  }
  return [];
}

const loop = (treeData, pid: any) => {
  // @ts-ignore
  const arr = []
  // eslint-disable-next-line guard-for-in,no-restricted-syntax
  for (const i in treeData) {
    const val = treeData[i];
    if (val.parentId === pid) {
      const item = {
        title: val.name,
        key: val.id,
      }
      item.children = loop(treeData, val.id)
      item.isLeaf = item.children.length === 0;
      arr.push(item)
    }
  }
  return arr;
}
const getOneLevelId = (treeData: any[]) => {
  const arr: any[] = [];
  treeData.forEach(e => {
    if (e.parentId === 0) {
      arr.push(e.id)
    }
  })
  return arr;
}


const TableList: React.FC<{}> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [updateFormValue, setUpdateFormValue] = useState({});
  const actionRef = useRef<ActionType>();
  const [permission, setPermission] = useState<[]>([]);
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
          <Authorized authority="sys:role:del" noMatch={null}>
            <a
              onClick={() => {
                Modal.confirm({
                  title: "您确定删除？",
                  okText: "确定",
                  cancelText: "取消",
                  onOk() {
                    const state = handleRemove([record]);
                    state.then(() => {
                      actionRef.current?.reload();
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
          <Authorized authority="sys:role:del" noMatch={null}>
            <a onClick={() => {
              setUpdateFormValue(record);
              const promise = getAuthByRoleId(record.id)
              promise.then(e => {
                setInitSelectAuth(e.data)
                handleUpdateModalVisible(true);
              })
            }}>
              编辑
            </a>
            <Divider type="vertical"/>
          </Authorized>
          <Authorized authority="sys:role:binduser" noMatch={null}>
            <Link to={{
              pathname: "/auth/role/user",
              state: {roleId: record.id}
            }}>分配用户</Link>
          </Authorized>
        </>
      ),
    },
  ];

  // @ts-ignore
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
          <Authorized key="1" authority="sys:role:add" noMatch={null}>
            <Button type="primary" onClick={() => handleModalVisible(true)}>
              <PlusOutlined/> 新建
            </Button>
          </Authorized>
        ]}
        request={(params, sorter, filter) => query({...params, sorter, filter})}
        columns={columns}
      />

      <UpdateForm
        initSelectAuth={initSelectAuth}
        permission={permission}
        oneLevelIds={oneLevelIds}
        modalVisible={updateModalVisible}
        onFinish={() => {
          actionRef.current?.reload();
        }}
        onClose={() => {
          handleUpdateModalVisible(false);
          setTimeout(() => {
            setUpdateFormValue({});
          }, 300)
        }}
        values={updateFormValue}
      />

      {permission && permission.length ? (<CreateForm
        onClose={() => handleModalVisible(false)}
        permission={permission}
        oneLevelIds={oneLevelIds}
        onFinish={() => {
          actionRef.current?.reload();
        }}
        modalVisible={createModalVisible}/>) : null}
    </PageContainer>
  );
};

export default TableList;

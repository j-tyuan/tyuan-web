import {PlusOutlined} from '@ant-design/icons';
import {Button, message, Drawer, Modal, Divider} from 'antd';
import React, {useState, useRef, useEffect} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import ProTable, {ProColumns, ActionType} from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import {TableListItem} from './data';
import {query, update, add, remove, getByParentId, getByPermission} from './service';

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
    return false;
    return true;
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

const TableList: React.FC<{}> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [updateFormValues, setUpdateFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const [, setRowLoading] = useState<boolean>();
  const [row, setRow] = useState<TableListItem>();
  const [permission, setPermission] = useState([]);

  useEffect(() => {
    const p = handlePermission();
    p.then(e => {
      setPermission(e)
    })
  }, [])

  const columns: ProColumns<TableListItem>[] = [
    {
      dataIndex: 'id',
      search: false,
      hideInTable: true
    },
    {
      title: '资源名称',
      dataIndex: 'name',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '必填项',
          },
        ],
      },
      render: (dom, entity) => {
        return <a onClick={() => setRow(entity)}>{dom}</a>;
      },
    },
    {
      title: "href",
      dataIndex: "href",
      search: false
    },
    {
      title: "目标",
      dataIndex: "target",
      search: false
    },
    {
      title: "排序",
      dataIndex: "sort",
      initialValue: "0",
      search: false
    },
    {
      title: "描述",
      dataIndex: "remarks",
      valueType: "textarea",
      search: false
    },
    {
      dataIndex: "isLeaf",
      search: false,
      hideInTable: true
    },
    {
      dataIndex: "isShow",
      search: false,
      hideInTable: true
    },
    {
      dataIndex: "permissionId",
      search: false,
      hideInTable: true
    },
    {
      dataIndex: "parentId",
      search: false,
      hideInTable: true
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
                    actionRef.current.reload();
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
            setUpdateFormValues(record);
            handleUpdateModalVisible(true);
          }}>
            编辑
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
        onExpand={async (expanded: boolean, record: TableListItem) => {
          if (!expanded) {
            return;
          }
          setRowLoading(true)
          const {data} = await getByParentId({parentId: record.id});
          // eslint-disable-next-line no-param-reassign
          record.children.length = 0;
          record.children.push(...data)
          setRowLoading(false)
        }}
      />

      {permission && permission.length ? (
        <CreateForm
          permission={permission}
          onSubmit={async (value) => {
            const success = await handleAdd(value);
            if (success) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onClose={() => handleModalVisible(false)} modalVisible={createModalVisible}/>) : null}

      {updateFormValues && Object.keys(updateFormValues).length ? (
        <UpdateForm
          permission={permission}
          modalVisible={updateModalVisible}
          onSubmit={async (value) => {
            const success = await handleUpdate(value);
            if (success) {
              handleUpdateModalVisible(false);
              setUpdateFormValues(() => {
              });
              if (actionRef.current) {
                actionRef.current.reload();
              }
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

      <Drawer
        width={600}
        visible={!!row}
        onClose={() => {
          setRow(undefined);
        }}
        closable={false}
      >
        {row?.label && (
          <ProDescriptions<TableListItem>
            column={2}
            title={row?.label}
            request={async () => ({
              data: row || {},
            })}
            params={{
              id: row?.label,
            }}
            columns={columns}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;

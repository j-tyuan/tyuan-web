import {PlusOutlined} from '@ant-design/icons';
import {Button, message, Drawer, Modal, Divider} from 'antd';
import React, {useState, useRef, useEffect} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import ProTable, {ProColumns, ActionType} from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import {TableListItem} from './data';
import {queryRule, update, add, remove, queryTypes} from './service';
import Settings from "../../../../config/defaultSettings";

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
const getTypes = async () => {
  const result = await queryTypes()
  const type = {};
  if (!result || !result.data) {
    return type;
  }
  result.data.forEach((v: { type: string | number; description: any; }) => {
    type[v.type] = v.description
  })
  return type;
};

const TableList: React.FC<{}> = () => {
  const [types, setTypes] = useState<any>()
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [updateFormValues, setUpdateFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<TableListItem>();
  useEffect(() => {
    getTypes().then(value => {
      setTypes(value)
    })
  }, [])

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '字典标签',
      dataIndex: 'label',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '标签为必填项',
          },
        ],
      },
      render: (dom, entity) => {
        return <a onClick={() => setRow(entity)}>{dom}</a>;
      },
    },
    {
      title: "字典类型",
      dataIndex: "type",
      formItemProps: {
        rules: [
          {
            required: true,
            message: '字典值为必填项',
          },
        ],
      },
      valueType: "select",
      valueEnum: types
    },
    {
      title: "字典值",
      dataIndex: "value",
      valueType: "textarea",
      formItemProps: {
        rules: [
          {
            required: true,
            message: '字典值为必填项',
          },
        ],
      },
    },
    {
      title: "排序",
      dataIndex: "sort",
      initialValue: "0",
      search: false
    },
    {
      title: "描述",
      dataIndex: "description",
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
        request={(params, sorter, filter) => queryRule({...params, sorter, filter})}
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
          types={types}
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

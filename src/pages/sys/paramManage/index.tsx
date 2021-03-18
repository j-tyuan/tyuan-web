import {PlusOutlined} from '@ant-design/icons';
import {Button, Divider, Drawer, message, Modal} from 'antd';
import React, {useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import ProTable, {ActionType, ProColumns} from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import {TableListItem} from './data';
import {add, queryRule, remove} from './service';
import Settings from "../../../../config/defaultSettings";
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
    return false;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
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
      message.success('配置成功');
      return true;
    }
    return false;
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const TableList: React.FC<{}> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [updateFormValues, setUpdateFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<TableListItem>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '参数名称',
      dataIndex: 'paramName',
      tip: '参数名称是唯一的',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '名称为必填项',
          },
        ],
      },
      render: (dom, entity) => {
        return <a onClick={() => setRow(entity)}>{dom}</a>;
      },
    },
    {
      title: "参数健",
      dataIndex: "paramKey",
      tooltip: "参数Key",
      formItemProps: {
        rules: [
          {
            required: true,
            message: 'key为必填项',
          },
        ],
      },
    },
    {
      title: "参数值",
      dataIndex: "paramVal",
      tooltip: "参数内容",
      formItemProps: {
        rules: [
          {
            required: true,
            message: 'key为必填项',
          },
        ],
      },
    },
    {
      title: "是否系统参数",
      dataIndex: "isSys",
      valueType: 'radio',
      valueEnum: {
        true: {text: '是', status: true},
        false: {text: '否', status: false},
      },
    }, {
      title: "备注",
      dataIndex: "remarks",
      valueType: "textarea"
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
          <Authorized authority="sys:param:del" noMatch={null}>
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
          </Authorized>

          <Authorized authority="sys:param:edit" noMatch={null}>
            <a onClick={() => {
              setUpdateFormValues(record);
              handleUpdateModalVisible(true);
            }}>
              编辑
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
          <Authorized  key="1" authority="sys:param:add" noMatch={null}>
            <Button type="primary" onClick={() => handleModalVisible(true)}>
              <PlusOutlined/> 新建
            </Button>
          </Authorized>
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

      <Drawer
        width={600}
        visible={!!row}
        onClose={() => {
          setRow(undefined);
        }}
        closable={false}
      >
        {row?.paramName && (
          <ProDescriptions<TableListItem>
            column={2}
            title={row?.paramName}
            request={async () => ({
              data: row || {},
            })}
            params={{
              id: row?.paramName,
            }}
            columns={columns}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;

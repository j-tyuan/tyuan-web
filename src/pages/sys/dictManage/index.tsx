import {PlusOutlined} from '@ant-design/icons';
import {Button, Divider, message, Modal} from 'antd';
import React, {useEffect, useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import ProTable, {ActionType, ProColumns} from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import {TableListItem} from './data';
import {add, queryRule, queryTypes, remove} from './service';
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

let TYPES = {};

const TableList: React.FC<{}> = () => {
  const [types, setTypes] = useState<any>()
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [updateFormValues, setUpdateFormValues] = useState({});
  const actionRef = useRef<ActionType>();

  useEffect(() => {
    if (Object.keys(TYPES).length >= 1) {
      setTypes({...TYPES})
    } else {
      getTypes().then((value: any) => {
        setTypes({...value})
        TYPES = {...value}
      })
    }
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
      }
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
          <Authorized authority="sys:dict:del" noMatch={null}>
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
          <Authorized authority="sys:dict:edit" noMatch={null}>
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
          <Authorized key="1" authority="sys:dict:add" noMatch={null}>
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
              actionRef.current?.reload();
            }
          }}
          rowKey="id"
          type="form"
          form={{...Settings.form.formItemLayout, layout: 'horizontal'}}
          columns={columns}
        />
      </CreateForm>

      {
        types ? (<UpdateForm
          modalVisible={updateModalVisible}
          types={types}
          onFinish={(success) => {
            if (success) {
              actionRef.current?.reload();
            }
          }}
          onClose={() => {
            handleUpdateModalVisible(false);
            setTimeout(() => {
              setUpdateFormValues({});
            }, 300)
          }}
          values={updateFormValues}
        />) : null
      }

    </PageContainer>
  );
};

export default TableList;

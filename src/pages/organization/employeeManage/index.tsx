import {PlusOutlined} from '@ant-design/icons';
import {Button, Card, Col, Divider, message, Modal, Row, Tooltip, Tree} from 'antd';
import React, {useEffect, useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import ProTable, {ActionType, ProColumns} from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import {TableListItem} from './data';
import {query, remove} from './service';
import Authorized from "@/utils/Authorized";
import {getAll} from "@/pages/organization/institutionManage/service";
import {FormInstance} from "antd/es/form";
import {findParentPath} from "@/utils/utils";


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

const instTreeToTree = (data: any []) => {
  const tree = data.map((e: any) => {
    const isLeaf = e.children && e.children.length > 0
    let children: any[] = [];
    if (isLeaf) {
      children = instTreeToTree(e.children)
    }
    return {
      title: e.instName,
      instId: e.id,
      key: e.id,
      isLeaf: !isLeaf,
      children
    }
  })
  return tree;
}

const TableList: React.FC<{}> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [updateFormValues, setUpdateFormValues] = useState<any>({});
  const actionRef = useRef<ActionType>();
  const formRef = useRef<FormInstance>();

  const [instId, setInstId] = useState<any>();
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [institutionTreeData, setInstitutionTreeData] = useState<any[]>();
  const loadInstitutions = () => {
    const promise = getAll();
    promise.then(e => {
      const {errorCode, data} = e;
      if (errorCode === -1 && data) {
        setInstitutions([...data])
        const newData = instTreeToTree([...data])
        setInstitutionTreeData([...newData]);
      }
    })
  }
  const columns: ProColumns<TableListItem>[] = [
    {
      title: "员工工号",
      dataIndex: "empNo",
    },
    {
      title: "员工名称",
      dataIndex: "empNameEn",
    },
    {
      title: "员工英文名称",
      dataIndex: "empName",
    },
    {
      title: "员工所属机构",
      dataIndex: "instName",
      render(_, item) {
        const insts = findParentPath(item.instId, [...institutions]);
        const names: any[] = []
        insts.forEach(e => {
          names.push(e.instName)
        })
        return (
          <Tooltip placement="left" title={`${names.join("/")}${item.instName}`}>
            <Button type='link'>{_}</Button>
          </Tooltip>
        )
      }
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
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <Authorized authority="sys:organization:employee:del" noMatch={null}>
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
          <Authorized authority="sys:organization:employee:edit" noMatch={null}>
            <a disabled={record.userType === 1}
               onClick={() => {
                 setUpdateFormValues(record);
                 handleUpdateModalVisible(true);
               }}>
              编辑
            </a>
            <Divider type="vertical"/>
          </Authorized>
        </>
      ),
    },
  ];
  const institutionTree = () => {
    if (!institutionTreeData || institutionTreeData.length === 0) {
      return null;
    }
    return (
      <Card>
        <Tree blockNode
              onClick={(_, dataNode) => {
                if (actionRef.current && formRef.current) {
                  formRef.current.resetFields()
                  setInstId(dataNode.instId)
                }
              }}
              height={500}
              defaultExpandAll
              treeData={institutionTreeData}/>
      </Card>)
  }

  useEffect(() => {
    loadInstitutions();
  }, [])

  return (
    <PageContainer>
      <ProTable<TableListItem>
        headerTitle="用户列表"
        actionRef={actionRef}
        formRef={formRef}
        rowKey="id"
        params={{
          instId
        }}
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Authorized key="1" authority="sys:organization:employee:add" noMatch={null}>
            <Button type="primary" onClick={() => handleModalVisible(true)}>
              <PlusOutlined/> 新建
            </Button>
          </Authorized>
        ]}
        request={(params, sorter, filter) => query({...params, sorter, filter})}
        columns={columns}
        tableRender={(_, dom) => (
          <Row gutter={[10, 10]}>
            <Col span={4}>
              {
                institutionTree()
              }
            </Col>
            <Col span={20}>
              {
                dom
              }
            </Col>
          </Row>
        )}
      />
      <CreateForm onClose={() => handleModalVisible(false)}
                  modalVisible={createModalVisible} institutions={institutions}
                  onFinish={(success) => {
                    if (success && actionRef.current) {
                      actionRef.current.reload();
                    }
                  }}/>

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
          institutions={institutions}/>
      ) : null}
    </PageContainer>
  );
};

export default TableList;

import {PlusOutlined} from '@ant-design/icons';
import {Button, Card, Col, Divider, message, Modal, Skeleton} from 'antd';
import React, {useEffect, useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import ProTable, {ActionType, ProColumns} from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import {TableListItem} from './data';
import {getByPermission, getSourceAll, removeSource} from './service';
import Authorized from "@/utils/Authorized";
import styles from "./index.less";
import Row from "antd/es/row";


/**
 *  删除节点
 * @param selectedRows
 * @param actionRef
 */
const handleRemove = async (selectedRows: TableListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    const v = await removeSource({
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

/**
 * 预处理
 * 禁用子节点
 * @param data
 */
export const preprocessDataSource = (data?: any[]) => {
  const newData: any[] = []
  data?.forEach(e => {
    if (e.isLeaf) {
      e.disabled = true;
    } else {
      const val = preprocessDataSource(e.children);
      e.children = [...val];
    }
    newData.push({...e})
  })
  return newData;
}


const TableList: React.FC<{}> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [updateFormValues, setUpdateFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const [permission, setPermission] = useState([]);
  const [loading, setLoading] = useState<boolean>();
  const [dataSource, setDataSource] = useState<any[]>();
  const [parentId, setParentId] = useState<any>();

  const loadData = async () => {
    setLoading(true)
    getSourceAll().then(e => {
      const {errorCode, data} = e;
      if (errorCode === -1) {
        setDataSource(preprocessDataSource([...data]))
      }
      setLoading(false)
    })
  }

  useEffect(() => {
    const p = handlePermission();
    p.then(e => {
      setPermission(e)
    })
    loadData();
  }, [])

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '资源名称',
      dataIndex: 'sourceName',
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
      title: "href",
      dataIndex: "sourceHref",
      search: false
    },
    {
      title: "目标",
      dataIndex: "sourceTarget",
      search: false
    },
    {
      title: "排序",
      dataIndex: "sourceSort",
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
      dataIndex: "updateTime",
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
          <Authorized authority="sys:source:del" noMatch={null}>
            <a onClick={() => {
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
          <Authorized authority="sys:source:edit" noMatch={null}>
            <a onClick={() => {
              setUpdateFormValues(record);
              handleUpdateModalVisible(true);
            }}>
              编辑
            </a>
            <Divider type="vertical"/>
          </Authorized>
          <Authorized authority="sys:source:edit" noMatch={null}>
            <a disabled={record.isLeaf} onClick={() => {
              setParentId(record.id)
              handleModalVisible(true);
            }}>
              创建下级节点
            </a>
          </Authorized>
        </>
      ),
    },
  ];

  return (
    <PageContainer>
      {
        dataSource ? <ProTable<TableListItem>
            defaultExpandAllRows
            headerTitle="菜单列表"
            pagination={false}
            actionRef={actionRef}
            footer={() => {
              return <>
                <Row justify="end">
                  <Col>
                    <span className={styles.textColorSecondary}>菜单列表</span>
                  </Col>
                </Row>
              </>
            }}
            rowKey="id"
            loading={loading}
            onLoad={async () => {
              loadData();
            }}
            search={false}
            dataSource={dataSource}
            toolBarRender={() => [
              <Authorized key="1" authority="sys:source:add" noMatch={null}>
                <Button type="primary" onClick={() => {
                  setParentId(0);
                  handleModalVisible(true);
                }}>
                  <PlusOutlined/> 新建
                </Button>
              </Authorized>
            ]}
            columns={columns}
          />
          : (
            <Card className={styles.bodyBackground}>
              <Skeleton active loading/>
              <Skeleton active loading/>
              <Skeleton active loading/>
            </Card>)
      }

      <CreateForm
        permission={permission}
        dataSource={dataSource}
        parentId={parentId}
        onFinish={(success) => {
          if (success) {
            actionRef.current?.reload();
          }
        }}
        onClose={() => handleModalVisible(false)} modalVisible={createModalVisible}/>

      <UpdateForm
        dataSources={dataSource}
        permission={permission}
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
          }, 300)
        }}
        values={updateFormValues}
      />
    </PageContainer>
  );
};

export default TableList;

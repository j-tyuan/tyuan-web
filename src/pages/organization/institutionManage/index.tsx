import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Divider, message, Modal, Skeleton } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { TableListItem } from './data';
import { getInstAll, remove } from './service';
import Authorized from '@/utils/Authorized';
import Row from 'antd/es/row';
import styles from './index.less';

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
  const [dataSource, setDataSource] = useState<any[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [parentId, setParentId] = useState<any>();

  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '机构名称',
      dataIndex: 'instName',
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
      title: '机构编码',
      dataIndex: 'instCode',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '名称为必填项',
          },
        ],
      },
    },
    {
      title: '机构类型',
      dataIndex: 'instType',
      valueType: 'radio',
      search: false,
      valueEnum: {
        0: { text: '公司', status: 0 },
        1: { text: '部门', status: 1 },
      },
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
      title: '机构状态',
      dataIndex: 'instStatus',
      search: false,
      valueType: 'radio',
      valueEnum: {
        0: { text: '启用', status: 0 },
        1: { text: '停用', status: 1 },
      },
    },
    {
      title: '备注',
      search: false,
      dataIndex: 'instDesc',
      valueType: 'textarea',
    },
    {
      title: '编辑时间',
      dataIndex: 'updateDate',
      hideInForm: true,
      search: false,
      valueType: 'dateTime',
    },
    {
      width: 300,
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <Authorized authority="sys:organize:institution:del" noMatch={null}>
            <a
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
          <Authorized authority="sys:organize:institution:edit" noMatch={null}>
            <a
              onClick={() => {
                setUpdateFormValues(record);
                handleUpdateModalVisible(true);
              }}
            >
              编辑
            </a>
            <Divider type="vertical" />
          </Authorized>
          <Authorized authority="sys:organize:institution:add" noMatch={null}>
            <a
              onClick={() => {
                setParentId(record.id);
                handleModalVisible(true);
              }}
            >
              添加下级机构
            </a>
          </Authorized>
        </>
      ),
    },
  ];
  const loadData = async () => {
    setLoading(true);
    getInstAll().then((e) => {
      const { errorCode, data } = e;
      if (errorCode === -1) {
        setDataSource([...data]);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <PageContainer>
      {dataSource ? (
        <ProTable<TableListItem>
          defaultExpandAllRows
          footer={() => {
            return (
              <>
                <Row justify="end">
                  <Col>
                    <span className={styles.textColorSecondary}>机构管理</span>
                  </Col>
                </Row>
              </>
            );
          }}
          pagination={false}
          loading={loading}
          onLoad={async () => {
            loadData();
          }}
          search={false}
          headerTitle="机构列表"
          actionRef={actionRef}
          rowKey="id"
          toolBarRender={() => [
            <Authorized key="1" authority="sys:organize:institution:add" noMatch={null}>
              <Button
                type="primary"
                onClick={() => {
                  handleModalVisible(true);
                  setParentId(0);
                }}
              >
                <PlusOutlined /> 新建
              </Button>
            </Authorized>,
          ]}
          dataSource={dataSource}
          columns={columns}
        />
      ) : (
        <Card className={styles.bodyBackground}>
          <Skeleton active loading />
          <Skeleton active loading />
          <Skeleton active loading />
        </Card>
      )}
      {dataSource ? (
        <CreateForm
          institutions={dataSource}
          parentId={parentId}
          onFinish={() => {
            actionRef.current?.reload();
          }}
          onClose={() => handleModalVisible(false)}
          modalVisible={createModalVisible}
        />
      ) : null}

      <Authorized authority="sys:organize:institution:edit" noMatch={null}>
        <UpdateForm
          institutions={dataSource}
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
      </Authorized>
    </PageContainer>
  );
};

export default TableList;

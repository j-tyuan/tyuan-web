import {Card, Col, Row, Skeleton, Tree} from 'antd';
import React, {useRef, useState} from 'react';
import ProTable, {ActionType} from '@ant-design/pro-table';
import {FormInstance} from "antd/es/form";
import {TableListItem} from "@/pages/auth/userManage/data";
import {queryUser} from '@/pages/auth/userManage/service';


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

export interface ProUserTableProps {
  toolBarRender?: () => void;
  institutions: any[];
  actionRef: ActionType;
}


export interface ProUserTableOptions {

}

const ProUserTable: React.FC<{ ProUserTableProps: any, ProUserTableOptions: any }> = (props) => {
  const {institutions, toolBarRender, actionRef} = props.ProUserTableProps;
  const formRef = useRef<FormInstance>();
  const [instId, setInstId] = useState<any>();

  const institutionTree = () => {
    if (!institutions || institutions.length === 0) {
      return <>
        <Card style={{height: "400px"}}>
          <Skeleton active/>
          <Skeleton active/>
        </Card>
      </>;
    }
    const institutionTreeData = instTreeToTree(institutions);
    return (
      <Card>
        <Tree style={{minWidth: 200}} blockNode
              onClick={(_, dataNode) => {
                if (formRef.current) {
                  formRef.current.resetFields()
                  formRef.current.submit()
                  setInstId(dataNode.instId)
                }
              }}
              height={500}
              defaultExpandAll
              treeData={institutionTreeData}/>
      </Card>)
  }

  return (
    <ProTable<TableListItem>
      scroll={{x: 2000}}

      formRef={formRef}
      headerTitle="查询表格"
      toolBarRender={toolBarRender}
      actionRef={actionRef}
      rowKey="id"
      params={{instId}}
      search={{labelWidth: 120}}
      request={(params, sorter, filter) => queryUser({...params, sorter, filter})}
      {...props.ProUserTableOptions}
      tableRender={(_, dom) => (
        <Row gutter={[10, 10]} wrap={false}>
          <Col style={{overflowX: "auto"}} span={4}>
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
  );
};

export default ProUserTable;

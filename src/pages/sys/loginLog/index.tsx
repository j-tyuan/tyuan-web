import React, {useRef} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import ProTable, {ActionType, ProColumns} from '@ant-design/pro-table';
import {TableListItem} from './data';
import "./log.less"
import { queryLoginLog } from './service';

const TableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<TableListItem>[] = [
    {
      title: "用户名称",
      dataIndex: "userName",
      ellipsis: true,
      fixed: 'left',
      copyable: true
    },
    {
      title: "登陆IP",
      width: 150,
      dataIndex: "loginIp"
    },
    {
      width: 200,
      title: "登陆时间",
      dataIndex: "createTime",
      valueType: 'dateTime',
    }
  ];

  return (
    <PageContainer>
      <ProTable<TableListItem>
        headerTitle="日志"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => []}
        request={(params, sorter, filter) => queryLoginLog({...params, sorter, filter})}
        columns={columns}
      />
    </PageContainer>
  );
};

export default TableList;

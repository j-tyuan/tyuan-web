import React, {useState} from 'react';
import {ProColumns} from "@ant-design/pro-table";
import {TableListItem} from "@/pages/auth/userManage/data";
import {Avatar, Card, Tooltip} from "antd";
import {UserOutlined} from "@ant-design/icons";
import ProUserTable from "@/components/ProUserTable";
import {queryBindUser} from "@/pages/auth/roleManage/service";
import {findParentPath} from "@/utils/utils";
import {PageContainer} from "@ant-design/pro-layout";


const RoleUserTable: React.FC<{ roleId: any, institutions: any[], onChange: (ids: any[]) => void, actionRef: any }> = (props) => {
  const {roleId, onChange} = props;
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>();
  const columns: ProColumns<TableListItem>[] = [
    {

      title: "员工编号",
      dataIndex: "userNo",
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
      title: "头像",
      dataIndex: "avatar",
      search: false,
      hideInForm: true,
      render(_) {
        return (<Avatar shape="circle" size={32} icon={<UserOutlined/>} src={_}/>)
      }
    },
    {
      title: '用户名称',
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
      title: "手机号",
      dataIndex: "phone",
      formItemProps: {
        rules: [
          {
            required: true,
            message: '必填项',
          },
          {
            pattern: new RegExp("^1(3|4|5|7|8)\\d{9}$"),
            message: "格式不正确"
          }
        ],
      }
    },
    {
      title: "所属机构",
      dataIndex: "instName",
      search: false,
      render(_, item) {
        const insts = findParentPath(item.instId, [...props.institutions]);
        const names: any[] = []
        insts.forEach(e => {
          names.push(e.instName)
        })
        return (
          <Tooltip placement="left" title={`${names.join("/")}`}>
            <a type='link'>{_}</a>
          </Tooltip>
        )
      }
    }];

  return (
    <div style={{maxHeight: 800, overflowX: "auto", minWidth: 500}}>
      <PageContainer title="用户选择">
        <ProUserTable
          actionRef={props.actionRef}
          ProUserTableProps={{institutions: props.institutions}}
          ProUserTableOptions={{
            rowSelection: {
              selectedRowKeys,
              type: "checkbox",
              onChange(e: any[]) {
                props.onChange([...e]);
              },
            },
            search: {
              filterType: 'light'
            },
            request(params: any, sorter: any, filter: any) {
              return queryBindUser({...params, roleId, searchType: 2, sorter, filter})
            },
            columns,
            headerTitle: "用户列表",
            pagination: {pageSize: 10}
          }}/>
      </PageContainer>

    </div>
  );
};

export default RoleUserTable;

import {EnterOutlined, PlusOutlined, UserOutlined} from '@ant-design/icons';
import {Avatar, Button, message, Modal, Tooltip} from 'antd';
import React, {useEffect, useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import ProTable, {ActionType, ProColumns} from '@ant-design/pro-table';
import Authorized from "@/utils/Authorized";
import {getInstAll} from "@/pages/organization/institutionManage/service";
import {findParentPath} from "@/utils/utils";
import {TableListItem} from "@/pages/auth/userManage/data";
import RoleUserTable from "./components/RoleUserTable";
import {bindUser, queryBindUser, unbindUser} from "./service";
import {history} from "@@/core/history";

const TableList: React.FC<{ location: any, history: any }> = (props) => {
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [selectUserModalVisible, setSelectUserModalVisible] = useState<boolean>()
  const [selectUserIds, setSelectUserIds] = useState<any[]>()
  const actionRef = useRef<ActionType>();
  const roleUserTableActionRef = useRef<ActionType>();

  if (!props.location.state) {
    props.history.push("/");
    return (null);
  }
  const {roleId} = props.location.state;

  const loadInstitutions = () => {
    const promise = getInstAll();
    promise.then(e => {
      const {errorCode, data} = e;
      if (errorCode === -1 && data) {
        setInstitutions([...data])
      }
    })
  }
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
        const insts = findParentPath(item.instId, [...institutions]);
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
    }
    ,
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <Authorized key="1" authority="sys:role:unbinduser" noMatch={null}>
            <a onClick={() => {
              const hide = message.loading({content: "解绑中..."})
              unbindUser(roleId, [record.id]).then(e => {
                const {errorCode} = e;
                if (errorCode === -1) {
                  message.success({content: "完成"})
                }
                hide();
                actionRef.current?.reload();
              })
            }}>
              解除绑定
            </a>
          </Authorized>
        </>
      ),
    },
  ];

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    loadInstitutions();
  }, [])
  return (
    <PageContainer title="用户分配">
      <ProTable<TableListItem>
        headerTitle="用户列表"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        pagination={{pageSize: 10}}
        toolBarRender={() => [
          <Authorized key="1" authority="sys:role:add" noMatch={null}>
            <Button type="primary" onClick={() => {
              setSelectUserIds(undefined)
              setSelectUserModalVisible(true)
            }}>
              <PlusOutlined/> 绑定用户
            </Button>
          </Authorized>
          , <Button type="link" onClick={() => {
            history.go(-1)
          }}>
            <EnterOutlined />返回
          </Button>
        ]}
        request={(params: any, sorter: any, filter: any) => {
          return queryBindUser({...params, roleId, searchType: 1, sorter, filter})
        }}
        columns={columns}
      />
      <Modal
        destroyOnClose
        okText="绑定"
        okButtonProps={{disabled: !selectUserIds || selectUserIds.length <= 0}}
        onOk={() => {
          if (selectUserIds) {
            const hide = message.loading({content: "正在绑定.."})
            bindUser(roleId, [...selectUserIds]).then(e => {
              const {errorCode} = e;
              if (errorCode === -1) {
                message.success({content: "绑定成功"})
              }
              hide();
              roleUserTableActionRef.current?.reload();
            })
          }
        }}
        onCancel={() => {
          setSelectUserModalVisible(false);
          actionRef.current?.reload();
        }}
        width={window.innerWidth - 300}
        visible={selectUserModalVisible}>
        <RoleUserTable actionRef={roleUserTableActionRef} onChange={(e) => {
          setSelectUserIds([...e])
        }} roleId={roleId} institutions={institutions}/>
      </Modal>
    </PageContainer>
  );
};

export default TableList;

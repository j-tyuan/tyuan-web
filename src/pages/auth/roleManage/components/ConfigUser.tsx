import React, {useEffect, useState} from 'react';
import {Button, Drawer} from 'antd';
import Search from "antd/es/input/Search";
import List from "antd/es/list";
import Avatar from "antd/es/avatar";
import {ExportOutlined, PlusOutlined} from "@ant-design/icons";
import Card from "antd/es/card";
import {bindUser, queryBindUser, queryUser, unbindUser} from "../service";
import {Spin} from "antd/es";

interface CreateFormProps {
  modalVisible: boolean;
  onClose: () => void;
  roleId: any;
}

const ConfigUser: React.FC<CreateFormProps> = (props) => {
  const {modalVisible, onClose, roleId} = props;

  const [users, setUsers] = useState([])
  const [selected, setSelected] = useState<{ id: any }[]>([])
  const [spinLoding, setSpinLoding] = useState<boolean>(false)

  const getBindUser = async (id: any) => {
    const promise = queryBindUser(id);
    promise.then(result => {
      const ids = result.data;
      setSelected(ids)
    })
  }

  const getUser = async () => {
    const result = await queryUser();
    const us = result.data || [];
    us.filter((e: { id: any; }) => {
      const val = selected.filter(j => {
        return e.id === j.id;
      })
      return val.length === 0;
    })
    setUsers(us)
  }

  useEffect(() => {
    getUser();
    getBindUser(roleId);
  }, [roleId])

  return (
    <Drawer
      destroyOnClose
      title="配置用户"
      width="500px"
      visible={modalVisible}
      onClose={() => onClose()}
      footer={null}
    >
      <Search placeholder="按用户名称搜索" style={{width: "45%"}}/>
      <Search
        placeholder="按手机号搜索"
        allowClear
        style={{width: "45%", margin: '0 10px'}}
      />
      <Spin spinning={spinLoding}>
        <Card style={{margin: "10px 0"}}>
          <List style={{height: "300px"}} dataSource={users.filter((prd: { id: any }) => {
            return selected.indexOf(prd.id) === -1
          })} renderItem={(item: { id: any, photo?: string, name?: string, phone?: string, email?: string }) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={item.photo}/>}
                title={item.name}
                description={`${item.phone}  ${item.email}`}
              />
              <Button type="primary" icon={<PlusOutlined/>} onClick={async () => {
                setSpinLoding(true)
                await bindUser(roleId, item.id)
                getBindUser(roleId)
                setSpinLoding(false)
              }}/>
            </List.Item>
          )}/>
        </Card>
        <Card>
          <List style={{height: "400px"}} dataSource={users.filter((prd: { id: any }) => {
            return selected.indexOf(prd.id) !== -1;
          })} renderItem={(item: { id: any, photo?: string, name?: string, phone?: string, email?: string }) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={item.photo}/>}
                title={item.name}
                description={`${item.phone}  ${item.email}`}
              />
              <Button type="primary" danger icon={<ExportOutlined/>} onClick={async () => {
                setSpinLoding(true)
                await unbindUser(roleId, item.id)
                getBindUser(roleId)
                setSpinLoding(false)
              }}/>
            </List.Item>
          )}/>
        </Card>
      </Spin>
    </Drawer>
  );
};

export default ConfigUser;

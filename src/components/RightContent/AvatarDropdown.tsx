import React, {useCallback} from 'react';
import {LogoutOutlined, SettingOutlined} from '@ant-design/icons';
import {Avatar, Menu, Space, Spin} from 'antd';
import {history, useModel} from 'umi';
import {outLogin} from '@/services/login';
import {stringify} from 'querystring';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

export interface GlobalHeaderRightProps {
  menu?: boolean;
}

/**
 * 退出登录，并且将当前的 url 保存
 */
const loginOut = async () => {
  await outLogin();
  const {query, pathname} = history.location;
  const {redirect} = query;
  // Note: There may be security issues, please note
  if (window.location.pathname !== '/login' && !redirect) {
    history.replace({
      pathname: '/login',
      search: stringify({
        redirect: pathname,
      }),
    });
  }
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({menu}) => {
  const {initialState, setInitialState} = useModel('@@initialState');

  const onMenuClick = useCallback(
    (event: {
      key: React.Key;
      keyPath: React.Key[];
      item: React.ReactInstance;
      domEvent: React.MouseEvent<HTMLElement>;
    }) => {
      const {key} = event;
      if (key === 'logout' && initialState) {
        setInitialState({...initialState, currentUser: {}});
        loginOut();
        return;
      }
      history.push(`/account/${key}`);
    },
    [],
  );

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const {currentUser} = initialState;

  if (!currentUser || !currentUser.userName) {
    return loading;
  }

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      {menu && (
        <Menu.Item key="settings">
          <SettingOutlined/>
          个人设置
        </Menu.Item>
      )}
      {menu && <Menu.Divider/>}

      <Menu.Item key="logout">
        <LogoutOutlined/>
        退出登录
      </Menu.Item>
    </Menu>
  );
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <Space>
         <Avatar size="small" className={styles.photo} src={currentUser.avatar} alt="avatar"/>
         <span className={`${styles.name} anticon`}>{currentUser.name}</span>
        </Space>
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;

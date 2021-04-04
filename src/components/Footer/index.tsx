import React from 'react';
import {GithubOutlined} from '@ant-design/icons';
import {DefaultFooter} from '@ant-design/pro-layout';

export default () => (
  <DefaultFooter
    copyright="2021  Jiangguiqi (author@tyuan.design)"
    links={[
      {
        key: 'TY Design',
        title: 'TYang Design',
        href: 'https://tyuan.design',
        blankTarget: true,
      },
      {
        key: 'github',
        title: <GithubOutlined/>,
        href: 'https://github.com/j-tyuan/tyuan-web',
        blankTarget: true,
      },
      {
        key: 'Ant Design Pro',
        title: 'Ant Design Pro',
        href: 'https://pro.ant.design',
        blankTarget: true,
      },]}
  />
);

import React from 'react';
import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-layout';

export default () => (
  <DefaultFooter
    copyright='<div className="copyright">Copyright © 2021 软达科技 |<a href="https://beian.miit.gov.cn/" target="_blank" style="text-decoration: underline;"> 豫ICP备2021007509号-1</a></div>'
    links={[
      {
        key: 'TY Design',
        title: 'TYang Design',
        href: 'https://tyuan.design',
        blankTarget: true,
      },
      {
        key: 'github',
        title: <GithubOutlined />,
        href: 'https://github.com/j-tyuan/tyuan-web',
        blankTarget: true,
      },
      {
        key: 'Ant Design Pro',
        title: 'Ant Design Pro',
        href: 'https://pro.ant.design',
        blankTarget: true,
      },
    ]}
  />
);

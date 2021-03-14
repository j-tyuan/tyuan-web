﻿export default [
  {
    path: '/login',
    layout: false,
    name: 'login',
    component: './user/login',
  },
  {
    path: '/welcome',
    name: 'welcome',
    component: './Welcome',
  },
  // 账号中心
  {
    name: 'account.center-manage',
    headerRender: false,
    menuRender: false,
    footerRender: false,
    path: '/account/center',
    component: './account/center',
  },
  // 账号中心
  {
    name: 'account.settings-manage',
    headerRender: false,
    menuRender: false,
    footerRender: false,
    path: '/account/settings',
    component: './account/settings',
  },
  // 资源管理
  {
    name: 'sys.source-manage',
    headerRender: false,
    menuRender: false,
    footerRender: false,
    path: '/sys/source',
    component: './sys/sourceManage',
  },
  // 参数管理
  {
    name: 'sys.param-manage',
    path: '/sys/param',
    component: './sys/paramManage',
  },
  // 字典管理
  {
    name: 'sys.dict-manage',
    path: '/sys/dict',
    component: './sys/dictManage',
  },
  {
    name: 'auth.user-manage',
    path: '/auth/user',
    component: './auth/userManage',
  },
  {
    name: 'auth.role-manage',
    path: '/auth/role',
    component: './auth/roleManage',
  },
  {
    name: 'monitor.redis',
    path: '/monitor/redis',
    component: './monitor/redis',
  },
  {
    name: 'sys.log',
    path: '/sys/log',
    component: './sys/log',
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];

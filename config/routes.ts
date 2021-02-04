export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/login',
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin',
    routes: [
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        icon: 'smile',
        component: './Welcome',
      },
    ],
  },
  // 资源管理
  {
    name: 'sys.source-manage',
    icon: 'table',
    headerRender: false,
    menuRender: false,
    footerRender: false,
    path: '/sys/source',
    component: './sys/sourceManage',
  },
  // 参数管理
  {
    name: 'sys.param-manage',
    icon: 'table',
    path: '/sys/param',
    component: './sys/paramManage',
  },
  // 字典管理
  {
    name: 'sys.dict-manage',
    icon: 'table',
    path: '/sys/dict',
    component: './sys/dictManage',
  },
  {
    name: 'auth.user-manage',
    icon: 'table',
    path: '/auth/user',
    component: './auth/userManage',
  },
  {
    name: 'auth.role-manage',
    icon: 'table',
    path: '/auth/role',
    component: './auth/roleManage',
  },
  {
    name: 'monitor.redis',
    icon: 'table',
    path: '/monitor/redis',
    component: './monitor/redis',
  },
  {
    name: 'sys.log',
    icon: 'table',
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

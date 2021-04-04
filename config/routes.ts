export default [
  {
    path: '/',
    redirect: '/dashboard/workplace',
  },
  {
    name: 'login',
    path: '/login',
    component: './user/login',
    layout: false,
  },
  {
    path: '/dashboard/workplace',
    name: 'workplace',
    component: './dashboard/workplace',
  },
  {
    path: '/dashboard/analysis',
    name: 'analysis',
    component: './dashboard/analysis',
  },
  {
    path: '/dashboard/monitor',
    name: 'monitor',
    component: './dashboard/monitor',
  },
  // 水印管理
  {
    path: '/sys/watermark',
    name: 'watermark',
    component: './sys/waterMarkManage',
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
    name: 'sys.log',
    path: '/sys/log',
    component: './sys/log',
  },
  {
    name: 'sys.login-log',
    path: '/sys/login/log',
    component: './sys/loginLog',
  },
  {
    name: 'organization.institution',
    path: '/organization/institution',
    component: './organization/institutionManage',
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
    name: 'auth.role-user-manage',
    path: '/auth/role/user',
    component: './auth/roleUserManage',
  },
  {
    name: 'monitor.redis',
    path: '/monitor/redis',
    component: './monitor/redis',
  },

  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];

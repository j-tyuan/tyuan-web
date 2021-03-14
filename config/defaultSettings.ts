import {Settings as LayoutSettings} from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
  form: {
    drawer: {
      width?: any
    },
    formItemLayout: {
      labelCol: { span?: any },
      wrapperCol: { span?: any },
    }
  };
} = {
  form: {
    drawer: {
      width: 500
    },
    formItemLayout: {
      labelCol: {span: 6},
      wrapperCol: {span: 16},
    }
  },
  // 拂晓蓝
  primaryColor: '#1890ff',
  // 'side' | 'top' | 'mix';
  // 可动态修改 -----------------
  layout: 'mix',
  // layout 的左上角 的 title
  title: 'TYuan企业级基础开发平台',
  navTheme: 'light',
  // end -----------------

  fixSiderbar: true,
  contentWidth: 'Fluid',
  fixedHeader: false,
  colorWeak: false,
  pwa: false,
  // layout 的左上角 logo 的 url
  logo: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
  iconfontUrl: '',
};

export default Settings;

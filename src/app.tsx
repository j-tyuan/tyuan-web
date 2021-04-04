import React from 'react';
import {
  BasicLayoutProps,
  MenuDataItem,
  PageLoading,
  Settings as LayoutSettings,
} from '@ant-design/pro-layout';
import { message, notification } from 'antd';
import { history, RequestConfig } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { ResponseError, ResponseInterceptor } from 'umi-request';
import { qureyAccount } from './services/user';
import defaultSettings from '../config/defaultSettings';
import { permissions, queryMenuData } from '@/services/sys';
import { setAuthority } from '@/utils/authority';
import * as Icon from '@ant-design/icons';
import { API } from '@/services/API';
import { WaterMarkProps } from '@ant-design/pro-layout/lib/components/WaterMark';
import { loadWaterMark } from '@/pages/sys/waterMarkManage/service';

/**
 * 获取用户信息比较慢的时候会展示一个 loading
 */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * 自定义了左侧菜单，所以icon需要自己创建
 * @param menuData
 */
const constructMenu = (menuData: any[]) => {
  const newMenuData: any[] = [];
  // pro5不支持二级icon
  menuData.forEach((item) => {
    const { children, isLeaf, icon } = item;
    if (!isLeaf && (!children || children?.lenght === 0)) {
      return;
    }
    let iconDom;
    if (icon) {
      iconDom = React.createElement(Icon[icon]);
    }

    newMenuData.push({ ...item, icon: iconDom });
  });
  return newMenuData;
};

/**
 * 加载用户信息
 */
const loadUserInfo = async () => {
  try {
    const accountInfo = await qureyAccount();
    if (!accountInfo) {
      return null;
    }
    // @ts-ignore
    const { data } = accountInfo;
    const { account, layout } = data;
    const user = {
      ...account,
      layout,
    };
    return user;
  } catch (error) {
    history.push('/login');
  }
  return null;
};

/**
 * 加载权限信息
 */
const loadPermissions = () => {
  const promise = permissions();
  promise.then((e) => {
    const { errorCode, data } = e;
    if (errorCode === -1) {
      const { permission } = data;
      setAuthority(permission);
    }
  });
};

/**
 * 初始化数据
 */
export async function getInitialState(): Promise<{
  settings?: LayoutSettings;
  menuData?: MenuDataItem[];
  currentUser?: API.CurrentUser;
  waterMarkData?: WaterMarkProps;
}> {
  if (history.location.pathname !== '/login') {
    // 已登陆
    const currentUser = await loadUserInfo();
    const result = await queryMenuData();
    const waterMark = await loadWaterMark();
    let menuData = result.data;
    // 构建自定义menu
    menuData = constructMenu(menuData);
    loadPermissions();
    return {
      menuData,
      currentUser,
      waterMarkData: waterMark.enable ? waterMark : {},
      settings: { ...defaultSettings },
    };
  }
  return {};
}

/**
 * 初始化布局
 * @param initialState
 */
export const layout = ({
  initialState,
}: {
  initialState: {
    settings?: LayoutSettings;
    currentUser?: API.CurrentUser;
    menuData: MenuDataItem[];
    waterMarkData: WaterMarkProps;
  };
}): BasicLayoutProps => {
  return {
    // 自定义右侧dom
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    footerRender: () => <Footer />,
    onPageChange: () => {
      if (!initialState) {
        return;
      }
      const { currentUser } = initialState;
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!currentUser && location.pathname !== '/login') {
        history.push('/login');
      }
    },
    menuHeaderRender: undefined,
    waterMarkProps: initialState?.waterMarkData,
    menuDataRender: () => {
      return initialState ? initialState.menuData : [];
    },
    ...initialState?.settings,
    ...initialState?.currentUser?.layout,
  };
};

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或编辑数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或编辑数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '请求方法不被允许。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
  2001: '重新登陆',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: ResponseError) => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  }

  if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  throw error;
};

/**
 * 自定义拦截器
 */
const responseInterceptors: ResponseInterceptor[] = [
  async (response: Response) => {
    const result = await response.clone().json();
    const { errorCode, errorMessage } = result;
    if (errorCode === 2001) {
      history.push('/login');
      if (errorMessage) {
        message.error(errorMessage);
      }
      return response;
    }
    if (errorCode && errorCode !== -1) {
      message.error(errorMessage);
    }
    return response;
  },
];

export const request: RequestConfig = {
  responseInterceptors,
  errorHandler,
};

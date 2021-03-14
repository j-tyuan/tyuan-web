import {PureSettings} from "@ant-design/pro-layout/es/defaultSettings";

declare namespace API {
  export interface CurrentUser {
    avatar?: string;
    name?: string;
    title?: string;
    group?: string;
    signature?: string;
    tags?: {
      key: string;
      label: string;
    }[];
    userid?: string;
    access?: 'user' | 'guest' | 'admin';
    unreadCount?: number;
    layout: PureSettings
  }

  export interface LoginStateType {
    status?: 'ok' | 'error' | 'disable';
    type?: string;
  }

  export interface NoticeIconData {
    id: string;
    key: string;
    avatar: string;
    title: string;
    datetime: string;
    type: string;
    read?: boolean;
    description: string;
    clickClose?: boolean;
    extra: any;
    status: string;
  }

  export interface ResultData<T> {
    errorCode: any,
    errorMessage: string,
    data: T,
    success: boolean
  }

}

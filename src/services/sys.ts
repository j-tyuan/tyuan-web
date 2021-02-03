import { request } from 'umi';
import {MenuDataItem} from "@ant-design/pro-layout";

export async function queryMenuData() {
  return request<API.ResultData<MenuDataItem[]>>('/api/sys/nav');
}

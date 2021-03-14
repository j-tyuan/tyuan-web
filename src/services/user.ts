import { request } from 'umi';
import {API} from "@/services/API";

export async function query() {
  return request<API.CurrentUser[]>('/api/users');
}

export async function qureyAccount() {
  return request<API.CurrentUser>('/api/account');
}

export async function queryNotices(): Promise<any> {
  return request<{ data: API.NoticeIconData[] }>('/api/notices');
}

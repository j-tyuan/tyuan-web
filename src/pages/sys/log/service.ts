import {request} from 'umi';
import {TableListParams} from "@/pages/sys/paramManage/data";

export async function query(params?: TableListParams) {
  return request('/api/sys/log', {
    method: 'POST',
    data: {
      ...params
    }
  });
}

export async function getLogType() {
  return request('/api/sys/log/type', {
    method: 'GET'
  });
}


import {request} from 'umi';
import {TableListParams} from "@/pages/sys/paramManage/data";

export async function queryLoginLog(params?: TableListParams) {
  return request('/api/sys/log/login', {
    method: 'POST',
    data: {
      ...params
    }
  });
}

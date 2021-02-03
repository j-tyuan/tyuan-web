import {request} from 'umi';

export async function queryKeys() {
  return request('/api/monitor/redis/keys', {
    method: 'GET'
  });
}


import {request} from 'umi';
import {TableListParams, TableListItem} from './data';

export const uploadUserAvatarAction ="/api/sys/user/avatar"

export async function query(params?: TableListParams) {
  const result = await request('/api/sys/user', {
    method: 'POST',
    data: {
      ...params
    }
  });
  return result;
}

export async function remove(params: { id: number[] }) {
  return request('/api/sys/user/del', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function add(params: TableListItem) {
  return request('/api/sys/user/add', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

export async function update(params: TableListItem) {
  return request('/api/sys/user/edit', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

export async function getByPermission() {
  return request(`/api/sys/permission`);
}

export async function disable(id: number, dis: number) {
  return request(`/api/sys/user/disable/${id}/${dis}`, {
    method: 'POST'
  });
}

import {request} from 'umi';
import {TableListParams, TableListItem} from './data';

export const uploadUserAvatarAction = "/api/sys/user/avatar"

export async function queryUser(params?: TableListParams) {
  const result = await request('/api/sys/user', {
    method: 'POST',
    data: {
      ...params
    }
  });
  return result;
}

export async function removeUser(params: { id: number[] }) {
  return request('/api/sys/user/del', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addUser(params: TableListItem) {
  return request('/api/sys/user/add', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

export async function updateUser(params: TableListItem) {
  return request('/api/sys/user/edit', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

export async function disableUser(id: number, dis: number) {
  return request(`/api/sys/user/disable/${id}/${dis}`, {
    method: 'POST'
  });
}

export async function getRoleByUid(uid: any) {
  return request(`/api/sys/user/${uid}/role`);
}

export const loadUserRoles = async (uid: any) => {
  const result = await getRoleByUid(uid);
  const {errorCode, data} = result;
  if (errorCode === -1) {
    return data;
  }
  return [];
}


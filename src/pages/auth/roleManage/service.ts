import {request} from 'umi';
import {TableListParams, TableListItem} from './data';

export async function query(params?: TableListParams) {
  const result = await request('/api/sys/role', {
    method: 'POST',
    data: {
      ...params
    }
  });
  return result;
}

export async function remove(params: { id: number[] }) {
  return request('/api/sys/role/del', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function add(params: TableListItem) {
  return request('/api/sys/role/add', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

export async function update(params: TableListItem) {
  return request('/api/sys/role/edit', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

export async function queryBindUser(roleId: any) {
  return request(`/api/sys/role/${roleId}/user`);
}

export async function bindUser(roleId: any, userId: any) {
  return request(`/api/sys/role/${roleId}/user/${userId}/bind`, {
    method: 'POST'
  });
}

export async function unbindUser(roleId: any, userId: any) {
  return request(`/api/sys/role/${roleId}/user/${userId}/unbind`, {
    method: 'POST'
  });
}


export async function queryUser(name?: string, phone?: any) {
  return request(`/api/sys/users`, {
    method: 'GET',
    data: {
      name,
      phone
    }
  });
}


export async function getAuthByUid(uid: any) {
  return request(`/api/sys/role/auth/${uid}`);
}


export async function getByPermission() {
  return request(`/api/sys/permission`);
}

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

export async function queryBindUser(params: any) {
  return request(`/api/sys/role/user`, {
    method: 'POST',
    data: {
      ...params
    },
  });
}

export async function bindUser(roleId: any, userIds: any[]) {
  return request(`/api/sys/role/user/bind`, {
    method: 'POST',
    data: {
      roleId,
      userIds
    }
  });
}

export async function unbindUser(roleId: any, userIds: any) {
  return request(`/api/sys/role/user/unbind`, {
    method: 'POST',
    data: {
      roleId,
      userIds
    }
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


export async function getAuthByRoleId(roleId: any) {
  return request(`/api/sys/role/auth/${roleId}`);
}

export async function getByRoles() {
  return request(`/api/sys/role`);
}

export async function getByPermission() {
  return request(`/api/sys/permission`);
}


export const loadRoles = async () => {
  const result = await getByRoles();
  const {errorCode, data} = result;
  if (errorCode === -1) {
    return data;
  }
  return [];
}

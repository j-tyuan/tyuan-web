import request from 'umi-request';

export const uploadAccountAvatarAction = "/api/account/avatar";

export async function queryCurrent() {
  return request('/api/currentUser');
}

export async function queryProvince() {
  return request('/api/geographic/province');
}

export async function queryCity(province: string) {
  return request(`/api/geographic/city/${province}`);
}

export async function query() {
  return request('/api/users');
}

export async function update(account: any) {
  return request('/api/account/setting', {
    method: 'POST',
    data: {
      ...account
    },
  });
}


export async function setCustomLayout(layout: any) {
  return request('/api/account/custom/layout', {
    method: 'POST',
    data: {
      ...layout
    },
  });
}

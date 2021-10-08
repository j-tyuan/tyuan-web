import {request} from 'umi';
import {TableListItem} from './data';

export async function getSourceAll() {
  return  await request('/api/sys/source');
}

export async function removeSource(params: { id: (number | undefined)[] }) {
  return request('/api/sys/source/del', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addSouce(params: TableListItem) {
  return request('/api/sys/source/add', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

export async function updateSource(params: TableListItem) {
  return request('/api/sys/source/edit', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

export async function getByParentId(params: TableListItem) {
  return request(`/api/sys/source`, {
    params,
    method: 'GET'
  });
}

export async function getByPermission() {
  return request(`/api/sys/permission`);
}

import {request} from 'umi';
import {TableListParams, TableListItem} from './data';

export async function queryRule(params?: TableListParams) {
  return request('/api/sys/param', {
    method: 'POST',
    data: {
      ...params
    }
  });
}

export async function remove(params: { id: number[] }) {
  return request('/api/sys/param/del', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function add(params: TableListItem) {
  return request('/api/sys/param/add', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

export async function update(params: TableListItem) {
  return request('/api/sys/param/edit', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

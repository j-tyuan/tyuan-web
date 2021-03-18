import {request} from 'umi';
import {TableListParams, TableListItem} from './data';

export async function query(params?: TableListParams) {
  const result = await request('/api/org/emp', {
    method: 'POST',
    data: {
      ...params
    }
  });
  return result;
}

export async function remove(params: { id: number[] }) {
  return request('/api/org/emp/del', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function add(params: TableListItem) {
  return request('/api/org/emp/add', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

export async function update(params: TableListItem) {
  return request('/api/org/emp/edit', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

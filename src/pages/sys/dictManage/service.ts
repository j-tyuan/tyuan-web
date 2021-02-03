import {request} from 'umi';
import {TableListParams, TableListItem} from './data';

export async function queryTypes() {
  return request('/api/sys/dict/getTypes', {
    method: 'GET',
  })
};


export async function queryRule(params?: TableListParams) {
  return request('/api/sys/dict', {
    method: 'POST',
    data: {
      ...params
    }
  });
}

export async function remove(params: { id: number[] }) {
  return request('/api/sys/dict/del', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function add(params: TableListItem) {
  return request('/api/sys/dict/add', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

export async function update(params: TableListItem) {
  return request('/api/sys/dict/edit', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

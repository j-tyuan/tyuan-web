import {request} from 'umi';
import {TableListParams, TableListItem} from './data';

export async function queryRule(params?: TableListParams) {
  return request('/api/org/inst', {
    method: 'POST',
    data: {
      ...params
    }
  });
}

export async function remove(params: { id: number[] }) {
  return request('/api/org/inst/del', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function add(params: TableListItem) {
  return request('/api/org/inst/add', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

export async function update(params: TableListItem) {
  return request('/api/org/inst/edit', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

export async function getAll() {
  return request('/api/org/inst', {
    method: 'GET'
  });
}

import {request} from 'umi';
import {TableListParams, TableListItem} from './data';

export async function queryTypes() {
  return request('/api/sys/dict/getTypes', {
    method: 'GET',
  })
};


export async function queryDict(params?: TableListParams) {
  return request('/api/sys/dict', {
    method: 'POST',
    data: {
      ...params
    }
  });
}

export async function removeDict(params: { id: number[] }) {
  return request('/api/sys/dict/del', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addDict(params: TableListItem) {
  return request('/api/sys/dict/add', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

export async function updateDict(params: TableListItem) {
  return request('/api/sys/dict/edit', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

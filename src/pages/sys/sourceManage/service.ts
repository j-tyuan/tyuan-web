import {request} from 'umi';
import {TableListParams, TableListItem} from './data';

export async function query(params?: TableListParams) {
  const result = await request('/api/sys/source', {
    method: 'POST',
    data: {
      ...params
    }
  });
  const {data} = result;
  // eslint-disable-next-line array-callback-return
  data.map((e: { isLeaf: any; children: never[]; }) => {
    if (!e.isLeaf) {
      e.children = []
    }
  })
  return result;
}

export async function remove(params: { id: (number | undefined)[] }) {
  return request('/api/sys/source/del', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function add(params: TableListItem) {
  return request('/api/sys/source/add', {
    method: 'POST',
    data: {
      ...params
    },
  });
}

export async function update(params: TableListItem) {
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

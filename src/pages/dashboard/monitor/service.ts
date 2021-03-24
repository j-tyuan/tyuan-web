import request from 'umi-request';

export async function queryTags() {
  return {
    'list|100': [{ name: '@city', 'value|1-100': 150, 'type|0-2': 1 }],
  };
}

import { request } from 'umi';

/**
 * 加载从缓存中水印
 * 使用场景：app.tsx 总加载的时候
 * @param params
 */
export async function loadWaterMark() {
  const result = await request('/api/watermark');
  const { errorCode, data } = result;
  if (errorCode === -1 && data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error(data);
      return {};
    }
  }
  return {};
}

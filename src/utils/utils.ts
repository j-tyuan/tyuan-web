/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const {NODE_ENV} = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};


export const hashCode = (val: string) => {
  let hash = 0;
  let i;
  let chr;
  if (val.length === 0) return hash;
  // eslint-disable-next-line no-plusplus
  for (i = 0; i < val.length; i++) {
    chr = val.charCodeAt(i);
    // eslint-disable-next-line no-bitwise
    hash = ((hash << 5) - hash) + chr;
    // eslint-disable-next-line no-bitwise
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

/**
 * 自定义水印
 * 推荐使用ant自带的水印
 *  setWatermark("企业级快速开发平台-演示版本")
 * @param str
 * @param option
 * @Deprecated
 */
export const setWatermark = (option = {}) => {
  const id = `tyuan.${Math.random()}`;
  if (document.getElementById(id) !== null) {
    // @ts-ignore
    document.body.removeChild(document.getElementById(id));
  }

  const newOption = Object.assign({
    width: 500,
    height: 300,
    rotate: -15,
    fontSize: '16px Vedana',
    fontColor: 'rgba(200, 200, 200, 0.3)',
    content: "水印"
  }, option)

  newOption.fontSize = String(newOption.fontSize);
  if (newOption.fontSize.indexOf("px") === -1) {
    newOption.fontSize += "px Vedana";
  }
  // 创建一个画布
  const can = document.createElement('canvas');
  // 设置画布的长宽
  can.width = newOption.width;
  can.height = newOption.height;

  const cans = can.getContext('2d');
  const rotate = parseInt(newOption.rotate);
  // 旋转角度
  cans.rotate(rotate * Math.PI / 180);
  cans.font = newOption.fontSize;
  // 设置填充绘画的颜色、渐变或者模式
  cans.fillStyle = newOption.fontColor;
  // 设置文本内容的当前对齐方式
  cans.textAlign = 'left';
  // 设置在绘制文本时使用的当前文本基线
  cans.textBaseline = 'Middle';
  // 在画布上绘制填色的文本（输出的文本，开始绘制文本的X坐标位置，开始绘制文本的Y坐标位置）
  cans.fillText(newOption.content, can.width / 8, can.height / 2);
  if (newOption.image) {
    const image = document.createElement("img");
    image.src = newOption.image.src;
    cans.drawImage(image);
  }
  window.bgWater = can.toDataURL('image/png');
}

/**
 * 查找父亲节点 链
 * 返回父节点列表
 * @param id
 * @param data
 * @return [{..},{...},{...},{...}]
 */
export const findParentPath = (id: any, data: any[]) => {
  const items: any[] = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if (item.id === id) {
      items.push({...item})
      return items;
    }
    if (item.children) {
      const p = findParentPath(id, item.children);
      if (p.length > 0) {
        items.push({...item})
        items.push(...p)
      }
    }
  }
  return items;
}

/**
 * 查找父亲节点 链
 * 返回父节点列表
 * @param id
 * @param data
 * @return [0,1,2,3]
 */
export const findParentPathIds = (id: any, data: any[]) => {
  const paths = findParentPath(id, data);
  const ids: any[] = [];
  paths.forEach(e => {
    ids.push(e.id)
  })
  return ids;
}

/**
 * 递归设置树形结构
 * @param data
 * @param callBack
 */
export const recursionTree = (data: any[], callBack: any) => {
  data.forEach(e => {
    if (e.children) {
      recursionTree(e.children, callBack)
    }
    callBack(e)
  })
}

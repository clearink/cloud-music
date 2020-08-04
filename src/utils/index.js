export const formatNum = num => {
  //10^8 1亿 10^4 1万
  if (typeof num !== "string" && typeof num !== "number") return 0;
  const map = ["", "万", "亿"];
  let power = 8;
  while (num < 10 ** power && power > 0) {
    power -= 4;
  }
  return (num / 10 ** power).toFixed(1) + map[power / 4];
};
//格式化时间
export const formatTime = duration => {
  //转换成00:00
  const minute = Math.floor(duration / 60).toString();
  const second = Math.floor(duration % 60).toString();

  return minute.padStart(2, 0) + ":" + second.padStart(2, 0);
};

export const shuffle = arr => {
  const res = [];
  const meta = [...arr];
  let len = meta.length;
  while (len > 0) {
    let i = (Math.random() * len) | 0;
    res.push(meta[i]);
    meta[i] = meta[--len];
  }
  return res;
};

// //归并排序
// export const mergeSort = data => {};
// function merge(start, end) {
//   const temp = Array(end - start);
//   return temp;
// }

//获取对象任意层级的属性
export const getV = (obj, propName) => {
  //bfs
  const queue = [obj];
  while (queue.length !== 0) {
    const obj = queue.shift();
    if (obj.hasOwnProperty(propName)) {
      return obj[propName];
    }
    const newValue = Object.values(obj).filter(item => item instanceof Object);
    queue.push(...newValue);
  }
};

export const randint = (start, end) => {
  return Math.round(Math.random() * (end - start)) + start;
};

//节流函数 (在一定时间内只能触发一个)
export function throttle(fn, delay = 500) {
  let timer = null;
  return function(...args) {
    if (timer) return;
    try {
      args[0].persist();
    } catch {}
    timer = setTimeout(() => {
      timer = null;
      fn.call(this, ...args);
    }, delay);
  };
}
//防抖函数 (只有触发的间隔超过指定间隔时，函数fn才会执行)
export function debounce(fn, delay = 500) {
  let timer = null;
  return function(...args) {
    clearTimeout(timer);
    try {
      args[0].persist();
    } catch {}
    timer = setTimeout(() => {
      fn.call(this, ...args);
    }, delay);
  };
}

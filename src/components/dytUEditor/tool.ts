// 获取对应父级节点
export function parents (element:any, key:string) {
  let current = typeof element === 'string' ? document.querySelector(element) : element;
  const target = document.querySelectorAll(key);
  if (!current) return target[0] || null;
  if (!target) return null;
  // 添加标记
  target.forEach((dome) => {
    dome.setAttribute('get-target-parents', 'get-target-parents')
  });
  while (current.getAttribute('get-target-parents') !== 'get-target-parents') {
    current = current.parentNode;
  }
  // 移除标记
  target.forEach((dome) => {
    dome.removeAttribute('get-target-parents');
  });
  return current;
}
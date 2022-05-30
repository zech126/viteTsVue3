// 一个简单的事件订阅发布的实现
export class LoadEvent {
  listeners: loadSubscribeListeners;

  constructor() {
    this.listeners = {};
  }
  // 添加订阅事件
  on(eventName: string, callback: () => void) {
    if (this.listeners[eventName] === undefined) {
      this.listeners[eventName] = {
        triggered: false,
        requested: false,
        lineUp: [],
      };
    }
    // 如果已经触发过，直接执行 callback
    if (this.listeners[eventName].triggered) {
      callback();
    }
    this.listeners[eventName].lineUp.push(callback);
  }
  // 触发订阅事件
  emit(eventName: string) {
    if (this.listeners[eventName]) {
      this.listeners[eventName].triggered = true;
      this.listeners[eventName].lineUp.forEach((callback) => callback());
    }
  }
}
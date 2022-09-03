/**
 * 对 iconfont 里面的 svg 包装
 */
// import svgIcon from './svgIcon.vue';
// export default svgIcon;

import { defineComponent } from 'vue';
export default defineComponent({
  name: 'svgIcon',
  props: {
    name: { type: String, required: true }
  },
  render() {
    return <svg class={`svg-icon ${this.name}`} aria-hidden="true">
      <use xlink:href={`#${this.name}`}></use>
    </svg>
  }
})

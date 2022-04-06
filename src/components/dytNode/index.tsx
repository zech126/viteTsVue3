import { defineComponent } from 'vue';
export default defineComponent({
// export default {
  name: 'DytNode',
  props: {
    node: {type: Function, default: () => {}},
    nodeParameter: { type: Object, default: () => {return {}}}
  },
  render() {
    return this.node(this.nodeParameter);
  }
})
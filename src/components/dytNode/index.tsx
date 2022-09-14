import { defineComponent, ref } from 'vue';
import common from '@/utils/common';
export default defineComponent({
  name: 'DytNode',
  props: {
    node: {type: Function, default: () => {}},
    nodeParameter: { type: Object, default: () => {return {}}},
    prop: { type: Object, default: () => {return {}}}
  },
  setup(props) {
    let nodeText = ref('');
    const handNode = (prop:{[key:string]: any}) => {
      const res = props.node(prop);
      if (common.isPromise(res)) {
        return res.then((node) => {
          nodeText.value = node;
        }).catch(() => {
          nodeText.value = '';
        })
      }
      nodeText.value = res;
    }
    handNode ({...props.prop, ...props.nodeParameter});
    return { nodeInfo: nodeText }
  },
  render() {
    return this.nodeInfo;
  }
})
import { defineComponent } from 'vue';
import common from '@/utils/common';
export default defineComponent({
  name: 'DytNode',
  props: {
    node: {type: Function, default: () => {}},
    nodeParameter: { type: Object, default: () => {return {}}},
    prop: { type: Object, default: () => {return {}}}
  },
  data () {
    return {
      nodeInfo: ''
    }
  },
  created() {
    const res = this.node({...this.nodeParameter, ...this.prop});
    if (!common.isPromise(res)) {
      this.nodeInfo = res;
      return;
    }
    res.then((node) => {
      this.nodeInfo = node;
    }).catch(() => {
      this.nodeInfo = '';
    })
  },
  render() {
    return this.nodeInfo;
  }
})
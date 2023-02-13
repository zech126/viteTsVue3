import { defineComponent, ref } from 'vue';
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
      filterModel: {
        commonStr2: 'commonStr2'
      },
    }
  },
  setup(props) {
    let nodeText = ref('');
    const getRes = props.node({...props.prop, ...props.nodeParameter});
    const isPromise = common.isPromise(getRes);
    const handNode = () => {
      if (isPromise) {
        getRes.then((node) => {
          nodeText.value = node;
        }).catch(() => {
          nodeText.value = '';
        })
      }
    }
    handNode ();
    return { nodeInfo: nodeText, isPromise: isPromise }
  },
  render() {
    return this.isPromise ? this.nodeInfo : this.node({...this.prop, ...this.nodeParameter});
  }
})

// 对 element-plus icon 再次封装
import { h, resolveComponent, defineComponent } from 'vue';
export default defineComponent({
  name: 'Icon',
  props: {
    name: { type: String, required: true }
  },
  render() {
    const className = {
      loading: 'is-loading'
    }
    return <el-icon {...this.$attrs} class={className[this.name]}>
      {h(resolveComponent(this.name))}
    </el-icon>
  }
})
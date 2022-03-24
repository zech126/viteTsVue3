
// 对 element-plus icon 再次封装
// import { h, resolveComponent, defineComponent } from 'vue';
import { h, resolveComponent } from 'vue';
export default {
  name: 'Icon',
  props: {
    name: { type: String, required: true }
  },
  render() {
    return <el-icon {...this.$attrs}>
      {h(resolveComponent(this.name))}
    </el-icon>
  }
}
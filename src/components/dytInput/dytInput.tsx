// import dytInput from './dytInput.vue';
// export default dytInput;
import { defineComponent } from 'vue';
type configType = { disabled?:boolean, readonly?:boolean, placeholder?: string, clearable?:boolean };
export default defineComponent({
  name: 'DytInput',
  data () {
    return {
      pageId: Math.random().toString(36).substring(2)
    }
  },
  setup() {},
  props: {},
  computed: {
    slots ():{keys: Array<string>, value: Array<any>} {
      return {
        keys: Object.keys(this.$slots),
        value: Object.values(this.$slots)
      }
    },
    selectConfig () {
      let config:configType = { clearable: true, placeholder: '请输入', ...this.$attrs };
      if (config.disabled || config.readonly) {
        config.placeholder = '';
      }
      return config;
    }
  },
  methods: {
    focus () {
      this.$refs[`${this.pageId}`]?.focus();
    },
    blur () {
      this.$refs[`${this.pageId}`]?.blur();
    },
    select () {
      this.$refs[`${this.pageId}`]?.select();
    }
  },
  render() {
    let slots = {};
    this.slots.keys.forEach((tSlot: string, index:number) => {
      slots[tSlot] = () => {
        return this.slots.value[index]();
      }
    });
    return <el-input class="dyt-input-demo"
      {
        ...{...this.selectConfig, ref: this.pageId}
      }
      v-slots={ slots }
    />
  }
})
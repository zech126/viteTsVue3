// import dytInput from './dytInput.vue';
// export default dytInput;

// import { defineComponent } from 'vue';
// export default defineComponent({
export default {
  name: 'DytInput',
  isGlobal: true,
  data () {
    return {
      pageId: Math.random().toString(36).substring(2),
      defaultConfig: {
        clearable: true,
        placeholder: '请输入'
      }
    }
  },
  setup() {},
  props: {},
  computed: {
    slots () {
      return {
        keys: Object.keys(this.$slots),
        value: Object.values(this.$slots)
      }
    },
    selectConfig () {
      let config = { ...this.defaultConfig, ...this.$attrs };
      if (config.disabled || config.readonly) {
        config.placeholder = '';
      }
      return config;
    }
  },
  methods: {
    focus () {
      this.$refs[`${this.pageId}`].focus();
    },
    blur () {
      this.$refs[`${this.pageId}`].blur();
    },
    select () {
      this.$refs[`${this.pageId}`].select();
    }
  },
  render() {
    let slots = {};
    this.slots.keys.forEach((tSlot, index) => {
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
}
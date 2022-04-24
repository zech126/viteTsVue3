<template>
  <el-button
    :ref="pageId"
    v-bind="selectConfig"
    class="dyt-button-demo"
  >
    <template v-slot:icon v-if="slots.includes('icon') || !$common.isEmpty(icon)">
      <Icon v-if="!slots.includes('icon') && !$common.isEmpty(icon)" :name="icon" />
      <slot v-else name="icon" />
    </template>
    <template v-for="tSlot in slots.filter(slot => !nuinclude.includes(slot))" v-slot:[tSlot]>
      <slot :name="tSlot" />
    </template>
  </el-button>
</template>
<script>
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'DytButton',
  components: {},
  props: {
    icon: { type: String, default: '' },
    moduleData: { type: Object, default: () => {return {}} }
  },
  data () {
    return {
      pageId: Math.random().toString(36).substring(2),
      nuinclude: ['icon'],
      defaultConfig: {
        size: 'default'
      }
    }
  },
  computed: {
    slots () {
      return Object.keys(this.$slots);
    },
    selectConfig () {
      let config = { ...this.defaultConfig, ...this.$attrs };
      if (config.disabled || config.readonly) {
        config.placeholder = '';
      }
      return config;
    }
  },
  watch: {},
  created () {},
  mounted () {},
  methods: {}
});
</script>
<style>
.el-button i[class*=lapa]+span{
  margin-left: 6px;
}
</style>
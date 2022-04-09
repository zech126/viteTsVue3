<template>
  <el-button
    :ref="pageId"
    v-bind="selectConfig"
    class="dyt-button-demo"
  >
    <Icon class="el-button-icon" v-if="icon" :name="icon" />
    <slot />
    <template v-for="tSlot in slots.filter(slot => !nuinclude.includes(slot))" v-slot:[tSlot]>
      <slot :name="tSlot" />
    </template>
  </el-button>
</template>
<script>

export default {
  name: 'DytButton',
  components: {},
  props: {
    icon: { type: String, default: '' },
    moduleData: { type: Object, default: () => {return {}} }
  },
  data () {
    return {
      pageId: Math.random().toString(36).substring(2),
      nuinclude: ['default'],
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
};
</script>
<style lang="scss" scoped>
.dyt-button-demo{
  .el-button-icon{
    margin-right:5px;
  }
}
</style>

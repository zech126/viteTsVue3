<template>
  <el-select :ref="pageId" v-bind="selectConfig" class="dyt-select-demo">
    <!-- 默认插槽 -->
    <slot>
      <template v-for="(item, index) in options">
        <el-option
          v-if="(typeof item.value !== 'undefined')"
          :key="`${pageId}-${index}`"
          :label="(typeof item.label !== 'undefined' ? item.label : item.value)"
          :value="item.value"
          :disabled="(typeof item.disabled !== 'boolean' ? item.disabled : false)"
        />
      </template>
    </slot>
    <template v-for="slot in slots" v-slot:[slot]="scope">
      <slot v-if="slot !== 'default'" :name="slot" v-bind="scope" />
    </template>
  </el-select>
</template>
<script lang="ts">

export default {
  name: 'DytSelect',
  isGlobal: true,
  components: {},
  props: {
    options: { type: Array, default: () => {return []} }
  },
  data () {
    return {
      pageId: Math.random().toString(36).substr(2),
    }
  },
  computed: {
    slots () {
      return Object.keys(this.$slots)
    },
    selectConfig () {
      let config = {
        ...{
          placeholder: '请选择',
          size: 'default',
          clearable: true,
          filterable: true,
          disabled: false,
          readonly: false
        },
        ...this.$attrs
      };
      if (config.disabled || config.readonly) {
        config.placeholder = '';
      }
      return config;
    }
  },
  watch: {},
  created () {
    this.init();
  },
  mounted () {},
  methods: {
    init () {},
    focus () {
      this.$refs[`${this.pageId}`].focus();
    },
    blur () {
      this.$refs[`${this.pageId}`].blur();
    }
  }
};
</script>
<style lang="less">
.dyt-select-demo{
  &.el-select{
    width: 100%;
  }
  .el-select__tags{
    padding-left: 11px;
  }
}
</style>

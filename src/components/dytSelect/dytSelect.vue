<template>
  <el-select :ref="data.pageId" v-bind="selectConfig" class="dyt-select-demo">
    <!-- 默认插槽 -->
    <slot>
      <template v-for="(item, index) in props.options">
        <el-option
          v-if="(typeof item.value !== 'undefined')"
          :key="`${data.pageId}-${index}`"
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
<script lang="ts" setup>
import {computed, useSlots, useAttrs, reactive} from 'vue';
import getProxy from "@/utils/proxy";

const props = defineProps({
  options: { type: Array, default: () => {return []} }
});
const data = reactive({
  pageId: Math.random().toString(36).substr(2) 
})
const proxy:any = getProxy();
const slots = computed(() => Object.keys(useSlots()));
const selectConfig = computed(() => {
  let config = { ...{ placeholder: '请选择', size: 'default', clearable: true, filterable: true, disabled: false, readonly: false }, ...useAttrs() };
  if (config.disabled || config.readonly) {
    config.placeholder = '';
  }
  return config;
});

const focus = () => {
  proxy.$refs[`${data.pageId}`]?.focus();
};
const blur = () => {
  proxy.$refs[`${data.pageId}`]?.blur();
}
// 暴露给父级使用 ref 时使用
defineExpose({ focus, blur });

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

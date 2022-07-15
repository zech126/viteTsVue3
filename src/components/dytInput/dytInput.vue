<template>
  <el-input ref="dytInputRef" v-bind="selectConfig" class="dyt-input-demo">
    <template v-for="tSlot in slots" v-slot:[tSlot]>
      <slot :name="tSlot" />
    </template>
  </el-input>
</template>
<script lang="ts" setup>
import {computed, useSlots, useAttrs} from 'vue';
import getProxy from "@/utils/proxy";
const proxy = getProxy();
const slots = computed(() => Object.keys(useSlots()));
const selectConfig = computed(() => {
  let config = { ...{ disabled: false, readonly: false, clearable: true, placeholder: '请输入' }, ...useAttrs() };
  if (config.disabled || config.readonly) {
    config.placeholder = '';
  }
  return config;
});
const focus = () => {
  proxy?.$refs.dytInputRef?.focus();
}
const blur = () => {
  proxy?.$refs.dytInputRef?.blur();
}
const select = () => {
  proxy?.$refs.dytInputRef?.select();
}
const clear = () => {
  proxy?.$refs.dytInputRef?.clear();
}
const resizeTextarea = () => {
  proxy?.$refs.dytInputRef?.resizeTextarea();
}

// 暴露给父级使用 ref 时使用
defineExpose({ focus, blur, select, clear, resizeTextarea });
</script>

<template>
  <el-input ref="dytInputRef" v-bind="selectConfig" class="dyt-input-demo">
    <template v-for="tSlot in slots" v-slot:[tSlot]>
      <slot :name="tSlot" />
    </template>
  </el-input>
</template>
<script lang="ts" setup>
import {computed, ComputedRef, useSlots, useAttrs} from 'vue';
import getProxy from "@/hooks/proxy";
const proxy:any = getProxy();
const slots:ComputedRef<unknown> = computed(() => Object.keys(useSlots()));
const selectConfig:ComputedRef<unknown> = computed(() => {
  let config = { ...{ disabled: false, readonly: false, clearable: true, placeholder: '请输入' }, ...useAttrs() };
  if (config.disabled || config.readonly) {
    config.placeholder = '';
  }
  return config;
});
const focus = () => {
  proxy.$refs.dytInputRef?.focus();
}
const blur = () => {
  proxy.$refs.dytInputRef?.blur();
}
const select = () => {
  proxy.$refs.dytInputRef?.select();
}
// 暴露给父级使用 ref 时使用
defineExpose({ focus, blur, select });
</script>

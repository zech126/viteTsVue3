<template>
  <el-button
    :ref="data.pageId"
    v-bind="selectConfig"
    class="dyt-button-demo"
  >
    <template v-slot:icon v-if="slots.includes('icon') || !$common.isEmpty(props.icon)">
      <Icon v-if="!slots.includes('icon') && !$common.isEmpty(props.icon)" :name="props.icon" />
      <slot v-else name="icon" />
    </template>
    <template v-for="tSlot in slots.filter(slot => !data.nuinclude.includes(slot))" v-slot:[tSlot]>
      <slot :name="tSlot" />
    </template>
  </el-button>
</template>
<script lang="ts" setup>
import { reactive, computed, useSlots, useAttrs } from 'vue';
const $slots = useSlots();
const $attrs = useAttrs();

const props = defineProps({
  icon: { type: String, default: '' }
})

const data = reactive({
  pageId: Math.random().toString(36).substring(2),
  nuinclude: ['icon'],
  defaultConfig: {
    size: 'default'
  }
})

const slots = computed(() => {
  return Object.keys($slots);
})

const selectConfig = computed(() => {
  let config = { ...data.defaultConfig, ...$attrs };
  return config;
})
</script>
<style>
.el-button i[class*=lapa]+span{
  margin-left: 6px;
}
</style>
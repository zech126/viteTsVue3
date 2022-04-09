<template>
  <el-select :ref="data.pageId" v-bind="selectConfig" class="dyt-select-demo">
    <!-- 默认插槽 -->
    <slot>
      <template v-for="(item, index) in options">
        <el-option
          v-if="(typeof item[defaultProp.value] !== 'undefined')"
          :key="`${data.pageId}-${index}`"
          :label="(typeof item[defaultProp.label] !== 'undefined' ? item[defaultProp.label] : item[defaultProp.value])"
          :value="item[defaultProp.value]"
          :disabled="(typeof item[defaultProp.disabled] !== 'boolean' ? item[defaultProp.disabled] : false)"
        />
      </template>
    </slot>
    <template v-for="slot in slots.filter((slotI:string) => !data.unIncludes.includes(slotI))" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>
  </el-select>
</template>
<script lang="ts" setup>
import {computed, useSlots, useAttrs, reactive} from 'vue';
import getProxy from "@/utils/proxy";

const props = defineProps({
  // 默认下拉数据
  options: { type: Array, default: () => {return []} },
  // 选项中和展示值道具
  defaultProp: { type: Object,  default: () =>{return {}} }
});
const data = reactive({
  pageId: Math.random().toString(36).substring(2),
  unIncludes: ['default']
})
const proxy:any = getProxy();
const slots = computed(() => Object.keys(useSlots()));
const options:any = computed(() => props.options);

const defaultProp = computed(() => {
  return {
    value: 'value',
    label: 'label',
    disabled: 'disabled',
    ...props.defaultProp
  }
});
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
    padding-left: 0px;
  }
}
</style>

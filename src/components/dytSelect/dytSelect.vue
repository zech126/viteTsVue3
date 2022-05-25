<template>
  <el-select-v2
    v-if="isVirtual"
    v-bind="selectConfig"
    :options="options"
    class="dyt-select-demo"
  >
    <!-- 默认插槽 -->
    <slot />
    <template v-for="slot in slots.filter((slotI:string) => !data.unIncludes.includes(slotI))" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>
  </el-select-v2>
  <el-select v-else :ref="data.pageId" v-bind="selectConfig" class="dyt-select-demo">
    <!-- 默认插槽 -->
    <slot>
      <template v-for="(item, index) in options">
        <el-option-group
          v-if="!global.$common.isEmpty(item[defaultProp.options])"
          :key="`group-${index}`"
          :label="(typeof item[defaultProp.label] !== 'undefined' ? item[defaultProp.label] : item[defaultProp.value] || '')"
        >
          <template v-for="(group, gIndex) in item[defaultProp.options]">
            <el-option
              v-if="(typeof group[defaultProp.value] !== 'undefined')"
              :key="`group-item-${gIndex}`"
              :label="(typeof group[defaultProp.label] !== 'undefined' ? group[defaultProp.label] : group[defaultProp.value])"
              :value="group[defaultProp.value]"
              :disabled="(typeof group[defaultProp.disabled] !== 'boolean' ? group[defaultProp.disabled] : false)"
            />
          </template>
        </el-option-group>
        <el-option
          v-else-if="(typeof item[defaultProp.value] !== 'undefined')"
          :key="`option-${index}`"
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
import getGlobal from '@/utils/global';
const global = getGlobal();
const attrs = useAttrs();

const props = defineProps({
  // 默认下拉数据
  options: { type: Array, default: () => {return []} },
  // 选项中和展示值道具
  defaultProp: { type: Object,  default: () =>{return {}} },
  // 是否使用虚拟滚动(开启后不支持默认插槽)
  virtual: { type: Boolean,  default: false },
});
const data = reactive({
  pageId: Math.random().toString(36).substring(2),
  unIncludes: ['default']
})
const proxy:any = getProxy();
const isVirtual = computed(() => props.virtual);
const slots = computed(() => Object.keys(useSlots()));

const defaultProp = computed(() => {
  return {
    value: 'value',
    label: 'label',
    disabled: 'disabled',
    options: 'options',
    ...props.defaultProp
  }
});
const options:any = computed(() => {
  if (isVirtual.value) {
    let newList = global.$common.copy(props.options);
    const handData = (arr:Array<any>) => {
      arr.forEach((item:any) => {
        if (!global.$common.isEmpty(defaultProp.value.value) && defaultProp.value.value !== 'value' && typeof item[defaultProp.value.value] !== 'undefined') {
          item['value'] = item[defaultProp.value.value];
          delete item[defaultProp.value.value];
        }
        if (!global.$common.isEmpty(defaultProp.value.label) && defaultProp.value.label !== 'label' && typeof item[defaultProp.value.label] !== 'undefined') {
          item['label'] = item[defaultProp.value.label];
          delete item[defaultProp.value.label];
        }
        if (!global.$common.isEmpty(defaultProp.value.options) && !global.$common.isEmpty(item[defaultProp.value.options]) && defaultProp.value.options !== 'options') {
          item['options'] = handData(item[defaultProp.value.options]);
          delete item[defaultProp.value.options];
        }
      });
      return arr;
    }
    handData(newList);
    return newList;
  }
  return props.options
});
const selectConfig = computed(() => {
  let config = {
    placeholder: '请选择',
    size: 'default',
    clearable: true,
    filterable: true,
    disabled: false,
    readonly: false,
    'collapse-tags-tooltip': false,
    'collapse-tags': false,
    ...attrs
  };
  config['popper-class'] = (`${config['popper-class'] || ''} select-demo-popper`).trim();
  if (config.disabled || config.readonly) {
    config.placeholder = '';
  }
  if (config['collapse-tags'] && typeof attrs['collapse-tags-tooltip'] !== 'boolean') {
    config['collapse-tags-tooltip'] = true;
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
  width: 100%;
  &.el-select{
    width: 100%;
  }
  .el-select__tags{
    padding-left: 0px;
  }
}
.select-demo-popper{
  &.el-popper{
    font-size: var(--dyt-font-size);
    .el-select-group__title{
      padding-left: 15px;
      font-size: calc(var(--dyt-font-size) + 1px);
      font-weight: bold;
    }
    .el-select-group__wrap{
      &:not(:last-of-type):after{
        left: 10px;
        right: 10px;
      }
    }
    .el-select-group__split{
      .el-select-group__split-dash{
        left: 10px;
        right: 10px;
      }
    }
  }
}
</style>

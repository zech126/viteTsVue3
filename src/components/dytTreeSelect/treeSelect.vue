<template>
  <el-tree-select :ref="data.pageId" :data="treeData" v-bind="selectConfig" class="dyt-tree-select">
    <template v-for="slot in slots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>
  </el-tree-select>
</template>
<script lang="ts" setup>
import {computed, useSlots, useAttrs, reactive} from 'vue';
import getProxy from "@/utils/proxy";
import getGlobal from '@/utils/global';
const global = getGlobal();
const props = defineProps({
  // 默认下拉数据
  data: { type: Array, default: () => {return []} },
  options: { type: Array, default: () => {return []} },
  // 选项中和展示值道具
  defaultProps: { type: Object,  default: () =>{return {}} }
});
const data = reactive({
  pageId: Math.random().toString(36).substring(2),
  // unIncludes: ['default']
})
const proxy:any = getProxy();
const slots = computed(() => Object.keys(useSlots()));
const treeData = computed(() => {
  return global.$common.isEmpty(props.data) ? props.options : props.data;
});

const attrs = useAttrs();
const selectConfig = computed(() => {
  let config = { 
    ...{
      placeholder: '请选择',
      size: 'default',
      clearable: true,
      filterable: true,
      disabled: false,
      readonly: false,
      multiple: false,
      limit: 0,
      'check-strictly': true,
      props: props.defaultProps
    },
    ...attrs
  };
  config['popper-class'] = (`${config['popper-class'] || ''} tree-select-popper`).trim();
  if (config.multiple) {
    config['show-checkbox'] = typeof attrs['show-checkbox'] === 'boolean' ? attrs['show-checkbox'] : true;
    config['collapse-tags'] = typeof attrs['collapse-tags'] === 'boolean' ? attrs['collapse-tags'] : true;
    config['collapse-tags-tooltip'] = typeof attrs['collapse-tags-tooltip'] === 'boolean' ? attrs['collapse-tags-tooltip'] : true;
    config['check-strictly'] = typeof attrs['check-strictly'] === 'boolean' ? attrs['check-strictly'] : false;
  }
  
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
.dyt-tree-select{
  width: 100%;
  &.el-select{
    width: 100%;
  }
  .el-select__tags{
    padding-left: 0px;
  }
}
.tree-select-popper{
  &.el-popper{
    font-size: @font-size;
    .el-select-group__title{
      padding-left: 15px;
      font-size: calc(@font-size + 1px);
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

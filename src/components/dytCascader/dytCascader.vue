<template>
  <el-cascader ref="dytCascader" v-bind="selectConfig" class="dyt-cascader-demo">
    <template v-if="slots.includes('default')" v-slot="scope">
      <slot v-bind="scope">
        <span>{{ scope.data[data.defaultProp.label] }}{{`${scope.node.isLeaf}`}}</span>
      </slot>
    </template>
    <template v-for="tSlot in slots.filter((it:string) => !unSlots.includes(it))" v-slot:[tSlot]="scope">
      <slot :name="tSlot" v-bind="scope" />
    </template>
  </el-cascader>
</template>
<script lang="ts" setup>
import {computed, useSlots, useAttrs, reactive} from 'vue';
import getProxy from "@/utils/proxy";

const unSlots:Array<any> = ['default'];
const proxy = getProxy();
const attrs:any = useAttrs();
const slots:any = computed(() => Object.keys(useSlots()));
const data = reactive({
  defaultProp: {
    label: 'label',
    children: 'children0',
    ...attrs.props
  }
});
const selectConfig = computed(() => {
  let config = { ...{ disabled: false, readonly: false, size: 'default', clearable: true, placeholder: '请选择' }, ...attrs };
  if (config.disabled || config.readonly) {
    config.placeholder = '';
  }
  return config;
});

const getCheckedNodes = (leafOnly:boolean = false) => {
  proxy?.$refs.dytCascader?.getCheckedNodes(leafOnly);
}
// 暴露给父级使用 ref 时使用
defineExpose({ getCheckedNodes });

</script>
<style lang="less">
.dyt-cascader-demo.el-cascader{
  display: inline-block;
  width: 100%;
}
.el-cascader-panel{
  max-width: calc(100vw - 50px);
  overflow: auto;
}
</style>

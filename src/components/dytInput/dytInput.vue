<template>
  <el-input ref="dytInputRef" v-bind="selectConfig" class="dyt-input-demo">
    <template v-for="tSlot in mySlots.keys" v-slot:[tSlot]>
      <slot :name="tSlot" />
    </template>
  </el-input>
</template>
<script lang="ts">
import {computed, ComputedRef} from 'vue';
import getProxy from "@/hooks/proxy";

interface configType {
  disabled: boolean,
  readonly: boolean,
  placeholder: string
}

export default {
  name: 'DytInput',
  isGlobal: true,
  props: {},
  setup(props, { attrs, slots, emit, expose }) {
    const proxy = getProxy();
    const mySlots:ComputedRef<unknown> = computed(() => {
      return {
        keys: Object.keys(slots),
        value: Object.values(slots)
      } 
    })
    const selectConfig:ComputedRef<unknown> = computed(() => {
      let config:configType = {
        ...{
          disabled: false,
          readonly: false,
          clearable: true,
          placeholder: '请输入'
        },
        ...attrs
      };
      if (config.disabled || config.readonly) {
        config.placeholder = '';
      }
      return config;
    })
    const focus = () => {
      // @ts-ignore
      proxy.$refs.dytInputRef?.focus();
    }
    const blur = () => {
      // @ts-ignore
      proxy.$refs.dytInputRef?.blur();
    }
    const select = () => {
      // @ts-ignore
      proxy.$refs.dytInputRef?.select();
    }
    return {
      mySlots, selectConfig, focus, blur, select
    }
  }
}

</script>
<style lang="less">
// .dyt-input-demo.el-input{}
</style>

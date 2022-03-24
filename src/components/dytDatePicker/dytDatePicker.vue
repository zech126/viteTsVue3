<template>
  <el-date-picker ref="dytDatePicker" v-bind="selectConfig" class="dyt-date-picker-demo">
    <template v-for="slot in slots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>
  </el-date-picker>
</template>
<script lang="ts" setup>
import {computed, useSlots, useAttrs, reactive} from 'vue';
import getProxy from "@/utils/proxy";
import getGlobal from "@/utils/global";

const proxy:any = getProxy();
const global: any = getGlobal();
const attrs = useAttrs();
const slots = computed(() => Object.keys(useSlots()));
const dateAdd = (add:number = 0, type:string = 'day', oldDate:Date = new Date()) => {
  return new Date(global.$dayjs(oldDate).add(add, type));
};
const data = reactive({
  pickerProps: {
    default: {
      placeholder: '请选择',
      shortcuts: [
        { text: '今天', value: new Date() },
        { text: '昨天', value: dateAdd(-1, 'day') },
        { text: '一周前', value: dateAdd(-7, 'day') },
        { text: '一月前', value: dateAdd(-1, 'month') }
      ]
    },
    dateRange: {
      'range-separator': '-',
      'start-placeholder': '开始日期',
      'end-placeholder': '结束日期',
      shortcuts: [
        { text: '最近一周', value: [dateAdd(-7, 'day'), new Date()] },
        { text: '最近一个月', value: [dateAdd(-1, 'month'), new Date()] },
        { text: '最近三个月', value: [dateAdd(-3, 'month'), new Date()] }
      ]
    }
  },
  defaultConfig: {
    size: 'default',
    align: 'right',
    'unlink-panels': true,
    'format': 'YYYY-MM-DD HH:mm:ss',
    'value-format': 'YYYY-MM-DD HH:mm:ss'
  }
});
const selectConfig = computed(() => {
  let config:any = {};
  if (attrs.type && attrs.type.includes('range')) {
    config = {...data.defaultConfig, ...data.pickerProps.dateRange, ...attrs};
  } else {
    config = {...data.defaultConfig, ...data.pickerProps.default, ...attrs};
  }
  if (config.disabled || config.readonly) {
    config.placeholder = '';
  }
  return config;
});
const focus = (focusStartInput:any) => {
  proxy.$refs.dytDatePicker?.focus(focusStartInput);
};
// 暴露给父级使用 ref 时使用
defineExpose({ focus });
</script>
<style lang="scss">
.cell {
  height: 30px;
  padding: 3px 0;
  box-sizing: border-box;
}
.cell .text {
  width: 24px;
  height: 24px;
  display: block;
  margin: 0 auto;
  line-height: 24px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 50%;
}
.cell.current .text {
  background: purple;
  color: #fff;
}
.cell .holiday {
  position: absolute;
  width: 6px;
  height: 6px;
  background: red;
  border-radius: 50%;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
}
</style>

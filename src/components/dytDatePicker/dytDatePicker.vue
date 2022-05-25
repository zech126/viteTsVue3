<template>
  <el-date-picker ref="dytDatePicker" @change="change" v-bind="selectConfig" v-model="data.mValue" class="dyt-date-picker-demo">
    <template v-for="slot in slots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>
  </el-date-picker>
</template>
<script lang="ts" setup>
import { computed, useSlots, useAttrs, reactive, watch } from 'vue';
import getProxy from "@/utils/proxy";
import getGlobal from "@/utils/global";

interface dataType{
  mValue: string | Number | Date | Array<string | number | Date>;
  pickerProps: {
    default: {
      placeholder: string,
      shortcuts: Array<{text: string, value: string | Date}>
    },
    dateRange: any
  };
  defaultConfig: any
}

const proxy:any = getProxy();
const global: any = getGlobal();
const props = defineProps({
  modelValue: {type: [String, Number, Date, Array], defalt: ''}
})
const attrs: any = useAttrs();
const slots: any = computed(() => Object.keys(useSlots()));
const $emit = defineEmits(['update:modelValue']);

const dateAdd = (add:number = 0, type:string = 'day', oldDate:Date = new Date()) => {
  return new Date(global.$dayjs(oldDate).add(add, type));
};
const data:dataType = reactive({
  mValue: '',
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
    'unlink-panels': true
    // format: 'YYYY-MM-DD HH:mm:ss'
    // 'value-format': 'YYYY-MM-DD HH:mm:ss'
  }
});
const selectConfig = computed(() => {
  let config:any = {};
  if (attrs.type && attrs.type.includes('range')) {
    config = {...data.defaultConfig, ...data.pickerProps.dateRange};
  } else {
    config = {...data.defaultConfig, ...data.pickerProps.default};
  }
  if (config.disabled || config.readonly) {
    config.placeholder = '';
  }
  return {...config, ...attrs};
});
// 在此处更新绑定值才能正常触发 fromItem 验证
const change = (val:string|Array<string|number|Date>|number|Date) => {
  $emit('update:modelValue', val);
}
// 对初始值显示格式兼容处理
watch(() => props.modelValue, (newVal:any) => {
  if (global.$common.isEmpty(newVal) || global.$common.isEmpty(selectConfig.value['value-format'])) {
    data.mValue = newVal;
    return;
  }
  if (global.$common.isArray(newVal)) {
    let newT:Array<string> = [];
    let matchTime:Array<boolean> = [];
    newVal.forEach((time:string | number | Date) => {
      const newD = global.$dayjs(time).format(selectConfig.value['value-format']);
      time === newD && matchTime.push(true);
      newT.push(newD);
    });
    if (matchTime.length === newT.length) return;
    data.mValue = newT;
    $emit('update:modelValue', newT);
    return;
  }
  let newT = global.$dayjs(newVal).format(selectConfig.value['value-format']);
  if (newVal === newT) return;
  data.mValue = newT;
  $emit('update:modelValue', newT);
}, {deep: true, immediate: true});

const focus = () => {
  proxy.$refs.dytDatePicker?.focus();
};
const blur = () => {
  proxy.$refs.dytDatePicker?.blur();
};
// 暴露给父级使用 ref 时使用
defineExpose({ focus, blur });
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
.dyt-date-picker-demo{
  &.el-range-editor{
    &.el-input__inner{
      padding: 0 10px;
    }
  }
}
</style>

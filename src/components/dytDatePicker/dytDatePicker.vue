<template>
  <el-date-picker
    ref="dytDatePicker"
    @change="change"
    v-bind="selectConfig"
    v-model="data.mValue"
    class="dyt-date-picker-demo"
    @visible-change="visibleChange"
  >
    <template v-for="slot in slots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>
  </el-date-picker>
</template>
<script lang="ts" setup>
import { computed, useSlots, useAttrs, reactive, watch, nextTick } from 'vue';
import getProxy from "@/utils/proxy";
import getGlobal from "@/utils/global";

interface dataType{
  mValue: string | Number | Date | Array<string | number | Date>;
  isInit: boolean;
  pickerProps: {
    default: {
      placeholder: string,
      shortcuts: Array<{text: string, value: string | Date}>
    },
    dateRange: any
  };
  defaultConfig: {[key:string]:any}
}

const proxy = getProxy();
const global = getGlobal();
const props = defineProps({
  modelValue: {type: [String, Number, Date, Array], defalt: ''},
  quick: { type: Boolean, defualt: true },
})
const attrs: any = useAttrs();
const slots: any = computed(() => Object.keys(useSlots()));
const $emit = defineEmits(['update:modelValue', 'change', 'input', 'visible-change']);

const dateAdd = (add:number = 0, type:any = 'day', oldDate:Date = new Date()) => {
  return new Date(global.$dayjs(oldDate).add(add, type).format('YYYY/MM/DD HH:mm:ss:SSS'));
};
const data:dataType = reactive({
  mValue: '',
  isInit: true,
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
    'popper-class': 'dyt-date-picker-popper',
    'unlink-panels': true
  }
});
const selectConfig = computed(() => {
  let config: {disabled?: boolean, readonly?:boolean, placeholder?: string} = {};
  let addConfig: {'popper-class'?: string, placeholder?: string} = {};
  if (props.quick || global.$common.isEmpty(attrs.quick)) {
    if (attrs.type && attrs.type.includes('range')) {
      config = {...data.defaultConfig, ...data.pickerProps.dateRange};
    } else {
      config = {...data.defaultConfig, ...data.pickerProps.default};
    }
  }
  if (!global.$common.isEmpty(attrs['popper-class'])) {
    addConfig['popper-class'] = `${data.defaultConfig['popper-class']} ${attrs['popper-class']}`;
  }
  if (config.disabled || config.readonly) {
    addConfig.placeholder = '';
  }
  return {...config, ...attrs, ...addConfig};
});
// 在此处更新绑定值才能正常触发 fromItem 验证
const change = (val:string|Array<string|number|Date>|number|Date) => {
  $emit('update:modelValue', val);
}
const visibleChange = (visibility:boolean) => {
  if (data.isInit) {
    data.isInit = false;
  }
  if (!visibility) {
    handleClose();
  }
  $emit('visible-change', visibility);
}
// 监听值变化
watch(() => data.mValue, (newVal:any) => {
  if (data.isInit) return;
  $emit('update:modelValue', newVal);
  nextTick(() => {
    $emit('change', newVal);
    $emit('input', newVal);
  })
})
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
  const newT = global.$dayjs(newVal).format(selectConfig.value['value-format']);
  if (data.mValue == newT) return;
  data.mValue = newT;
  // if (newVal === newT) return;
  $emit('update:modelValue', newT);
}, {deep: true, immediate: true});

const focus = () => {
  const handleFun = proxy?.$refs?.dytDatePicker?.focus;
  global.$common.isFunction(handleFun) && handleFun();
};
const blur = () => {
  const handleFun = proxy?.$refs?.dytDatePicker?.blur;
  global.$common.isFunction(handleFun) && handleFun();
};
const handleClose = () => {
  const handleFun = proxy?.$refs?.dytDatePicker?.handleClose;
  global.$common.isFunction(handleFun) && handleFun();
}
const handleOpen = () => {
  const handleFun = proxy?.$refs?.dytDatePicker?.handleOpen;
  global.$common.isFunction(handleFun) && handleFun();
}
// 暴露给父级使用 ref 时使用
defineExpose({ focus, blur, handleClose, handleOpen });
</script>

<style lang="less">
.dyt-date-picker-demo {
  &.el-range-editor{
    .el-range-input{
      padding: 0 5px;
    }
  }
}
</style>

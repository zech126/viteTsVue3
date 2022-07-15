<template>
  <el-select-v2
    v-if="isVirtual"
    @visible-change="visibleChange"
    v-bind="selectConfig"
    :options="data.options"
    class="dyt-select-demo"
  >
    <!-- 默认插槽 -->
    <template #default="{ item }">
      <div @click="saveSortData(item)">
        <slot :item="item">
          {{(typeof item.label !== 'undefined' ? item.label : item.value)}}
        </slot>
      </div>
    </template>
    <template v-for="slot in slots.filter((slotI:string) => !data.unIncludes.includes(slotI))" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>
  </el-select-v2>
  <el-select v-else :ref="data.pageId" @visible-change="visibleChange" v-bind="selectConfig" class="dyt-select-demo">
    <!-- 默认插槽 -->
    <slot>
      <template v-for="(item, index) in data.options">
        <el-option-group
          v-if="!global.$common.isEmpty(item[defaultProp.options])"
          :key="`group-${index}`"
          :label="(typeof item[defaultProp.label] !== 'undefined' ? item[defaultProp.label] : item[defaultProp.value] || '')"
          :disabled="(typeof item[defaultProp.disabled] === 'boolean' ? item[defaultProp.disabled] : false)"
        >
          <template v-for="(group, gIndex) in item[defaultProp.options]">
            <el-option
              v-if="(typeof group[defaultProp.value] !== 'undefined')"
              :key="`group-item-${gIndex}`"
              :label="(typeof group[defaultProp.label] !== 'undefined' ? group[defaultProp.label] : group[defaultProp.value])"
              :value="group[defaultProp.value]"
              :disabled="(typeof group[defaultProp.disabled] === 'boolean' ? group[defaultProp.disabled] : false)"
            />
          </template>
        </el-option-group>
        <el-option
          v-else-if="(typeof item[defaultProp.value] !== 'undefined')"
          :key="`option-${index}`"
          :label="(typeof item[defaultProp.label] !== 'undefined' ? item[defaultProp.label] : item[defaultProp.value])"
          :value="item[defaultProp.value]"
          :disabled="(typeof item[defaultProp.disabled] === 'boolean' ? item[defaultProp.disabled] : false)"
          @click="saveSortData(item)"
        >
          <slot name="option" :item="item">
            {{(typeof item[defaultProp.label] !== 'undefined' ? item[defaultProp.label] : item[defaultProp.value])}}
          </slot>
        </el-option>
      </template>
    </slot>
    <template v-for="slot in slots.filter((slotI:string) => !data.unIncludes.includes(slotI))" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>
  </el-select>
</template>
<script lang="ts" setup>
import {computed, useSlots, useAttrs, reactive, watch, PropType, ComputedRef} from 'vue';
import getProxy from "@/utils/proxy";
import getGlobal from '@/utils/global';
const global = getGlobal();
const proxy = getProxy();
const attrs = useAttrs();

const props = defineProps({
  // 默认下拉数据
  options: { type: Array as PropType<{[key:string]:string|number}[]>, default: () => {return []} },
  // 选项中和展示值道具
  defaultProp: { type: Object as PropType<{[key:string]:string}>,  default: () =>{return {}} },
  // 是否使用虚拟滚动
  virtual: { type: Boolean,  default: false },
  // 是否开启点击次数排序(需配合 sortKey 使用, 分组不支持排序)
  isSort: { type: Boolean,  default: false },
  // 击次数排序缓存 KEY (isSort 必须为 true 才生效, 分组不支持排序)
  sortKey: { type: String,  default: 'selectSortKey' },
  // 击次数排序最大个数 KEY (isSort 必须为 true 才生效, 分组不支持排序)
  sortLimit: { type: Number, default: 5 }
});
const data:{
  pageId: string,
  options: Array<{[key:string]:string|number}>,
  unIncludes:Array<string>,
  isGroup: boolean
} = reactive({
  pageId: Math.random().toString(36).substring(2),
  options: [],
  unIncludes: ['default', 'option'],
  isGroup: false
})

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

const selectOptionList:ComputedRef<Array<{[key:string]:string|number}>> = computed(() => {
  return optionsHand(props.options);
});

const selectConfig:{[key:string]:any} = computed(() => {
  let config = {
    placeholder: '请选择',
    size: 'default',
    clearable: true,
    filterable: true,
    disabled: false,
    readonly: false,
    multiple: false,
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
  proxy?.$refs[`${data.pageId}`]?.focus();
}

const blur = () => {
  proxy?.$refs[`${data.pageId}`]?.blur();
}

const optionsHand = (val:Array<any>) => {
  // 使用虚拟滚动时需额外处理数据
  if (isVirtual.value) {
    let newList = global.$common.copy(val);
    const handData = (arr:Array<any>, isDisabled: boolean = false) => {
      arr.forEach((item:any) => {
        if (!global.$common.isEmpty(defaultProp.value.value) && defaultProp.value.value !== 'value' && typeof item[defaultProp.value.value] !== 'undefined') {
          item['value'] = item[defaultProp.value.value];
          delete item[defaultProp.value.value];
        }
        if (!global.$common.isEmpty(defaultProp.value.label) && defaultProp.value.label !== 'label' && typeof item[defaultProp.value.label] !== 'undefined') {
          item['label'] = item[defaultProp.value.label];
          delete item[defaultProp.value.label];
        }
        if (!global.$common.isEmpty(defaultProp.value.disabled) && defaultProp.value.disabled !== 'disabled' && typeof item[defaultProp.value.disabled] !== 'undefined') {
          item['disabled'] = item[defaultProp.value.disabled];
          delete item[defaultProp.value.disabled];
        }
        if (!item['disabled'] && isDisabled) {
          item['disabled'] = isDisabled;
        }
        if (!global.$common.isEmpty(defaultProp.value.options) && !global.$common.isEmpty(item[defaultProp.value.options])) {
          data.isGroup = true;
          if (defaultProp.value.options !== 'options') {
            item['options'] = handData(item[defaultProp.value.options], item['disabled']);
            delete item[defaultProp.value.options];
          }
        }
      });
      return arr;
    }
    handData(newList);
    return newList;
  }
  return val;
}

// 排序存储
const saveSortData = (option:any) => {
  if (!props.isSort || option[defaultProp.value.disabled] || global.$common.isEmpty(props.sortKey) || data.isGroup) return;
  if (selectConfig.value.modelValue === option[defaultProp.value.value] || selectConfig.value.readonly) return;
  if (selectConfig.value.multiple && selectConfig.value.modelValue.includes(option[defaultProp.value.value])) return;
  let newItem:any = global.$common.copy(option);
  let fliterIndex = -1;
  global.localforage.getItem(props.sortKey).then((res:any) => {
    let saveList:Array<any> = global.$common.isArray(res) ? res : [];
    try {
      saveList.forEach((item, index) => {
        if (item[defaultProp.value.value] == newItem[defaultProp.value.value] && item[defaultProp.value.label] == newItem[defaultProp.value.label]) {
          fliterIndex = index;
          // 当满足第一个条件时退出循环
          throw new Error('existForEach');
        }
      })
    } catch (e:any) {
      e.message !== 'existForEach' && console.error(e);
    }
    let fliterItem:any = fliterIndex > -1 ? saveList.splice(fliterIndex, 1)[0] : {};
    const optionKey = `optionSort${props.sortKey}`;
    newItem[optionKey] = (global.$common.isEmpty(fliterItem) || global.$common.isEmpty(fliterItem[optionKey])) ? 1 : fliterItem[optionKey] + 1;
    saveList.push(newItem);
    // 进行排序
    saveList.sort((a:any, b:any) => b[optionKey] - a[optionKey]);
    // 保存到缓存中
    saveList = global.$common.copy(saveList);
    global.localforage.setItem(props.sortKey, saveList).then(() => {
      !selectConfig.value.multiple && getSortList(data.options).then((res:any) => {
        data.options = res;
      })
    })
  })
}
// 获取排序数据
const getSortList = (list:Array<any> = [], sortArr:Array<any> = []) => {
  return new Promise((resolve) => {
    if (!props.isSort || global.$common.isEmpty(props.sortKey) || data.isGroup) {
      return resolve(list);
    }
    let listJson = {};
    list.forEach(item => {
      listJson[`${item[defaultProp.value.label]}-${item[defaultProp.value.value]}`] = item;
    });
    const listVal = Object.keys(listJson);
    global.localforage.getItem(props.sortKey).then((res:any) => {
      let sortVal:Array<string> = [];
      let sortList:Array<any> = [];
      try {
        (res || []).forEach((item:any) => {
          if (listVal.includes(`${item[defaultProp.value.label]}-${item[defaultProp.value.value]}`)) {
            sortList.push(listJson[`${item[defaultProp.value.label]}-${item[defaultProp.value.value]}`]);
            sortVal.push(`${item[defaultProp.value.label]}-${item[defaultProp.value.value]}`);
            // 当满足条件后退出循环
            if (props.sortLimit == sortVal.length) {
              throw new Error('existForEach');
            }
          }
        })
      } catch (e:any) {
        e.message !== 'existForEach' && console.error(e);
      }
      const remainingList = list.filter(item => !sortVal.includes(`${item[defaultProp.value.label]}-${item[defaultProp.value.value]}`));
      resolve([...sortList, ...remainingList]);
    }).catch((e:any) => {
      resolve(list);
      console.error(e);
    })
  })
}

// 隐藏(显示)触发
const visibleChange = (visible:boolean) => {
  // 更新下拉
  !visible  && selectConfig.value.multiple && getSortList(data.options).then((res:any) => {
    data.options = res;
  });
}
// 下拉数据
watch(() => selectOptionList, (val) => {
  getSortList(val.value).then((res:any) => {
    data.options = res;
  });
}, {deep: true, immediate: true});

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

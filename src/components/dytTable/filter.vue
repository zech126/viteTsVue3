<template>
  <div class="dyt-filter-container" :id="`filter-${pageId}`">
    <!-- 搜索栏顶部 -->
    <div v-if="slots.includes('filterTop')" class="filter-top-content">
      <slot name="filterTop" />
    </div>
    <!-- 搜索默认内容 -->
    <div v-if="fConfig.showFilter" class="dyt-form-inner" :class="{'expand-form-inner': data.isExpand}">
      <div class="dyt-form-search">
        <!-- 右边搜索按钮 -->
        <div :style="`display: flex; padding-left: 10px; transform:translateX(-${data.btnOffsetRight}px);`">
          <slot name="filterRight">
            <slot v-if="fConfig.showSearch" name="searchButton">
              <el-button type="primary" @click="filterSearch" icon="search">
                搜索
              </el-button>
            </slot>
            <slot v-if="fConfig.showReset" name="searchReset">
              <el-button @click="resetHand">
                重置
              </el-button>
            </slot>
          </slot>
        </div>
        <div v-if="data.showMore" style="margin-left: 10px;">
          <slot name="searchMore" :isExpand="data.isExpand">
            <el-button
              size="small"
              type="primary"
              style="height: 30px; padding: 0px 6px;"
              :title="`${data.isExpand ? '展开' : '收起'}`"
              @click="expandHand"
            >
              <Icon :name="`caret-${data.isExpand ? 'top' : 'bottom'}`" style="font-size: 25px;" />
            </el-button>
          </slot>
        </div>
      </div>
      <div :id="`filterForm-${pageId}`" class="dyt-form-container">
        <slot name="filter">
          <el-form ref="filterForm" :inline="true" :model="data.formData" :rules="(fConfig.validRules || {})" class="dyt-filter-form"  @submit.prevent>
            <template v-for="(item, index) in data.filterItems" :key="`item-${index}`">
              <el-form-item :prop="item.model" class="dyt-filter-item" @keyup.enter="keyupEnter">
                <div v-if="!$common.isEmpty(data.formData[item.model])" class="filter-item-label">
                  {{ item.label || '' }}
                </div>
                <dyt-node v-if="(typeof item.render === 'function' && !item.slot)" :node="item.render" />
                <!-- 注册组件 -->
                <template v-else-if="(typeof item.render !== 'function' && !item.slot)">
                  <!-- 输入框 -->
                  <dyt-input
                    v-if="$common.isEmpty(item.type) || ['input', 'text', 'elinput', 'dytinput'].includes(item.type.toLowerCase().replace(/-/g, ''))"
                    v-model="data.formData[item.model]"
                    v-bind="{
                      ...(item.componentProps||{}),
                      placeholder: item.placeholder || `${item.label}`,
                      style: componentStyle(item.style)
                    }"
                    v-on="(item.events||{})"
                  />
                  <!-- 下拉选择 -->
                  <dyt-select
                    v-else-if="['select', 'elselect', 'dytselect'].includes(item.type.toLowerCase().replace(/-/g, ''))"
                    v-model="data.formData[item.model]"
                    v-bind="{
                      'collapse-tags': true,
                      ...(item.componentProps||{}),
                      placeholder: item.placeholder || `${item.label}`,
                      style: componentStyle(item.style)
                    }"
                    :options="data.filterAsync[`${item.model}-options`].value"
                    :loading="data.filterAsync[`${item.model}-options`].loading"
                    v-on="(item.events||{})"
                  />
                  <!-- 日期组件 -->
                  <dyt-date-picker
                    v-else-if="['date', 'eldatepicker', 'dytdatepicker'].includes(item.type.toLowerCase().replace(/-/g, ''))"
                    v-model="data.formData[item.model]"
                    v-bind="{
                      ...(item.componentProps||{}),
                      placeholder: item.placeholder || `${item.label}`,
                      style: componentStyle(item.style)
                    }"
                    v-on="(item.events||{})"
                  />
                  <!-- 标签输入 -->
                  <dyt-input-tag
                    v-else-if="['tag', 'textarea', 'inputtag', 'dytinputtag'].includes(item.type.toLowerCase().replace(/-/g, ''))"
                    v-model="data.formData[item.model]"
                    v-bind="{
                      string: true,
                      limit: 1,
                      type: 'textarea',
                      ...(item.componentProps||{}),
                      placeholder: item.placeholder || `${item.label}`,
                      style: componentStyle(item.style)
                    }"
                    v-on="(item.events||{})"
                  />
                  <!-- 下拉树 -->
                  <dyt-tree-select
                    v-else-if="['tree', 'treeselect', 'dyttreeselect'].includes(item.type.toLowerCase().replace(/-/g, ''))"
                    v-model="data.formData[item.model]"
                    v-bind="{
                      ...(item.componentProps||{}),
                      placeholder: item.placeholder || `${item.label}`,
                      style: componentStyle(item.style)
                    }"
                    v-on="(item.events||{})"
                  />
                </template>
                <slot v-else :name="item.model" />
              </el-form-item>
            </template>
          </el-form>
        </slot>
      </div>
    </div>
    <!-- 搜索栏底部 -->
    <div v-if="slots.includes('filterBottom')" class="filter-bottom-content">
      <slot name="filterBottom" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import getGlobal from '@/utils/global';
import getProxy from '@/utils/proxy';
import {reactive, computed, useSlots, watch, nextTick, onMounted, onBeforeUnmount, onBeforeMount, PropType} from 'vue';

interface dataType{
  showMore: Boolean;
  isExpand: Boolean;
  config: {
    // 显示搜索栏, 默认值 true
    showFilter: Boolean;
    // 显示搜索按钮, 默认值 true
    showSearch: Boolean;
    // 显示重置按钮, 默认值 true
    showReset: Boolean;
    validRules: Array<any>;
  },
  btnOffsetRight: Number;
  formData: any;
  oldFormData: any;
  temporaryForm: any;
  filterAsync: any;
  filterItems: any
}

const global = getGlobal();
const proxy = getProxy();
const $slots = useSlots();
const props = defineProps({
  //搜索栏
  filterFields: { type: Array as PropType<Array<{[key:string]:any}>>, default: () => [] },
  pageId: { type: String, default: Math.random().toString(36).substring(2) },
  tableLoading: { type: Boolean, default: false },
  filterConfig: {
    type: Object as PropType<{
      showFilter?: boolean,
      showSearch?: boolean,
      showReset?: boolean,
      validRules?: {[key:string]:Array<{[key:string]:any}>}
    }>,
    default: () => {return {}}
  },
  filterModel: { type: Object as PropType<{[key:string]:any}>, default: () => {return {}} },
  filterMessage: { type: String, default: '请在检索栏必填项输入检索条件！' }
});

const $emit = defineEmits(['performSearch', 'resetFilter', 'filterExpand', 'searchFail']);

const data:dataType = reactive({
  showMore: true,
  isExpand: false,
  config: {
    // 显示搜索栏, 默认值 true
    showFilter: true,
    // 显示搜索按钮, 默认值 true
    showSearch: true,
    // 显示重置按钮, 默认值 true
    showReset: true,
    validRules: []
  },
  btnOffsetRight: 0,
  formData: {},
  oldFormData: {},
  temporaryForm: {},
  filterAsync: {},
  filterItems: []
});

const slots = computed(() => {
  return Object.keys($slots)
});

const fConfig = computed(() => {
  return {...data.config, ...props.filterConfig}
});

// 刷新布局
const filterLayout = () => {
  const filterForm = document.querySelector(`#filterForm-${props.pageId}`);
  if (!filterForm) return;
  data.showMore = Number(global.$common.getElementStyle(filterForm, 'height', true)) > 90;
  // 处理按钮位置
  const handWidth = () => {
    nextTick(() => {
      const cont = document.querySelector(`#filter-${props.pageId}`);
      if (!cont) return;
      const allItem = Array.prototype.slice.call(filterForm.querySelectorAll('.dyt-filter-item'), 0);
      const lastItem = allItem.filter(item => item.offsetTop === 0).slice(-1)[0]
      if (lastItem) {
        const contWidth = Number(global.$common.getElementStyle(filterForm, 'width', true));
        const btnWidth = cont.querySelector('.dyt-form-search');
        const itemLeft = lastItem.offsetLeft + global.$common.getElementStyle(lastItem, 'width', true) + 10;
        data.btnOffsetRight = contWidth - itemLeft - Number(global.$common.getElementStyle(btnWidth, 'width', true));
      }
    })
  }
  handWidth();
}
// 搜索
const filterSearch = (e:Event, type:boolean = true) => {
  if (props.tableLoading) return;
  if (!global.$common.isEmpty(fConfig.value.validRules) && proxy.$refs.filterForm) {
    proxy.$refs.filterForm.validate((valid:boolean) => {
      if (!valid) {
        global.$message ({ message: props.filterMessage || '请在检索栏必填项输入检索条件！', type: 'warning'});
        $emit('performSearch', type, {valid: valid});
        return;
      }
      $emit('performSearch', type, {valid: valid});
    })
  } else {
    $emit('performSearch', type, {valid: true});
  }
}
// 获取数据
const getFormData = () => {
  return { ...props.filterModel, ...data.formData };
}
// 重置(无法重置插槽渲染的组件值)
const resetHand = () => {
  let resetVal = {};
  const slotKey = props.filterFields.filter((item:any) => {
    return item.model && !item.slot;
  }).map((slot:any) => slot.model);
  // 将被改变的赋值当前表单，用于验证表单使用
  slotKey.forEach(key => {
    resetVal[key] = data.oldFormData[key];
  });
  data.formData = {...data.formData, ...resetVal};
  nextTick(() => {
    $emit('resetFilter');
    setTimeout(() => {
      proxy.$refs.filterForm && proxy.$refs.filterForm.clearValidate();
    }, 200)
  })
}
// 展开收起
const expandHand = () => {
  data.isExpand = !data.isExpand;
  $emit('filterExpand', data.isExpand);
}
// 处理参数中的异步
const filterFunHand = (filterItem:any, key:string, type:string) => {
  const typeVal = { array: [], string: '', object: {}, number: null };
  data.filterAsync[key] = {value: typeVal[type], loading: true};
  if (typeof filterItem === 'function') {
    const newItem = filterItem();
    if (global.$common.isPromise(newItem)) {
      newItem.then((res:any) => {
        data.filterAsync[key] = {value: res, loading: false};
      }).catch(() => {
        data.filterAsync[key] = {value: typeVal[type], loading: false};
      });
    } else {
      data.filterAsync[key] = {value: newItem, loading: false};
    }
  } else {
    data.filterAsync[key] = {value: filterItem, loading: false};
  }
}
// 回车事件（使用 插槽、render 方法的不支持）
const keyupEnter = (e:Event) => {
  filterSearch(e, true);
}
// 对象形式的样式转换成字符串
const componentStyle = (style:[string | object ], set:string = '') => {
  let newStyle = '';
  if (!global.$common.isEmpty(set)) {
    newStyle = `${set}`;
  }
  if (global.$common.isEmpty(style)) return newStyle;
  if (typeof style === 'string') return `${newStyle}${style}`;
  Object.keys(style).forEach(key => {
    if (typeof style[key] === 'number' || typeof style[key] === 'string') {
      newStyle += `${key}:${typeof style[key] === 'number' ? `${style[key]}px` : style[key]};`;
    }
  })
  return newStyle;
}
//
onBeforeMount(() => {
  let formData = {};
  Object.keys(props.filterModel).forEach(key => {
    formData[key] = props.filterModel[key];
  });
  data.formData = {...data.formData, ...formData};
  data.oldFormData = global.$common.copy(data.formData);
  data.temporaryForm = global.$common.copy(data.formData);
});

onMounted(() => {
  // 绑定事件
  window.addEventListener('resize', filterLayout);
  filterLayout();
  nextTick(() => {
    filterLayout(); // 多执行一次，修正由于样式引起的宽度度不准确
  })
});
// 组件销毁前
onBeforeUnmount(() => {
  // 解除绑定
  window.removeEventListener('resize', filterLayout);
});

watch(() => props.filterFields, (val:any) => {
  const handKey = [
    { key: 'options', additional: 'options', type: 'array'}
  ];
  (val||[]).forEach((item:any) => {
    const keys = Object.keys(item);
    handKey.forEach(key => {
      // 设置为插槽类型的不处理
      if (keys.includes(key.key) && !item[key.key].slot && !item[key.key].render) {
        filterFunHand(item[key.key], `${item.model}-options`, key.type);
      }
    })
  });
  data.filterItems = global.$common.copy(val);
}, {deep: true, immediate: true});

watch(() => props.filterModel, (val:any) => {
  const slotKey = props.filterFields.filter((item:any) => {
    return item.model && (item.slot || typeof item.render === 'function');
  }).map((slot:any) => slot.model);
  // 将被改变的赋值当前表单，用于验证表单使用
  slotKey.forEach(key => {
    data.formData[key] !== val[key] && (data.formData[key] = val[key]);
  })
}, {deep: true, immediate: true});

// watch(() => data.formData, (val:any) => {
//   nextTick(() => {
//     Object.keys(val).forEach(key => {
//       proxy.$refs.filterForm?.validateField([key], (errorMessage:any) => {});
//     })
//   })
// }, {deep: true});

// 导出方法
defineExpose({
  getFormData,
  filterSearch,
  resetHand
})
</script>

<style lang="less" scoped>
.dyt-filter-container{
  position: relative;
  margin-bottom: 10px;
  .filter-bottom-content,
  .filter-top-content{
    margin-bottom: 10px;
  }
  .dyt-form-inner{
    box-sizing: content-box;
    height: 45px;
    padding-top: 9px;
    margin-bottom: 10px;
    overflow: hidden;
    &.expand-form-inner{
      height: auto;
      margin-bottom: 0;
    }
  }
  .dyt-form-container{
    position: relative;
    z-index: 2;
  }
  .dyt-filter-form{
    position: relative;
    :deep(.el-form-item){
      margin-bottom: 21px;
      margin-right: 15px;
      .dyt-input-demo {
        width: 214px;
      }
      .el-form-item__error{
        padding-top: 1px;
      }
    }
    .filter-item-label {
      position: absolute;
      top: -3px;
      left: 10px;
      z-index: 10;
      padding: 0 0.2em;
      font-size: 12px;
      line-height: 12px;
      color: #999;
      white-space: nowrap;
      cursor: default;
      background-color: #fff;
      opacity: 1;
      transform: translateY(-50%) scale(.9);
      transform-origin: center bottom;
    }
  }
  .dyt-form-search{
    display: flex;
    position: relative;
    float: right;
    z-index: 3;
  }
}
</style>

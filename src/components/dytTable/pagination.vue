<template>
  <div :id="`pagination-${props.pageId}`" class="dyt-pagination-container">
    <div v-if="slots.includes('paginationTop')" class="pagination-top-content">
      <slot name="paginationTop" />
    </div>
    <div v-if="showPagination" class="pagination-main" :style="`text-align: ${data.align.includes(paginationAlign) ? paginationAlign :'right'};`">
      <slot name="pagination">
        <el-pagination
          v-bind="data.paginationConfig"
          :total="props.total"
          v-model:currentPage="data.pageNum"
          v-model:page-size="data.pageSize"
          @size-change="sizeChange"
          @current-change="currentChange"
        />
      </slot>
    </div>
    <div v-if="slots.includes('paginationBottom')" class="pagination-bottom-content">
      <slot name="paginationBottom" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive, useSlots, computed, watch, nextTick, PropType } from 'vue';
import getGlobal from "@/utils/global";

interface dataType {
  align: Array<any>;
  pageSize: number;
  pageNum: number;
  paginationConfig: {
    layout: string;
    'pager-count': number;
    background: boolean;
    small: boolean;
  },
  oldPageSize: number;
  oldPageNum: number;
}
const $slots = useSlots();
const global = getGlobal();

const props = defineProps({
  pageConfig: { type: Object as PropType<{
    pageSize?: number,
    pageNum?: number
  }>, default: () => {return {}} },
  total: {type: Number, default: 0},
  pageId: {type: String, default: ''},
  tableLoading: { type: Boolean, default: false },
  showPagination: { type: Boolean, default: true },
  paginationAlign: { type: String, default: 'right' },
  paginationInfo: { type: Object as PropType<{[key:string]:any}>, default: () => {return {}} }
});

const data:dataType = reactive({
  align: ['top', 'right', 'bottom', 'let', 'center', 'end', 'inherit', 'initial', 'justify', 'unset', 'start', 'revert'],
  pageSize: 20,
  pageNum: 1,
  paginationConfig: {
    layout: 'total, sizes, prev, pager, next, jumper',
    'pager-count': 5,
    background: true,
    small: false
  },
  oldPageSize: 20,
  oldPageNum: 1,
});

const slots = computed(() => {
  return Object.keys($slots)
});

const $emit = defineEmits(['update:pageConfig', 'change'])

watch(() => props.paginationInfo, (val) => {
  data.pageSize = val['page-size'];
  data.paginationConfig = {...data.paginationConfig, ...global.$common.copy(val)};
  delete data.paginationConfig['page-size'];
}, {immediate: true, deep: true});

watch(() => props.pageConfig, (val) => {
  data.pageSize = val.pageSize || 20;
  data.pageNum = val.pageNum || 1;
  data.oldPageNum = data.pageNum;
  data.oldPageSize = data.pageSize;
}, {immediate: true, deep: true});

const sizeChange = (val:number) => {
  if (props.tableLoading) {
    nextTick(() => {
      data.pageSize = data.oldPageSize;
    })
    return;
  }
  if (data.pageNum > Math.ceil(props.total / val)) {
    data.pageNum = Math.ceil(props.total / val) || 1;
    data.oldPageNum = data.pageNum;
  }
  data.pageSize = val;
  data.oldPageSize = val;
  $emit('update:pageConfig', {pageNum: data.pageNum, pageSize: val});
  $emit('change', data.pageNum, data.pageSize);
}

const currentChange = (val:number) => {
  if (props.tableLoading) {
    nextTick(() => {
      data.pageNum = data.oldPageNum;
    })
    return;
  }
  data.pageNum = val;
  data.oldPageNum = data.pageNum;
  $emit('update:pageConfig', {pageNum: val, pageSize: data.pageSize});
  $emit('change', data.pageNum, data.pageSize);
}
</script>
<style lang="less" scoped>
.dyt-pagination-container{
  position: relative;
  padding-top: 10px;
  .pagination-top-content,
  .pagination-bottom-content{
    margin-bottom: 10px;
  }
  .pagination-bottom-content{
    margin-top: 10px;
  }
}
</style>

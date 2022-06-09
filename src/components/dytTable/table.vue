<template>
  <div :id="`table_${props.pageId}`" class="dyt-table-container">
    <!-- 表格头部 -->
    <div v-if="slots.includes('tableTop')" class="table-top-container">
      <slot name="tableTop" />
    </div>
    <!-- 主体 -->
    <div class="mian-container">
      <!-- 表格左边 -->
      <div v-if="slots.includes('tableLeft')" class="mian-container-left">
        <slot name="tableLeft" />
      </div>
      <!-- 表格 -->
      <div v-if="props.tableConfig.showTable" class="mian-container-table">
        <el-table
          :ref="`table_${props.pageId}`"
          v-bind="data.tableAttr"
          v-on="tableListeners"
          :data="props.tableData"
          :height="$common.isEmpty(props.tableHeight) ? null : props.tableHeight"
          :max-height="(data.tableAttr['max-height'] || data.tableAttr['maxHeight'] || null)"
          style="width: 100%;"
        >
          <el-table-column
            v-if="typeof props.tableConfig.multiple === 'boolean' && props.tableConfig.multiple"
            align="center"
            type="selection"
            width="50"
            :selectable="selectable"
          />
          <el-table-column
            v-if="typeof props.tableConfig.indexMethod === 'function'"
            align="center"
            type="index"
            width="50"
            :index="props.tableConfig.indexMethod"
          />
          <el-table-column
            v-if="typeof props.tableConfig.indexMethod === 'boolean' && props.tableConfig.indexMethod"
            align="center"
            type="index"
            width="50"
          />
          <slot name="tableColumn">
            <template v-for="(item, index) in data.columnConfig">
              <!-- 自定义插槽列 -->
              <slot v-if="item.slot" :name="item.slot" :column-config="item" />
              <el-table-column v-else :key="`col-${index}`"
                v-bind="{
                  'show-overflow-tooltip': true,
                  ...item,
                  'min-width': item['min-width'] || item.minWidth,
                  align: (data.columnAlign.includes(item.align) ? item.align : 'center')
                }"
              >
                <template v-slot="scope">
                  <dyt-node
                    v-if="typeof data.cloumnsRender[`render-${index}`] === 'function'"
                    :node="data.cloumnsRender[`render-${index}`]"
                    :node-parameter="scope"
                  />
                  <div v-else class="table-ellipsis-tips"
                    v-on="data.cloumnsEvents[`events-${index}`] ? {
                      click: (e:any) => {
                        data.cloumnsEvents[`events-${index}`].click && data.cloumnsEvents[`events-${index}`].click(scope, e);
                      }
                    }: {}"
                  >
                    {{ scope.row[item.prop] }}
                  </div>
                </template>
                <!-- 自定义表头的内容. 参数为 { column, $index } -->
                <template v-slot:header="scope">
                  <slot :name="`${item.prop}-header`" v-bind="scope">
                    {{ scope.column.label }}
                  </slot>
                </template>
              </el-table-column>
            </template>
          </slot>
          <!-- 插入至表格最后一行之后的内容，如果需要对表格的内容进行无限滚动操作，可能需要用到这个 slot。若表格有合计行，该 slot 会位于合计行之上 -->
          <template v-slot:append>
            <slot name="append" />
          </template>
        </el-table>
      </div>
      <!-- 表格右边 -->
      <div v-if="slots.includes('tableRight')" class="mian-container-right">
        <slot name="tableRight" />
      </div>
    </div>
    <!-- 表格底部 -->
    <div v-if="slots.includes('tableBottom')" class="table-bottom-slot">
      <slot name="tableBottom" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import getGlobal from '@/utils/global';
import getProxy from '@/utils/proxy';
import { reactive, computed, useSlots, useAttrs, watch, PropType } from 'vue';

interface dataType{
  columnAlign: Array<any>;
  columnConfig: Array<any>;
  cloumnsRender: any;
  cloumnsEvents: any;
  tableAttr: {
    height?: any;
    'highlight-current-row': boolean;
    // 'row-key': (row) => {
    //   return row.userId
    // },
    stripe: boolean;
    size: string;
    border: boolean;
  }
}

const $slots = useSlots();
const $attrs = useAttrs();
const global = getGlobal();
const proxy:any = getProxy();
const props = defineProps({
  // 表格其他设置
  tableConfig: { type: Object as PropType<{
    autoload?: boolean,
    multiple?: boolean,
    showTable?: boolean,
    [key:string]: any
  }>,  default: () => {return {}} },
  tableData: { type: Array as PropType<{[key:string]: any}[]>, default: () => {return []} },
  tableHeight: {type: [String, Number], default: null},
  pageId: {type: String, default: ''},
  // 表格配置 对应 elementUI 的 table Attributes
  tableProps: { type: Object as PropType<{[key:string]: any}>, default: () => {return {}} },
  tableColumns:  { type: Array as PropType<{[key:string]: any}[]>, default: () => [] },
  // 请求中
  tableLoading: { type: Boolean, default: false },
});

const data:dataType = reactive({
  columnAlign: ['left', 'center', 'right'],
  columnConfig: [],
  cloumnsRender: {},
  cloumnsEvents: {},
  tableAttr: {
    height: '',
    'highlight-current-row': true,
    // 'row-key': (row) => {
    //   return row.userId
    // },
    stripe: true,
    size: 'small',
    border: true
  }
});
// 插槽
const slots = computed(() => {
  return Object.keys($slots)
});
// 绑定到列表的事件
const tableListeners = computed(() => {
  const attrs = Object.keys($attrs);
  let tableFun = {};
  attrs.forEach(funKeys => {
    if (!global.$common.isEmpty(funKeys) && funKeys.substring(0,2) === 'on') {
      const newKey = `${funKeys.substring(2, 1).toLocaleLowerCase()}${funKeys.substring(3, funKeys.length)}`;
      tableFun[newKey] = $attrs[funKeys];
    }
  })
  return tableFun;
});

const initColumns = (arr:Array<any>) => {
  let columns:Array<any> = [];
  data.cloumnsRender = {};
  data.cloumnsEvents = {};
  arr.forEach((item, index) => {
    if (typeof item.render === 'function') {
      data.cloumnsRender[`render-${index}`] = item.render;
      delete item.render;
    }
    if (!global.$common.isEmpty(item.events)) {
      data.cloumnsEvents[`events-${index}`] = item.events;
      delete item.events;
    }
    columns.push(item);
  })
  data.columnConfig = columns;
}
// 用于多选表格，清空用户的选择
const clearSelection = () => {
  proxy.$refs[`table_${props.pageId}`]?.clearSelection();
}
// 用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）
const toggleRowSelection = (row:any, selected:any) => {
  proxy.$refs[`table_${props.pageId}`]?.toggleRowSelection(row, selected);
}
// 用于多选表格，切换所有行的选中状态
const toggleAllSelection = () =>{
  proxy.$refs[`table_${props.pageId}`]?.toggleAllSelection();
}
// 用于可展开表格与树形表格，切换某一行的展开状态，如果使用了第二个参数，则是设置这一行展开与否（expanded 为 true 则展开）
const toggleRowExpansion = (row:any, expanded:any) => {
  proxy.$refs[`table_${props.pageId}`]?.toggleRowExpansion(row, expanded);
}
// 用于单选表格，设定某一行为选中行，如果调用时不加参数，则会取消目前高亮行的选中状态。
const setCurrentRow = (row:any) => {
  proxy.$refs[`table_${props.pageId}`]?.setCurrentRow(row);
}
// 用于清空排序条件，数据会恢复成未排序的状态
const clearSort = () => {
  proxy.$refs[`table_${props.pageId}`]?.clearSort();
}
// 不传入参数时用于清空所有过滤条件，数据会恢复成未过滤的状态，也可传入由columnKey组成的数组以清除指定列的过滤条件
const clearFilter = (columnKey:any) => {
  proxy.$refs[`table_${props.pageId}`]?.clearFilter(columnKey);
}
// 对 Table 进行重新布局。当 Table 或其祖先元素由隐藏切换为显示时，可能需要调用此方法
const doLayout = () => {
  proxy.$refs[`table_${props.pageId}`]?.doLayout();
}
// 手动对 Table 进行排序。参数prop属性指定排序列，order指定排序顺序。
const sort = (prop:any, order:any) => {
  proxy.$refs[`table_${props.pageId}`]?.sort(prop, order);
}
const selectable = (row:any, index:any) => {
  return props.tableConfig.selectable ? props.tableConfig.selectable(row, index) : true;
}

watch(() => props.tableProps, (val:any) => {
  data.tableAttr = {...data.tableAttr, ...val}
  delete data.tableAttr.height;
}, {deep: true, immediate: true});

watch(() => props.tableColumns, (val:any) => {
  initColumns(global.$common.copy(val));
}, {deep: true, immediate: true});

defineExpose({
  clearSelection,
  toggleRowSelection,
  toggleAllSelection,
  toggleRowExpansion,
  setCurrentRow,
  clearSort,
  clearFilter,
  doLayout,
  sort
});

</script>
<style lang="less">
.dyt-table-container{
  position: relative;
  .mian-container{
    width: 100%;
    display: flex;
    .mian-container-table{
      flex: 100;
      min-width: 40%;
    }
  }
  .table-top-container{
    margin-bottom: 10px;
  }
  .table-bottom-slot{
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .mian-container-left,
  .mian-container-right{
    margin: 0 10px;
  }
  .table-ellipsis-tips{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .el-table{
    .cell{
      line-height: 30px;
    }
  }
}
</style>

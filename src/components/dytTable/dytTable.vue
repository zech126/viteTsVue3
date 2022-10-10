<template>
  <div
    class="dyt-table-view"
    :id="`dytTableView-${base.pageId}`"
    v-loading="!base.initLoading"
    element-loading-text="列表模块初始化"
    :class="{
      'first-loading': base.firstLoading,
      'table-loading': base.tableLoading,
      'dyt-table-empty': base.pageTableData.rows && base.pageTableData.rows.length === 0
    }"
  >
    <template v-if="base.initLoading">
      <!-- 头部 -->
      <div v-if="slots.includes('head')" class="table-view-head" :id="`view-${base.pageId}`">
        <slot name="head" />
      </div>
      <!-- 搜索栏 -->
      <filter-bar
        :ref="`filterBar-${base.pageId}`"
        :page-id="base.pageId"
        :table-loading="base.tableLoading"
        :filter-config="props.filterConfig"
        :filter-fields="filterFieldConfig"
        :filter-model="props.filterModel"
        @performSearch="search"
        @filterExpand="filterExpand"
        @resetFilter="resetFilter"
      >
        <!-- 搜索栏上面 -->
        <template v-if="slots.includes('filterTop')" v-slot:filterTop>
          <slot name="filterTop" />
        </template>
        <!-- 搜索栏上面 -->
        <template v-if="slots.includes('filterRight')" v-slot:filterRight>
          <slot name="filterRight" />
        </template>
        <!-- 搜索栏 -->
        <template v-if="slots.includes('filter')" v-slot:filter>
          <slot name="filter" />
        </template>
        <!-- 自定义插槽位置 -->
        <template v-for="(fItem, index) in filterFieldConfig.filter((item:any) => item.slot)" v-slot:[fItem.model] :key="index">
          <slot :name="`filter-${fItem.model}`" />
        </template>
        <!-- 搜索按钮 -->
        <template v-slot:searchButton>
          <slot name="searchButton" />
        </template>
        <!-- 重置按钮 -->
        <template v-slot:searchReset>
          <slot name="searchReset" />
        </template>
        <!-- 收起/展开按钮 -->
        <template v-if="slots.includes('searchMore')" v-slot:searchMore="scope">
          <slot name="searchMore" v-bind="scope" />
        </template>
        <!-- 搜索栏下面 -->
        <template v-if="slots.includes('filterBottom')" v-slot:filterBottom>
          <slot name="filterBottom" />
        </template>
      </filter-bar>
      <!-- 表格 -->
      <table-view
        v-if="!slots.includes('customTable')"
        :ref="`table_${base.pageId}`"
        v-loading="base.tableLoading"
        :page-id="base.pageId"
        :table-columns="tableColumnConfig"
        :table-data="base.pageTableData.rows"
        :table-height="base.tableHeight"
        :table-props="props.tableProps"
        :table-config="tableConfig"
        @tableRowSortStart="tableRowSortStart"
        @tableRowSortEnd="tableRowSortEnd"
        @tableColSortStart="tableColSortStart"
        @tableColSortEnd="tableColSortEnd"
        v-on="tableListeners"
      >
        <!-- 默认插槽 -->
        <template v-if="slots.includes('tableColumn')" v-slot:tableColumn>
          <slot />
        </template>
        <!-- 自定义插槽列 -->
        <template v-for="(item) in (tableColumnConfig.filter((col:any) => col.slot))" v-slot:[item.slot]="scope">
          <slot :name="item.slot" v-bind="scope"/>
        </template>
        <!-- 自定义表头的内容. 参数为 { column, $index } -->
        <template v-for="(item) in tableHeaderSlots" v-slot:[item]="scope">
          <slot :name="item" v-bind="scope" />
        </template>
        <!-- 自定义表格内容. 参数为 { column, $index } -->
        <template v-for="(item) in tableContentSlots" v-slot:[item]="scope">
          <slot :name="item" v-bind="scope" />
        </template>
        <!-- 插入至表格最后一行之后的内容，如果需要对表格的内容进行无限滚动操作，可能需要用到这个 slot。若表格有合计行，该 slot 会位于合计行之上 -->
        <template v-if="slots.includes('append')" v-slot:append>
          <slot name="append" />
        </template>
        <!-- 表格顶部 -->
        <template v-if="slots.includes('tableTop')" v-slot:tableTop>
          <slot name="tableTop" />
        </template>
        <!-- 表格右侧 -->
        <template v-if="slots.includes('tableRight')" v-slot:tableRight>
          <slot name="tableRight" />
        </template>
        <!-- 表格底部(表格和翻页之间) -->
        <template v-if="slots.includes('tableBottom')" v-slot:tableBottom>
          <slot name="tableBottom" />
        </template>
        <!-- 表格左侧 -->
        <template v-if="slots.includes('tableLeft')" v-slot:tableLeft>
          <slot name="tableLeft" />
        </template>
      </table-view>
      <!-- 自定义表格时 -->
      <div v-if="slots.includes('customTable')" v-loading="base.tableLoading" class="dyt-table-container">
        <slot name="customTable" />
      </div>
      <!-- 翻页功能 -->
      <pagination
        v-model:page-config="base.pageConfig"
        :total="base.paginationTotal"
        :page-id="base.pageId"
        :show-pagination="base.showPagination"
        :table-loading="base.tableLoading"
        @change="paginationChange"
      >
        <!-- 翻页上面 -->
        <template v-if="slots.includes('paginationTop')" v-slot:paginationTop>
          <slot name="paginationTop" />
        </template>
        <!-- 翻页底部 -->
        <template v-if="slots.includes('paginationBottom')" v-slot:paginationBottom>
          <slot name="paginationBottom" />
        </template>
        <!-- 翻页位置 -->
        <template v-if="slots.includes('pagination')" v-slot:pagination>
          <slot name="pagination" />
        </template>
      </pagination>
      <!-- 底部 -->
      <div v-if="slots.includes('footer')" class="table-view-footer">
        <slot name="footer" />
      </div>
    </template>
  </div>
</template>
<script lang="ts" setup>
import { reactive, useAttrs, useSlots, watch, computed, nextTick, onMounted, onBeforeUnmount, PropType } from 'vue';
import getGlobal from "@/utils/global";
import getProxy from "@/utils/proxy";
import filterBar from './filter.vue';
import pagination from './pagination.vue';
import tableView from './table.vue';
import { SortableEvent } from 'sortablejs';

const includeFun = ['filterReset', 'expandFilter', 'requested'];
const global = getGlobal();
const proxy = getProxy();
const $slots = useSlots();
const $attrs = useAttrs();
const $emit = defineEmits([
  'requested', 'expandFilter', 'filterReset', 'filterValidate', 'tableRowSortEnd', 'tableRowSortStart', 'tableColSortEnd', 'tableColSortStart'
]);
const props = defineProps({
  // 搜索栏
  filterFields: { type: Array as PropType<Array<{[key:string]:any}>>, default: () => [] },
  // 搜索栏默认初始值
  filterModel: { type: Object as PropType<{[key:string]:any}>, default: () => {return {}} },
  // 搜索栏设置
  filterConfig: {
    type: Object as PropType<{
      showFilter?: boolean,
      showSearch?: boolean,
      showReset?: boolean,
      validRules?: {[key:string]:Array<{[key:string]:any}>}
    }>,
    default: () => {return {}}
  },
  // 表格请求方法
  requestHandler: { type: Function, default: () => {} },
  // 发起请求之前
  requestBefore: { type: Function, default: (filterVal:any) => filterVal },
  // 表格列设置
  tableColumns:  { type: Array as PropType<Array<{[key:string]:any}>>, default: () => [] },
  // 表格其他设置
  tableConfog: { type: Object as PropType<{
    autoload?: boolean,
    multiple?: boolean,
    enableRowSort?: boolean,
    enableColSort?: boolean,
    showTable?: boolean
  }>,  default: () => {return {}} },
  tableConfig: { type: Object as PropType<{
    autoload?: boolean,
    multiple?: boolean,
    enableRowSort?: boolean,
    enableColSort?: boolean,
    showTable?: boolean,
    indexMethod?: any,
  }>,  default: () => {return {}} },
  // 表格配置 对应 elementUI 的 table Attributes
  tableProps: { type: Object as PropType<{[key:string]:any}>, default: () => {return {}} },
  // 列表数据接口返回字段映射
  contentDataMap: { type: Object as PropType<{
    rows?: string,
    total?: string,
    errorInfos?: string
  }>, default: () => {return {}} },
  // 设置为 false 之后，表格高度变为自动适应
  handleTable: { type: Boolean, default: true },
  isInited: { type: Boolean, default: true },
  // 分页设置
  paginationConfig: {
    type: Object as PropType<{
      background?: boolean,
      showPagination?: boolean,
      layout?: string,
      'pager-count'?: number,
      'page-sizes'?: Array<number>,
      'page-size'?: number
    }>,
    default: () => {return { showPagination: true }}
  },
  // 请求报错时，是否情况列表数据
  isClearData: { type: Boolean, default: true }
});
const base = reactive({
  pageId: Math.random().toString(36).substring(2),
  initLoading: false,
  firstLoading: true,
  tableLoading: false,
  isExpand: false,
  notCalculate: false,
  tableHeight: '',
  tableMinHeight: 250,
  showPagination: true,
  filterHeight: 0,
  pageColumns: (props.tableColumns||[]),
  isInitColumns: true,
  tableDataMap: { rows: 'data.list', total: 'data.total', errorInfos: 'msg' },
  tableOtherConfog: {
    // 打开页面立即加载数据
    autoload: false,
    // 表格是否多选
    multiple: false,
    // 是否开启行拖拽排序
    enableRowSort: false,
    // 是否开启列拖拽排序
    enableColSort: false,
    // 显示列表
    showTable: true
  },
  // 表格数据
  pageTableData: { rows: [], total: 0 },
  paginationAlign: 'right',
  // 页码、条数
  pageConfig: {
    pageSize: 20,
    pageNum: 1
  },
  pageProdKeys: {
    'page-size': 'pageSize',
    'page-num': 'pageNum'
  },
  // 分页总条数
  paginationTotal: 0,
  // 分页设置
  paginationInfo: {
    background: true,
    layout: 'total, sizes, prev, pager, next, jumper',
    'pager-count': 5,
    'page-sizes': [10, 20, 50, 100, 200, 500],
    'page-size': 20
  }
});

const slots = computed(() => {
  return Object.keys($slots)
});
const tableConfig = computed(() => {
  return {...base.tableOtherConfog, ...props.tableConfog, ...props.tableConfig}
});
// 默认初始化列需在此次处理
const tableColumnConfig = computed(() => {
  let defaultCol:Array<any> = [];
  let beforeCol:Array<any> = [];
  let afterCol:Array<any> = [];
  let columns:Array<any> = [];
  if (base.isInitColumns) {
    typeof tableConfig.value.multiple === 'boolean' && tableConfig.value.multiple && defaultCol.push({defaultCol: true});
    typeof tableConfig.value.indexMethod === 'function' && defaultCol.push({defaultCol: true});
    typeof tableConfig.value.indexMethod === 'boolean' && tableConfig.value.indexMethod && defaultCol.push({defaultCol: true});
    (base.pageColumns||[]).forEach((item) => {
      if (['left', 'right'].includes(item.fixed)) {
        ['left'].includes(item.fixed) && beforeCol.push(item);
        ['right'].includes(item.fixed) && afterCol.push(item);
      } else {
        columns.push(item);
      }
    })
    return [...defaultCol, ...beforeCol, ...columns, ...afterCol];
  } else {
    return base.pageColumns;
  }
})
const filterFieldConfig = computed(() => {
  return props.filterFields;
});

// 绑定到列表的事件
const tableListeners = computed(() => {
  const attrs = Object.keys($attrs);
  let tableFun = {};
  attrs.forEach(funKeys => {
    if (!global.$common.isEmpty(funKeys) && funKeys.substring(0,2) === 'on') {
      const newKey = `${funKeys.substring(2, 1).toLocaleLowerCase()}${funKeys.substring(3, funKeys.length)}`;
      !includeFun.includes(newKey) && (tableFun[newKey] = $attrs[funKeys]);
    }
  })
  return tableFun;
});
// 列表的插槽
const tableHeaderSlots = computed(() => {
  const headerSlots = Object.keys($slots).filter(item => item.includes('-header'));
  return global.$common.arrRemoveRepeat(headerSlots);
});
// 列表的内容插槽
const tableContentSlots = computed(() => {
  const contentSlots = Object.keys($slots).filter(item => item.includes('-content'));
  return global.$common.arrRemoveRepeat(contentSlots);
});

// 点击搜索按钮、翻页、列表条数改变时触发, 当 type 为 true 时，则返回到第一页并请求数据
const search = (type: boolean = false, options: {valid?: boolean} = {}) => {
  if (typeof options.valid === 'boolean' && !options.valid) {
    $emit('filterValidate', false);
    return;
  }
  if (base.tableLoading) return;
  type && (base.pageConfig.pageNum = 1);
  const filterVal = getFilter();
  nextTick(async () => {
    base.tableLoading = true;
    try{
      const newFilter = await props.requestBefore({
        ...filterVal,
        [base.pageProdKeys['page-size']]: base.pageConfig.pageSize,
        [base.pageProdKeys['page-num']]: base.pageConfig.pageNum
      });
      if (typeof newFilter === 'boolean' && !newFilter) {
        base.tableLoading = false;
        return;
      }
      base.pageTableData = { rows: [], total: 0 };
      const requestData = await props.requestHandler(newFilter);
      base.tableDataMap = {...base.tableDataMap, ...props.contentDataMap };
      Object.keys(base.tableDataMap).forEach(key => {
        if (base.tableDataMap[key].includes('.')) {
          const keys = global.$common.split(base.tableDataMap[key], '.');
          const hand = (res:any, index:number) => {
            if (index >= keys.length - 1) {
              base.pageTableData[key] = res[keys[index]];
            } else {
              hand(res[keys[index]], (index + 1));
            }
          }
          hand(requestData, 0);
        } else {
          base.pageTableData[key]= requestData[base.tableDataMap[key]];
        }
      })
      base.paginationTotal = base.pageTableData.total || base.pageTableData.rows.length;
    } catch (err) {
      if (props.isClearData) {
        base.pageTableData = { rows: [], total: 0 };
        base.paginationTotal = 0;
      }
      console.error(err)
    }
    base.tableLoading && (base.tableLoading = false);
    base.firstLoading && (base.firstLoading = false);
    // 完成数据请求后触发，无论成功失败
    $emit('requested');
  })
}
// 展开收起按钮触发
const filterExpand = (expand:boolean) => {
  base.isExpand = expand;
  nextTick(() => {
    changeTableHeight();
    nextTick(() => {
      changeTableHeight(); // 多执行一次，修正由于样式引起的高度不准确
      $emit('expandFilter', base.isExpand);
    })
  })
}
// 重置按钮触发回调
const resetFilter = () => {
  $emit('filterReset');
}
// 触发重置按钮
const resetHand = () => {
  proxy.$refs[`filterBar-${base.pageId}`] && proxy.$refs[`filterBar-${base.pageId}`].resetHand();
}
// 分页改变时触发
const paginationChange = (pageNum:number, pageSize:number) => {
  if (typeof pageNum !== 'number' && typeof pageSize !== 'number') return;
  filterSearch(false);
}
// 改变表格高度(当获取到容全高度小于 tableMinHeight 时，列表高度将自动高度)
const changeTableHeight = () => {
  if (typeof props.handleTable !== 'boolean' || !props.handleTable) return;
  nextTick(() => {
    nextTick(() => {
      const dome = document.querySelector(`#dytTableView-${base.pageId}`) as HTMLElement;
      if (base.notCalculate || !dome) return;
      const getBlock = (el:HTMLElement) => {
        if (!el) return 0;
        const marginTop = Number(global.$common.getElementStyle(el, 'margin-top', true));
        const marginBottom = Number(global.$common.getElementStyle(el, 'margin-bottom', true));
        const height = Number(global.$common.getElementStyle(el, 'height', true));
        return marginTop + marginBottom + height;
      };
      const filterBar = dome.querySelector(`#filter-${base.pageId}`) as HTMLElement;
      if (!base.isExpand && base.filterHeight === 0) {
        base.filterHeight = Number(global.$common.getElementStyle(filterBar, 'height', true));
      }
      if (global.$common.isEmpty(props.tableProps.height)) {
        const parentNode = dome.parentNode as HTMLElement;
        let contHeight = parentNode.clientHeight;      
        const v = {
          parentBackGauge: (() => {
            const paddingTop = Number(global.$common.getElementStyle(parentNode, 'paddingTop', true));
            const paddingBottom = Number(global.$common.getElementStyle(parentNode, 'paddingBottom', true));
            return paddingTop + paddingBottom;
          })(),
          contentBackGauge: (() => {
            const paddingTop = Number(global.$common.getElementStyle(dome, 'paddingTop', true));
            const paddingBottom = Number(global.$common.getElementStyle(dome, 'paddingBottom', true));
            const marginBottom = Number(global.$common.getElementStyle(dome, 'margin-bottom', true));
            return paddingTop + paddingBottom + marginBottom + dome.offsetTop;
          })(),
          headOccupyHeight: getBlock(dome.querySelector(`#view-${base.pageId}`) as HTMLElement),
          filterOccupyHeight: getBlock(filterBar),
          paginationOccupyHeight: getBlock(dome.querySelector(`#pagination-${base.pageId}`) as HTMLElement),
          tableTopSlotOccupyHeight: getBlock(dome.querySelector(`.table-top-container`) as HTMLElement),
          tableBottomSlotOccupyHeight: getBlock(dome.querySelector(`.table-bottom-slot`) as HTMLElement)
        };
        Object.keys(v).forEach(k => {
          contHeight -= v[k];
        });
        base.tableHeight = (contHeight < base.tableMinHeight ? null : contHeight) as any;
        // base.notCalculate = base.tableHeight === null;
      } else if (base.isExpand) {
        let newHeight:number | string = 0;
        const difference = Number(global.$common.getElementStyle(filterBar, 'height', true)) - base.filterHeight;
        if (typeof props.tableProps.height === 'string' && !/^\d+$/.test(props.tableProps.height)) {
          newHeight = `calc(${props.tableProps.height} - ${difference}px)`;
        } else {
          newHeight = parseInt(props.tableProps.height) - difference;
          base.tableHeight = newHeight < base.tableMinHeight ? props.tableProps.height : newHeight;
          // base.notCalculate = base.tableHeight === base.tableProps.height;
        }
      } else {
        base.tableHeight = props.tableProps.height;
      }
      nextTick(() => {
        // 更新列表布局
        proxy.$refs[`table_${base.pageId}`] && proxy.$refs[`table_${base.pageId}`].doLayout();
      })
    })
  })
}
// 行排序开始拖动
const tableRowSortStart = (event: SortableEvent) => {
  $emit('tableRowSortStart', event);
}
// 行排序拖动结束
const tableRowSortEnd = (reslove: {data: Array<{[key:string]: any}>, oldData: Array<{[key:string]: any}>, event?: SortableEvent}) => {
  $emit('tableRowSortEnd', reslove);
}
/**
 * 创建行拖拽实例
 * @param element 目标节点或节点标识id,class等标识
 */
const initTableRowSort = (element: string | HTMLElement | Element | null) => {
  proxy.$refs[`table_${base.pageId}`] && proxy.$refs[`table_${base.pageId}`].initTableRowSort(element);
}
// 列排序开始拖动
const tableColSortStart = (event: SortableEvent) => {
  $emit('tableRowSortStart', event);
}
// 列拖拽完成
const tableColSortEnd = (event?: SortableEvent) => {
  const newColumns = global.$common.copy(tableColumnConfig.value);
  base.isInitColumns = false;
  if (event) {
    const oldIndex =  event.oldIndex as number;
    const newIndex = event.newIndex as number;
    const oldItem = global.$common.copy(newColumns[oldIndex]);
    const newItem = global.$common.copy(newColumns[newIndex]);
    const startIndex = oldIndex > newIndex ? newIndex : oldIndex + 1;
    const endIndex = oldIndex > newIndex ? oldIndex - 1 : newIndex;
    newColumns.forEach((item:any, index:number) => {
      if (index >= startIndex && index <= endIndex) {
        item.fixed = newColumns[index + (oldIndex > newIndex ? 1 : -1)].fixed;
      }
    });
    if (global.$common.isEmpty(newItem.fixed)) {
      delete oldItem.fixed;
    } else {
      oldItem.fixed = newItem.fixed;
    }
    newColumns.splice(oldIndex, 1);
    newColumns.splice(newIndex, 0, oldItem);
    base.pageColumns = newColumns;
  }
  base.pageColumns = newColumns;
  nextTick(() => {
    $emit('tableColSortEnd', { columns: base.pageColumns,  event: event });
  })
}
/**
 * 创建列拖拽实例
 * @param element 目标节点或节点标识id,class等标识
 */
const initTableColumnSort = (element: string | HTMLElement | Element | null) => {
  proxy.$refs[`table_${base.pageId}`] && proxy.$refs[`table_${base.pageId}`].initTableColumnSort(element);
}
// 触发搜索栏按钮
const filterSearch = (type:boolean = true) => {
  proxy.$refs[`filterBar-${base.pageId}`] ? proxy.$refs[`filterBar-${base.pageId}`].filterSearch({}, type) : search(type);
}
// 获取搜索栏数据
const getFilter = () => {
  return proxy.$refs[`filterBar-${base.pageId}`] ? proxy.$refs[`filterBar-${base.pageId}`].getFormData() : props.filterModel;
}
// 用于多选表格，清空用户的选择
const clearSelection = () => {
  proxy.$refs[`table_${base.pageId}`] && proxy.$refs[`table_${base.pageId}`].clearSelection();
}
// 用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）
const toggleRowSelection = (row:any, selected:any) => {
  proxy.$refs[`table_${base.pageId}`] && proxy.$refs[`table_${base.pageId}`].toggleRowSelection(row, selected);
}
// 用于多选表格，切换所有行的选中状态
const toggleAllSelection = () => {
  proxy.$refs[`table_${base.pageId}`] && proxy.$refs[`table_${base.pageId}`].toggleAllSelection();
}
// 用于可展开表格与树形表格，切换某一行的展开状态，如果使用了第二个参数，则是设置这一行展开与否（expanded 为 true 则展开）
const toggleRowExpansion = (row:any, expanded:any) => {
  proxy.$refs[`table_${base.pageId}`] && proxy.$refs[`table_${base.pageId}`].toggleRowExpansion(row, expanded);
}
// 用于单选表格，设定某一行为选中行，如果调用时不加参数，则会取消目前高亮行的选中状态。
const setCurrentRow = (row:any) => {
  proxy.$refs[`table_${base.pageId}`] && proxy.$refs[`table_${base.pageId}`].setCurrentRow(row);
}
// 用于清空排序条件，数据会恢复成未排序的状态
const clearSort = () => {
  proxy.$refs[`table_${base.pageId}`] && proxy.$refs[`table_${base.pageId}`].clearSort();
}
// 不传入参数时用于清空所有过滤条件，数据会恢复成未过滤的状态，也可传入由columnKey组成的数组以清除指定列的过滤条件
const clearFilter = (columnKey:any) => {
  proxy.$refs[`table_${base.pageId}`] && proxy.$refs[`table_${base.pageId}`].clearFilter(columnKey);
}
// 对 Table 进行重新布局。当 Table 或其祖先元素由隐藏切换为显示时，可能需要调用此方法
const doLayout = () => {
  // 刷新组件布局
  changeTableHeight();
}
// 手动对 Table 进行排序。参数prop属性指定排序列，order指定排序顺序。
const sort = (prop:any, order:any) => {
  proxy.$refs[`table_${base.pageId}`] && proxy.$refs[`table_${base.pageId}`].sort(prop, order);
}
// 是否初始化
watch(() => props.isInited, (val) => {
  base.initLoading = val;
  if (val) {
    nextTick(() => {
      // 打开页面立即加载数据
      tableConfig.value.autoload && filterSearch(true);
      // 刷新布局
      changeTableHeight();
    })
  }
}, {deep: true, immediate: true});

// 监听翻页
watch(() => props.paginationConfig, (val) => {
  let newConfig = {};
  let pageConfig = {};
  const keys = Object.keys(base.paginationInfo);
  Object.keys(val).forEach(key => {
    ['align'].includes(key) && (base.paginationAlign = val[key]);
    ['showPagination'].includes(key) && (base.showPagination = val[key]);
    if (keys.includes(key) && !global.$common.isEmpty(val[key])) {
      newConfig[key] = val[key]
    }
    if (!global.$common.isEmpty(val[key])) {
      // 页码设置
      if (['page-size', 'page-num'].includes(key) && typeof val[key] === 'number') {
        'page-size' === key && (pageConfig['pageSize'] = val[key]);
        'page-num' === key && (pageConfig['pageNum'] = val[key]);
      }
      // 键值替换
      if (['pageProdKeys'].includes(key)) {
        Object.keys(val[key]).forEach(page => {
          base.pageProdKeys[page] = val[key][page];
        })
      }
    }
  })
  base.pageConfig = {...base.pageConfig, ...pageConfig};
  base.paginationInfo = {...base.paginationInfo, ...newConfig}
}, {deep: true, immediate: true});
  
onMounted(() => {
  const dome = document.querySelector(`#dytTableView-${base.pageId}`) as HTMLElement;
  const parentNode = dome.parentNode as HTMLElement;
  if (parentNode) {
    parentNode.style.position = 'relative';
  }
  nextTick(() => {
    if (dome.offsetTop > 0) {
      dome.style.height = `calc(100% - ${dome.offsetTop}px)`;
    }
  })
  // 绑定事件
  window.addEventListener('resize', changeTableHeight);
});
// 组件销毁前
onBeforeUnmount(() => {
  // 解除绑定
  window.removeEventListener('resize', changeTableHeight);
});
// 导出函数
defineExpose({
  search,
  filterExpand,
  resetFilter,
  resetHand,
  changeTableHeight,
  filterSearch,
  getFilter,
  clearSelection,
  toggleRowSelection,
  toggleAllSelection,
  toggleRowExpansion,
  setCurrentRow,
  clearSort,
  clearFilter,
  doLayout,
  sort,
  initTableRowSort,
  initTableColumnSort
});
</script>
<style lang="less" scoped>
.dyt-table-view{
  position: relative;
  padding: 15px 20px 10px 20px;
  margin: 0;
  height: 100%;
  .table-view-head{
    margin-bottom: 10px;
  }
}
</style>

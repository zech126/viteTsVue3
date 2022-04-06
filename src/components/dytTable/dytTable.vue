<template>
  <div
    class="dyt-table-view"
    :id="`dytTableView-${pageId}`"
    v-loading="!initLoading"
    element-loading-text="列表模块初始化"
    :class="{
      'first-loading': firstLoading,
      'table-loading': tableLoading
    }"
  >
    <template v-if="initLoading">
      <!-- 头部 -->
      <div v-if="slots.includes('head')" class="table-view-head">
        <slot name="head" />
      </div>
      <!-- 搜索栏 -->
      <filter-bar
        :ref="`filterBar-${pageId}`"
        :page-id="pageId"
        :table-loading="tableLoading"
        :filter-config="filterConfig"
        :filter-fields="filterFieldConfig"
        :filter-model="filterModel"
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
        <template v-for="(fItem) in filterFieldConfig.filter((item:any) => item.slot)" v-slot:[fItem.model]>
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
        :ref="`table_${pageId}`"
        v-loading="tableLoading"
        :page-id="pageId"
        :table-columns="tableColumnConfig"
        :table-data="pageTableData.rows"
        :table-height="tableHeight"
        :table-props="tableProps"
        :table-confog="tableOtherConfog"
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
      <div v-if="slots.includes('customTable')" v-loading="tableLoading" class="dyt-table-container">
        <slot name="customTable" />
      </div>
      <!-- 翻页功能 -->
      <pagination
        v-model:page-config="pageConfig"
        :total="paginationTotal"
        :page-id="pageId"
        :show-pagination="showPagination"
        :table-loading="tableLoading"
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
<script lang="ts">
import { defineComponent } from 'vue';
import filterBar from './filter.vue';
import pagination from './pagination.vue'
import tableView from './table.vue'

const includeFun = ['filterReset', 'expandFilter', 'requested'];

export default defineComponent({
  name: 'dytTable',
  components: { filterBar, pagination, tableView },
  props: {
    //搜索栏
    filterFields: { type: Array, default: () => [] },
    filterModel: { type: Object, default: () => {return {}} },
    // 搜索栏设置
    filterConfig: { type: Object,  default: () => {return {}} },
    // 表格请求方法
    requestHandler: { type: Function, default: () => {} },
    // 发起请求之前
    requestBefore: { type: Function, default: (filterVal:any) => filterVal },
    // 表格列设置
    tableColumns:  { type: Array, default: () => [] },
    // 表格其他设置
    tableConfog: { type: Object,  default: () => {return {}} },
    // 表格配置 对应 elementUI 的 table Attributes
    tableProps: { type: Object, default: () => {return {}} },
    // 列表数据接口返回字段映射
    contentDataMap: { type: Object, default: () => {return {}} },
    // 设置为 false 之后，表格高度变为自动适应
    handleTable: { type: Boolean, default: true },
    isInited: { type: Boolean, default: true },
    // 分页设置
    paginationConfig: {
      type: Object,
      default: () => {return { showPagination: true }}
    },
    // 请求报错时，是否情况列表数据
    isClearData: { type: Boolean, default: true }
  },
  emits: ['requested', 'expandFilter', 'filterReset'],
  data () {
    return {
      pageId: Math.random().toString(36).substring(2),
      initLoading: false,
      firstLoading: true,
      tableLoading: false,
      isExpand: false,
      notCalculate: false,
      tableHeight: null,
      showPagination: true,
      filterHeight: 0,
      tableDataMap: { rows: 'data.list', total: 'data.total', errorInfos: 'msg' },
      tableOtherConfog: {
        // 打开页面立即加载数据
        autoload: true,
        // 表格是否多选
        multiple: false,
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
      paginationTotal: 1200,
      // 分页设置
      paginationInfo: {
        background: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        'pager-count': 5,
        'page-sizes': [10, 20, 50, 100, 200, 500],
        'page-size': 20
      }
    }
  },
  computed: {
    slots () {
      return Object.keys(this.$slots)
    },
    tableColumnConfig ():any {
      return this.tableColumns;
    },
    filterFieldConfig ():any {
      return this.filterFields;
    },
    // 绑定到列表的事件
    tableListeners () {
      const attrs = Object.keys(this.$attrs);
      let tableFun = {};
      attrs.forEach(funKeys => {
        if (!this.$common.isEmpty(funKeys) && funKeys.substring(0,2) === 'on') {
          const newKey = `${funKeys.substring(2, 1).toLocaleLowerCase()}${funKeys.substring(3, funKeys.length)}`;
          !includeFun.includes(newKey) && (tableFun[newKey] = this.$attrs[funKeys]);
        }
      })
      return tableFun;
    },
    // 列表的插槽
    tableHeaderSlots () {
      const headerSlots = Object.keys(this.$slots).filter(item => item.includes('-header'));
      return this.$common.arrRemoveRepeat(headerSlots);
    }
  },
  watch: {
    isInited: {
      deep: true,
      immediate: true,
      handler (val) {
        this.initLoading = val;
      }
    },
    tableConfog: {
      deep: true,
      immediate: true,
      handler (val) {
        this.tableOtherConfog = {...this.tableOtherConfog, ...val};
      }
    },
    paginationConfig: {
      deep: true,
      immediate: true,
      handler (val) {
        let newConfig = {};
        let pageConfig = {};
        const keys = Object.keys(this.paginationInfo);
        Object.keys(val).forEach(key => {
          ['align'].includes(key) && (this.paginationAlign = val[key]);
          ['showPagination'].includes(key) && (this.showPagination = val[key]);
          if (keys.includes(key) && !this.$common.isEmpty(val[key])) {
            newConfig[key] = val[key]
          }
          if (!this.$common.isEmpty(val[key])) {
            // 页码设置
            if (['page-size', 'page-num'].includes(key) && typeof val[key] === 'number') {
              'page-size' === key && (pageConfig['pageSize'] = val[key]);
              'page-num' === key && (pageConfig['pageNum'] = val[key]);
            }
            // 键值替换
            if (['pageProdKeys'].includes(key)) {
              Object.keys(val[key]).forEach(page => {
                this.pageProdKeys[page] = val[key][page];
              })
            }
          }
        })
        this.pageConfig = {...this.pageConfig, ...pageConfig};
        this.paginationInfo = {...this.paginationInfo, ...newConfig}
      }
    },
    // pageConfig: {
    //   deep: true,
    //   immediate: true,
    //   handler (val) {
    //     console.log('pageConfig-----', val)
    //   }
    // }
  },
  created () {},
  mounted () {
    // 绑定事件
    window.addEventListener('resize', this.changeTableHeight);
    setTimeout(() => {
      // 刷新布局
      this.changeTableHeight();
      this.$nextTick(() => {
      // 打开页面立即加载数据
        this.tableOtherConfog.autoload && this.filterSearch();
      })
    }, 100)
  },
  // 组件销毁前
  beforeUnmount () {
    // 解除绑定
    window.removeEventListener('resize', this.changeTableHeight);
  },
  methods: {
    // 点击搜索按钮、翻页、列表条数改变时触发, 当 type 为 true 时，则返回到第一页并请求数据
    search (type: boolean = false) {
      if (this.tableLoading) return;
      type && (this.pageConfig.pageNum = 1);
      const filterVal = this.getFilter();
      this.$nextTick(async () => {
        this.tableLoading = true;
        try{
          const newFilter = await this.requestBefore({
            ...filterVal,
            [this.pageProdKeys['page-size']]: this.pageConfig.pageSize,
            [this.pageProdKeys['page-num']]: this.pageConfig.pageNum
          });
          if (typeof newFilter === 'boolean' && !newFilter) {
            this.tableLoading = false;
            return;
          }
          const requestData = await this.requestHandler(newFilter);
          this.tableDataMap = {...this.tableDataMap, ...this.contentDataMap };
          Object.keys(this.tableDataMap).forEach(key => {
            if (this.tableDataMap[key].includes('.')) {
              const keys = this.tableDataMap[key].split('.');
              const hand = (res:any, index:number) => {
                if (index >= keys.length - 1) {
                  this.pageTableData[key] = res[keys[index]];
                } else {
                  hand(res[keys[index]], (index + 1));
                }
              }
              hand(requestData, 0);
            } else {
              this.pageTableData[key]= requestData[this.tableDataMap[key]];
            }
          })
          this.paginationTotal = this.pageTableData.total || this.pageTableData.rows.length;
        } catch (err) {
          this.isClearData && (this.pageTableData = { rows: [], total: 0 });
          console.error(err)
        }
        this.tableLoading && (this.tableLoading = false);
        this.firstLoading && (this.firstLoading = false);
        // 完成数据请求后触发，无论成功失败
        this.$emit('requested');
      })
    },
    // 展开收起按钮触发
    filterExpand (expand:boolean) {
      this.isExpand = expand;
      this.$nextTick(() => {
        // this.changeTableHeight(this.isExpand);
        this.changeTableHeight();
        this.$nextTick(() => {
          this.$emit('expandFilter', this.isExpand);
        })
      })
    },
    // 重置按钮触发回调
    resetFilter () {
      this.$emit('filterReset');
    },
    // 触发重置按钮
    resetHand () {
      this.$refs[`filterBar-${this.pageId}`] && this.$refs[`filterBar-${this.pageId}`].resetHand();
    },
    // 分页改变时触发
    paginationChange (pageNum:number, pageSize:number) {
      if (typeof pageNum !== 'number' && typeof pageSize !== 'number') return;
      this.search();
    },
    // 改变表格高度(当获取到容全高度小于 200 时，列表高度将自动高度)
    changeTableHeight () {
      if (typeof this.handleTable !== 'boolean' || !this.handleTable) return;
      this.$nextTick(() => {
        const dome:any = document.querySelector(`#dytTableView-${this.pageId}`);
        if (this.notCalculate || !dome) return;
        const filterBar = dome.querySelector(`.filterBar-${this.pageId}`);
        if (!this.isExpand && !this.filterHeight) {
          this.filterHeight = this.$common.getElementStyle(filterBar, 'height', true);
        }
        if (this.$common.isEmpty(this.tableProps.height)) {
          const tableDome = dome.querySelector(`#table_${this.pageId}`);
          let contHeight = dome.parentNode.clientHeight;
          const v = {
            paddingTop: this.$common.getElementStyle(dome.parentNode, 'paddingTop', true),
            paddingBottom: this.$common.getElementStyle(dome.parentNode, 'paddingBottom', true),
            tableBottomHeight: this.$common.getElementStyle(dome.querySelector(`.table-view-footer`), 'height', true),
            bottomHeight: this.$common.getElementStyle(dome.querySelector(`.table-bottom-slot`), 'height', true),
            bottomMarginTop: this.$common.getElementStyle(dome.querySelector(`.table-bottom-slot`), 'margin-top', true),
            bottomMarginBottom: this.$common.getElementStyle(dome.querySelector(`.table-bottom-slot`), 'margin-bottom', true),
            paginationHeight: this.$common.getElementStyle(dome.querySelector(`#pagination_${this.pageId}`), 'height', true),
            tableTop: tableDome ? (tableDome.offsetTop + tableDome.querySelector(`.mian-container-table`).offsetTop) : 0,
            clearance: 10
          }
          Object.keys(v).forEach(k => {
            contHeight -= v[k];
          })
          // console.log(contHeight,dome.parentNode.clientHeight, tableDome.offsetTop, tableDome.querySelector(`.mian-container-table`).offsetTop)
          this.tableHeight = contHeight < 200 ? null : contHeight
          // this.notCalculate = this.tableHeight === null;
        } else if (this.isExpand) {
          let newHeight:any = 0;
          const difference = this.$common.getElementStyle(filterBar, 'height', true) - this.filterHeight;
          if (typeof this.tableProps.height === 'string' && !/^\d+$/.test(this.tableProps.height)) {
            newHeight = `calc(${this.tableProps.height} - ${difference}px)`;
          } else {
            newHeight = parseInt(this.tableProps.height) - difference;
            this.tableHeight = newHeight < 200 ? this.tableProps.height : newHeight;
            // this.notCalculate = this.tableHeight === this.tableProps.height;
          }
        } else {
          this.tableHeight = this.tableProps.height;
        }
        this.$nextTick(() => {
          // 更新列表布局
          this.$refs[`table_${this.pageId}`] && this.$refs[`table_${this.pageId}`].doLayout();
        })
      })
    },
    // 触发搜索栏按钮
    filterSearch () {
      this.$refs[`filterBar-${this.pageId}`] ? this.$refs[`filterBar-${this.pageId}`].filterSearch() : this.search();
    },
    // 获取搜索栏数据
    getFilter () {
      return this.$refs[`filterBar-${this.pageId}`] ? this.$refs[`filterBar-${this.pageId}`].getFormData() : this.filterModel;
    },
    // 用于多选表格，清空用户的选择
    clearSelection () {
      this.$refs[`table_${this.pageId}`] && this.$refs[`table_${this.pageId}`].clearSelection();
    },
    // 用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）
    toggleRowSelection (row:any, selected:any) {
      this.$refs[`table_${this.pageId}`] && this.$refs[`table_${this.pageId}`].toggleRowSelection(row, selected);
    },
    // 用于多选表格，切换所有行的选中状态
    toggleAllSelection () {
      this.$refs[`table_${this.pageId}`] && this.$refs[`table_${this.pageId}`].toggleAllSelection();
    },
    // 用于可展开表格与树形表格，切换某一行的展开状态，如果使用了第二个参数，则是设置这一行展开与否（expanded 为 true 则展开）
    toggleRowExpansion (row:any, expanded:any) {
      this.$refs[`table_${this.pageId}`] && this.$refs[`table_${this.pageId}`].toggleRowExpansion(row, expanded);
    },
    // 用于单选表格，设定某一行为选中行，如果调用时不加参数，则会取消目前高亮行的选中状态。
    setCurrentRow (row:any) {
      this.$refs[`table_${this.pageId}`] && this.$refs[`table_${this.pageId}`].setCurrentRow(row);
    },
    // 用于清空排序条件，数据会恢复成未排序的状态
    clearSort () {
      this.$refs[`table_${this.pageId}`] && this.$refs[`table_${this.pageId}`].clearSort();
    },
    // 不传入参数时用于清空所有过滤条件，数据会恢复成未过滤的状态，也可传入由columnKey组成的数组以清除指定列的过滤条件
    clearFilter (columnKey:any) {
      this.$refs[`table_${this.pageId}`] && this.$refs[`table_${this.pageId}`].clearFilter(columnKey);
    },
    // 对 Table 进行重新布局。当 Table 或其祖先元素由隐藏切换为显示时，可能需要调用此方法
    doLayout () {
      // 刷新组件布局
      this.changeTableHeight();
    },
    // 手动对 Table 进行排序。参数prop属性指定排序列，order指定排序顺序。
    sort (prop:any, order:any) {
      this.$refs[`table_${this.pageId}`] && this.$refs[`table_${this.pageId}`].sort(prop, order);
    }
  }
});
</script>
<style lang="less">
.dyt-table-view{
  position: relative;
  padding: 0;
  margin: 0;
  height: 100%;
  .table-view-head{
    margin-bottom: 10px;
  }
}
</style>

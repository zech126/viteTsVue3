<template>
  <div :id="`table_${pageId}`" class="dyt-table-container">
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
      <div v-if="tableConfog.showTable" class="mian-container-table">
        <el-table
          :ref="`table_${pageId}`"
          v-bind="tableAttr"
          v-on="tableListeners"
          :data="tableData"
          :height="tableHeight"
          :max-height="(tableAttr['max-height'] || tableAttr['maxHeight'] || null)"
          style="width: 100%;"
        >
          <el-table-column
            v-if="typeof tableConfog.multiple === 'boolean' && tableConfog.multiple"
            align="center"
            type="selection"
            width="50"
            :selectable="selectable"
          />
          <el-table-column
            v-if="typeof tableConfog.indexMethod === 'function'"
            align="center"
            type="index"
            width="50"
            :index="tableConfog.indexMethod"
          />
          <el-table-column
            v-if="typeof tableConfog.indexMethod === 'boolean' && tableConfog.indexMethod"
            align="center"
            type="index"
            width="50"
          />
          <slot name="tableColumn">
            <template v-for="(item, index) in columnConfig">
              <!-- 自定义插槽列 -->
              <slot v-if="item.slot" :name="item.slot" :column-config="item" />
              <el-table-column v-else :key="`col-${index}`"
                v-bind="{
                  'show-overflow-tooltip': true,
                  ...item,
                  'min-width': item['min-width'] || item.minWidth,
                  align: (columnAlign.includes(item.align) ? item.align : 'center')
                }"
              >
                <template v-slot="scope">
                  <dyt-node v-if="typeof cloumnsRender[`render-${index}`] === 'function'" :node="cloumnsRender[`render-${index}`]" :node-parameter="scope"/>
                  <div v-else class="table-ellipsis-tips"
                    v-on="cloumnsEvents[[`events-${index}`]] ? {
                      click: (e) => {
                        cloumnsEvents[[`events-${index}`]].click && cloumnsEvents[[`events-${index}`]].click(scope, e);
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
<script lang="ts">

interface dataType{
  columnAlign: Array<any>;
  columnConfig: Array<any>;
  cloumnsRender: any;
  cloumnsEvents: any;
  tableAttr: {
    height: any;
    'highlight-current-row': boolean;
    // 'row-key': (row) => {
    //   return row.userId
    // },
    stripe: boolean;
    // size: 'small',
    border: boolean;
  }
}

export default {
  name: 'TableView',
  props: {
    // 表格其他设置
    tableConfog: { type: Object, default: () => {return {}} },
    tableData: { type: Array, default: () => {return []} },
    tableHeight: {type: [String, Number], default: null},
    pageId: {type: String, default: ''},
    // 表格配置 对应 elementUI 的 table Attributes
    tableProps: { type: Object, default: () => {return {}} },
    tableColumns:  { type: Array, default: () => [] },
    // 请求中
    tableLoading: { type: Boolean, default: false },
  },
  setup () {},
  data ():dataType {
    return {
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
        // size: 'small',
        border: true
      }
    }
  },
  computed: {
    slots () {
      return Object.keys(this.$slots)
    },
    // 绑定到列表的事件
    tableListeners () {
      const attrs = Object.keys(this.$attrs);
      let tableFun = {};
      attrs.forEach(funKeys => {
        if (!this.$common.isEmpty(funKeys) && funKeys.substr(0,2) === 'on') {
          const newKey = `${funKeys.substr(2, 1).toLocaleLowerCase()}${funKeys.substr(3, funKeys.length)}`;
          tableFun[newKey] = this.$attrs[funKeys];
        }
      })
      return tableFun;
    },
  },
  watch: {
    tableProps: {
      immediate: true,
      deep: true,
      handler (val) {
        this.tableAttr = {...this.tableAttr, ...val}
        delete this.tableAttr.height;
      }
    },
    tableColumns: {
      immediate: true,
      deep: true,
      handler (val) {
        this.initColumns(this.$common.copy(val));
      }
    }
  },
  created () {},
  mounted () {},
  methods: {
    initColumns (arr:Array<any>) {
      let columns:Array<any> = [];
      this.cloumnsRender = {};
      this.cloumnsEvents = {};
      arr.forEach((item, index) => {
        if (typeof item.render === 'function') {
          this.cloumnsRender[`render-${index}`] = item.render;
          delete item.render;
        }
        if (!this.$common.isEmpty(item.events)) {
          this.cloumnsEvents[`events-${index}`] = item.events;
          delete item.events;
        }
        columns.push(item);
      })
      this.columnConfig = columns;
    },
    // 用于多选表格，清空用户的选择
    clearSelection () {
      this.$refs[`table_${this.pageId}`].clearSelection();
    },
    // 用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）
    toggleRowSelection (row:any, selected:any) {
      this.$refs[`table_${this.pageId}`].toggleRowSelection(row, selected);
    },
    // 用于多选表格，切换所有行的选中状态
    toggleAllSelection () {
      this.$refs[`table_${this.pageId}`].toggleAllSelection();
    },
    // 用于可展开表格与树形表格，切换某一行的展开状态，如果使用了第二个参数，则是设置这一行展开与否（expanded 为 true 则展开）
    toggleRowExpansion (row:any, expanded:any) {
      this.$refs[`table_${this.pageId}`].toggleRowExpansion(row, expanded);
    },
    // 用于单选表格，设定某一行为选中行，如果调用时不加参数，则会取消目前高亮行的选中状态。
    setCurrentRow (row:any) {
      this.$refs[`table_${this.pageId}`].setCurrentRow(row);
    },
    // 用于清空排序条件，数据会恢复成未排序的状态
    clearSort () {
      this.$refs[`table_${this.pageId}`].clearSort();
    },
    // 不传入参数时用于清空所有过滤条件，数据会恢复成未过滤的状态，也可传入由columnKey组成的数组以清除指定列的过滤条件
    clearFilter (columnKey:any) {
      this.$refs[`table_${this.pageId}`].clearFilter(columnKey);
    },
    // 对 Table 进行重新布局。当 Table 或其祖先元素由隐藏切换为显示时，可能需要调用此方法
    doLayout () {
      this.$refs[`table_${this.pageId}`].doLayout();
    },
    // 手动对 Table 进行排序。参数prop属性指定排序列，order指定排序顺序。
    sort (prop:any, order:any) {
      this.$refs[`table_${this.pageId}`].sort(prop, order);
    },
    selectable(row:any, index:any) {
      return this.tableConfog.selectable ? this.tableConfog.selectable(row, index) : true;
    }
  }
};
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
}
</style>

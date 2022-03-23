<template>
  <div :id="`pagination_${pageId}`" class="dyt-pagination-container">
    <div v-if="slots.includes('paginationTop')" class="pagination-top-content">
      <slot name="paginationTop" />
    </div>
    <div v-if="showPagination" class="pagination-main" :style="`text-align: ${align.includes(paginationAlign) ? paginationAlign :'right'};`">
      <slot name="pagination">
        <el-pagination
          v-bind="paginationConfig"
          :total="total"
          v-model:currentPage="pageNum"
          v-model:page-size="pageSize"
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
<script lang="ts">

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

export default {
  name: 'pagination',
  components: {},
  props: {
    pageConfig: { type: Object, default: () => {return {}} },
    total: {type: Number, default: 0},
    pageId: {type: String, default: ''},
    tableLoading: { type: Boolean, default: false },
    showPagination: { type: Boolean, default: true },
    paginationAlign: { type: String, default: 'right' },
    paginationInfo: { type: Object, default: () => {return {}} }
  },
  data ():dataType {
    return {
      align: ['top', 'right', 'bottom', 'let', 'center', 'end', 'inherit', 'initial', 'justify', 'unset', 'start', 'revert'],
      pageSize: 20,
      pageNum: 3,
      paginationConfig: {
        layout: 'total, sizes, prev, pager, next, jumper',
        'pager-count': 5,
        background: true,
        small: false
      },
      oldPageSize: 0,
      oldPageNum: 0,
    }
  },
  computed: {
    slots () {
      return Object.keys(this.$slots)
    }
  },
  watch: {
    paginationInfo: {
      immediate: true,
      deep: true,
      handler (val) {
        this.pageSize = val['page-size'];
        this.paginationConfig = {...this.paginationConfig, ...this.$common.copy(val)};
        delete this.paginationConfig['page-size'];
      }
    },
    pageConfig: {
      immediate: true,
      deep: true,
      handler (val) {
        this.pageSize = val.pageSize || 20;
        this.pageNum = val.pageNum || 1;
        this.oldPageNum = this.pageNum;
        this.oldPageSize = this.pageSize;
      }
    }
  },
  created () {},
  mounted () {},
  methods: {
    sizeChange (val:number) {
      if (this.tableLoading) {
        this.$nextTick(() => {
          this.pageSize = this.oldPageSize;
        })
        return;
      }
      if (this.pageNum > Math.ceil(this.total / val)) {
        this.pageNum = Math.ceil(this.total / val);
        this.oldPageNum = this.pageNum;
      }
      this.pageSize = val;
      this.oldPageSize = val;
      this.$emit('update:pageConfig', {pageNum: this.pageNum, pageSize: val});
      this.$emit('change', this.pageNum, this.pageSize);
    },
    currentChange (val:number) {
      if (this.tableLoading) {
        this.$nextTick(() => {
          this.pageNum = this.oldPageNum;
        })
        return;
      }
      this.pageNum = val;
      this.oldPageNum = this.pageNum;
      this.$emit('update:pageConfig', {pageNum: val, pageSize: this.pageSize});
      this.$emit('change', this.pageNum, this.pageSize);
    }
  }
};
</script>
<style lang="less">
.dyt-pagination-container{
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

<template>
  <div class="sort-select-box">
    <span style="color: #838a9d;">排序：</span>
    <el-select
      v-model="currentSortField"
      placeholder="请选择"
      class="sort-select"
      :class="currentSortType !== '' ? 'active' : ''"
      @change="changeSortField()"
    >
      <el-option
        v-for="item in sortButtonList"
        :key="item.sortField"
        :label="`按${item.sortHeader}`"
        :value="item.sortField"
      />
    </el-select>
    <dyt-button
      class="sort-button"
      :class="currentSortType === '' ? '' : 'active'"
      @click="changeSortType()"
    >
      <span>
        {{ currentSortType === '' ? '无序' : (currentSortType === 'ASC' ? '升序' : '降序') }}
      </span>
      <i :class="currentSortType === 'ASC' ? 'el-icon-top active' : ''" />
      <i :class="currentSortType === 'DESC' ? 'el-icon-bottom active' : ''" />
    </dyt-button>
  </div>
</template>
<script>
import { defineComponent } from 'vue';
/**
 * @description 排序下拉按钮组件（使用方法可参考 orderGrossDetail.vue）
 * @param {Boolean} needDefaultSort // 非必填，是否需要默认排序，true / false，默认 false
 * @param {Array} sortButtonList // 排序按钮列表
 * @param {String} sortHeader // 必填，按钮文字
 * @param {String} sortField // 必填，排序prop
 * @param {String} sortType // 非必填，ASC / DESC，为空则默认降序。
 * 
 * 注：当页面需在首次进入时就有默认排序，请将要默认排序的按钮放在sortButtonList的第一位，
 * 另外，为避免重复请求，父组件在 created 中就不要再 fetch() 了
 * 
 * 传进来的按钮列表数组格式：
 *  sortButtonList: [
      {
        sortHeader: '入库时间',
        sortField: 'warehousingTime',
        sortType: 'ASC'
      },
      {
        sortHeader: '采购时间',
        sortField: 'purchaseTime',
      },
    ],
 */
export default defineComponent({
  name: "DytSortSelect",
  props: {
    // 排序按钮列表
    sortButtonList: {
      type: Array,
      default() {
        return []
      }
    },
    // 是否需要默认排序
    needDefaultSort: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  emits: ['sortInfo'],
  data() {
    return {
      // 当前排序prop（需要默认排序时，取第一个按钮为默认）
      currentSortField: (() => {
        if (this.sortButtonList.length > 0) {
          return this.needDefaultSort === true ? this.sortButtonList[0].sortField : ''
        }
      })(),
      // 当前排序Type
      currentSortType: (() => {
        if (this.sortButtonList.length > 0) {
          return this.needDefaultSort === true ? this.sortButtonList[0].sortType || 'DESC' : ''
        }
      })(),
    }
  },
  created() {
    if (this.needDefaultSort) {
      // 第一次进入页面的默认排序
      this.$emit('sortInfo', {sortType: this.currentSortType, sortStr: this.currentSortField});
    }
  },
  mounted() {},
  methods: {
    // 向父组件传递 sortType sortField
    changeSortField() {
      this.sortButtonList.find((obj) => {
        if (obj.sortField === this.currentSortField) {
          // 有设置默认排序则使用默认，没设置则默认降序
          this.currentSortType = obj.sortType || 'DESC';
        }
      })
      this.$emit('sortInfo', {sortType: this.currentSortType, sortStr: this.currentSortField});
    },
    changeSortType() {
      // 避免没有 sortField 的情况
      if (!this.currentSortField) {
        this.$message.warning('请选择要按哪一列数据排序！');
        return
      }
      // 反选
      this.currentSortType = this.currentSortType === 'ASC' ? 'DESC' : 'ASC';
      this.$emit('sortInfo', {sortType: this.currentSortType, sortStr: this.currentSortField});
    }
  }
});
</script>
<style lang="scss">
.sort-select-box{
  display: inline-block;
  .sort-select {
    width: 120px;
    .el-input__inner {
      color: #838a9d;
      padding: 0;
    }
    .el-input__icon {
      width: 15px;
    }
    &.active {
      .el-input__inner {
        color: #4D8CE9;
        border-color: #4D8CE9;
      }
    }
  }
  .sort-button {
    margin-left: 10px;
    padding: 8px 10px;
    font-size: var(--dyt-font-size);
    i.iconfont {
      font-size: var(--dyt-font-size);
      margin-left: -2px;
      margin-right: -3px;
    }
    i.iconfont.active {
      color: #4D8CE9;
    }
  }
  .sort-button.active {
    border-color: #4D8CE9;
    color: #4D8CE9;
  }
  .sort-button:hover, .sort-button:focus{
    background-color: #FFFFFF;
  }
}
</style>
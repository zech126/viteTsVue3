<template>
  <div class="dyt-filter-container" :id="`filter-${pageId}`">
    <!-- 搜索栏顶部 -->
    <div v-if="slots.includes('filterTop')" class="filter-top-content">
      <slot name="filterTop" />
    </div>
    <!-- 搜索默认内容 -->
    <div v-if="fConfig.showFilter" class="dyt-form-inner" :class="{'expand-form-inner': isExpand}">
      <div class="dyt-form-search">
        <!-- 右边搜索按钮 -->
        <div :style="`display: flex; padding-left: 10px; transform:translateX(-${btnOffsetRight}px);`">
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
        <div v-if="showMore" style="margin-left: 10px;">
          <slot name="searchMore" :isExpand="isExpand">
            <el-button size="small" type="primary" style="height: 30px; padding: 0px 6px;" :title="`${isExpand ? '展开' : '收起'}`" @click="expandHand">
              <Icon :name="`caret-${isExpand ? 'top' : 'bottom'}`" style="font-size: 25px;" />
            </el-button>
          </slot>
        </div>
      </div>
      <div :id="`filterForm-${pageId}`" class="dyt-form-container">
        <slot name="filter">
          <el-form ref="filterForm" :inline="true" :model="formData" :rules="(fConfig.validRules || {})" class="dyt-filter-form"  @submit.prevent>
            <template v-for="(item, index) in filterItems" :key="`item-${index}`">
              <el-form-item :prop="item.model" class="dyt-filter-item" @keyup.enter="keyupEnter">
                <div v-if="!$common.isEmpty(formData[item.model])" class="filter-item-label">
                  {{ item.label || '' }}
                </div>
                <dyt-node v-if="(typeof item.render === 'function')" :node="item.render" />
                <!-- 注册组件 -->
                <template v-if="(!item.slot && typeof item.render !== 'function')">
                  <!-- 输入框 -->
                  <dyt-input
                    v-if="$common.isEmpty(item.type) || ['input', 'text', 'el-input', 'elinput', 'dyt-input', 'dytinput'].includes(item.type.toLowerCase())"
                    v-model="formData[item.model]"
                    v-bind="{
                      ...(item.componentProps||{}),
                      placeholder: item.placeholder || `${item.label}`,
                      style: componentStyle(item.style)
                    }"
                    v-on="(item.events||{})"
                  />
                  <!-- 下拉选择 -->
                  <dyt-select
                    v-else-if="['select', 'el-select', 'elselect', 'dyt-select', 'dytselect'].includes(item.type.toLowerCase())"
                    v-model="formData[item.model]"
                    v-bind="{
                      'collapse-tags': true,
                      ...(item.componentProps||{}),
                      placeholder: item.placeholder || `${item.label}`,
                      style: componentStyle(item.style)
                    }"
                    :options="filterAsync[`${item.model}-options`].value"
                    :loading="filterAsync[`${item.model}-options`].loading"
                    v-on="(item.events||{})"
                  />
                  <!-- 日期组件 -->
                  <dyt-date-picker
                    v-else-if="['date', 'el-date-picker', 'eldatepicker', 'dyt-date-picker', 'dytdatepicker'].includes(item.type.toLowerCase())"
                    v-model="formData[item.model]"
                    v-bind="{
                      ...(item.componentProps||{}),
                      placeholder: item.placeholder || `${item.label}`,
                      style: componentStyle(item.style)
                    }"
                    v-on="(item.events||{})"
                  />
                  <!-- 标签输入 -->
                  <dyt-input-tag
                    v-else-if="['tag', 'textarea', 'input-tag', 'inputtag', 'dyt-input-tag', 'dytinputtag'].includes(item.type.toLowerCase())"
                    v-model="formData[item.model]"
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
                    v-else-if="['tree', 'tree-select', 'treeselect', 'dyt-tree-select', 'dyttreeselect'].includes(item.type.toLowerCase())"
                    v-model="formData[item.model]"
                    v-bind="{
                      ...(item.componentProps||{}),
                      placeholder: item.placeholder || `${item.label}`,
                      style: componentStyle(item.style)
                    }"
                    v-on="(item.events||{})"
                  />
                  <!-- <dytTreeSelect style="width: 300px;"
                    v-model="treeSelectVal"
                    :data="options"
                    :defaultProps="defaultProps"
                    :limit="1"
                    :multiple="true"
                    :check-strictly="false"
                  /> -->
                </template>
                <slot v-if="(item.slot && typeof item.render !== 'function')" :name="item.model" />
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
<script lang="ts">
import {defineComponent} from 'vue';

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

export default defineComponent({
  name: 'filterBar',
  // components: { dytParts },
  props: {
    //搜索栏
    filterFields: { type: Array, default: () => [] },
    pageId: { type: String, default: Math.random().toString(36).substring(2) },
    tableLoading: { type: Boolean, default: false },
    filterConfig: { type: Object, default: () => {return {}} },
    filterModel: { type: Object, default: () => {return {}} },
  },
  setup () {
    // const formData = {};
    // return {
    //   formData
    // }
  },
  emits: ['performSearch', 'resetFilter', 'filterExpand'],
  data ():dataType {
    return {
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
    }
  },
  computed: {
    slots () {
      return Object.keys(this.$slots)
    },
    fConfig () {
      return {...this.config, ...this.filterConfig}
    },
  },
  watch: {
    filterFields: {
      immediate: true,
      deep: true,
      handler (val) {
        const handKey = [
          { key: 'options', additional: 'options', type: 'array'}
        ];
        (val||[]).forEach((item:any) => {
          const keys = Object.keys(item);
          handKey.forEach(key => {
            // 设置为插槽类型的不处理
            if (keys.includes(key.key) && !item[key.key].slot && !item[key.key].render) {
              this.filterFunHand(item[key.key], `${item.model}-options`, key.type);
            }
          })
        })
        this.filterItems = this.$common.copy(val);
      }
    },
    // 插槽值或render的值改变时
    filterModel: {
      immediate: true,
      deep: true,
      handler (val) {
        const slotKey = this.filterFields.filter((item:any) => {
          return item.model && (item.slot || typeof item.render === 'function');
        }).map((slot:any) => slot.model);
        // 将被改变的赋值当前表单，用于验证表单使用
        slotKey.forEach(key => {
          this.formData[key] !== val[key] && (this.formData[key] = val[key]);
        })
      }
    },
    formData: {
      deep: true,
      handler (val) {
        this.$nextTick(() => {
          if (!this.$refs.filterForm) return;
          const keys = Object.keys(this.temporaryForm);
          Object.keys(val).forEach(key => {
            if (keys.includes(key)) {
              if (JSON.stringify(this.temporaryForm[key]) !== JSON.stringify(val[key])) {
                // 改变的值验证
                this.$refs.filterForm.validateField([key], (errorMessage:any) => {});
              }
            } else {
              // 新增值验证
              this.$refs.filterForm.validateField([key], (errorMessage:any) => {});
            }
          })
        });
      }
    }
  },
  created () {
    let formData = {};
    Object.keys(this.filterModel).forEach(key => {
      formData[key] = this.filterModel[key];
      // this.formData[key] = this.filterModel[key];
    });
    this.formData = {...this.formData, ...formData};
    this.oldFormData = this.$common.copy(this.formData);
    this.temporaryForm = this.$common.copy(this.formData);
  },
  mounted () {
    // 绑定事件
    window.addEventListener('resize', this.filterLayout);
    this.filterLayout();
  },
  // 组件销毁前
  beforeUnmount () {
    // 解除绑定
    window.removeEventListener('resize', this.filterLayout);
  },
  methods: {
    // 刷新布局
    filterLayout () {
      const filterForm = document.querySelector(`#filterForm-${this.pageId}`);
      if (!filterForm) return;
      this.showMore = this.$common.getElementStyle(filterForm, 'height', true) > 50;
      // 处理按钮位置
      const handWidth = () => {
        const cont = document.querySelector(`#filter-${this.pageId}`);
        if (!cont) return;
        const allItem = Array.prototype.slice.call(filterForm.querySelectorAll('.dyt-filter-item'), 0);
        const lastItem = allItem.filter(item => item.offsetTop === 0).slice(-1)[0]
        if (lastItem) {
          const contWidth = this.$common.getElementStyle(filterForm, 'width', true);
          const btnWidth = cont.querySelector('.dyt-form-search');
          const itemLeft = lastItem.offsetLeft + this.$common.getElementStyle(lastItem, 'width', true) + 10;
          this.btnOffsetRight = contWidth - itemLeft - this.$common.getElementStyle(btnWidth, 'width', true);
        }
      }
      this.$nextTick(() => {
        handWidth();
        // 使用 setTimeout 再次执行修正计算误差
        // setTimeout(() => { handWidth() }, 0);
      })
    },
    // 搜索
    filterSearch () {
      if (this.tableLoading) return;
      if (!this.$common.isEmpty(this.fConfig.validRules) && this.$refs.filterForm) {
        this.$refs.filterForm.validate((valid:boolean) => {
          if (!valid) return;
          this.$emit('performSearch', true);
        })
      } else {
        this.$emit('performSearch', true);
      }
    },
    // 获取数据
    getFormData () {
      return { ...this.filterModel, ...this.formData };
    },
    // 重置(无法重置插槽渲染的组件值)
    resetHand () {
      let resetVal = {};
      const slotKey = this.filterFields.filter((item:any) => {
        return item.model && !item.slot;
      }).map((slot:any) => slot.model);
      // 将被改变的赋值当前表单，用于验证表单使用
      slotKey.forEach(key => {
        resetVal[key] = this.oldFormData[key];
      });
      this.formData = {...this.formData, ...resetVal};
      this.$nextTick(() => {
        this.$refs.filterForm && this.$refs.filterForm.clearValidate();
        this.$emit('resetFilter');
      })
    },
    // 展开收起
    expandHand () {
      this.isExpand = !this.isExpand;
      this.$emit('filterExpand', this.isExpand);
    },
    // 处理参数中的异步
    filterFunHand (fun:Function, key:string, type:string) {
      const typeVal = { array: [], string: '', object: {}, number: null };
      this.filterAsync[key] = {value: typeVal[type], loading: true};
      if (typeof fun === 'function') {
        const newFun = fun();
        if (newFun.then && newFun.catch) {
          newFun.then((res:any) => {
            this.filterAsync[key] = {value: res, loading: false};
          }).catch(() => {
            this.filterAsync[key] = {value: typeVal[type], loading: false};
          });
        }else if (newFun.then) {
          newFun.then((res:any) => {
            this.filterAsync[key] = {value: res, loading: false};
          })
        } else {
          this.filterAsync[key] = {value: newFun, loading: false};
        }
      } else {
        this.filterAsync[key] = {value: fun, loading: false};
      }
    },
    // 回车事件（使用 插槽、render 方法的不支持）
    keyupEnter (e:Element) {
      // console.log(e)
      this.filterSearch()
    },
    // 对象形式的样式转换成字符串
    componentStyle (style:[string | object ], set:string = '') {
      let newStyle = '';
      if (!this.$common.isEmpty(set)) {
        newStyle = `${set}`;
      }
      if (this.$common.isEmpty(style)) return newStyle;
      if (typeof style === 'string') return `${newStyle}${style}`;
      Object.keys(style).forEach(key => {
        if (typeof style[key] === 'number' || typeof style[key] === 'string') {
          newStyle += `${key}:${typeof style[key] === 'number' ? `${style[key]}px` : style[key]};`;
        }
      })
      return newStyle;
    }
  }
});
</script>
<style lang="less">
.dyt-filter-container{
  position: relative;
  margin-bottom: 10px;
  .filter-bottom-content,
  .filter-top-content{
    margin-bottom: 10px;
  }
  .dyt-form-inner{
    box-sizing: content-box;
    height: 42px;
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
    .dyt-input-demo {
      width: 214px;
    }
    .el-form-item{
      margin-bottom: 18px;
      margin-right: 20px;
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

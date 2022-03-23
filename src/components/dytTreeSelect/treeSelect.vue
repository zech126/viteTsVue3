<template>
  <div
    :ref="`tag-${pageId}`"
    class="dty-tree-demo"
    :class="{
      'tree-demo-hover': isHoverTree
    }"
    @mouseover="hoverTree"
    @mouseout="outTree"
  >
    <el-popover
      placement="bottom-start"
      :width="popoverWidth"
      :hide-after="100"
      trigger="click"
      popper-class="tree-popper-content"
      @after-enter="afterEnter"
      @after-leave="afterLeave"
      @show="popoverShow"
      @hide="popoverHide"
    >
      <template #reference>
        <div class="dyt-tree-content" :class="{'content-active': isShow}">
          <div
            class="tree-content-value"
            :class="{
              'tree-content-multiple': typeof config.multiple === 'boolean' && config.multiple,
              'tree-content-limit': limit > 0 && config.multiple
            }"
          >
            <span v-if="vModel.length === 0" style="color: #ccc;">{{placeholder}}</span>
            <div v-else class="tree-tag-content">
              <template v-for="(item, index) in vModel" :key="index">
                <span class="tree-tag-item" v-if="limit === 0 || (index + 1) <= limit">
                  <span class="tag-item-text">
                    {{treeDataJson[item] ? treeDataJson[item][config.defaultProps.label||'label'] : ''}}
                  </span>
                  <span class="tag-item-close" @click.stop="removeTag(item)">
                    <Icon v-if="limit > 0 && config.multiple" name="close" />
                  </span>
                </span>
              </template>
              <span
                style="color: #ddd; white-space: nowrap;"
                v-if="limit > 0 && (vModel.length - limit) > 0 && config.multiple"
              > + {{vModel.length - limit}}</span>
            </div>
          </div>
          <div class="suffix-inner">
            <Icon @click.stop="clearTree" v-if="isHoverTree && vModel.length > 0" name="circle-close" />
            <Icon v-else :name="`${isShow ? 'arrow-up' : 'arrow-down'}`" />
          </div>
        </div>
      </template>
      <dyt-input v-if="filterable" :ref="`input-${pageId}`" v-model="inputValue" type="text" placeholder="请输入关键字" />
      <el-scrollbar :max-height="treeMaxHeight" :min-height="treeMinHeight" style="margin-top: 10px;">
        <el-tree
          :ref="`tree-${pageId}`"
          class="filter-tree"
          :filter-node-method="filterNodeHand"
          :data="data"
          v-bind="config"
          :style="`width: ${typeof popoverTreeWidth === 'number' ? `${popoverTreeWidth}px` : popoverTreeWidth};`"
          @node-click="nodeClick"
          @check="check"
        >
          <template v-for="slot in slots" v-slot:[slot]="scope">
            <slot :name="slot" v-bind="scope" />
          </template>
        </el-tree>
      </el-scrollbar>
    </el-popover>
  </div>
</template>
<script lang="ts">
interface dataType {
  pageId: string;
  vModel: any;
  isHoverTree: boolean;
  treeDataJson: object;
  isShow: boolean;
  inputValue: string;
  popoverWidth: number;
  defaultConfig: any;
  treeData: Array<any>
}
export default {
  name: 'DytTreeSelect',
  isGlobal: true,
  components: {},
  props: {
    modelValue: { type: [String, Array, Number], default: null },
    // 占位符提示
    placeholder: { type: String, default: '请选择'},
    // 禁用
    disabled: { type: Boolean, default: false },
    // 是否返回字符串, 当 multiple 为 true 有效
    string: { type: Boolean, default: false },
    // 值数组分割符号, 当 multiple 为 true 有效
    split: { type: String, default: ',' },
    // 是否返回字符串, 当 multiple 为 true 无需设置
    backArray: { type: Boolean, default: false },
    // 返回字符串时的分隔符号（string 为 true 时生效）
    separStr: { type: String, default: ',' },
    // 最多显示格式， 0 为不限制
    limit: { type:  Number, default: 0 },
    // 是否可搜索
    filterable: { type: Boolean, default: true },
    // 检索
    filterNodeMethod: { type: Function, default: () => {} },
    // 展示数据,支持异步
    data: { type: Array, default: () => {return []} },
    // 设置树最大高度
    treeMaxHeight: { type: [String, Number], default: '35vh' },
    // 设置树最小高度
    treeMinHeight: { type: [String, Number], default: 50 },
    // 设置树宽度
    popoverTreeWidth: { type: [String, Number], default: null },
  },
  data ():dataType {
    return {
      pageId: Math.random().toString(36).substr(2),
      vModel: [],
      isHoverTree: false,
      treeDataJson: {},
      isShow: false,
      inputValue: '',
      popoverWidth: 200,
      defaultConfig: {
        defaultProps: { label: 'label', value: 'value', children: 'children' },
        'empty-text': '暂无数据!',
        'default-expand-all': true,
        'expand-on-click-node': false,
        'highlight-current': true
      },
      treeData: [],
    }
  },
  computed: {
    slots () {
      return Object.keys(this.$slots)
    },
    config () {
      let config = { ...this.defaultConfig, ...this.$attrs };
      if (config.disabled || config.readonly) {
        config.placeholder = '';
      }
      // 当设置选项框时，则默认为多选
      if (typeof config['show-checkbox'] === 'boolean' && config['show-checkbox']) {
        config['multiple'] = true;
      }
      if (typeof config.multiple === 'boolean' && config.multiple) {
        config['show-checkbox'] = true;
        // 选择行高亮在多选时无效
        config['highlight-current'] = false;
      }
      if (!config['node-key']) {
        config['node-key'] = config.defaultProps.value ? config.defaultProps.value : 'value';
      }
      delete config.style;
      return config;
    }
  },
  watch: {
    modelValue: {
      deep: true,
      immediate: true,
      handler (val) {
        if (JSON.stringify(val) === JSON.stringify(this.vModel)) return;
        if (this.string && this.config.multiple) {
          this.vModel = this.$common.isEmpty(val) ? [] : val.split(this.split);
        } else if (!Array.isArray(val)) {
          this.vModel = this.$common.isEmpty(val) ? [] : Array.isArray(val) ? val : [val];
        } else {
          this.vModel = this.$common.isEmpty(val) ? [] : val;
        }
        if (!this.config.multiple) {
          this.vModel = this.vModel[0] ? [this.vModel[0]] : [];
        }
        if (this.config.multiple) {
          this.vModel.forEach((key:any) => {
            this.setChecked(key, true, !this.config['check-strictly']);
          });
          this.checkedNodeHand();
        }
      }
    },
    inputValue: {
      deep: true,
      handler (val) {
        this.filter(val);
      }
    },
    data: {
      deep: true,
      immediate: true,
      handler (val) {
        this.treeDataJson = {};
        this.initTreeData(val);
      }
    }
  },
  created () {},
  mounted () {
    // 弹出宽度设置
    this.$refs[`tag-${this.pageId}`] && (this.popoverWidth = this.$refs[`tag-${this.pageId}`].offsetWidth);
    if (this.config.multiple) {
      this.vModel.forEach((key:any) => {
        this.setChecked(key, true, !this.config['check-strictly']);
      })
      this.checkedNodeHand();
    }
  },
  methods: {
    initTreeData (arr = []) {
      arr.forEach(item => {
        this.treeDataJson[item[this.config.defaultProps.value||'value']] = item;
        if (!this.$common.isEmpty(item[this.config.defaultProps.children||'children'])) {
          this.initTreeData(item[this.config.defaultProps.children||'children']);
        }
      })
    },
    // 显示时触发
    popoverShow () {
      this.isShow = true;
      this.$emit('show');
    },
    // 显示动画播放完毕后触发
    afterEnter () {
      this.$emit('showAfter');
      this.$refs[`input-${this.pageId}`] && this.$refs[`input-${this.pageId}`].focus();
    },
    // 隐藏时触发
    popoverHide () {
      this.isShow = false;
      this.$emit('hide');
    },
    // 隐藏动画播放完毕后触发
    afterLeave () {
      // 获取焦点触发表单验证
      this.$nextTick(() => {
        this.$parent.$emit("el.form.blur");
        this.$emit('hideAfter');
      })
    },
    // 检索匹配方法
    filterNodeHand (value:string, data:any) {
      const isPass = this.filterNodeMethod(value, data);
      if (typeof isPass === 'boolean') return isPass;
      if (this.$common.isEmpty(value, true)) return true;
      if (this.$common.isEmpty(this.config.defaultProps.label)) return data.label.indexOf(value) !== -1;
      return data[this.config.defaultProps.label].indexOf(value) !== -1;
    },
    // 选择(单选时)
    nodeClick (node:any, data:any, event:any) {
      if (this.config.multiple) return;
      const newValue = this.$common.isEmpty(this.config.defaultProps.value) ? node[this.config.defaultProps.value] : node.value;
      this.vModel = [newValue];
      this.backArray ? this.$emit('update:modelValue', this.vModel) : this.$emit('update:modelValue', newValue);
    },
    // 点击节点复选框之后触发(多单选时)
    check (node:any) {
      if (!this.config.multiple) return;
      // 处理选择值
      this.checkedNodeHand();
    },
    hoverTree () {
      this.isHoverTree = true;
    },
    outTree () {
      this.isHoverTree = false;
    },
    // 清空
    clearTree () {
      if (!this.isHoverTree || this.vModel.length === 0) return;
      this.vModel.forEach((key:any) => {
        this.setChecked(key, false, !this.config['check-strictly']);
      })
      this.vModel = [];
      this.$emit('update:modelValue', this.config.multiple ? this.string ? '' : [] : '');
    },
    // 移除选项
    removeTag (key:any) {
      this.setChecked(key, false, !this.config['check-strictly']);
      // 处理选择值
      this.checkedNodeHand();
    },
    // 处理选择值
    checkedNodeHand () {
      this.$nextTick(() => {
        const checkNodes = this.getCheckedNodes();
        const valKey = this.config.defaultProps.value ? this.config.defaultProps.value : 'value';
        const childKey = this.config.defaultProps.children ? this.config.defaultProps.children : 'children';
        let checkKeys = this.getCheckedKeys();
        const handArr = (arr:Array<any>, isRemove = false) => {
          arr.forEach((item:any) => {
            if (checkKeys.includes(item[valKey]) && isRemove) {
              checkKeys.splice(checkKeys.indexOf(item[valKey]), 1);
            }
            this.$common.isArray(item[childKey]) && handArr(item[childKey], true);
          })
        }
        !this.config['check-strictly'] && handArr(checkNodes);
        this.vModel = checkKeys;
        if (JSON.stringify(this.modelValue) === JSON.stringify(this.vModel)) return;
        this.$emit('update:modelValue', this.string ? this.vModel.split(this.split) : this.vModel);
      })
    },


    // el-tree 的方法
    // 过滤所有树节点，过滤后的节点将被隐藏
    filter (val:any = null) {
      this.$refs[`tree-${this.pageId}`] && this.$refs[`tree-${this.pageId}`].filter(val);
    },
    // 为节点设置新数据，只有当设置 node-key 属性的时候才可用
    updateKeyChildren (key:any = null, data:any = null) {
      this.$refs[`tree-${this.pageId}`] && this.$refs[`tree-${this.pageId}`].updateKeyChildren(key, data);
    },
    // 如果节点可以被选中，(show-checkbox 为 true), 本方法将返回当前选中节点的数组
    getCheckedNodes (leafOnly:any = null, includeHalfChecked:any = null) {
      return this.$refs[`tree-${this.pageId}`] && this.$refs[`tree-${this.pageId}`].getCheckedNodes(leafOnly, includeHalfChecked);
    },
    // 设置目前勾选的节点，使用此方法必须提前设置 node-key 属性, 要选中的节点构成的数组
    setCheckedNodes (val:any = null) {
      this.$refs[`tree-${this.pageId}`] && this.$refs[`tree-${this.pageId}`].setCheckedNodes(val);
    },
    // 若节点可用被选中 (show-checkbox 为 true), 它将返回当前选中节点 key 的数组
    getCheckedKeys (leafOnly:any = null) {
      return this.$refs[`tree-${this.pageId}`] && this.$refs[`tree-${this.pageId}`].getCheckedKeys(leafOnly);
    },
    // 设置目前选中的节点，使用此方法必须设置 node-key 属性
    setCheckedKeys (keys:any = null, leafOnly:any = null) {
      return this.$refs[`tree-${this.pageId}`] && this.$refs[`tree-${this.pageId}`].setCheckedKeys(keys, leafOnly);
    },
    // 设置节点是否被选中, 使用此方法必须设置 node-key 属性
    setChecked (data:any = null, checked:any = null, deep:any = null) {
      this.$refs[`tree-${this.pageId}`] && this.$refs[`tree-${this.pageId}`].setChecked(data, checked, deep);
    },
    // 如果节点可用被选中 (show-checkbox 为 true), 它将返回当前半选中的节点组成的数组
    getHalfCheckedNodes () {
      return this.$refs[`tree-${this.pageId}`] && this.$refs[`tree-${this.pageId}`].getHalfCheckedNodes();
    },
    // 若节点可被选中(show-checkbox 为 true)，则返回目前半选中的节点的 key 所组成的数组
    getHalfCheckedKeys (val:any = null) {
      return this.$refs[`tree-${this.pageId}`] && this.$refs[`tree-${this.pageId}`].getHalfCheckedKeys(val);
    },
    // 返回当前被选中节点的数据 (如果没有则返回 null)
    getCurrentKey () {
      return this.$refs[`tree-${this.pageId}`] && this.$refs[`tree-${this.pageId}`].getCurrentKey();
    },
    // 返回当前被选中节点的数据 (如果没有则返回 null)
    getCurrentNode () {
      return this.$refs[`tree-${this.pageId}`] && this.$refs[`tree-${this.pageId}`].getCurrentNode();
    },
    // 通过 key 设置某个节点的当前选中状态，使用此方法必须设置 node-key  属性
    setCurrentKey (key:any = null, shouldAutoExpandParent = true) {
      this.$refs[`tree-${this.pageId}`] && this.$refs[`tree-${this.pageId}`].setCurrentKey(key, shouldAutoExpandParent);
    },
    // 设置节点为选中状态，使用此方法必须设置 node-key 属性
    setCurrentNode (node:any = null, shouldAutoExpandParent = true) {
      this.$refs[`tree-${this.pageId}`] && this.$refs[`tree-${this.pageId}`].setCurrentNode(node, shouldAutoExpandParent);
    },
    // 根据 data 或者 key 拿到 Tree 组件中的 node
    getNode (data:any = null) {
      return this.$refs[`tree-${this.pageId}`] && this.$refs[`tree-${this.pageId}`].getNode(data);
    },
    // 删除 Tree 中的一个节点，使用此方法必须设置 node-key 属性
    remove (data:any = null) {
      this.$refs[`tree-${this.pageId}`] && this.$refs[`tree-${this.pageId}`].remove(data);
    },
    // 为 Tree 中的一个节点追加一个子节点
    append (data:any = null, parentNode:any = null) {
      this.$refs[`tree-${this.pageId}`] && this.$refs[`tree-${this.pageId}`].append(data, parentNode);
    },
    // 在 Tree 中给定节点前插入一个节点
    insertBefore (data:any = null, refNode:any = null) {
      this.$refs[`tree-${this.pageId}`] && this.$refs[`tree-${this.pageId}`].insertBefore(data, refNode);
    },
    // 在 Tree 中给定节点后插入一个节点
    insertAfter (data:any = null, refNode:any = null) {
      this.$refs[`tree-${this.pageId}`] && this.$refs[`tree-${this.pageId}`].insertAfter(data, refNode);
    }
  }
};
</script>
<style lang="less">
@lineHeight: 32px;
.dty-tree-demo {
  position: relative;
  width: 100%;
  cursor: pointer;
  // &.tree-demo-hover{}
  .dyt-tree-content{
    position: relative;
    display: flex;
    width: 100%;
    // min-width: 200px;
    min-height: @lineHeight;
    line-height: 1em;
    -webkit-appearance: none;
    border: 1px solid #DCDFE6;
    box-sizing: border-box;
    color: #606266;
    font-size: inherit;
    background-color: #FFF;
    background-image: none;
    border-radius: 4px;
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    &.content-active{
      border-color: var(--el-input-focus-border,var(--el-color-primary));
    }
    .tree-content-value{
      display: flex;
      flex: 100;
      padding: 0 25px 0 11px;
      line-height: calc(@lineHeight - 2px);
      overflow: hidden;
    }
    .tree-content-multiple{
      .tree-tag-content{
        display: flex;
        flex: 100;
        // height: calc(@lineHeight - 6px);
        .tree-tag-item{
          display: flex;
          padding: 0 0 0 10px;
          margin: 3px 6px 3px 0;
          line-height: calc(@lineHeight - 12px);
          border-radius: 3px;
        }
      }
      &.tree-content-limit{
        .tree-tag-content{
          .tree-tag-item{
            flex: 100;
            // max-width: calc(100% - 75px);
            background: #f4f4f5;
            border: 1px solid #e9e9eb;
            color: #909399;
            &:hover{
              color: #909399;
            }
            .tag-item-text{
              flex: 100;
              display: inline-block;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }
            .tag-item-close{
              position: relative;
              width: 20px;
              .el-icon{
                position: absolute;
                top: 50%;
                left: 50%;
                border-radius: 100%;
                transform: translate(-50%, -50%);
              }
              &:hover{
                .el-icon{
                  color: #fff;
                  background-color: #909399;
                }
              }
              // .el-icon{}
            }
          }
        }
      }
    }
    
    .suffix-inner{
      display: inline-flex;
      position: absolute;
      height: 100%;
      right: 0;
      top: 0;
      padding-right: 10px;
      text-align: center;
      color: var(--el-input-icon-color,var(--el-text-color-placeholder));
      transition: all var(--el-transition-duration);
      // pointer-events: none;
      .el-icon{
        height: calc(100% - 2px);
      }
    }
  }
  
}
.tree-popper-content{
  .el-tree-node__content>.el-tree-node__expand-icon{
    padding: 3px;
    font-size: 18px;
  }
}
</style>
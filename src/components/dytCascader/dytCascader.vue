<template>
  <el-cascader :ref="pageId" v-bind="selectConfig" class="dyt-cascader-demo">
    <template v-if="slots.includes('default')" v-slot="scope">
      <slot v-bind="scope">
        <span>{{ scope.data.label }}</span>
        <span v-if="!scope.node.isLeaf"> ({{ scope.data.children.length }})</span>
      </slot>
    </template>
    <template v-for="tSlot in slots.filter(it => !unSlots.includes(it))" v-slot:[tSlot]="scope">
      <slot :name="tSlot" v-bind="scope" />
    </template>
  </el-cascader>
</template>
<script lang="ts">

export default {
  name: 'DytCascader',
  isGlobal: true,
  components: {},
  props: {},
  data() {
    return {
      unSlots: ['default'],
      pageId: Math.random().toString(36).substr(2)
    }
  },
  computed: {
    slots () {
      return Object.keys(this.$slots)
    },
    selectConfig () {
      let config = {
        ...{
          disabled: false,
          readonly: false,
          size: 'default',
          clearable: true,
          placeholder: '请选择'
        },
        ...this.$attrs
      };
      config['popper-class'] = `dyt-cascader-popper-${this.pageId}${this.$common.isEmpty(config['popper-class'])?'':` ${config['popper-class']}`}`;
      if (config.disabled || config.readonly) {
        config.placeholder = '';
      }
      return config;
    }
  },
  watch: {},
  created () {},
  mounted () {
    // 设置弹窗宽度
    // const popper:any = document.querySelector(`.dyt-cascader-popper-${this.pageId}`);
    // popper.style.width = this.$common.getElementStyle(this.$refs[this.pageId].$el.parentNode, 'width');
  },
  methods: {
    // 获取选中的节点
    getCheckedNodes (leafOnly:boolean = false) {
      this.$refs[`${this.pageId}`].getCheckedNodes(leafOnly);
    }
  }
};
</script>
<style lang="less">
.dyt-cascader-demo.el-cascader{
  display: inline-block;
  width: 100%;
}
</style>

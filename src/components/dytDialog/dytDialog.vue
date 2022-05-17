<template>
  <el-dialog
    v-bind="selectConfig"
    :title="title"
    :custom-class="customClassName"
    :top="marginTop"
  >
    <slot />
    <template v-for="tSlot in slots.keys.filter(slot => slot !== 'default')" v-slot:[tSlot]>
      <slot :name="tSlot" />
    </template>
  </el-dialog>
</template>
<script>
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'DytDialog',
  components: {},
  props: {
    // 标题
    title: { type: String, default: ''},
    // 离顶部距离
    top: { type: [String, Number], default: '' },
    // 自定义样式
    customClass: { type: String, default: '' },
    // 可选值 full medium small mini
    size: { type: String, default: 'small' },
    // 是否设置固定内容高度
    fixedHeight: { type: Boolean, default: false }
  },
  data () {
    return {
      // pageId: Math.random().toString(36).substr(2),
      sizeClass: {
        full: 'dialog-custom-class-full',
        medium: 'dialog-custom-class-medium',
        small: 'dialog-custom-class-small',
        mini: 'dialog-custom-class-mini'
      },
      defaultConfig: {
        'append-to-body': true,
        'close-on-click-modal': false,
        'close-on-press-escape': false
      }
    }
  },
  computed: {
    slots () {
      return {
        keys: Object.keys(this.$slots),
        value: Object.values(this.$slots)
      }
    },
    selectConfig () {
      let config = { ...this.defaultConfig, ...this.$attrs };
      if (config.disabled || config.readonly) {
        config.placeholder = '';
      }
      return config;
    },
    marginTop () {
      const marginTop = {
        full: typeof this.top === 'number' ? `${this.top || 0}px` : this.top || '0px',
        medium: typeof this.top === 'number' ? `${this.top || 50}px` : this.top || '5vh',
        small: typeof this.top === 'number' ? `${this.top || 50}px` : this.top || '15vh',
        mini: typeof this.top === 'number' ? `${this.top || 50}px` : this.top || '20vh'
      }
      return marginTop[this.size];
    },
    customClassName () {
      return `dialog-custom-class${this.fixedHeight ? ' custom-fixed-height' : ''} ${this.sizeClass[this.size]}${this.customClass ? ` ${this.customClass}` : ''}`;
    }
  },
  watch: {},
  created () {},
  mounted () {},
  methods: {}
});
</script>
<style lang="less">
@headDefaultH: 40px;
@headFullH: 50px;
.customfixedheight(@height: calc(70 - 90px)){
  &.custom-fixed-height{
    .el-dialog__body{
      height: @height;
    }
  }
}
.elDialogHeaderbtn(@height: 50px, @width: 50px){
  .el-dialog__headerbtn{
    top: 0;
    right: 0;
    height: @height;
    width: @width;
    font-size: 20px;
  }
}
.el-dialog__wrapper{
  position: fixed !important;
}
.dialog-custom-class{
  &.el-dialog{
    margin: 0 auto;
    min-width: 400px;
    overflow: hidden;
    .el-dialog__header{
      position: relative;
      padding: 0;
      height: @headDefaultH;
      margin-right: 0;
      box-shadow: 0 0 5px 1px var(--layout-shadow-color), 0 1px 5px 0 var(--layout-shadow-color);
      .el-dialog__title{
        display: inline-block;
        padding-left: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .el-dialog__body{
      position: relative;
      padding: 15px;
      min-height: 100px;
      overflow: auto;
    }
    .el-dialog__footer{
      position: relative;
      box-shadow: 0 0 5px 1px var(--layout-shadow-color), 0 1px 5px 0 var(--layout-shadow-color);
    }
    .elDialogHeaderbtn(@headDefaultH, @headDefaultH);
    &.dialog-custom-class-small{
      width: 80%;
      margin-top: 15vh;
      .el-dialog__header{
        height: @headDefaultH;
        .el-dialog__title{
          width: calc(100% - @headDefaultH);
          line-height: @headDefaultH;
        }
      }
      .el-dialog__body{
        max-height: calc(70vh - 90px);
      }
      .el-dialog__footer{
        padding: 10px 10px 5px 10px;
      }
      .elDialogHeaderbtn(@headDefaultH, @headDefaultH);
      .customfixedheight(calc(70vh - 90px));
    }
    &.dialog-custom-class-full{
      width: 100%;
      margin-top: 0vh;
      .el-dialog__header{
        height: @headFullH;
        .el-dialog__title{
          width: calc(100% - @headFullH);
          line-height: @headFullH;
        }
      }
      .el-dialog__body{
        max-height: calc(100vh - 110px);
      }
      .el-dialog__footer{
        padding: 15px 15px 10px 15px;
      }
      .elDialogHeaderbtn(@headFullH, @headFullH);
      .customfixedheight(calc(100vh - 110px));
    }
    &.dialog-custom-class-medium{
      width: 90%;
      margin-top: 5vh;
      .el-dialog__header{
        height: @headDefaultH;
        .el-dialog__title{
          width: calc(100% - @headDefaultH);
          line-height: @headDefaultH;
        }
      }
      .el-dialog__body{
        max-height: calc(90vh - 90px);
      }
      .el-dialog__footer{
        padding: 10px 10px 5px 10px;
      }
      .elDialogHeaderbtn(@headDefaultH, @headDefaultH);
      .customfixedheight(calc(90vh - 90px));
    }
    &.dialog-custom-class-mini{
      width: 65%;
      margin-top: 22vh;
      .el-dialog__header{
        height: @headDefaultH;
        .el-dialog__title{
          width: calc(100% - @headDefaultH);
          line-height: @headDefaultH;
        }
      }
      .el-dialog__body{
        max-height: calc(56vh - 90px);
      }
      .el-dialog__footer{
        padding: 10px 10px 5px 10px;
      }
      .elDialogHeaderbtn(@headDefaultH, @headDefaultH);
      .customfixedheight(calc(56vh - 90px));
    }
  }
}
</style>

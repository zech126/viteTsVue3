<template>
  <el-dialog
    v-bind="selectConfig"
    :title="props.title"
    :class="customClassName"
    :top="marginTop"
  >
    <slot />
    <template v-for="tSlot in slots.keys.filter(slot => slot !== 'default')" v-slot:[tSlot]>
      <slot :name="tSlot" />
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
// import getGlobal from '@/utils/global';
import { reactive, computed, useSlots, useAttrs } from 'vue';

// const global = getGlobal();
// const proxy = getProxy();
const $slots = useSlots();
const $attrs = useAttrs();
const props = defineProps({
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
});

const data = reactive({
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
})

const slots = computed(() => {
  return {
    keys: Object.keys($slots),
    value: Object.values($slots)
  }
})

const selectConfig = computed(() => {
  let config = { ...data.defaultConfig, ...$attrs };
    return config;
})

const marginTop = computed(() => {
  const topJson = {
      full: typeof props.top === 'number' ? `${props.top || 0}px` : props.top || '0px',
      medium: typeof props.top === 'number' ? `${props.top || 50}px` : props.top || '5vh',
      small: typeof props.top === 'number' ? `${props.top || 50}px` : props.top || '15vh',
      mini: typeof props.top === 'number' ? `${props.top || 50}px` : props.top || '20vh'
    }
    return topJson[props.size];
})

const customClassName = computed(() => {
  return `dialog-custom-class${props.fixedHeight ? ' custom-fixed-height' : ''} ${data.sizeClass[props.size]}${props.customClass ? ` ${props.customClass}` : ''}`;
})

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
      --el-dialog-width: 80%;
      width: var(--el-dialog-width);
      margin-top: var(--el-dialog-margin-top, 15vh);
      .el-dialog__header{
        height: @headDefaultH;
        .el-dialog__title{
          width: calc(100% - @headDefaultH);
          line-height: @headDefaultH;
        }
      }
      .el-dialog__body{
        max-height:calc(100vh - var(--el-dialog-margin-top, 15vh) * 2 - 90px);
      }
      .el-dialog__footer{
        padding: 10px 10px 5px 10px;
      }
      .elDialogHeaderbtn(@headDefaultH, @headDefaultH);
      .customfixedheight(calc(70vh - 90px));
    }
    &.dialog-custom-class-full{
      --el-dialog-width: 100%;
      width: var(--el-dialog-width);
      margin-top: var(--el-dialog-margin-top, 0);
      .el-dialog__header{
        height: @headFullH;
        .el-dialog__title{
          width: calc(100% - @headFullH);
          line-height: @headFullH;
        }
      }
      .el-dialog__body{
        max-height:calc(100vh - var(--el-dialog-margin-top, 0) * 2 - 110px);
      }
      .el-dialog__footer{
        padding: 15px 15px 10px 15px;
      }
      .elDialogHeaderbtn(@headFullH, @headFullH);
      .customfixedheight(calc(100vh - 110px));
    }
    &.dialog-custom-class-medium{
      --el-dialog-width: 90%;
      width: var(--el-dialog-width);
      margin-top: var(--el-dialog-margin-top, 5vh);
      .el-dialog__header{
        height: @headDefaultH;
        .el-dialog__title{
          width: calc(100% - @headDefaultH);
          line-height: @headDefaultH;
        }
      }
      .el-dialog__body{
        max-height:calc(100vh - var(--el-dialog-margin-top, 5vh) * 2 - 90px);
      }
      .el-dialog__footer{
        padding: 10px 10px 5px 10px;
      }
      .elDialogHeaderbtn(@headDefaultH, @headDefaultH);
      .customfixedheight(calc(90vh - 90px));
    }
    &.dialog-custom-class-mini{
      --el-dialog-width: 65%;
      width: var(--el-dialog-width);
      margin-top: var(--el-dialog-margin-top, 22vh);
      .el-dialog__header{
        height: @headDefaultH;
        .el-dialog__title{
          width: calc(100% - @headDefaultH);
          line-height: @headDefaultH;
        }
      }
      .el-dialog__body{
        max-height:calc(100vh - var(--el-dialog-margin-top, 22vh) * 2 - 90px);
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

<template>
  <el-image
    ref="dytImageRef"
    v-bind="selectConfig"
    class="dyt-image-demo"
  >
    <template #error>
      <slot name="error">
        <div class="image-slot" title="加载失败">
          <Icon name="picture" /> 加载失败
        </div>
      </slot>
    </template>
    <template v-for="tSlot in slots.filter((slot:any) => !unSlots.includes(slot))" v-slot:[tSlot]>
      <slot :name="tSlot" />
    </template>
  </el-image>
</template>
<script lang="ts" setup>
import {computed, useSlots, useAttrs, PropType} from 'vue';
// import getProxy from "@/utils/proxy";
// const proxy = getProxy();
const unSlots = ['error'];
const slots = computed(() => Object.keys(useSlots()));
// 开启图片预览功能
const props = defineProps({
  // 默认下拉数据
  previewSrcList: { type: Array as PropType<string[]>, default: () => {return []} },
  // 当 previewSrcList 为空是否关闭预览
  closePreview: { type: Boolean, default: false },
  // 图片路径
  src: { type: String, default: '' },
  url: { type: String, default: '' }
});
const selectConfig = computed(() => {
  let config = {
    ...{
      'preview-teleported': true,
      'preview-src-list': props.previewSrcList.length == 0 ? (props.closePreview ? [] : [props.src || props.url]) : props.previewSrcList,
      lazy: true
    },
    src: props.src || props.url,
    ...useAttrs()
  };
  return config;
});
</script>
<style lang="less" scoped>
.dyt-image-demo{
  .image-slot{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: var(--el-fill-color-light);
    color: var(--el-text-color-secondary);
    .el-icon {
      margin-right: 10px;
      font-size: 30px;
    }
  }
}
</style>

<template>
  <div class="dyt-image-view">
    <el-image
      class="thumbnail-image"
      ref="dytImageRef"
      :src="data.previewUrl"
      :preview-src-list="data.previewList"
      :initial-index="data.previewIndex"
      :z-index="9999999999999"
      :preview-teleported="true"
      fit="cover"
    />
  </div>
</template>
<script lang="ts" setup>
import { reactive, computed, nextTick, onBeforeUnmount, onMounted, PropType} from 'vue';
import getProxy from "@/utils/proxy";
const proxy = getProxy();
// 开启图片预览功能
const props = defineProps({
  // 目标容器
  targetContainer: { type: [String, Element] },
  // 禁用标识
  disabledAttr: { type: [Array, String] as PropType<string | string[]>, default: 'view-disabled' }
});

const data:{
  previewList: Array<string>,
  imageDemo: Array<Element>,
  previewUrl: string,
  previewIndex: number
} = reactive({
  previewList: [],
  imageDemo: [],
  previewUrl: '',
  previewIndex: 0
});

const disabledAttr = computed(() => {
  return typeof props.disabledAttr === 'string' ? [props.disabledAttr] : props.disabledAttr;
});

const getTargetContainer = (targetContainer:string | Element = '') => {
  let imgList:Array<Element> = [];
  if (!targetContainer) return []
  let container:Array<Element> = [];
  if (typeof targetContainer === 'string') {
    // 转成 Array 类型
    container = [].slice.call(document.querySelectorAll(targetContainer));
  } else {
    container = targetContainer ? [targetContainer] : [];
  }
  container.forEach(demo => {
    imgList = [...imgList, ...[].slice.call(demo.querySelectorAll('img'))];
  });
  return imgList;
};
// 初始化数据
const initImageView = () => {
  removeEvent();
  nextTick(() => {
    let index = 0;
    data.imageDemo = getTargetContainer(props.targetContainer).filter(demo => {
      const includeAttr =  disabledAttr.value.map(attr => demo.getAttribute(attr)).filter(attr => attr && disabledAttr.value.includes(attr));
      return includeAttr.length === 0;
    });
    data.imageDemo.forEach((img:any) => {
      // 绑定监听事件
      if (!img.src.includes('/dialogs/attachment/') && !img.src.includes('/themes/default/')) {
        img.setAttribute('dyt-image-list-index', index);
        img.addEventListener('click', imageClickHand);
        index++;
      }
    });
    data.previewList = data.imageDemo.map((img:any) => img.src).filter(src => {
      return !!src && !src.includes('/dialogs/attachment/') && !src.includes('/themes/default/')
    });
    if (data.previewList.length > 0) {
      data.previewUrl = data.previewList[0];
    }
  });
}
// 点击图片
const imageClickHand  = (event:{[key:string]: any}) => {
  const target:any = event.target || event.srcElement;
  const index = target.getAttribute('dyt-image-list-index');
  data.previewIndex = index ? Number(index) : 0;
  nextTick(() => {
    if (proxy.$refs['dytImageRef'] && proxy.$refs['dytImageRef'].$el) {
      const image = proxy.$refs['dytImageRef'].$el.querySelector('img');
      image && image.click();
    }
  })
}
// 解除绑定事件
const removeEvent = () => {
  data.imageDemo.forEach((img:any) => {
    // 绑定监听事件
    if (!img.src.includes('/dialogs/attachment/')) {
      img.removeAttribute('dyt-image-list-index');
      img.removeEventListener('click', imageClickHand);
    }
  });
  data.previewList = [];
  data.imageDemo = [];
  data.previewUrl = '';
  data.previewIndex = 0;
}
onMounted(() => {
  initImageView();
});
// 组件销毁前
onBeforeUnmount(() => {
  removeEvent();
});
// 导出方法
defineExpose({
  initImageView
});

</script>
<style lang="less" scoped>
.dyt-image-view{
  height: 0px;
  width: 0px;
  .thumbnail-image{
    height: 0px;
    width: 0px;
    overflow: hidden;
    :deep(img){
      opacity: 0;
    }
    :deep(.el-image__error){
      opacity: 0;
    }
  }
}
</style>
<style lang="less">
  [dyt-image-list-index] {
    cursor: pointer;
  }
</style>


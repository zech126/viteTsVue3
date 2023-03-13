<template>
  <div style="padding: 60px" id="html2canvas">
    <div style="padding-bottom: 10px;">将图片拖拽到下面</div>
    <el-upload
      ref="uploadRef"
      class="upload-demo"
      action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
      :auto-upload="false"
      :multiple="true"
      :drag="true"
      :on-change="fileChange"
    />
  </div>
  <div id="image" />
</template>

<script lang="ts" setup>
import html2canvas from 'html2canvas';
import { onMounted } from 'vue';
// import { onBeforeUnmount } from 'vue';
// import getGlobal from "@/utils/global";
// const global = getGlobal();

const fileChange = (val:any) => {
  console.log(val.raw)
}
onMounted(() => {
  const demo = document.querySelector('#html2canvas') as HTMLElement;
  html2canvas(demo).then((canvas) => {
    // console.log(canvas.toDataURL());
    const demo = document.querySelector('#image') as HTMLElement;
    demo.appendChild(canvas);
  });
})

</script>

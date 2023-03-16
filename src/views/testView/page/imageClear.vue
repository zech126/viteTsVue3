<template>
  <div class="html2canvas">
    <div style="margin-bottom: 15px; text-align:right;">
      <el-button @click="clearImage">清 空</el-button>
      <el-button type="primary" @click="downImage" :disabled="obj.loading || obj.fileLlist.length <= 0">
        {{ obj.loading ? `已处理(${obj.percent}%)...` : '转换图片' }}
      </el-button>
    </div>
    <div style="padding-bottom: 10px;">将图片拖拽到下面</div>
    <el-upload
      ref="uploadRef"
      class="upload-demo"
      action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
      :auto-upload="false"
      :multiple="true"
      :drag="true"
      :show-file-list="true"
      v-model:file-list="obj.fileLlist"
    >
      <Icon class="el-icon--upload" name="upload-filled" />
      <div class="el-upload__text">
        <em>将图片拖拽到此处或点击此处</em>
      </div>
    </el-upload>
    <canvas class="page-canvas" id="page-canvas" />
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import getGlobal from "@/utils/global";
const global = getGlobal();

const obj = reactive({
  times: 30, // 像素放到倍数
  maxDpr: 9000,
  fileLlist: [],
  loading: false,
  percent: 0
});
const clearImage = () => {
  obj.fileLlist = [];
}

const downImage = () => {
  obj.loading = true;
  let awaitList:Array<any> = [];
  (obj.fileLlist || []).forEach((item:{raw: File, [key:string]:any}) => {
    awaitList.push(() => {
      return handeImage(item.raw);
    })
  });

  global.$common.allSettled(awaitList, {
    limit: 1,
    progress: (percent) => {
      obj.percent = percent;
    }
  }).then(res => {
    (res || []).forEach(file => {
      if (!global.$common.isEmpty(file) && file.status === 'fulfilled') {
        global.$common.downloadFile(file.value);
      }
    });
    obj.loading = false;
    clearImage();
  })
}
let img = new Image();
const handeImage = (image:File) => {
  return new Promise((reslove) => {
    global.$common.fileToBase64(image).then((res) => {
      img.onload = () => {
        const canvas = document.querySelector('#page-canvas') as HTMLCanvasElement;
        const width = img.naturalWidth * obj.times;
        canvas.width = width > obj.maxDpr ? obj.maxDpr : width;
        canvas.height = img.naturalHeight * (canvas.width / img.naturalWidth);
        canvas.style.width = `${img.naturalWidth}px`;
        canvas.style.height = `${img.naturalHeight}px`;
        let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        reslove(canvas.toDataURL("image/jpg"));
      }
      img.src = res;
    })
  })
}
</script>
<style lang="less" scoped>
.html2canvas{
  position: relative;
  padding: 60px;
}
.page-canvas{
  display: none;
}
</style>

<template>
  <div class="html2canvas">
    <div style="margin-bottom: 15px; text-align:right;">
      <el-button @click="clearImage">移除所有图片</el-button>
      <el-button type="primary" @click="openDialog" :disabled="obj.loading || obj.fileLlist.length <= 0">
        {{ obj.loading ? `已处理(${obj.percent}%)...` : '压缩图片' }}
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
      accept="image/*"
      list-type="picture"
      :show-file-list="true"
      v-model:file-list="obj.fileLlist"
    >
      <Icon class="el-icon--upload" name="upload-filled" />
      <div class="el-upload__text">
        <em>将图片拖拽到此处或点击此处</em>
      </div>
    </el-upload>
    <canvas class="page-canvas" id="page-canvas" />
    <el-dialog
      title="图片压缩比例"
      v-model="obj.dialogVisible"
      width="600px"
    >
      <div v-loading="obj.loading">
        <el-form
          ref="filterForm"
          :inline="true"
          :model="obj.formData"
          :rules="(obj.validRules || {})"
          class="dyt-filter-form"
          :label-width="100"
          @submit.prevent
        >
          <el-form-item prop="quality" label="" style="width: 100%;" :label-width="0">
            <el-slider v-model="obj.formData.quality" :min="0.1" :step="0.1" :max="99.9" />
            <div>压缩比例：{{ obj.formData.quality }}%</div>
          </el-form-item>
        </el-form>
      </div>
      <template v-slot:footer>
        <el-button @click="obj.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="downImage" :disabled="obj.loading">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import getGlobal from "@/utils/global";
import JSZip from 'jszip';
const global = getGlobal();

const obj = reactive({
  fileLlist: [],
  loading: false,
  percent: 0,
  dialogVisible: false,
  formData: {
    quality: 50,
  },
  validRules: {}
});
const clearImage = () => {
  obj.fileLlist = [];
  obj.dialogVisible = false;
  obj.formData.quality = 50;
  obj.loading = false;
}

const openDialog = () => {
  obj.dialogVisible = true;
}

const downImage = () => {
  obj.loading = true;
  let awaitList:Array<any> = [];
  (obj.fileLlist || []).forEach((item:{raw: File, [key:string]:any}) => {
    awaitList.push(() => {
      return handeImage(item.raw, 1 - (obj.formData.quality / 100));
    })
  });
  // 图片处理完成后
  global.$common.allSettled(awaitList, {
    limit: 1,
    progress: (percent) => {
      obj.percent = percent;
    }
  }).then(res => {
    // 创建一个新的 JSZip 实例
    const createZip = new JSZip();
    let nameObj:{[key:string]:Array<string>} = {};
    let newName = '';
    let suffix = '';
    (res || []).forEach((fileConfig, index) => {
      if (!global.$common.isEmpty(fileConfig) && fileConfig.status === 'fulfilled') {
        if (!global.$common.isEmpty(fileConfig.value.imgData)) {
          // global.$common.downloadFile(fileConfig.value.imgData, {name: fileConfig.value.name}); // 直接下载单张图片
          // 将图片添加到ZIP中 
          if (global.$common.isEmpty(nameObj[fileConfig.value.name])) {
            createZip.file(fileConfig.value.name, fileConfig.value.imgData);
            nameObj[fileConfig.value.name] = [fileConfig.value.name];
          } else {
            // 重名文件处理
            suffix = fileConfig.value.name.substring(fileConfig.value.name.lastIndexOf('.'), fileConfig.value.name.length);
            newName = `${fileConfig.value.name.substring(0, fileConfig.value.name.lastIndexOf('.'))}-(${nameObj[fileConfig.value.name].length})${suffix}`;
            createZip.file(newName, fileConfig.value.imgData);
            nameObj[fileConfig.value.name].push(newName);
          }
        } else {
          console.warn(`图片：${fileConfig.value.name} 压缩失败`);
        }
      }
    });
    // 生成 ZIP 文件并下载
    createZip.generateAsync({type: "blob"}).then((content) => {
      // 创建一个URL指向ZIP文件，并触发下载
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'images.zip'; // 设置下载文件名
      document.body.append(a);
      setTimeout(() => {
        a.click();
        setTimeout(() => {
          a.remove();
          // 释放缓存
          window.URL.revokeObjectURL(url);
        }, 100)
      }, 50)
    });
    clearImage();
  }).catch(() => {
    obj.loading = false;
    console.warn('压缩图片失败');
  })
}
// 对图片处理
const handeImage = (image:File, quality?:number) => {
  return new Promise((reslove) => {
    global.$common.fileToBase64(image).then((res) => {
      global.$common.reduceImage({
        imgRes: res,
        quality: quality,
        imgFile: image
      }).then(imgInfo => {
        reslove(imgInfo);
      });
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

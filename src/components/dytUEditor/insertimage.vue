<template>
  <dyt-dialog
    size="medium"
    v-model="data.dialogVisible"
    title="多图上传"
    :fixed-height="false"
    @closed="closeDrawer"
    custom-class="insert-image-dialog"
  >
    <div v-loading="data.pageLoading" class="add-edit-content">
      <div
        class="avatar-uploader-image"
        v-for="(img, index) in data.fileInfoList"
        :key="index"
        v-loading="img.loading"
        :element-loading-text="`${img.upload ? '上传中...' : ''}`"
      >
        <img v-if="img.url" :src="img.url" class="image-view" />
        <div class="image-btn" v-if="!img.loading">
          <Icon v-if="!img.error" name="View" title="查看" class="btn-icon" @click="imageView(img)" />
          <el-image
            class="ueditor-image-view"
            :src="img.url"
            :preview-src-list="data.imagePreview"
            :initial-index="data.imageIndex"
            fit="cover"
            loading="lazy"
            :preview-teleported="true"
            @error="imageError($event, img)"
          />
          <Icon
            v-if="typeof data.temporaryStorage.removeFiles === 'function'"
            class="btn-icon"
            name="Delete"
            title="移除"
            @click="removeFiles(img, index)"
          />
          <Icon
            v-if="typeof data.temporaryStorage.uploadFiles === 'function' && !!img.uploadFail"
            class="btn-icon"
            name="UploadFilled"
            title="重新上传"
            @click="beforeUpload(img.insertImageTemporaryId)"
          />
        </div>
        <div v-if="!img.error && !img.loading" class="image-checked" :class="{'checked-item': img.checked}" @click="checkImage(img, index)">
          <Icon v-if="img.checked" name="Select" title="选中" />
        </div>
        <div v-if="!!img.removeFail || !!img.uploadFail" class="image-remove-fail" :title="img.removeFail || img.uploadFail">
          {{ img.removeFail || img.uploadFail }}
        </div>
      </div>
      <el-upload
        v-if="typeof data.temporaryStorage.uploadFiles === 'function'"
        class="upload-demo"
        action=""
        multiple
        :show-file-list="false"
        :drag="true"
        :file-list="data.uploadFileList"
        :before-upload="beforeUpload"
      >
        <Icon name="Plus" class="avatar-uploader-icon" />
      </el-upload>
      <div v-if="isContent">
        暂时无数据！
      </div>
    </div>
    <template v-slot:footer>
      <div class="foolter-button">
        <dyt-button
          type="primary"
          :disabled="data.checkList.length === 0 || data.pageLoading"
          @click="confirm"
        >
          确 定
        </dyt-button>
        <dyt-button
          @click="closeDrawer"
        >
          关 闭
        </dyt-button>
      </div>
    </template>
  </dyt-dialog>
</template>

<script lang="ts" setup>
import { reactive, watch, computed, nextTick} from 'vue';
import { parents } from './tool';
import getGlobal from '@/utils/global';
import { debounce } from '@/utils/debounce';

const global = getGlobal();
const emit = defineEmits(['update:visible']);
const props = defineProps({
  editor: { type: Object },
  visible: { type: Boolean, default: false }
});

const data:{[key:string]:any} = reactive({
  fileInfoList: [],
  uploadFileList: [],
  dialogVisible: false,
  pageLoading: false,
  checkList: [],
  temporaryStorage: {},
  unqualifiedFile: [],
  uploadFailJson: {},
  imagePreview: [],
  imageIndex: 0,
  romveError: {}
});
const isVisible = computed(() => {
  return props.visible;
});
const editor:{[key: string]: any} = computed(() => {
  return props.editor;
});
const isContent = computed(() => {
  return !data.pageLoading && data.fileInfoList.length === 0 && typeof data.temporaryStorage.uploadFiles !== 'function';
});

// 初始化数据
const initData = () => {
  if (global.$common.isEmpty(editor.value)) return;
  const editorid = parents(editor.value.container, '[editorid]').getAttribute('editorid');
  const random = (new Date().getTime()).toString(36);
  data.temporaryStorage = window.temporaryStorage[editorid];
  data.pageLoading = true;
  // 获取文件列表
  data.temporaryStorage.getFiles().then((res:Array<string | {[key:string]: any}>) => {
    data.pageLoading = false;
    data.fileInfoList = res.map((item) => {
      return {
        loading: false,
        error: false,
        checked: false,
        upload: false,
        insertImageTemporaryId: `${random}_${Math.random().toString(36).substring(2)}`,
        ...(typeof item === 'string' ? { url: item } : item)
      }
    })
  }).catch(() => {
    data.pageLoading = false;
  });
};
// 上传
const beforeUpload = (rawFile:{[key:string]: any} | string) => {
  let newFile:any = rawFile;
  let imageId = `${(new Date().getTime()).toString(36)}_${Math.random().toString(36).substring(2)}`;
  if (typeof rawFile === 'string') {
    imageId = rawFile;
    newFile = data.uploadFailJson[imageId];
    data.fileInfoList.forEach((item:{[key:string]: any}) => {
      if (item.insertImageTemporaryId === imageId) {
        item.loading = true;
        item.upload = true;
        delete item.uploadFail;
      }
    })
  }
  const filetype = /image\/\w+/i.test(newFile.type) ? 'image':'file';
  if (filetype !== 'image') {
    data.unqualifiedFile.push(newFile);
    return false;
  }

  !data.uploadFailJson[imageId] && data.fileInfoList.push({
    loading: true,
    error: false,
    checked: false,
    upload: true,
    insertImageTemporaryId: imageId
  });

  // 执行上传方法
  data.temporaryStorage.uploadFiles(newFile).then((res:{url: string, [key:string]:any} | string) => {
    data.fileInfoList.forEach((item:{[key:string]: any}, index:number) => {
      if (item.insertImageTemporaryId === imageId) {
        data.fileInfoList[index] = { ...item, error: false, loading: false, upload: false, ...(typeof res !== 'string' ? res : {url: res})};
      }
    });
    if (data.uploadFailJson[imageId]) {
      delete data.uploadFailJson[imageId];
    }
  }).catch((msg:string) => {
    if (!data.uploadFailJson[imageId]) {
      data.uploadFailJson[imageId] = newFile;
    }
    data.fileInfoList.forEach((item:{[key:string]: any}, index:number) => {
      if (item.insertImageTemporaryId === imageId) {
        data.fileInfoList[index] = {
          ...item,
          loading: false,
          upload: false,
          error: true,
          url: 'insertimage-image-error.png',
          uploadFail: msg || '上传失败'
        };
      }
    })
  })
  return false;
}
// 移除文件
const removeFiles = (image:{[key:string]: any}, index:number) => {
  if (!!image.uploadFail) {
    data.fileInfoList = data.fileInfoList.filter((item:{[key:string]: any}) => {
      return image.insertImageTemporaryId !== item.insertImageTemporaryId;
    });
    return;
  }
  let backVal = global.$common.copy(image);
  const removeKey = ['loading', 'error', 'checked', 'insertImageTemporaryId', 'upload', 'removeFail', 'uploadFail'];
  image.loading = true;
  removeKey.forEach(key => {
    delete backVal[key];
  });
  if (data.romveError[image.insertImageTemporaryId]) {
    delete image.removeFail;
    clearTimeout(data.romveError[image.insertImageTemporaryId]);
  }
  data.temporaryStorage.removeFiles(backVal).then((res:boolean) => {
    image.loading = false;
    if (!res) return;
    data.fileInfoList = data.fileInfoList.filter((item:{[key:string]: any}) => {
      return image.insertImageTemporaryId !== item.insertImageTemporaryId;
    });
    data.checkList = data.checkList.filter((img:{[key:string]: any}) => {
      return image.insertImageTemporaryId !== img.insertImageTemporaryId;
    });
  }).catch((msg:string) => {
    data.fileInfoList.forEach((item:{[key:string]: any}, index:number) => {
      if (item.insertImageTemporaryId === image.insertImageTemporaryId) {
        item.removeFail = msg || '删除失败';
      }
    });
    data.romveError[image.insertImageTemporaryId] = setTimeout(() => {
      data.fileInfoList.forEach((item:{[key:string]: any}, index:number) => {
        if (item.insertImageTemporaryId === image.insertImageTemporaryId) {
          delete item.removeFail;
        }
      });
    }, 3000);
    image.loading = false;
  })
}
// 触发图片查看
const imageView = (image:{[key:string]: any}) => {
  const imagePreview = data.fileInfoList.filter((fil:any) => !fil.error);
  const imageKey = imagePreview.map((ima:{[key:string]: any}) => ima.insertImageTemporaryId);
  data.imageIndex = imageKey.indexOf(image.insertImageTemporaryId) || 0;
  data.imagePreview = imagePreview.map((item:any) => item.url);
  nextTick(() => {
    const viewELe:any = document.querySelector('.image-btn .el-image.ueditor-image-view img');
    viewELe?.click();
  })
}
// 选中(取消)
const checkImage = (image:{[key:string]: any}, index:number) => {
  image.checked = !image.checked;
  if (image.checked) {
    data.checkList.push(image);
    return;
  };
  data.checkList = data.checkList.filter((img:{[key:string]: any}) => {
    return image.insertImageTemporaryId !== img.insertImageTemporaryId;
  });
}
// 点击确定
const confirm = () => {
  let insetHtml = '';
  data.checkList.forEach((item:{[key:string]: any}) => {
    if (global.$common.isEmpty(item.url)) return;
    insetHtml += `<p>
      <img src="${item.url}" _src="${item.url}" title="${item.title || ''}" />
    </p>`;
  });
  editor.value?.execCommand('inserthtml', insetHtml);
  closeDrawer();
};
// 点击取消(关闭)
const closeDrawer = () => {
  data.fileInfoList = [];
  data.uploadFileList = [];
  data.dialogVisible = false;
  data.pageLoading =false;
  data.checkList = [];
  data.temporaryStorage = {};
  data.uploadFailJson = {};
  nextTick(() => {
    data.dialogVisible = false;
  })
};

const imageError = (e:any, image:any) => {
  image.error = true;
}

watch(() => isVisible.value, (val) => {
  data.dialogVisible = val;
}, {immediate: true, deep: true});

watch(() => data.dialogVisible, (val) => {
  isVisible.value !== val && emit('update:visible', val);
  nextTick(() => {
    val && initData()
  })
}, {deep: true});

watch(() => data.unqualifiedFile, debounce((val) => {
  if (global.$common.isEmpty(val)) return;
  const fileName:Array<string> = val.map((file:any) => file.name);
  global.$message.warning({
    message: `${fileName.join('、 ')} 为非图片文件格式, 不允许上传`,
    'showClose': true
  });
  data.unqualifiedFile = [];
}, 100), {deep: true});

</script>
<style lang="less" scoped>
.add-edit-content{
  min-height: 160px;
  .imagewh{
    width: 150px;
    height: 150px;
  }
  .avatar-uploader-image{
    .imagewh;
    position: relative;
    display: inline-block;
    margin: 5px;
    border: 1px solid var(--el-border-color);
    border-radius: 5px;
    display: inline-block;
    vertical-align: top;
    overflow: hidden;
    &:before{
      display: none;
      content: '';
      position: absolute;
      height: 100%;
      width: 100%;
      background-color: var(--el-overlay-color-lighter);
      z-index: 2;
    }
    &:hover{
      border-color: var(--el-color-primary);
      &:before{
        display: block;
      }
      .image-btn{
        width: 100%;
        height:auto;
        top: 50%;
        transform: translate(0, -50%);
        z-index: 5;
      }
    }
    .image-checked{
      position: absolute;
      top: 2px;
      right: 2px;
      width: 20px;
      height: 20px;
      border: 1px solid var(--el-border-color);
      background-color: #fff;
      z-index: 3;
      cursor: pointer;
      &.checked-item{
        border: 1px solid var(--el-color-primary);
        color: #fff;
        background-color: var(--el-color-primary);
      }
      .el-icon {
        margin-top: 1px;
        margin-left: 1px;
        font-size: 17px;
      }
    }
    .image-view{
      position: absolute;
      top: 50%;
      left: 50%;
      padding: 5px;
      max-width: 100%;
      max-height: 100%;
      transform: translate(-50%, -50%);
      border-style: none;
      object-fit: cover;
    }
    .image-btn{
      position: absolute;
      height: 0;
      width: 0;
      text-align: center;
      // display: none;
      color: #fff;
      font-size: 16px;
      overflow: hidden;
      .btn-icon{
        margin: 0 3px;
        font-size: 18px;
        cursor: pointer;
      }
      .ueditor-image-view{
        position: absolute;
        top: 0;
        left: 0;
        height: 0px;
        width: 0px;
        // opacity: 0;
        :deep(img){
          opacity: 0;
        }
        :deep(.el-image__error){
          opacity: 0;
        }
      }
    }
    .image-remove-fail{
      position: absolute;
      bottom: 0;
      left: 0;
      padding: 3px 8px;
      width: 100%;
      font-size: 12px;
      text-align: center;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      color: #fff;
      background-color: var(--el-overlay-color-lighter);
      z-index: 10;
    }
  }
  .upload-demo{
    display: inline-block;
    vertical-align: top;
    :deep(.el-upload-dragger){
      padding: 0;
      width: auto;
      height: auto;
      border: none;
      border-radius: 5px;
    }
    .avatar-uploader-icon {
      .imagewh;
      margin: 5px;
      font-size: 28px;
      color: #8c939d;
      text-align: center;
      border: 1px dashed var(--el-border-color);
      border-radius: 5px;
      &:hover{
        border-color: var(--el-color-primary);
        color: var(--el-color-primary);
      }
    }
  }
}
</style>
<style>
.dialog-custom-class.el-dialog.dialog-custom-class-medium.insert-image-dialog{
  max-width: 1010px;
}
</style>
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
      >
        <img :src="img.url" class="image-view" />
        <div class="image-btn">
          <div v-if="!img.error" class="btn-item btn-icon">
            <Icon name="View" />
            <el-image
              class="view-btn"
              :src="img.url"
              :preview-src-list="data.fileInfoList.map((item:any) => item.url)"
              :initial-index="index"
              fit="cover"
              loading="lazy"
              :preview-teleported="true"
              @error="imageError($event, img)"
            />
          </div>
          <Icon
            v-if="typeof data.temporaryStorage.removeFiles === 'function'"
            class="btn-icon"
            name="Delete"
            @click="removeFiles(img, index)"
          />
        </div>
        <div v-if="!img.error" class="image-checked" :class="{'checked-item': img.checked}" @click="checkImage(img, index)">
          <Icon v-if="img.checked" name="Select" />
        </div>
      </div>
      <div
        class="avatar-uploader-image"
        v-for="(img, index) in data.uploadList"
        :key="`uploadList_${index}`"
        element-loading-text="正在上传..."
        v-loading="true"
      />
      <el-upload
        v-if="typeof data.temporaryStorage.uploadFiles === 'function'"
        class="upload-demo"
        action="https://jsonplaceholder.typicode.com/posts/"
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

const global = getGlobal();
const emit = defineEmits(['update:visible']);
const props = defineProps({
  editor: { type: Object },
  visible: { type: Boolean, default: false }
});

const data:{[key:string]:any} = reactive({
  fileInfoList: [],
  uploadFileList: [],
  uploadList: [],
  dialogVisible: false,
  pageLoading: false,
  checkList: [],
  temporaryStorage: {}
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
  data.temporaryStorage = window.temporaryStorage[editorid];
  data.pageLoading = true;
  const getTime = (new Date().getTime()).toString(36);
  // 获取文件列表
  data.temporaryStorage.getFiles().then((res:Array<{[key:string]: any}>) => {
    data.pageLoading = false;
    data.fileInfoList = res.map((item) => {
      return { loading: false, error: false, checked: false, insertImageTemporaryId: `${getTime}_${Math.random().toString(36).substring(2)}`, ...item}
    })
  }).catch(() => {
    data.pageLoading = false;
  });
};
// 上传前
const beforeUpload = (rawFile:any) => {
  data.uploadList.push(rawFile);
  data.temporaryStorage.uploadFiles(rawFile).then((res:boolean) => {
    data.fileInfoList.push(res);
    data.uploadList.splice(0, 1);
  }).catch(() => {
    data.uploadList.splice(0, 1);
  })
  return false;
}
// 移除文件
const removeFiles = (image:{[key:string]: any}, index:number) => {
  let backVal = global.$common.copy(image);
  const removeKey = ['loading', 'error', 'checked', 'insertImageTemporaryId'];
  image.loading = true;
  removeKey.forEach(key => {
    delete backVal[key];
  });
  data.temporaryStorage.removeFiles(backVal).then((res:boolean) => {
    image.loading = false;
    if (!res) return;
    data.fileInfoList.splice(index, 1);
  }).catch(() => {
    image.loading = false;
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
  data.uploadList = [];
  data.dialogVisible = false;
  data.pageLoading =false;
  data.checkList = [];
  data.temporaryStorage = {};
  nextTick(() => {
    data.dialogVisible = false;
  })
};

const imageError = (e: Error, image:any) => {
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
      top: 5px;
      left: 5px;
      width: 20px;
      height: 20px;
      border: 1px solid var(--el-border-color);
      background-color: #fff;
      z-index: 3;
      cursor: pointer;
      &.checked-item{
        color: var(--el-color-primary);
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
        cursor: pointer;
      }
      .btn-item{
        display: inline-block;
        position: relative;
        height: 20px;
        width: 20px;
      }
      .view-btn{
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        // opacity: 0;
        :deep(img){
          opacity: 0;
        }
        :deep(.el-image__error){
          opacity: 0;
        }
      }
    }
  }
  .upload-demo{
    display: inline-block;
    vertical-align: top;
    :deep(.el-upload-dragger){
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
  max-width: 990px;
}
</style>
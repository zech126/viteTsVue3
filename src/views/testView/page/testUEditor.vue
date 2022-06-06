<template>
  <dytUEditor 
    v-model="data.content"
    :config="data.config1"
    ref="myUEdito1"
    :upload-file="uploadFile"
    :upload-images="uploadImages"
    :get-images="getImageList"
    :remove-images="removeImages"
  />
  <div style="margin: 10px 0 50px 20px;">
    <dyt-button @click="getContet('myUEdito1')">获取内容-控制台查看</dyt-button>
  </div>
  <dytUEditor v-model="data.content1" :config="data.config2" ref="myUEdito2" />
  <div style="margin: 10px 0 50px 20px;">
    <dyt-button @click="getContet('myUEdito2')">获取内容-控制台查看</dyt-button>
  </div>
</template>

<script lang="ts" setup>
import {reactive, watch} from 'vue';
import getProxy from '@/utils/proxy';
const proxy:any = getProxy();

const data = reactive({
  content: 'sdregyte',
  content1: '你是那个啊',
  show: false,
  config1: {
    UEDITOR_HOME_URL: './ueditor/'
  },
  config2: {
    UEDITOR_HOME_URL: './ueditor/',
    toolbars: [
      [
        'fullscreen', 'source', '|', 'undo', 'redo', '|',
        'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
        'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
        'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
        'directionalityltr', 'directionalityrtl', 'indent', '|',
        'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
        'link', 'unlink', 'anchor', '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
        'simpleupload', 'emotion', 'scrawl', 'insertvideo', 'music', 'attachment', 'map', 'gmap', 'insertframe', 'insertcode', 'webapp', 'pagebreak', 'template', 'background', '|',
        'horizontal', 'date', 'time', 'spechars', 'snapscreen', 'wordimage', '|',
        'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts', '|',
        'print', 'preview', 'searchreplace', 'drafts', 'help'
      ]
    ]
  }
})
const uploadFile = (file:any) => {
  return new Promise((resolve) => {
    // 模拟接口返回数据
    setTimeout(() => {
      resolve('../../../src/assets/images/123.png');
    }, 3000)
  })
}
const uploadImages = (file:any) => {
  return new Promise((resolve) => {
    // 模拟接口返回数据
    setTimeout(() => {
      resolve({url: '../../../src/assets/images/123.png', id: (new Date().getTime()).toString(36)});
    }, 3000)
  })
}
const removeImages = (image:{[key:string]: any}) => {
  console.log(image)
  return new Promise((resolve:(value:boolean) => void) => {
    // 模拟接口返回数据
    setTimeout(() => {
      resolve(true);
    }, 3000)
  })
}

const getImageList = () => {
   return new Promise((resolve) => {
    // 模拟接口返回数据
    setTimeout(() => {
      const list = [
        {url: '../../../src/assets/images/nullength11.png', id: '1'},
        {url: '../../../src/assets/images/123.png', id: '2'},
        {url: '../../../src/assets/images/404.png', id: '3'},
        {url: '../../../src/assets/images/search.png', id: '4'},
        {url: '../../../src/assets/images/nullength.png', id: '5'}
      ]
      resolve(list);
    }, 3000)
  })
}

const getContet = (ref:string) => {
  const content = proxy.$refs[ref]?.getContent();
  console.log(content)
}

watch(() => data.content, (val) => {
  console.log('第一个编辑器', val);
});
watch(() => data.content1, (val) => {
  console.log('第二个编辑器', val);
});

</script>

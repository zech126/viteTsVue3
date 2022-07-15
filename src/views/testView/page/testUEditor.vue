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

  <dytUEditor
    v-model="data.content2"
    :config="data.config1"
    ref="myUEdito3"
    :upload-file="uploadFile"
    :upload-images="uploadImages"
    :get-images="getImageList"
    :remove-images="removeImages"
  />
  <div style="margin: 10px 0 50px 20px;">
    <dyt-button @click="getContet('myUEdito3')">获取内容-控制台查看</dyt-button>
  </div>
</template>

<script lang="ts" setup>
import {reactive, watch, onMounted} from 'vue';
import getProxy from '@/utils/proxy';
import getGlobal from '@/utils/global';
const proxy = getProxy();
const global = getGlobal();
const images = {
  '00': '../../../src/assets/images/table_loding.gif',
  '01': '../../../src/assets/images/123.png',
  '02': '../../../src/assets/images/401.gif',
  '03': '../../../src/assets/images/404.png',
  '04': '../../../src/assets/images/portrait.png',
  '05': '../../../src/assets/images/77777.jpg',
  '06': '../../../src/assets/images/bg.png',
  '07': '../../../src/assets/images/center_banner.png',
  '08': '../../../src/assets/images/search.png',
  '09': '../../../src/assets/images/nullength.png'
};
const data = reactive({
  content: 'sdregyte',
  content1: '你是那个啊',
  content2: '是测试的，，，',
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
  },
  uploadData: {
    pathType: 1
  }
});
console.log(global.api)
const uploadFile = (file:any) => {
  console.log(file)
  return new Promise((reslove, reject) => {
    let uploadFormData = new FormData();
    uploadFormData.append('file', file);
    Object.keys(data.uploadData).forEach(key => {
      uploadFormData.append(key, data.uploadData[key]);
    });
    // reject('上传失败，请重新尝试！');
    global.$http.post(global.api.uploadFile.upload, uploadFormData, {
      hiddenError: true,
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    }).then((res:{[key:string]:any}) => {
      if (res.data) {
        reslove(res.data);
        // 或
        // reslove({url: res.data, id: Math.random().toString(36).substring(2)});
      } else {
        reject(res && res.msg ? res.msg : '上传失败，请尝试重新插入！');
      }
    }).catch((err:{[key:string]:any}) => {
      reject(err.msg || '上传失败，请重新尝试！');
    })
  });
}
const uploadImages = (file:any) => {
  console.log(file)
  return new Promise((reslove, reject) => {
    // 模拟接口返回数据
    setTimeout(() => {
      if (Math.random() * 10 > 5) {
        reslove(images[Math.random().toString().replace('.', '').substring(0, 2)]);
        // 或
        // reslove({url: images[Math.random().toString().replace('.', '').substring(0, 2)], id: Math.random().toString(36).substring(2)});
      } else {
        reject('上传失败')
      }
    }, Math.random() * Math.random() * 5000)
  })
}
const removeImages = (image:{[key:string]: any}) => {
  console.log(image)
  return new Promise((reslove:(value:boolean) => void, reject) => {
    // 模拟接口返回数据
    setTimeout(() => {
      if (Math.random() * 10 > 5) {
        reslove(true)
      } else {
        reject()
      }
    }, Math.random() * Math.random() * 5000)
  })
}

const getImageList = () => {
   return new Promise((reslove) => {
    // 模拟接口返回数据
    setTimeout(() => {
      let list = [];
      for (let i = 0; i < 5; i++) {
        list.push(images[Math.random().toString().replace('.', '').substring(0, 2)]);
        // 或（需要删除图片库的图片时，请使用对象）
        // list.push({url: images[Math.random().toString().replace('.', '').substring(0, 2)], id: Math.random().toString(36).substring(2)});
      }
      reslove(list);
    }, Math.random() * Math.random() * 5000)
  })
}

const getContet = (ref:string) => {
  if (!proxy) return;
  const content = proxy.$refs[ref]?.getContent();
  console.log(content)
}

watch(() => data.content, (val) => {
  console.log('第一个编辑器', val);
});
watch(() => data.content1, (val) => {
  console.log('第二个编辑器', val);
});

onMounted(() => {})

</script>

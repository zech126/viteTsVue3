<template>
  <dytUEditor v-model="data.content" :config="data.config" ref="myUEdito1" />
  <div style="margin: 10px 0 50px 20px;">
    <dyt-button @click="getContet('myUEdito1')">获取内容-控制台查看</dyt-button>
  </div>
  <dytUEditor v-model="data.content1" :config="data.config" ref="myUEdito2" />
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
  config: {
    UEDITOR_HOME_URL: './ueditor/'
  }
})
watch(() => data.content, (val) => {
  console.log('第一个编辑器', val);
});
watch(() => data.content1, (val) => {
  console.log('第二个编辑器', val);
});

const getContet = (ref:string) => {
  const content = proxy.$refs[ref]?.getContent();
  console.log(content)
}
</script>

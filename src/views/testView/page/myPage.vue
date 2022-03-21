<template>
  <div style="padding: 60px">
    <div>
      图标组件：
      <el-button type="danger" circle><Icon name="delete" /></el-button>
      <el-button type="danger"><Icon name="delete" />删除</el-button>
    </div>
    <div>
      UI自带图标： <Icon :size="100" color="red" name="edit" />
    </div>
    <div style="margin-top: 10px;">
      JSX 组件：<br /><br />
      第一种用法 <br />
      <component1 :canshu="data.canshu" />
      <component2 :canshu="data.canshu1" />
      <br />
      第二种用法
      <component.component1 :canshu="data.canshu" />
      <component.component2 :canshu="data.canshu1" />
    </div>
    <div style="margin-top:10px;">
      <dyt-input ref="inputRef" v-model="data.inputVal">
        <template #prefix>prefix</template>
        <template #suffix>suffix</template>
        <template #prepend>prepend</template>
        <template #append>append</template>
      </dyt-input>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted } from 'vue';
import getProxy from "@/hooks/proxy";
import * as component from './test';
import {component1, component2} from './test';

const proxy = getProxy();
const data = reactive({
  canshu: 'component1',
  canshu1: 'component2',
  inputVal: ''
})

onMounted(() => {
  // @ts-ignore
  proxy.$refs.inputRef.focus(); // 焦点放到输入框里面
})
setTimeout(() => {
  data.canshu = '我改变了';
  data.canshu1 = '我在哪里';
}, 2000)
</script>

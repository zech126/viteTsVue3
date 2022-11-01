<template>
  <div style="padding: 60px">
    <el-button @click="broadcast">广播信息</el-button>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount } from 'vue';
import getGlobal from "@/utils/global";
const global = getGlobal();

const mytest = (value:any) => {
  console.log(`当前页面位 myPage2.vue`, value)
}
global.$bus.on('mytest', mytest);
let index = 0;
const broadcast = () => {
  index++;
  global.$bus.emit('mytest', {text: `我来自于DEV mytest, 第 ${index} 次广播`});
  global.$bus.emit('mytest1', {text: `我来自于DEV mytest1, 第 ${index} 次广播`});
}
// 销毁组件前解绑订阅
onBeforeUnmount(() => {
  global.$bus.off('mytest', mytest);
})
</script>

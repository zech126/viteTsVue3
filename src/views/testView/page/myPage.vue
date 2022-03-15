<template>
  <div style="padding: 60px">
    <div>
      按钮：
      <el-button type="danger" circle><Icon name="delete" /></el-button>
      <el-button type="danger"><Icon name="delete" />删除</el-button>
    </div>
    <div>
      UI自带图标： <Icon :size="100" color="red" name="edit" />
    </div>
    <div style="margin-top: 10px;">
      JSX 组件：
      <component1 :canshu="canshu" />
      <component2 :canshu="canshu1" />
    </div>
    <div style="margin-top:10px;">
      <el-link type="info"><Icon name="edit" />info</el-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import {component1, component2} from './test';
let canshu = ref('component1');
let canshu1 = ref('component2');
setTimeout(() => {
  canshu.value = '我改变了';
  canshu1.value = '我在哪里';
}, 2000)
</script>

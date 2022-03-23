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
    <div style="margin-top:10px;">
      <dyt-cascader v-model="data.cascader" :options="data.options" @change="cascaderChange" />
    </div>
    <div style="margin-top:10px;">
      <dyt-date-picker v-model="data.picker" type="date" />
    </div>
    <div style="margin-top:10px;">
      <dyt-date-picker v-model="data.daterange" type="daterange" />
    </div>
    <div style="margin-top:10px;">
      <dyt-input-tag style="margin: 10px 0;" v-model="data.inputTag" :string="true" />
    </div>
    <div style="margin-top:10px;">
      <dyt-input-tag style="margin: 10px 0; width: 500px;" :limit="1" type="textarea" v-model="data.inputTagP" :string="true" />
    </div>
    <div style="margin-top:10px;">
      <dyt-select
        v-model="data.dytSelect"
        :options="data.selectOptions"
      />
    </div>
    <div style="margin-top: 10px">
      <dytTreeSelect
        v-model="data.treeSelectVal"
        :data="data.options"
        :defaultProps="data.defaultProps"
        :limit="1"
        :multiple="true"
        :check-strictly="false"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted } from 'vue';
import getProxy from "@/hooks/proxy";
import * as component from './test';
import {component1, component2} from './test';

const proxy:any = getProxy();
const data = reactive({
  canshu: 'component1',
  canshu1: 'component2',
  inputVal: '',
  cascader: '',
  options: [
    {
      value: 'value-1',
      label: 'label-1',
      children: [
        {
          value: 'value-1-1',
          label: 'label-1-1',
          children: [
            {
              value: 'value-1-1-1',
              label: 'label-1-1-1'
            },
            {
              value: 'value-1-1-2',
              label: 'label-1-1-2'
            }
          ]
        },
        {
          value: 'value-1-2',
          label: 'label-1-2'
        }
      ]
    },
    {
      value: 'value-2',
      label: 'label-2',
      children: [
        {
          value: 'value-2-1',
          label: 'label-2-1'
        },
        {
          value: 'value-2-2',
          label: 'label-2-2'
        }
      ]
    }
  ],
  picker: '',
  daterange: [],
  inputTag: '',
  inputTagP: '',
  dytSelect: '',
  selectOptions: [
    {label: 'label-1', value: 'value-1'},
    {label: 'label-2', value: 'value-2'},
    {label: 'label-3', value: 'value-3'}
  ],
  treeSelectVal: [],
  defaultProps: {
    value: 'value',
    label: 'label',
    children: 'children'
  }
})

const cascaderChange = (val:any) => {
  console.log(val)
}

onMounted(() => {
  proxy.$refs.inputRef?.focus(); // 焦点放到输入框里面
})
setTimeout(() => {
  data.canshu = '我改变了';
  data.canshu1 = '我在哪里';
}, 2000)
</script>

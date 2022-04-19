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
        :virtual="true"
        :defaultProp="data.defaultProp"
        :options="data.selectOptions2"
      ></dyt-select>
    </div>
    <div style="margin-top:10px;">
      <dyt-select
        v-model="data.dytSelect"
        :options="data.selectOptions"
      ></dyt-select>
    </div>
    <div style="margin-top:10px;">
      <dyt-select
        v-model="data.dytSelect1"
        :options="data.selectOptions1"
      />
    </div>
    <div style="margin-top: 10px">
      <dytTreeSelect
        v-model="data.treeSelectVal"
        :data="data.options"
        :defaultProps="data.defaultProps"
        :limit="1"
        :virtual="true"
        :multiple="false"
      />
    </div>
    <div style="margin-top: 10px">
      <dytTreeSelect
        v-model="data.treeSelectVal1"
        :options="data.options"
        :defaultProps="data.defaultProps"
        :multiple="true"
        :limit="1"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted } from 'vue';
import getProxy from "@/utils/proxy";
import * as component from './test';
import {component1, component2} from './test';

const proxy:any = getProxy();
const data = reactive({
  canshu: 'component1',
  canshu1: 'component2',
  inputVal: '',
  cascader: '',
  defaultProp: {
    value: 'value1',
    label: 'label1',
    disabled: 'disabled1',
    options: 'options1',
  },
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
              label: 'label-1-1-2label-1-1-2label-1-1-2label-1-1-2label-1-1-2label-1-1-2label-1-1-2label-1-1-2label-1-1-2label-1-1-2label-1-1-2label-1-1-2label-1-1-2label-1-1-2'
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
    },
    {
      value: 'value-3',
      label: 'label-3',
      children: [
        {
          value: 'value-3-1',
          label: 'label-3-1',
          children: [
            {
              value: 'value-3-1-1',
              label: 'label-3-1-1'
            },
            {
              value: 'value-3-1-2',
              label: 'label-3-1-2'
            }
          ]
        },
        {
          value: 'value-3-2',
          label: 'label-3-2'
        }
      ]
    },
    {
      value: 'value-4',
      label: 'label-4',
      children: [
        {
          value: 'value-4-1',
          label: 'label-4-1',
          children: [
            {
              value: 'value-4-1-1',
              label: 'label-4-1-1'
            },
            {
              value: 'value-4-1-2',
              label: 'label-4-1-2'
            }
          ]
        },
        {
          value: 'value-4-2',
          label: 'label-4-2'
        }
      ]
    }
  ],
  picker: '',
  daterange: [],
  inputTag: '',
  inputTagP: '',
  dytSelect: '',
  dytSelect1: '',
  selectOptions: [
    {label: 'label-1', value: 'value-1'},
    {label: 'label-2', value: 'value-2'},
    {label: 'label-3', value: 'value-3'},
    {label: 'label-4', value: 'value-4'},
    {label: 'label-5', value: 'value-5'},
    {label: 'label-6', value: 'value-6'},
    {label: 'label-7', value: 'value-7'},
    {label: 'label-8', value: 'value-8'},
    {label: 'label-9', value: 'value-9'},
    {label: 'label-10', value: 'value-10'}
  ],
  selectOptions2: [
    {label1: 'label-1', value1: 'value-1'},
    {label1: 'label-2', value1: 'value-2'},
    {label1: 'label-3', value1: 'value-3'},
    {label1: 'label-4', value1: 'value-4'},
    {label1: 'label-5', value1: 'value-5'},
    {label1: 'label-6', value1: 'value-6'},
    {label1: 'label-7', value1: 'value-7'},
    {label1: 'label-8', value1: 'value-8'},
    {
      label1: 'label-9',
      options1: [
        {label1: 'label-1', value1: 'value-1'},
        {label1: 'label-2', value1: 'value-2'},
        {label1: 'label-3', value1: 'value-3'},
        {label1: 'label-4', value1: 'value-4'},
        {label1: 'label-6', value1: 'value-6'},
        {label1: 'label-7', value1: 'value-7'},
        {label1: 'label-8', value1: 'value-8'},
        {label1: 'label-9', value1: 'value-9'}
      ]
    },
    {
      label1: 'label-10',
      options1: [
        {label1: 'label-1', value1: 'value-1'},
        {label1: 'label-2', value1: 'value-2'},
        {label1: 'label-3', value1: 'value-3'},
        {label1: 'label-4', value1: 'value-4'},
        {label1: 'label-5', value1: 'value-5'},
        {label1: 'label-6', value1: 'value-6'},
        {label1: 'label-7', value1: 'value-7'},
        {label1: 'label-8', value1: 'value-8'},
        {label1: 'label-9', value1: 'value-9'}
      ]
    }
  ],
  selectOptions1: [
    {
      label: 'label-1',
      options: [
        {label: 'label-1-1', value: 'label-1-1'},
        {label: 'label-1-2', value: 'label-1-2'},
        {label: 'label-1-3', value: 'label-1-3'}
      ]
    },
    {
      label: 'label-2',
      options: [
        {label: 'label-2-1', value: 'label-2-1'},
        {label: 'label-2-2', value: 'label-2-2'},
        {label: 'label-2-3', value: 'label-2-3'}
      ]
    },
    {
      label: 'label-3',
      options: [
        {label: 'label-3-1', value: 'label-3-1'},
        {label: 'label-3-2', value: 'label-3-2'},
        {label: 'label-3-3', value: 'label-3-3'}
      ]
    },
    {
      label: 'label-4',
      options: [
        {label: 'label-4-1', value: 'label-4-1'},
        {label: 'label-4-2', value: 'label-4-2'},
        {label: 'label-4-3', value: 'label-4-3'}
      ]
    },
    {
      label: 'label-5',
      options: [
        {label: 'label-5-1', value: 'label-5-1'},
        {label: 'label-5-2', value: 'label-5-2'},
        {label: 'label-5-3', value: 'label-5-3'}
      ]
    }
  ],
  treeSelectVal: [],
  treeSelectVal1: [],
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

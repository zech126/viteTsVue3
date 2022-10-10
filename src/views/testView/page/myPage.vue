<template>
  <div style="padding: 60px">
    <div>
      图标组件：
      <el-button type="danger" circle><Icon name="delete" /></el-button>
      <dyt-button type="danger" icon="delete" circle />
      <dyt-button type="danger" icon="delete">删除</dyt-button>
      <dyt-button type="danger">删除</dyt-button>
      <dyt-button type="danger">
        <template v-slot:icon><Icon name="delete" /></template>
        插槽
      </dyt-button>
      <el-button type="danger" loading>
        Loading
      </el-button>
      <el-button type="danger" loading>
        <template #loading>
          <i class="lapa icon-loading" />
        </template>
        Loading
      </el-button>
    </div>
    <div style="margin-top: 10px;">
      UI自带图标： <Icon style="font-size:50px;" color="red" name="edit" /> <Icon style="font-size:50px;" color="red" name="loading" />
      <p/>
      fontIcon：<i style="font-size:50px;" class="lapa icon-loading" />
      <p/>
      fontIcon SVG：<svg-icon name="icon-loading" style="font-size: 30px;" />
    </div>
    <div style="margin-top: 10px;">
      JSX 组件：<br /><br />
      第一种用法 <br />
      <component1 :canshu="data.canshu" />
      <component2 :canshu="data.canshu1" />
      <br />
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
      <dyt-input-tag style="margin: 10px 0; width: 500px;" type="textarea" v-model="data.inputTagTxt" :string="true" />
    </div>
    <div style="margin-top:10px;">
      虚拟滚动-分组
      <dyt-select
        v-model="data.dytSelectx"
        :virtual="true"
        :defaultProp="data.defaultProp"
        :options="data.selectOptions2"
      />
    </div>
    <div style="margin-top:10px;">
      虚拟滚动-点击次数排序
      <dyt-select
        v-model="data.dytSelect"
        :virtual="true"
        :options="data.selectOptions"
        sort-key="virtual"
        :is-sort="true"
        :sort-limit="5"
      />
    </div>
    <div style="margin-top:10px;">
      虚拟滚动多选-点击次数排序
      <dyt-select
        v-model="data.dytSelectm"
        :options="data.selectOptions"
        sort-key="virtualm"
        :virtual="true"
        :is-sort="true"
        :sort-limit="5"
        :multiple="true"
      />
    </div>
    <div style="margin-top:10px;">
      虚拟滚动-插槽(支持排序)
      <dyt-select v-model="data.dytSelect" :virtual="true" :options="data.selectOptions" sort-key="selectOptionmcg" :is-sort="true">
        <template v-slot:default="{ item }">
          {{(typeof item.label !== 'undefined' ? item.label : item.value)}}
        </template>
      </dyt-select>
    </div>
    <div style="margin-top:10px;">
      常规
      <dyt-select
        v-model="data.dytSelect"
        :options="data.selectOptions"
      />
    </div>
    <div style="margin-top:10px;">
      常规-点击次数排序
      <dyt-select
        v-model="data.dytSelect"
        :options="data.selectOptions"
        sort-key="selectOptions"
        :is-sort="true"
        :sort-limit="4"
      />
    </div>
    <div style="margin-top:10px;">
      常规多选-点击次数排序
      <dyt-select
        v-model="data.dytSelectm"
        :options="data.selectOptions"
        sort-key="selectOptionm"
        :is-sort="true"
        :sort-limit="4"
        :multiple="true"
      />
    </div>
    <div style="margin-top:10px;">
      常规-插槽-1(不支持排序)
      <dyt-select v-model="data.dytSelect">
        <el-option
          v-for="(item, index) in data.selectOptions"
          :key="`option-${index}`"
          :label="(typeof item.label !== 'undefined' ? item.label : '')"
          :value="item.value"
          :disabled="(typeof item.disabled === 'boolean' ? item.disabled : false)"
        />
      </dyt-select>
    </div>
    <div style="margin-top:10px;">
      常规-插槽-2(支持排序)
      <dyt-select v-model="data.dytSelect" :options="data.selectOptions" sort-key="selectOptionmc" :is-sort="true">
        <template v-slot:option="{item}">
          {{item.label}}
        </template>
      </dyt-select>
    </div>
    <div style="margin-top:10px;">
      常规-分组
      <dyt-select
        v-model="data.dytSelect1"
        :options="data.selectOptions1"
      />
    </div>
    <div style="margin-top: 10px">
      <!-- 使用虚拟滚动，当出现横向滚动条时，竖向滚动条再右边被遮挡BUG -->
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
      />
    </div>
    <div style="margin-top: 10px">
      <dytImage
        :src="data.imageList[0]"
        fit="contain"
        class="dytImage"
      />
      <dytImage
        src="1221"
        fit="contain"
        class="dytImage"
      />
      <dytImage
        v-for="(image, index) in data.imageList"
        :key="index"
        :src="image"
        :preview-src-list="data.imageList"
        :initial-index="index"
        fit="contain"
        class="dytImage"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted } from 'vue';
import getProxy from "@/utils/proxy";
import getGlobal from "@/utils/global";
import {component1, component2} from './test';
// import { debounce } from '@/utils/debounce';
// import { debounce } from 'lodash';

const proxy = getProxy();
const global = getGlobal();
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
  inputTagP: ['ready', '嘭...', '开始', '划划水', '摸摸 鱼', '吹 吹牛', '等下班', '叮..', '打卡完成', '坐电梯', '坐地铁'],
  inputTagTxt: [ 'ready', '嘭...', '开始', '划划水', '摸摸 鱼', '吹 吹牛', '等下班'],
  dytSelect: 'value-3',
  dytSelectm: [],
  dytSelect1: '',
  dytSelectx: '',
  selectOptions: [
    {label: 'label-1', value: 'value-1'},
    {label: 'label-2', value: 'value-2'},
    {label: 'label-3', value: 'value-3'},
    {label: 'label-4', value: 'value-4'},
    {label: 'label-5', value: 'value-5', disabled: true},
    {label: 'label-6', value: 'value-6'},
    {label: 'label-7', value: 'value-7'},
    {label: 'label-8', value: 'value-8'},
    {label: 'label-9', value: 'value-9'},
    {label: 'label-10', value: 'value-10'}
  ],
  selectOptions2: [
    {label1: 'label-1', value1: 'value-1', disabled1: true},
    {label1: 'label-2', value1: 'value-2'},
    {label1: 'label-3', value1: 'value-3'},
    {label1: 'label-4', value1: 'value-4'},
    {label1: 'label-5', value1: 'value-5'},
    {label1: 'label-6', value1: 'value-6'},
    {label1: 'label-7', value1: 'value-7'},
    {label1: 'label-8', value1: 'value-8'},
    {
      label1: 'label-9',
      disabled1: true,
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
      disabled: true,
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
        {label: 'label-2-2', value: 'label-2-2', disabled: true},
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
  },
  imageList: [
    new URL('../../../assets/images/bg.png', import.meta.url).href,
    new URL('../../../assets/images/404.png', import.meta.url).href,
    new URL('../../../assets/images/401.gif', import.meta.url).href,
    new URL('../../../assets/images/search.png', import.meta.url).href,
    new URL('../../../assets/images/nullength.png', import.meta.url).href,
    new URL('../../../assets/images/table_loding.gif', import.meta.url).href
  ]
})

const cascaderChange = (val:any) => {
  console.log(val)
}

onMounted(() => {
  proxy?.$refs?.inputRef?.focus(); // 焦点放到输入框里面
})
setTimeout(() => {
  data.canshu = '我改变了';
  data.canshu1 = '我在哪里';
}, 2000)
//  const zipFolder = (sourceFolder, destZip) => {
//     var zip = new admZip();
  
//     zip.addLocalFolder(sourceFolder);
//     zip.writeZip(destZip);
// }
const dd = {
  d: [],
  h: [
    [[], ['3', '', ['1']]],
    {},
    '', 
    {d: 'sdh', sddf: {lgd:'', dshdsh: {hhg: [{dfsgdg:[{gggggg: []}]}, '', {web:[{dg: [{},{d:''}]}, {g: ''}]}]}}},
    [[[]]],
    {sddf: {lgd:'', dshdsh: {hhg: [{dfsgdg:[{gggggg: []}]}, '', {web:[{dg: [{},{d:''}]}, {g: ''}]}]}}},
    [],
    {fdsgsdg: ''}
  ],
  f: { g: { b:{ c: {} } } },
  jg: { dg: { fd: { gss:'', ddgf: { dfthj: '0' } } }, h: {} },
  hg: [[], [], {d:'33'}, {d: ''}],
  hh: '123',
  tyty: () => {}
};

const trm = {
  a: '  srgsh  sdgfsh  ',
  b: { c: { sdf: null, fhdfg: 123, gghgf: true, jkhjl: false, tyty: () => {}, d: { fadsg: '  ds  asg ', sd: '  ', e: 'hji;l  ' } } },
  c: [[]],
  ddd: {d: '   ', f: ' d dsgh  ', gsg: ['  ', 'dg ', '  dsgf  '] },
  d: [{d: ['asg  ', '  dasgf111  ', '   ', '   zasfg'], ddd: {gds: '  sdh', dfgh: '   ',  agas: '  sdfgh   ', hhjh: '   dsfh111'}}],
  h: [
    [[], ['3', '', ['1']]],
    {},
    '     ooo ', 
    {d: '  s dh ', sddf: {lgd:' 0 ', dshdsh: {hhg: [{dfsgdg:[{gggggg: []}]}, ' ds fg ', {web:[{dg: [{ghjk: '  srtty '},{d:' dgf '}]}, {g: ' fdd '}]}]}}},
    [[[]]],
    {sddf: {lgd:'  dfy', dshdsh: {hhg: [{dfsgdg:[{gggggg: ['  dsg ']}]}, '  dstew ', {web:[{dg: [{ghjk:'   ds    '},{d:'  dete'}]}, {g: 'weghjf '}]}]}}},
    [],
    {fdsgsdg: 'werytui   '}
  ],
};
console.log('移除空值, hg 和 h[*].sddf.dshdsh.hhg[2].web[0].dg[1] 除外', global.$common.removeEmpty(dd, ['hg', 'h[*].sddf.dshdsh.hhg[2].web[0].dg[1]'], true));
console.log('移除字符串2端的空格, ddd.gsg 和 h[*].sddf.dshdsh.hhg[2].web[0].dg[1] 除外', global.$common.trim(trm, ['ddd.gsg', 'h[*].sddf.dshdsh.hhg[2].web[0].dg[1]']));
// const myTime = global.$dayjs().add(1, 'day').format('YYYY-MM-DD');
// console.log(myTime, global.$route)
console.log(global, global.api);
console.log(global.$dayjs().add(1, 'y').add(1, 'M').add(1, 'd').format('YYYY-MM-DD'));
// global.$common.downloadFile(window.location.origin + '/src/main.ts', {name: '', timestamp: false});
global.$common.split('你\n好,的，昂.都是多人他.发个交易日.发国库突然.塞特我塞特我', ['.', ',', '，', '\n']);
// console.log(global.lodash);
const isEm = [[],[],[[],[],[[],[],[{g:{}}]]]];
console.log(global.$common.isEmpty(isEm, true), global.$common.isRegExp(/dfgd/g));
</script>
<style lang="less" scoped>
.dytImage{
  display: inline-block;
  width: 200px;
  height: 200px;
  padding: 5px;
  margin-right: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

</style>

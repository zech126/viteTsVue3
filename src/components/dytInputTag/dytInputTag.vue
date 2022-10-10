<template>
  <div :ref="`tag-${base.pageId}`" class="dyt-input-tag-demo">
  <!-- :style="selectConfig.style" -->
    <el-popover
      :placement="base.popoverPlacement"
      :width="base.popoverWidth"
      :hide-after="100"
      trigger="click"
      :popper-class="`${props.limit > 0 ? ' ' : 'hidden-popper-content '}tag-popper-content${!selectConfig.disabled ? '' : ' is-disabled-tag'}`"
      @after-enter="afterEnter"
      @after-leave="afterLeave"
      @show="popoverShow"
      @hide="popoverHide"
      @before-enter="showBefore"
    >
      <template #reference>
        <div
          class="dyt-input-tag-content"
          :class="{
            'dyt-tag-content-limit': props.limit > 0,
            'tag-content-focus': base.isFocus,
            'is-disabled-tag': selectConfig.disabled
          }"
          @click="focus"
        >
          <template v-if="props.limit > 0">
            <div v-if="base.vModel.length > 0" class="tag-limit">
              <span v-for="(tag, index) in base.vModel.slice(0, props.limit)" :key="`tag-${index}`" class="el-tag el-tag--info" @click="clickTag(tag)">
                <span class="el-tag-text" :title="props.defaultProp.label ? tag[props.defaultProp.label] : tag">
                  {{ props.defaultProp.label ? tag[props.defaultProp.label] : tag }}
                </span>
                <Icon v-if="selectConfig.closable" title="移除" class="el-tag__close el-icon-close" name="close" @click.stop="closeTag(tag)"/>
              </span>
            </div>
            <span v-else class="input-new-tag tag-text-view">
              {{ props.placeholder }} 
            </span>
            <div v-if="base.vModel.length - props.limit > 0 && props.limit > 0" class="more-tag">
              <el-tooltip
                trigger="hover"
                effect="light"
                placement="bottom"
                popper-class="popper-limit-tips"
                :disabled="props.disabledTip || base.isShow"
              >
                + {{ base.vModel.length - props.limit }}
                <template v-slot:content>
                  <div class="popper-tips-content">
                    <template v-for="(tip, tIndex) in base.vModel" :key="`tip-${tIndex}`">
                      <span class="limit-tips-item">
                        {{props.defaultProp.label ?  tip[props.defaultProp.label] || '' : tip}}
                      </span>
                    </template>
                  </div>
                </template>
              </el-tooltip>
            </div>
            <div v-if="base.vModel.length && selectConfig.closable" class="clearable-all">
              <Icon class="el-tag__close el-icon-close" title="清空" name="circle-close" @click.stop="clearableHand"/>
            </div>
          </template>
          <template v-else>
            <div class="default-tag-constent">
              <span
                v-for="(tag, index) in base.vModel"
                :key="`tag-${index}`"
                class="el-tag el-tag--info"
                @click="clickTag(tag)"
              >
                <span
                  class="el-tag-text"
                  :title="(props.defaultProp.label || props.defaultProp.value) ? tag[props.defaultProp.label || props.defaultProp.value] : tag"
                >{{ (props.defaultProp.label || props.defaultProp.value) ? tag[props.defaultProp.label || props.defaultProp.value] : tag }}</span>
                <Icon
                  v-if="selectConfig.closable"
                  class="el-tag__close el-icon-close"
                  name="close"
                  title="移除"
                  @click.stop="closeTag(tag)"
                />
              </span>
              <el-input
                v-if="!(props.limit > 0) && selectConfig.addTag"
                :ref="`saveTagInput-${base.pageId}`"
                v-model="base.inputValue"
                :autosize="true"
                resize="none"
                :type="props.type"
                class="input-new-tag input-writing-tag"
                :class="{
                  'input-empty-tag': base.vModel.length === 0
                }"
                :placeholder="base.vModel.length <= 0 ? props.placeholder : ''"
                :style="`width:${ base.vModel.length > 0 && !base.inputValue.includes('\n') ? base.inputWidth: '100%;'}`"
                @keyup.enter="addTagHand"
                @keyup="tagkeyup"
                @blur="blur"
              />
            </div>
            <div v-if="base.vModel.length && selectConfig.closable" class="clearable-all">
              <Icon class="el-tag__close el-icon-close" title="清空" name="circle-close" @click.stop="clearableHand"/>
            </div>
          </template>
          <dyt-input v-model="base.valueValidation" class="tag-form-item-tool" type="text" />
        </div>
      </template>
      <div v-if="props.limit > 0" :ref="`popover-${base.pageId}`">
        <dyt-input
          v-if="selectConfig.addTag || ['textarea'].includes(props.type)"
          :ref="`popoverTagInput-${base.pageId}`"
          v-model="base.inputValue"
          :class="{
            'input-empty-tag': base.vModel.length === 0
          }"
          :type="props.type"
          :placeholder="props.placeholder"
          style="margin-bottom: 10px;"
          :disabled="selectConfig.disabled"
          :autosize="{minRows: 2, maxRows: (props.preview ? 4 : 15)}"
          resize="none"
          @keyup.enter="addTagHand"
          @keyup="tagkeyup"
          @blur="blur"
        />
        <div v-if="(props.preview && props.type === 'textarea') || props.type !== 'textarea'" style="max-height: 300px;overflow-y: auto;overflow-x: hidden;">
          <template v-if="base.vModel.length > 0">
            <span v-for="(tag, index) in base.vModel" :key="`tag-${index}`" class="el-tag el-tag--info" @click="clickTag(tag)">
              <span
                class="el-tag-text"
                :title="(props.defaultProp.label || props.defaultProp.value) ? tag[props.defaultProp.label || props.defaultProp.value] : tag"
                >
                {{ (props.defaultProp.label || props.defaultProp.value) ? tag[props.defaultProp.label || props.defaultProp.value] : tag }}
              </span>
              <Icon v-if="selectConfig.closable" title="移除" class="el-tag__close el-icon-close" name="close" @click.stop="closeTag(tag)"/>
            </span>
          </template>
          <span v-else>暂无数据!</span>
        </div>
      </div>
    </el-popover>
  </div>
</template>
<script lang="ts" setup>
import { reactive, useAttrs, computed, watch, onMounted, nextTick, PropType } from 'vue';
import getGlobal from "@/utils/global";
import getProxy from "@/utils/proxy";

/**
 * 方法 close 配置之后，点击关闭之后需自己处理， 参数返回 当前 tag
 * 方法 click， 参数返回 当前 tag
 * 方法 addTheTag  参数返回 当前输入值
 * disabled 是否禁用，数据类型 Boolean，默认值 false，若设置为 true 则禁用编辑
 * readonly 是否只读，数据类型 Boolean，默认值 false， 若设置为 true 则不能编辑
 * closable 是否显示关闭按钮, 数据类型 Boolean，默认值 true, 只读或禁用时失效
 * addTag 是否可自定义新增, 数据类型 Boolean，默认值 true, 只读或禁用时失效
 * limit 最多显示 tag 个数，数据类型 Number，默认值 0，设置大于 0 数字才生效，设置后内容不换行
 */
interface dataType {
  valueValidation: string;
  vModel: Array<string>;
  pageId: string;
  inputValue: string;
  inputWidth: string;
  isFocus: boolean;
  popoverWidth: number;
  popoverPlacement: string;
  isShow: boolean;
  defaultConfig: {
    disabled: boolean;
    type: string;
    closable: boolean;
    size: string;
  }
}

const global = getGlobal();
const proxy = getProxy();
const $attrs = useAttrs();
const props = defineProps({
  // 绑定值， 使用 v-model 或 modelValue 绑定
  modelValue: { type: [Array, String] as PropType<string | string[] | {[key:string]:string}[]>, default: () => {return []}},
  // 占位符提示
  placeholder: { type: String, default: '请输入后按回车或使用逗号分隔'},
  // 最多显示格式， 0 为不限制
  limit: { type: Number, default: 0 },
  // 禁用
  disabled: { type: Boolean, default: false },
  // 只读
  readonly: { type: Boolean, default: false },
  // 是否可以添加 tag
  addTag: { type: Boolean, default: true },
  // 对输入值进行分割字符集合
  split: { type: [Array, String] as PropType<string | string[]>, default: () => {return [',', '，', '\n']} },
  // change 事件是否返回字符串
  string: { type: Boolean, default: false },
  // 返回字符串时的分隔符号（string 为 true 时生效）
  separStr: { type: String, default: ',' },
  // 值为对象时，string 必须为 false，键值替换
  defaultProp: { type: Object as PropType<{value:string|number, label: string|number}>, default: () => {return {}} },
  // 输入框的类型, 可选值：textarea、text
  type: { type: String, default: 'text'},
  // 当 type 为 textarea 并且 limit 大于 0 生效， 下拉是否展示 tag 默认 false
  preview: { type: Boolean, default: false },
  // 是否禁用 tip
  disabledTip: { type: Boolean, default: false }
});
const base:dataType = reactive({
  pageId: Math.random().toString(36).substring(2),
  valueValidation: '',
  inputValue: '',
  popoverPlacement: 'bottom',
  vModel: [],
  inputWidth: '100%;',
  isFocus: false,
  isShow: false,
  popoverWidth: 200,
  defaultConfig: {
    disabled: false,
    type: 'info',
    closable: true,
    size: 'small'
  }
});
const $emit = defineEmits(['update:modelValue','change','click','clearableHand','close','keyup','keyupEnter','addTheTag','show','showAfter','hide','hideAfter']);
const selectConfig:any = computed(() => {
  let config = { ...base.defaultConfig, ...$attrs, addTag: props.addTag };
  if (props.disabled || props.readonly) {
    config.closable = false;
    config.addTag = false;
    config.disabled = true;
  }
  return config;
});

onMounted(() => {
  handPopoverWidth();
});

const handPopoverWidth = () => {
  // 弹出宽度设置
  proxy.$refs[`tag-${base.pageId}`] && (base.popoverWidth = proxy.$refs[`tag-${base.pageId}`].offsetWidth);
}

const initInputWidth = (val:string) => {
  if (props.limit > 0) return '';
  const cn = val.replace(/[^\u4e00-\u9fa5]/gi,"");
  const valLength = val.length;
  return`${val ? (cn.length * 14.2 + (valLength - cn.length) * 7 + 37) + 'px;' : '50px;'}`;
}
const clickTag = (tag:any) => {
  $emit('click', tag);
}
// 清空
const clearableHand = () => {
  if (!selectConfig.value.closable) return;
  nextTick(() => {
    $emit('clearableHand');
    base.vModel = [];
  });
}
// 移除单个 tag
const closeTag = (tag:any) => {
  if (!selectConfig.value.closable) return;
  if ($attrs.onClose) {
    $emit('close', tag);
  } else {
    if (props.defaultProp.value) {
      base.vModel = base.vModel.filter(item => {
        return item[props.defaultProp.value] !== tag[props.defaultProp.value];
      })
    } else {
      base.vModel.splice(base.vModel.indexOf(tag), 1);
    }
  }
  // 如果是多行文本，不清空输入值的情况
  if(!props.preview && props.type === 'textarea' && props.limit > 0) {
    let index = base.inputValue.indexOf(tag);
    const newSplit = typeof props.split === 'string' ? [props.split] : props.split;
    if (index > -1) {
      let newTag:any = newSplit.filter(sp => {
        return base.inputValue.includes(`${base.inputValue.substring(index, tag.length)}${sp}`);
      });
      if (newTag[0]) {
        newTag = `${base.inputValue.substring(index, tag.length)}${newTag[0]}`;
        base.inputValue = `${base.inputValue.substring(0, index)}${base.inputValue.substring(index + newTag.length)}`;
      } else {
        base.inputValue = `${base.inputValue.substring(0, index)}${base.inputValue.substring(index + tag.length)}`;
      }
    }
  }
  nextTick(() => {
    props.limit > 0 && proxy.$refs[`popoverTagInput-${base.pageId}`] && proxy.$refs[`popoverTagInput-${base.pageId}`].focus();
  })
}
// 键盘事件
const tagkeyup = (e:Object) => {
  $emit('keyup', e);
}
// 处理多行文本内容
const changeInputVal = (matchingSplit:Array<any>) => {
  let tagList:any = matchingSplit;
  let newVal:string = '';
  let getValList:any = [];
  const textValue = base.inputValue;
  const listL = tagList.length - 1;
  const separated = typeof props.split === 'string' ? props.split : props.split.includes('\n') ? '\n' : props.split[0];
  if (listL < 1) return global.$common.isEmpty(tagList[0]) ?  '' : `${tagList[0]}${separated}`;
  tagList.forEach((item:string, index:number) => {
    if (typeof props.split === 'string') {
      if (!getValList.includes(item)) {
        if (index === listL) {
          getValList.push(item);
          newVal = `${newVal}${item}${props.split}`;
        } else if (textValue.includes(`${props.split}${item}${props.split}`) || (index === 0 && textValue.includes(`${item}${props.split}`))) {
          getValList.push(item);
          newVal = `${newVal}${item}${props.split}`;
        }
      }
    } else if (global.$common.isArray(props.split)) {
      const split:Array<string> = props.split;
      if (split.length === 0) return textValue;
      split.forEach((sp1:string) => {
        split.forEach((sp2:string) => {
          if (!getValList.includes(item)) {
            if (index === listL) {
              getValList.push(item);
              newVal = `${newVal}${item}${separated}`;
            } else if (textValue.includes(`${sp1}${item}${sp2}`) || (index === 0 && textValue.includes(`${item}${sp2}`))) {
              getValList.push(item);
              newVal = `${newVal}${item}${sp2}`;
            }
          }
        })
      })
    }
  });
  return newVal;
}
// 
const addTagHand = (e:any = {}) => {
  if (e && e.key === 'Enter'){
    $emit('keyupEnter', e);
    if (props.type === 'textarea') return;
  }
  if (global.$common.isEmpty(base.inputValue)) {
    if(!props.preview && props.type === 'textarea' && props.limit > 0) {
      base.vModel = [];
    }
    return;
  }
  // 字符串分割
  const newAddItems:any = global.$common.split(base.inputValue, props.split, true);
  let addItems:Array<any> = [];
  let matchingSplit:Array<any> = [];
  newAddItems.forEach((item:any) => {
    if (!addItems.includes(item.trim())) {
      addItems.push(item.trim());
      matchingSplit.push(item);
    }
  });
  if ($attrs.onAddTheTag) {
    $emit('addTheTag', addItems);
    base.inputValue = '';
  } else {
    let newTags:Array<any> = [];
    if (props.defaultProp.value || props.defaultProp.label) {
      const keys:Array<any> = base.vModel.map(tag => {
        return tag[props.defaultProp.value || props.defaultProp.label];
      });
      addItems.forEach((item:any) => {
        if (!keys.includes(item) || props.type === 'textarea') {
          let newTag = {};
          props.defaultProp.value && (newTag[props.defaultProp.value] = item);
          props.defaultProp.label && (newTag[props.defaultProp.label] = item);
          !global.$common.isEmpty(newTag) && newTags.push(newTag);
        }
      })
    }
    if(!props.preview && props.type === 'textarea' && props.limit > 0) {
      base.vModel = props.defaultProp.value ? newTags : global.$common.copy(addItems);
      setTimeout(() => {
        base.inputValue = changeInputVal(matchingSplit);
      }, 300);
    } else {
      base.vModel = props.defaultProp.value ? [...base.vModel, ...newTags] : global.$common.arrRemoveRepeat([...base.vModel, ...addItems]);
      base.inputValue = '';
    }
  }
}
// 失去焦点
const blur = () => {
  proxy.$refs[`saveTagInput-${base.pageId}`] && proxy.$refs[`saveTagInput-${base.pageId}`].blur();
  base.isFocus = false;
  setTimeout(() => {
    addTagHand();
  }, 200);
}
// 获取焦点
const focus = () => {
  if (props.limit <= 0) {
    proxy.$refs[`saveTagInput-${base.pageId}`] && proxy.$refs[`saveTagInput-${base.pageId}`].focus();
    base.isFocus = (!props.disabled && !props.readonly && selectConfig.value.addTag);
  }
}
// 弹窗位置调整
const popoverAdjust = () => {
  if (!proxy) return;
  nextTick(() => {
    const content:any = proxy.$refs[`popover-${base.pageId}`];
    if (!content) return;
    const ele = proxy.$refs[`tag-${base.pageId}`];
    const parentNode:any = content.parentNode;
    const scrollTop = global.$common.getElementScrollTop(ele);
    const viewH = window.innerHeight;
    const coordinates = global.$common.getElementOffset(ele);
    base.popoverPlacement = `${(coordinates.y + parentNode.offsetHeight + ele.offsetHeight + 30 > (scrollTop + viewH)) ? 'top' : 'bottom'}`;
  })
}
// 弹窗前
const showBefore = () => {
  popoverAdjust();
}
// 显示时触发
const popoverShow = () => {
  base.isFocus = !selectConfig.value.disabled;
  base.isShow = true;
  const inputValue = base.inputValue;
  base.inputValue = '';
  nextTick(() => {
    base.inputValue = inputValue;
    $emit('show');
  })
}
// 显示动画播放完毕后触发
const afterEnter = () => {
  proxy.$refs[`popoverTagInput-${base.pageId}`] && proxy.$refs[`popoverTagInput-${base.pageId}`].focus();
  $emit('showAfter');
}
// 隐藏时触发
const popoverHide = () => {
  $emit('hide');
  base.isShow = false;
}
// 隐藏动画播放完毕后触发
const afterLeave = () => {
  // 获取焦点触发
  nextTick(() => {
    $emit('hideAfter');
  })
}

watch(() => props.modelValue, (val:any) => {
  if (typeof val === 'string') {
    if (val === base.vModel.join(props.separStr)) return;
    base.inputValue = val;
  } else {
    if (JSON.stringify(val) === JSON.stringify(base.vModel)) return;
    let textVal = '';
    const separated = typeof props.split === 'string' ? props.split : props.split.includes('\n') ? '\n' : props.split[0];
    const propSplit = typeof props.split === 'string' ? [props.split] : props.split;

    val.forEach((item:any, index:number) => {
      if (typeof item === 'string') {
        propSplit.forEach((str:string) => {
          item.includes(str) && (item = item.replace(new RegExp(`${str}`,'g'), ''));
        })
        textVal = index > 0 ? `${textVal}${item}${separated}` : `${item}${separated}`;
      } else if (props.defaultProp.label && !global.$common.isEmpty(item[props.defaultProp.label])) {
        let newI = item[props.defaultProp.label];
        propSplit.forEach((str:string) => {
          newI.includes(str) && (newI = newI.replace(new RegExp(`${str}`,'g'), ''));
        });
        textVal = index > 0 ? `${textVal}${newI}${separated}` : `${newI}${separated}`;
      } else if (global.$common.isEmpty(props.defaultProp.label) && props.defaultProp.value && !global.$common.isEmpty(item[props.defaultProp.value])) {
        let newI = item[props.defaultProp.value];
        propSplit.forEach((str:string) => {
          newI.includes(str) && (newI = newI.replace(new RegExp(`${str}`,'g'), ''));
        });
        textVal = index > 0 ? `${textVal}${newI}${separated}` : `${newI}${separated}`;
      }
    });
    base.inputValue = textVal;
  }
  nextTick(() => {
    if (!selectConfig.value.addTag) {
      base.vModel = val;
    } else {
      addTagHand();
    }
    nextTick(() => {
      base.inputWidth = global.$common.isEmpty(base.vModel) ? '100%;' : '50px;';
    })
  })
}, {deep: true, immediate: true});

watch(() => base.vModel, (val:Array<any>) => {
  if (global.$common.isEmpty(val)) {
    base.inputValue = `${base.inputValue}inputValue`;
    nextTick(() => {
      base.inputValue = '';
    })
  }
  const isString = typeof props.modelValue === 'string';
  if (props.defaultProp.value || props.defaultProp.label) {
    let backVal = '';
    if (props.string) {
      val.forEach((item:any, index:number) => {
        if (!global.$common.isEmpty(item[props.defaultProp.value])) {
          backVal += index === 0 ? `${item[props.defaultProp.value]}` : `${props.separStr}${item[props.defaultProp.value]}`;
        } else if (!global.$common.isEmpty(item[props.defaultProp.label])) {
          backVal += index === 0 ? `${item[props.defaultProp.label]}` : `${props.separStr}${item[props.defaultProp.label]}`;
        }
      });
    }
    $emit('update:modelValue', isString ? (props.type === 'textarea' ? base.inputValue : backVal) : val);
    $emit('change', props.string ? backVal : val);
  } else {
    $emit('update:modelValue', isString ? val.join(props.separStr) : val);
    $emit('change', props.string ? val.join(props.separStr) : val);
  }
  // 由于使用了 elInput 作为输入框输入，表单验证时在输入都都会触发验证，如不多次触发验，改组件后续需要将 elInput 更改为 input
  nextTick(() => {
    base.valueValidation = `${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`;
  })
}, {deep: true});

watch(() => base.inputValue, (val:any) => {
  nextTick(() => {
    base.inputWidth = initInputWidth(val);
    popoverAdjust();
  })
}, {deep: true});

defineExpose({
  clickTag,
  clearableHand,
  closeTag,
  tagkeyup,
  blur,
  focus,
  popoverShow,
  afterEnter,
  popoverHide,
  afterLeave
});
</script>

<style lang="less">
@inputHeight: 24px;
.dyt-input-tag-demo{
  width: 100%;
}
.dyt-input-tag-content{
  display: flex;
  padding: 3px 3px 0px 3px;
  min-width: 200px;
  width: 100%;
  min-height: 32px;
  line-height: 1em;
  -webkit-appearance: none;
  border: 1px solid #DCDFE6;
  box-sizing: border-box;
  color: #606266;
  font-size: inherit;
  background-color: #FFF;
  background-image: none;
  border-radius: 4px;
  transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  &.is-disabled-tag{
    cursor: no-drop;
    background-color: var(--el-disabled-bg-color);
    .el-tag{
      cursor: no-drop;
    }
  }
  .default-tag-constent{
    width: calc(100% - 18px);
  }
  .clearable-all{
    padding-left: 0px;
    width: 18px;
    line-height: @inputHeight;
    text-align: center;
    color: var(--el-input-icon-color, var(--el-text-color-placeholder));
    i {
      margin-top: 5px;
      border-radius: 100%;
      cursor: pointer;
      // &:hover{
      //   color: #FFF;
      //   background-color: #909399;
      // }
    }
  }
  &.tag-content-focus{
    border-color: #409EFF;
    outline: 0;
  }
  &.dyt-tag-content-limit{
    display: flex;
    cursor: pointer;
    &.is-disabled-tag{
      cursor: no-drop;
    }
    .tag-limit{
      display: flex;
      flex: 100;
      width: calc(100% - 2px);
      overflow: hidden;
      .el-tag{
        position: relative;
        flex: 100;
        min-width: 60px;
        justify-content: left;
        .el-icon-close{
          position: absolute;
          // top: 50%;
          right: 2px;
          // transform: scale(.8) translate(0, -60%) !important;
        }
      }
    }
    .more-tag{
      padding: 0 0 0 3px;
      color: #ddd;
      line-height: 25px;
    }
  }
  .el-tag{
    position: relative;
    max-width: 100%;
    font-size: var(--dyt-font-size);
    line-height: 1.1em;
    cursor: pointer;
    overflow: hidden;
    .el-tag-text{
      display: inline-block;
      max-width: calc(100% - 15px);
      white-space: nowrap;
      // white-space: pre;
      font-size: var(--dyt-font-size);
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .el-icon-close{
      right: initial;
      // top: 3px;
      font-size: var(--dyt-font-size);
      vertical-align: top;
    }
    &.el-tag--info{
      margin-bottom: 3px;
      margin-right: 5px;
      vertical-align: top;
    }
  }
  .input-new-tag{
    min-width: 50px;
    max-width: 100%;
    &.tag-text-view{
      padding-left: 12px;
      height: @inputHeight;
      line-height: @inputHeight;
      color: var(--el-input-icon-color,var(--el-text-color-placeholder));
    }
    &.input-empty-tag{
      .el-input__inner,
      .el-input__wrapper
      .el-textarea__inner{
        padding-left: 12px;
        margin-bottom: 0;
        height: @inputHeight;
        line-height: @inputHeight;
        border: none;
        box-shadow: none;
        overflow: hidden;
      }
    }
    &.el-input__inner,
    &.el-input__wrapper{
      padding: 0 5px;
      height: @inputHeight;
      line-height: @inputHeight;
      border: none;
      box-shadow: none;
    }
  }
  .input-writing-tag{
    .el-input__inner,
    .el-input__wrapper{
      padding: 0;
      height: @inputHeight;
      line-height: @inputHeight;
      border: none;
      box-shadow: none;
    }
    .el-textarea__inner{
      padding: 0 0 3px 12px;
      border: none;
      box-shadow: none;
      outline: none;
    }
  }
  .tag-form-item-tool{
    display: none;
  }
}
.tag-popper-content{
  max-width: 500px;
  padding-bottom: 4px;
  padding: 12px 0;
  &.hidden-popper-content{
    display: none !important;
  }
  &.is-disabled-tag{
    .el-tag{
      cursor: default;
      .el-tag-text{
        max-width: 100%;
      }
    }
  }
  .el-tag{
    margin-right: 8px;
    margin-bottom: 8px;
    max-width: 100%;
    font-size: var(--dyt-font-size);
    cursor: pointer;
    overflow: hidden;
    .el-tag-text{
      display: inline-block;
      max-width: calc(100% - 14px);
      // white-space: nowrap;
      white-space: pre;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .el-icon-close{
      right: initial;
      // top: 3px;
      vertical-align: top;
    }
  }
  .el-input__validateIcon{
    display: none;
  }
}
</style>

<template>
  <div :ref="`tag-${pageId}`" class="dyt-input-tag-demo">
    <el-popover
      placement="bottom"
      :width="popoverWidth"
      :hide-after="100"
      trigger="click"
      :popper-class="`${limit > 0 ? ' ' : 'hidden-popper-content '}tag-popper-content`"
      @after-enter="afterEnter"
      @after-leave="afterLeave"
      @show="popoverShow"
      @hide="popoverHide"
    >
      <template #reference>
        <div
          class="dyt-input-tag-content"
          :class="{
            'dyt-tag-content-limit': limit > 0,
            'tag-content-focus': isFocus
          }"
          :style="selectConfig.style"
          @click="focus"
        >
          <template v-if="limit > 0">
            <div v-if="vModel.length > 0" class="tag-limit">
              <span v-for="(tag, index) in vModel.slice(0, limit)" :key="`tag-${index}`" class="el-tag el-tag--info" @click="clickTag(tag)">
                <span class="el-tag-text" :title="defaultProp.label ? tag[defaultProp.label] : tag">
                  {{ defaultProp.label ? tag[defaultProp.label] : tag }}
                </span>
                <Icon v-if="selectConfig.closable" class="el-tag__close el-icon-close" name="close" @click.stop="closeTag(tag)"/>
              </span>
            </div>
            <span v-else class="input-new-tag tag-text-view">
              {{ placeholder }} 
            </span>
            <div v-if="vModel.length - limit > 0 && limit > 0" class="more-tag" @click="moreHand">
              + {{ vModel.length - limit }}
            </div>
            <div v-if="vModel.length" class="clearable-all">
              <Icon class="el-tag__close el-icon-close" title="清空" name="circle-close" @click.stop="clearableHand"/>
            </div>
          </template>
          <template v-else>
            <div class="default-tag-constent">
              <span
                v-for="(tag, index) in vModel"
                :key="`tag-${index}`"
                class="el-tag el-tag--info"
                @click="clickTag(tag)"
              >
                <span
                  class="el-tag-text"
                  :title="(defaultProp.label || defaultProp.value) ? tag[defaultProp.label || defaultProp.value] : tag"
                >{{ (defaultProp.label || defaultProp.value) ? tag[defaultProp.label || defaultProp.value] : tag }}</span>
                <Icon
                  v-if="selectConfig.closable"
                  class="el-tag__close el-icon-close"
                  name="close"
                  @click.stop="closeTag(tag)"
                />
              </span>
              <el-input
                v-if="!disabled && !readonly && !(limit > 0) && selectConfig.addTag"
                :ref="`saveTagInput-${pageId}`"
                v-model="inputValue"
                :autosize="true"
                resize="none"
                :type="type"
                class="input-new-tag input-writing-tag"
                :class="{
                  'input-empty-tag': vModel.length === 0
                }"
                :placeholder="vModel.length <= 0 ? placeholder : ''"
                :style="`width:${ vModel.length > 0 && !inputValue.includes('\n') ? inputWidth: '100%;'}`"
                @keyup.enter="addTagHand"
                @keyup="tagkeyup"
                @blur="blur"
              />
            </div>
            <div v-if="vModel.length" class="clearable-all">
              <Icon class="el-tag__close el-icon-close" title="清空" name="circle-close" @click.stop="clearableHand"/>
            </div>
          </template>
        </div>
      </template>
      <template v-if="limit > 0">
        <dyt-input
          v-if="!disabled && !readonly && selectConfig.addTag"
          :ref="`popoverTagInput-${pageId}`"
          v-model="inputValue"
          :class="{
            'input-empty-tag': vModel.length === 0
          }"
          :type="type"
          :placeholder="placeholder"
          style="margin-bottom: 10px;"
          :autosize="{minRows: 2, maxRows: (preview ? 4 : 15)}"
          resize="none"
          @keyup.enter="addTagHand"
          @keyup="tagkeyup"
          @blur="blur"
        />
        <div v-if="(preview && type === 'textarea') || type !== 'textarea'" style="max-height: 300px;overflow-y: auto;overflow-x: hidden;">
          <template v-if="vModel.length > 0">
            <span v-for="(tag, index) in vModel" :key="`tag-${index}`" class="el-tag el-tag--info" @click="clickTag(tag)">
              <span class="el-tag-text" :title="(defaultProp.label || defaultProp.value) ? tag[defaultProp.label || defaultProp.value] : tag">
                {{ (defaultProp.label || defaultProp.value) ? tag[defaultProp.label || defaultProp.value] : tag }}
              </span>
              <Icon v-if="selectConfig.closable" class="el-tag__close el-icon-close" name="close" @click.stop="closeTag(tag)"/>
            </span>
          </template>
          <span v-else>暂无数据!</span>
        </div>
      </template>
    </el-popover>
  </div>
</template>
<script lang="ts">
import {defineComponent } from 'vue';
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
  vModel: Array<any>;
  pageId: string;
  inputValue: string;
  inputWidth: string;
  isFocus: boolean;
  popoverWidth: number;
  defaultConfig: {
    type: string;
    closable: boolean;
    size: string;
  }
}
export default defineComponent({
  name: 'DytInputTag',
  components: {},
  props: {
    // 绑定值， 使用 v-model 或 modelValue 绑定
    modelValue: { type: [Array, String], default: () => {return []}},
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
    split: { type: [Array, String], default: () => {return [',', '，', '\n']} },
    // 是否返回字符串
    string: { type: Boolean, default: false },
    // 返回字符串时的分隔符号（string 为 true 时生效）
    separStr: { type: String, default: ',' },
    // 值为对象时，string 必须为 false，键值替换
    defaultProp: { type: Object, default: () => {return {}} },
    // 输入框的类型, 可选值：textarea、text
    type: { type: String, default: 'text'},
    // 当 type 为 textarea 并且 limit 大于 0 生效， 下拉是否展示 tag 默认 false
    preview: { type: Boolean, default: false }
  },
  emits: ['update:modelValue','change','click','clearableHand','close','keyup','keyupEnter','addTheTag','show','showAfter','hide','hideAfter'],
  data ():dataType {
    return {
      pageId: Math.random().toString(36).substring(2),
      inputValue: '',
      vModel: [],
      inputWidth: '100%;',
      isFocus: false,
      popoverWidth: 200,
      defaultConfig: {
        type: 'info',
        closable: true,
        size: 'small'
      }
    }
  },
  computed: {
    selectConfig () {
      let config = { ...this.defaultConfig, ...this.$attrs, addTag: this.addTag };
      if (this.disabled || this.readonly) {
        config.closable = false;
        config.addTag = false;
      }
      return config;
    }
  },
  watch: {
    modelValue: {
      deep: true,
      immediate: true,
      handler (val) {
        if (this.string) {
          if (val === this.vModel.join(this.separStr)) return;
          this.vModel = this.$common.isEmpty(val) ? [] : val.split(this.separStr);
        } else {
          if (JSON.stringify(val) === JSON.stringify(this.vModel)) return;
          this.vModel = val;
        }
        // 赋值
        if(!this.preview && this.type === 'textarea' && this.limit > 0 && !this.isFocus) {
          this.inputValue = typeof val === 'string' ? `${val}` : this.$common.isEmpty(val) ? '' : this.vModel.join('\n');
        }
        this.inputWidth = this.$common.isEmpty(this.vModel) ? '100%;' : '50px;';
      }
    },
    vModel: {
      deep: true,
      handler (val) {
        this.$emit('update:modelValue', this.string ? val.join(this.separStr) : val);
        this.$emit('change', this.string ? val.join(this.separStr) : val);
        // 触发 表单验证
        this.$nextTick(() => {
          this.$parent.$emit("el.form.change");
        })
      }
    },
    inputValue: {
      deep: true,
      handler (val:string) {
        this.inputWidth = this.initInputWidth(val);
      }
    }
  },
  created () {},
  mounted () {
    // 弹出宽度设置
    this.$refs[`tag-${this.pageId}`] && (this.popoverWidth = this.$refs[`tag-${this.pageId}`].offsetWidth);
  },
  methods: {
    initInputWidth (val:string) {
      if (this.limit > 0) return '';
      const cn = val.replace(/[^\u4e00-\u9fa5]/gi,"");
      const valLength = val.length;
      return`${val ? (cn.length * 14.2 + (valLength - cn.length) * 7 + 37) + 'px;' : '50px;'}`;
    },
    clickTag (tag:any) {
      this.$emit('click', tag);
    },
    // 清空
    clearableHand () {
      this.$emit('clearableHand');
      this.inputValue = '';
      this.vModel = [];
    },
    // 移除单个 tag
    closeTag (tag:any) {
      if (this.$attrs.onClose) {
        this.$emit('close', tag);
      } else {
        if (this.defaultProp.value) {
          this.vModel = this.vModel.filter(item => {
            return item[this.defaultProp.value] !== tag[this.defaultProp.value];
          })
        } else {
          this.vModel.splice(this.vModel.indexOf(tag), 1);
        }
      }
      // 如果是多行文本，不清空输入值的情况
      if(!this.preview && this.type === 'textarea' && this.limit > 0) {
        let index = this.inputValue.indexOf(tag);
        const newSplit = typeof this.split === 'string' ? [this.split] : this.split;
        if (index > -1) {
          let newTag:any = newSplit.filter(sp => {
            return this.inputValue.includes(`${this.inputValue.substring(index, tag.length)}${sp}`);
          });
          if (newTag[0]) {
            newTag = `${this.inputValue.substring(index, tag.length)}${newTag[0]}`;
            this.inputValue = `${this.inputValue.substring(0, index)}${this.inputValue.substring(index + newTag.length)}`;
          } else {
            this.inputValue = `${this.inputValue.substring(0, index)}${this.inputValue.substring(index + tag.length)}`;
          }
        }
      }
      this.$nextTick(() => {
        this.limit > 0 && this.$refs[`popoverTagInput-${this.pageId}`] && this.$refs[`popoverTagInput-${this.pageId}`].focus();
      })
    },
    // 键盘事件
    tagkeyup (e:Object) {
      this.$emit('keyup', e);
    },
    // 字符串分割
    strSplit (str:any, splitStr:any) {
      if (this.$common.isEmpty(str)) return [];
      if (typeof str !== 'string') return str;
      if (typeof splitStr === 'string') return str.split(splitStr);
      if (this.$common.isArray(splitStr)) {
        if (splitStr.length === 0) return [str];
        let newStr = str;
        const newSplit = splitStr[0];
        splitStr.slice(1).forEach((sp:string) => {
          if(str.includes(sp)){
            newStr = newStr.replace(new RegExp(sp,'g'), newSplit);
          }
        });
        return newStr.split(newSplit).filter(item => !this.$common.isEmpty(item, true));
      }
      return [str];
    },
    // 处理多行文本内容
    changeInputVal () {
      let tagList:any = this.vModel;
      let newVal:string = '';
      let getValList:any = [];
      const textValue = this.inputValue.trim();
      if (this.defaultProp.value || this.defaultProp.label) {
        tagList = this.vModel.map((item:any) => item[this.defaultProp.value || this.defaultProp.label]);
      }
      const listL = tagList.length - 1;
      if (listL < 1) return textValue;
      tagList.forEach((item:string, index:number) => {
        if (typeof this.split === 'string') {
          if (!getValList.includes(item)) {
            if (index === listL && textValue.includes(`${this.split}${item}`)) {
              getValList.push(item);
              newVal = `${newVal}${item}\n`;
            } else if (textValue.includes(`${this.split}${item}${this.split}`) || textValue.includes(`${item}${this.split}`)) {
              getValList.push(item);
              newVal = `${newVal}${item}${this.split}`;
            }
          }
        } else if (this.$common.isArray(this.split)) {
          const split:Array<any> = this.split;
          if (split.length === 0) return textValue;
          split.forEach((sp1:string) => {
            split.forEach((sp2:string) => {
              if (!getValList.includes(item)) {
                if (index === listL && textValue.includes(`${sp2}${item}`)) {
                  getValList.push(item);
                  newVal = `${newVal}${item}\n`;
                } else if (textValue.includes(`${sp1}${item}${sp2}`) || textValue.includes(`${item}${sp2}`)) {
                  getValList.push(item);
                  newVal = `${newVal}${item}${sp2}`;
                }
              }
            })
          })
        }
      });
      return newVal;
    },
    // 
    addTagHand (e:any = {}) {
      if (e && e.key === 'Enter'){
        this.$emit('keyupEnter', e);
        if (this.type === 'textarea') return;
      }
      if (this.$common.isEmpty(this.inputValue)) {
        if(!this.preview && this.type === 'textarea' && this.limit > 0) {
          this.vModel = [];
        }
        return;
      }
      const newAddItems:any = this.strSplit(this.inputValue, this.split) || [];
      let addItems:Array<any> = this.$common.arrRemoveRepeat(newAddItems.map((item:any) => item.trim()));
      let vModelStr = this.vModel;
      if (this.defaultProp.value || this.defaultProp.label) {
        vModelStr = this.vModel.map((item:any) => item[this.defaultProp.value || this.defaultProp.label]);
      }
      addItems = addItems.filter((item:any) => !vModelStr.includes(item));

      if (this.$attrs.onAddTheTag) {
        this.$emit('addTheTag', addItems);
        this.inputValue = '';
      } else {
        let newTags:Array<any> = [];
        if (this.defaultProp.value || this.defaultProp.label) {
          const keys:Array<any> = this.vModel.map(tag => {
            return tag[this.defaultProp.value || this.defaultProp.label];
          })
          addItems.forEach((item:any) => {
            if (!keys.includes(item)) {
              let newTag = {};
              this.defaultProp.value && (newTag[this.defaultProp.value] = item);
              this.defaultProp.label && (newTag[this.defaultProp.label] = item);
              !this.$common.isEmpty(newTag) && newTags.push(newTag);
            }
          })
        }
        if(!this.preview && this.type === 'textarea' && this.limit > 0) {
          this.vModel = [...this.vModel, ...addItems];
          setTimeout(() => {
            this.inputValue = this.changeInputVal();
          }, 300);
        } else {
          this.vModel = [...this.vModel, ...(this.defaultProp.value ? newTags : addItems)];
          this.inputValue = '';
        }
      }
    },
    moreHand () {},
    // 失去焦点
    blur () {
      this.$refs[`saveTagInput-${this.pageId}`] && this.$refs[`saveTagInput-${this.pageId}`].blur();
      this.addTagHand();
      this.isFocus = false;
      // 失去焦点触发表单验证
      this.$nextTick(() => {
        this.$parent.$emit("el.form.blur");
      })
    },
    // 获取焦点
    focus () {
      if (this.limit <= 0) {
        this.$refs[`saveTagInput-${this.pageId}`] && this.$refs[`saveTagInput-${this.pageId}`].focus();
        this.isFocus = (!this.disabled && !this.readonly && this.selectConfig.addTag);
      }
      // 获取焦点触发表单验证
      this.$nextTick(() => {
        this.$parent.$emit("el.form.focus");
      })
    },
    // 显示时触发
    popoverShow () {
      this.isFocus = true;
      this.$emit('show');
    },
    // 显示动画播放完毕后触发
    afterEnter () {
      this.$refs[`popoverTagInput-${this.pageId}`] && this.$refs[`popoverTagInput-${this.pageId}`].focus();
      // 获取焦点触发表单验证
      this.$nextTick(() => {
        this.$parent.$emit("el.form.focus");
      })
      this.$emit('showAfter');
    },
    // 隐藏时触发
    popoverHide () {
      this.$emit('hide');
    },
    // 隐藏动画播放完毕后触发
    afterLeave () {
      // 获取焦点触发表单验证
      this.$nextTick(() => {
        this.$parent.$emit("el.form.blur");
        this.$emit('hideAfter');
      })
    }
  }
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
    font-size: @font-size;
    cursor: pointer;
    overflow: hidden;
    .el-tag-text{
      display: inline-block;
      max-width: calc(100% - 15px);
      white-space: nowrap;
      // white-space: pre;
      font-size: @font-size;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .el-icon-close{
      right: initial;
      // top: 3px;
      font-size: @font-size;
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
      padding: 0;
      margin-bottom: 3px;
      border: none;
    }
  }
}
.tag-popper-content{
  max-width: 500px;
  padding-bottom: 4px;
  padding: 12px 0;
  &.hidden-popper-content{
    display: none !important;
  }
  .el-tag{
    margin-right: 8px;
    margin-bottom: 8px;
    max-width: 100%;
    font-size: @font-size;
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
      top: 3px;
      vertical-align: top;
    }
  }
  .dyt-button-demo{
    width: calc(100% - @inputHeight);
    margin-left: 12px;
    .el-icon-circle-check{
      display: none;
    }
  }
  .el-input__validateIcon{
    display: none;
  }
}
</style>

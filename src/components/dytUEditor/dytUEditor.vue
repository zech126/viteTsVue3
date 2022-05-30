<template>
  <div :id="editorId" :name="props.name" v-loading="!data.editorReady" element-loading-text="资源加载中..." />
  <el-input v-model="data.hasContent" style="display:none;" />
</template>
<script lang="ts" setup>
/*
  官网地址： https://github.com/fex-team/ueditor
*/
import { reactive, computed, watch, nextTick, PropType } from 'vue';
import { editorConfig, defaultLoad } from './defaultConfig';
import getGlobal from '@/utils/global';

const global = getGlobal();
const emit = defineEmits(['update:modelValue', 'initBefore', 'ready', 'change']);

const props = defineProps({
  // 手动设置 UEditor ID
  editorId: {type: String, default: ''},
  // UEditor 配置
  config: { type: Object, default: () => {return {}} },
  // 常用于表单中 http://fex.baidu.com/ueditor/#start-submit
  name: {type: String, default: ''},
  // UEditor 绑定值
  modelValue: { type: String, default: ''},
  // 需要加载的静态资源
  staticResource: { type: Array  as PropType<{url: string, baseUrl: string}[]>, default: () => {return [{url: '', baseUrl: ''}]} },
  // 检查自定义加载的静态资源是否加载完成
  staticResLoadChecker: { type: Function as PropType<() => boolean> }
});

const data:{editor: any, editorReady: boolean, hasContent: string, [key: string]: any} = reactive({
  editor: null,
  editorReady: false,
  hasContent: ''
});

const config = computed(() => {
  return {...editorConfig, ...props.config};
});
const editorId = computed(() => {
  return props.editorId || 'editor_' + Math.random().toString(36).substring(2);
});

// 动态创建 script 标签来加载 JS 脚本，保证同一个脚本只被加载一次
const loadScript = (link:string) => {
  return new Promise<void>((resolve, reject) => {
    // 订阅加载事件，否则多个 UE 同时加载会有BUG
    window.$loadSubscribe.on(link, resolve);
    if (window.$loadSubscribe.listeners[link].requested === false) {
      window.$loadSubscribe.listeners[link].requested = true;
      // 如果这个资源从未被请求过，就手动创建脚本去加载
      const script = document.createElement('script');
      script.src = link;
      script.onload = () => {
        window.$loadSubscribe.emit(link);
      };
      script.onerror = reject;
      document.getElementsByTagName('head')[0].appendChild(script);
    }
  })
}
// 动态创建 link 标签来加载 CSS 文件
const loadCss = (link: string) => {
  return new Promise<void>((resolve, reject) => {
    window.$loadSubscribe.on(link, resolve);
    if (window.$loadSubscribe.listeners[link].requested === false) {
      window.$loadSubscribe.listeners[link].requested = true;
      const css = document.createElement('link');
      css.type = 'text/css';
      css.rel = 'stylesheet';
      css.href = link;
      css.onload = () => {
        window.$loadSubscribe.emit(link);
      };
      css.onerror = reject;
      document.getElementsByTagName('head')[0].appendChild(css);
    }
  })
};

const loadEditor = (files:Array<string| {url: string, baseUrl: string}>, baseUrl: string = '') => {
  return new Promise<void>((resolve, reject) => {
    if (global.$common.isEmpty(files) && checkerDefaultEditor()) {
      resolve();
      return;
    }
    // 把 js 和 css 分组
    const { jsLinks, cssLinks } = (files).reduce<{jsLinks: string[];cssLinks: string[];}>((res, link) => {
      // 如果不是完整的 URL 就在前面补上 UEDITOR_HOME_URL, 完整的 URL 形如：
      // 1. http://www.example.com/xxx.js
      // 2. https://www.example.com/xxx.js
      // 3. //www.example.com/xxx.js
      // 4. www.example.com/xxx.js
      let sLink = typeof link === 'string' ? link : link.url || '';
      const baseUrl = typeof link === 'string' ? (config.value?.UEDITOR_HOME_URL || '') : (link.baseUrl || '');
      const isFullUrl = /^((https?:)?\/\/)?[-a-zA-Z0-9]+(\.[-a-zA-Z0-9]+)+\//.test(sLink);
      !isFullUrl && (sLink = `${baseUrl}${sLink}`);
      if (sLink.slice(-3) === '.js') {
        res.jsLinks.push(sLink);
      } else if (sLink.slice(-4) === '.css') {
        res.cssLinks.push(sLink);
      }
      return res;
    },{ jsLinks: [], cssLinks: []});
    Promise.all([
      Promise.all(cssLinks.map((link) => loadCss(link))),
      // 动态创建 script 是先加载完的先执行，所以不可以一次性创建所有资源的引入脚本
      asyncSeries(jsLinks.map((link) => () => loadScript(link)))
    ]).then(() => {
      resolve();
    }).catch((error) => {
      reject(error)
    });
  })
}

// 按顺序执行
const asyncSeries = (funs: ((...args: any[]) => Promise<any>)[]): Promise<any> => {
  return funs.reduce((promise, fun) => promise.then(fun), Promise.resolve());
}

// 判断上面的默认资源是否已经加载过的校验函数
const checkerDefaultEditor = () => {
  // 判断 ueditor.config.js 和 ueditor.all.js 是否均已加载
  // 仅加载完ueditor.config.js时UE对象和UEDITOR_CONFIG对象存在,仅加载完ueditor.all.js时UEDITOR_CONFIG对象存在,但为空对象
  return (window.UE && window.UE.getEditor && window.UEDITOR_CONFIG && Object.keys(window.UEDITOR_CONFIG).length !== 0);
};
// 实例化编辑器
const initEditor = () => {
  // 已实例过不再实例
  if (!data.editorReady) {
    emit('initBefore', editorId.value);
    data.editor = window.UE.getEditor(editorId.value, config.value);
  }
  // 实例完成
  data.editor.ready(() => {
    !data.editorReady && emit('ready', data.editor);
    const oldContent = data.editor.getContent();
    // 当内容相等时不插入数据
    oldContent !== props.modelValue && data.editor.setContent(props.modelValue);
    // 第二次不再添加监听
    if (data.editorReady) return;
    data.editor.addListener('contentChange', () => {
      const nowContent = data.editor.getContent();
      emit('update:modelValue', nowContent);
      emit('change', nowContent);
      const hasContents = data.editor?.hasContents();
      data.hasContent = hasContents ? 'hasContents' : '';
    });
    
    if (!data.editorReady) {
      nextTick(() => {
        const hasContents = data.editor?.hasContents();
        data.hasContent = hasContents ? 'hasContents' : '';
      });
      data.editorReady = true;
    }
  });
}

watch(() => props.modelValue, () => {
  // 资源加载完成后再实例化 编辑器
  if (!global.$common.isEmpty(props.staticResource) && props.staticResLoadChecker) {
    if (props.staticResLoadChecker()) {
      loadEditor(defaultLoad).then(() => {
        data.editor ? initEditor() : nextTick(() => initEditor());
      }).catch(() => {
        throw new Error('UEditor 资源加载失败！请检查资源是否存在，UEDITOR_HOME_URL 是否配置正确！');
      });
      return;
    }
    loadEditor(props.staticResource).then(() => {
      loadEditor(defaultLoad).then(() => {
        data.editor ? initEditor() : nextTick(() => initEditor());
      }).catch(() => {
        throw new Error('UEditor 资源加载失败！请检查资源是否存在，UEDITOR_HOME_URL 是否配置正确！');
      });
    }).catch(() => {
      throw new Error('自定义资源加载失败！请检查资源是否存在');
    });
    return;
  }
  loadEditor(defaultLoad).then(() => {
    data.editor ? initEditor() : nextTick(() => initEditor());
  }).catch(() => {
    throw new Error('UEditor 资源加载失败！请检查资源是否存在，UEDITOR_HOME_URL 是否配置正确！');
  });
}, { deep: true, immediate: true});
// 向编辑器插入内容(会覆盖原来)
const setContent = (content: string, isAdd: boolean = false) => {
  data.editor?.setContent(content, isAdd);
}
// 向编辑器追加内容
const appendContent = (content: string) => {
  setContent(content, true);
}
// 获取编辑器html内容
const getContent = () => {
  return data.editor?.getContent();
}
// 获取纯文本内容
const getContentTxt = () => {
  return data.editor?.getContentTxt();
}
// 获取保留格式的文本内容
const getPlainTxt = () => {
  return data.editor?.getPlainTxt();
}
// 判断编辑器是否有内容
const hasContents = () => {
  return data.editor?.hasContents();
}
// 让编辑器获得焦点
const focus = () => {
  data.editor?.focus();
}
// 让编辑器失去焦点
const blur = () => {
  data.editor?.blur();
}
// 判断编辑器是否获得焦点
const isFocus = () => {
  return data.editor?.isFocus();
}
// 设置当前编辑区域不可编辑
const setDisabled = () => {
  data.editor?.setDisabled();
}
// 设置当前编辑区域可以编辑
const setEnabled = () => {
  data.editor?.setEnabled();
}
// 隐藏编辑器
const setHide = () => {
  data.editor?.setHide();
}
// 显示编辑器
const setShow = () => {
  data.editor?.setShow();
}
// 获得当前选中的文本
const getText = () => {
  return data.editor?.selection?.getText();
}
// 在当前光标位置插入html内容
const  cursorSetContent = (content:string) => {
  data.editor?.execCommand('inserthtml', content);
}
// 常用命令
const execCommand = (type: string, effect?: string) => {
  global.$common.isEmpty(effect) ? data.editor?.execCommand(type) : data.editor?.execCommand(type, effect);
}

defineExpose({
  loadScript,
  loadCss,
  setContent,
  appendContent,
  getContent,
  getContentTxt,
  getPlainTxt,
  hasContents,
  focus,
  blur,
  isFocus,
  setDisabled,
  setEnabled,
  setHide,
  setShow,
  getText,
  cursorSetContent,
  execCommand
});
</script>

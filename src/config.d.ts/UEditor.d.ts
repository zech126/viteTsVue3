declare interface editorType {
  UEDITOR_HOME_URL: string;
  serverUrl?: string;
  toolbars?: Array<Array<string> | {[key:string]:any} | string>;
  labelMap?: { [key: string]: any };
  lang?: string;
  langPath?: string;
  theme?: string;
  themePath?: string;
  zIndex?: number | string;
  charset?: string;
  customDomain?: boolean;
  isShow?: boolean;
  textarea?: string;
  initialContent?: string;
  autoClearinitialContent?: boolean;
  focus?: boolean;
  initialStyle?: string;
  iframeCssUrl?: string;
  indentValue?: string;
  initialFrameWidth?: number | string;
  initialFrameHeight?: number | string;
  readonly?: boolean;
  autoClearEmptyNode?: boolean;
  enableAutoSave?: boolean;
  saveInterval?: number | string;
  imageScaleEnabled?: boolean;
  fullscreen?: boolean;
  imagePopup?: boolean;
  autoSyncData?: boolean;
  emotionLocalization?: boolean;
  retainOnlyLabelPasted?: boolean;
  pasteplain?: boolean;
  filterTxtRules?: { [key: string]: any };
  allHtmlEnabled?: boolean;
  insertorderedlist?: { [key: string]: string };
  insertunorderedlist?: { [key: string]: string };
  listDefaultPaddingLeft?: number | string;
  listiconpath?: string;
  maxListLevel?: number | string;
  autoTransWordToList?: boolean;
  fontfamily?: Array<{[key: string]: string}>;
  fontsize?: Array<number | string>;
  paragraph?: { [key: string]: string };
  rowspacingtop?: Array<number | string>;
  rowspacingbottom?: Array<number | string>;
  lineheight?: Array<number | string>;
  customstyle?: Array<{[key: string]: string}>;
  enableContextMenu?: boolean;
  contextMenu?: Array<{[key: string]: any}>;
  shortcutMenu?: Array<string>;
  elementPathEnabled?: boolean;
  wordCount?: boolean;
  maximumWords?: number | string;
  wordCountMsg?: string;
  wordOverFlowMsg?: string;
  tabSize?: number | string;
  tabNode?: string;
  removeFormatTags?: string;
  removeFormatAttributes?: string;
  maxUndoCount?: number | string;
  maxInputCount?: number | string;
  autoHeightEnabled?: boolean;
  scaleEnabled?: boolean;
  minFrameWidth?: number | string;
  minFrameHeight?: number | string;
  autoFloatEnabled?: boolean;
  topOffset?: number | string;
  toolbarTopOffset?: number | string;
  pageBreakTag?: string;
  autotypeset?: { [key: string]: any};
  tableDragable?: boolean;
  disabledTableInTable?: boolean;
  sourceEditor?: string;
  codeMirrorJsUrl?: string;
  codeMirrorCssUrl?: string;
  sourceEditorFirst?: string;
  iframeUrlMap?: {[key: string]: string};
  webAppKey?: string;
  allowDivTransToP?: boolean;
  [key: string]: any;
}

declare interface loadSubscribeListeners {
  [key: string]: {
    triggered: boolean;
    requested: boolean;
    lineUp: Array<() => void>;
  }
}

declare interface Window {
  UE: { [key: string]: any };
  UEDITOR_CONFIG: editorType;
  $loadSubscribe: {
    listeners: loadSubscribeListeners;
    on:(eventName: string, callback: () => void) => void;
    emit: (eventName: string) => void;
  },
  baidu: { [key: string]: any };
  // 用于临时存储 ueditor
  temporaryStorage: { [key: string]: any };
}
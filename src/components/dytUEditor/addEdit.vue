<template>
  <dyt-dialog
    size="medium"
    v-model="dialogVisible"
    :title="(`${formData.id ? '编辑': '新增'}公告`)"
    :fixed-height="false"
    @closed="closeDrawer"
  >
    <div
      v-loading="pageLoading"
      class="add-edit-content"
    >
      <el-form
        ref="addEditForm"
        :inline="false"
        :model="formData"
        :rules="formRules"
        label-width="70px"
        class="add-edit-form"
        @submit.prevent
      >
        <el-form-item
          label="标题："
          prop="title"
        >
          <dyt-input
            v-model="formData.title"
            :clearable="true"
            placeholder="请输入公告标题，限 200 字符"
          />
        </el-form-item>
        <el-form-item
          label=""
          prop="content"
          label-width="0"
        >
          <dytUEditor
            v-model="formData.content"
            :config="editorConfig"
            editor-id="noticeEditor1"
            @initBefore="addCustomButtom"
            @ready="ready"
          />
        </el-form-item>
      </el-form>
    </div>
    <template v-slot:footer>
      <div class="foolter-button">
        <dyt-button
          type="primary"
          @click="confirm(0)"
        >
          保存为草稿
        </dyt-button>
        <dyt-button
          type="primary"
          @click="confirm(1)"
        >
          保存为发布
        </dyt-button>
        <dyt-button
          @click="closeDrawer"
        >
          取消
        </dyt-button>
      </div>
    </template>
    <el-upload
      :action="uploadUrl"
      :file-list="fileList"
      :headers="uploadHeaders"
      :data="uploadData"
      :with-credentials="true"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :auto-upload="true"
      :accept="accept.join(',')"
      :before-upload="beforeUpload"
      class="notice-upload"
    >
      <el-button type="primary">
        点击上传
      </el-button>
    </el-upload>
  </dyt-dialog>
</template>
<script>
import cookieConfig from "@/utils/cookieConfig";
const process = import.meta.env;

const getPath = () => {
  if (['dev'].includes(process.ENV_CONFIG) && [8456].includes(window.location.protocol)) return './UEditor/';
  return './UEditor/';
}

export default {
  name: 'AddEditUser',
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    refresh: {
      type: Boolean,
      default: false
    },
    moduleData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      pageLoading: false,
      dialogVisible: false,
      uploadUrl: `${window.location.protocol}//${process.VITE_UPMS_BASE}${this.api.globalApi.common.upload}`,
      fileList: [],
      accept: ['.jpg', '.jpeg', '.png', '.gif', '.bnp', '.pdf'],
      iamgeUrl: '',
      uploadHeaders: {
        withCredentials: true,
        'Accept-Language': 'zh-CN',
        Authorization: this.$common.getCookie(cookieConfig.tokenName)
      },
      uploadData: {
        pathType: 1
      },
      UE: {},
      uploadUe: {},
      title: '',
      formData: {},
      defaultData: {
        id: '',
        title: '',
        content: '',
        status: ''
      },
      formRules: {
        title: [
          { required: true, message: '请输入公告标题', trigger: 'change' },
          { max: 200, message: '公告标题限 200 字符', trigger: 'change' },
          { required: true, message: '请输入公告标题', trigger: 'blur' },
          { max: 200, message: '公告标题限 200 字符', trigger: 'blur' }
        ]
      },
      editorConfig: {
        toolbars: [
          [  //定制工具栏图标
            'fullscreen', 'source', 'undo', 'redo', 'template', 'anchor', 'bold', 'indent','italic', 'underline', 'touppercase', 'tolowercase',
            'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain',
            'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall',  'rowspacingtop', 'rowspacingbottom', 'lineheight', 
            'customstyle', 'paragraph', 'fontfamily', 'fontsize', 'insertcode',  'directionalityltr', 'directionalityrtl',  
            'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', 'imagenone', 'imageleft', 'imageright', 'imagecenter',
            'link', 'unlink', 'insertframe', 'emotion', 'map', 'background',  'horizontal', 'date', 'time', 'spechars', 'edittable',
            'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'cleardoc','deleterow', 'insertcol', 'deletecol',
            'mergecells', 'mergeright', 'mergedown',  'searchreplace', 'drafts', 'print', 'preview', 'help',
          ]
        ],
        // 访问 UEditor 静态资源的根路径
        UEDITOR_HOME_URL: getPath(),
        // 文件上传功服务端接口（http://35.201.165.105:8000/controller.php）
        serverUrl: '',
        // 初始容器高度
        initialFrameHeight: 500,
        // 编辑器不自动被内容撑高
        // autoHeightEnabled: false,
        // 初始容器宽度
        initialFrameWidth: '100%',
        // 工具栏是否浮动
        autoFloatEnabled: false
      }
    }
  },
  watch: {
    visible: {
      immediate: true,
      deep: true,
      handler (val) {
        this.dialogVisible = val;
      }
    },
    dialogVisible: {
      deep: true,
      handler (val) {
        this.$emit('update:visible', val);
        this.$nextTick(() => {
          if (val) {
            this.initData(this.moduleData);
          } else {
            this.formData = this.$common.copy(this.defaultData);
          }
        })
      }
    }
  },
  created() {},
  // 页面渲染完
  mounted() {
    
  },
  // 组件销毁前
  beforeUnmount () {},
  methods: {
    initData (val) {
      this.$nextTick(() => {
        if(!this.$common.isEmpty(val)) {
          this.$http.get(this.api.announcement.getDetails, {params: {id: val.id}}).then(res => {
            if (res.data) {
              Object.keys(this.defaultData).forEach(key => {
                if(typeof res.data[key] !== 'undefined') {
                  this.formData[key] = res.data[key];
                }
              })
            }
            this.$nextTick(() => {
              this.$refs.addEditForm && this.$refs.addEditForm.clearValidate();
            })
          }).catch(() => {
            this.$nextTick(() => {
              this.$refs.addEditForm && this.$refs.addEditForm.clearValidate();
            })
          });
          return;
        }
        this.$nextTick(() => {
          this.$refs.addEditForm && this.$refs.addEditForm.clearValidate();
        })
      })
    },
    // 关闭
    closeDrawer () {
      this.dialogVisible = false;
      this.pageUeditor = {};
    },
    // 保存
    confirm (status) {
      this.$refs.addEditForm.validate(valid => {
        if (!valid) return;
        let formData = this.$common.copy(this.formData);
        formData.content = this.UE.getContent();
        this.pageLoading = true;
        this.$http.post(this.api.announcement[formData.id ? 'update' : 'save'], {
          ...formData,
          status: status
        }, {removeEmpty: false}).then(res => {
          this.$emit('update:refresh', true);
          this.closeDrawer();
          this.$message.success('操作成功!');
          this.pageLoading = false;
          this.$nextTick(() => {
            this.dialogVisible = false;
          })
        }).catch(() => {
          this.pageLoading = false;
        })
      })
    },
    // 这里可以拿到 ue 的实例，比如 ue.getContent() 就可以拿到编辑器的html内容
    ready(ue) {
      this.UE = ue;
    },
    beforeUpload (file) {
      const reg = /.[^.]+$/;
      const fileType = reg.exec(file.name)[0];
      if (!this.accept.includes(fileType.toLocaleLowerCase())) {
        this.$message.error('请选择图片格式的文件！');
        return false;
      }
    },
    // 文件上传成功时的钩子
    uploadSuccess (response, file, fileList) {
      if (response.data) {
        this.uploadUe.execCommand('inserthtml', `<img src="${response.data}"/>`);
      }
      this.$nextTick(() => {
        this.fileList = [];
      });
    },
    // 文件上传失败
    uploadError (err, file, fileList) {
      this.$message.error(err.msg || '插入图片失败，请尝试重新插入！');
    },
    // 自定义按钮(上传图片功能)
    addCustomButtom (editorId) {
      // var that = this;
      window.UE.registerUI('upload-image', (editor, uiName) => {
        // 注册按钮执行时的 command 命令，使用命令默认就会带有回退操作
        editor.registerCommand(uiName, {
          execCommand: () => {
            editor.execCommand('inserthtml', ``);
          }
        })

        // 创建一个 button
        let btn = new window.UE.ui.Button({
          // 按钮的名字
          name: uiName,
          // 提示
          title: '插入图片',
          // 需要添加的额外样式，可指定 icon 图标，图标路径参考常见问题 2
          cssRules: "background-position: -380px 0px;",
          // 点击时执行的命令
          onclick: () => {
            const noticeUpload = document.querySelector('.notice-upload .el-upload');
            if (!noticeUpload) return;
            noticeUpload.click();
            this.uploadUe = editor;
          }
        });
        // 当点到编辑内容上时，按钮要做的状态反射
        editor.addListener('selectionchange', () => {
          let state = editor.queryCommandState(uiName);
          if (state === -1) {
            btn.setDisabled(true);
            btn.setChecked(false);
          } else {
            btn.setDisabled(false);
            btn.setChecked(state);
          }
        });
        // 因为是添加 button，所以需要返回这个 button
        return btn;
      },
      /* 指定添加到工具栏上的哪个位置，默认时追加到最后 */
      46,
      /* 指定这个 UI 是哪个编辑器实例上的，默认是页面上所有的编辑器都会添加这个按钮 */
      editorId);
    }
  }
};
</script>
<style lang="scss">
// .add-edit-content{}
#edui_fixedlayer{
  z-index: 99999999 !important;
}
.edui-default .edui-toolbar .edui-button,
.edui-default .edui-toolbar .edui-splitbutton,
.edui-default .edui-toolbar .edui-menubutton,
.edui-default .edui-toolbar .edui-combox{
  line-height: 1em;
}
.notice-upload{
  display: none;
}
</style>
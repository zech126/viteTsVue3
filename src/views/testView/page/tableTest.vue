<template>
  <div style="height:100%;">
    <div style="padding: 15px;">
      你好啊，，我占位了
    </div>
    <dyt-table
      :filter-fields="filterFields"
      :filter-model="filterModel"
      :filter-config="filterConfig"
      :table-columns="tableColumns"
      :table-confog="tableConfog"
      :content-data-map="contentDataMap"
      :request-before="transformRequestData"
      :pagination-config="paginationConfig"
      :request-handler="requestHandler"
      @filterReset="filterReset"
      @select-all="selectAll"
    >
      <template #head>
        顶部插槽：权限（{{power}}），，，，，
        <dyt-date-picker v-model="datePicker">
          <template #default="cell">
            <div class="dateCell" :class="{ current: cell.isCurrent }">
              <span class="text">{{ cell.text }}</span>
              <span v-if="isHoliday(cell)" class="holiday"></span>
            </div>
          </template>
        </dyt-date-picker>
        <dyt-input-tag
          style="margin:0 0 0 10px; width: 300px; display:inline-block; vertical-align: top;"
          v-model="inputTag"
          :string="true"
        />
        
      </template>
      <template v-slot:filterTop>
        <div style="height: 30px">
          我是搜索栏上面插槽
        </div>
      </template>
      <template v-slot:filterBottom>
        <div style="height: 30px">
          我是搜索栏下面插槽
        </div>
      </template>
      <!-- <template v-slot:append>
        <div style="padding: 30px">
          插入至表格最后一行之后的内容， 如果需要对表格的内容进行无限滚动操作，可能需要用到这个 slot。 若表格有合计行，该 slot 会位于合计行之上。
        </div>
      </template> -->
      <template v-slot:tableTop>
        <div style="height: 30px">
          列表上面插槽
        </div>
      </template>
      <template v-slot:tableRight>
        <div style="width: 100px">
          列表右侧插槽
        </div>
      </template>
      <template v-slot:tableBottom>
        <div style="height: 30px">
          列表下面插槽
        </div>
      </template>
      <template v-slot:tableLeft>
        <div style="width: 100px">
          列表左侧插槽
        </div>
      </template>
      <!-- 搜索栏插槽 -->
      <template v-slot:filter-commonStr6>
        <dyt-input v-model="filterModel.commonStr6" placeholder="搜索栏插槽"/>
      </template>
      <!-- 自定义表头 -->
      <template v-slot:name-header="{column, $index }">
        {{ column.property }}-自定义表头-{{ $index + 1 }}
      </template>
      <!-- 自定义内容 -->
      <!-- <template v-slot:myName1-content="{column, $index }">
        {{ column.property }}-自定义内容-{{ $index + 1 }}
      </template> -->
      <!-- 自定义表头 -->
      <!-- <template v-slot:myName-header="{column, $index }">
        {{ column.property }}-自定义表头和内容-{{ $index + 1 }}
      </template> -->
      <!-- 自定义内容 -->
      <!-- <template v-slot:myName-content="{row, column }">
        {{column.property}}-{{ row.name }}
      </template> -->
      <!-- 自定义列内容 插槽里面使用 el-table-column 开启列拖拽，当前列无效-->
      <template v-slot:myName1="{columnConfig}">
        <el-table-column v-bind="columnConfig">
          <template v-slot="{row, column, $index }">
            {{column.label}}-自定义内容-{{ row.name }}-{{ $index + 1 }}
          </template>
        </el-table-column>
      </template>
      <!-- 自定义表头和内容 插槽里面使用 el-table-column 开启列拖拽，当前列无效-->
      <template v-slot:myName="{columnConfig}">
        <el-table-column v-bind="columnConfig">
          <template v-slot:header="{column, $index}">
            {{columnConfig.slot}}-{{ column.label }}-{{ $index + 1 }}
          </template>
          <template v-slot="{row, column, $index }">
            {{columnConfig.slot}}-{{column.label}}-{{ row.name }}-{{ $index + 1 }}
          </template>
        </el-table-column>
      </template>
      <template v-slot:paginationTop>
        <div style="height: 30px">
          翻页功能上面插槽
        </div>
      </template>
      <template v-slot:paginationBottom>
        <div style="height: 30px">
          翻页功能下面插槽
        </div>
      </template>
    </dyt-table>

    <dyt-dialog
      v-model="dialogVisible"
      title="Tips"
      width="30%"
    >
      <span>This is a message</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="dialogVisible = false">Confirm</el-button>
        </span>
      </template>
    </dyt-dialog>
  </div>
</template>


<script lang="tsx">
import { defineComponent } from 'vue';
// 注意：如需要使用 jsx 请在 script 标签上标注上 lang="tsx"

const options = [
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
      ];

export default defineComponent({
  name: "tableTest",
  components: {},
  props: {},
  data() {
    return {
      dialogVisible: false,
      inputTag: '2,854,84',
      holidays: ['2022-02-01', '2022-02-02', '2022-02-03', '2022-02-04', '2022-08-09'],
      datePicker: '',
      filterConfig: {
        validRules: {
          commonStrA: [
            {required: true, trigger: 'blur', message: '请输入'},
            {required: true, trigger: 'change', message: '请输入'}
          ],
          commonStr6: [
            {required: true, trigger: 'blur', message: '请输入'},
            {required: true, trigger: 'change', message: '请输入'}
          ],
          superAdmin2: [
            {required: true, trigger: 'blur', message: '请选择'},
            {required: true, trigger: 'change', message: '请选择'}
          ],
          superAdmin3: [
            {required: true, trigger: 'blur', message: '请输入'},
            {required: true, trigger: 'change', message: '请输入'}
          ],
          superAdmin4: [
            {required: true, trigger: 'blur', message: '请输入'},
            {required: true, trigger: 'change', message: '请输入'}
          ],
          superAdmin5000: [
            // {required: true, trigger: 'blur', message: '请选择'},
            {required: true, trigger: 'change', message: '请选择'}
          ],
          commonStr2: [
            {required: true, trigger: 'blur', message: '请输入'},
            {required: true, trigger: 'change', message: '请输入'}
          ],
          commonStr10: [
            {required: true, trigger: 'blur', message: '请选择日期'},
            {required: true, trigger: 'change', message: '请选择日期'}
          ],
          commonStr1: [
            {required: true, trigger: 'blur', message: '请选择日期'},
            {required: true, trigger: 'change', message: '请选择日期'}
          ]
        }
      },
      filterModel: {
        commonStrA: 'ghdf',
        commonStr6: 'common-Str6',
        commonStr2: 'commonStr2',
        commonStr1: new Date(),
        commonStr10: [new Date(), new Date()],
        superAdmin2: ['1'],
        superAdmin3: 'superAdmin, areyghesgfher, 你好大发生过',
        superAdmin4: '  textarea  , ,   sretg ,  srtyu  ,  sretg8 ',
        // superAdmin4: ['textarea, ,', 'sre tg', 'srtyu  ', ' srtyu ', ' sretg8 '],
        superAdmin5000: ['value-1-1-1']
      },
      filterFields: [
        {
          type: 'text', model: 'commonStrA', label: '员工账号、姓名、工号', componentProps: {},
          events: {
            input: (val:string) => {
              console.log('调用-commonStr', val)
            }
          }
        },
        { model: 'commonStr6', label: '插槽测试', slot: true },
        {
          model: 'commonStr2', label: 'render 方法',
          render: () => {
            let filterModel:any = this.filterModel;
            return <dyt-input
              v-model={filterModel.commonStr2}
              onInput={(val:string) => {
                filterModel.commonStr2 = val;
              }}
            />
          }
        },
        {
          type: 'date', model: 'commonStr1', label: '日期选择',
          events: {
            change: (val:string|number|Date|Array<string|number|Date>) => {
              console.log('日期选择', val)
            }
          },
          componentProps: {
            // format: 'YYYY-MM-DD',
            'value-format': 'YYYY-MM-DD HH:mm:ss'
          }
        },
        {
          type: 'date', model: 'commonStr10', label: '日期范围选择',
          events: {
            change: (val:string|number|Date|Array<string|number|Date>) => {
              console.log('日期范围选择', val)
            }
          },
          componentProps: {
            type: 'daterange',
            format: 'YYYY-MM-DD',
            'value-format': 'YYYY-MM-DD HH:mm:ss'
          }
        },
        {
          type: 'select',
          model: 'superAdmin2',
          label: '测试异步',
          options: () => {
            return new Promise(reslove => {
              setTimeout(() => {
                reslove([
                  {label: '全部', value: '0'},
                  {label: 'label1', value: '1'},
                  {label: 'label2', value: '2'},
                  {label: 'label3', value: '3'},
                  {label: 'label4', value: '4'},
                  {label: 'label5', value: '5'}
                ])
              }, 2000)
            })
          },
          componentProps: {
            multiple: true
          }
        },
        {
          model: 'superAdmin3',
          label: 'dyt-input-tag',
          render: () => {
            let filterModel:any = this.filterModel;
            return <dyt-input-tag
              style="width: 500px;"
              v-model={filterModel.superAdmin3}
              string={true}
              disabled={false}
              limit={1}
              defaultProp = {{value: 'value', label: 'label'}}
              onChange={(val:any) => {
                filterModel.superAdmin3 = val;
              }}
            />
          }
        },
        {
          type: 'tag', model: 'superAdmin4', label: 'input-tag-textarea',
          style: { width: '300px' },
          componentProps: { disabled: false, string: true, limit: 2}
        },
        {
          type: 'treeSelect', model: 'superAdmin5000', label: 'dyt-tree-select',
          style: { width: '300px' },
          componentProps: {
            data: options,
            multiple: true,
            limit: 1
          }
        }
      ],
      tableConfog: {
        // 打开页面立即加载数据
        autoload: true,
        // 是否开启行拖拽排序
        enableRowSort: true,
        // 是否开启列拖拽排序
        enableColSort: true,
        // 表格是否多选
        multiple: true,
        // 开启表格多选时有效
        // selectable (row, index) {},
        // 开启自定义索引，类型： boolean 或 function
        // indexMethod: (index) => {
        //   return index + 1;
        // }
      },
      // 表格列设置
      tableColumns: [
        {
          label: '账号', prop: 'username', align: 'center', 'width': '200', sortable: true,
          // render: (h, {row}) => {
          //   return row.username
          // }
        },
        {
          label: '姓名', prop: 'name', align: 'center', 'width': '200',
          // 使用 render 时 events 失效
          events: {
            click: ({row}:any, e:any) => {
              console.log('click', row, e)
            }
          }
        },
        {slot: 'myName', label: '自定义表头和内容', align: 'center', 'min-width': '230'},
        {slot: 'myName1', label: '自定义内容', align: 'center', 'min-width': '230'},
        {label: '电话', prop: 'phone', align: 'center', 'min-width': '120'},
        {label: '邮箱', prop: 'email', align: 'center', 'width': '200'},
        {label: '部门', prop: 'deptName', align: 'center', 'min-width': '200'},
        {label: '工号', prop: 'employeeNo', align: 'center', 'width': '150'},
        // 注意：如需要使用 jsx 请在 script 标签上标注 上 lang="jsx"
        {
          label: '操作', fixed: 'right', align: 'center', 'width': '150',
          render: ({row}:any) => {
            return new Promise((resolve) => {
              const operate = <div>
                <el-button
                  {...{
                    size: 'small',
                    type: 'primary',
                    onclick: () => {
                      this.$message({ message: '你点击了编辑按钮', type: 'warning'});
                      this.showDialog();
                      console.log(row);
                    }
                  }}
                >编辑</el-button>
                <el-button
                  {...{
                    size: 'small',
                    type: 'danger',
                    onclick: () => {
                      this.$message({ message: '你点击了删除按钮', type: 'warning'});
                      console.log(row);
                    }
                  }}
                >删除</el-button>
              </div>;
              resolve(operate);
            });
          }
        },
      ],
      // 翻页设置
      paginationConfig: {
        // 条数
        'page-size': 10,
        // 页码
        'page-num': 1,
        // 是否显示翻页功能
        showPagination: true,
        // 发起请求时条数和页码键值替换
        pageProdKeys: {
          'page-size': 'pageSize',
          'page-num': 'pageNum'
        }
      },
      // 数据设置
      contentDataMap: { rows: 'reslove.list', total: 'reslove.total', errorInfos: 'msg' },
      tableTotal: Number((Math.random() * Math.random()).toString().substring(2, 7))
    };
  },
  watch: {
    inputTag: {
      deep: true,
      handler (val) {
        console.log(val)
      }
    }
  },
  computed: {
    power () {
      return this.$common.getPower('systemManagement')
    }
  },
  mounted () {
    setTimeout(() => {
      this.filterModel.commonStr6 = 'wuzecheng'
    }, 5000)
  },
  methods: {
    // 发送请求前处理，可用于验证以及参数修改, 如果返回 false， 则不会执行 requestHandler 方法发起请求
    transformRequestData (requestData:{[key:string]: any}) {
      let request = this.$common.copy(requestData);
      return request
    },
    // 获取列表数据
    requestHandler (requestData:{[key:string]: any}) {
      let tableList:Array<any> = [];
      const origination = (requestData.pageNum - 1) * requestData.pageSize;
      const remaining = this.tableTotal - origination;
      const pageSize = remaining > requestData.pageSize ? requestData.pageSize : remaining;
      for (let i = 0; i < pageSize; i ++) {
        tableList.push({
          username: `username-${origination + i + 1}`,
          name: `name-${origination + i + 1}`,
          phone: `phone-${origination + i + 1}`,
          email: `email-${origination + i + 1}`
        })
      }
      return new Promise((reslove, reject) => {
        setTimeout(() => {
          reslove({
            reslove: {
              list: tableList,
              total: this.tableTotal,
            },
            msg: ''
          })
        }, Math.random() * Math.random() * 5000)
      });
    },
    filterReset () {
      this.filterModel.commonStr6 = 'commonStr6';
      this.filterModel.commonStr2 = 'commonStr2';
    },
    selectAll (selection:Array<any>) {
      this.$message({
        message: `你${selection.length === 0 ? '取消全选' : '全选数据了'}`,
        type: 'warning'
      })
    },
    isHoliday ({ dayjs }:any) {
      return this.holidays.includes(dayjs.format('YYYY-MM-DD'))
    },
    showDialog () {
      this.dialogVisible = true;
    },
  }
});
</script>
<style lang="less">
.dateCell {
  height: 100%;
  .text {
    width: 24px;
    height: 24px;
    display: block;
    margin: 0 auto;
    line-height: 24px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 50%;
  }
  .holiday {
    position: absolute;
    width: 6px;
    height: 6px;
    background: red;
    border-radius: 50%;
    bottom: 0px;
    left: 50%;
    transform: translateX(-50%);
  }
  &.current{
    .text {
      background: purple;
      color: #fff;
    }
  }
}
</style>

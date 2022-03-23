<template>
  <el-date-picker
    :ref="pageId"
    v-bind="selectConfig"
    class="dyt-date-picker-demo"
  >
    <template v-for="slot in slots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>
  </el-date-picker>
</template>
<script lang="ts">

export default {
  name: 'DytDatePicker',
  isGlobal: true,
  components: {},
  props: {
    moduleData: {
      type: Object, default: () => {return {}}
    }
  },
  data () {
    return {
      pageId: Math.random().toString(36).substr(2),
      // 按类型配置
      pickerProps: {
        default: {
          placeholder: '请选择',
          shortcuts: [
            {
              text: '今天',
              value: new Date()
            },
            {
              text: '昨天',
              value: this.dateAdd(-1, 'day')
            },
            {
              text: '一周前',
              value: this.dateAdd(-7, 'day')
            },
            {
              text: '一月前',
              value: this.dateAdd(-1, 'month')
            }
          ]
        },
        dateRange: {
          'range-separator': '-',
          'start-placeholder': '开始日期',
          'end-placeholder': '结束日期',
          shortcuts: [
            {
              text: '最近一周',
              value: [this.dateAdd(-7, 'day'), new Date()]
            },
            {
              text: '最近一个月',
              value: [this.dateAdd(-1, 'month'), new Date()]
            },
            {
              text: '最近三个月',
              value: [this.dateAdd(-3, 'month'), new Date()]
            }
          ]
        }
      },
      defaultConfig: {
        size: 'default',
        align: 'right',
        'unlink-panels': true,
        'format': 'YYYY-MM-DD HH:mm:ss',
        'value-format': 'YYYY-MM-DD HH:mm:ss',
        'picker-options': {}
      }
    }
  },
  computed: {
    slots () {
      return Object.keys(this.$slots)
    },
    selectConfig () {
      let config:any = {};
      if (this.$attrs.type && this.$attrs.type.includes('range')) {
        config = {...this.defaultConfig, ...this.pickerProps.dateRange, ...this.$attrs};
      } else {
        config = {...this.defaultConfig, ...this.pickerProps.default, ...this.$attrs};
      }
      if (config.disabled || config.readonly) {
        config.placeholder = '';
      }
      return config;
    }
  },
  watch: {},
  created () {},
  mounted () {},
  methods: {
    dateAdd (add:number = 0, type:string = 'day', oldDate:Date = new Date()) {
      return new Date(this.$dayjs(oldDate).add(add, type));
    },
    focus (focusStartInput:any) {
      this.$refs[this.pageId] && this.$refs[this.pageId].focus(focusStartInput);
    }
  }
};
</script>
<style lang="scss">
// .dyt-date-picker-demo{}
.cell {
  height: 30px;
  padding: 3px 0;
  box-sizing: border-box;
}
.cell .text {
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
.cell.current .text {
  background: purple;
  color: #fff;
}
.cell .holiday {
  position: absolute;
  width: 6px;
  height: 6px;
  background: red;
  border-radius: 50%;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
}
</style>

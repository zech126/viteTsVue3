import { defineComponent, reactive } from 'vue'

export const component1 = defineComponent({
  props: {
    canshu: {type: String, defualt: ''}
  },
  // setup 无法通过this访问当前vue实例, 双向绑定时必须使用 ref 赋值，改变 ref 下的 value
  setup (props) {
    let reac = reactive({index: 0});
    const hand = () => {
      reac.index++;
      console.log('我被点击了')
    }
    return () => <div onClick={hand}>这是Vue JSX 参数：{props.canshu}-{reac.index}</div>
  }
})
export const component2 = defineComponent({
  props: {
    canshu: {type: String, defualt: ''}
  },
  data: () => {
    return {
      index: 0
    }
  },
  render () {
    const hand = () => {
      this.index++;
      console.log('哎呀！我被点击了')
    }
    return (<div onClick={hand}>组件2，这是Vue JSX, 参数：{this.canshu}-{this.index}</div>)
  }
})
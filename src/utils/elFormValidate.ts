import { inject } from 'vue';
function useElFormItem() {
  const elFormItem = inject('elFormItem');
  // 触发element-plus 的 el-form-item的校验事件
  const elFormEmit = value => {
    if (elFormItem) {
      elFormItem.formItemMitt.emit('el.form.blur', value);
      elFormItem.formItemMitt.emit('el.form.change', value);
    }
  };
  return elFormEmit;
}
export default useElFormItem;
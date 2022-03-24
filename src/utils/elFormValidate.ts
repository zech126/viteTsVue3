import { inject } from 'vue';
const elFormValidate = () => {
  const formItem: any = inject('elFormItem');
  // 触发element-plus 的 el-form-item 的校验事件
  const elValidate = (value: any) => {
    if (formItem) {
      formItem.formItemMitt.emit('el.form.blur', value);
      formItem.formItemMitt.emit('el.form.change', value);
    }
  };
  return { formItem, elValidate }
}
export default elFormValidate;
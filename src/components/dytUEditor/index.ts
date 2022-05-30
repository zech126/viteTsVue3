import dytUEditor from './dytUEditor.vue';
import { LoadEvent } from './loadSubscribe';
window.$loadSubscribe = new LoadEvent();
export default dytUEditor;
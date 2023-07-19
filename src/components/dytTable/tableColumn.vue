<template>
  <el-table-column v-bind="columnItem">
    <template v-slot="scope">
      <!-- 存在子级 -->
      <template v-if="columnChild && columnChild.length > 0">
        <table-column
          v-for="(item, index) in columnChild"
          :column-item="{
            'show-overflow-tooltip': true,
            ...item,
            'min-width': item['min-width'] || item.minWidth,
            align: (data.columnAlign.includes(item.align) ? item.align : 'center')
          }"
          :cloumn-render-key="`${props.cloumnRenderKey}-${index}`"
          :cloumn-event-key="`${props.cloumnEventKey}-${index}`"
          :cloumns-render="props.cloumnsRender"
          :cloumns-events="props.cloumnsEvents"
          :key="`column-${index}`"
        >
          <template v-for="(sItem, index) in slots" v-slot:[sItem]="scope" :key="`slot-${index}`">
            <slot :name="sItem" v-bind="scope">{{ scope.row[item.prop] }}</slot>
          </template>
        </table-column>
      </template>
      <!-- 末级 -->
      <template v-else>
        <slot :name="`${columnItem.prop}-content`" v-bind="scope">
          <dyt-node
            v-if="typeof cloumnsRender[props.cloumnRenderKey] === 'function'"
            :node="cloumnsRender[props.cloumnRenderKey]"
            :prop="scope"
          />
          <div v-else class="table-ellipsis-tips"
            v-on="!!cloumnsEvents[props.cloumnEventKey] ? {
              ...((scope:any) => {
                let eventObj = {};
                Object.keys(cloumnsEvents[props.cloumnEventKey]).forEach(eventKey => {
                  eventObj[eventKey] = (e:any) => {
                    return cloumnsEvents[props.cloumnEventKey][eventKey](scope, e);
                  }
                })
                return eventObj;
              })(scope)
            }: {}"
          >
            {{ scope.row[columnItem.prop] }}
          </div>
        </slot>
      </template>
    </template>
    <!-- 表头 -->
    <template v-if="columnItem.prop && slots.includes(`${columnItem.prop}-header`)" v-slot:header="scope">
      <slot :name="`${columnItem.prop}-header`" v-bind="scope">
        {{ scope.column.label }}
      </slot>
    </template>
  </el-table-column>
</template>

<script lang="ts" setup>
import getGlobal from '@/utils/global';
import { reactive, computed, PropType, useSlots } from 'vue';

interface dataType{
  columnAlign: Array<any>;
}

const $slots = useSlots();
const global = getGlobal();

const props = defineProps({
  columnItem: { type: Object as PropType<{[key:string]: any}>, default: () => {return {}} },
  cloumnsRender: { type: Object as PropType<{[key:string]: any}>, default: () => {return {}} },
  cloumnsEvents: { type: Object as PropType<{[key:string]: any}>, default: () => {return {}} },
  cloumnRenderKey: { type: String, default: '' },
  cloumnEventKey: { type: String, default: '' }
});

const data:dataType = reactive({
  columnAlign: ['left', 'center', 'right']
});
// 列
const columnItem = computed(() => {
  const item = global.$common.copy(props.columnItem);
  // if (!global.$common.isEmpty(item.children)) {
  //   delete item.prop;
  // }
  delete item.children;
  return item
});
// 子级
const columnChild = computed(() => {
  const item = global.$common.copy(props.columnItem);
  return item.children;
});
// 插槽
const slots = computed(() => {
  return Object.keys($slots)
});

</script>

<style lang="less" scoped>
.dyt-table-column{
  position: relative;
}
</style>

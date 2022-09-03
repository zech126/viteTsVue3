<template>
  <svg :class="`svg-icon ${props.name}`" aria-hidden="true" v-bind="svgConfig">
    <use :xlink:href="`#${props.name}`"></use>
  </svg>
</template>

<script lang="ts" setup>
  import { computed, useAttrs } from 'vue';
  const props = defineProps({
    name: { type: String, required: true }
  })
  const svgConfig = computed(() => {
    return useAttrs();
  })
</script>

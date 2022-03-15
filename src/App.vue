<template>
  <layout>
    <!-- 使用页面缓存 -->
    <keep-alive :key="keepKey">
      <router-view v-if="keepAlive" />
    </keep-alive>
    <!-- 不使用页面缓存 -->
    <router-view v-if="!keepAlive" />
</layout>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRouter } from "vue-router";
// import { useStore } from 'vuex';
// import $api from '$api';
import layout from '@/layout/index.vue'
const $route = useRouter();
const keepKey = computed(() => {
  return $route.currentRoute.value.fullPath;
})
const keepAlive = computed(() => {
  const meta = $route.currentRoute.value.meta || {};
  return typeof meta.keepAlive === 'boolean' ? meta.keepAlive : false;
})
// console.log($api);
</script>

<template>
  <router-view v-slot="{ Component, route }">
    <layout :route-info="route">
      <!-- 使用缓存 -->
      <keep-alive>
        <component :is="Component" :key="`keep-alive-${route.fullPath}`" v-if="route.meta.keepAlive" />
      </keep-alive>
      <!-- 不使用缓存 -->
      <component :is="Component" :key="route.fullPath" v-if="!route.meta.keepAlive" />
    </layout>
  </router-view>
</template>

<script lang="ts" setup>
import layout from '@/layout/index.vue'
</script>

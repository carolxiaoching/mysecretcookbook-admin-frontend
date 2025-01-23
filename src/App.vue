<template>
  <Loading v-model:active="isLoading" :can-cancel="false" :is-full-page="true" :z-index="1060" />
  <Toast />
  <div class="bgImg">
    <RouterView :key="$route.fullPath" />
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import loadingStore from '@/stores/loadingStore.js';
import Toast from '@/components/ToastComponent.vue';

const loadingRef = loadingStore();
const { isLoading } = storeToRefs(loadingRef);

// 解決 Bootstrap Modal 關閉後焦點問題
// https://github.com/twbs/bootstrap/issues/41005
window.addEventListener('hide.bs.modal', () => {
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
});
</script>

<style lang="scss">
@import '@/assets/scss/all.scss';
</style>

<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import AppLayout from './components/AppLayout.vue';

import { useSettingsStore } from './stores-v2/settings.store';

const settings = useSettingsStore();

settings.$subscribe((_mutation, _state) => {
  settings.save();
})

onMounted(() => {
  settings.load();
});
</script>

<template>
  <AppLayout>
    <RouterView />
  </AppLayout>
</template>

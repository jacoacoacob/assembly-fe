<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import AppLayout from './components/AppLayout.vue';

import { usePreferencesStore } from './stores-v2/preferences.store';

const prefs = usePreferencesStore();

prefs.$subscribe((_mutation, _state) => {
  prefs.saveLocal();
})

onMounted(() => {
  prefs.loadLocal();
});
</script>

<template>
  <AppLayout>
    <RouterView />
  </AppLayout>
</template>

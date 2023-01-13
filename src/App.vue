<script setup lang="ts">
import { RouterView } from 'vue-router';
// import WelcomeScreen from './components/WelcomeScreen.vue';
import { ref } from 'vue';

type AppView = "welcome" | "game";

const view = ref<AppView>("welcome");
</script>

<template>
  <RouterView />
  <!-- <WelcomeScreen v-if="view === 'welcome'" />
  <WelcomeScreen v-if="view === 'game'" /> -->
</template>

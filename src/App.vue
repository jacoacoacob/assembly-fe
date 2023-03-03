<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import AppLayout from './components/AppLayout.vue';
import { useSessionStore } from './stores-v2/session.store';
import { supabase } from './supabase';

const session = useSessionStore();

onMounted(() => {
  supabase.auth.onAuthStateChange((event, session_) => {
    console.log("[onAuthStateChange] event", event);
    session.user = session_?.user ?? null;
  });
});
</script>

<template>
  <AppLayout>
    <RouterView />
  </AppLayout>
</template>

<script setup lang="ts">
import { useSessionStore } from '@/stores-v2/session.store';
import { supabase } from '@/supabase';

const session = useSessionStore();


</script>

<template>
    <button
        v-if="session.isLoggedIn"
        class="button button-text button-dense"
        @click="supabase.auth.signOut"
    >
        Sign out
    </button>
</template>
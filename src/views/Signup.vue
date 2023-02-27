<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

import { supabase } from '@/supabase';
import AppInput from '@/components/AppInput.vue';

const route = useRoute();

onMounted(() => {
    console.log(route.hash)
})

</script>

<template>
    <h1>Welcome </h1>
    {{ JSON.stringify(route, null, 2) }}
    <pre>
    </pre>
    <AppInput />
</template>

<script setup lang="ts">
import { ref } from "vue";

import { useSessionStore } from "@/stores-v2/session.store";
import GInput from "../lib/GInput.vue";

const session = useSessionStore();

</script>

<template>
    <div>
        Welcome game owner!
        <p>Admin link</p>
        <p>Guest link</p>
    </div>
</template>
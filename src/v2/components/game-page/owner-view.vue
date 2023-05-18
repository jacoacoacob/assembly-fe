<script setup lang="ts">
import GInput from "../lib/GInput.vue";
import { useSessionStore } from "@/v2/stores/session-store";
import { useGameStore } from "@/v2/stores/game-store";

const session = useSessionStore();
const game = useGameStore();

</script>

<template>
    <div>
        Welcome game owner!
        <p>Admin link</p>
        <p>Guest link</p>
        <p>Set Game Name</p>
        
    </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { loadGame } from '@/api/game-api';
import { useGameStore } from '@/stores/game.store';
import TheBoard from '@/components/TheBoard.vue';

const route = useRoute();
const gameStore = useGameStore();

onMounted(() => {
    const game = loadGame(route.params.name as string);
    if (game) {
        gameStore.$patch(game);
    }
});
</script>

<template>
    <h1 class="text-xl font-bold">It's a GAME {{ $route.params.gameName }}</h1>
    <TheBoard />
</template>
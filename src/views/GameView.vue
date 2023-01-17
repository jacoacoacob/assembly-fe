<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { loadGame } from '@/api/game-api';
import { useGameDataStore } from '@/stores/game-data.store';
import TheBoard from '@/components/TheBoard.vue';
import TheSidePanel from '@/components/TheSidePanel.vue';
import { useGameStateStore } from '@/stores/game-state.store';

const route = useRoute();
const gameDataStore = useGameDataStore();
const gameStateStore = useGameStateStore();

onMounted(() => {
    const gameData = loadGame(route.params.name as string);
    if (gameData) {
        gameDataStore.$patch(gameData);
    }
});
</script>

<template>
    <div class="flex space-x-8 w-full px-8">
        <TheBoard />
        <TheSidePanel class="flex-1 w-full" />
    </div>
</template>
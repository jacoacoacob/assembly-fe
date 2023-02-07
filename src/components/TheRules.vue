<script setup lang="ts">
import { computed } from 'vue';

import { useGameDataStore } from '@/stores-v2/game-data.store';
import { useGameStateStore } from '@/stores-v2/game-state.store';

const gameData = useGameDataStore();
const gameState = useGameStateStore();

const style = computed(() => ({
    width: `${gameData.grid.cols * gameData.grid.tileSize}px`,
    height: `${gameData.grid.rows * gameData.grid.tileSize}px`
}));

const className = computed(() => ({
    "border-2": gameState.currentState === "place_tokens",
}));
</script>

<template>
    <div
        class="border border-slate-500 box-content"
        :class="className"
        :style="style"
    >
        <div
            class="p-2 h-full"
            :class="{ 'border border-slate-500': gameState.currentState === 'play' }"
        >
            The rules
            ...
            more to come
        </div>
    </div>
</template>
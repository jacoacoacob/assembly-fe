<script setup lang="ts">
import { computed } from 'vue';

import { useGameDataStore } from '@/stores-v2/game-data.store';

const gameData = useGameDataStore();

const style = computed(() => ({
    width: `${gameData.grid.cols * gameData.grid.tileSize}px`,
    height: `${gameData.grid.rows * gameData.grid.tileSize}px`
}))
</script>

<template>
    <div class="border border-slate-500 box-content" :style="style">
        <div class="p-2 border border-slate-500 h-full">
            The rules
            ...
            more to come
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import GridTile from './GridTile.vue';
// import { useGameDataStore } from '@/stores/game-data-store';
// import { useGameStateStore } from '@/stores/game-state-store';
import { useGameDataStore } from '@/stores-v2/game-data.store';
import { useGameStateStore } from '@/stores-v2/game-state.store';

const gameData = useGameDataStore();
const gameState = useGameStateStore();

const boardStyle = computed(() => ({
    width: `${gameData.grid.cols * gameData.grid.tileSize}px`,
    height: `${gameData.grid.rows * gameData.grid.tileSize}px`
}));

const tileStyle = computed(() => ({
    width: `${gameData.grid.tileSize}px`,
    height: `${gameData.grid.tileSize}px`,
}));

const className = computed(() => ({
    "border-2": gameState.currentState === "place_tokens",
}))
</script>

<template>
    <div
        class="flex flex-wrap box-content bg-slate-100 border border-slate-500 select-none"
        :class="className"
        :style="boardStyle"
    >
        <GridTile
            v-for="tile, i in gameData.tiles"
            :key="i"
            :tileIndex="i"
            :tile="tile"
            :style="tileStyle"
        />
    </div>
</template>
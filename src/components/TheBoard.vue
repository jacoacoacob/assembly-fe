<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import GridTile from './GridTile.vue';
import { useGameDataStore } from '@/stores/game-data-store';

const gameData = useGameDataStore();

const boardStyle = computed(() => ({
    width: `${gameData.grid.cols * gameData.grid.tileSize}px`,
    height: `${gameData.grid.rows * gameData.grid.tileSize}px`
}));

const tileStyle = computed(() => ({
    width: `${gameData.grid.tileSize}px`,
    height: `${gameData.grid.tileSize}px`,
}));

</script>

<template>
    <div class="flex flex-wrap bg-slate-400 select-none" :style="boardStyle">
        <GridTile
            v-for="tile, i in gameData.tiles"
            :key="i"
            :tileIndex="i"
            :tile="tile"
            :style="tileStyle"
        />
    </div>
</template>
<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import GridTile from './GridTile.vue';
import { useGameDataStore } from '@/stores/data-store';

const gameData = useGameDataStore();

const style = computed(() => ({
    width: `${gameData.grid.cols * gameData.grid.tileSize}px`,
    height: `${gameData.grid.rows * gameData.grid.tileSize}px`
}));

const onDragLeave = inject<(event: DragEvent) => void>("board:dragleave");


</script>

<template>
    <div class="flex flex-wrap bg-slate-400 select-none" :style="style">
        <GridTile v-for="_, i in gameData.tiles" :tileIndex="i" />
    </div>
</template>
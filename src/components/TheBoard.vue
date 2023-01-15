<script setup lang="ts">
import { computed } from 'vue';
import GridTile from './GridTile.vue';
import { useGameStore } from '@/stores/game.store';

const game = useGameStore();

const style = computed(() => ({
    width: `${game.grid.cols * game.grid.tileSize}px`,
    height: `${game.grid.rows * game.grid.tileSize}px`
}));

</script>

<template>
    <div class="flex flex-wrap bg-slate-400" :style="style">
        <GridTile v-for="_, i in game.tiles" :tileIndex="i" />
    </div>
</template>
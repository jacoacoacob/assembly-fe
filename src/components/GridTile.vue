<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore } from '@/stores/game.store';

const game = useGameStore();

const props = defineProps<{
    tileIndex: number;
}>();

const tile = computed(() => game.tiles[props.tileIndex]);

const style = computed(() => {
    const [r, g, b] = tile.value.color;
    const { tileSize } = game.grid;
    return {
        backgroundColor: `rgb(${r}, ${g}, ${b})`,
        width: `${tileSize}px`,
        height: `${tileSize}px`,
    }
});
</script>

<template>
    <div class="flex justify-center items-center border border-slate-900" :style="style">
        {{ tile.threshold }}
    </div>
</template>
<script setup lang="ts">
import { computed, inject, TransitionGroup } from 'vue';
import type { Ref } from 'vue';

import GameToken from './GameToken.vue';
import { useGameDataStore } from '@/stores/game-data.store';

const gameData = useGameDataStore();

const props = defineProps<{
    tileIndex: number;
}>();


const tile = computed(() => gameData.tiles[props.tileIndex]);
const tileContents = computed(() =>
    gameData.board[props.tileIndex].map((tokenId) => gameData.tokens[tokenId]
));

const style = computed(() => ({
    width: `${gameData.grid.tileSize}px`,
    height: `${gameData.grid.tileSize}px`,
}));

const hoveredTile = inject<Ref<number>>("board:hoveredTile");

const className = computed(() => ({
    "bg-white shadow-lg z-50": hoveredTile?.value === props.tileIndex,
    "bg-slate-100": hoveredTile?.value !== props.tileIndex
}))

const onDragEnter = inject<(event: DragEvent) => void>("tile:dragenter");
const onDragOver = inject<(event: DragEvent) => void>("tile:dragover");
const onDrop = inject<(event: DragEvent) => void>("tile:drop");
</script>

<template>
    <div
        class="relative flex justify-center items-center border border-slate-900 "
        :class="className"
        :style="style"
        :data-tile-index="tileIndex"
        @dragenter="onDragEnter"
        @drop="onDrop"
        @dragover="onDragOver"
    >
        <div>
            {{ tile.threshold }}
        </div>
        <div class="absolute top-0 left-0  w-full h-full">
            <GameToken
                v-for="token in tileContents"
                :key="token.id"
                :data="token"
            />
        </div>
    </div>
</template>

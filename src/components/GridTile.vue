<script setup lang="ts">
import { computed, inject } from 'vue';
import type { Ref } from 'vue';

import GameToken from './GameToken.vue';
import { useGameDataStore } from '@/stores/game-data-store';
import { useBoardDataStore } from "@/stores/board-data-store";
import type { Tile } from '@/stores/game-data-store-types';
import { useGameStateStore } from '@/stores/game-state-store';

const gameState = useGameStateStore();
const gameData = useGameDataStore();
const boardData = useBoardDataStore();

const props = defineProps<{
    tileIndex: number;
    tile: Tile;
}>();

const isInPlay = computed(() => boardData.inPlayTiles.includes(props.tileIndex));
const isOpen = computed(() => boardData.openTiles.includes(props.tileIndex))

const tileContents = computed(() =>
    gameData.board[props.tileIndex].map((tokenId) => gameData.tokens[tokenId]
));

const className = computed(() => ({
    "bg-white": boardData.hoveredTile === props.tileIndex && isOpen.value,
    "bg-slate-100": boardData.hoveredTile !== props.tileIndex && isOpen.value,
    "invisible": !isInPlay.value,
    "opacity-60 border-slate-400 text-slate-600": !isOpen.value,
}));

const onDragExit = inject<(event: DragEvent) => void>("tile:dragexit");
const onDragEnter = inject<(event: DragEvent) => void>("tile:dragenter");
const onDragOver = inject<(event: DragEvent) => void>("tile:dragover");
const onDrop = inject<(event: DragEvent) => void>("tile:drop");
</script>

<template>
    <div
        class="relative flex justify-center items-center border border-slate-500"
        :class="className"
        :data-tile-index="tileIndex"
        @dragexit="onDragExit"
        @dragenter="onDragEnter"
        @drop="onDrop"
        @dragover="onDragOver"
    >
        <div>
            {{ tile.capacity }}
        </div>
        <div class="absolute top-0 left-0  w-full h-full">
            <GameToken
                v-for="token in tileContents"
                :key="token.id"
                :token="token"
            />
        </div>
    </div>
</template>

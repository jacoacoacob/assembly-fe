<script setup lang="ts">
import { computed, inject } from 'vue';
import type { Ref } from 'vue';

import GameToken from './GameToken.vue';
import { useGameDataStore } from '@/stores/game-data-store';
import { useTileDataStore } from "@/stores/tile-data-store";
import type { Tile } from '@/stores/game-data-store-types';


const game = useGameDataStore();
const board = useTileDataStore();

const props = defineProps<{
    tileIndex: number;
    tile: Tile;
}>();

const isOpen = computed(() => board.openTiles.includes)

const tileContents = computed(() =>
    game.board[props.tileIndex].map((tokenId) => game.tokens[tokenId]
));

const hoveredTile = inject<Ref<number>>("board:hoveredTile");

const className = computed(() => ({
    "bg-white shadow-lg z-50": hoveredTile?.value === props.tileIndex,
    "bg-slate-100": hoveredTile?.value !== props.tileIndex,
    "bg-slate-200 opacity-30": !isOpen.value,
}))

const onDragEnter = inject<(event: DragEvent) => void>("tile:dragenter");
const onDragOver = inject<(event: DragEvent) => void>("tile:dragover");
const onDrop = inject<(event: DragEvent) => void>("tile:drop");
</script>

<template>
    <div
        class="relative flex justify-center items-center border border-slate-900 "
        :class="className"
        :data-tile-index="tileIndex"
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
                :data="token"
            />
        </div>
    </div>
</template>

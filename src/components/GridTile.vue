<script setup lang="ts">
import { computed, inject } from 'vue';

import GameToken from './GameToken.vue';
import type { Tile } from "@/stores-v2/game-data.types";
import { useGameStateStore } from '@/stores-v2/game-state.store';
import { useGameDataStore } from '@/stores-v2/game-data.store';
import { useTilesStore } from '@/stores-v2/tiles.store';
import { useTokensStore } from '@/stores-v2/tokens.store';

const gameState = useGameStateStore();
const gameData = useGameDataStore();
const tiles = useTilesStore();
const tokens = useTokensStore();

const props = defineProps<{
    tileIndex: number;
    tile: Tile;
}>();

const isInPlay = computed(() => tiles.inPlayTiles.includes(props.tileIndex));
const isOpen = computed(() => tiles.openTiles.includes(props.tileIndex));

const tileContents = computed(() =>
    tiles.tileTokenGraph[props.tileIndex].map((tokenId) => gameData.tokens[tokenId]
));

const className = computed(() => ({
    "bg-slate-200": tiles.candidateTileIndex !== props.tileIndex && isOpen.value,
    "invisible": !isInPlay.value,
    "border-slate-400 bg-slate-400": !isOpen.value,
    "bg-white": tiles.candidateTileIndex === props.tileIndex && isOpen.value,
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
                :tokenId="token.id"
            />
        </div>
    </div>
</template>

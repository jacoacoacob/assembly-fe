<script setup lang="ts">
import { computed, inject } from 'vue';

import GameToken from './GameToken.vue';
import type { Tile } from "@/stores-v2/game-data.types";
import { useGameStateStore } from '@/stores-v2/game-state.store';
import { useGameDataStore } from '@/stores-v2/game-data.store';
import { useTilesStore } from '@/stores-v2/tiles.store';
import { useTokensStore } from '@/stores-v2/tokens.store';
import { useDrag } from '@/composables/use-drag';
import { useMoveTokenStore } from '@/stores-v2/move-token.store';
import { useMoveValidationStore } from '@/stores-v2/move-validation.store';

const moveToken = useMoveTokenStore();
const validation = useMoveValidationStore();
const gameState = useGameStateStore();
const gameData = useGameDataStore();
const tiles = useTilesStore();
const tokens = useTokensStore();
const drag = useDrag();

const props = defineProps<{
    tileIndex: number;
    tile: Tile;
}>();


const isInPlay = computed(() => tiles.inPlayTiles.includes(props.tileIndex));
const isOpen = computed(() => tiles.openTiles.includes(props.tileIndex));

const tileContents = computed(() =>
    tiles.tileTokenGraph[props.tileIndex].tileTokenIds.map((tokenId) => gameData.tokens[tokenId]
));

const className = computed(() => ({
    // "bg-slate-200": tiles.candidateTileIndex !== props.tileIndex && isOpen.value,
    // "bg-slate-200": moveToken.hoveredTileIndex !== props.tileIndex && isOpen.value,
    "bg-slate-200": isOpen.value,
    "invisible": !isInPlay.value,
    "border-slate-400 bg-slate-400": !isOpen.value,
    "bg-white": moveToken.hoveredTileIndex === props.tileIndex && isOpen.value,
}));

</script>

<template>
    <div
        class="relative flex justify-center items-center border border-slate-500"
        :class="className"
        :data-tile-index="tileIndex"
        @dragenter="drag.onTileDragEnter"
        @dragexit="drag.onTileDragExit"
        @dragover="drag.onTileDragOver"
        @drop="drag.onTileDrop"
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

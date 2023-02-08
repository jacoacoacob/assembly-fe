<script setup lang="ts">
import { computed } from 'vue';

import GameToken from './GameToken.vue';
import type { Tile } from "@/stores-v2/game-data.types";
import { useGameDataStore } from '@/stores-v2/game-data.store';
import { useTilesStore } from '@/stores-v2/tiles.store';
import { useDrag } from '@/composables/use-drag';
import { useMoveTokenStore } from '@/stores-v2/move-token.store';

const moveToken = useMoveTokenStore();
const gameData = useGameDataStore();
const tiles = useTilesStore();
const drag = useDrag();

const props = defineProps<{
    tileIndex: number;
    tile: Tile;
}>();

const tileContents = computed(() =>
    tiles.tileTokenGraph[props.tileIndex].tileTokenIds.map((tokenId) => gameData.tokens[tokenId]
));

const className = computed(() => {
    const isVisible = tiles.inPlayTiles.includes(props.tileIndex);
    const isOpen = tiles.openInPlayTiles.includes(props.tileIndex);
    const isHovered = moveToken.hoveredTileIndex === props.tileIndex;
    const isMoveOrigin = moveToken.candidateOriginTileIndex === props.tileIndex;
    if (!isVisible) {
        return "invisible";
    }
    if (isMoveOrigin) {
        return "bg-white border-cyan-400 ring-2 ring-cyan-500 z-50";
    }
    if (!isOpen) {
        return "border-slate-400 bg-slate-400"
    }
    if (isHovered) {
        return "bg-white";
    }
    return "bg-slate-200"
});
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

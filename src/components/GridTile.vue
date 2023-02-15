<script setup lang="ts">
import { computed, ref } from 'vue';

import GameToken from './GameToken.vue';
import TileScorePopover from './TileScorePopover.vue';

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
    const isInPlay = tiles.inPlayTiles.includes(props.tileIndex);
    const isOpen = tiles.openInPlayTiles.includes(props.tileIndex);
    const isOverloaded =
        tiles.tileTokenGraph[props.tileIndex].tileTokenValuesSum > tiles.seasonalTileCapacities[props.tileIndex];
    const isHovered = moveToken.hoveredTileIndex === props.tileIndex;
    const isMoveOrigin = moveToken.candidateOriginTileIndex === props.tileIndex;
    if (isOverloaded) {
        return "bg-slate-100 ring-2 ring-red-500";
    }
    if (isMoveOrigin) {
        return "bg-white ring-4 ring-teal-500 z-40";
    }
    if (!isOpen || !isInPlay) {
        return "border-slate-400 bg-slate-400"
    }
    if (isHovered) {
        return "bg-white ring-2 ring-slate-500";
    }
    return "bg-slate-100"
});

const openPopover = ref(-1);
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
            <TileScorePopover
                @click="openPopover = tileIndex"
                :isOpen="openPopover === tileIndex"
                :tileIndex="tileIndex"
            />
        </div>
        <div class="absolute top-0 left-0 w-full h-full">
            <GameToken
                v-for="token in tileContents"
                :key="token.id"
                :tokenId="token.id"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, inject, type StyleValue } from "vue";

// import { PLAYER_COLOR_OPTIONS, type PlayerColor } from "@/stores/game-data-store-type
import { PLAYER_COLOR_OPTIONS } from "@/stores-v2/players.store";


import type { Token, PlayerColor } from "@/stores-v2/game-data.types";
import { useGameStateStore } from "@/stores-v2/game-state.store";
import { useGameDataStore } from "@/stores-v2/game-data.store";
import { usePlayersStore } from "@/stores-v2/players.store";
import { useTilesStore } from "@/stores-v2/tiles.store";
import { useTokensStore } from "@/stores-v2/tokens.store";
import { useMoveTokenStore } from "@/stores-v2/move-token.store";

const props = defineProps<{ tokenId: Token["id"]; }>();

const gameState = useGameStateStore();
const gameData = useGameDataStore();
const players = usePlayersStore();
const tiles = useTilesStore();
const tokens = useTokensStore();
const moveToken = useMoveTokenStore();

const token = computed(() => gameData.tokens[props.tokenId]);
const isInPlay = computed(() => tokens.inPlayTokenIds.includes(props.tokenId));

const onDragStart = inject<(event: DragEvent) => void>("token:dragstart");
const onDragEnd = inject<(event: DragEvent) => void>("token:dragend");

const style = computed((): StyleValue => {
    const { tileSize } = gameData.grid;
    const { tileIndex } = token.value;
    if (tileIndex > -1) {
        const tileContents = tiles.tileTokenGraph[tileIndex];
        const tileTokenIndex = tileContents.indexOf(token.value.id);
        const left = tileSize / 4 * (tileTokenIndex % 2 === 0 ? 1 : 3) - ((tileSize / 4 - 5));
        const top = tileSize / 4 * (tileTokenIndex < 2 ? 1 : 3) - (tileSize / 4 - 5);
        return {
            position: "absolute",
            top: `${top}px`,
            left: `${left}px`,
        };
    }
    return {

    }
});

const player = computed(() => gameData.players.find(player => player.id === token.value.playerId));

const className = computed(() => {
    // const candidateToken = gameData.tokens[tokens.candidateTokenId] || {};
    const candidateToken = gameData.tokens[moveToken.candidateId] || {};
    const cn: Record<string, boolean> = {};
    cn["border-dashed border-2 shadow-xl"] = (candidateToken.id === token.value.id && candidateToken.tileIndex > -1) || tokens.draggedTokenId === token.value.id;
    cn["bg-transparent text-slate-600"] = !isInPlay;
    cn[PLAYER_COLOR_OPTIONS[player.value?.color as PlayerColor]] = isInPlay.value;
    cn["h-8 w-8"] = token.value.tileIndex > -1;
    cn["h-6 w-6 text-sm"] = token.value.tileIndex === -1
    return cn;
})

const isDraggable = computed(() => {
    const isActivePlayerToken = token.value.playerId === players.activePlayer.id;
    if (gameState.currentState === "place_tokens") {
        // const candidateToken = gameData.tokens[tokens.candidateTokenId];
        const candidateToken = gameData.tokens[moveToken.candidateId];
        if (candidateToken && candidateToken.tileIndex > -1) {
            return (
                isInPlay.value &&
                isActivePlayerToken &&
                candidateToken.id === token.value.id
            );
        }
        return isInPlay.value && isActivePlayerToken && token.value.tileIndex === -1;
    }
    if (gameState.currentState === "play") {
        return isInPlay && isActivePlayerToken;
    }
});

</script>

<template>
    <div
        :id="token.id"
        class="rounded-full border border-slate-600 flex justify-center items-center text-white"
        :class="className"
        :style="style"
        :draggable="isDraggable"
        @dragend="onDragEnd"
        @dragstart="onDragStart"
    >
        {{ token.value }}
    </div>
</template>
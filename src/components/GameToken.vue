<script setup lang="ts">
import { computed, type StyleValue } from "vue";

import { PLAYER_COLOR_OPTIONS } from "@/stores-v2/players.store";
import type { Token, PlayerColor } from "@/stores-v2/game-data.types";
import { useGameStateStore } from "@/stores-v2/game-state.store";
import { useGameDataStore } from "@/stores-v2/game-data.store";
import { usePlayersStore } from "@/stores-v2/players.store";
import { useTilesStore } from "@/stores-v2/tiles.store";
import { useTokensStore } from "@/stores-v2/tokens.store";
import { useMoveTokenStore } from "@/stores-v2/move-token.store";
import { useDrag } from "@/composables/use-drag";

const props = defineProps<{ tokenId: Token["id"]; }>();

const drag = useDrag();

const gameState = useGameStateStore();
const gameData = useGameDataStore();
const players = usePlayersStore();
const tiles = useTilesStore();
const tokens = useTokensStore();
const moveToken = useMoveTokenStore();

const token = computed(() => gameData.tokens[props.tokenId]);
const isInPlay = computed(() => tokens.inPlayTokenIds.includes(props.tokenId));


const style = computed((): StyleValue => {
    const { tileSize } = gameData.grid;
    const { tileIndex } = token.value;
    if (tileIndex > -1) {
        const { tileTokenIds } = tiles.tileTokenGraph[tileIndex];
        const tileTokenIndex = tileTokenIds.indexOf(token.value.id);
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

// const player = computed(() => gameData.players.find(player => player.id === token.value.playerId));
const playerColor = computed(() => gameData.players[token.value.playerId].color);

const className = computed(() => {
    const candidateToken = gameData.tokens[moveToken.candidateId] || {};
    const cn: Record<string, boolean> = {};
    cn["ring-2 ring-slate-600 shadow-xl"] = candidateToken.id === token.value.id;
    cn["bg-transparent text-slate-600"] = !isInPlay;
    cn[PLAYER_COLOR_OPTIONS[playerColor.value]] = isInPlay.value;
    cn["h-8 w-8"] = token.value.tileIndex > -1;
    cn["h-6 w-6 text-sm"] = token.value.tileIndex === -1
    return cn;
})

const isDraggable = computed(() => {
    const isActivePlayerToken = token.value.playerId === players.activePlayer.id;
    if (gameState.currentState === "place_tokens") {
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
        const candidateToken = gameData.tokens[moveToken.candidateId];
        // if (candidateToken && candidateToken.tileIndex > -1) {
        if (candidateToken) {
            return (
                isInPlay &&
                isActivePlayerToken &&
                candidateToken.id === token.value.id
            );
        }
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
        @dragend="drag.onTokenDragEnd"
        @dragstart="drag.onTokenDragStart"
    >
        {{ token.value }}
    </div>
</template>
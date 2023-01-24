<script setup lang="ts">
import { computed, inject, type StyleValue, type Ref } from "vue";

import { useGameDataStore } from '@/stores/game-data-store';
import { PLAYER_COLOR_OPTIONS, type PlayerColor } from "@/stores/game-data-store-types";
import type { Player, Token } from '@/stores/game-data-store-types';
import { usePlayersDataStore } from "@/stores/players-data-store";
import { useBoardDataStore } from "@/stores/board-data-store";
import { usePlaceTokensStore } from "@/stores/place-tokens-store";
import { useGameStateStore } from "@/stores/game-state-store";

const props = defineProps<{ token: Token; isUnavailable?: boolean }>();

const gameState = useGameStateStore();
const placeTokens = usePlaceTokensStore();
const gameData = useGameDataStore();
const playerData = usePlayersDataStore();
const boardData = useBoardDataStore();

const onDragStart = inject<(event: DragEvent) => void>("token:dragstart");
const onDragEnd = inject<(event: DragEvent) => void>("token:dragend");

const style = computed((): StyleValue => {
    const { tileSize } = gameData.grid;
    const { tileIndex } = props.token;
    if (tileIndex > -1) {
        const tileContents = gameData.board[tileIndex];
        const tileTokenIndex = tileContents.indexOf(props.token.id);
        const left = tileSize / 4 * (tileTokenIndex % 2 === 0 ? 1 : 3) - ((tileSize / 4 - 5));
        const top = tileSize / 4 * (tileTokenIndex < 2 ? 1 : 3) - (tileSize / 4 - 5);
        return {
            position: "absolute",
            top: `${top}px`,
            left: `${left}px`,
        };
    }
    return {}
});

const player = computed(() => gameData.players.find(player => player.id === props.token.player));

const className = computed(() => {
    const cn: Record<string, boolean> = {};
    if (gameState.currentState === "place_tokens") {
        cn["border-dashed border-2 shadow-xl"] = placeTokens.candidateToken === props.token.id
    }
    cn["bg-transparent text-slate-600"] = props.isUnavailable ?? false;
    cn["border-dashed border-slate-50"] = boardData.activeToken === props.token.id;
    cn[PLAYER_COLOR_OPTIONS[player.value?.color as PlayerColor]] = !props.isUnavailable;
    return cn;
})

const isDraggable = computed(() => {
    if (gameState.currentState === "place_tokens") {
        const isAvailable = !props.isUnavailable;
        const isActivePlayerToken = props.token.player === playerData.activePlayer.id;
        const candidateToken = gameData.tokens[placeTokens.candidateToken];
        if (candidateToken && candidateToken.tileIndex > -1) {
            return (
                isAvailable &&
                isActivePlayerToken &&
                candidateToken.id === props.token.id
            );
        }
        return isAvailable && isActivePlayerToken && props.token.tileIndex === -1;
    }
    return true;
});

</script>

<template>
    <div
        :id="token.id"
        class="w-8 h-8 rounded-full border border-slate-600 flex justify-center items-center text-white"
        :class="className"
        :style="style"
        :draggable="isDraggable"
        @dragend="onDragEnd"
        @dragstart="onDragStart"
    >
        {{ token.value }}
    </div>
</template>
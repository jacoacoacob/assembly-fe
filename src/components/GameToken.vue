<script setup lang="ts">
import { computed, inject, type StyleValue, type Ref } from "vue";

// import { useGameDataStore } from '@/stores/game-data-store';
import { PLAYER_COLOR_OPTIONS, type PlayerColor } from "@/stores/game-data-store-types";
// import type { Player, Token } from '@/stores/game-data-store-types';
import type { Token } from "@/stores-v2/game-data.types";
import { useGameStateStore } from "@/stores-v2/game-state.store";
import { useGameDataStore } from "@/stores-v2/game-data.store";
import { usePlayersStore } from "@/stores-v2/players.store";
import { useTilesStore } from "@/stores-v2/tiles.store";
import { usePlaceTokensState } from "@/stores-v2/states/use-place-tokens-state";
import { useTokensStore } from "@/stores-v2/tokens.store";
// import { usePlayersDataStore } from "@/stores/players-data-store";
// import { useBoardDataStore } from "@/stores/board-data-store";
// import { usePlaceTokensStore } from "@/stores/place-tokens-store";
// import { useGameStateStore } from "@/stores/game-state-store";

// const props = defineProps<{ token: Token; isUnavailable?: boolean }>();
const props = defineProps<{ tokenId: Token["id"]; }>();


// const gameState = useGameStateStore();
// const placeTokens = usePlaceTokensStore();
// const gameData = useGameDataStore();
// const playerData = usePlayersDataStore();
// const boardData = useBoardDataStore();

const gameState = useGameStateStore();
const gameData = useGameDataStore();
const players = usePlayersStore();
const tiles = useTilesStore();
const tokens = useTokensStore();
const placeTokens = usePlaceTokensState();

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
    return {}
});

const player = computed(() => gameData.players.find(player => player.id === token.value.playerId));

const className = computed(() => {
    const cn: Record<string, boolean> = {};
    // if (gameState.currentState === "place_tokens") {
    cn["border-dashed border-2 shadow-xl"] = tokens.candidateTokenId === token.value.id
    // }
    cn["bg-transparent text-slate-600"] = !isInPlay;
    // cn["border-dashed border-slate-50"] = boardData.activeToken === props.token.id;
    cn[PLAYER_COLOR_OPTIONS[player.value?.color as PlayerColor]] = isInPlay.value;
    return cn;
})

const isDraggable = computed(() => {
    if (gameState.currentState === "place_tokens") {
        const isActivePlayerToken = token.value.playerId === players.activePlayer.id;
        const candidateToken = gameData.tokens[tokens.candidateTokenId];
        if (candidateToken && candidateToken.tileIndex > -1) {
            return (
                isInPlay &&
                isActivePlayerToken &&
                candidateToken.id === token.value.id
            );
        }
        return isInPlay && isActivePlayerToken && token.value.tileIndex === -1;
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
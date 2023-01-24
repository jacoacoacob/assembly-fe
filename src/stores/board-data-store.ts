import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { usePlaceTokensStore } from "@/stores/place-tokens-store";
import { useGameDataStore } from "@/stores/game-data-store";
import { useGameStateStore } from "@/stores/game-state-store";
import { sum } from "@/utils/sum";
import type { PlayerTokenIds } from "./game-data-store-types";
import { usePlayerDataStore } from "./player-data-store";

const useBoardDataStore = defineStore("board-data", () => {
    const placeTokensStore = usePlaceTokensStore();
    const gameData = useGameDataStore();
    const gameState = useGameStateStore();
    const playerData = usePlayerDataStore();

    const hoveredTile = ref(-1);
    const activeToken = ref("");

    const _reservePlayerTokenIds = computed((): PlayerTokenIds => {
        switch (gameState.currentState) {
            case "initial": { };
            case "play_game": { };
            case "place_tokens": return placeTokensStore.reserveTokens;
        }
    });

    const availableReservePlayerTokenIds = computed((): PlayerTokenIds => {
        return Object.entries(_reservePlayerTokenIds.value).reduce(
            (accum: PlayerTokenIds, [playerId, tokenIds]) => {
                accum[playerId] = tokenIds.filter((tokenId) => (
                    gameData.tokens[tokenId].tileIndex === -1 &&
                    openTiles.value.some((tileIndex) => isValidMove(tileIndex, tokenId))
                ))
                return accum;
            },
            {}
        );
    });

    function playerHasMove(playerId: string) {
        return availableReservePlayerTokenIds.value[playerId].length > 0;
    }

    const _openTiles = computed((): number[] => {
        switch (gameState.currentState) {
            case "initial": return gameData.openTiles;
            case "play_game": return gameData.openTiles;
            case "place_tokens": return placeTokensStore.openTiles;
        }
    });

    const openTiles = computed(() => _openTiles.value.filter((tileIndex) => {
        if (!activeToken.value) {
            return true;
        }
        return isValidMove(tileIndex, activeToken.value);
    }));

    const inPlayTiles = computed(() => {
        switch (gameState.currentState) {
            case "initial": return [];
            case "play_game": return [];
            case "place_tokens": return placeTokensStore.inPlayTiles
        }
    });

    function isValidMove(tileIndex: number, tokenId: string) {
        const tile = gameData.tiles[tileIndex];
        const token = gameData.tokens[tokenId];
        const tileTokenValues = gameData.board[tileIndex].map((tokenId) => gameData.tokens[tokenId].value);
        const isNotFull = _openTiles.value.includes(tileIndex);
        return isNotFull && sum(tileTokenValues) + token.value <= tile.capacity;
    }

    return {
        activeToken,
        availableReservePlayerTokenIds,
        hoveredTile,
        inPlayTiles,
        isValidMove,
        openTiles,
        playerHasMove,
    };
})

export { useBoardDataStore };

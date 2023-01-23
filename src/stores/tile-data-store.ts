import { defineStore } from "pinia";
import { computed } from "vue";

import { usePlaceTokensStore } from "@/stores/place-tokens-store";
import { useGameDataStore } from "@/stores/game-data-store";
import { useGameStateStore } from "@/stores/game-state-store";
import { sum } from "@/utils/sum";

const useTileDataStore = defineStore("tile-data", () => {
    const gameData = useGameDataStore();
    const gameState = useGameStateStore();
    const placeTokensStore = usePlaceTokensStore();

    const openTiles = computed((): number[] => {
        switch (gameState.currentState) {
            case "initial": return gameData.openTiles;
            case "play_game": return gameData.openTiles;
            case "place_tokens": return placeTokensStore.openTiles;
        }
    });

    function isValidMove(tileIndex: number, tokenId: string) {
        const tile = gameData.tiles[tileIndex];
        const token = gameData.tokens[tokenId];
        const tileTokenValues = gameData.board[tileIndex].map((tokenId) => gameData.tokens[tokenId].value);
        const isNotFull = openTiles.value.includes(tileIndex);
        return isNotFull && sum(tileTokenValues) + token.value <= tile.capacity;
    }

    return { isValidMove, openTiles };
})

export { useTileDataStore };

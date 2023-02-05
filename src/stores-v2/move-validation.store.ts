import { sum } from "@/utils/sum";
import { defineStore } from "pinia";
import { computed } from "vue";
import { useGameDataStore } from "./game-data.store";
import { useGameStateStore } from "./game-state.store";
import { useMoveTokenStore } from "./move-token.store";
import { usePlayState } from "./states/use-play-state";
import { useTilesStore } from "./tiles.store";

const useMoveValidationStore = defineStore("move-validation", () => {
    const gameState = useGameStateStore();
    const gameData = useGameDataStore();
    const tiles = useTilesStore();
    const playState = usePlayState();
    const moveToken = useMoveTokenStore();

    function isValidMove(tokenId: string, tileIndex: number) {
        if (tiles.openTiles.includes(tileIndex)) {
            const { tileTokenValuesSum } = tiles.tileTokenGraph[tileIndex];
            const tile = gameData.tiles[tileIndex];
            const token = gameData.tokens[tokenId];
            return tileTokenValuesSum + token.value <= tile.capacity;
        }
        return false;
    }

    return { isValidMove };
});

export { useMoveValidationStore };

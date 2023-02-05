import { sum } from "@/utils/sum";
import { defineStore } from "pinia";
import { computed } from "vue";
import { useGameDataStore } from "./game-data.store";
import type { Token } from "./game-data.types";
import { useGameStateStore } from "./game-state.store";
import { useMoveTokenStore } from "./move-token.store";
import { useScoresStore } from "./scores.store";
import { usePlayState } from "./states/use-play-state";
import { useTilesStore } from "./tiles.store";

const useMoveValidationStore = defineStore("move-validation", () => {
    const gameState = useGameStateStore();
    const gameData = useGameDataStore();
    const tiles = useTilesStore();
    const scores = useScoresStore();
    const playState = usePlayState();
    const moveToken = useMoveTokenStore();

    function getDistance(origin: number, dest: number) {
        if (origin === -1) {
            return 1;
        }
        return tiles.tileDistanceGraph[origin][dest];
    }

    function getCost(tokenValue: number, origin: number, distance: number) {
        if (origin === -1) {
            return tokenValue;
        }
        return Math.ceil(tokenValue / 2) * distance;
    }

    function _checkCost(token: Token, origin: number, dest: number) {
        const playerPoints = scores.points[token.playerId];
        return playerPoints > getCost(token.value, origin, getDistance(origin, dest));
    }

    function _checkTileCapacity(token: Token, dest: number) {
        const tile = gameData.tiles[dest];
        const { tileTokenValuesSum } = tiles.tileTokenGraph[dest];
        return tileTokenValuesSum + token.value <= tile.capacity;
    }

    function isValidMove(tokenId: string, dest: number) {
        const token = gameData.tokens[tokenId];
        const origin = tokenId === moveToken.candidateId
            ? moveToken.candidateOriginTileIndex as number
            : token.tileIndex;
        if (gameState.currentState === "place_tokens") {
            return _checkTileCapacity(token, dest);
        }
        if (gameState.currentState === "play") {
            return (
                _checkTileCapacity(token, dest) &&
                _checkCost(token, origin, dest)
            )
        }
        return false;
    }

    return { isValidMove, getDistance, getCost };
});

export { useMoveValidationStore };

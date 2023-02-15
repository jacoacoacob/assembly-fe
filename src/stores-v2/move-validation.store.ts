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

    function getCost(tokenValue: number, origin: number, dest: number) {
        if (origin === -1 && dest === -1) {
            return 0;
        }
        if (dest === -1) {
            return tokenValue;
        }
        if (origin === -1) {
            return -tokenValue;
        }
        return -(Math.ceil(tokenValue / 2) * getDistance(origin, dest));
    }

    function _checkCost(token: Token, origin: number, dest: number) {
        if (dest === -1) {
            return true;
        }
        const playerPoints = scores.pointTotals[token.playerId];
        const cost = getCost(token.value, origin, dest);
        return playerPoints + cost > 0;
    }

    function _checkTileCapacity(token: Token, dest: number) {
        if (dest === -1) {
            return true;
        }
        const tileCapacity = tiles.seasonalTileCapacities[dest];
        const { tileTokenValuesSum, tileTokenIds } = tiles.tileTokenGraph[dest];
        return (
            tileTokenIds.length < 4 &&
            tileTokenValuesSum + token.value <= tileCapacity
        )
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
            const playerOverloads = tiles.getPlayerOverloads(token.playerId);
            if (playerOverloads.length > 0) {
                return (
                    playerOverloads.includes(origin) &&
                    _checkCost(token, origin, dest) &&
                    _checkTileCapacity(token, dest)
                )
                // is player moving from overload &&
                // is cost acceptable && 
                // is dest tile capacity okay
            }
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

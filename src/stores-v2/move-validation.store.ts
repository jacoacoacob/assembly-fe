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
import { useTokensStore } from "./tokens.store";

const useMoveValidationStore = defineStore("move-validation", () => {
    const gameState = useGameStateStore();
    const gameData = useGameDataStore();
    const tiles = useTilesStore();
    const tokens = useTokensStore();
    const scores = useScoresStore();
    const playState = usePlayState();
    const moveToken = useMoveTokenStore();

    function getDistance(origin: number, dest: number) {
        if (origin === -1) {
            return 1;
        }
        return tiles.tileDistanceGraph[origin][dest];
    }

    function getCost(tokenValue: number, origin: number, dest: number, resolvesOverload: boolean) {
        if (origin === -1 && dest === -1) {
            return 0;
        }
        if (dest === -1) {
            if (resolvesOverload) {
                return 0;
            }
            return tokenValue;
        }
        if (origin === -1) {
            switch (tokenValue) {
                case 1: return -(tokenValue * 2);
                case 2: return -(tokenValue * 3);
                case 3: return -(tokenValue * 4);
                case 4: return -(tokenValue * 5);
            }
        }
        return -(Math.ceil(tokenValue / 2) * getDistance(origin, dest) * 2);
    }

    function _checkCost(token: Token, origin: number, dest: number, resolvesOverload: boolean) {
        if (dest === -1) {
            return true;
        }
        const playerPoints = scores.pointTotals[token.playerId];
        const cost = getCost(token.value, origin, dest, resolvesOverload);
        return playerPoints + cost > 0;
    }

    function _checkHasParent(token: Token, origin: number, dest: number) {
        if (origin > -1) {
            return true;
        }
        const { tileTokenIds } = tiles.tileTokenGraph[dest];
        const eligibleParentValueTotal = tileTokenIds.reduce(
            (accum: number, tokenId) => {
                const _token = gameData.tokens[tokenId];
                if (token.playerId === _token.playerId && tokens.isTokenMature(tokenId)) {
                    accum += _token.value;
                }
                return accum;
            },
            0
        );
        return eligibleParentValueTotal >= token.value;
    }

    function _checkTileCapacity(token: Token, origin: number, dest: number) {
        if (dest === -1) {
            return true;
        }
        const tileCapacity = tiles.seasonalTileCapacities[dest];
        const { tileTokenValuesSum, tileTokenIds } = tiles.tileTokenGraph[dest];
        if (origin === -1) {
            return (
                tileTokenIds.length < 3 &&
                tileTokenValuesSum + token.value <= tileCapacity
            )
        }
        return (
            tileTokenIds.length < 4 &&
            tileTokenValuesSum + token.value <= tileCapacity
        );
    }

    function isValidMove(tokenId: string, dest: number) {
        const token = gameData.tokens[tokenId];
        const origin = tokenId === moveToken.candidateId
            ? moveToken.candidateOriginTileIndex as number
            : token.tileIndex;
        if (gameState.currentState === "place_tokens") {
            return _checkTileCapacity(token, origin, dest);
        }
        if (gameState.currentState === "play") {
            const playerOverloads = tiles.getPlayerOverloads(token.playerId);
            if (playerOverloads.length > 0) {
                return (
                    playerOverloads.includes(origin) &&
                    _checkCost(token, origin, dest, moveToken.resolvesOverload) &&
                    _checkHasParent(token, origin, dest) &&
                    _checkTileCapacity(token, origin, dest)
                )
            }
            return (
                _checkHasParent(token, origin, dest) &&
                _checkCost(token, origin, dest, moveToken.resolvesOverload) &&
                _checkTileCapacity(token, origin, dest)
            )
        }
        return false;
    }

    return { isValidMove, getDistance, getCost };
});

export { useMoveValidationStore };

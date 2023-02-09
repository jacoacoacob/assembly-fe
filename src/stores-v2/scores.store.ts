import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { sum } from "@/utils/sum";
import type { PlayerPoints } from "./scores.types";
import { useGameDataStore } from "./game-data.store";
import type { Player } from "./game-data.types";
import { useTilesStore } from "./tiles.store";
import { usePlayerMovesStore } from "./player-moves.store";
import { useMoveTokenStore } from "./move-token.store";
import { useMoveDetail } from "@/composables/use-move-details";


const useScoresStore = defineStore("scores", () => {
    const gameData = useGameDataStore();
    const tiles = useTilesStore();
    const playerMoves = usePlayerMovesStore();
    const moveToken = useMoveTokenStore();

    const pointTotals = ref<PlayerPoints>({});
    const roundInitialTileScores = ref<PlayerPoints>({});

    function setRoundInitialTileScores(points: PlayerPoints) {
        roundInitialTileScores.value = points;
    }

    function initPlayerPoints(): PlayerPoints {
        return Object.fromEntries(gameData.players.map((player) => [player.id, 0]))
    }

    const tilePlayerTokenValues = computed(() => tiles.liveTileTokenGraph.map(
        (node) => node.tileTokenIds.reduce(
            (accum: PlayerPoints, tokenId) => {
                const token = gameData.tokens[tokenId];
                if (typeof accum[token.playerId] === "undefined") {
                    accum[token.playerId] = 0;
                }
                accum[token.playerId] += token.value;
                return accum;
            },
            {}
        )
    ));

    const tileScores = computed((): PlayerPoints[] => tilePlayerTokenValues.value.map(
        (playerTokenValues, tileIndex) => {
            const tile = gameData.tiles[tileIndex];
            const tileTokenValues = sum(
                tiles.liveTileTokenGraph[tileIndex].tileTokenIds.map((tokenId) => gameData.tokens[tokenId].value)
            );
            const tileCapacityModifier = Math.floor((tile.capacity - tileTokenValues) / 2);
            return Object.entries(playerTokenValues).reduce(
                (accum: PlayerPoints, [playerId, playerTokenTotal], i, arr) => {
                    if (arr.length === 1) {
                        accum[playerId] -= 1;
                    } else {
                        arr.forEach(([playerId_, playerTokenTotal_]) => {
                            if (playerId !== playerId_) {
                                accum[playerId] += playerTokenTotal - playerTokenTotal_ + tileCapacityModifier;
                            }
                        });
                    }
                    return accum;
                },
                initPlayerPoints()
            )
        }
    ));

    const tileScoresTotals = computed((): PlayerPoints => {
        return tileScores.value.reduce(
            (accum: PlayerPoints, tileScores) => {
                Object.entries(tileScores).forEach(([playerId, playerPoints]) => {
                    accum[playerId] += playerPoints;
                })
                return accum;
            },
            initPlayerPoints()
        );
    });


    const currentMoveCost = computed(() => {
        if (moveToken.candidateId) {
            const origin = moveToken.candidateOriginTileIndex as number;
            const dest = moveToken.hoveredTileIndex ?? moveToken.candidateDestTileIndex as number;
            const tokenValue = gameData.tokens[moveToken.candidateId].value;
            const { cost } = useMoveDetail({ origin, dest, tokenValue });
            return cost;
        }
    });

    const committedMovesCost = computed((): number => {
        return sum(playerMoves.committedMovesDetails.map((move) => move.cost))
    });

    const tileScoresTotalsDelta = computed(() => {
        return gameData.players.reduce(
            (accum: Record<Player["id"], number>, player) => {
                accum[player.id] = tileScoresTotals.value[player.id] - roundInitialTileScores.value[player.id];
                return accum;
            },
            {}
        )
    });

    return {
        setRoundInitialTileScores,
        pointTotals,
        tilePlayerTokenValues,
        tileScores,
        tileScoresTotals,
        tileScoresTotalsDelta,
        committedMovesCost,
        currentMoveCost,
        initPlayerPoints
    };
});

export { useScoresStore };

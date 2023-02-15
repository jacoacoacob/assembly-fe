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
import { usePlayersStore } from "./players.store";


const useScoresStore = defineStore("scores", () => {
    const gameData = useGameDataStore();
    const tiles = useTilesStore();
    const players = usePlayersStore();
    const playerMoves = usePlayerMovesStore();
    const moveToken = useMoveTokenStore();

    const pointTotals = ref<PlayerPoints>({});
    const roundInitialTileScores = ref<PlayerPoints>({});

    function setRoundInitialTileScores(points: PlayerPoints) {
        roundInitialTileScores.value = points;
    }

    function initPlayerPoints(): PlayerPoints {
        return Object.keys(gameData.players).reduce(
            (accum: PlayerPoints, playerId) => ({ ...accum, [playerId]: 0 }),
            {}
        );
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
            const tileTokenValues = sum(
                tiles.liveTileTokenGraph[tileIndex].tileTokenIds.map((tokenId) => gameData.tokens[tokenId].value)
            );
            const tileCapacity = tiles.seasonalTileCapacities[tileIndex];
            const tileCapacityModifier = Math.floor((tileCapacity - tileTokenValues) / 2);
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

    const tileScoresTotals = computed((): PlayerPoints => tileScores.value.reduce(
        (accum: PlayerPoints, tilePlayerPoints) => {
            Object.entries(tilePlayerPoints).forEach(([playerId, playerScore]) => {
                accum[playerId] += playerScore;
            })
            return accum;
        },
        initPlayerPoints()
    ) );


    const currentMoveCost = computed(() => {
        if (moveToken.candidateId) {
            const { cost } = useMoveDetail({
                dest: moveToken.hoveredTileIndex ?? moveToken.candidateDestTileIndex as number,
                tokenValue: gameData.tokens[moveToken.candidateId].value,
                origin: moveToken.candidateOriginTileIndex as number,
                resolvesOverload: moveToken.resolvesOverload
            });
            return cost;
        }
    });

    const committedMovesCost = computed((): number => {
        return sum(playerMoves.committedMovesDetails.map((move) => move.cost))
    });

    const tileScoresTotalsDelta = computed(() => {
        return players.playerList.reduce(
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

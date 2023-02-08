import { computed } from "vue";
import { sum } from "@/utils/sum";
import { useGameDataStore } from "../stores-v2/game-data.store";
import { useTilesStore, makeTileTokenGraph, type TileTokenGraph } from "../stores-v2/tiles.store";
import type { PlayerPoints } from "../stores-v2/scores.types";
import type { Game, Player } from "../stores-v2/game-data.types";
import { usePlayerMovesStore } from "@/stores-v2/player-moves.store";
import { useMoveTokenStore } from "@/stores-v2/move-token.store";
import { useMoveDetail } from "./use-move-details";
import { usePlayersStore } from "@/stores-v2/players.store";

type TilePlayerTokenValues = Record<Player["id"], number>[];
type TilePlayerScores = TilePlayerTokenValues;

function useScoring() {
    const gameData = useGameDataStore();
    const tiles = useTilesStore();
    const moveToken = useMoveTokenStore();
    const playerMoves = usePlayerMovesStore();

    function initPlayerPoints(): PlayerPoints {
        return Object.fromEntries(gameData.players.map((player) => [player.id, 0]))
    }

    function _getTilePlayerTokenValues(tileTokenGraph: TileTokenGraph): TilePlayerTokenValues {
        return tileTokenGraph.map(
            (node) => node.tileTokenIds.reduce(
                (accum: TilePlayerTokenValues[number], tokenId) => {
                    const token = gameData.tokens[tokenId];
                    if (typeof accum[token.playerId] === "undefined") {
                        accum[token.playerId] = 0;
                    }
                    accum[token.playerId] += token.value;
                    return accum;
                },
                {}
            )
        );
    }

    function _getTilePlayerScores(tileTokenGraph: TileTokenGraph): TilePlayerScores {
        const tilePlayerTokenValues = tileTokenGraph.map(
            (node) => node.tileTokenIds.reduce(
                (accum: TilePlayerTokenValues[number], tokenId) => {
                    const token = gameData.tokens[tokenId];
                    if (typeof accum[token.playerId] === "undefined") {
                        accum[token.playerId] = 0;
                    }
                    accum[token.playerId] += token.value;
                    return accum;
                },
                {}
            )
        );
        
        return tilePlayerTokenValues.map(
            (playerTokenValues, tileIndex) => {
                const tile = gameData.tiles[tileIndex];
                const tileTokenValues = sum(
                    tileTokenGraph[tileIndex].tileTokenIds.map((tokenId) => gameData.tokens[tokenId].value)
                );
                const tileCapacityModifier = Math.floor((tile.capacity - tileTokenValues) / 2);
                return Object.entries(playerTokenValues).reduce(
                    (accum: TilePlayerScores[number], [playerId, playerTokenTotal], i, arr) => {
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
        );
    }

    function _getTilePlayerScoresTotals(tilePlayerScores: TilePlayerScores) {
        return tilePlayerScores.reduce(
            (accum: PlayerPoints, tileScores) => {
                Object.entries(tileScores).forEach(([playerId, playerPoints]) => {
                    accum[playerId] += playerPoints;
                })
                return accum;
            },
            initPlayerPoints()
        );
    }

    const tileScores = computed(() => {

    });

    const tileScoresTotals = computed((): PlayerPoints => {
        const { hoveredTileIndex, candidateId } = moveToken;
        const tileTokenGraph = typeof hoveredTileIndex === "number"
            ? makeTileTokenGraph(
                gameData.tiles,
                Object.entries(gameData.tokens).reduce(
                    (accum: Game["tokens"], [tokenId, token]) => {
                        if (tokenId === candidateId) {
                            accum[tokenId] = {
                                ...token,
                                tileIndex: hoveredTileIndex,
                            }
                        } else {
                            accum[tokenId] = token;
                        }
                        return accum;
                    },
                    {}
                )
            )
            : tiles.tileTokenGraph;
        const tilePlayerScores = _getTilePlayerScores(tileTokenGraph);
        return _getTilePlayerScoresTotals(tilePlayerScores);
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

    return { initPlayerPoints, tileScoresTotals, committedMovesCost, currentMoveCost };
}

export { useScoring };

import { sum } from "@/utils/sum";
import { useGameDataStore } from "../stores-v2/game-data.store";
import { usePlayersStore } from "../stores-v2/players.store";
import { useTilesStore } from "../stores-v2/tiles.store";
import type { PlayerPoints } from "../stores-v2/scores.types";
import { useTokensStore } from "../stores-v2/tokens.store";
import type { Token, Player, Tile } from "../stores-v2/game-data.types";

type TilePlayerTokenValues = Record<Player["id"], number>[];
type TilePlayerScores = TilePlayerTokenValues;

function useScoring() {
    const gameData = useGameDataStore();
    const players = usePlayersStore();
    const tiles = useTilesStore();
    const tokens = useTokensStore();

    function initPlayerPoints(): PlayerPoints {
        return Object.fromEntries(gameData.players.map((player) => [player.id, 0]))
    }

    function _getTilePlayerTokenValues(): TilePlayerTokenValues {
        return tiles.tileTokenGraph.map(
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

    function _getTilePlayerScores(tilePlayerTokenValues: TilePlayerTokenValues): TilePlayerScores {
        return tilePlayerTokenValues.map(
            (playerTokenValues, tileIndex) => {
                const tile = gameData.tiles[tileIndex];
                const tileTokenValues = sum(
                    tiles.tileTokenGraph[tileIndex].tileTokenIds.map((tokenId) => gameData.tokens[tokenId].value)
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

    function calculatePoints(): PlayerPoints {
        const tilePlayerTokenValues = _getTilePlayerTokenValues();
        const tilePlayerScores = _getTilePlayerScores(tilePlayerTokenValues);
        return _getTilePlayerScoresTotals(tilePlayerScores);
    }

    return { calculatePoints, initPlayerPoints };
}

export { useScoring };

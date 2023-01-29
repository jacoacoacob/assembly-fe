import { sum } from "@/utils/sum";
import { useGameDataStore } from "./game-data.store";
import { usePlayersStore } from "./players.store";
import { useTilesStore } from "./tiles.store";
import type { PlayerPoints } from "./scores.types";
import { useTokensStore } from "./tokens.store";
import type { Token, Player, Tile } from "./game-data.types";
import { computed } from "vue";

type PlayerTileTokenValues = Record<Player["id"], Record<Token["tileIndex"], Token["value"]>>;
type TilePlayerTokenValues = Record<Player["id"], number>[];

function useScoring() {
    const gameData = useGameDataStore();
    const players = usePlayersStore();
    const tiles = useTilesStore();
    const tokens = useTokensStore();

    function calculatePoints(): PlayerPoints {
        const playerTileTokenValues = Object.entries(tokens.onBoardPlayerTokenIds).reduce(
            (accum: PlayerTileTokenValues, [playerId, tokenIds]) => {
                accum[playerId] = tokenIds.reduce(
                    (accum: PlayerTileTokenValues[string], tokenId) => {
                        const token = gameData.tokens[tokenId];
                        if (typeof accum[token.tileIndex] === "undefined") {
                            accum[token.tileIndex] = 0;
                        }
                        accum[token.tileIndex] += token.value;
                        return accum;
                    },
                    {}
                );
                return accum;
            },
            {}
        );

        const tilePlayerTokenValues: TilePlayerTokenValues = tiles.tileTokenGraph.map(
            (tokenIds) => tokenIds.reduce(
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

        return {}
    }

    return { calculatePoints };
}

export { useScoring };

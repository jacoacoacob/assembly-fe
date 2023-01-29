import { sum } from "@/utils/sum";
import { useGameDataStore } from "./game-data.store";
import { usePlayersStore } from "./players.store";
import { useTilesStore } from "./tiles.store";
import type { PlayerPoints } from "./scores.types";
import { useTokensStore } from "./tokens.store";


function useScoring() {
    const gameData = useGameDataStore();
    const players = usePlayersStore();
    const tiles = useTilesStore();
    const tokens = useTokensStore();

    function calculatePoints(): PlayerPoints {

        return Object.entries(tokens.onBoardPlayerTokenIds).reduce(
            (accum: PlayerPoints, [playerId, tokenIds]) => {
                const playerTotal = sum(
                    tokenIds.map((tokenId) => gameData.tokens[tokenId].value)
                )
                accum[playerId] = playerTotal;
                return accum;
            },
            {}
        );
    }

    return { calculatePoints };
}

export { useScoring };

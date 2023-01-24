import { randFromRange } from "@/utils/rand";
import type { PlayerTokenIds } from "@/stores/game-data-store-types";

function createStagedTokenIds(playerTokensIds: PlayerTokenIds): PlayerTokenIds {
    return Object.entries(playerTokensIds).reduce((accum: PlayerTokenIds, [playerId, playerTokenIds]) => {
        accum[playerId] = [];
        while (accum[playerId].length < 6) {
            const tokenId = playerTokenIds[randFromRange(0, playerTokenIds.length - 1)];
            if (accum[playerId].includes(tokenId)) {
                continue;
            }
            accum[playerId].push(tokenId)
        } 
        return accum;
    }, {});
}

export { createStagedTokenIds };

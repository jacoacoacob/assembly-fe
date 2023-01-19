import { randFromRange } from "@/utils/rand";
import type { PlayerTokenIds } from "@/stores/data-store-types";

function createStagedTokenIds(playerTokensIds: PlayerTokenIds): PlayerTokenIds {
    return Object.entries(playerTokensIds).reduce((accum: PlayerTokenIds, [playerId, playerTokenIds]) => {
        accum[playerId] = [];
        while (accum[playerId].length < 5) {
            accum[playerId].push(playerTokenIds[randFromRange(0, playerTokenIds.length - 1)])
        } 
        return accum;
    }, {});
}

export { createStagedTokenIds };

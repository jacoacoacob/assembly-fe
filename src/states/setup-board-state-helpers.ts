import { randFromRange } from "@/utils/rand";
import type { PlayerTokens } from "@/stores/data-store-types";

function createStagedTokens(playerTokens: PlayerTokens): PlayerTokens {
    return Object.entries(playerTokens).reduce((accum: PlayerTokens, [playerId, playerTokenIds]) => {
        accum[playerId] = [];
        while (accum[playerId].length < 5) {
            accum[playerId].push(playerTokenIds[randFromRange(0, playerTokenIds.length - 1)])
        } 
        return accum;
    }, {});
}

export { createStagedTokens };

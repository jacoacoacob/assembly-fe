import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useEventsStore } from "./events.store";
import { useGameDataStore } from "./game-data.store";
import type { Tile, Token } from "./game-data.types";

/*

This store handles logic to move a token in the following ways

- pickup from reserve and drop on tile
- pickup from reserve and drop back on reserve
- pickup from tile and drop on reserve
- pickup from tile and drob back on same tile
- pickup from tile and drop on different tile 

*/

const useMoveTokenStore = defineStore("move-token", () => {
    const gameData = useGameDataStore();
    const events = useEventsStore();

    const hoveredTileIndex = ref<number | null>(null);
    
    const movingTokenId = ref<Token["id"]>("");
    
    const candidateId = ref<Token["id"]>("");
    const candidateOriginTileIndex = ref<Token["tileIndex"] | null>(null);
    const candidateDestTileIndex = ref<Token["tileIndex"] | null>(null);

    function pickup(tokenId: string) {
        const token = gameData.tokens[tokenId];
        if (!token) {
            console.warn(`[useMoveStore::pickup] No token found with id "${token}"`);
            return;
        }
        if (candidateOriginTileIndex.value === null) {
            // It's possible that a player could pick up a token, drop it, and
            // then change their mind and pick it up again and drop it somewhere
            // else. We need to store the original position of the token so that
            // it can be recorded in the commit and used to calculate the cost
            // of moving the token.
            candidateOriginTileIndex.value = token.tileIndex;
        }
        movingTokenId.value = tokenId;
        candidateId.value = tokenId;
    }


    function drop() {
        movingTokenId.value = "";
        const tokenId = candidateId.value;
        const token = gameData.tokens[tokenId];
        if (!token) {
            console.warn(`[useMoveStore::drop] No token found with id "${tokenId}"`);
            return;
        }
        if (!hoveredTileIndex.value) {
            return;
        }
        const destTileIndex = hoveredTileIndex.value;
        gameData.moveToken(tokenId, destTileIndex);
        hoveredTileIndex.value = null;
        if (candidateOriginTileIndex.value === destTileIndex) {
            candidateOriginTileIndex.value = null;
            candidateDestTileIndex.value = null;
            candidateId.value = "";
            return;
        }
        candidateDestTileIndex.value = destTileIndex;
    }

    /**
     * Compose and send appropriate events so that the token having been
     * moved is recoreded in game history.
     */
    function commit() {
        const candidateToken = gameData.tokens[candidateId.value];
        const originTileIndex = candidateOriginTileIndex.value;
        const destTileIndex = candidateDestTileIndex.value;
        if (candidateToken && originTileIndex !== null && destTileIndex !== null) {
            events.send("game_data:move_token", {
                tokenId: candidateToken.id,
                tileIndex: destTileIndex
            });
        }
        candidateId.value = "";
        candidateOriginTileIndex.value = null;
        candidateDestTileIndex.value = null;
    }

    return { pickup, drop, commit, movingTokenId, candidateId, hoveredTileIndex, candidateOriginTileIndex, candidateDestTileIndex };
    
});

export { useMoveTokenStore };

import { defineStore } from "pinia";
import { ref } from "vue";
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

    // const movingTokenId = ref<Token["id"]>("");
    const moveCandidateTokenId = ref<Token["id"]>("");

    const _candidateOriginTileIndex = ref<Token["tileIndex"] | null>(null);
    const _candidateDestTileIndex = ref<Token["tileIndex"] | null>(null);

    function pickup(tokenId: string) {
        const token = gameData.tokens[tokenId];
        if (!token) {
            console.warn(`[useMoveTokenStore::pickup] No token found with id "${token}"`);
            return;
        }
        if (_candidateOriginTileIndex.value === null) {
            // It's possible that a player could pick up a token, drop it, and
            // then change their mind and pick it up again and drop it somewhere
            // else. We need to store the original position of the token so that
            // it can be recorded in the commit and used to calculate the cost
            // of moving the token.
            _candidateOriginTileIndex.value = token.tileIndex;
        }
        moveCandidateTokenId.value = tokenId;
    }

    function drop(destTileIndex: number) {
        const tokenId = moveCandidateTokenId.value;
        const token = gameData.tokens[tokenId];
        if (!token) {
            console.warn(`[useMoveTokenStore::drop] No token found with id "${tokenId}"`);
            return;
        }
        _candidateDestTileIndex.value = destTileIndex;
        gameData.moveToken(tokenId, destTileIndex);
    }

    /**
     * Compose and send appropriate events so that the token having been
     * moved is recoreded in game history.
     */
    function commit() {
        const candidateToken = gameData.tokens[moveCandidateTokenId.value];
        const originTileIndex = _candidateOriginTileIndex.value;
        const destTileIndex = _candidateDestTileIndex.value;
        if (candidateToken && originTileIndex !== null && destTileIndex !== null) {
            if (originTileIndex === -1 && destTileIndex > -1) {
                // token started in reserve and is dropped on tile
            } else if (originTileIndex === -1 && destTileIndex === -1) {
                // token started on reserve and is dropped back on reserve
            } else if (originTileIndex > -1 && destTileIndex === -1) {
                // token started on tile and is dropped on reserve
            } else if (originTileIndex > -1 && destTileIndex > -1) {
                // token started on tile and is dropped on a tile
                if (originTileIndex === destTileIndex) {
                    // token started on tile and is dropped back on same tile
                } else {
                    // token started on tile and is dropped on a different tile
                }
            }
        }
    }

    return { pickup, drop, commit, moveCandidateTokenId };
    
});

export { useMoveTokenStore };

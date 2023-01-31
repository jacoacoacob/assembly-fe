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
        
    }

    /**
     * Compose and send appropriate events so that the token having been
     * moved is recoreded in game history.
     */
    function commit() {
        const candidateToken = gameData.tokens[moveCandidateTokenId.value];
        if (moveCandidateTokenId.value) {

        }
    }

    return { pickup, drop, commit, moveCandidateTokenId };
    
});

export { useMoveTokenStore };

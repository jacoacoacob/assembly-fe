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

    const candidateId = ref<Token["id"]>("");

    const _candidateOriginTileIndex = ref<Token["tileIndex"] | null>(null);
    const _candidateDestTileIndex = ref<Token["tileIndex"] | null>(null);

    const _hoveredTileIndex = ref<number | null>(null);

    const isHoveredTileValidMove = computed(() => {
        return true;
    });

    function pickup(tokenId: string) {
        const token = gameData.tokens[tokenId];
        if (!token) {
            console.warn(`[useMoveStore::pickup] No token found with id "${token}"`);
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
        candidateId.value = tokenId;
    }

    function hoverTile(tileIndex: number | null) {
        _hoveredTileIndex.value = tileIndex;
    }

    // function drop(destTileIndex: number) {
    function drop() {
        const tokenId = candidateId.value;
        const token = gameData.tokens[tokenId];
        if (!token) {
            console.warn(`[useMoveStore::drop] No token found with id "${tokenId}"`);
            return;
        }
        if (!_hoveredTileIndex.value) {
            return;
        }
        const destTileIndex = _hoveredTileIndex.value;
        gameData.moveToken(tokenId, destTileIndex);
        _hoveredTileIndex.value = null;
        if (_candidateOriginTileIndex.value === destTileIndex) {
            _candidateOriginTileIndex.value = null;
            _candidateDestTileIndex.value = null;
            candidateId.value = "";
            return;
        }
        _candidateDestTileIndex.value = destTileIndex;
    }

    /**
     * Compose and send appropriate events so that the token having been
     * moved is recoreded in game history.
     */
    function commit() {
        const candidateToken = gameData.tokens[candidateId.value];
        const originTileIndex = _candidateOriginTileIndex.value;
        const destTileIndex = _candidateDestTileIndex.value;
        if (candidateToken && originTileIndex !== null && destTileIndex !== null) {
            events.send("game_data:move_token", {
                tokenId: candidateToken.id,
                tileIndex: destTileIndex
            });
        }
        candidateId.value = "";
        _candidateOriginTileIndex.value = null;
        _candidateDestTileIndex.value = null;
    }

    return { pickup, hoverTile, drop, commit, candidateId, isHoveredTileValidMove };
    
});

export { useMoveTokenStore };

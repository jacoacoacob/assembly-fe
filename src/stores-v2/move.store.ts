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

    const movingTokenId = ref<Token["id"]>("");
    const candidateTokenId = ref<Token["id"]>("");

    const _candidateOriginTileIndex = ref<Token["tileIndex"] | null>(null);
    const _candidateDestTileIndex = ref<Token["tileIndex"] | null>(null);

    function pickup(tokenId: string) {

    }

    function drop(destTileIndex: number) {

    }

    /**
     * Compose and send appropriate events so that the token having been
     * moved is recoreded in game history.
     */
    function commit() {
        const candidateToken = gameData.tokens[candidateTokenId.value];
        if (candidateTokenId.value) {

        }
    }

    return { pickup, drop, commit, movingTokenId, candidateTokenId };
    
});

export { useMoveTokenStore };

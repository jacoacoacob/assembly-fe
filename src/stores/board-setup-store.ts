import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { PlayerTokenIds, Token } from "./data-store-types";
import { useGameDataStore } from "./game-data-store";

const useBoardSetupStore = defineStore("board-setup", () => {

    const gameData = useGameDataStore();

    /**
     * Before normal game play starts, each player must place `x` tokens, randomly
     * selected from their reserve, onto the board. `stagedTokens` conatins  
     * token IDs indexed by player ID.
     */
    const stagedTokens = ref<PlayerTokenIds>({});

    const activePlayerIndex = ref(0);

    // const currentPlayer = gameData.players[activePlayerIndex.value];

    function endTurn() {
        activePlayerIndex.value = activePlayerIndex.value + 1 >= gameData.players.length
            ? 0
            : activePlayerIndex.value + 1;
    }

    const unplaceableTokenIds = computed(() =>
        Object.values(gameData.tokens).reduce(
            (accum: Token["id"][], token) => {
                if (stagedTokens.value[token.player] && !stagedTokens.value[token.player].includes(token.id)) {
                    accum.push(token.id)
                }
                return accum;
            },
            []
        )
    );

    /**
     * A game starts with six tiles open for token placement.
     * 
     * If all of these initially open tiles reach capacity (each tile
     * contains 4 tokens OR the summation of token values present on
     * a tile exceeds it's `capacity`), one randomly selected, previously
     * closed will become available for token placement. This will happen
     * as many times as is required for all staged tokens to be placed on
     * the board.
     */
    const openTileIndices = computed(() => {
        const initial = [10, 13, 16, 37, 40, 43];
        return initial;
    })

    // function re

    return {
        stagedTokens,
        activePlayerIndex,
        unplaceableTokenIds,
        openTileIndices,
        endTurn,
    };
});


export { useBoardSetupStore };

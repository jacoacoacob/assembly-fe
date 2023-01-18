import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { Player, PlayerTokens, Token } from "./data-store-types";
import { useGameDataStore } from "./game-data-store";

const useSetupBoardStore = defineStore("setup-board", () => {

    const gameData = useGameDataStore();

    /**
     * Before normal game play starts, each player must place `x` tokens, randomly
     * selected from their reserve, onto the board. `stagedTokens` conatins  
     * token IDs indexed by player ID.
     */
    const stagedTokens = ref<PlayerTokens>({});

    /**
     * The ID of the player whose turn it is to place a token.
     */
    const currentPlayer = ref<Player["id"]>("");


    const remainingTokens = computed(() => Object.values(stagedTokens.value)
        .flat()
        .filter((tokenId) => gameData.tokens[tokenId].tileIndex === -1)
    );

    return { stagedTokens, currentPlayer, remainingTokens };
});

export { useSetupBoardStore };

import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { Player, PlayerTokenIds, PlayerTokens, Token } from "./data-store-types";
import { useGameDataStore } from "./game-data-store";

const useBoardSetupStore = defineStore("board-setup", () => {

    const gameData = useGameDataStore();

    /**
     * Before normal game play starts, each player must place `x` tokens, randomly
     * selected from their reserve, onto the board. `stagedTokens` conatins  
     * token IDs indexed by player ID.
     */
    const stagedTokens = ref<PlayerTokenIds>({});

    /**
     * The ID of the player whose turn it is to place a token.
     */
    const currentPlayer = ref<Player["id"]>("");

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


    const openTileIndices = computed(() => {
        const initial = [10, 13, 16, 37, 40, 43];

        return initial;
    })

    return { stagedTokens, currentPlayer, unplaceableTokenIds, openTileIndices };
});

export { useBoardSetupStore };

import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { PlayerTokenIds, Token } from "./game-data-store-types";
import { useGameDataStore } from "./game-data-store";
import { usePlayersDataStore } from "./players-data-store";

const usePlaceTokensStore = defineStore("place-tokens", () => {

    const gameData = useGameDataStore();
    const playersData = usePlayersDataStore();

    /**
     * Before normal game play starts, each player must place `x` tokens, randomly
     * selected from their reserve, onto the board. `inPlayTokens` conatins  
     * token IDs indexed by player ID.
     */
    const inPlayTokens = ref<PlayerTokenIds>({});

    const reserveTokens = computed(() => Object.entries(inPlayTokens.value).reduce(
        (accum: PlayerTokenIds, [playerId, tokenIds]) => {
            accum[playerId] = tokenIds.filter((tokenId) => gameData.tokens[tokenId].tileIndex === -1);
            return accum;
        },
        {}
    ))

    const activePlayerIndex = ref(0);

    function nextPlayer() {
        activePlayerIndex.value = activePlayerIndex.value + 1 >= gameData.players.length
            ? 0
            : activePlayerIndex.value + 1;
    }

    const unplaceableTokenIds = computed(() =>
        Object.values(gameData.tokens).reduce(
            (accum: Token["id"][], token) => {
                if (inPlayTokens.value[token.player] && !inPlayTokens.value[token.player].includes(token.id)) {
                    accum.push(token.id)
                }
                return accum;
            },
            []
        )
    );

    const inPlayTiles = ref([10, 13, 16, 37, 40, 43]);

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
    const openTiles = computed(() => {
        return inPlayTiles.value.filter((tileIndex) => gameData.openTiles.includes(tileIndex));
    });

    const candidateToken = ref("");

    const isTurnEndable = computed((): boolean => {
        const candidate = gameData.tokens[candidateToken.value];
        return (
            Boolean(candidate) &&
            candidate.player === playersData.activePlayer.id &&
            candidate.tileIndex > -1
        );
    });
    

    return {
        inPlayTokens,
        reserveTokens,
        activePlayerIndex,
        unplaceableTokenIds,
        inPlayTiles,
        isTurnEndable,
        candidateToken,
        openTiles,
        nextPlayer,
    };
});


export { usePlaceTokensStore };

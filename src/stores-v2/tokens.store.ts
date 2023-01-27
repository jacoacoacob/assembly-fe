import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useGameDataStore } from "./game-data.store";
import type { Token } from "./game-data.types";
import { useTilesStore } from "./tiles.store";
import type { PlayerTokenIds, PlayerTokenIdsByTokenValue } from "./tokens.types";

const useTokensStore = defineStore("tokens", () => {
    const gameData = useGameDataStore();
    const tiles = useTilesStore();

    const candidateId = ref("");

    const inPlayTokenIds = ref<Token["id"][]>([]);

    const playerTokenIds = computed(() =>
        Object.values(gameData.tokens).reduce((accum: PlayerTokenIds, token) => {
            if (!accum[token.playerId]) {
                accum[token.playerId] = [];
            }
            accum[token.playerId].push(token.id);
            return accum;
        }, {})
    );


    const reserveTokenIds = computed(() =>
        Object.keys(gameData.tokens).filter((tokenId) => gameData.tokens[tokenId].tileIndex === -1)
    );

    const reservePlayerTokenIds = computed(() =>
        Object.entries(playerTokenIds.value).reduce(
            (accum: PlayerTokenIds, [playerId, tokenIds]) => {
                accum[playerId] = tokenIds.filter(
                    (tokenId) => gameData.tokens[tokenId].tileIndex === -1
                );
                return accum;
            },
            {}
        )
    );

    /**
     * tokenId lists indexed by playerId containing tokenIds of tokens
     * that could be placed on at least one in-play tile.
     */
    const availableReservePlayerTokenIds = computed(() => 
        Object.entries(reservePlayerTokenIds.value).reduce(
            (accum: PlayerTokenIds, [playerId, reserveTokenIds]) => {
                accum[playerId] = reserveTokenIds.filter(
                    (tokenId) => tiles.openInPlayTiles.some(
                        (tileIndex) => tiles.isValidMove(tileIndex, tokenId)
                    )
                );
                return accum;
            },
            {}
        )
    );

    const reservePlayerTokenIdsByTokenValue = computed(() =>
        reserveTokenIds.value.reduce((accum: PlayerTokenIdsByTokenValue, tokenId) => {
            const token = gameData.tokens[tokenId];
            if (!accum[token.playerId]) {
                accum[token.playerId] = {};
            }
            if (!accum[token.playerId][token.value]) {
                accum[token.playerId][token.value] = [];
            }
            accum[token.playerId][token.value].push(token.id);
            return accum;
        }, {})
    );

    return {
        candidateId,
        inPlayTokenIds,
        playerTokenIds,
        availableReservePlayerTokenIds,
        reserveTokenIds,
        reservePlayerTokenIds,
        reservePlayerTokenIdsByTokenValue,
    };
});

export { useTokensStore };

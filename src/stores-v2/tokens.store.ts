import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useGameDataStore } from "./game-data.store";
import type { Token } from "./game-data.types";
import { useMoveValidationStore } from "./move-validation.store";
import { useSettingsStore } from "./settings.store";
import { useTilesStore } from "./tiles.store";
import type { PlayerTokenIds, PlayerTokenIdsByTokenValue } from "./tokens.types";

function useAgingTokens() {
    const settings = useSettingsStore();

    const tokenAges = ref<Record<Token["id"], number>>({});

    function isTokenMature(tokenId: string) {
        return (tokenAges.value[tokenId] ?? 0) >= settings.matureTokenAge;
    }

    /**
     * 
     * Call this for a token that assists in a place_token action when
     * the action is committed.
     */
    function setTokenAge(tokenId: string, age: number) {
        tokenAges.value[tokenId] = age;
    }

    /**
     * 
     * Call this when a remove_token action is committed.
     */
    function deleteTokenAge(tokenId: string) {
        delete tokenAges.value[tokenId];
    }

    /**
     * 
     * Call this once per round-completion.
     * @param onBoardTokenIds the IDs of every token on the board during round-completion.
     */
    function updateAgingTokens(onBoardTokenIds: Token["id"][]) {
        onBoardTokenIds.forEach((tokenId) => {
            tokenAges.value[tokenId] = (tokenAges.value[tokenId] ?? 0) + 1;
        });
        Object.keys(tokenAges.value).forEach((tokenId) => {
            if (!onBoardTokenIds.includes(tokenId)) {
                deleteTokenAge(tokenId);
            }
        });
    }

    return {
        setTokenAge,
        deleteTokenAge,
        updateAgingTokens,
        tokenAges,
        isTokenMature
    };
}

const useTokensStore = defineStore("tokens", () => {
    const gameData = useGameDataStore();
    const tiles = useTilesStore();
    const validation = useMoveValidationStore();

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

    function getOnBoardTokenIds() {
        return Object.keys(gameData.tokens).filter(
            (tokenId) => gameData.tokens[tokenId].tileIndex > -1
        );
    }

    const reserveTokenIds = computed(() =>
        Object.keys(gameData.tokens).filter((tokenId) => gameData.tokens[tokenId].tileIndex === -1)
    );

    const reservePlayerTokenIds = computed((): PlayerTokenIds =>
        Object.entries(playerTokenIds.value).reduce(
            (accum: PlayerTokenIds, [playerId, tokenIds]) => {
                accum[playerId] = tokenIds.filter(
                    (tokenId) => reserveTokenIds.value.includes(tokenId)
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
    const inPlayReservePlayerTokenIds = computed(() => 
        Object.entries(reservePlayerTokenIds.value).reduce(
            (accum: PlayerTokenIds, [playerId, reserveTokenIds]) => {
                accum[playerId] = reserveTokenIds.filter(
                    (tokenId) => (
                        inPlayTokenIds.value.includes(tokenId) &&
                        tiles.openInPlayTiles.some(
                            (tileIndex) => validation.isValidMove(tokenId, tileIndex)
                        )
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
            if (inPlayTokenIds.value.includes(token.id)) {
                accum[token.playerId][token.value].push(token.id);
            } else {
                accum[token.playerId][token.value].unshift(token.id);
            }
            return accum;
        }, {})
    );

    return {
        ...useAgingTokens(),
        inPlayTokenIds,
        playerTokenIds,
        inPlayReservePlayerTokenIds,
        getOnBoardTokenIds,
        reserveTokenIds,
        reservePlayerTokenIds,
        reservePlayerTokenIdsByTokenValue,
    };
});

export { useTokensStore };

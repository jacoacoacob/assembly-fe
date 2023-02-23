import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useGameDataStore } from "./game-data.store";
import type { Token } from "./game-data.types";
import { useMoveValidationStore } from "./move-validation.store";
import { useSettingsStore } from "./settings.store";
import { useTilesStore } from "./tiles.store";
import type { PlayerTokenIds, PlayerTokenIdsByTokenValue } from "./tokens.types";

function useMatureTokens() {
    const settings = useSettingsStore();

    const _maturingTokens = ref<Record<Token["id"], number>>({});

    const matureTokenIds = ref<Token["id"][]>([]);

    function updateMatureTokenIds(onBoardTokenIds: Token["id"][]) {
        onBoardTokenIds.forEach((tokenId) => {
            _maturingTokens.value[tokenId] = _maturingTokens.value[tokenId] ?? 0 + 1;
        });
        Object.keys(_maturingTokens.value).forEach((tokenId) => {
            if (!onBoardTokenIds.includes(tokenId)) {
                delete _maturingTokens.value[tokenId];
            }
        });
        matureTokenIds.value = Object.entries(_maturingTokens.value).reduce(
            (accum: Token["id"][], [tokenId, age]) => {
                if (age >= settings.matureTokenAge) {
                    accum.push(tokenId);
                }
                return accum;
            },
            []
        );
    }

    return { updateMatureTokenIds, matureTokenIds };
}

const useTokensStore = defineStore("tokens", () => {
    const gameData = useGameDataStore();
    const tiles = useTilesStore();
    const validation = useMoveValidationStore();

    const inPlayTokenIds = ref<Token["id"][]>([]);

    const { matureTokenIds, updateMatureTokenIds } = useMatureTokens();

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

    // const onBoardTokenIds = computed(() =>
    //     Object.keys(gameData.tokens).filter((tokenId) => gameData.tokens[tokenId].tileIndex > -1)
    // );

    // const onBoardPlayerTokenIds = computed((): PlayerTokenIds =>
    //     Object.entries(playerTokenIds.value).reduce(
    //         (accum: PlayerTokenIds, [playerId, tokenIds]) => {
    //             accum[playerId] = tokenIds.filter(
    //                 (tokenId) => onBoardTokenIds.value.includes(tokenId)
    //             )
    //             return accum;
    //         },
    //         {}
    //     )
    // );

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
        // candidateTokenId,
        // draggedTokenId,
        matureTokenIds,
        updateMatureTokenIds,
        inPlayTokenIds,
        playerTokenIds,
        inPlayReservePlayerTokenIds,
        getOnBoardTokenIds,
        // onBoardTokenIds,
        // onBoardPlayerTokenIds,
        reserveTokenIds,
        reservePlayerTokenIds,
        reservePlayerTokenIdsByTokenValue,
    };
});

export { useTokensStore };

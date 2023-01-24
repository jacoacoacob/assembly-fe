import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { useGameStateStore } from "./game-state-store";
import { useGameDataStore } from "./game-data-store";
import { usePlaceTokensStore } from "./place-tokens-store";
import type { ReserveTokens, Token } from "./game-data-store-types";

interface TokensData {
    reserveTokens: ReserveTokens;
    unplaceableTokenIds: Token["id"][];
}

const useTokensDataStore = defineStore("tokens-data", () => {
    const gameState = useGameStateStore();
    const gameData = useGameDataStore();
    const placeTokensStore = usePlaceTokensStore();

    const reserveTokens = computed(() => gameData.reserveTokens);

    if (gameState.currentState === "place_tokens") {
        return {
            reserveTokens: computed(() => Object.entries(reserveTokens.value).reduce(
                (accum: ReserveTokens, [playerId, tokens]) => {
                    accum[playerId] = Object.entries(tokens).reduce(
                        (accum: ReserveTokens[string], [tokenValue, tokens]) => {
                            accum[Number.parseInt(tokenValue)] = tokens.sort(
                                (a, _b) => placeTokensStore.unplaceableTokenIds.includes(a.id) ? -1 : 1
                            );
                            return accum;
                        },
                        {}
                    );
                    return accum;
                },
                {}
            )),
            unplaceableTokenIds: computed(() => placeTokensStore.unplaceableTokenIds),
        } as unknown as TokensData;
    }

    if (gameState.currentState === "play_game") {
        return {
            reserveTokens,
            // during play_game, a token may be unplaceable if
            // there is no tile open on the board with sufficient
            // space to hold a token of a given value.
            unplaceableTokenIds: ref([]),
        } as unknown as TokensData
    }

    return {
        reserveTokens,
        unplaceableTokenIds: ref([]),
    } as unknown as TokensData;

});

export { useTokensDataStore };

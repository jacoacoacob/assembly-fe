import { computed, ref, type ToRefs } from "vue";

import { useGameDataStore } from "@/stores/game-data-store";
import { useGameStateStore } from "@/stores/game-state-store";
import { usePlaceTokensStore } from "@/stores/place-tokens-store";
import type { ReserveTokens, Token } from "@/stores/game-data-store-types";

interface TokenReserveData {
    tokens: ReserveTokens;
    unplaceableTokenIds: Token["id"][];
}

function useTokenReserve(): ToRefs<TokenReserveData> {
    const gameState = useGameStateStore();
    const gameData = useGameDataStore();
    const placeTokensStore = usePlaceTokensStore();

    const tokens = computed(() => gameData.reserveTokens);

    if (gameState.currentState === "place_tokens") {
        return {
            tokens,
            unplaceableTokenIds: computed(() => placeTokensStore.unplaceableTokenIds),
        };
    }

    if (gameState.currentState === "play_game") {
        return {
            tokens,
            // during play_game, a token may be unplaceable if
            // there is no tile open on the board with sufficient
            // space to hold a token of a given value.
            unplaceableTokenIds: ref([]),
        }
    }

    return {
        tokens,
        unplaceableTokenIds: ref([]),
    };
}

export { useTokenReserve };

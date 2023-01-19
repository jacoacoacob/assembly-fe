import { computed, ref, type ToRefs } from "vue";

import { useGameDataStore } from "@/stores/game-data-store";
import { useGameStateStore } from "@/stores/game-state-store";
import { useBoardSetupStore } from "@/stores/board-setup-store";
import type { ReserveTokens, Token } from "@/stores/data-store-types";

interface TokenReserveData {
    tokens: ReserveTokens;
    unplaceableTokenIds: Token["id"][];
}

function useTokenReserve(): ToRefs<TokenReserveData> {
    const gameState = useGameStateStore();
    const gameData = useGameDataStore();
    const boardSetup = useBoardSetupStore();

    const tokens = computed(() => gameData.reserveTokens);

    if (gameState.currentState === "setup_board") {
        return {
            tokens,
            unplaceableTokenIds: computed(() => boardSetup.unplaceableTokenIds),
        };
    }

    if (gameState.currentState === "game_play") {
        return {
            tokens,
            // during game_play, a token may be unplaceable if
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

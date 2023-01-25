import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useGameDataStore } from "./game-data.store";
import type { Token } from "./game-data.types";
import { useGameStateStore } from "./game-state.store";

const useTokensStore = defineStore("tokens", () => {

    const gameState = useGameStateStore();
    const gameData = useGameDataStore();

    const candidateId = ref("");

    const unplaceableTokenIds = ref<Token["id"][]>([]);

    /**
     * 

     */
    function isPlaceable(tokenId: Token["id"]) {
        return !unplaceableTokenIds.value.includes(tokenId);
    }

    const playerReserves = computed(() => {

        if (gameState.currentState === "setup") {

        }
    });

    return { candidateId, unplaceableTokenIds, playerReserves };
});

export { useTokensStore };

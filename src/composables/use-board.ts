import { computed, ref } from "vue"
import type { ToRefs, Ref } from "vue";

import { useGameDataStore } from "@/stores/game-data-store";
import { useGameStateStore } from "@/stores/game-state-store";
import { useBoardSetupStore } from "@/stores/board-setup-store";
import type { Game, Tile } from "@/stores/game-data-store-types";

interface BoardData {
    openTileIndices: Ref<number[]>;
    isTileOpen: (tileIndex: number) => boolean;
}

function useBoard(): BoardData {
    const gameState = useGameStateStore();
    const gameData = useGameDataStore();
    const boardSetup = useBoardSetupStore();

    if (gameState.currentState === "setup_board") {
        return {
            openTileIndices: computed(() => boardSetup.openTileIndices),
            isTileOpen(tileIndex) {
                return boardSetup.openTileIndices.includes(tileIndex)
                // return 
            }
        };
    }

    if (gameState.currentState === "play_game") {
        return {
            openTileIndices: ref([]),
            isTileOpen(tileIndex) {
                return true
            }
        }
    }

    return {
        openTileIndices: ref([]),
        isTileOpen(tileIndex) {
            return true
        }
    }
}

export { useBoard }
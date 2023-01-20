import { computed, ref } from "vue"
import type { ToRefs, Ref } from "vue";

import { useGameDataStore } from "@/stores/game-data-store";
import { useGameStateStore } from "@/stores/game-state-store";
import { useBoardSetupStore } from "@/stores/board-setup-store";
import type { Game, Tile } from "@/stores/game-data-store-types";
import { sum } from "@/utils/sum";

interface BoardData {
    openTileIndices: Ref<number[]>;
    isTileOpen: (tileIndex: number, tokenId?: string) => boolean;
}

function useBoard(): BoardData {
    const gameState = useGameStateStore();
    const gameData = useGameDataStore();
    const boardSetup = useBoardSetupStore();

    function _isTileOpen(openTileIndices: number[], tileIndex: number, tokenId?: string) {
        const isNotFull = openTileIndices.includes(tileIndex);
        if (typeof tokenId === "string") {
            const token = gameData.tokens[tokenId];
            const tile = gameData.tiles[tileIndex];
            const tileTokenValues = gameData.board[tileIndex].map((tokenId) => gameData.tokens[tokenId].value);
            return isNotFull && sum(tileTokenValues) + token.value <= tile.capacity;
        }
        return isNotFull;
    }

    if (gameState.currentState === "setup_board") {
        return {
            openTileIndices: computed(() => boardSetup.openTileIndices),
            isTileOpen(tileIndex, tokenId) {
                return _isTileOpen(boardSetup.filteredOpenTileIndices, tileIndex, tokenId);
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
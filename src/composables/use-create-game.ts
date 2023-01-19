import { nextTick } from "vue";
import { useGameStateStore } from "@/stores/game-state-store";
import type { Player } from "@/stores/data-store-types";
import { useGameDataStore } from "@/stores/game-data-store";
import { createTokens, createGrid, createTiles } from "@/states/initial-state-helpers";
import { createStagedTokenIds } from "@/states/board-setup-state-helpers";

function useCreateGame() {
    const gameState = useGameStateStore();
    const gameData = useGameDataStore();

    return (name: string, players: Player[]) => {
        gameState.pushEvent("initial:set_name", name);
        gameState.pushEvent("initial:set_players", players);
        gameState.pushEvent("initial:set_tokens", createTokens(players));
        gameState.pushEvent("initial:set_grid", createGrid(6, 9, 90));
        gameState.pushEvent("initial:set_tiles", createTiles(6, 9, [5, 15]));
        gameState.pushEvent("initial:finish");
        nextTick(() => {
            gameState.pushEvent(
                "setup_board:set_staged_tokens",
                createStagedTokenIds(gameData.reserveTokenIds)
            );
        });
    }
}

export { useCreateGame };

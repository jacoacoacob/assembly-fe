import { nextTick } from "vue";
import { useGameStateStore } from "@/stores/game-state-store";
import type { Player } from "@/stores/data-store-types";
import { useGameDataStore } from "@/stores/game-data-store";
import { createTokens, createGrid, createTiles } from "@/states/initial-state-helpers";
import { createStagedTokens } from "@/states/setup-board-state-helpers";

function useCreateGame() {
    const gameState = useGameStateStore();
    const gameData = useGameDataStore();

    return (name: string, players: Player[]) => {
        gameState.pushEvent({ type: "set_name", data: name });
        gameState.pushEvent({ type: "set_players", data: players });
        gameState.pushEvent({ type: "set_tokens", data: createTokens(players) });
        gameState.pushEvent({ type: "set_grid", data: createGrid(6, 9, 90) });
        gameState.pushEvent({ type: "set_tiles", data: createTiles(6, 9, [5, 15]) })
        gameState.pushEvent({ type: "finish", data: null });
        nextTick(() => {
            gameState.pushEvent({
                type: "set_staged_tokens",
                data: createStagedTokens(gameData.tokenReserves)
            });
        });
    }
}

export { useCreateGame };

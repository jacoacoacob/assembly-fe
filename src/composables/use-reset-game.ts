import { useGameDataStore } from "@/stores-v2/game-data.store";
import { useGameStateStore } from "@/stores-v2/game-state.store";
import { useSeasonsStore } from "@/stores-v2/seasons.store";

function useResetGame() {
    const gameData = useGameDataStore();
    const gameState = useGameStateStore();
    const seasons = useSeasonsStore();

    return () => {
        gameData.name = "";
        gameData.history = [];
        gameData.grid = { rows: 0, cols: 0, tileSize: 0 };
        gameData.tokens = {}
        gameData.tiles = [];
        gameData.ts_updated = new Date().toISOString();
    
        gameState.currentState = "new_game";
    
        seasons.currentIndex = 0;
    }
}

export { useResetGame };

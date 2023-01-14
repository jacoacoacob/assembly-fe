import { save } from "@/storage";
import { useGameStore } from "@/stores/game.store";

function saveGame() {
    const { history, name, players } = useGameStore();
    if (name) {
        save(name, { history, name, players, ts_updated: new Date().toISOString() });
    }
}

export { saveGame };
